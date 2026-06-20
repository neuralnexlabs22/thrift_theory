"use client";

import { use, useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, MessageCircle, Upload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const PLACEMENT_STYLES: Record<string, string> = {
  "Front Center": "top-[30%] left-[35%] w-[30%] h-[30%]",
  "Back Center": "top-[30%] left-[35%] w-[30%] h-[30%]",
  "Front Pocket": "top-[28%] left-[55%] w-[15%] h-[15%]",
  "Full Front": "top-[20%] left-[25%] w-[50%] h-[60%]",
  "Full Back": "top-[20%] left-[25%] w-[50%] h-[60%]",
};
const PLACEMENTS = Object.keys(PLACEMENT_STYLES);

// Map common color names to Hex codes for the overlay
const COLOR_MAP: Record<string, string> = {
  "Black": "#111111",
  "White": "#ffffff",
  "Cream": "#fdfbf7",
  "Navy": "#000080",
  "Red": "#ff0000",
  "Grey": "#808080",
  "Charcoal": "#36454F",
  "Olive": "#556B2F",
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const decodedId = decodeURIComponent(rawId);
  
  const { products, loaded } = useProducts();
  const { addToCart } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  
  // Customizer state
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState("Front Center");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the product by id or slug
  const product = useMemo(() => {
    return products.find(
      (p) => p.id === decodedId || p.slug === decodedId || p.name.toLowerCase().replace(/\s+/g, "-") === decodedId
    );
  }, [products, decodedId]);

  // Set default selected size and color once product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="heading-luxury text-3xl text-primary mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The item you are looking for does not exist or has been sold.</p>
          <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold hover:bg-foreground transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isCustomizer = product.category.toLowerCase() === "customization";

  // Drag and Drop Handlers for Customizer
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setCustomFile(file);
        setCustomImage(URL.createObjectURL(file));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setCustomFile(file);
        setCustomImage(URL.createObjectURL(file));
      }
    }
  };

  const uploadDesignToSupabase = async (): Promise<string | null> => {
    if (!customFile || !supabase) return null;
    
    try {
      const fileExt = customFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("custom-designs")
        .upload(fileName, customFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("custom-designs").getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Failed to upload design:", error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) return;
    
    let designUrl = null;
    if (isCustomizer && customFile) {
      setIsUploading(true);
      designUrl = await uploadDesignToSupabase();
      setIsUploading(false);
    }
    
    addToCart({
      productId: product.id,
      name: product.name + (isCustomizer ? " (Custom)" : ""),
      price: product.price,
      image: designUrl || product.images[0] || "/images/hero.png",
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const handleWhatsAppInquiry = async () => {
    let designUrl = null;
    if (isCustomizer && customFile) {
      setIsUploading(true);
      designUrl = await uploadDesignToSupabase();
      setIsUploading(false);
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const itemUrl = `${origin}/products/${product.id}`;
    
    let message = `Hello ThriftTheory, I am interested in buying this item:\n\n*Product:* ${product.name}\n*Price:* ₹${product.price.toLocaleString("en-IN")}\n*Size Selected:* ${selectedSize || "N/A"}\n*Color Selected:* ${selectedColor || "N/A"}\n*Product URL:* ${itemUrl}`;
    
    if (isCustomizer) {
      message += `\n\n*Customization Details:*\n*Placement:* ${selectedPlacement}`;
      if (designUrl) {
        message += `\n*Design File:* ${designUrl}`;
      }
    }
    
    message += `\n\nIs this item still available for order?`;
    window.open(`https://wa.me/917695923756?text=${encodeURIComponent(message)}`, "_blank");
  };

  const activeImageUrl = product.images[activeImage] || "/images/hero.png";
  const hexColor = selectedColor && COLOR_MAP[selectedColor] ? COLOR_MAP[selectedColor] : 'transparent';

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Back Link */}
        <Link
          href={`/shop`}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Images Section (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 md:w-20">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square w-16 md:w-full overflow-hidden bg-secondary border transition-colors ${
                      activeImage === idx ? "border-primary" : "border-primary/10 hover:border-primary/40"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} Thumb ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Active Image Display */}
            <div 
              className={`relative aspect-square flex-1 overflow-hidden bg-secondary border transition-colors ${
                isCustomizer 
                  ? (isDragging ? 'border-primary border-dashed border-2 cursor-copy' : 'border-primary/30 border-dashed border-2 cursor-pointer hover:border-primary') 
                  : 'border-primary/10'
              }`}
              onDragOver={isCustomizer ? handleDragOver : undefined}
              onDragLeave={isCustomizer ? handleDragLeave : undefined}
              onDrop={isCustomizer ? handleDrop : undefined}
              onClick={() => isCustomizer && !customImage && fileInputRef.current?.click()}
            >
              
              {!isCustomizer ? (
                // STANDARD IMAGE VIEWER
                <Image
                  src={activeImageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                // PREMIUM CUSTOMIZER VIEWER
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Base Image */}
                  <div className="absolute inset-0 z-10 mix-blend-multiply opacity-90">
                    <Image src={activeImageUrl} alt="Garment Mockup" fill className="object-cover" priority />
                  </div>
                  
                  {/* Color Overlay Filter */}
                  <div 
                    className="absolute inset-0 z-20 mix-blend-multiply transition-colors duration-500" 
                    style={{ 
                      backgroundColor: hexColor,
                      maskImage: `url(${activeImageUrl})`,
                      WebkitMaskImage: `url(${activeImageUrl})`,
                      maskSize: 'cover',
                      WebkitMaskSize: 'cover',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />

                  {/* Uploaded Design */}
                  {customImage ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={selectedPlacement}
                      className={`absolute z-30 transition-all duration-500 flex items-center justify-center border border-dashed border-primary/30 p-1 ${PLACEMENT_STYLES[selectedPlacement]}`}
                    >
                      <div className="relative w-full h-full">
                        <Image src={customImage} alt="Your Design" fill className="object-contain" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                      <div className="bg-background/80 px-6 py-4 rounded-xl border border-primary/20 backdrop-blur-sm text-center shadow-lg">
                        <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Upload Design</p>
                        <p className="text-xs text-muted-foreground">Drag & drop or click</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isCustomizer && (
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              )}

              {product.stock === 1 && !isCustomizer && (
                <span className="absolute top-4 left-4 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-30">
                  1 OF 1 VINTAGE
                </span>
              )}
            </div>
            
            {/* Remove custom image button below image on mobile */}
            {isCustomizer && customImage && (
              <button 
                onClick={() => { setCustomImage(null); setCustomFile(null); }}
                className="lg:hidden w-full py-3 text-[10px] uppercase tracking-widest font-bold text-red-500 border border-red-500/20 hover:bg-red-500/10 flex items-center justify-center gap-2"
              >
                <X className="w-3 h-3" /> Remove Artwork
              </button>
            )}
          </div>

          {/* Info details Section (Right 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Brand */}
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              {product.brand} {isCustomizer && "• Custom Studio"}
            </span>

            {/* Name */}
            <h1 className="heading-luxury text-3xl md:text-4xl lg:text-5xl text-foreground font-serif mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Category Breadcrumb */}
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-primary/10 pb-4">
              Category: <span className="text-foreground">{product.category}</span>
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-black text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Inclusive of all taxes & local shipping
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size & Color Selections */}
            <div className="space-y-6 mb-8">
              
              {/* Premium Customizer Options */}
              {isCustomizer && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Design Placement
                      </span>
                      {customImage && (
                        <button onClick={() => { setCustomImage(null); setCustomFile(null); }} className="text-[9px] text-red-500 hover:underline uppercase tracking-widest flex items-center gap-1 hidden lg:flex">
                          <X className="w-3 h-3" /> Remove Artwork
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {PLACEMENTS.map((placement) => (
                        <button
                          key={placement}
                          type="button"
                          onClick={() => setSelectedPlacement(placement)}
                          className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                            selectedPlacement === placement
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary/20 text-foreground hover:border-primary/60 hover:bg-secondary"
                          }`}
                        >
                          {placement}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    Select Color
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`h-10 border text-xs font-bold transition-colors flex items-center justify-center px-4 ${
                          selectedColor === col
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/20 text-foreground hover:border-primary/60 hover:bg-secondary"
                        }`}
                      >
                        {isCustomizer && COLOR_MAP[col] && (
                          <span className="w-3 h-3 rounded-full mr-2 border border-white/20" style={{ backgroundColor: COLOR_MAP[col] }} />
                        )}
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[3rem] h-10 border text-xs font-bold transition-colors flex items-center justify-center px-3 ${
                          selectedSize === sz
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/20 text-foreground hover:border-primary/60 hover:bg-secondary"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              {product.stock !== 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isUploading}
                  className={`w-full py-5 text-xs font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2 ${
                    cartSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading Design..." : cartSuccess ? "Added to Cart!" : "Add to Cart"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-5 bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center"
                >
                  Sold Out
                </button>
              )}

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                disabled={isUploading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                <span>{isUploading ? "Uploading..." : "WhatsApp Inquiry"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-4 border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  isWishlisted
                    ? "border-primary text-primary bg-secondary/30"
                    : "border-primary/20 text-foreground hover:border-primary"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary" : ""}`} />
                <span>{isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-primary/10 pt-8 text-center text-[9px] font-bold tracking-widest text-muted-foreground">
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <Truck className="w-4 h-4 text-primary mb-2" />
                <span>EXPRESS INDIA SHIPPING</span>
              </div>
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-primary mb-2" />
                <span>100% AUTHENTICATE</span>
              </div>
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-primary mb-2" />
                <span>SECURE PAYMENTS</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
