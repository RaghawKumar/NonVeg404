'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  FoodItem,
  FoodAddon,
  Order,
  OrderStatus,
  Reservation,
  Coupon,
  RestaurantSettings,
} from '@/types/restaurant';
import {
  FOOD_ITEMS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '@/data/restaurantData';
import { api } from '@/lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (food: FoodItem, quantity?: number, selectedAddOns?: FoodAddon[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'statusMessages'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Reservations
  reservations: Reservation[];
  createReservation: (data: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: 'CONFIRMED' | 'PENDING' | 'CANCELLED') => void;

  // Menu items (for Admin editing and live sync)
  menuItems: FoodItem[];
  updateMenuItem: (item: FoodItem) => void;
  addMenuItem: (item: FoodItem) => void;
  deleteMenuItem: (id: string) => void;

  // Restaurant Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nv404_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('nv404_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock seed order
        const seedOrder: Order = {
          id: 'NV404-8924',
          customerName: 'Linus Torvalds',
          phone: '+1 555-0199',
          email: 'linus@kernel.org',
          address: '777 Penguin Way, Open Source Bay, CA',
          deliveryType: 'delivery',
          paymentMethod: 'UPI',
          paymentStatus: 'PAID',
          orderNotes: 'Zero bugs please. Extra spice on the biryani.',
          items: [
            {
              cartItemId: 'seed-1',
              foodItem: FOOD_ITEMS[0],
              quantity: 2,
              selectedAddOns: [FOOD_ITEMS[0].addOns![0]],
            },
            {
              cartItemId: 'seed-2',
              foodItem: FOOD_ITEMS[3],
              quantity: 1,
              selectedAddOns: [],
            },
          ],
          subtotal: 59.97,
          tax: 3.0,
          deliveryFee: 0,
          discount: 10,
          total: 52.97,
          status: 'PREPARING',
          statusMessages: [
            {
              status: 'INITIALIZED',
              label: '< ORDER INITIALIZED />',
              timestamp: '20 mins ago',
              codeLog: '200 OK: Payload received in memory queue',
            },
            {
              status: 'ACCEPTED',
              label: '< KITCHEN THREAD SPAWNED />',
              timestamp: '18 mins ago',
              codeLog: 'Allocated 2 kitchen cores for spice calibration',
            },
            {
              status: 'PREPARING',
              label: '< KITCHEN BUILDING YOUR ORDER />',
              timestamp: '10 mins ago',
              codeLog: 'Cooking in clay tandoor at 450°C. Saffron infused.',
            },
          ],
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          estimatedDeliveryTime: '25-35 mins',
        };
        setOrders([seedOrder]);
        localStorage.setItem('nv404_orders', JSON.stringify([seedOrder]));
      }

      const savedReservations = localStorage.getItem('nv404_reservations');
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
      } else {
        const seedReservation: Reservation = {
          id: 'RES-NV404-101',
          customerName: 'Ada Lovelace',
          email: 'ada@firstcoder.org',
          phone: '+1 555-0142',
          guests: 4,
          date: 'Tonight',
          time: '20:00',
          tableType: 'Core #01 - The Window Booth',
          specialRequests: 'Celebrating release candidate v1.0. Window view preferred.',
          status: 'CONFIRMED',
          createdAt: new Date().toISOString(),
        };
        setReservations([seedReservation]);
        localStorage.setItem('nv404_reservations', JSON.stringify([seedReservation]));
      }

      const savedMenu = localStorage.getItem('nv404_menu_items');
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));

      const savedSettings = localStorage.getItem('nv404_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      // Fetch latest menu and settings live from backend database
      api.menu.getAll().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setMenuItems(res.data);
          localStorage.setItem('nv404_menu_items', JSON.stringify(res.data));
        }
      }).catch(() => {});

      api.settings.get().then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
          localStorage.setItem('nv404_settings', JSON.stringify(res.data));
        }
      }).catch(() => {});
    } catch {
      // LocalStorage access failsafe
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('nv404_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (
    food: FoodItem,
    quantity = 1,
    selectedAddOns: FoodAddon[] = [],
    notes?: string
  ) => {
    const sortedAddonIds = selectedAddOns.map((a) => a.id).sort().join('-');
    const cartItemId = `${food.id}-${sortedAddonIds}-${notes || ''}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          foodItem: food,
          quantity,
          selectedAddOns,
          specialNotes: notes,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find(
      (c) => c.code === cleanCode && c.active
    );

    if (!found) {
      return { success: false, message: 'Invalid or inactive promo code.' };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Min order of ₹${found.minOrder.toFixed(2)} required for ${found.code}.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const itemAddonTotal = item.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return acc + (item.foodItem.price + itemAddonTotal) * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }

  const deliveryFee =
    deliveryType === 'pickup' || subtotal >= settings.freeDeliveryThreshold || subtotal === 0
      ? 0
      : settings.deliveryFee;

  const tax = (subtotal - discount) * settings.taxRate;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  // Orders
  const createOrder = (
    orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'statusMessages'>
  ): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NV404-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'INITIALIZED',
      createdAt: new Date().toISOString(),
      statusMessages: [
        {
          status: 'INITIALIZED',
          label: '< ORDER INITIALIZED />',
          timestamp: 'Just now',
          codeLog: `POST /api/orders/${orderId} -> 200 OK. Compiling order payload in kernel.`,
        },
      ],
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('nv404_orders', JSON.stringify(updated));
    } catch {}

    // Synchronize to backend database
    api.orders.create({
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      orderNotes: orderData.orderNotes,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total,
      estimatedDeliveryTime: orderData.estimatedDeliveryTime,
      couponCode: appliedCoupon?.code,
    }).catch((err) => {
      console.warn('Backend order synchronization failed (offline fallback active):', err.message);
    });

    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.id.toUpperCase() === orderId.trim().toUpperCase()
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const statusLabels: Record<OrderStatus, { label: string; log: string }> = {
      INITIALIZED: {
        label: '< ORDER INITIALIZED />',
        log: '200 OK: Payload received in memory queue',
      },
      ACCEPTED: {
        label: '< COMPILING INGREDIENTS />',
        log: 'Ingredients locked and verified. Spices calibrated.',
      },
      PREPARING: {
        label: '< KITCHEN BUILDING YOUR ORDER />',
        log: 'Chef spawned kitchen threads. Tandoor temperature 450°C.',
      },
      READY: {
        label: '< QUALITY ASSURANCE PASSED />',
        log: 'Zero bugs found in dish. Packaging sealed with thermal wrap.',
      },
      OUT_FOR_DELIVERY: {
        label: '< OUT FOR DEPLOYMENT />',
        log: 'Courier ping received. Transit routing algorithm initialized.',
      },
      DELIVERED: {
        label: '< BUILD SUCCESSFUL />',
        log: 'HTTP 200: Dinner delivered to client. Enjoy your meal!',
      },
    };

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          const newStatusMessages = [
            ...order.statusMessages,
            {
              status,
              label: statusLabels[status].label,
              timestamp: 'Just now',
              codeLog: statusLabels[status].log,
            },
          ];
          return {
            ...order,
            status,
            statusMessages: newStatusMessages,
          };
        }
        return order;
      });

      try {
        localStorage.setItem('nv404_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Reservations
  const createReservation = (
    data: Omit<Reservation, 'id' | 'status' | 'createdAt'>
  ): Reservation => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const newRes: Reservation = {
      ...data,
      id: `RES-NV404-${randomId}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRes, ...reservations];
    setReservations(updated);
    try {
      localStorage.setItem('nv404_reservations', JSON.stringify(updated));
    } catch {}

    // Synchronize to backend database
    api.reservations.create({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      date: data.date,
      time: data.time,
      tableZone: data.tableType,
      specialRequests: data.specialRequests,
    }).catch((err) => {
      console.warn('Backend reservation sync failed:', err.message);
    });

    return newRes;
  };

  const updateReservationStatus = (
    id: string,
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
  ) => {
    setReservations((prev) => {
      const updated = prev.map((res) =>
        res.id === id ? { ...res, status } : res
      );
      try {
        localStorage.setItem('nv404_reservations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Menu Items
  const updateMenuItem = (item: FoodItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((f) => (f.id === item.id ? item : f));
      try {
        localStorage.setItem('nv404_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addMenuItem = (item: FoodItem) => {
    setMenuItems((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem('nv404_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('nv404_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Restaurant Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('nv404_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        deliveryType,
        setDeliveryType,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        reservations,
        createReservation,
        updateReservationStatus,
        menuItems,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        settings,
        updateSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
