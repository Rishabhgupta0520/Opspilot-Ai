import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('opspilot_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('opspilot_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
          localStorage.setItem('opspilot_user', JSON.stringify(res.data.data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('opspilot_token', newToken);
    localStorage.setItem('opspilot_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, role) => {
    const res = await api.post('/auth/register', { username, email, password, role });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('opspilot_token', newToken);
    localStorage.setItem('opspilot_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const quickLogin = async (personaRole) => {
    const credentials = {
      admin: { email: 'admin@opspilot.ai', password: 'Admin@123456' },
      manager: { email: 'manager@opspilot.ai', password: 'Manager@123456' },
      operator: { email: 'operator@opspilot.ai', password: 'Operator@123456' },
      viewer: { email: 'viewer@opspilot.ai', password: 'Viewer@123456' }
    };
    const target = credentials[personaRole] || credentials.admin;
    return login(target.email, target.password);
  };

  const logout = () => {
    localStorage.removeItem('opspilot_token');
    localStorage.removeItem('opspilot_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
