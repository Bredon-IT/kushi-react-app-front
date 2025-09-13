// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://bmytsqa7b3.ap-south-1.awsapprunner.com';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  joinDate?: string;
  totalBookings?: number;
  totalSpent?: number;
  firstName?: string; // derived for Navbar convenience
  lastName?: string;  // derived for Navbar convenience
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signup: (userData: SignupData) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

const deriveNames = (fullName?: string) => {
  if (!fullName) return { firstName: undefined, lastName: undefined };
  const parts = fullName.trim().split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('kushiUser');
    if (savedUser) {
      try {
        const u: User = JSON.parse(savedUser);
        setUser(u);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('kushiUser');
      }
    }
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // align with backend’s expected keys
        // credentials: 'include', // uncomment if your backend sets httpOnly cookies
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        return { ok: false, message: errText || 'Login failed' };
      }

      // Example of possible backend responses:
      // { token, id, fullName, email, customerId }
      const data: any = await res.json();

      // prefer id, fallback to customerId or userId
      const userId = data.id ?? data.customerId ?? data.userId;
      if (!userId) {
        return { ok: false, message: 'Invalid login response: missing user id' };
      }

      // if token present, store it (Bearer or use cookies depending on your setup)
      if (data.token) {
        localStorage.setItem('kushiToken', data.token);
      }

      // Fetch full profile (optional; adjust to your API)
      const profRes = await fetch(`${API_BASE}/api/auth/profile/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(data.token ? { Authorization: `Bearer ${data.token}` } : {}),
        },
      });

      let profile: any;
      if (profRes.ok) {
        profile = await profRes.json();
      } else {
        // fallback to login payload if profile endpoint not available
        profile = {
          id: userId,
          fullName: data.fullName ?? data.name ?? '',
          email: data.email ?? email,
          phone: data.phone,
          totalBookings: data.totalBookings,
          totalSpent: data.totalSpent,
        };
      }

      const { firstName, lastName } = deriveNames(profile.fullName ?? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim());

      const normalizedUser: User = {
        id: String(profile.id ?? userId),
        fullName: profile.fullName ?? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
        email: profile.email ?? email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        pincode: profile.pincode,
        joinDate: profile.joinDate,
        totalBookings: profile.totalBookings,
        totalSpent: profile.totalSpent,
        firstName,
        lastName,
      };

      setUser(normalizedUser);
      setIsAuthenticated(true);
      localStorage.setItem('kushiUser', JSON.stringify(normalizedUser));
      return { ok: true };
    } catch (e) {
      return { ok: false, message: 'Network error' };
    }
  };

  const signup: AuthContextType['signup'] = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        return { ok: false, message: msg || 'Signup failed' };
      }

      const data: any = await res.json(); // assume { id, fullName, email, ... } or similar
      const fullName = data.fullName ?? `${userData.firstName} ${userData.lastName}`.trim();
      const { firstName, lastName } = deriveNames(fullName);

      const newUser: User = {
        id: String(data.id ?? data.customerId ?? data.userId),
        fullName,
        email: data.email ?? userData.email,
        phone: data.phone ?? userData.phone,
        firstName,
        lastName,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('kushiUser', JSON.stringify(newUser));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kushiUser');
    localStorage.removeItem('kushiToken');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      const updatedUser = { ...user, ...userData };
      // Optionally call backend to persist profile changes here
      setUser(updatedUser);
      localStorage.setItem('kushiUser', JSON.stringify(updatedUser));
      return true;
    } catch {
      return false;
    }
  };

  const value: AuthContextType = { user, isAuthenticated, login, signup, logout, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
