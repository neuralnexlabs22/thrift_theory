"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import CartSidebar from "@/components/CartSidebar";

export function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <CartSidebar />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
