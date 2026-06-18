"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const BUNDLES = [
  {
    id: "bundle-1",
    name: "The Essential Vintage Tee Bundle",
    price: 1999,
    itemsCount: 5,
    description: "A curated selection of 5 premium oversized vintage t-shirts in earth tones. Perfect for building a luxury minimalist wardrobe.",
    image: "/images/categories/tees.png",
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "bundle-2",
    name: "Luxury Winter Hoodie Collection",
    price: 2499,
    itemsCount: 3,
    description: "Stay warm in style. Receive 3 heavy-weight luxury hoodies selected by our stylists to match your preference.",
    image: "/images/categories/hoodies.png",
    sizes: ["M", "L", "XL"]
  },
  {
    id: "bundle-3",
    name: "The Complete ThriftTheory Box",
    price: 3999,
    itemsCount: 10,
    description: "The ultimate mystery box. 10 hand-picked items including tees, bottoms, and outerwear. A complete wardrobe refresh.",
    image: "/images/mystery-bundle.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

export default function MysteryBundlesPage() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const { addToCart, toggleCart } = useCart();

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
      image: bundle.image,
      size,
      color: "Default",
      quantity: 1,
    });
    toggleCart();
  };

  return (
    <main className="min-h-screen bg-[#F3F7F4] pt-32 pb-24 text-[#004225]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-[#004225] mb-6">Mystery Bundles</h1>
          <p className="text-lg text-[#355E3B] max-w-2xl mx-auto font-light">
            Discover curated collections of premium thrift fashion. Select your size, and our expert stylists will hand-pick the best pieces for you.
          </p>
        </div>

        <div className="space-y-32">
          {BUNDLES.map((bundle, index) => (
            <div key={bundle.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative h-[500px] md:h-[700px] w-full md:w-1/2 overflow-hidden bg-[#355E3B] rounded-sm shadow-xl">
                <Image 
                  src={bundle.image} 
                  alt={bundle.name} 
                  fill 
                  className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-8 px-4">
                <div className="border-b border-[#355E3B]/20 pb-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#355E3B] font-bold mb-2">{bundle.itemsCount} Premium Items</p>
                  <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-[#004225] mb-4 tracking-tight">{bundle.name}</h2>
                  <p className="text-3xl text-[#004225] font-serif">₹{bundle.price.toLocaleString('en-IN')}</p>
                  <p className="mt-6 text-[#4C6B47] leading-relaxed font-light">{bundle.description}</p>
                </div>
                
                <div className="space-y-6">
                  <label className="text-xs uppercase tracking-widest text-[#004225] font-bold block">Select Your Size</label>
                  <div className="flex flex-wrap gap-4">
                    {bundle.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => handleSizeSelect(bundle.id, size)}
                        className={`w-14 h-14 border flex items-center justify-center transition-colors font-bold ${
                          selectedSizes[bundle.id] === size 
                            ? 'border-[#004225] bg-[#004225] text-white' 
                            : 'border-[#355E3B]/30 hover:border-[#004225] text-[#004225] hover:bg-[#E8F0EA]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAddToCart(bundle)}
                  disabled={!selectedSizes[bundle.id]}
                  className={`w-full py-5 text-xs font-bold uppercase tracking-widest transition-all shadow-md ${
                    selectedSizes[bundle.id] 
                      ? 'bg-[#004225] text-white hover:bg-[#355E3B] hover:shadow-lg' 
                      : 'bg-[#E8F0EA] text-[#4C6B47] cursor-not-allowed border border-[#355E3B]/20'
                  }`}
                >
                  {selectedSizes[bundle.id] ? 'Add to Cart' : 'Select a Size'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
