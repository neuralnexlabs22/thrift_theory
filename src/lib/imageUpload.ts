import imageCompression from 'browser-image-compression';

export type AdminUploadBucket =
  | "product-images"
  | "category-images"
  | "brand-logos"
  | "brand-banners"
  | "clothing-mockups"
  | "bundle-images"
  | "custom-designs";

export async function uploadAdminImage(
  file: File,
  bucket: AdminUploadBucket,
  folder: string
): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const path = `${folder}/${fileName}`;

  // Compress image to prevent Vercel 4.5MB limits and upload timeouts
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.warn("Image compression failed, using original file:", error);
  }

  const formData = new FormData();
  formData.append("bucket", bucket);
  formData.append("path", path);
  formData.append("file", compressedFile);


  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  let body;
  try {
    body = await response.json();
  } catch (err) {
    throw new Error("Server returned invalid response. Try uploading a smaller image.");
  }

  if (!response.ok) {
    throw new Error(body?.error || "Upload failed");
  }

  return body.publicUrl as string;
}

export async function uploadAdminRemoteUrl(
  url: string,
  bucket: AdminUploadBucket,
  folder: string
): Promise<string> {
  const fileName = `${Date.now()}-${url.split("/").pop() || "remote"}`;
  const path = `${folder}/${fileName}`;

  const formData = new FormData();
  formData.append("bucket", bucket);
  formData.append("path", path);
  formData.append("url", url);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Upload failed");
  }

  return body.publicUrl as string;
}
