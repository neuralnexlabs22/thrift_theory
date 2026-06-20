"use client";
import dynamic from "next/dynamic";
import { HeroSection } from '@/components/home/HeroSection';

// Lazy-load all below-the-fold sections — reduces initial JS bundle significantly
const MysteryBundleSection = dynamic(() => import('@/components/home/MysteryBundleSection').then(m => ({ default: m.MysteryBundleSection })), { ssr: false });
const FeaturedCollections = dynamic(() => import('@/components/home/FeaturedCollections').then(m => ({ default: m.FeaturedCollections })), { ssr: false });
const LookbookGallery = dynamic(() => import('@/components/home/LookbookGallery').then(m => ({ default: m.LookbookGallery })), { ssr: false });
const ShopCollection = dynamic(() => import('@/components/home/ShopCollection').then(m => ({ default: m.ShopCollection })), { ssr: false });
const CustomDesignStudio = dynamic(() => import('@/components/home/CustomDesignStudio').then(m => ({ default: m.CustomDesignStudio })), { ssr: false });
const BrandStory = dynamic(() => import('@/components/home/BrandStory').then(m => ({ default: m.BrandStory })), { ssr: false });
const Testimonials = dynamic(() => import('@/components/home/Testimonials').then(m => ({ default: m.Testimonials })), { ssr: false });
const InstagramGallery = dynamic(() => import('@/components/home/InstagramGallery').then(m => ({ default: m.InstagramGallery })), { ssr: false });

export default function Home() {
  return (
    <div className="bg-[#F3F7F4]">
      <HeroSection />
      <MysteryBundleSection />
      <FeaturedCollections />
      <LookbookGallery />
      <ShopCollection />
      <CustomDesignStudio />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
    </div>
  );
}
