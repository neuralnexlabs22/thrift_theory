"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal, Tag, Box, ChevronDown, ChevronUp } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCatalog } from "@/context/CatalogContext";
import ProductCard from "@/components/ProductCard";

export default function CategoryShopPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
  const { products, loaded: productsLoaded } = useProducts();
  const { brands, categories, loading: catalogLoading } = useCatalog();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setMounted(true);
  }, []);

  const category = useMemo(() => {
    if (!categorySlug) return undefined;
    const decodedSlug = decodeURIComponent(categorySlug).toLowerCase().trim();
    return categories.find(
      (c) => c.slug?.toLowerCase().trim() === decodedSlug || c.name?.toLowerCase().trim() === decodedSlug
    );
  }, [categories, categorySlug]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    // Category slug matching
    return products.filter(
      (p) => p.category.toLowerCase() === category.name.toLowerCase() || p.category.toLowerCase() === category.slug.toLowerCase()
    );
  }, [products, category]);

  const categoryBrands = useMemo(() => {
    const uniqueBrands = new Map();
    brands
      .filter((b) => b.category_id.toLowerCase() === categorySlug.toLowerCase() && b.is_active !== false)
      .forEach((b) => {
        if (!uniqueBrands.has(b.name)) {
          uniqueBrands.set(b.name, { name: b.name, description: b.description });
        }
      });
    return Array.from(uniqueBrands.values());
  }, [brands, categorySlug]);

  const brandProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [categoryProducts]);

  const filteredBrandsList = useMemo(() => {
    if (!searchQuery.trim()) return categoryBrands;
    return categoryBrands.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoryBrands, searchQuery]);

  const sortedAndFilteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Sort order
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: newest drop or featured first
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [categoryProducts, selectedBrand, sortBy]);

  const handleBrandSelect = (brandName: string | null) => {
    setSelectedBrand(brandName);
    setIsMobileCollapsed(true);
    setIsScrolling(true);

    setTimeout(() => {
      const element = document.getElementById("products-section");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setTimeout(() => setIsScrolling(false), 500);
    }, 100);
  };

  if (!mounted || catalogLoading || !productsLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="heading-luxury text-3xl text-primary mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested category does not exist in our shop.</p>
          <Link href="/shop" className="px-8 py-3 bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold hover:bg-foreground transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Find banner image based on category
  const bannerImage = categorySlug === "hoodies"
    ? "/images/categories/hoodies.png"
    : categorySlug === "t-shirts"
    ? "/images/categories/tees.png"
    : categorySlug === "bottoms"
    ? "/images/categories/bottoms.png"
    : categorySlug === "outerwear"
    ? "/images/lookbook.png"
    : "/images/categories/accessories.png";

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Breadcrumb Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to collections
        </Link>

        {/* Main Grid: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column: Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-6">
              <div
                className="flex items-center justify-between cursor-pointer lg:cursor-default border-b border-primary/10 pb-4 lg:border-0 lg:pb-0"
                onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
              >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                    Brands Directory
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-secondary text-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    {categoryBrands.length}
                  </span>
                  <div className="lg:hidden ml-2">
                    {isMobileCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Active Filter display on mobile */}
              {isMobileCollapsed && selectedBrand && (
                <div className="lg:hidden flex items-center justify-between p-3 bg-secondary rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">{selectedBrand}</span>
                    <span className="text-[9px] text-muted-foreground font-black">
                      ({brandProductCounts[selectedBrand] || 0} items)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBrandSelect(null)}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Collapsible Content */}
              <div className={`space-y-4 ${isMobileCollapsed ? "hidden lg:block" : "block"}`}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brand name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary border border-primary/10 pl-10 pr-4 py-3 rounded-full text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => handleBrandSelect(null)}
                    className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-between ${
                      selectedBrand === null
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary hover:pl-5"
                    }`}
                  >
                    <span>All Brands</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm shrink-0 ml-2 ${
                      selectedBrand === null
                        ? "bg-background text-foreground"
                        : "bg-secondary text-foreground"
                    }`}>
                      {categoryProducts.length}
                    </span>
                  </button>

                  {filteredBrandsList.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBrandSelect(b.name)}
                      className={`w-full text-left px-4 py-3 text-xs font-bold transition-all rounded-xl flex items-center justify-between ${
                        selectedBrand === b.name
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary hover:pl-5 hover:text-primary"
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-sm font-black shrink-0 ml-2 ${
                          selectedBrand === b.name
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {brandProductCounts[b.name] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Products Listing and View Controls */}
          <div id="products-section" className="lg:col-span-3 space-y-8">
            
            {/* Category Header exactly like screenshot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-6 relative">
              {/* Accent marker */}
              <div className="absolute left-0 top-0 bottom-6 w-1.5 bg-primary rounded-r-md"></div>
              
              <div className="pl-5">
                <h1 className="text-3xl font-black uppercase tracking-widest text-primary mb-1">
                  {selectedBrand ? selectedBrand : category.name}
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Premium {selectedBrand ? selectedBrand.toLowerCase() : category.name.toLowerCase()} curation
                </p>
              </div>

              <div className="flex items-center gap-4 pl-5 sm:pl-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground focus:outline-none focus:text-primary cursor-pointer hover:text-foreground transition-colors"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {sortedAndFilteredProducts.length} Items
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`transition-opacity duration-300 ${isScrolling ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <AnimatePresence mode="wait">
                {sortedAndFilteredProducts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-primary/10 bg-card p-16 text-center"
                  >
                    <Box className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="text-base font-bold uppercase tracking-widest mb-2">No Products Available</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      We couldn&apos;t find any products in this selection. Please try clearing your filters.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${selectedBrand}-${sortBy}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                  >
                    {sortedAndFilteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
