"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const lookbookImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1535530705774-695729778c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMGxvb2tib29rJTIwY2FtcGFpZ258ZW58MXx8fHwxNzgxNzk3MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Spring Editorial',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1649114383220-c4f0f0dbafbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3RyZWV0d2VhciUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzgxNzk3MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Urban Essentials',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1619603364937-8d7af41ef206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbWluaW1hbGlzdCUyMGZhc2hpb24lMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODE3OTcxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Minimal Luxury',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1723538494462-23f317794d7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbW9kZWwlMjBjYXN1YWwlMjBvdXRmaXR8ZW58MXx8fHwxNzgxNzk3MTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Street Culture',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbW9kZWwlMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgxNzk3MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Campaign 2026',
  },
];

export function LookbookGallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="py-32 bg-[#F3F7F4] overflow-hidden">
      <div className="mb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.3em] text-[#355E3B] font-semibold mb-6 uppercase">
              Visual Stories
            </p>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#004225]">
              Lookbook
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto px-6 lg:px-12 pb-8 snap-x snap-mandatory scrollbar-hide relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lookbookImages.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center group overflow-hidden rounded-lg"
          >
            <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-lg shadow-xl border border-[#4C6B47]/20">
              <motion.img
                style={{ x: xTransform }}
                src={item.image}
                alt={item.title}
                className="w-[120%] max-w-none h-full object-cover -ml-[10%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/80 via-[#004225]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Title */}
              <div className="absolute bottom-8 left-8 text-[#F3F7F4] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <h3 className="font-[family-name:var(--font-serif)] text-4xl">
                  {item.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Scroll Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {lookbookImages.map((item) => (
          <div
            key={item.id}
            className="w-2 h-2 rounded-full bg-[#355E3B]/20 hover:bg-[#004225] transition-colors cursor-pointer"
          />
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

