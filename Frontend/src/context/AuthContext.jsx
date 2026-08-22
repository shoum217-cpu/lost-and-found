import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any legacy demo user from older sessions
    const savedUserStr = localStorage.getItem('findit_user');
    const savedToken = localStorage.getItem('findit_token');

    if (savedUserStr && savedToken) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed._id && parsed._id !== 'usr_demo_123' && !parsed.email?.includes('demo')) {
          setUser(parsed);
          setToken(savedToken);
        } else {
          // Clear fake demo user
          localStorage.removeItem('findit_user');
          localStorage.removeItem('findit_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        localStorage.removeItem('findit_user');
        localStorage.removeItem('findit_token');
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('findit_user', JSON.stringify(data));
      localStorage.setItem('findit_token', data.token);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message || 'Invalid email or password' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('findit_user', JSON.stringify(data));
      localStorage.setItem('findit_token', data.token);
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updated = await authService.updateProfile(updates, token);
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('findit_user', JSON.stringify(merged));
      return { success: true };
    } catch (error) {
      const merged = { ...user, ...updates };
      setUser(merged);
      localStorage.setItem('findit_user', JSON.stringify(merged));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('findit_user');
    localStorage.removeItem('findit_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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
