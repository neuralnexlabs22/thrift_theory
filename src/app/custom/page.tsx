"use client";

import Link from "next/link";
import Image from "next/image";

export default function CustomDesignPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">


      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-1/2">
            <h1 className="heading-luxury text-5xl md:text-7xl text-foreground mb-6">Your Design.<br/>Our Blank.</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Transform your artwork into premium streetwear. We print on luxury heavyweight blanks designed for the perfect oversized fit.
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium">First Name</label>
                  <input type="text" className="w-full bg-secondary border-none p-4 text-foreground focus:ring-1 focus:ring-primary outline-none" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium">Last Name</label>
                  <input type="text" className="w-full bg-secondary border-none p-4 text-foreground focus:ring-1 focus:ring-primary outline-none" placeholder="Last Name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium">Email Address</label>
                <input type="email" className="w-full bg-secondary border-none p-4 text-foreground focus:ring-1 focus:ring-primary outline-none" placeholder="Email Address" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium">Garment Type</label>
                <select className="w-full bg-secondary border-none p-4 text-foreground focus:ring-1 focus:ring-primary outline-none">
                  <option>Heavyweight Oversized Tee</option>
                  <option>Premium Vintage Wash Hoodie</option>
                  <option>Classic Crewneck</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium">Upload Artwork</label>
                <div className="border-2 border-dashed border-border bg-secondary p-12 text-center cursor-pointer hover:border-primary transition-luxury">
                  <p className="text-muted-foreground">Drag and drop your design here, or click to browse.</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">Supports PNG, JPG, SVG up to 10MB.</p>
                </div>
              </div>
              
              <button type="button" className="w-full bg-foreground text-background py-5 uppercase tracking-widest hover:bg-primary transition-luxury mt-8">
                Submit Request
              </button>
            </form>
          </div>
          
          <div className="w-full lg:w-1/2 relative h-[800px] hidden lg:block">
             <Image 
                src="/images/lookbook.png" 
                alt="Custom Design Blank" 
                fill 
                className="object-cover rounded-md opacity-90"
              />
          </div>
        </div>
      </div>
    </main>
  );
}
