import { motion } from 'framer-motion';

export function BrandStory() {
  return (
    <section className="py-32 bg-[#355E3B]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1709004915865-38bc70f4cb78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwc3R1ZGlvfGVufDF8fHx8MTc4MTc5NzE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Brand Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004225]/40 to-transparent" />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#004225]/20 rounded-full -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="font-[family-name:var(--font-sans)] text-sm tracking-[0.3em] text-[#004225] font-semibold mb-6 uppercase">
                Our Story
              </p>
              <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-8 tracking-tight leading-tight text-[#F3F7F4]">
                Where Luxury Meets Sustainability
              </h2>
            </div>

            <div className="space-y-6 font-[family-name:var(--font-sans)] text-lg text-[#E8F0EA] font-light leading-relaxed">
              <p>
                Founded in 2024, Thrift Theory reimagines the luxury men's thrift experience. We believe that sustainability 
                and style are not mutually exclusive—they're essential partners in creating a better fashion future for the modern gentleman.
              </p>

              <p>
                Every piece in our collection is hand-selected by our expert curators who understand the value 
                of quality craftsmanship and timeless design. From vintage treasures to contemporary streetwear, 
                we offer an exclusive selection that tells a story.
              </p>

              <p>
                Our mystery bundles bring the excitement of discovery to sustainable men's fashion, while our custom 
                design studio transforms pre-loved garments into personalized works of art.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#4C6B47]/30">
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-4xl mb-2 text-[#F3F7F4]">10K+</h3>
                <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                  Pieces Curated
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-4xl mb-2 text-[#F3F7F4]">5K+</h3>
                <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                  Happy Customers
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-4xl mb-2 text-[#F3F7F4]">100%</h3>
                <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                  Sustainable
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

