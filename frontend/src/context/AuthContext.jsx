import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rider_rescue_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rider_rescue_token'));
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpUserName, setOtpUserName] = useState('');
  const [initialOtp, setInitialOtp] = useState('');
  const [initialRole, setInitialRole] = useState('user');

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('rider_rescue_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
          localStorage.setItem('rider_rescue_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const openLoginModal = (role = 'user') => {
    setInitialRole(role);
    setIsLoginOpen(true);
    setIsSignupOpen(false);
    setIsOtpOpen(false);
  };

  const closeLoginModal = () => setIsLoginOpen(false);

  const openSignupModal = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
    setIsOtpOpen(false);
  };

  const closeSignupModal = () => setIsSignupOpen(false);

  const openOtpModal = (email, name = '', otp = '') => {
    setOtpEmail(email);
    setOtpUserName(name);
    setInitialOtp(otp || '');
    setIsOtpOpen(true);
    setIsSignupOpen(false);
    setIsLoginOpen(false);
  };

  const closeOtpModal = () => {
    setIsOtpOpen(false);
    setInitialOtp('');
  };

  const login = async (email, password, role) => {
    const res = await authService.login({ email, password, role });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('rider_rescue_token', receivedToken);
    localStorage.setItem('rider_rescue_user', JSON.stringify(receivedUser));
    setIsLoginOpen(false);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    openOtpModal(formData.email, formData.name, res.data?.otp || '');
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await authService.verifyOtp({ email, otp });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('rider_rescue_token', receivedToken);
    localStorage.setItem('rider_rescue_user', JSON.stringify(receivedUser));
    setIsOtpOpen(false);
    setInitialOtp('');
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await authService.resendOtp({ email });
    if (res.data?.otp) {
      setInitialOtp(res.data.otp);
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rider_rescue_token');
    localStorage.removeItem('rider_rescue_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isLoginOpen,
    isSignupOpen,
    isOtpOpen,
    otpEmail,
    otpUserName,
    initialOtp,
    initialRole,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    openOtpModal,
    closeOtpModal,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
