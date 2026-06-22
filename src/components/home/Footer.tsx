"use client";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#004225] text-white pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Newsletter Section */}
        <div className="mb-20 pb-20 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-4xl lg:text-5xl mb-6">
              Join The Community
            </h2>
            <p className="font-[family-name:var(--font-sans)] text-white/70 mb-8 font-light">
              Subscribe to our newsletter for exclusive drops, early access, and sustainable men's fashion insights
            </p>
            
            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-none font-[family-name:var(--font-sans)] flex-1"
              />
              <Button className="bg-[#4C6B47] hover:bg-[#4C6B47]/90 text-white rounded-none font-[family-name:var(--font-sans)] tracking-wider px-8">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-6">
              Thrift Theory
            </h3>
            <p className="font-[family-name:var(--font-sans)] text-white/70 mb-6 font-light leading-relaxed">
              Redefining luxury men's fashion through sustainability. Premium thrift, curated with care.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#4C6B47] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#4C6B47] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://twitter.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#4C6B47] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-[family-name:var(--font-sans)] tracking-wider mb-6 uppercase text-sm">
              Shop
            </h4>
            <ul className="space-y-3 font-[family-name:var(--font-sans)] text-white/70 font-light">
              <li>
                <a href="/shop" className="hover:text-[#4C6B47] transition-colors">
                  Mystery Bundles
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-[#4C6B47] transition-colors">
                  Vintage Collection
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-[#4C6B47] transition-colors">
                  Oversized Collection
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-[#4C6B47] transition-colors">
                  Premium Picks
                </a>
              </li>
              <li>
                <a href="/custom-design" className="hover:text-[#4C6B47] transition-colors">
                  Custom Design Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-[family-name:var(--font-sans)] tracking-wider mb-6 uppercase text-sm">
              Company
            </h4>
            <ul className="space-y-3 font-[family-name:var(--font-sans)] text-white/70 font-light">
              <li>
                <a href="/" className="hover:text-[#4C6B47] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-[#4C6B47] transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-[#4C6B47] transition-colors">
                  Our Process
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-[#4C6B47] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#4C6B47] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-sans)] tracking-wider mb-6 uppercase text-sm">
              Contact
            </h4>
            <ul className="space-y-4 font-[family-name:var(--font-sans)] text-white/70 font-light">
              <li className="flex gap-3">
                <span>West Mambalam, Chennai</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#4C6B47]" />
                <a href="tel:+917695923756" className="hover:text-[#4C6B47] transition-colors">
                  076959 23756
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#4C6B47]" />
                <a href="mailto:hello@ThriftTheory.com" className="hover:text-[#4C6B47] transition-colors">
                  hello@ThriftTheory.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-[family-name:var(--font-sans)] text-white/50 text-sm">
              &copy; 2026 Thrift Theory. All rights reserved.
            </p>
            <div className="flex gap-6 font-[family-name:var(--font-sans)] text-white/50 text-sm">
              <a href="/" className="hover:text-[#4C6B47] transition-colors">
                Privacy Policy
              </a>
              <a href="/" className="hover:text-[#4C6B47] transition-colors">
                Terms of Service
              </a>
              <a href="/" className="hover:text-[#4C6B47] transition-colors">
                Shipping & Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

