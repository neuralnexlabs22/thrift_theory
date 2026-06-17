"use client";

import { ReactNode } from "react";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ReactLenis } from "@studio-freight/react-lenis";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root>
      <AdminAuthProvider>
        <CatalogProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </CatalogProvider>
      </AdminAuthProvider>
    </ReactLenis>
  );
}
