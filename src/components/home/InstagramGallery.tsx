"use client";
import { motion } from 'framer-motion';

const instagramImages = [
  'https://images.unsplash.com/photo-1540924782561-3fc182603b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdmludGFnZSUyMGNsb3RoaW5nJTIwc3R5bGVkJTIwYWVzdGhldGljfGVufDF8fHx8MTc4MTc5NzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZGVuaW0lMjBqYWNrZXQlMjBwcm9kdWN0fGVufDF8fHx8MTc4MTc5NzEzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1634133118553-1e6e18299886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdmludGFnZSUyMGNsb3RoaW5nJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3ODE3OTcxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwb3ZlcnNpemVkJTIwc3RyZWV0d2VhciUyMHRzaGlydHxlbnwxfHx8fDE3ODE3OTcxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1535530705774-695729778c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMGxvb2tib29rJTIwY2FtcGFpZ258ZW58MXx8fHwxNzgxNzk3MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwaG9vZGllJTIwc3RyZWV0d2VhciUyMGZhc2hpb258ZW58MXx8fHwxNzgxNzk3MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export function InstagramGallery() {
  return (
    <section className="py-32 bg-[#F3F7F4]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <svg className="w-8 h-8 text-[#004225]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#004225]">
              Follow Our Journey
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-lg text-[#355E3B] mb-4 font-light">
              @_.thrift_theory
            </p>
            <a href="https://instagram.com/_.thrift_theory" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-sans)] text-sm tracking-wider text-[#004225] hover:text-[#355E3B] transition-colors uppercase">
              Follow on Instagram →
            </a>
          </motion.div>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-md border border-[#4C6B47]/20"
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#004225]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="font-[family-name:var(--font-sans)] text-[#355E3B] mb-4">
            Tag us in your photos for a chance to be featured
          </p>
          <p className="font-[family-name:var(--font-sans)] text-sm text-[#4C6B47] tracking-wider">
            #ThriftTheoryThrift #SustainableLuxury
          </p>
        </motion.div>
      </div>
    </section>
  );
}

