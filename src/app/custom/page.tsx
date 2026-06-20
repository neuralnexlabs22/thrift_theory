"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Loader2, Star, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadAdminImage } from "@/lib/imageUpload";

const PLACEMENTS = [
  { name: "Front Center", style: "top-[30%] left-[35%] w-[30%] h-[30%]" },
  { name: "Back Center", style: "top-[30%] left-[35%] w-[30%] h-[30%]" },
  { name: "Front Pocket", style: "top-[28%] left-[55%] w-[15%] h-[15%]" },
  { name: "Full Front", style: "top-[20%] left-[25%] w-[50%] h-[60%]" },
  { name: "Full Back", style: "top-[20%] left-[25%] w-[50%] h-[60%]" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function InteractiveCustomizerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data from DB
  const [clothingTypes, setClothingTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  // Selections
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENTS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  // Customer Info (for a quick inline form before WhatsApp)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  // Design Upload
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreviewUrl, setDesignPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [typesRes, colorsRes] = await Promise.all([
      supabase.from("custom_clothing_types").select("*").eq("is_active", true).order("created_at"),
      supabase.from("custom_colors").select("*").eq("is_active", true).order("name"),
    ]);

    let fetchedTypes = typesRes.data || [];
    if (fetchedTypes.length === 0) {
      fetchedTypes = [{
        id: "default-oversized",
        name: "Oversized Plain White Tee",
        base_image_url: "/images/oversize_tshirt_blank.png",
        is_active: true
      }];
    }
    setClothingTypes(fetchedTypes);
    setSelectedType(fetchedTypes[0]);

    let fetchedColors = colorsRes.data || [];
    if (fetchedColors.length === 0) {
      fetchedColors = [
        { id: "default-white", name: "White", hex_code: "#FFFFFF", is_active: true },
        { id: "default-black", name: "Black", hex_code: "#000000", is_active: true },
        { id: "default-cream", name: "Cream", hex_code: "#F5F5DC", is_active: true },
        { id: "default-navy", name: "Navy", hex_code: "#000080", is_active: true }
      ];
    }
    setColors(fetchedColors);
    setSelectedColor(fetchedColors[0]);

    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDesignFile(file);
      setDesignPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setDesignFile(file);
        setDesignPreviewUrl(URL.createObjectURL(file));
      } else {
        alert("Please drop a valid image file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designFile || !selectedType || !selectedColor) {
      alert("Please upload a design first.");
      return;
    }
    if (!name || !phone) {
      setShowContactForm(true);
      return;
    }

    setSubmitting(true);

    try {
      // Use the backend API to bypass Storage RLS
      const publicUrl = await uploadAdminImage(designFile, "custom-designs", "uploads");

      const typeId = selectedType.id.startsWith("default-") ? null : selectedType.id;
      const colorId = selectedColor.id.startsWith("default-") ? null : selectedColor.id;

      const { data: orderData, error: orderError } = await supabase.from("custom_orders").insert({
        customer_name: name,
        phone,
        email: "",
        clothing_type_id: typeId,
        color_id: colorId,
        size: selectedSize,
        quantity: parseInt(quantity),
        placement: selectedPlacement.name,
        notes: (typeId === null || colorId === null) 
          ? `[Base: ${selectedType.name}, Color: ${selectedColor.name}] ${notes}`
          : notes,
        design_url: publicUrl,
        status: "Pending",
      }).select().single();

      if (orderError) throw orderError;

      await supabase.from("custom_orders").update({ status: "WhatsApp Sent" }).eq("id", orderData.id);

      const message = `Hello, I would like to place a custom apparel order.
      
*Order details:*
Clothing Type: ${selectedType.name}
Color: ${selectedColor.name}
Size: ${selectedSize}
Quantity: ${quantity}
Placement: ${selectedPlacement.name}
Notes: ${notes || "None"}

Design File: ${publicUrl}

Please contact me to confirm pricing and delivery.`;

      const waUrl = `https://wa.me/917695923756?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");

      // Reset
      setDesignFile(null);
      setDesignPreviewUrl(null);
      setName("");
      setPhone("");
      setNotes("");
      setShowContactForm(false);
      alert("Request sent successfully! We will contact you via WhatsApp.");

    } catch (error: any) {
      console.error(error);
      alert("An error occurred while submitting your request: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /></div>;
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Image Viewer (Matches the e-commerce product image section) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-4">
            {/* Main Interactive Studio Canvas */}
            <div 
              className="relative w-full aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200 flex items-center justify-center"
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
            >
              {selectedType ? (
                <>
                  {/* Background Mockup (Pure White) */}
                  <div className="absolute inset-0 z-10 mix-blend-multiply pointer-events-none">
                    <Image 
                      src={selectedType.base_image_url} 
                      alt={selectedType.name} 
                      fill 
                      className="object-contain p-4 lg:p-12"
                    />
                  </div>
                  
                  {/* Color Overlay */}
                  <div 
                    className="absolute inset-0 z-20 mix-blend-multiply transition-colors duration-500 pointer-events-none" 
                    style={{ 
                      backgroundColor: selectedColor?.hex_code || 'transparent',
                      maskImage: `url(${selectedType.base_image_url})`,
                      WebkitMaskImage: `url(${selectedType.base_image_url})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />

                  {/* Artwork / Drag & Drop Target */}
                  {designPreviewUrl ? (
                    <motion.div 
                      key={selectedPlacement.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute z-30 flex items-center justify-center ${selectedPlacement.style}`}
                    >
                      <div className="relative w-full h-full border-2 border-dashed border-zinc-900/20 p-2 group hover:border-zinc-900/40 transition-colors">
                        <Image src={designPreviewUrl} alt="Artwork" fill className="object-contain drop-shadow-xl" />
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDesignPreviewUrl(null); setDesignFile(null); }}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-zinc-200 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-zinc-600" />
                        <span className="text-sm font-bold text-zinc-800">Drag artwork here</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
              )}
            </div>

            {/* Thumbnails (Used for Placements) */}
            <div className="grid grid-cols-5 gap-3">
              {PLACEMENTS.map((placement) => (
                <button
                  key={placement.name}
                  onClick={() => setSelectedPlacement(placement)}
                  className={`relative aspect-square rounded-xl border-2 overflow-hidden flex flex-col items-center justify-center gap-2 transition-all bg-white
                    ${selectedPlacement.name === placement.name ? 'border-zinc-900 shadow-md ring-2 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-300'}
                  `}
                >
                  <div className="text-[10px] font-bold text-zinc-600 text-center uppercase tracking-widest px-1">
                    {placement.name.split(' ').map(w => w[0]).join('')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details Form */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8 lg:py-4">
            
            {/* Title & Price */}
            <div>
              <p className="text-sm font-bold text-zinc-500 tracking-widest uppercase mb-2">Custom Studio</p>
              
              <select 
                value={selectedType?.id || ''} 
                onChange={(e) => setSelectedType(clothingTypes.find(t => t.id === e.target.value))}
                className="text-3xl lg:text-4xl font-black text-zinc-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {clothingTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs text-zinc-500 font-medium">(Premium Custom Base)</span>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold text-zinc-900">Color</h3>
                <span className="text-xs text-zinc-500 font-medium">{selectedColor?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full transition-all group shadow-sm
                      ${selectedColor?.id === color.id ? "ring-2 ring-offset-2 ring-zinc-900 scale-110" : "border border-zinc-200 hover:scale-105"}
                    `}
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  >
                    {selectedColor?.id === color.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-4 h-4 ${['#FFFFFF', '#ffffff'].includes(color.hex_code) ? 'text-black' : 'text-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold text-zinc-900">Size</h3>
                <button className="text-xs text-zinc-500 font-medium underline hover:text-zinc-900">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-bold rounded-xl transition-all border
                      ${selectedSize === size ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900"}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Upload Button */}
            {!designPreviewUrl && (
              <div className="pt-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-600 font-bold hover:border-zinc-900 hover:text-zinc-900 transition-colors bg-white"
                >
                  <Upload className="w-5 h-5" />
                  Upload Artwork
                </button>
              </div>
            )}

            {/* Checkout / Form */}
            <div className="pt-6 border-t border-zinc-200 space-y-4">
              
              <AnimatePresence>
                {showContactForm && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4 mb-4">
                      <h4 className="text-sm font-bold text-zinc-900">Contact Details</h4>
                      <div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors" />
                      </div>
                      <div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors" />
                      </div>
                      <div>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={handleSubmit}
                disabled={submitting || !designPreviewUrl}
                className="w-full flex items-center justify-center gap-2 bg-[#1A8B80] hover:bg-[#157168] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Checkout & Inquire
                  </>
                )}
              </button>
              
              {!designPreviewUrl && (
                <p className="text-xs text-center text-red-500 font-medium">Please upload an artwork to proceed.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
