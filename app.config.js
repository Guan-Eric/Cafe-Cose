import 'dotenv/config';
export default {
  expo: {
    name: 'Cafe-Cose',
    slug: 'cafe-cose',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.cafe.cose',
      usesAppleSignIn: true,
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription:
          'We need access to your photos to allow you to upload your profile picture.',
        NSPhotoLibraryAddUsageDescription:
          'This app needs permission to save images to your photo library.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#f7f5f1',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/icon.png',
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Allow Café Cosé to access your camera',
        },
      ],
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#f7f5f1',
        },
      ],
      ['expo-notifications', {}],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow Café Cosé to access your photos.',
          savePhotosPermission: 'Allow Café Cosé to save photos.',
          isAccessMediaLocationEnabled: true,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '8d4e2b65-724d-47bf-9119-393c41cc2524',
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
    owner: 'guan-eric',
    updates: {
      url: 'https://u.expo.dev/8d4e2b65-724d-47bf-9119-393c41cc2524',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    experiments: {
      typedRoutes: true,
    },
  },
};
