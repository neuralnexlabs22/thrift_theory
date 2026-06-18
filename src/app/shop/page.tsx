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
    <div className="pt-32 pb-24 bg-[#F3F7F4] min-h-screen text-[#004225]">
      {/* Header Banner */}
      <div className="bg-[#004225] text-[#E8F0EA] border-b border-[#355E3B]/20 py-16 mb-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#355E3B]/20 rounded-full filter blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E8F0EA]/70 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-serif)] tracking-tight mb-4 flex items-center justify-center gap-4">
            CURATED COLLECTIONS
          </h1>
          <p className="text-[#E8F0EA]/80 text-xs md:text-sm tracking-[0.25em] uppercase font-bold">
            THRIFT THEORY &bull; EXCLUSIVE EDITS
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col space-y-16 md:space-y-32">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-20 items-center ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Collection Image */}
              <div className="w-full lg:w-3/5 aspect-[4/3] relative overflow-hidden bg-[#355E3B] group rounded-sm shadow-2xl border border-[#4C6B47]/20">
                <Link href={`/shop/${cat.slug}`} className="block w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/80 via-[#004225]/20 to-transparent" />
                  
                  {/* Badge Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="text-[#E8F0EA]/80 text-[10px] tracking-[0.3em] font-bold uppercase mb-2">
                        {cat.tagline}
                      </p>
                      <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-serif)] text-white tracking-wide">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                      {mounted && loaded ? getProductCount(cat.name) : 0} Items
                    </div>
                  </div>
                </Link>
              </div>

              {/* Collection Details */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center text-center lg:text-left px-4">
                <span className="text-[#355E3B] uppercase tracking-[0.25em] text-[11px] font-bold mb-4">
                  COLLECTION #0{index + 1}
                </span>
                <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-[#004225] mb-6 tracking-tight">
                  {cat.name}
                </h2>
                <p className="text-[#4C6B47] text-sm md:text-base leading-relaxed mb-10 font-light">
                  {cat.description} Redefining the standard of premium styling through our curated {cat.name.toLowerCase()} capsule. Hand-picked for quality, style, and timeless appeal.
                </p>
                <Link
                  href={`/shop/${cat.slug}`}
                  className="inline-flex items-center space-x-3 text-white bg-[#004225] hover:bg-[#355E3B] transition-all px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest shadow-lg mx-auto lg:mx-0 w-fit group"
                >
                  <span>Explore Edit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
