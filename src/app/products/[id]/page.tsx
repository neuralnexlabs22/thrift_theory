"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const decodedId = decodeURIComponent(rawId);
  
  const { products, loaded } = useProducts();
  const { addToCart } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Find the product by id or slug
  const product = useMemo(() => {
    return products.find(
      (p) => p.id === decodedId || p.slug === decodedId || p.name.toLowerCase().replace(/\s+/g, "-") === decodedId
    );
  }, [products, decodedId]);

  // Set default selected size and color once product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="heading-luxury text-3xl text-primary mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The item you are looking for does not exist or has been sold.</p>
          <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold hover:bg-foreground transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/images/hero.png",
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const generateWhatsAppUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const itemUrl = `${origin}/products/${product.id}`;
    const message = `Hello ThriftTheory, I am interested in buying this item:\n\n*Product:* ${product.name}\n*Brand:* ${product.brand}\n*Price:* ₹${product.price.toLocaleString("en-IN")}\n*Size Selected:* ${selectedSize || "N/A"}\n*Color Selected:* ${selectedColor || "N/A"}\n*Product URL:* ${itemUrl}\n\nIs this item still available for order?`;
    return `https://wa.me/918122228386?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">


      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Back Link */}
        <Link
          href={`/shop/${product.category.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to {product.category}
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Images Section (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 md:w-20">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square w-16 md:w-full overflow-hidden bg-secondary border transition-colors ${
                      activeImage === idx ? "border-primary" : "border-primary/10 hover:border-primary/40"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} Thumb ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Active Image Display */}
            <div className="relative aspect-square flex-1 overflow-hidden bg-secondary border border-primary/10">
              <Image
                src={product.images[activeImage] || "/images/hero.png"}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              {product.stock === 1 && (
                <span className="absolute top-4 left-4 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  1 OF 1 VINTAGE
                </span>
              )}
            </div>
          </div>

          {/* Info details Section (Right 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Brand */}
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              {product.brand}
            </span>

            {/* Name */}
            <h1 className="heading-luxury text-3xl md:text-4xl lg:text-5xl text-foreground font-serif mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Category Breadcrumb */}
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-primary/10 pb-4">
              Category: <span className="text-foreground">{product.category}</span>
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-black text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Inclusive of all taxes & local shipping
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size & Color Selections */}
            <div className="space-y-6 mb-8">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[3rem] h-10 border text-xs font-bold transition-colors flex items-center justify-center px-3 ${
                          selectedSize === sz
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/20 text-foreground hover:border-primary/60 hover:bg-secondary"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    Select Color
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`h-10 border text-xs font-bold transition-colors flex items-center justify-center px-4 ${
                          selectedColor === col
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/20 text-foreground hover:border-primary/60 hover:bg-secondary"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              {product.stock !== 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-5 text-xs font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2 ${
                    cartSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{cartSuccess ? "Added to Cart!" : "Add to Cart"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-5 bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center"
                >
                  Sold Out
                </button>
              )}

              {/* WhatsApp Button */}
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-4 border text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  isWishlisted
                    ? "border-primary text-primary bg-secondary/30"
                    : "border-primary/20 text-foreground hover:border-primary"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary" : ""}`} />
                <span>{isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-primary/10 pt-8 text-center text-[9px] font-bold tracking-widest text-muted-foreground">
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <Truck className="w-4 h-4 text-primary mb-2" />
                <span>EXPRESS INDIA SHIPPING</span>
              </div>
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-primary mb-2" />
                <span>100% AUTHENTICATE</span>
              </div>
              <div className="bg-card border border-primary/5 p-3 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-primary mb-2" />
                <span>SECURE PAYMENTS</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
