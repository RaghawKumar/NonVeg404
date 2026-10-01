// admin/src/lib/api.ts - NON VEG 404 Admin API Client
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('admin_auth_nv404');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
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
    console.warn(`[ADMIN_API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const adminApi = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await request<{
        success: boolean;
        message: string;
        token: string;
        admin: { id: string; name: string; email: string; role: string };
      }>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.token && typeof window !== 'undefined') {
        const session = {
          email: res.admin.email,
          name: res.admin.name,
          role: res.admin.role === 'manager' ? 'Store Manager (Root)' : 'Kitchen Lead (Cook)',
          roleKey: res.admin.role,
          token: res.token,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('admin_auth_nv404', JSON.stringify(session));
      }
      return res;
    },
    me: async () => {
      return request<{ success: boolean; admin: any }>('/admin/auth/me');
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_auth_nv404');
      }
    },
  },

  dashboard: {
    get: async () => {
      return request<{
        success: boolean;
        stats: any;
        recentOrders: any[];
        topDishes: any[];
      }>('/admin/dashboard');
    },
  },

  orders: {
    getAll: async (params?: { status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      const queryString = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; orders: any[]; total: number }>(`/admin/orders${queryString}`);
    },
    getById: async (id: string) => {
      return request<{ success: boolean; order: any }>(`/admin/orders/${id}`);
    },
    updateStatus: async (id: string, status: string, note?: string) => {
      return request<{ success: boolean; message: string; status: string }>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    },
    updatePayment: async (id: string, paymentStatus: string) => {
      return request<{ success: boolean; message: string }>(`/admin/orders/${id}/payment`, {
        method: 'PATCH',
        body: JSON.stringify({ paymentStatus }),
      });
    },
  },

  menu: {
    getAll: async (params?: { category?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      const queryString = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; items: any[]; count: number }>(`/admin/menu${queryString}`);
    },
    create: async (data: any) => {
      return request<{ success: boolean; message: string; id: string }>('/admin/menu', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request<{ success: boolean; message: string }>(`/admin/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    toggleAvailability: async (id: string, availability: boolean) => {
      return request<{ success: boolean; message: string }>(`/admin/menu/${id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ availability }),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/menu/${id}`, {
        method: 'DELETE',
      });
    },
  },

  categories: {
    getAll: async () => {
      return request<{ success: boolean; categories: any[] }>('/admin/categories');
    },
    create: async (data: any) => {
      return request<{ success: boolean; message: string; category: any }>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },
  },

  addons: {
    getAll: async () => {
      return request<{ success: boolean; addons: any[] }>('/admin/addons');
    },
    create: async (data: any) => {
      return request<{ success: boolean; message: string; addon: any }>('/admin/addons', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request<{ success: boolean; message: string }>(`/admin/addons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    toggleStock: async (id: string, inStock: boolean) => {
      return request<{ success: boolean; message: string }>(`/admin/addons/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ inStock }),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/addons/${id}`, {
        method: 'DELETE',
      });
    },
  },

  customers: {
    getAll: async (search?: string) => {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      return request<{ success: boolean; customers: any[]; total: number }>(`/admin/customers${q}`);
    },
    getById: async (id: string) => {
      return request<{ success: boolean; customer: any }>(`/admin/customers/${id}`);
    },
    update: async (id: string, data: any) => {
      return request<{ success: boolean; message: string }>(`/admin/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  reservations: {
    getAll: async (params?: { status?: string; date?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.date) q.append('date', params.date);
      const queryString = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; reservations: any[]; count: number }>(`/admin/reservations${queryString}`);
    },
    updateStatus: async (id: string, status: string) => {
      return request<{ success: boolean; message: string }>(`/admin/reservations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/reservations/${id}`, {
        method: 'DELETE',
      });
    },
  },

  coupons: {
    getAll: async () => {
      return request<{ success: boolean; coupons: any[] }>('/admin/coupons');
    },
    create: async (data: any) => {
      return request<{ success: boolean; message: string; id: string }>('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return request<{ success: boolean; message: string }>(`/admin/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    toggle: async (id: string, active: boolean) => {
      return request<{ success: boolean; message: string }>(`/admin/coupons/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ active }),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/coupons/${id}`, {
        method: 'DELETE',
      });
    },
  },

  reviews: {
    getAll: async () => {
      return request<{ success: boolean; reviews: any[]; count: number }>('/admin/reviews');
    },
    approve: async (id: string, approved: boolean) => {
      return request<{ success: boolean; message: string }>(`/admin/reviews/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      });
    },
    feature: async (id: string, featured: boolean) => {
      return request<{ success: boolean; message: string }>(`/admin/reviews/${id}/feature`, {
        method: 'PATCH',
        body: JSON.stringify({ featured }),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/admin/reviews/${id}`, {
        method: 'DELETE',
      });
    },
  },

  settings: {
    get: async () => {
      return request<{ success: boolean; settings: any }>('/admin/settings');
    },
    update: async (data: any) => {
      return request<{ success: boolean; message: string }>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },
};
