"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
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
      className="group flex flex-col relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary rounded-xl">
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
            NEW DROP
          </span>
        )}
        
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
            SOLD OUT
          </span>
        )}

        {product.stock === 1 && (
          <span className="absolute top-3 left-3 z-10 bg-amber-700 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
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
          {/* Subtle gradient overlay to ensure icons pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Hover Quick Action Buttons (Bottom Right) */}
        <div
          className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={handleWishlist}
            className="p-2.5 rounded-full bg-background/90 backdrop-blur-md text-foreground shadow-lg hover:bg-background transition-all hover:scale-105 active:scale-95"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : "text-foreground"}`}
            />
          </button>

          {product.stock !== 0 && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2.5 rounded-full bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(0,66,37,0.4)] hover:brightness-110 transition-all hover:scale-105 active:scale-95"
              aria-label="Quick Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info Section - Left Aligned, Transparent */}
      <Link href={productUrl} className="flex flex-col pt-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
          {product.brand && product.brand !== "ThriftTheory" ? product.brand : product.category}
        </span>
        <h3 className="text-sm font-black text-foreground uppercase tracking-widest line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-[13px] font-black text-primary mt-1.5">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </Link>
    </div>
  );
}
