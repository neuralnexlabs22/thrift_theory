"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  const handleSizeSelect = (bundleId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [bundleId]: size }));
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">


      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h1 className="heading-luxury text-5xl md:text-7xl text-foreground mb-6">Mystery Bundles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover curated collections of premium thrift fashion. Select your size, and our expert stylists will hand-pick the best pieces for you.
          </p>
        </div>

        <div className="space-y-32">
          {BUNDLES.map((bundle, index) => (
            <div key={bundle.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative h-[500px] md:h-[700px] w-full md:w-1/2 overflow-hidden bg-secondary">
                <Image 
                  src={bundle.image} 
                  alt={bundle.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <div className="border-b border-border pb-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">{bundle.itemsCount} Premium Items</p>
                  <h2 className="heading-luxury text-4xl text-foreground mb-4">{bundle.name}</h2>
                  <p className="text-2xl text-foreground/80">₹{bundle.price.toLocaleString('en-IN')}</p>
                  <p className="mt-6 text-muted-foreground leading-relaxed">{bundle.description}</p>
                </div>
                
                <div className="space-y-6">
                  <label className="text-sm uppercase tracking-widest text-foreground font-medium block">Select Your Size</label>
                  <div className="flex flex-wrap gap-4">
                    {bundle.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => handleSizeSelect(bundle.id, size)}
                        className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                          selectedSizes[bundle.id] === size 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border hover:border-primary text-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  disabled={!selectedSizes[bundle.id]}
                  className={`w-full py-5 uppercase tracking-widest transition-luxury ${
                    selectedSizes[bundle.id] 
                      ? 'bg-foreground text-background hover:bg-primary' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
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
