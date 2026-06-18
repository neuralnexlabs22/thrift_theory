"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

const aboutSections = [
  {
    id: "a1",
    title: "Uncompromising Quality",
    subtitle: "01 / Aesthetic",
    description: "Every piece in our collection is meticulously sourced from premium vintage and thrift lines. Minimalist design meets bold execution. We deliver exceptional fabrics at accessible price points without sacrificing the luxury aesthetic.",
    image: "https://images.unsplash.com/photo-1654005018306-7066fc118281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMG1vZGVsfGVufDF8fHx8MTc4MTc5NzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "a2",
    title: "Sustainability",
    subtitle: "02 / Responsibility",
    description: "Repurposing premium thrift finds to reduce fashion waste while maintaining premium standards. We believe in a circular fashion ecosystem where high-quality garments find their rightful place rather than ending up in landfills.",
    image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmxhbm5lbCUyMHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3ODE3OTcxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "a3",
    title: "Community",
    subtitle: "03 / Culture",
    description: "Built for the culture. ThriftTheory isn't just a brand, it's a movement of authentic self-expression. Designed for those who lead, not follow. We empower individuals to embrace their unique styling identity.",
    image: "https://images.unsplash.com/photo-1618453292459-53424b66bb6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwb3ZlcnNpemVkJTIwc3RyZWV0d2VhciUyMHRzaGlydHxlbnwxfHx8fDE3ODE3OTcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-24 bg-[#004225] min-h-screen text-[#F3F7F4]">
        {/* Header Banner */}
        <div className="bg-[#004225] border-b border-[#F3F7F4]/10 py-24 mb-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#355E3B]/20 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-serif)] tracking-widest mb-4 flex items-center justify-center gap-4 text-[#F3F7F4]">
                <Sparkles className="w-8 h-8 text-[#4C6B47]" />
                THE THRIFT THEORY ETHOS
              </h1>
              <p className="text-[#E8F0EA]/70 text-xs md:text-sm tracking-[0.25em] uppercase font-bold font-[family-name:var(--font-sans)]">
                VINTAGE FASHION &bull; BRAND ETHICS
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          <div className="flex flex-col space-y-16 md:space-y-32">
            {aboutSections.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-24 items-center ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Box */}
                <div className="w-full lg:w-1/2 aspect-[4/3] relative overflow-hidden bg-[#355E3B] group rounded-sm shadow-2xl">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/80 via-transparent to-transparent" />
                </div>

                {/* Text Box */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left px-4">
                  <span className="text-[#4C6B47] uppercase tracking-[0.25em] text-[10px] font-bold mb-4 font-[family-name:var(--font-sans)]">
                    {section.subtitle}
                  </span>
                  <h2 className="font-[family-name:var(--font-serif)] text-4xl lg:text-5xl text-[#F3F7F4] mb-8 tracking-wide">
                    {section.title}
                  </h2>
                  <p className="text-[#E8F0EA]/80 font-light leading-relaxed mb-10 text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-[family-name:var(--font-sans)]">
                    {section.description}
                  </p>
                  {index === aboutSections.length - 1 && (
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center space-x-3 text-white bg-[#4C6B47] hover:bg-[#355E3B] transition-all px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest shadow-lg mx-auto lg:mx-0 w-fit font-[family-name:var(--font-sans)]"
                    >
                      <span>Join the Movement</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
