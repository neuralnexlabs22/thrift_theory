"use client";
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbW9kZWwlMjBmYXNoaW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgxNzk3MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    text: 'The mystery bundle exceeded all expectations. Every piece was carefully selected and the quality is exceptional. This is luxury men\'s thrifting done right.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1709004915865-38bc70f4cb78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwc3R1ZGlvfGVufDF8fHx8MTc4MTc5NzE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    text: "ThriftTheory's custom design studio is a game-changer. They transformed my artwork into wearable pieces that feel both vintage and contemporary. Absolutely brilliant.",
    rating: 5,
  },
  {
    id: 3,
    name: 'David Thompson',
    role: 'Sustainability Advocate',
    image: 'https://images.unsplash.com/photo-1649114383220-c4f0f0dbafbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc3RyZWV0d2VhciUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzgxNzk3MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    text: 'Finally, a brand that proves sustainable men\'s fashion can be luxurious. The curation is impeccable, and every purchase feels meaningful.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[#004225]">
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
              <Quote className="w-5 h-5 text-[#4C6B47]" />
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-5xl lg:text-6xl mb-6 tracking-tight text-[#F3F7F4]">
              What Our Clients Say
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-lg text-[#E8F0EA] max-w-2xl mx-auto font-light">
              Join thousands of satisfied customers who've discovered the luxury of sustainable men's fashion
            </p>
          </motion.div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-[#355E3B] border border-[#4C6B47]/30 shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 rounded-lg h-full flex flex-col">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F3F7F4] text-[#F3F7F4]" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="font-[family-name:var(--font-sans)] text-[#F3F7F4] mb-8 leading-relaxed flex-1">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-[#4C6B47]/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#004225] border border-[#4C6B47]/30">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-serif)] text-lg text-[#F3F7F4]">
                      {testimonial.name}
                    </h4>
                    <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 pt-16 border-t border-[#4C6B47]/30"
        >
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-[#F3F7F4]">4.9/5</h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                Average Rating
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-[#F3F7F4]">2,500+</h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                Reviews
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-[#F3F7F4]">98%</h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[#E8F0EA]">
                Recommended
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

