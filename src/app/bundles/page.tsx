"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowLeft, Info, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function MysteryBundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [expandedTerms, setExpandedTerms] = useState(false);
  const { addToCart, toggleCart } = useCart();

  useEffect(() => {
    const fetchBundles = async () => {
      if (!supabase) return setLoading(false);
      const { data } = await supabase.from("bundles").select("*").eq("is_active", true);
      if (data) setBundles(data);
      setLoading(false);
    };
    fetchBundles();
  }, [supabase]);

  const handleSizeSelect = (bundleId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [bundleId]: size }));
  };

  const handleAddToCart = (bundle: any) => {
    const size = selectedSizes[bundle.id];
    if (!size) return;
    
    addToCart({
      productId: bundle.id,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image_url || "/images/mystery-bundle.png",
      size,
      color: "Default",
      quantity: 1,
    });
    toggleCart();
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[var(--accent-1)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-6 relative mb-12">
          <div className="absolute left-0 top-0 bottom-6 w-1.5 bg-primary rounded-r-md"></div>
          
          <div className="pl-5">
            <h1 className="text-3xl font-black uppercase tracking-widest text-primary mb-1">
              MYSTERY BUNDLES
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Curated multi-item collections tailored to your size
            </p>
          </div>
          
          <div className="flex items-center gap-4 pl-5 sm:pl-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {bundles.length} Bundles Available
            </span>
          </div>
        </div>

        {/* Global T&C Accordion for Mystery Bundles */}
        <div className="mb-12 bg-secondary/30 border border-primary/20 rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md transition-colors hover:bg-secondary/40">
          <button
            onClick={() => setExpandedTerms(!expandedTerms)}
            className="w-full flex items-center justify-between p-4 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-primary" />
              <span className="text-[13px] font-bold uppercase tracking-widest text-foreground">
                Terms & Conditions
              </span>
            </div>
            <motion.div
              animate={{ rotate: expandedTerms ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedTerms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-2 border-t border-primary/10 bg-secondary/10 text-[13px] text-muted-foreground leading-relaxed space-y-4">
                  <p className="font-bold text-foreground text-sm">Mystery Bundle Policy</p>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>The 10 clothing items included in this bundle are selected completely at random from our available inventory.</li>
                    <li>Customers cannot request or choose specific brands, colors, prints, graphics, or designs.</li>
                    <li>All 10 items will be delivered in the size selected during checkout.</li>
                    <li>Every Mystery Bundle is unique and curated based on our available stock at the time of packing.</li>
                    <li>Product images displayed on the website are for reference only and may not represent the exact items you receive.</li>
                    <li>We make every reasonable effort to provide a good variety of clothing and avoid duplicate items within the same bundle whenever possible.</li>
                    <li>Every item is carefully quality-checked before dispatch to ensure it meets our standards.</li>
                    <li>Mystery Bundles are sold as surprise collections; therefore, exchanges or returns based on design preference, color, brand, or style will not be accepted.</li>
                    <li>Returns or replacements will only be considered if an incorrect or damaged product is delivered.</li>
                    <li>By placing an order, you acknowledge that you understand the random selection process and agree to these Terms & Conditions.</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {bundles.map((bundle) => {
            const isSelected = !!selectedSizes[bundle.id];
            const sizes = Array.isArray(bundle.sizes) ? bundle.sizes : ["S", "M", "L", "XL"];
            
            return (
              <div key={bundle.id} className="group flex flex-col relative transition-all duration-300">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary rounded-xl">
                  <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                    {bundle.items_count} ITEMS
                  </span>
                  
                  <div className="relative block w-full h-full">
                    <Image 
                      src={bundle.image_url || "/images/mystery-bundle.png"} 
                      alt={bundle.name} 
                      fill 
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div
                    className={`absolute bottom-3 right-3 transition-all duration-300 ${
                      isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleAddToCart(bundle)}
                      className="p-3 rounded-full bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(0,66,37,0.4)] hover:brightness-110 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col pt-5 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    THRIFT THEORY EXCLUSIVE
                  </span>
                  <h3 className="text-base font-black text-foreground uppercase tracking-widest line-clamp-2">
                    {bundle.name}
                  </h3>
                  <p className="text-[15px] font-black text-primary mt-2">
                    ₹{Number(bundle.price).toLocaleString("en-IN")}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-3 mb-5 line-clamp-2 font-medium">
                    {bundle.description}
                  </p>

                  <div className="mt-auto space-y-3 border-t border-primary/10 pt-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground block">
                      Select Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size: string) => (
                        <button 
                          key={size} 
                          onClick={() => handleSizeSelect(bundle.id, size)}
                          className={`w-9 h-9 rounded-sm text-xs font-bold transition-all flex items-center justify-center ${
                            selectedSizes[bundle.id] === size 
                              ? 'bg-primary text-primary-foreground shadow-md' 
                              : 'bg-secondary text-foreground hover:bg-primary/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
