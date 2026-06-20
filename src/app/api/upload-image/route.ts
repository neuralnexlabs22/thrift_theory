import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Make sure to use the SERVICE ROLE KEY so the backend can upload to buckets without RLS issues.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const bucket = formData.get("bucket") as string;
    const path = formData.get("path") as string;
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!bucket || !path) {
      return NextResponse.json({ error: "Missing bucket or path" }, { status: 400 });
    }

    let uploadData;

    if (file) {
      // Direct file upload
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
      // Upload from remote URL
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
      return NextResponse.json({ error: "Missing file or url" }, { status: 400 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
