"use client";
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Vintage Denim Jacket',
    category: 'Outerwear',
    price: '₹85',
    originalPrice: '₹220',
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZGVuaW0lMjBqYWNrZXQlMjBwcm9kdWN0fGVufDF8fHx8MTc4MTc5NzEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'New',
  },
  {
    id: 2,
    name: 'Oversized Black Tee',
    category: 'T-Shirts',
    price: '₹45',
    originalPrice: '₹95',
    image: 'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwb3ZlcnNpemVkJTIwc3RyZWV0d2VhciUyMHRzaGlydHxlbnwxfHx8fDE3ODE3OTcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Trending',
  },
  {
    id: 3,
    name: 'Classic Flannel Shirt',
    category: 'Shirts',
    price: '₹55',
    originalPrice: '₹140',
    image: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmxhbm5lbCUyMHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3ODE3OTcxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
  },
  {
    id: 4,
    name: 'Premium Hoodie',
    category: 'Streetwear',
    price: '₹75',
    originalPrice: '₹180',
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwaG9vZGllJTIwc3RyZWV0d2VhciUyMGZhc2hpb258ZW58MXx8fHwxNzgxNzk3MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Limited',
  },
];

export function ShopCollection() {
  return (
    <section className="py-32 bg-[#004225]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.3em] text-[#4C6B47] mb-6 uppercase">
              Curated Selection
            </p>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#E8F0EA]">
              Shop The Collection
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-lg text-[#E8F0EA]/80 max-w-2xl mx-auto font-light">
              Every piece is hand-selected for quality, style, and timeless appeal
            </p>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg bg-[#355E3B] border border-[#4C6B47]/30 shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4C6B47] text-white px-3 py-1.5 text-xs font-[family-name:var(--font-sans)] tracking-wider uppercase">
                    {product.badge}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-[#004225] hover:bg-[#355E3B] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-[#004225] hover:bg-[#355E3B] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick View */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Button className="w-full bg-[#355E3B] hover:bg-[#4C6B47] text-white rounded-none font-[family-name:var(--font-sans)] tracking-wider text-sm border border-[#4C6B47]">
                    QUICK VIEW
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <p className="font-[family-name:var(--font-sans)] text-xs tracking-[0.2em] text-[#4C6B47] uppercase">
                  {product.category}
                </p>
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-[#F3F7F4]">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-sans)] text-[#F3F7F4]">
                    {product.price}
                  </span>
                  <span className="font-[family-name:var(--font-sans)] text-sm text-[#4C6B47] line-through">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-transparent border-2 border-[#4C6B47] hover:bg-[#4C6B47] text-[#4C6B47] hover:text-white rounded-none font-[family-name:var(--font-sans)] tracking-wider px-12 transition-all"
            >
              VIEW ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


