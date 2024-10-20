import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device } from '@capacitor/device';

const SafeAreaContext = createContext();

const SafeAreaContextProvider = ({ children }) => {
  const [platform, setPlatform] = useState('web');
  const [model, setModel] = useState(null);
  const [safeAreaPadding, setSafeAreaPadding] = useState('0 24px');
  const [isSmallModel, setIsSmallModel] = useState(false);

  const getDeviceInfo = async () => {
    const response = await Device.getInfo();
    if (response) {
      const { model: deviceModel, platform: devicePlatform } = response;
      setModel(deviceModel);
      setPlatform(devicePlatform);
      calculatePadding(devicePlatform, deviceModel);
    } else {
      console.error(
        'Error fetching device info:',
        response.error || 'Unknown error',
      );
    }
  };

  const calculatePadding = (platform, model) => {
    if (platform === 'ios') {
      const isSmallModel =
        model?.includes('iPhone12,8') ||
        model?.includes('iPhone14,6') ||
        model?.includes('iPad');
      setSafeAreaPadding(
        isSmallModel ? '24px 24px 12px 24px' : '59px 24px 72px 24px',
      );
      setIsSmallModel(isSmallModel);
    } else {
      setSafeAreaPadding('0 24px');
      setIsSmallModel(false);
    }
  };

  useEffect(() => {
    getDeviceInfo();
  }, []);

  return (
    <SafeAreaContext.Provider
      value={{ platform, model, safeAreaPadding, isSmallModel }}
    >
      {children}
    </SafeAreaContext.Provider>
  );
};

export { SafeAreaContext, SafeAreaContextProvider };
