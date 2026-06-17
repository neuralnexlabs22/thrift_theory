"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal, Grid2X2, Grid3X3, Grid, Tag, Box, ChevronDown, ChevronUp } from "lucide-react";
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
  const [viewCols, setViewCols] = useState<2 | 3 | 4>(3); // 2: box box items, 3: medium, 4: grid

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


      {/* Category Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-12 border-b border-primary/15 bg-secondary">
        <Image
          src={bannerImage}
          alt={`${category.name} Banner`}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2">
              <Box className="w-4 h-4 text-primary" />
              <p className="text-primary text-[10px] tracking-[0.4em] uppercase font-bold">
                THRIFTTHEORY SECTIONS
              </p>
            </div>
            <h1 className="heading-luxury text-4xl md:text-6xl tracking-widest font-serif">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase font-bold">
              {categoryProducts.length} ITEMS AVAILABLE
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
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
            <div className="bg-card border border-primary/10 p-5 space-y-4">
              <div
                className="flex items-center justify-between border-b border-primary/10 pb-3 cursor-pointer lg:cursor-default"
                onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Brands Directory
                </h3>
                <div className="flex items-center gap-2 lg:hidden">
                  {isMobileCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Active Filter display on mobile */}
              {isMobileCollapsed && selectedBrand && (
                <div className="lg:hidden flex items-center justify-between p-3 bg-secondary/30 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">{selectedBrand}</span>
                    <span className="text-[9px] text-muted-foreground">
                      ({brandProductCounts[selectedBrand] || 0} items)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBrandSelect(null)}
                    className="text-[9px] font-bold uppercase tracking-wider text-primary hover:underline"
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
                    placeholder="Search brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary border border-primary/10 pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => handleBrandSelect(null)}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                      selectedBrand === null
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>All Brands</span>
                    <span className={selectedBrand === null ? "text-primary-foreground/80" : "text-muted-foreground/60"}>
                      {categoryProducts.length}
                    </span>
                  </button>

                  {filteredBrandsList.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBrandSelect(b.name)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                        selectedBrand === b.name
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-black shrink-0 ml-2 ${
                          selectedBrand === b.name
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-secondary text-foreground"
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
          <div id="products-section" className="lg:col-span-3 space-y-6">
            
            {/* View options bar (Sorting + Grid columns toggle) */}
            <div className="bg-card border border-primary/10 px-5 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Sorting */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary border border-primary/10 text-xs font-bold uppercase tracking-widest py-1.5 px-3 focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="newest">Newest Drops</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* View layout toggle - Box Box items view option */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">View Layout</span>
                <div className="flex border border-primary/10">
                  <button
                    type="button"
                    onClick={() => setViewCols(2)}
                    className={`p-2 transition-colors ${
                      viewCols === 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                    title="Box Box View (2 Columns)"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewCols(3)}
                    className={`p-2 transition-colors ${
                      viewCols === 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                    title="Medium View (3 Columns)"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewCols(4)}
                    className={`p-2 transition-colors ${
                      viewCols === 4
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                    title="Grid View (4 Columns)"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
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
                    key={`${selectedBrand}-${sortBy}-${viewCols}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`grid gap-4 sm:gap-6 ${
                      viewCols === 2
                        ? "grid-cols-2 lg:grid-cols-2"
                        : viewCols === 4
                        ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                    }`}
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
