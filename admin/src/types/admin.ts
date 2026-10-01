export type OrderStatus =
  | 'INITIALIZED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Code Red';

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
  category?: string;
  inStock: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  spiceLevel: SpiceLevel;
  availability: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories?: number;
  techTag?: string;
  addOnIds?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  itemCount: number;
  active: boolean;
}

export interface OrderItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  addOns: { name: string; price: number }[];
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  loyaltyTier: 'Root User' | 'Senior Dev' | 'Junior Dev' | 'Guest';
  lastOrderDate: string;
  avatar?: string;
}

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'SEATED' | 'CANCELLED';

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  tableZone: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
  usageCount: number;
  usageLimit?: number;
  active: boolean;
  expiryDate: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  commitHash: string;
  dishOrdered: string;
  featured: boolean;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  lateNightShift: string;
  isKitchenOpen: boolean;
  surgeActive: boolean;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  deliveryRadiusKm: number;
  taxRate: number;
}
