"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadAdminImage, uploadAdminRemoteUrl } from "@/lib/imageUpload";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload, X, Loader, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function convertGoogleDriveUrl(url: string): string {
  const trimmed = url.trim();
  const fileDRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match1 = trimmed.match(fileDRegex);
  if (match1 && match1[1]) return `https://docs.google.com/uc?export=view&id=${match1[1]}`;
  const openIdRegex = /[drive|docs]\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const match2 = trimmed.match(openIdRegex);
  if (match2 && match2[1]) return `https://docs.google.com/uc?export=view&id=${match2[1]}`;
  const docsDRegex = /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match3 = trimmed.match(docsDRegex);
  if (match3 && match3[1]) return `https://docs.google.com/uc?export=view&id=${match3[1]}`;
  return trimmed;
}

export default function AddBundlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" as "success" | "error" });
  const [uploadingImages, setUploadingImages] = useState<boolean[]>(new Array(5).fill(false));

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    itemsCount: "1",
    isActive: true,
    colors: [] as string[],
    sizes: [] as string[],
  });

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", "", ""]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", "", "", ""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const converted = convertGoogleDriveUrl(url);
    const newUrls = [...imageUrls];
    newUrls[index] = converted;
    setImageUrls(newUrls);
    if (converted.startsWith("http") || converted.startsWith("/")) {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = converted;
      setImagePreviews(newPreviews);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-[var(--accent-1)]", "bg-white/5");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[var(--accent-1)]", "bg-white/5");
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[var(--accent-1)]", "bg-white/5");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        await handleImageUpload(index, file);
      } else {
        setMessage({ text: "Please drop an image file", type: "error" });
      }
      return;
    }

    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (url) {
      handleImageUrlChange(index, url);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please upload an image file", type: "error" });
      return;
    }

    const uploadingStates = [...uploadingImages];
    uploadingStates[index] = true;
    setUploadingImages(uploadingStates);

    try {
      const publicUrl = await uploadAdminImage(file, "bundle-images", "bundles");
      const newUrls = [...imageUrls];
      newUrls[index] = publicUrl;
      setImageUrls(newUrls);

      const newPreviews = [...imagePreviews];
      newPreviews[index] = publicUrl;
      setImagePreviews(newPreviews);

      setMessage({ text: "✓ Image uploaded successfully", type: "success" });
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Unknown error";
      setMessage({ text: `Upload failed: ${errorText}`, type: "error" });
    } finally {
      const resetStates = new Array(5).fill(false);
      setUploadingImages(resetStates);
    }
  };

  const addTag = (input: string, setter: React.Dispatch<React.SetStateAction<string>>, field: "colors" | "sizes") => {
    const val = input.trim();
    if (val && !formData[field].includes(val)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], val],
      }));
      setter("");
    }
  };

  const removeTag = (value: string, field: "colors" | "sizes") => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value),
    }));
  };

  const normalizePriceValue = (value: string) => {
    const cleaned = value.trim().replace(/[^\d.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" as "success" | "error" });
    
    if (!formData.name.trim() || !formData.price || !formData.itemsCount) {
      setMessage({ text: "Name, price, and items count are required.", type: "error" });
      return;
    }

    setSaving(true);
    if (!supabase) return;
    
    try {
      const validImages = imageUrls.filter((url) => url.trim() !== "");
      const mainImage = validImages.length > 0 ? validImages[0] : "/images/mystery_bundle_box.png";
      const price = normalizePriceValue(formData.price);

      const { error: insertError } = await supabase.from("bundles").insert({
        name: formData.name,
        description: formData.description,
        price,
        items_count: parseInt(formData.itemsCount),
        image_url: mainImage,
        images: validImages,
        sizes: formData.sizes,
        colors: formData.colors,
        is_active: formData.isActive
      });
      
      if (insertError) {
        throw insertError;
      }
      
      setMessage({ text: "✓ Bundle added successfully!", type: "success" });
      setTimeout(() => router.push("/admin/bundles"), 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/bundles"
          className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-serif">
            Add Bundle
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Create a new mystery bundle for your customers
          </p>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${
          message.type === "success"
            ? "bg-green-500/10 border-green-500 text-green-400"
            : "bg-red-500/10 border-red-500 text-red-400"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Basic Information</h3>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Bundle Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. 5 Shirts Mystery Bundle"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detailed bundle description with features and benefits..."
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Pricing & Capacity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                required
                min="0"
                step="0.01"
                placeholder="999"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
                Items Count *
              </label>
              <input
                type="number"
                name="itemsCount"
                value={formData.itemsCount}
                onChange={handleInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                required
                min="1"
                placeholder="5"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bundle Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Bundle Images</h3>
          <p className="text-xs text-zinc-400">Upload images or paste image URLs (up to 5)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs text-zinc-500 font-medium">
                  {index === 0 ? "Main Image" : `Image ${index + 1}`}
                  {index < 2 && <span className="text-[var(--accent-1)] ml-1">*</span>}
                </div>

                {/* Preview */}
                {imagePreviews[index] && (
                  <div className="relative w-full h-32 bg-black border border-white/10 rounded-lg overflow-hidden">
                    <img
                      src={imagePreviews[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newUrls = [...imageUrls];
                        newUrls[index] = "";
                        setImageUrls(newUrls);
                        const newPreviews = [...imagePreviews];
                        newPreviews[index] = "";
                        setImagePreviews(newPreviews);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 rounded text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* URL Input */}
                <input
                  type="text"
                  value={imageUrls[index]}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="Paste image URL or upload below"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const url = imageUrls[index];
                      if (!url) return setMessage({ text: "No URL to import", type: "error" });
                      try {
                        setUploadingImages((s) => {
                          const copy = [...s];
                          copy[index] = true;
                          return copy;
                        });
                        const publicUrl = await uploadAdminRemoteUrl(url, "bundle-images", "bundles");
                        const newUrls = [...imageUrls];
                        newUrls[index] = publicUrl;
                        setImageUrls(newUrls);
                        const newPreviews = [...imagePreviews];
                        newPreviews[index] = publicUrl;
                        setImagePreviews(newPreviews);
                        setMessage({ text: "✓ Image imported to storage", type: "success" });
                      } catch (err) {
                        setMessage({ text: `Import failed: ${err instanceof Error ? err.message : String(err)}`, type: "error" });
                      } finally {
                        setUploadingImages((s) => {
                          const copy = [...s];
                          copy[index] = false;
                          return copy;
                        });
                      }
                    }}
                    className="px-3 py-2 bg-[var(--accent-1)] rounded text-black text-xs font-medium hover:brightness-105 transition-all"
                  >
                    Import URL
                  </button>
                  <span className="text-xs text-zinc-500 self-center">or upload below</span>
                </div>

                {/* Upload */}
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-white/20 rounded-lg px-3 py-2 cursor-pointer hover:border-[var(--accent-1)] hover:bg-white/5 transition-all"
                >
                  {uploadingImages[index] ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-[var(--accent-1)]" />
                      <span className="text-xs text-zinc-400">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-400">Upload Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(index, e.target.files[0]);
                      }
                    }}
                    disabled={uploadingImages[index]}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Variants Options</h3>

          {/* Sizes */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.sizes.map((size) => (
                <span
                  key={size}
                  className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg font-medium"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeTag(size, "sizes")}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(sizeInput, setSizeInput, "sizes");
                  }
                }}
                placeholder="Type size and press Enter (e.g. M, L, XL)"
                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => addTag(sizeInput, setSizeInput, "sizes")}
                className="px-4 py-3 bg-[var(--accent-1)] text-black rounded-lg font-bold hover:brightness-110 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Colors
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map((color) => (
                <span
                  key={color}
                  className="flex items-center gap-1.5 text-xs bg-[var(--accent-1)]/10 text-[var(--accent-1)] px-3 py-1.5 rounded-lg font-medium"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeTag(color, "colors")}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(colorInput, setColorInput, "colors");
                  }
                }}
                placeholder="Type color and press Enter (e.g. Black, White)"
                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => addTag(colorInput, setColorInput, "colors")}
                className="px-4 py-3 bg-[var(--accent-1)] text-black rounded-lg font-bold hover:brightness-110 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-white/20 accent-[var(--accent-1)]"
              />
              <span className="text-sm text-white font-medium">Active / Published</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[var(--accent-1)] text-black font-black uppercase tracking-widest text-sm px-6 py-4 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Add Bundle
            </>
          )}
        </button>
      </form>
    </div>
  );
}
