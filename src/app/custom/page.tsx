"use client";

import Link from "next/link";
import Image from "next/image";

export default function CustomDesignPage() {
  return (
    <main className="min-h-screen bg-[#F3F7F4] pt-32 pb-24 text-[#004225]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-1/2">
            <h1 className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-[#004225] mb-6 tracking-tight">Your Design.<br/>Our Blank.</h1>
            <p className="text-lg text-[#355E3B] mb-12 font-light">
              Transform your artwork into premium streetwear. We print on luxury heavyweight blanks designed for the perfect oversized fit.
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">First Name</label>
                  <input type="text" className="w-full bg-white border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Last Name</label>
                  <input type="text" className="w-full bg-white border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="Last Name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Email Address</label>
                <input type="email" className="w-full bg-white border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="Email Address" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Garment Type</label>
                <select className="w-full bg-white border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm cursor-pointer">
                  <option>Heavyweight Oversized Tee</option>
                  <option>Premium Vintage Wash Hoodie</option>
                  <option>Classic Crewneck</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Upload Artwork</label>
                <div className="border-2 border-dashed border-[#355E3B]/40 bg-[#E8F0EA]/50 p-12 text-center cursor-pointer hover:border-[#004225] transition-all duration-300">
                  <p className="text-[#355E3B] font-medium">Drag and drop your design here, or click to browse.</p>
                  <p className="text-xs text-[#4C6B47] mt-2">Supports PNG, JPG, SVG up to 10MB.</p>
                </div>
              </div>
              
              <button type="button" className="w-full bg-[#004225] text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#355E3B] hover:shadow-lg transition-all duration-300 mt-8">
                Submit Request
              </button>
            </form>
          </div>
          
          <div className="w-full lg:w-1/2 relative h-[800px] hidden lg:block overflow-hidden rounded-sm shadow-2xl">
             <Image 
                src="/images/lookbook.png" 
                alt="Custom Design Blank" 
                fill 
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
