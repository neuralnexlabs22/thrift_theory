"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadAdminImage, uploadAdminRemoteUrl } from "@/lib/imageUpload";
import { ArrowLeft, Save, Upload, X, Loader, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  
  const [loading, setLoading] = useState(false);
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

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" as "success" | "error" });
    
    if (!formData.name.trim() || !formData.price || !formData.itemsCount) {
      setMessage({ text: "Name, price, and items count are required.", type: "error" });
      return;
    }

    setSaving(true);
    const validImages = imageUrls.filter((url) => url.trim() !== "");
    const mainImage = validImages.length > 0 ? validImages[0] : "/images/mystery_bundle_box.png";

    const { error: insertError } = await supabase.from("bundles").insert({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      items_count: parseInt(formData.itemsCount),
      image_url: mainImage,
      images: validImages,
      sizes: formData.sizes,
      colors: formData.colors,
      is_active: formData.isActive
    });
    
    if (insertError) {
      setMessage({ text: insertError.message, type: "error" });
      setSaving(false);
    } else {
      setMessage({ text: "✓ Bundle added successfully!", type: "success" });
      setTimeout(() => router.push("/admin/bundles"), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/bundles" className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-serif">Add Bundle</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Create a new mystery bundle for your customers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/bundles" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-colors border border-white/10">
            Cancel
          </Link>
          <button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 bg-[var(--accent-1)] text-black px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-50 transition-all">
            {saving ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Bundle</>}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {/* Main Layout */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Bundle Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. 5 Shirts Bundle" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} placeholder="Describe what's in the bundle..." className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* Pricing & Quantity */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" placeholder="0.00" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Items Count *</label>
                <input type="number" name="itemsCount" value={formData.itemsCount} onChange={handleInputChange} required min="1" placeholder="e.g. 5" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Available Sizes</label>
                <div className="flex gap-2">
                  <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(sizeInput, setSizeInput, "sizes"))} placeholder="e.g. L, XL, XXL" className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
                  <button type="button" onClick={() => addTag(sizeInput, setSizeInput, "sizes")} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">Add</button>
                </div>
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.sizes.map((size) => (
                      <span key={size} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                        {size}
                        <button type="button" onClick={() => removeTag(size, "sizes")} className="text-zinc-400 hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Available Colors</label>
                <div className="flex gap-2">
                  <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(colorInput, setColorInput, "colors"))} placeholder="e.g. Black, White" className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
                  <button type="button" onClick={() => addTag(colorInput, setColorInput, "colors")} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">Add</button>
                </div>
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.colors.map((color) => (
                      <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-1)] text-sm">
                        {color}
                        <button type="button" onClick={() => removeTag(color, "colors")} className="text-[var(--accent-1)] hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Images & Status */}
        <div className="space-y-6">
          
          {/* Images */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Images</h2>
              <span className="text-xs text-zinc-500">{imageUrls.filter(u => u.trim() !== "").length} / 5</span>
            </div>

            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    {index === 0 ? "Main Image (Cover) *" : `Gallery Image ${index}`}
                  </div>
                  
                  {imagePreviews[index] && (
                    <div className="relative w-full aspect-square bg-black border border-white/10 rounded-xl overflow-hidden mb-2 group">
                      <img src={imagePreviews[index]} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => {
                          const newUrls = [...imageUrls]; newUrls[index] = ""; setImageUrls(newUrls);
                          const newPreviews = [...imagePreviews]; newPreviews[index] = ""; setImagePreviews(newPreviews);
                        }} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!imagePreviews[index] && (
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex flex-col items-center justify-center gap-2 w-full aspect-video border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[var(--accent-1)] hover:bg-white/5 transition-all bg-black"
                    >
                      {uploadingImages[index] ? (
                        <><Loader className="w-5 h-5 animate-spin text-[var(--accent-1)]" /><span className="text-xs text-zinc-500">Uploading...</span></>
                      ) : (
                        <><Upload className="w-5 h-5 text-zinc-600" /><span className="text-xs text-zinc-500">Drop image here</span></>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(index, e.target.files[0]); }} disabled={uploadingImages[index]} className="hidden" />
                    </label>
                  )}

                  <input type="text" value={imageUrls[index]} onChange={(e) => handleImageUrlChange(index, e.target.value)} placeholder="Or paste image URL" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Status</h2>
            
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors bg-black">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 rounded border-white/20 accent-[var(--accent-1)]" />
              <span className="text-sm text-white font-medium">Active / Published</span>
            </label>
          </div>

        </div>

        <div className="lg:col-span-3 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[var(--accent-1)] text-black font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Bundle
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
