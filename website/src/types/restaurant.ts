export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Code Red';

export type FoodCategory =
  | 'Chicken'
  | 'Mutton'
  | 'Biryani'
  | 'Kebabs & Tandoor'
  | 'Starters'
  | 'Burgers'
  | 'Rolls & Wraps'
  | 'Main Course'
  | 'Beverages'
  | 'Desserts';

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: FoodCategory;
  spiceLevel: SpiceLevel;
  availability: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories?: number;
  addOns?: FoodAddon[];
  techTag?: string; // e.g. "v2.4 LTS", "Hotfix Recipe", "Zero Bugs"
}

export interface CartItem {
  cartItemId: string; // unique combo of item id + addons
  foodItem: FoodItem;
  quantity: number;
  selectedAddOns: FoodAddon[];
  specialNotes?: string;
}

export type OrderStatus =
  | 'INITIALIZED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface Order {
  id: string; // e.g. "NV404-8924"
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  orderNotes?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusMessages: {
    status: OrderStatus;
    label: string;
    timestamp: string;
    codeLog: string;
  }[];
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  tableType: string;
  specialRequests?: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
  active: boolean;
}

export interface Review {
  id: string;
  author: string;
  role: string; // e.g. "Staff SRE @ CloudCorp", "Full-Stack Dev", "Lead Architect"
  rating: number;
  comment: string;
  date: string;
  commitHash: string; // e.g. "git commit -m 'best biryani in town' #f7a302"
  dishOrdered: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  isKitchenOpen: boolean;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  taxRate: number;
}
