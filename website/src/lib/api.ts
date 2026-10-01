// website/src/lib/api.ts - NON VEG 404 API Client
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nv404_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  auth: {
    login: async (email: string, password?: string) => {
      const data = await request<{ success: boolean; token: string; customer: any; message?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('nv404_token', data.token);
      }
      return data;
    },
    register: async (userData: any) => {
      const data = await request<{ success: boolean; token: string; customer: any; message?: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('nv404_token', data.token);
      }
      return data;
    },
    me: async () => {
      return request<{ success: boolean; customer: any }>('/auth/me');
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nv404_token');
        localStorage.removeItem('nv404_customer_user');
      }
    },
  },

  menu: {
    getAll: async (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      const queryString = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; data: any[]; count: number }>(`/menu${queryString}`);
    },
    getById: async (id: string) => {
      return request<{ success: boolean; item: any; recommended: any[] }>(`/menu/${id}`);
    },
  },

  orders: {
    create: async (orderPayload: any) => {
      return request<{ success: boolean; message: string; orderId: string; total: number; eta: string; status: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });
    },
    getById: async (id: string) => {
      return request<{ success: boolean; order: any }>(`/orders/${id}`);
    },
    getMyOrders: async () => {
      return request<{ success: boolean; orders: any[]; count: number }>('/orders/my-orders');
    },
  },

  reservations: {
    create: async (reservationData: any) => {
      return request<{ success: boolean; message: string; reservationId: string }>('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData),
      });
    },
  },

  coupons: {
    validate: async (code: string, orderTotal: number) => {
      return request<{ success: boolean; coupon: any; discount: number; message?: string }>('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, orderTotal }),
      });
    },
  },

  reviews: {
    getAll: async () => {
      return request<{ success: boolean; reviews: any[] }>('/reviews');
    },
    submit: async (reviewData: any) => {
      return request<{ success: boolean; message: string; id: string }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
  },

  settings: {
    get: async () => {
      return request<{ success: boolean; data: any }>('/settings');
    },
    health: async () => {
      return request<any>('/health');
    },
  },
};
