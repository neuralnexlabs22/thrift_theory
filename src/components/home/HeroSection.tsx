"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#004225]">
      {/* Background Image with Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#004225]/40 via-[#004225]/60 to-[#004225] z-10" />
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1080&auto=format&fit=crop"
          alt="Stack of vintage thrift shirts"
          className="w-full h-[120%] object-cover -top-[10%]"
        />
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#4C6B47] blur-3xl z-10"
      />
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-[#355E3B] blur-3xl z-10"
      />

      {/* Content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.3em] text-[#4C6B47] mb-8 uppercase font-bold">
            Limited Time Offer
          </p>
          
          <h1 className="font-[family-name:var(--font-serif)] text-6xl lg:text-8xl mb-6 leading-[1.1] tracking-tight text-[#E8F0EA]">
            THE 10 SHIRT<br />BUNDLE
          </h1>
          
          <p className="font-[family-name:var(--font-sans)] text-xl lg:text-2xl text-[#E8F0EA]/90 mb-12 max-w-2xl mx-auto font-light tracking-wide">
            10 hand-picked premium vintage pieces curated for your unique style. Unmatched value, unmatched aesthetic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/bundles">
              <Button
                size="lg"
                className="bg-[#4C6B47] hover:bg-[#355E3B] text-white px-10 py-6 rounded-none font-[family-name:var(--font-sans)] tracking-wider group border border-[#4C6B47]"
              >
                GET YOUR BUNDLE NOW
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#4C6B47] bg-transparent hover:bg-[#4C6B47] hover:text-white text-[#4C6B47] px-10 py-6 rounded-none font-[family-name:var(--font-sans)] tracking-wider transition-all"
              >
                EXPLORE COLLECTIONS
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-[#4C6B47]/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-[#4C6B47] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

