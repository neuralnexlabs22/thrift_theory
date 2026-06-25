"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Plus, Trash2, Save, Upload, Loader, X, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadAdminImage, uploadAdminRemoteUrl } from "@/lib/imageUpload";

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

export default function BundleManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [activeTab, setActiveTab] = useState<"products" | "edit">("products");

  const [bundle, setBundle] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [bundleProducts, setBundleProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    itemsCount: "1",
    isActive: true,
    colors: [] as string[],
    sizes: [] as string[],
  });

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", "", ""]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", "", "", ""]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>(new Array(5).fill(false));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" as "success" | "error" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch bundle
    const { data: bData } = await supabase.from("bundles").select("*").eq("id", id).single();
    if (bData) {
      setBundle(bData);
      setFormData({
        name: bData.name || "",
        description: bData.description || "",
        itemsCount: bData.items_count?.toString() || "1",
        isActive: bData.is_active,
        colors: bData.colors || [],
        sizes: bData.sizes || [],
      });
      
      const imgs = bData.images || [];
      const newUrls = ["", "", "", "", ""];
      const newPreviews = ["", "", "", "", ""];
      
      let loadedImages = [...imgs];
      if (bData.image_url && loadedImages.length === 0) {
        loadedImages = [bData.image_url];
      }
      
      for(let i=0; i<Math.min(5, loadedImages.length); i++) {
        newUrls[i] = loadedImages[i];
        newPreviews[i] = loadedImages[i];
      }
      setImageUrls(newUrls);
      setImagePreviews(newPreviews);
    }

    // Fetch all products
    const { data: pData } = await supabase.from("products").select("*, product_images(image_url)").order("created_at", { ascending: false });
    if (pData) setProducts(pData);

    // Fetch bundle products
    const { data: bpData } = await supabase.from("bundle_products").select("product_id").eq("bundle_id", id);
    if (bpData) {
      const pIds = bpData.map((bp) => bp.product_id);
      setBundleProducts(pIds);
    }
    setLoading(false);
  };

  const handleAddProduct = async (productId: string) => {
    if (!supabase) return;
    await supabase.from("bundle_products").insert({ bundle_id: id, product_id: productId });
    setBundleProducts([...bundleProducts, productId]);
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!supabase) return;
    await supabase.from("bundle_products").delete().match({ bundle_id: id, product_id: productId });
    setBundleProducts(bundleProducts.filter((pid) => pid !== productId));
  };

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
      setMessage({ text: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`, type: "error" });
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

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" as "success" | "error" });
    setSaving(true);
    if (!supabase) return;

    const validImages = imageUrls.filter((url) => url.trim() !== "");
    const mainImage = validImages.length > 0 ? validImages[0] : "/images/mystery_bundle_box.png";

    const { error: updateError } = await supabase.from("bundles").update({
      name: formData.name,
      description: formData.description,
      price: 0,
      items_count: parseInt(formData.itemsCount),
      image_url: mainImage,
      images: validImages,
      sizes: formData.sizes,
      colors: formData.colors,
      is_active: formData.isActive
    }).eq("id", id);

    if (updateError) {
      setMessage({ text: updateError.message, type: "error" });
    } else {
      setMessage({ text: "✓ Bundle details updated successfully!", type: "success" });
      setBundle({ ...bundle, name: formData.name, items_count: parseInt(formData.itemsCount) });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-[var(--accent-1)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filteredProducts = products.filter(p => !bundleProducts.includes(p.id) && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const assignedProducts = products.filter(p => bundleProducts.includes(p.id));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      <Link href="/admin/bundles" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[var(--accent-1)]">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Bundles
      </Link>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight font-serif text-white">Manage: {bundle?.name}</h1>
          <p className="text-zinc-500 mt-1 text-sm">{bundleProducts.length} out of {bundle?.items_count} items assigned</p>
        </div>
        {activeTab === "edit" && (
          <div className="flex items-center gap-3">
            <button onClick={handleSaveDetails} disabled={saving} className="flex items-center gap-2 bg-[var(--accent-1)] text-black px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-50 transition-all">
              {saving ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setActiveTab("products")} className={`text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "products" ? "bg-[var(--accent-1)] text-black" : "text-zinc-400 hover:bg-white/5"}`}>Manage Products</button>
        <button onClick={() => setActiveTab("edit")} className={`text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "edit" ? "bg-[var(--accent-1)] text-black" : "text-zinc-400 hover:bg-white/5"}`}>Edit Details</button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Search & Add Products */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Available Products</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:border-[var(--accent-1)] focus:outline-none transition-colors" 
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
              {filteredProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-black border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-md overflow-hidden relative">
                      {p.product_images?.[0]?.image_url && <Image src={p.product_images[0].image_url} alt="" fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white line-clamp-1">{p.name}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAddProduct(p.id)} className="p-2 bg-[var(--accent-1)]/10 text-[var(--accent-1)] rounded-lg hover:bg-[var(--accent-1)] hover:text-black transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Assigned Products */}
          <div className="bg-[#070707] border border-[var(--accent-1)]/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Assigned Products ({assignedProducts.length})</h3>
            {assignedProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">No products assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {assignedProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-black border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 rounded-md overflow-hidden relative">
                        {p.product_images?.[0]?.image_url && <Image src={p.product_images[0].image_url} alt="" fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{p.name}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "edit" && (
        <form onSubmit={handleSaveDetails} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Basic Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Bundle Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Capacity</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Items Count *</label>
                  <input type="number" name="itemsCount" value={formData.itemsCount} onChange={handleInputChange} required min="1" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors" />
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
        </form>
      )}
    </motion.div>
  );  
}
