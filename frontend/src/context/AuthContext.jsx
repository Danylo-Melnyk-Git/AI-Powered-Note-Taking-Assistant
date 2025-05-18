import React, { createContext, useContext, useState, useEffect } from 'react';

// Auth ctx for login/logout state
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    console.log('[AuthContext] token changed:', token);
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem('jwt_token', jwt);
    setToken(jwt);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
