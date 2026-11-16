import { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = getFromStorage('shop_users', []);
    if (users.length === 0) {
      saveToStorage('shop_users', [
        {
          name: 'Demo User',
          email: 'demo@shopsphere.com',
          phone: '9876543210',
          password: 'Demo@123',
          address: {
            fullName: 'Demo User',
            mobile: '9876543210',
            house: 'Flat 402, Emerald Residency',
            street: 'MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            country: 'India',
          },
        },
      ]);
    }
    const current = getFromStorage('shop_current_user');
    setUser(current);
    setLoading(false);
  }, []);

  const login = (email, password, remember = false) => {
    const users = getFromStorage('shop_users', []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (!found) return { success: false, message: 'Invalid email or password' };

    const currentUser = {
      name: found.name,
      email: found.email,
      phone: found.phone,
      address: found.address || null,
    };
    saveToStorage('shop_current_user', currentUser);
    setUser(currentUser);

    if (remember) saveToStorage('shop_remember_email', email);
    else removeFromStorage('shop_remember_email');

    return { success: true, message: `Welcome back, ${found.name.split(' ')[0]}!` };
  };

  const register = (userData) => {
    const users = getFromStorage('shop_users', []);
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim())) {
      return { success: false, message: 'Email already registered. Please login.' };
    }
    if (!userData.name || userData.name.trim().length < 2) {
      return { success: false, message: 'Please enter a valid name' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    if (!/^[6-9]\d{9}$/.test(userData.phone)) {
      return { success: false, message: 'Please enter a valid 10-digit Indian phone number' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }
    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    const newUser = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone.trim(),
      password: userData.password,
      address: null,
    };
    users.push(newUser);
    saveToStorage('shop_users', users);
    return { success: true, message: 'Account created successfully! Please login.' };
  };

  const logout = () => {
    removeFromStorage('shop_current_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return { success: false };
    const updated = { ...user, ...updates };
    saveToStorage('shop_current_user', updated);
    setUser(updated);

    const users = getFromStorage('shop_users', []);
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveToStorage('shop_users', users);
    }
    return { success: true };
  };

  const deleteAccount = () => {
    if (!user) return;
    const users = getFromStorage('shop_users', []).filter((u) => u.email !== user.email);
    saveToStorage('shop_users', users);
    removeFromStorage('shop_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
