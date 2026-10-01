'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAddress {
  street: string;
  city: string;
  zipCode: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  tier: 'Kernel VIP' | 'Sudo Dev' | 'Script Kiddie';
  points: number;
  address?: UserAddress;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: string;
    address?: UserAddress;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  demoLogin: (userType: 'linus' | 'ada') => void;
  isLoggedIn: boolean;
}

const DEMO_USERS: Record<'linus' | 'ada', UserProfile> = {
  linus: {
    id: 'usr-linus',
    name: 'Linus Torvalds',
    email: 'linus@linux.org',
    phone: '+1 (555) 019-2831',
    role: 'Kernel Architect',
    tier: 'Kernel VIP',
    points: 450,
    address: {
      street: '1024 Monolithic Kernel Blvd, Suite 404',
      city: 'Portland',
      zipCode: '97201',
      notes: 'Ring bell twice. Don’t break userspace!',
    },
  },
  ada: {
    id: 'usr-ada',
    name: 'Ada Lovelace',
    email: 'ada@algorithm.dev',
    phone: '+1 (555) 018-1815',
    role: 'Lead Algorithmic Engineer',
    tier: 'Sudo Dev',
    points: 220,
    address: {
      street: '42 Babbage Analytical Engine Way',
      city: 'San Francisco',
      zipCode: '94107',
      notes: 'Leave at front desk if compiler is running.',
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { api } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount & verify with backend
  useEffect(() => {
    async function hydrate() {
      try {
        const stored = localStorage.getItem('nv404_customer_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }

        const token = localStorage.getItem('nv404_token');
        if (token) {
          try {
            const res = await api.auth.me();
            if (res.success && res.customer) {
              const u: UserProfile = {
                id: res.customer.id,
                name: res.customer.name,
                email: res.customer.email,
                phone: res.customer.phone,
                role: res.customer.role,
                tier: res.customer.loyalty_tier || 'Script Kiddie',
                points: res.customer.loyalty_points || 0,
                address: res.customer.address,
              };
              setUser(u);
              localStorage.setItem('nv404_customer_user', JSON.stringify(u));
            }
          } catch {
            // Token expired or server unreachable, keep stored local user
          }
        }
      } catch {
        // ignore parse errors
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.customer) {
        const loggedInUser: UserProfile = {
          id: res.customer.id,
          name: res.customer.name,
          email: res.customer.email,
          phone: res.customer.phone,
          role: res.customer.role,
          tier: res.customer.loyalty_tier || 'Sudo Dev',
          points: res.customer.loyalty_points || 100,
          address: res.customer.address,
        };
        setUser(loggedInUser);
        localStorage.setItem('nv404_customer_user', JSON.stringify(loggedInUser));
        setIsLoading(false);
        return { success: true, message: res.message };
      }
    } catch (err: any) {
      console.warn('Backend login attempt fell back to offline demo session:', err.message);
    }

    // Graceful offline fallback
    let loggedInUser: UserProfile;
    if (email.toLowerCase().includes('linus')) {
      loggedInUser = DEMO_USERS.linus;
    } else if (email.toLowerCase().includes('ada')) {
      loggedInUser = DEMO_USERS.ada;
    } else {
      loggedInUser = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].replace(/[._-]/g, ' ') || 'Developer Diner',
        email,
        phone: '+1 (555) 404-0000',
        role: 'Full-Stack Developer',
        tier: 'Sudo Dev',
        points: 100,
        address: {
          street: '256 Binary Road, Apt 2B',
          city: 'Tech City',
          zipCode: '94016',
          notes: 'Deliver hot, please!',
        },
      };
    }

    setUser(loggedInUser);
    localStorage.setItem('nv404_customer_user', JSON.stringify(loggedInUser));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: string;
    address?: UserAddress;
  }): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.customer) {
        const newUser: UserProfile = {
          id: res.customer.id,
          name: res.customer.name,
          email: res.customer.email,
          phone: res.customer.phone,
          role: res.customer.role,
          tier: res.customer.loyalty_tier || 'Script Kiddie',
          points: res.customer.loyalty_points || 50,
          address: res.customer.address,
        };
        setUser(newUser);
        localStorage.setItem('nv404_customer_user', JSON.stringify(newUser));
        setIsLoading(false);
        return { success: true, message: res.message };
      }
    } catch (err: any) {
      console.warn('Backend register attempt fell back to offline demo:', err.message);
    }

    // Offline fallback
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'Junior Sudo Engineer',
      tier: 'Script Kiddie',
      points: 50,
      address: userData.address || {
        street: '127.0.0.1 Localhost St',
        city: 'Silicon Grill',
        zipCode: '94016',
      },
    };

    setUser(newUser);
    localStorage.setItem('nv404_customer_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  const demoLogin = (userType: 'linus' | 'ada') => {
    const selected = DEMO_USERS[userType];
    setUser(selected);
    localStorage.setItem('nv404_customer_user', JSON.stringify(selected));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        demoLogin,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
