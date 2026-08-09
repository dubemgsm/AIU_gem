'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('aiu_session');
      if (savedSession) {
        try {
          setUser(JSON.parse(savedSession));
        } catch (e) {
          sessionStorage.removeItem('aiu_session');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        sessionStorage.setItem('aiu_session', JSON.stringify(data.user));
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return { success: false, error: 'Network error. Try again later.' };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aiu_session');
    }
  };

  const register = async (username, password, name, branch) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, branch })
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        sessionStorage.setItem('aiu_session', JSON.stringify(data.user));
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      return { success: false, error: 'Network error. Try again later.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
