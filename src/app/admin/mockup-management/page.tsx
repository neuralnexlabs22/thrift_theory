"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import { uploadAdminImage } from "@/lib/imageUpload";

export default function MockupManagementPage() {
  const [activeTab, setActiveTab] = useState<"types" | "colors">("types");
  
  // Data
  const [clothingTypes, setClothingTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Type Form
  const [typeName, setTypeName] = useState("");
  const [typeImageUrl, setTypeImageUrl] = useState("");
  const [typeImagePreview, setTypeImagePreview] = useState("");
  const [uploadingType, setUploadingType] = useState(false);

  // Color Form
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#ffffff");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (!supabase) return setLoading(false);
    const [typesRes, colorsRes] = await Promise.all([
      supabase.from("custom_clothing_types").select("*").order("created_at"),
      supabase.from("custom_colors").select("*").order("name")
    ]);
    if (typesRes.data) setClothingTypes(typesRes.data);
    if (colorsRes.data) setColors(colorsRes.data);
    setLoading(false);
  };

  const handleTypeImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploadingType(true);
    try {
      const publicUrl = await uploadAdminImage(file, "clothing-mockups", "custom_clothing_types");
      setTypeImageUrl(publicUrl);
      setTypeImagePreview(publicUrl);
    } catch (error) {
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploadingType(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!supabase) return;
    await supabase.from("custom_clothing_types").delete().eq("id", id);
    fetchData();
  };

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!colorName || !colorHex) return;
    await supabase.from("custom_colors").insert({ name: colorName, hex_code: colorHex, is_active: true });
    setColorName("");
    setColorHex("#ffffff");
    fetchData();
  };

  const handleDeleteColor = async (id: string) => {
    if (!supabase) return;
    await supabase.from("custom_colors").delete().eq("id", id);
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-[var(--accent-1)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif text-white">Mockup Management</h1>
          <p className="text-zinc-500 mt-1 text-sm">Configure apparel types and color swatches</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setActiveTab("types")} className={`text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "types" ? "bg-[var(--accent-1)] text-black" : "text-zinc-400 hover:bg-white/5"}`}>Clothing Types</button>
        <button onClick={() => setActiveTab("colors")} className={`text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "colors" ? "bg-[var(--accent-1)] text-black" : "text-zinc-400 hover:bg-white/5"}`}>Colors</button>
      </div>

      {activeTab === "types" && (
        <div className="space-y-6">
          <div className="bg-[#070707] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Add Clothing Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Type Name *</label>
                  <input type="text" value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="e.g. Oversized Tee" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[var(--accent-1)] outline-none transition-colors" />
                </div>
                <p className="text-[10px] text-zinc-500">* Upload a blank, light-colored PNG for best color blending results.</p>
                <button 
                  onClick={async () => {
                    if (!supabase) return alert("Supabase not configured");
                    if (!typeName) return alert("Enter type name");
                    if (!typeImageUrl) return alert("Enter image URL or upload");
                    await supabase.from("custom_clothing_types").insert({ name: typeName, base_image_url: typeImageUrl, is_active: true });
                    setTypeName("");
                    setTypeImageUrl("");
                    setTypeImagePreview("");
                    fetchData();
                  }} 
                  className="w-full bg-[var(--accent-1)] text-black font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:brightness-110 transition-all"
                >
                   Add Clothing Type
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Base Image *</div>

                {/* Preview */}
                {typeImagePreview && (
                  <div className="relative w-full h-32 bg-black border border-white/10 rounded-lg overflow-hidden">
                    <img src={typeImagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => { setTypeImageUrl(""); setTypeImagePreview(""); }} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded text-white hover:bg-red-600 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* URL Input */}
                <input type="text" value={typeImageUrl} onChange={(e) => {
                  setTypeImageUrl(e.target.value);
                  if (e.target.value.startsWith("http") || e.target.value.startsWith("/")) setTypeImagePreview(e.target.value);
                }} placeholder="Paste image URL or upload below" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:border-[var(--accent-1)] focus:outline-none transition-colors text-sm" />
                
                {/* Upload Box */}
                <label 
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[var(--accent-1)]"); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-[var(--accent-1)]"); }}
                  onDrop={async (e) => {
                    e.preventDefault(); e.currentTarget.classList.remove("border-[var(--accent-1)]");
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleTypeImageUpload(e.dataTransfer.files[0]);
                  }}
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-white/20 rounded-lg px-3 py-4 cursor-pointer hover:border-[var(--accent-1)] hover:bg-white/5 transition-all mt-2"
                >
                  {uploadingType ? (
                    <span className="text-xs text-[var(--accent-1)]">Uploading...</span>
                  ) : (
                    <><Upload className="w-4 h-4 text-zinc-400" /><span className="text-xs text-zinc-400">Upload Image</span></>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleTypeImageUpload(e.target.files[0]); }} disabled={uploadingType} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clothingTypes.map(type => (
              <div key={type.id} className="bg-[#070707] border border-white/5 rounded-2xl p-4 flex flex-col items-center group relative">
                <div className="relative w-full aspect-square bg-zinc-900 rounded-xl mb-3 overflow-hidden">
                  <Image src={type.base_image_url} alt={type.name} fill className="object-cover" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest text-center">{type.name}</h4>
                <button onClick={() => handleDeleteType(type.id)} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "colors" && (
        <div className="space-y-6">
          <form onSubmit={handleAddColor} className="bg-[#070707] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Color Name (e.g. Navy Blue)</label>
              <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Hex Code</label>
              <div className="flex items-center gap-2">
                <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="w-12 h-10 rounded cursor-pointer bg-black border border-white/10" />
                <input type="text" value={colorHex} onChange={(e) => setColorHex(e.target.value)} required className="w-24 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white" />
              </div>
            </div>
            <button type="submit" className="bg-[var(--accent-1)] text-black font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:brightness-110">Add Color</button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colors.map(color => (
              <div key={color.id} className="bg-[#070707] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 relative group">
                <div className="w-16 h-16 rounded-full border-2 border-white/10 shadow-lg" style={{ backgroundColor: color.hex_code }} />
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{color.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{color.hex_code}</p>
                </div>
                <button onClick={() => handleDeleteColor(color.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
