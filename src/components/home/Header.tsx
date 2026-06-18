"use client";
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { 
    label: 'Clothing', 
    href: '/shop',
    dropdown: [
      { label: '10 Bundle', href: '/bundles' },
      { label: 'Clothing', href: '/shop' },
      { label: 'Customization', href: '/custom' },
    ]
  },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export function Header() {
  const { toggleCart, totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F3F7F4]/85 backdrop-blur-md border-b border-[#004225]/10">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-[#004225]/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-[#004225]" />
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/">
              <h1 className="font-[family-name:var(--font-serif)] tracking-wide text-[#004225]">
                <span className="text-2xl lg:text-3xl">ThriftTheory</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 flex-1 justify-center h-full">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group h-full flex items-center">
                <Link 
                  href={link.href} 
                  className="font-[family-name:var(--font-sans)] tracking-wider text-sm text-[#004225] hover:text-[#4C6B47] transition-colors uppercase flex items-center gap-1"
                >
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-[#F3F7F4] border border-[#004225]/10 shadow-2xl rounded-sm flex flex-col w-48 overflow-hidden py-2">
                      {link.dropdown.map(subItem => (
                        <Link 
                          key={subItem.label} 
                          href={subItem.href}
                          className="px-6 py-3 font-[family-name:var(--font-sans)] tracking-wider text-xs text-[#004225] hover:bg-[#004225] hover:text-white transition-colors uppercase"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 text-[#004225]">
            <button className="hidden lg:block p-2 hover:bg-[#004225]/5 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block p-2 hover:bg-[#004225]/5 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button onClick={toggleCart} className="p-2 hover:bg-[#004225]/5 rounded-lg transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4C6B47] text-white text-xs rounded-full flex items-center justify-center font-[family-name:var(--font-sans)]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 sm:w-1/2 bg-[#F3F7F4] z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#004225]/10 flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-2xl text-[#004225]">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#004225]/5 rounded-lg transition-colors text-[#004225]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <div key={link.label} className="border-b border-[#004225]/10 pb-4">
                    <Link 
                      href={link.href} 
                      onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                      className="font-[family-name:var(--font-sans)] tracking-widest text-lg text-[#004225] hover:text-[#4C6B47] transition-colors uppercase flex justify-between items-center"
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-[#004225]/20">
                        {link.dropdown.map(subItem => (
                          <Link 
                            key={subItem.label} 
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-[family-name:var(--font-sans)] tracking-widest text-sm text-[#004225]/80 hover:text-[#4C6B47] transition-colors uppercase"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="p-6 border-t border-[#004225]/10 flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#004225] text-[#004225] uppercase text-xs tracking-wider hover:bg-[#004225] hover:text-white transition-colors">
                  <User className="w-4 h-4" /> Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
