import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../utils/api';
import toast from 'react-hot-toast';   

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('eventcheck_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('eventcheck_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('eventcheck_user', JSON.stringify(userData));
      toast.success('Logged in successfully! 🎉');   
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to login');   
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      await signupUser(userData);
      toast.success('Signup successful! 🎉');   
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to signup');   
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eventcheck_user');
    toast.success('Logged out successfully! 👋');   
  };

  const isAdmin = user?.role === 'admin';
  const isParticipant = user?.role === 'participant';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isParticipant,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
