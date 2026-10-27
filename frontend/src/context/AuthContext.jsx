import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('edupulse_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
          }
        } catch (error) {
          console.error('Session initialization error:', error);
          localStorage.removeItem('edupulse_token');
          localStorage.removeItem('edupulse_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      localStorage.setItem('edupulse_token', res.token);
      localStorage.setItem('edupulse_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      localStorage.setItem('edupulse_token', res.token);
      localStorage.setItem('edupulse_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('edupulse_token');
    localStorage.removeItem('edupulse_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('edupulse_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isFaculty: user?.role === 'faculty',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
