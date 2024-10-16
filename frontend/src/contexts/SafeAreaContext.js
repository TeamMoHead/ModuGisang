import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';

const SafeAreaContext = createContext();

export const SafeAreaProvider = ({ children }) => {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const getSafeAreaInsets = async () => {
    try {
      const insets = await SafeArea.getSafeAreaInsets();
      setSafeAreaInsets(insets);
    } catch (error) {
      console.error('Failed to get safe area insets:', error);
    }
  };

  useEffect(() => {
    getSafeAreaInsets();
    window.addEventListener('resize', getSafeAreaInsets);

    return () => window.removeEventListener('resize', getSafeAreaInsets);
  }, []);

  return (
    <SafeAreaContext.Provider value={safeAreaInsets}>
      {children}
    </SafeAreaContext.Provider>
  );
};

export const useSafeAreaInsets = () => useContext(SafeAreaContext);
