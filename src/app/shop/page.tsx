"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useProducts } from "@/context/ProductContext";

const categories = [
  {
    name: "Hoodies",
    slug: "hoodies",
    tagline: "HEAVYWEIGHT FLEECE",
    description: "Heavyweight drop-shoulder hoodies & premium blanks that hold their shape.",
    image: "/images/categories/hoodies.png",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    tagline: "VINTAGE BLANKS & TEES",
    description: "Boxy fit, vintage-washed ringer tees and graphic streetwear essentials.",
    image: "/images/categories/tees.png",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    tagline: "UTILITY PANTS & CARGOS",
    description: "Heavy canvas double-knee cargos and relaxed-fit utility bottoms.",
    image: "/images/categories/bottoms.png",
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    tagline: "STREETWEAR SHELLS & VESTS",
    description: "Vintage velvets, corduroy bomber jackets, and editorial streetwear layers.",
    image: "/images/lookbook.png",
  },
  {
    name: "Accessories",
    slug: "accessories",
    tagline: "ESSENTIAL FINISHING DETAILS",
    description: "Thick double-layered ribbed beanies, street jewelry and styling caps.",
    image: "/images/categories/accessories.png",
  },
];

export default function ShopMainPage() {
  const { products, loaded } = useProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductCount = (categoryName: string) => {
    return products.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">


      {/* Hero Header */}
      <div className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-4 md:px-8 mb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full filter blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs md:text-sm tracking-[0.4em] uppercase font-bold text-primary mb-4"
          >
            THRIFTTHEORY MENS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="heading-luxury text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 font-serif tracking-tight leading-none">
              THE COLLECTIONS
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-lg uppercase tracking-widest text-muted-foreground font-light max-w-2xl mx-auto"
          >
            Curated vintage apparel, earth tones & oversized streetwear blanks.
          </motion.p>
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <Link
                href={`/shop/${cat.slug}`}
                className="group block relative bg-card border border-primary/15 hover:border-primary transition-all duration-500 hover:shadow-[0_12px_45px_rgba(138,115,80,0.12)]"
              >
                {/* Image background */}
                <div className="relative h-72 md:h-80 overflow-hidden bg-secondary">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Product count badge */}
                  <div className="absolute top-5 right-5 bg-background border border-primary/20 text-foreground text-[9px] font-bold tracking-widest uppercase px-3 py-1.5">
                    {mounted && loaded ? getProductCount(cat.name) : 0} Items
                  </div>
                </div>

                {/* Card footer details */}
                <div className="p-6 bg-card border-t border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                  <p className="text-primary text-[9px] tracking-[0.3em] uppercase font-bold mb-2">
                    {cat.tagline}
                  </p>
                  <h2 className="heading-luxury text-2xl uppercase tracking-wider text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h2>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-6 h-10 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Arrow action */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:gap-4 transition-all duration-300">
                      EXPLORE DROP
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <div className="w-8 h-8 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
