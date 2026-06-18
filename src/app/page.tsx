"use client";
import { HeroSection } from '@/components/home/HeroSection';
import { MysteryBundleSection } from '@/components/home/MysteryBundleSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { LookbookGallery } from '@/components/home/LookbookGallery';
import { ShopCollection } from '@/components/home/ShopCollection';
import { CustomDesignStudio } from '@/components/home/CustomDesignStudio';
import { BrandStory } from '@/components/home/BrandStory';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramGallery } from '@/components/home/InstagramGallery';

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
