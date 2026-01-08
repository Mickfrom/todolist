import { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/authService';

/**
 * Authentication Context
 * Provides global auth state and functions
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Login function
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} User and token
   */
  const login = async (username, password) => {
    const response = await loginService(username, password);
    const { token, user } = response;

    // Save to state
    setToken(token);
    setUser(user);

    // Save to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { success: true, user };
  };

  /**
   * Register function
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} User and token
   */
  const register = async (username, password) => {
    const response = await registerService(username, password);
    const { token, user } = response;

    // Save to state
    setToken(token);
    setUser(user);

    // Save to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { success: true, user };
  };

  /**
   * Logout function
   * Clears auth state and localStorage
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
