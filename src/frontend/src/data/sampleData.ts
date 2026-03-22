export interface SampleProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  fabric: string;
  sizes: string[];
  colors: string[];
  description: string;
  costPrice: number;
  sellingPrice: number;
  marketplacePrice: number;
  stockQuantity: number;
  reservedStock: number;
  isActive: boolean;
  tags: string[];
  colorHex: string;
}

export interface SampleOrder {
  id: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  productId: number;
  productName: string;
  quantity: number;
  orderValue: number;
  platform: string;
  paymentMethod: string;
  shippingStatus: string;
  orderStatus: string;
  notes: string;
  createdAt: string;
}

export interface SalesEntry {
  id: number;
  date: string;
  productId: number;
  productName: string;
  quantity: number;
  channel: string;
  sellingPrice: number;
  totalAmount: number;
  customerName: string;
  paymentStatus: string;
  deliveryStatus: string;
  isReturn: boolean;
  notes: string;
}

export interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export interface WhatsAppPromo {
  id: number;
  productId: number;
  productName: string;
  price: number;
  fabric: string;
  colors: string[];
  promotedAt: string;
  isActive: boolean;
  engagements: number;
}

export const sampleProducts: SampleProduct[] = [
  {
    id: 1,
    sku: "JVK-DUP-001",
    name: "Banarasi Silk Dupatta",
    category: "dupatta",
    fabric: "Banarasi Silk",
    sizes: ["2.5m"],
    colors: ["Maroon", "Gold", "Ivory"],
    description:
      "Handwoven Banarasi silk dupatta with zari border, perfect for festive occasions.",
    costPrice: 850,
    sellingPrice: 1899,
    marketplacePrice: 1999,
    stockQuantity: 12,
    reservedStock: 2,
    isActive: true,
    tags: ["festive", "premium"],
    colorHex: "#8B1A1A",
  },
  {
    id: 2,
    sku: "JVK-KUR-002",
    name: "Chanderi Cotton Suit Set",
    category: "kurta",
    fabric: "Chanderi Cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Powder Blue", "Mint Green", "Peach"],
    description:
      "Lightweight chanderi cotton suit set with embroidered neckline, ideal for daily wear.",
    costPrice: 650,
    sellingPrice: 1399,
    marketplacePrice: 1499,
    stockQuantity: 28,
    reservedStock: 4,
    isActive: true,
    tags: ["daily", "bestseller"],
    colorHex: "#B0C4DE",
  },
  {
    id: 3,
    sku: "JVK-DUP-003",
    name: "Festive Lehenga Dupatta",
    category: "dupatta",
    fabric: "Georgette",
    sizes: ["2.5m"],
    colors: ["Pink", "Magenta", "Royal Blue"],
    description:
      "Heavy embellished georgette dupatta with mirror work for lehenga pairing.",
    costPrice: 1100,
    sellingPrice: 2499,
    marketplacePrice: 2699,
    stockQuantity: 3,
    reservedStock: 1,
    isActive: true,
    tags: ["festive", "premium"],
    colorHex: "#E75480",
  },
  {
    id: 4,
    sku: "JVK-KUR-004",
    name: "Daily Wear Kurta Set",
    category: "kurta",
    fabric: "Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Yellow", "Lavender"],
    description: "Comfortable everyday cotton kurta set with palazzo pants.",
    costPrice: 380,
    sellingPrice: 799,
    marketplacePrice: 899,
    stockQuantity: 45,
    reservedStock: 5,
    isActive: true,
    tags: ["daily", "bestseller"],
    colorHex: "#F5F5DC",
  },
  {
    id: 5,
    sku: "JVK-SAR-005",
    name: "Kanjivaram Silk Saree",
    category: "saree",
    fabric: "Kanjivaram Silk",
    sizes: ["6.5m"],
    colors: ["Deep Red", "Peacock Green", "Purple"],
    description:
      "Authentic Kanjivaram silk saree with traditional zari motifs.",
    costPrice: 4500,
    sellingPrice: 8999,
    marketplacePrice: 9499,
    stockQuantity: 4,
    reservedStock: 1,
    isActive: true,
    tags: ["festive", "premium"],
    colorHex: "#8B0000",
  },
  {
    id: 6,
    sku: "JVK-DUP-006",
    name: "Bandhani Cotton Dupatta",
    category: "dupatta",
    fabric: "Cotton",
    sizes: ["2.5m"],
    colors: ["Rani Pink", "Orange", "Green"],
    description:
      "Traditional Rajasthani bandhani tie-dye dupatta, vibrant and casual.",
    costPrice: 280,
    sellingPrice: 649,
    marketplacePrice: 699,
    stockQuantity: 22,
    reservedStock: 3,
    isActive: true,
    tags: ["daily", "bestseller"],
    colorHex: "#FF1493",
  },
  {
    id: 7,
    sku: "JVK-KUR-007",
    name: "Anarkali Festive Kurta",
    category: "kurta",
    fabric: "Georgette",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Teal", "Navy", "Burgundy"],
    description:
      "Flowy georgette anarkali kurta with sequin embroidery for parties.",
    costPrice: 950,
    sellingPrice: 2199,
    marketplacePrice: 2399,
    stockQuantity: 8,
    reservedStock: 2,
    isActive: true,
    tags: ["festive", "premium"],
    colorHex: "#008080",
  },
  {
    id: 8,
    sku: "JVK-LEH-008",
    name: "Bridal Lehenga Set",
    category: "lehenga",
    fabric: "Net & Velvet",
    sizes: ["S", "M", "L"],
    colors: ["Bridal Red", "Rose Gold"],
    description:
      "Heavily embroidered bridal lehenga with choli and dupatta set.",
    costPrice: 8500,
    sellingPrice: 18999,
    marketplacePrice: 19999,
    stockQuantity: 2,
    reservedStock: 0,
    isActive: true,
    tags: ["festive", "premium"],
    colorHex: "#C41E3A",
  },
  {
    id: 9,
    sku: "JVK-KUR-009",
    name: "Cotton Palazzo Set",
    category: "kurta",
    fabric: "Pure Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mustard", "Teal", "Coral"],
    description: "Comfortable cotton kurta with wide-leg palazzo pants.",
    costPrice: 420,
    sellingPrice: 949,
    marketplacePrice: 999,
    stockQuantity: 35,
    reservedStock: 4,
    isActive: true,
    tags: ["daily"],
    colorHex: "#FFDB58",
  },
  {
    id: 10,
    sku: "JVK-DUP-010",
    name: "Phulkari Embroidered Dupatta",
    category: "dupatta",
    fabric: "Silk Cotton",
    sizes: ["2.5m"],
    colors: ["Orange", "Pink", "Blue"],
    description:
      "Handcrafted Punjabi phulkari embroidered dupatta with vibrant threadwork.",
    costPrice: 600,
    sellingPrice: 1349,
    marketplacePrice: 1449,
    stockQuantity: 7,
    reservedStock: 1,
    isActive: true,
    tags: ["festive", "bestseller"],
    colorHex: "#FF8C00",
  },
];

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const sampleOrders: SampleOrder[] = [
  {
    id: 1,
    orderId: "JVK-2401",
    customerName: "Ananya Sharma",
    customerPhone: "9876543210",
    productId: 1,
    productName: "Banarasi Silk Dupatta",
    quantity: 1,
    orderValue: 1899,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(0),
  },
  {
    id: 2,
    orderId: "JVK-2402",
    customerName: "Priya Mehta",
    customerPhone: "9765432109",
    productId: 4,
    productName: "Daily Wear Kurta Set",
    quantity: 2,
    orderValue: 1598,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Shipped",
    orderStatus: "Shipped",
    notes: "Deliver by weekend",
    createdAt: daysAgo(0),
  },
  {
    id: 3,
    orderId: "JVK-2403",
    customerName: "Sunita Patel",
    customerPhone: "9654321098",
    productId: 5,
    productName: "Kanjivaram Silk Saree",
    quantity: 1,
    orderValue: 8999,
    platform: "Amazon",
    paymentMethod: "Credit Card",
    shippingStatus: "Processing",
    orderStatus: "Confirmed",
    notes: "Gift wrap requested",
    createdAt: daysAgo(0),
  },
  {
    id: 4,
    orderId: "JVK-2404",
    customerName: "Kavya Reddy",
    customerPhone: "9543210987",
    productId: 3,
    productName: "Festive Lehenga Dupatta",
    quantity: 1,
    orderValue: 2499,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Packed",
    orderStatus: "Packed",
    notes: "",
    createdAt: daysAgo(1),
  },
  {
    id: 5,
    orderId: "JVK-2405",
    customerName: "Meena Joshi",
    customerPhone: "9432109876",
    productId: 6,
    productName: "Bandhani Cotton Dupatta",
    quantity: 3,
    orderValue: 1947,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(1),
  },
  {
    id: 6,
    orderId: "JVK-2406",
    customerName: "Rina Kapoor",
    customerPhone: "9321098765",
    productId: 7,
    productName: "Anarkali Festive Kurta",
    quantity: 1,
    orderValue: 2199,
    platform: "Amazon",
    paymentMethod: "Debit Card",
    shippingStatus: "Shipped",
    orderStatus: "Shipped",
    notes: "",
    createdAt: daysAgo(1),
  },
  {
    id: 7,
    orderId: "JVK-2407",
    customerName: "Divya Singh",
    customerPhone: "9210987654",
    productId: 8,
    productName: "Bridal Lehenga Set",
    quantity: 1,
    orderValue: 18999,
    platform: "WhatsApp",
    paymentMethod: "Bank Transfer",
    shippingStatus: "Processing",
    orderStatus: "New",
    notes: "Bridal order - high priority",
    createdAt: daysAgo(2),
  },
  {
    id: 8,
    orderId: "JVK-2408",
    customerName: "Nisha Verma",
    customerPhone: "9109876543",
    productId: 2,
    productName: "Chanderi Cotton Suit Set",
    quantity: 2,
    orderValue: 2798,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(2),
  },
  {
    id: 9,
    orderId: "JVK-2409",
    customerName: "Pooja Agarwal",
    customerPhone: "9098765432",
    productId: 9,
    productName: "Cotton Palazzo Set",
    quantity: 1,
    orderValue: 949,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Shipped",
    orderStatus: "Shipped",
    notes: "",
    createdAt: daysAgo(3),
  },
  {
    id: 10,
    orderId: "JVK-2410",
    customerName: "Shalini Gupta",
    customerPhone: "8987654321",
    productId: 10,
    productName: "Phulkari Embroidered Dupatta",
    quantity: 2,
    orderValue: 2698,
    platform: "Amazon",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(3),
  },
  {
    id: 11,
    orderId: "JVK-2411",
    customerName: "Anita Bose",
    customerPhone: "8876543210",
    productId: 1,
    productName: "Banarasi Silk Dupatta",
    quantity: 1,
    orderValue: 1899,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Returned",
    notes: "Color mismatch",
    createdAt: daysAgo(5),
  },
  {
    id: 12,
    orderId: "JVK-2412",
    customerName: "Rekha Iyer",
    customerPhone: "8765432109",
    productId: 4,
    productName: "Daily Wear Kurta Set",
    quantity: 3,
    orderValue: 2397,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(6),
  },
  {
    id: 13,
    orderId: "JVK-2413",
    customerName: "Sudha Nair",
    customerPhone: "8654321098",
    productId: 5,
    productName: "Kanjivaram Silk Saree",
    quantity: 1,
    orderValue: 8999,
    platform: "Amazon",
    paymentMethod: "Credit Card",
    shippingStatus: "Processing",
    orderStatus: "Cancelled",
    notes: "Customer cancelled",
    createdAt: daysAgo(7),
  },
  {
    id: 14,
    orderId: "JVK-2414",
    customerName: "Geeta Choudhary",
    customerPhone: "8543210987",
    productId: 6,
    productName: "Bandhani Cotton Dupatta",
    quantity: 2,
    orderValue: 1298,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(8),
  },
  {
    id: 15,
    orderId: "JVK-2415",
    customerName: "Lata Pandey",
    customerPhone: "8432109876",
    productId: 2,
    productName: "Chanderi Cotton Suit Set",
    quantity: 1,
    orderValue: 1399,
    platform: "Amazon",
    paymentMethod: "Debit Card",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(10),
  },
  {
    id: 16,
    orderId: "JVK-2416",
    customerName: "Usha Tiwari",
    customerPhone: "8321098765",
    productId: 7,
    productName: "Anarkali Festive Kurta",
    quantity: 1,
    orderValue: 2199,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(12),
  },
  {
    id: 17,
    orderId: "JVK-2417",
    customerName: "Mala Dubey",
    customerPhone: "8210987654",
    productId: 3,
    productName: "Festive Lehenga Dupatta",
    quantity: 1,
    orderValue: 2499,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(14),
  },
  {
    id: 18,
    orderId: "JVK-2418",
    customerName: "Shanta Rao",
    customerPhone: "8109876543",
    productId: 9,
    productName: "Cotton Palazzo Set",
    quantity: 2,
    orderValue: 1898,
    platform: "Amazon",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(15),
  },
  {
    id: 19,
    orderId: "JVK-2419",
    customerName: "Kamla Saxena",
    customerPhone: "7987654321",
    productId: 10,
    productName: "Phulkari Embroidered Dupatta",
    quantity: 1,
    orderValue: 1349,
    platform: "WhatsApp",
    paymentMethod: "UPI",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(18),
  },
  {
    id: 20,
    orderId: "JVK-2420",
    customerName: "Sarla Mishra",
    customerPhone: "7876543210",
    productId: 4,
    productName: "Daily Wear Kurta Set",
    quantity: 4,
    orderValue: 3196,
    platform: "Meesho",
    paymentMethod: "COD",
    shippingStatus: "Delivered",
    orderStatus: "Delivered",
    notes: "",
    createdAt: daysAgo(20),
  },
];

