"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-8 w-full z-40 glass px-6 md:px-10 py-5 flex justify-between items-center transition-luxury">
      {/* Brand logo */}
      <Link href="/" className="heading-luxury text-2xl tracking-[0.2em] text-primary hover:brightness-95 transition-all">
        Thrift Theory
      </Link>

      {/* Navigation links */}
      <div className="hidden md:flex gap-10 text-xs uppercase tracking-[0.25em] text-foreground font-semibold">
        <Link href="/bundles" className="hover:text-primary transition-colors">
          Mystery Bundles
        </Link>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop Mens
        </Link>
        <Link href="/custom" className="hover:text-primary transition-colors">
          Custom Design
        </Link>
        <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-primary/80" />
          Admin
        </Link>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleCart}
          className="text-xs uppercase tracking-widest border border-primary px-5 py-2.5 flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-luxury font-bold bg-transparent"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Cart ({totalItems})</span>
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-primary/10 shadow-lg p-6 flex flex-col gap-5 md:hidden z-40 animate-in fade-in slide-in-from-top-5 duration-200">
          <Link
            href="/bundles"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary"
          >
            Mystery Bundles
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary"
          >
            Shop Mens
          </Link>
          <Link
            href="/custom"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary"
          >
            Custom Design
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-primary" />
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
