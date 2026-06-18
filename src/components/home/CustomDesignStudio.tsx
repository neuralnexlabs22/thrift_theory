"use client";
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, Palette, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    icon: Upload,
    title: 'Upload Your Design',
    description: 'Drag & drop or browse your artwork',
  },
  {
    id: 2,
    icon: Palette,
    title: 'Choose Your Garment',
    description: 'Select from our premium thrift pieces',
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'We Create Magic',
    description: 'Professional printing on vintage clothing',
  },
];

export function CustomDesignStudio() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
  };

  return (
    <section className="py-32 bg-[#F3F7F4]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#355E3B]" />
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#004225]">
              Custom Design Studio
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-lg text-[#355E3B] max-w-2xl mx-auto font-light">
              Transform vintage pieces into wearable art with your custom designs
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              className="border border-[#4C6B47]/30 hover:border-[#355E3B] transition-colors duration-300 bg-white shadow-xl p-12 rounded-lg"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`text-center transition-all duration-300 ${isDragging ? 'scale-95 opacity-70' : ''}`}>
                <div className="w-24 h-24 mx-auto mb-8 bg-[#F3F7F4] border-2 border-dashed border-[#4C6B47]/40 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-[#355E3B]" />
                </div>
                
                <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-4 text-[#004225]">
                  Upload Your Design
                </h3>
                
                <p className="font-[family-name:var(--font-sans)] text-[#355E3B] mb-8 font-light">
                  Drag and drop your artwork here, or click to browse
                </p>

                <Button
                  className="bg-[#004225] hover:bg-[#355E3B] text-white rounded-none font-[family-name:var(--font-sans)] tracking-wider px-8"
                >
                  BROWSE FILES
                </Button>

                <p className="font-[family-name:var(--font-sans)] text-sm text-[#4C6B47] mt-6">
                  Supported: PNG, JPG, SVG, PDF (Max 10MB)
                </p>
              </div>
            </Card>

            {/* Preview */}
            <div className="mt-8 p-6 bg-white shadow-md rounded-lg border border-[#4C6B47]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F3F7F4] rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-[#355E3B]" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-sans)] text-sm text-[#004225]">
                      Choose from 50+ premium garments
                    </p>
                    <p className="font-[family-name:var(--font-sans)] text-xs text-[#4C6B47]">
                      T-shirts, hoodies, jackets & more
                    </p>
                  </div>
                </div>
                <Link href="/shop">
                  <Button
                    variant="ghost"
                    className="text-[#355E3B] hover:text-[#004225] font-[family-name:var(--font-sans)] text-sm"
                  >
                    Browse →
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="mb-12">
              <h3 className="font-[family-name:var(--font-serif)] text-4xl mb-4 text-[#004225]">
                How It Works
              </h3>
              <p className="font-[family-name:var(--font-sans)] text-[#355E3B] font-light">
                Three simple steps to create your unique custom piece
              </p>
            </div>

            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-6 group">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white border border-[#4C6B47]/30 group-hover:border-[#355E3B] group-hover:bg-[#355E3B] rounded-full flex items-center justify-center shadow-sm transition-all duration-300">
                    <step.icon className="w-7 h-7 text-[#004225] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8 border-b border-[#4C6B47]/20 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-[family-name:var(--font-serif)] text-2xl text-[#004225]">
                      {step.title}
                    </h4>
                    <span className="font-[family-name:var(--font-sans)] text-sm text-[#355E3B]">
                      Step {step.id}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-sans)] text-[#4C6B47] font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Features */}
            <Card className="bg-[#004225] text-[#F3F7F4] p-8 border-none rounded-lg shadow-2xl">
              <h4 className="font-[family-name:var(--font-serif)] text-2xl mb-6 text-[#F3F7F4]">
                Premium Features
              </h4>
              <div className="space-y-4">
                {[
                  'Professional DTG printing',
                  'Eco-friendly water-based inks',
                  'Quality guaranteed vintage garments',
                  'Fast 5-7 day turnaround',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#355E3B] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="font-[family-name:var(--font-sans)] text-sm font-light text-[#E8F0EA]">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