export const sampleLedgerEntries: SalesEntry[] = Array.from(
  { length: 30 },
  (_, i) => {
    const order = sampleOrders[i % sampleOrders.length];
    return {
      id: i + 1,
      date: daysAgo(i),
      productId: order.productId,
      productName: order.productName,
      quantity: order.quantity,
      channel: order.platform,
      sellingPrice: order.orderValue / order.quantity,
      totalAmount: order.orderValue,
      customerName: order.customerName,
      paymentStatus: i % 3 === 0 ? "COD" : "Paid",
      deliveryStatus: i % 5 === 0 ? "Pending" : "Delivered",
      isReturn: i === 10,
      notes: "",
    };
  },
);

export const sampleExpenses: Expense[] = [
  {
    id: 1,
    date: daysAgo(1),
    category: "Packaging",
    amount: 1200,
    description: "Bubble wrap, boxes, tissue paper",
  },
  {
    id: 2,
    date: daysAgo(3),
    category: "Shipping",
    amount: 2800,
    description: "Delivery charges - Meesho bulk",
  },
  {
    id: 3,
    date: daysAgo(5),
    category: "Ad Spend",
    amount: 3500,
    description: "Facebook/Instagram ads",
  },
  {
    id: 4,
    date: daysAgo(7),
    category: "Marketplace Fees",
    amount: 1900,
    description: "Amazon commission fees",
  },
  {
    id: 5,
    date: daysAgo(10),
    category: "Product Sourcing",
    amount: 45000,
    description: "Fabric and materials purchase",
  },
  {
    id: 6,
    date: daysAgo(12),
    category: "Packaging",
    amount: 800,
    description: "Branded bags and tags",
  },
  {
    id: 7,
    date: daysAgo(15),
    category: "Shipping",
    amount: 1600,
    description: "Express delivery charges",
  },
  {
    id: 8,
    date: daysAgo(18),
    category: "Miscellaneous",
    amount: 500,
    description: "Stationery and misc",
  },
  {
    id: 9,
    date: daysAgo(20),
    category: "Marketplace Fees",
    amount: 2200,
    description: "Meesho commission",
  },
  {
    id: 10,
    date: daysAgo(22),
    category: "Ad Spend",
    amount: 2000,
    description: "WhatsApp broadcast tools",
  },
];

