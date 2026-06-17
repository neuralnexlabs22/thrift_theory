"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="min-h-screen bg-background" ref={containerRef}>


      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.png" 
            alt="Men's Luxury Thrift Fashion" 
            fill 
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-background/20" />
        </motion.div>
        
        <div className="z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-luxury text-5xl md:text-7xl lg:text-8xl text-foreground mb-6"
          >
            Curated Mens <br/><span className="text-primary italic">Thrift</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            Premium vintage fashion curated exclusively for men. 
            Elevate your wardrobe with our luxury mystery bundles and custom designs.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/bundles" className="bg-primary text-primary-foreground px-10 py-4 uppercase tracking-widest text-sm hover:bg-foreground transition-luxury">
              Shop Mystery Bundles
            </Link>
            <Link href="/shop" className="bg-transparent border border-primary text-primary px-10 py-4 uppercase tracking-widest text-sm hover:bg-primary hover:text-primary-foreground transition-luxury">
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mystery Bundles Section */}
      <section id="bundles" className="py-32 px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="heading-luxury text-4xl md:text-5xl text-foreground mb-4">The Mystery Box</h2>
              <p className="text-muted-foreground max-w-md">10 Shirts. 1 Price. Endless Surprises. Curated specifically for your style and size.</p>
            </div>
            <Link href="/bundles" className="hidden md:flex text-sm uppercase tracking-widest text-primary hover:text-foreground transition-colors items-center gap-2">
              View All Bundles <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[600px] w-full overflow-hidden">
              <Link href="/bundles">
                <Image 
                  src="/images/mystery-bundle.png" 
                  alt="Luxury Mystery Bundle Unboxing" 
                  fill 
                  className="object-cover hover:scale-105 transition-luxury cursor-pointer"
                />
              </Link>
            </div>
            <div className="space-y-8">
              <div className="border-b border-border pb-8">
                <h3 className="heading-luxury text-3xl text-primary mb-2">Premium Vintage Bundle</h3>
                <p className="text-xl text-foreground">₹3,999</p>
                <p className="mt-4 text-muted-foreground">Receive a hand-picked selection of 10 premium vintage shirts. We curate earth tones, oversized fits, and luxury blanks tailored for men.</p>
              </div>
              
              <Link href="/bundles" className="block w-full bg-foreground text-background py-4 uppercase tracking-widest hover:bg-primary transition-luxury text-center">
                Explore Bundles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pillars Section (Replaced Shop Collections) */}
      <section id="pillars" className="py-32 px-4 md:px-8 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Pillar 1: Mystery Bundles */}
             <Link href="/bundles" className="group relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-xl border border-transparent hover:border-primary transition-all duration-500 block">
               <Image src="/images/mystery-bundle.png" alt="Mystery Bundles" fill className="object-cover opacity-60 group-hover:opacity-40 transition-luxury group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-10 left-10 right-10 text-center">
                 <h3 className="text-3xl font-bold uppercase tracking-widest text-background mb-4">MYSTERY BUNDLES</h3>
                 <p className="text-sm uppercase tracking-widest text-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2">Explore Now <span>&rarr;</span></p>
               </div>
             </Link>
             
             {/* Pillar 2: Shop Mens */}
             <Link href="/shop" className="group relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-xl border border-transparent hover:border-primary transition-all duration-500 block">
               <Image src="/images/hero.png" alt="Shop Mens" fill className="object-cover opacity-60 group-hover:opacity-40 transition-luxury group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-10 left-10 right-10 text-center">
                 <h3 className="text-3xl font-bold uppercase tracking-widest text-background mb-4">SHOP MENS</h3>
                 <p className="text-sm uppercase tracking-widest text-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2">Explore Now <span>&rarr;</span></p>
               </div>
             </Link>

             {/* Pillar 3: Custom Design */}
             <Link href="/custom" className="group relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-xl border border-transparent hover:border-primary transition-all duration-500 block">
               <Image src="/images/categories/tees.png" alt="Custom Design" fill className="object-cover opacity-60 group-hover:opacity-40 transition-luxury group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-10 left-10 right-10 text-center">
                 <h3 className="text-3xl font-bold uppercase tracking-widest text-background mb-4">CUSTOM DESIGN</h3>
                 <p className="text-sm uppercase tracking-widest text-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2">Explore Now <span>&rarr;</span></p>
               </div>
             </Link>
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section id="lookbook" className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
           <h2 className="heading-luxury text-4xl md:text-5xl text-foreground mb-16 text-center">Editorial</h2>
           <div className="relative h-[80vh] w-full">
             <Image 
                src="/images/lookbook.png" 
                alt="Mens Fashion Lookbook" 
                fill 
                className="object-cover"
              />
           </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-20 px-8 text-center">
         <h2 className="heading-luxury text-3xl mb-8 text-primary">ThriftTheory</h2>
         <p className="text-background/60 text-sm max-w-md mx-auto mb-10">Premium thrift fashion curated exclusively for boys and men. Elevate your wardrobe with earth tones and luxury blanks.</p>
         <div className="text-xs uppercase tracking-widest text-background/40">
           © 2026 ThriftTheory. All Rights Reserved.
         </div>
      </footer>
    </main>
  );
}
