import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin + '/api' : '/api');

  // Logout handler
  const logout = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('essential_user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('essential_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.isDemo) {
          setIsDemoMode(true);
        }
      } catch (err) {
        localStorage.removeItem('essential_user');
      }
    }
    setLoading(false);
  }, []);

  // Global fetch interceptor to handle 401 Unauthorized (e.g., expired or invalid session)
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : '');
      if (response.status === 401 && !url.includes('/auth/login')) {
        console.warn('Unauthorized request detected (401). Logging out...');
        logout();
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Login handler
  const login = async (emailOrUsername, password) => {
    setError(null);
    setLoading(true);

    try {
      // Try backend first
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Safeguard: Ensure only admins can log in to this dedicated admin panel!
      if (data.role !== 'admin') {
        throw new Error('Bạn không có quyền truy cập trang quản trị viên này.');
      }

      setUser(data);
      setIsDemoMode(false);
      localStorage.setItem('essential_user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      console.warn('Backend admin login failed, attempting mock fallback:', err.message);

      // Demo/Mock Fallback logic
      const mockUsername = emailOrUsername.split('@')[0].toLowerCase();
      
      // Admin account
      if ((mockUsername === 'admin' || emailOrUsername === 'admin@gmail.com') && password === 'admin123') {
        const demoAdmin = {
          _id: 'demo-admin-id-1234567890',
          username: 'admin_demo',
          email: 'admin@gmail.com',
          role: 'admin',
          token: 'demo-jwt-token-admin',
          isDemo: true
        };
        setUser(demoAdmin);
        setIsDemoMode(true);
        localStorage.setItem('essential_user', JSON.stringify(demoAdmin));
        setLoading(false);
        return demoAdmin;
      }
      
      setLoading(false);
      const errMsg = err.message.includes('Failed to fetch') 
        ? 'Không thể kết nối đến máy chủ. Hãy dùng tài khoản admin thử nghiệm: admin/admin123'
        : err.message;
      setError(errMsg);
      throw new Error(errMsg);
    }
  };



  // Update current user details
  const updateCurrentUserDetails = (updatedData) => {
    if (user) {
      const mergedUser = { ...user, ...updatedData };
      setUser(mergedUser);
      localStorage.setItem('essential_user', JSON.stringify(mergedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isDemoMode, login, logout, API_URL, updateCurrentUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
