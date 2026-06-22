"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-[#F3F7F4] min-h-screen text-[#004225]">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-serif)] tracking-wide mb-6">
                Get in Touch
              </h1>
              <p className="text-[#355E3B] font-light text-base md:text-lg max-w-2xl mx-auto font-[family-name:var(--font-sans)]">
                Whether you have a question about our collections, need help with sizing, or want to inquire about custom designs, our team is here for you.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-[family-name:var(--font-serif)] mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[#4C6B47] mt-1" />
                    <div>
                      <p className="font-bold text-sm tracking-widest uppercase mb-1 font-[family-name:var(--font-sans)]">Email</p>
                      <a href="mailto:hello@thrifttheory.com" className="text-[#355E3B] hover:text-[#004225] transition-colors font-light">hello@thrifttheory.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-[#4C6B47] mt-1" />
                    <div>
                      <p className="font-bold text-sm tracking-widest uppercase mb-1 font-[family-name:var(--font-sans)]">Phone</p>
                      <a href="tel:+917695923756" className="text-[#355E3B] hover:text-[#004225] transition-colors font-light">076959 23756</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#4C6B47] mt-1" />
                    <div>
                      <p className="font-bold text-sm tracking-widest uppercase mb-1 font-[family-name:var(--font-sans)]">Studio</p>
                      <p className="text-[#355E3B] font-light leading-relaxed">
                        West Mambalam<br />
                        Chennai, Tamil Nadu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-[family-name:var(--font-serif)] mb-6">Follow Us</h2>
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 border border-[#4C6B47]/30 rounded-full flex items-center justify-center text-[#004225] font-bold text-sm hover:bg-[#004225] hover:text-white transition-all duration-300">
                    IG
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-12 h-12 border border-[#4C6B47]/30 rounded-full flex items-center justify-center text-[#004225] font-bold text-sm hover:bg-[#004225] hover:text-white transition-all duration-300">
                    TW
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-12 h-12 border border-[#4C6B47]/30 rounded-full flex items-center justify-center text-[#004225] font-bold text-sm hover:bg-[#004225] hover:text-white transition-all duration-300">
                    FB
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form className="bg-white p-8 md:p-10 shadow-xl rounded-sm border border-[#4C6B47]/10 space-y-6">
                <h2 className="text-2xl font-[family-name:var(--font-serif)] mb-8">Send a Message</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">First Name</label>
                    <input type="text" className="w-full bg-[#F3F7F4]/50 border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Last Name</label>
                    <input type="text" className="w-full bg-[#F3F7F4]/50 border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="Last Name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Email Address</label>
                  <input type="email" className="w-full bg-[#F3F7F4]/50 border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="Email Address" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Subject</label>
                  <input type="text" className="w-full bg-[#F3F7F4]/50 border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50" placeholder="How can we help?" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#004225]">Message</label>
                  <textarea rows={5} className="w-full bg-[#F3F7F4]/50 border border-[#4C6B47]/20 p-4 text-[#004225] focus:ring-1 focus:ring-[#355E3B] outline-none shadow-sm placeholder:text-[#4C6B47]/50 resize-none" placeholder="Your message here..." />
                </div>

                <button type="button" className="w-full bg-[#004225] text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#355E3B] hover:shadow-lg transition-all duration-300 mt-4">
                  Send Message
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
