"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    brand: string;
    price: number;
    images: string[];
    category: string;
    isNew?: boolean;
    stock?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart with default options
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/images/hero.png",
      size: "M", // default size
      color: "Default",
      quantity: 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const productUrl = `/products/${product.slug || product.id}`;

  return (
    <div
      className="group flex flex-col bg-card border border-primary/10 relative overflow-hidden transition-luxury hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(138,115,80,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Square Aspect Ratio (Box-style) */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary border-b border-primary/10">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1">
            NEW DROP
          </span>
        )}
        
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1">
            SOLD OUT
          </span>
        )}

        {product.stock === 1 && (
          <span className="absolute top-4 left-4 z-10 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
            1 OF 1
          </span>
        )}

        <Link href={productUrl} className="relative block w-full h-full">
          <Image
            src={product.images[0] || "/images/hero.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        {/* Hover Quick Action Buttons */}
        <div
          className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            type="button"
            onClick={handleWishlist}
            className={`p-3 bg-background border border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors`}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary hover:text-primary-foreground" : ""}`}
            />
          </button>
          
          <Link
            href={productUrl}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-background border border-primary/20 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>

          {product.stock !== 0 && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-3 bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-colors"
              aria-label="Quick Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <Link href={productUrl} className="flex flex-col p-5 flex-1 bg-card">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1.5">
          {product.brand}
        </span>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary/5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            {product.category}
          </span>
          <p className="text-sm font-bold text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </Link>
    </div>
  );
}
