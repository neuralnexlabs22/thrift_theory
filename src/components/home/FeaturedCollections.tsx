"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { useRef } from 'react';
import Link from 'next/link';

const collections = [
  {
    id: 1,
    name: 'Vintage Men\'s Collection',
    description: 'Timeless pieces for the modern gentleman',
    image: 'https://images.unsplash.com/photo-1634133118553-1e6e18299886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdmludGFnZSUyMGNsb3RoaW5nJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3ODE3OTcxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '240+ Items',
  },
  {
    id: 2,
    name: 'Oversized Collection',
    description: 'Contemporary men\'s streetwear',
    image: 'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwb3ZlcnNpemVkJTIwc3RyZWV0d2VhciUyMHRzaGlydHxlbnwxfHx8fDE3ODE3OTcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '180+ Items',
  },
  {
    id: 3,
    name: 'Premium Picks',
    description: 'Luxury men\'s brands, thrift prices',
    image: 'https://images.unsplash.com/photo-1654005018306-7066fc118281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMGVkaXRvcmlhbCUyMG1vZGVsfGVufDF8fHx8MTc4MTc5NzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '95+ Items',
  },
];

export function FeaturedCollections() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="py-32 bg-[#355E3B]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.3em] text-[#004225] font-semibold mb-6 uppercase">
              Explore Our World
            </p>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#F3F7F4]">
              Featured Collections
            </h2>
          </motion.div>
        </div>

        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Large Featured Item */}
          <motion.div
            style={{ y: y1 }}
            className="lg:row-span-2"
          >
            <div className="group relative h-full min-h-[600px] overflow-hidden rounded-lg shadow-2xl">
              <img
                src={collections[0].image}
                alt={collections[0].name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/90 via-[#004225]/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-12 text-[#F3F7F4]">
                <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.2em] mb-3 opacity-80 uppercase">
                  {collections[0].count}
                </p>
                <h3 className="font-[family-name:var(--font-serif)] text-5xl mb-4 text-[#F3F7F4]">
                  {collections[0].name}
                </h3>
                <p className="font-[family-name:var(--font-sans)] text-lg mb-6 opacity-90 font-light text-[#E8F0EA]">
                  {collections[0].description}
                </p>
                <Link href="/shop">
                  <Button
                    className="bg-[#004225] hover:bg-[#4C6B47] text-[#F3F7F4] rounded-none font-[family-name:var(--font-sans)] tracking-wider px-8 border border-[#4C6B47]"
                  >
                    EXPLORE COLLECTION
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Two Smaller Items */}
          <div className="grid grid-rows-2 gap-8">
            {collections.slice(1).map((collection, index) => (
              <motion.div
                key={collection.id}
                style={{ y: index === 0 ? y2 : y1 }}
              >
                <div className="group relative h-full min-h-[280px] overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/90 via-[#004225]/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F3F7F4]">
                    <p className="font-[family-name:var(--font-sans)] text-xs tracking-[0.2em] mb-2 opacity-80 uppercase">
                      {collection.count}
                    </p>
                    <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-[#F3F7F4]">
                      {collection.name}
                    </h3>
                    <p className="font-[family-name:var(--font-sans)] text-sm opacity-90 font-light mb-4 text-[#E8F0EA]">
                      {collection.description}
                    </p>
                    <Link href="/shop">
                      <button className="font-[family-name:var(--font-sans)] text-sm tracking-wider opacity-90 hover:text-[#4C6B47] transition-colors">
                        DISCOVER →
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

