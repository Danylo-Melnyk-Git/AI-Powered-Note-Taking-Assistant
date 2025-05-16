import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../services/api';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      getUserSettings().then(data => {
        setSettings(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setSettings(null);
    }
  }, [isAuthenticated]);

  const saveSettings = async (newSettings) => {
    setLoading(true);
    await updateUserSettings(newSettings);
    setSettings(newSettings);
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ settings, saveSettings, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
