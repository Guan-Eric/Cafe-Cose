import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, ImageBackground } from 'react-native';
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import QRCode from 'react-native-qrcode-svg';
import BackButton from 'components/BackButton';
import { RotateInDownLeft } from 'react-native-reanimated';

const QRCodeScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserId = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    fetchUserId();
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
