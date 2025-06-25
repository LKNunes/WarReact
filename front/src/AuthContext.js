import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // <-- Novo estado de loading

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      setIsAuthenticated(true);
    }
    setLoading(false);  // <-- Quando terminar de checar o localStorage, marca como carregado
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNome');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
