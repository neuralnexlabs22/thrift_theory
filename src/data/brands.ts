// Streetwear Brands Database - Tailored for ThriftTheory
export const allBrands = [
  { name: "ThriftTheory", category: "hoodies", description: "Premium original streetwear hoodies", featured: true },
  { name: "ThriftTheory", category: "t-shirts", description: "Original graphic and minimalist tees", featured: true },
  { name: "ThriftTheory", category: "bottoms", description: "Baggy fit utility bottoms", featured: true },
  { name: "ThriftTheory", category: "outerwear", description: "Premium outerwear, leather and velvet jackets", featured: true },
  { name: "ThriftTheory", category: "accessories", description: "Streetwear beanies, chains and essentials", featured: true },
  
  { name: "ESSENTIALS", category: "hoodies", description: "Fear of God Essentials streetwear hoodies", featured: true },
  { name: "ESSENTIALS", category: "t-shirts", description: "Fear of God Essentials tees", featured: true },
  
  { name: "STUSSY", category: "t-shirts", description: "Stussy graphic tees and apparel", featured: true },
  { name: "STUSSY", category: "accessories", description: "Stussy caps and streetwear accessories", featured: false },
  
  { name: "REPRESENT", category: "outerwear", description: "Represent luxury British streetwear outerwear", featured: true },
  { name: "REPRESENT", category: "hoodies", description: "Represent heavyweight luxury hoodies", featured: false },
  
  { name: "CORTEIZ", category: "bottoms", description: "Corteiz RTW utility cargos and bottoms", featured: true },
  { name: "CORTEIZ", category: "t-shirts", description: "Corteiz graphic street tees", featured: false }
];

export const brandsByCategory = {
  hoodies: [
    { name: "ThriftTheory", slug: "thrifttheory-india", description: "Premium original streetwear hoodies", category_id: "hoodies", is_active: true },
    { name: "ESSENTIALS", slug: "essentials", description: "Fear of God Essentials streetwear hoodies", category_id: "hoodies", is_active: true },
    { name: "REPRESENT", slug: "represent", description: "Represent heavyweight luxury hoodies", category_id: "hoodies", is_active: true }
  ],
  "t-shirts": [
    { name: "ThriftTheory", slug: "thrifttheory-india", description: "Original graphic and minimalist tees", category_id: "t-shirts", is_active: true },
    { name: "ESSENTIALS", slug: "essentials", description: "Fear of God Essentials tees", category_id: "t-shirts", is_active: true },
    { name: "STUSSY", slug: "stussy", description: "Stussy graphic tees and apparel", category_id: "t-shirts", is_active: true },
    { name: "CORTEIZ", slug: "corteiz", description: "Corteiz graphic street tees", category_id: "t-shirts", is_active: true }
  ],
  bottoms: [
    { name: "ThriftTheory", slug: "thrifttheory-india", description: "Baggy fit utility bottoms", category_id: "bottoms", is_active: true },
    { name: "CORTEIZ", slug: "corteiz", description: "Corteiz RTW utility cargos and bottoms", category_id: "bottoms", is_active: true }
  ],
  outerwear: [
    { name: "ThriftTheory", slug: "thrifttheory-india", description: "Premium outerwear, leather and velvet jackets", category_id: "outerwear", is_active: true },
    { name: "REPRESENT", slug: "represent", description: "Represent luxury British streetwear outerwear", category_id: "outerwear", is_active: true }
  ],
  accessories: [
    { name: "ThriftTheory", slug: "thrifttheory-india", description: "Streetwear beanies, chains and essentials", category_id: "accessories", is_active: true },
    { name: "STUSSY", slug: "stussy", description: "Stussy caps and streetwear accessories", category_id: "accessories", is_active: true }
  ]
};

export const categories = [
  { name: "Hoodies", slug: "hoodies", description: "Premium heavyweight oversized hoodies and zip-ups" },
  { name: "T-Shirts", slug: "t-shirts", description: "Boxy fit, drop shoulder graphic and classic tees" },
  { name: "Bottoms", slug: "bottoms", description: "Vintage cargo pants, utility joggers and streetwear shorts" },
  { name: "Outerwear", slug: "outerwear", description: "Luxury leather jackets, flannel overshirts, and velvet blazers" },
  { name: "Accessories", slug: "accessories", description: "Ribbed knit beanies, jewelry, and street utility gear" }
];

export const getBrandSlug = (brandName: string): string => {
  return brandName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};
