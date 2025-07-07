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
        <Text className="mb-2 text-2xl font-bold text-[#762e1f]">Your Café Pass</Text>
        <Text className="mb-6 text-[#1a1a1a]">Scan at the counter to earn stamps ☕</Text>
        <View className="rounded-2xl bg-white p-4 shadow-md">
          <QRCode value={userId || 'loading'} size={250} backgroundColor="#ffffff" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRCodeScreen;
