import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const API_URL = 'http://localhost:5000/api';

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
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setIsDemoMode(false);
      localStorage.setItem('essential_user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      console.warn('Backend login failed. Attempting mock/demo authentication fallback:', err.message);

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
      
      // Client account
      if ((mockUsername === 'client' || emailOrUsername === 'client@gmail.com') && password === 'client123') {
        const demoClient = {
          _id: 'demo-client-id-1234567890',
          username: 'client_demo',
          email: 'client@gmail.com',
          role: 'client',
          token: 'demo-jwt-token-client',
          isDemo: true
        };
        setUser(demoClient);
        setIsDemoMode(true);
        localStorage.setItem('essential_user', JSON.stringify(demoClient));
        setLoading(false);
        return demoClient;
      }

      // If credentials don't match standard demo and backend failed
      setLoading(false);
      const errMsg = err.message.includes('Failed to fetch') 
        ? 'Không thể kết nối đến máy chủ. Hãy dùng tài khoản thử nghiệm: admin/admin123 hoặc client/client123'
        : err.message;
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      setUser(data);
      setIsDemoMode(false);
      localStorage.setItem('essential_user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      console.warn('Backend registration failed, creating mock user session:', err.message);

      // Demo Register Fallback
      const demoUser = {
        _id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        username: username,
        email: email,
        role: 'client',
        token: 'demo-jwt-token-' + Math.random().toString(36).substr(2, 9),
        isDemo: true
      };
      setUser(demoUser);
      setIsDemoMode(true);
      localStorage.setItem('essential_user', JSON.stringify(demoUser));
      setLoading(false);
      return demoUser;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('essential_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isDemoMode, login, register, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
