import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults for credentials if cookies are used for refresh tokens
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check local storage for user info on initial load
    const storedUser = localStorage.getItem('glp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('glp_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('glp_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await axios.post('https://glp-pharma-backend.vercel.app/api/auth/google', { credential });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('glp_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://glp-pharma-backend.vercel.app/api/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      localStorage.removeItem('glp_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
