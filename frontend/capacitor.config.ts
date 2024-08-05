import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.modugisang.site',
  appName: '모두기상',
  webDir: 'build',
  bundledWebRuntime: false,
  ios: {
    cordovaLinkerFlags: ['-ObjC'],
    scheme: 'capacitor',
    hostname: 'localhost',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    Keyboard: {
      resize: 'body',
    },
  },
};

export default config;