export const samplePromos: WhatsAppPromo[] = [
  {
    id: 1,
    productId: 1,
    productName: "Banarasi Silk Dupatta",
    price: 1899,
    fabric: "Banarasi Silk",
    colors: ["Maroon", "Gold"],
    promotedAt: daysAgo(0),
    isActive: true,
    engagements: 42,
  },
  {
    id: 2,
    productId: 4,
    productName: "Daily Wear Kurta Set",
    price: 799,
    fabric: "Cotton",
    colors: ["White", "Yellow"],
    promotedAt: daysAgo(1),
    isActive: true,
    engagements: 67,
  },
  {
    id: 3,
    productId: 6,
    productName: "Bandhani Cotton Dupatta",
    price: 649,
    fabric: "Cotton",
    colors: ["Rani Pink", "Orange"],
    promotedAt: daysAgo(2),
    isActive: false,
    engagements: 89,
  },
  {
    id: 4,
    productId: 7,
    productName: "Anarkali Festive Kurta",
    price: 2199,
    fabric: "Georgette",
    colors: ["Teal", "Burgundy"],
    promotedAt: daysAgo(3),
    isActive: false,
    engagements: 34,
  },
  {
    id: 5,
    productId: 9,
    productName: "Cotton Palazzo Set",
    price: 949,
    fabric: "Pure Cotton",
    colors: ["Mustard", "Coral"],
    promotedAt: daysAgo(5),
    isActive: false,
    engagements: 55,
  },
];

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
