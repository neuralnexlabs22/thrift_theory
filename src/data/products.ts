export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  price: number;
  category: "Hoodies" | "T-Shirts" | "Bottoms" | "Outerwear" | "Accessories";
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isNew: boolean;
  isTrending?: boolean;
}

export const products: Product[] = [
  {
    id: "prod-hoodie-1",
    name: "Heavyweight Earth Tone Oversized Hoodie",
    brand: "ThriftTheory",
    price: 2499,
    category: "Hoodies",
    images: ["/images/categories/hoodies.png", "/images/hero.png"],
    description: "Premium double-hooded oversized streetwear hoodie in our signature cocoa brown tone. Thick 450GSM organic cotton fleece built to hold its structured drop-shoulder silhouette.",
    sizes: ["M", "L", "XL"],
    colors: ["Cocoa Brown", "Sand Beige"],
    stock: 5,
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-hoodie-2",
    name: "Fear of God Essentials Hoodie",
    brand: "ESSENTIALS",
    price: 4999,
    category: "Hoodies",
    images: ["/images/categories/hoodies.png", "/images/lookbook.png"],
    description: "Authentic FOG Essentials classic logo hoodie. Heavy brushed back fleece, boxy shape with mock neckline. A premium streetwear wardrobe staple.",
    sizes: ["S", "M", "L"],
    colors: ["Oatmeal Beige", "Desert Taupe"],
    stock: 1,
    isNew: true,
    isTrending: false
  },
  {
    id: "prod-tee-1",
    name: "Vintage Washed Graphic Outlaw Tee",
    brand: "ThriftTheory",
    price: 1299,
    category: "T-Shirts",
    images: ["/images/categories/tees.png", "/images/lookbook.png"],
    description: "Vintage-washed streetwear tee featuring hand-drawn graphic art on front chest. Single-stitch details, thick ribbed neck collar for that perfect vintage look.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Washed Charcoal", "Off-White"],
    stock: 12,
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-tee-2",
    name: "Stussy 8-Ball Streetwear Tee",
    brand: "STUSSY",
    price: 1899,
    category: "T-Shirts",
    images: ["/images/categories/tees.png", "/images/hero.png"],
    description: "Original Stussy 8-ball graphic tee. Screen-printed on a premium thick heavy cotton blank. Perfect boxy streetwear fit.",
    sizes: ["M", "L", "XL"],
    colors: ["Stealth Black", "Beige"],
    stock: 3,
    isNew: false,
    isTrending: true
  },
  {
    id: "prod-bottom-1",
    name: "Baggy Utility Double-Knee Cargos",
    brand: "ThriftTheory",
    price: 2999,
    category: "Bottoms",
    images: ["/images/categories/bottoms.png", "/images/hero.png"],
    description: "Heavy-duty canvas double-knee cargo pants in relaxed baggy fit. Six-pocket configuration, contrast stitching, and adjustable ankle ties for utility customization.",
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki Beige", "Olive Green"],
    stock: 4,
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-bottom-2",
    name: "Corteiz RTW Streetwear Joggers",
    brand: "CORTEIZ",
    price: 3499,
    category: "Bottoms",
    images: ["/images/categories/bottoms.png", "/images/lookbook.png"],
    description: "Authentic Corteiz Rules The World heavyweight script logo utility sweatpants. Premium elastic waistband and heavy drawstring cord.",
    sizes: ["S", "M", "L"],
    colors: ["Chocolate Brown", "Heather Grey"],
    stock: 2,
    isNew: false,
    isTrending: false
  },
  {
    id: "prod-outer-1",
    name: "Vintage Velvet Corduroy Bomber Jacket",
    brand: "ThriftTheory",
    price: 3999,
    category: "Outerwear",
    images: ["/images/lookbook.png", "/images/hero.png"],
    description: "Rare vintage corduroy blouson jacket with soft velvet finish. Features quilted inner lining, heavy brass zipper, and ribbed cuffs. Hand-picked streetwear luxury.",
    sizes: ["L", "XL"],
    colors: ["Rich Mocha", "Camel Brown"],
    stock: 1,
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-outer-2",
    name: "Represent Luxury Sherpa Denim Jacket",
    brand: "REPRESENT",
    price: 5499,
    category: "Outerwear",
    images: ["/images/hero.png", "/images/lookbook.png"],
    description: "Represent heavyweight distressed denim jacket lined with premium soft faux-sherpa. Metal hardware button-closure, tailored boxy fit.",
    sizes: ["M", "L"],
    colors: ["Vintage Wash Denim", "Beige Sherpa"],
    stock: 1,
    isNew: true,
    isTrending: false
  },
  {
    id: "prod-acc-1",
    name: "Ribbed Knit Heavy Street Beanies",
    brand: "ThriftTheory",
    price: 799,
    category: "Accessories",
    images: ["/images/categories/accessories.png", "/images/hero.png"],
    description: "Thick double-layered ribbed knit beanie for the perfect street style accessory. Minimalist woven brand tag on cuff, snug warm fit.",
    sizes: ["OS"],
    colors: ["Earth Brown", "Sand Beige", "Ink Black"],
    stock: 15,
    isNew: false,
    isTrending: true
  },
  {
    id: "prod-acc-2",
    name: "Stussy Embroidered Crown Cap",
    brand: "STUSSY",
    price: 1199,
    category: "Accessories",
    images: ["/images/categories/accessories.png", "/images/lookbook.png"],
    description: "Adjustable 6-panel strapback unstructured cap featuring Stussy logo embroidery on front crown. Steel metal buckle back enclosure.",
    sizes: ["OS"],
    colors: ["Washed Brown", "Forest Green"],
    stock: 2,
    isNew: true,
    isTrending: false
  }
];
