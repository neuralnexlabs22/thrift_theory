import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// force-dynamic ensures this route is never statically analyzed at build time
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Initialize inside handler so env vars are available at runtime, not build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const formData = await request.formData();
    const bucket = formData.get("bucket") as string;
    const path = formData.get("path") as string;
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!bucket || !path) {
      return NextResponse.json(
        { error: "Missing bucket or path" },
        { status: 400 }
      );
    }

    let uploadData;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, {
          contentType: file.type || "image/png",
          upsert: true,
        });

      if (error) throw error;
      uploadData = data;
    } else if (url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch remote image");

      const contentType = response.headers.get("content-type") || "image/png";
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, {
          contentType,
          upsert: true,
        });

      if (error) throw error;
      uploadData = data;
    } else {
      return NextResponse.json(
        { error: "Missing file or url" },
        { status: 400 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
