"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, Send } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleCheckout = (platform: "whatsapp" | "instagram") => {
    if (items.length === 0) return;

    let message = "Hello ThriftTheory! I'd like to place an order for the following items:\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      if (item.size) message += `   Size: ${item.size}\n`;
      if (item.color) message += `   Color: ${item.color}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
      if (item.image) {
        let imageUrl = item.image;
        if (!imageUrl.startsWith("http") && typeof window !== "undefined") {
          imageUrl = `${window.location.origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        }
        message += `   Image: ${imageUrl}\n`;
      }
      message += `\n`;
    });

    message += `*Total Order Value: ₹${subtotal.toLocaleString("en-IN")}*\n\n`;
    message += "Please let me know if these are available and send payment details.";

    if (platform === "whatsapp") {
      const whatsappUrl = `https://wa.me/918122228386?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else if (platform === "instagram") {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(message).then(() => {
          alert("Order details copied to clipboard! Opening Instagram chat...");
          window.open("https://instagram.com/_.thrift_theory/", "_blank");
        }).catch(() => {
          window.open("https://instagram.com/_.thrift_theory/", "_blank");
        });
      } else {
        window.open("https://instagram.com/_.thrift_theory/", "_blank");
      }
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity duration-500 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[440px] bg-background border-l border-primary/10 z-50 shadow-2xl transition-transform duration-500 flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-card">
          <h2 className="heading-luxury text-xl text-foreground font-serif tracking-wider flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 stroke-[1.5]" />
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Your cart is empty
              </p>
              <button
                onClick={toggleCart}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 border-b border-primary/5 pb-6">
                {/* Image */}
                <div className="relative aspect-square w-20 overflow-hidden bg-secondary border border-primary/10 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground truncate max-w-[200px]">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span>•</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-primary/10">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm hover:bg-secondary transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-6 border-t border-primary/10 bg-card space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Subtotal
              </span>
              <span className="text-lg font-black text-foreground">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={() => handleCheckout("whatsapp")}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                WhatsApp Checkout
              </button>
              
              <button
                onClick={() => handleCheckout("instagram")}
                className="w-full py-4 border border-primary text-foreground hover:bg-secondary text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
