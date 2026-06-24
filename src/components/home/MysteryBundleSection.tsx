"use client";
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Package } from 'lucide-react';
import Link from 'next/link';

const bundles = [
  {
    id: 1,
    name: '10 Shirts Bundle',
    description: '10 shirts for 1000',
    price: '₹1,000',
    image: 'https://images.unsplash.com/photo-1540924782561-3fc182603b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdmludGFnZSUyMGNsb3RoaW5nJTIwc3R5bGVkJTIwYWVzdGhldGljfGVufDF8fHx8MTc4MTc5NzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Most Popular',
    href: '/bundles',
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Premium oversized men\'s streetwear and vintage essentials',
    price: 'Explore',
    image: 'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwb3ZlcnNpemVkJTIwc3RyZWV0d2VhciUyMHRzaGlydHxlbnwxfHx8fDE3ODE3OTcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Limited',
    href: '/shop',
  },
  {
    id: 3,
    name: 'Design Customisation',
    description: 'Transform your artwork into premium wearable vintage pieces',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1578198576866-7e0ba6078128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdmludGFnZSUyMGphY2tldCUyMGZhc2hpb258ZW58MXx8fHwxNzgxNzk3MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Exclusive',
    href: '/custom',
  },
];

export function MysteryBundleSection() {
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
              <div className="w-12 h-[1px] bg-[#355E3B]" />
              <Package className="w-5 h-5 text-[#355E3B]" />
              <div className="w-12 h-[1px] bg-[#355E3B]" />
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#004225]">
              Explore Our Services
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-lg text-[#355E3B] max-w-2xl mx-auto font-light">
              Dive into our curated collections or personalize your own pieces with our design customisation studio.
            </p>
          </motion.div>
        </div>

        {/* Bundle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group border border-[#4C6B47]/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white rounded-lg h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Link href={bundle.href}>
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer" />
                  </Link>
                  
                  {/* Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-[#355E3B] text-white px-4 py-2 text-xs font-[family-name:var(--font-sans)] tracking-wider uppercase backdrop-blur-sm shadow-md">
                      {bundle.badge}
                    </span>
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Button className="w-full bg-white hover:bg-[#F3F7F4] text-[#004225] border border-[#004225] rounded-none font-[family-name:var(--font-sans)] tracking-wider">
                      QUICK ADD
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <Link href={bundle.href}>
                    <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-3 text-[#004225] hover:underline cursor-pointer">
                      {bundle.name}
                    </h3>
                  </Link>
                  <p className="font-[family-name:var(--font-sans)] text-[#4C6B47] mb-6 text-base flex-1">
                    {bundle.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-[family-name:var(--font-serif)] text-4xl text-[#004225]">
                      {bundle.price}
                    </span>
                    <Link href={bundle.href}>
                      <Button
                        variant="ghost"
                        className="text-[#355E3B] hover:text-[#004225] font-[family-name:var(--font-sans)] tracking-wide p-0 h-auto"
                      >
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


