import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import QRCode from 'react-native-qrcode-svg';
import BackButton from 'components/BackButton';
import * as Brightness from 'expo-brightness';

const QRCodeScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const originalBrightnessRef = useRef<number | null>(null); // <-- useRef instead of useState

  const fetchUserId = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  };

  const boostBrightness = async () => {
    const { status } = await Brightness.requestPermissionsAsync();

    if (status === 'granted') {
      const currentBrightness = await Brightness.getBrightnessAsync();
      originalBrightnessRef.current = currentBrightness;
      await Brightness.setBrightnessAsync(1);
    }
  };

  useEffect(() => {
    fetchUserId();
    boostBrightness();

    return () => {
      if (originalBrightnessRef.current !== null) {
        Brightness.setBrightnessAsync(originalBrightnessRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#f7f5f1]">
      <BackButton />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="mb-2 font-sans text-3xl text-primary">Your QR Code</Text>
        <Text className="mb-6 font-sans text-text">Scan at the counter to earn stamps ☕</Text>
        <View className="rounded-2xl bg-white p-4 shadow-lg">
          <QRCode value={userId || 'loading'} size={250} backgroundColor="#ffffff" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRCodeScreen;
