import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta recuperar a sessão salva
    const storedToken = localStorage.getItem('@BSL:token');
    const storedUser = localStorage.getItem('@BSL:user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const data = await api.post('/auth/login', { email, password });

      localStorage.setItem('@BSL:token', data.token);
      localStorage.setItem('@BSL:user', JSON.stringify(data.user));
      
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  }

  async function registerAccount(userData) {
    try {
      const data = await api.post('/auth/register', userData);

      localStorage.setItem('@BSL:token', data.token);
      localStorage.setItem('@BSL:user', JSON.stringify(data.user));
      
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('@BSL:token');
    localStorage.removeItem('@BSL:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, registerAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
