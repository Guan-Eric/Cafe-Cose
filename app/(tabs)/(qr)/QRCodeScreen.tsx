import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        setUserId(user.uid);
      }
      setLoading(false);
    };

    fetchUserId();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background">
      {userId ? (
        <>
          <Text className="mb-4 text-xl font-bold">Your QR Code</Text>
          <QRCode value={userId} size={200} backgroundColor="#f7f5f1" />
        </>
      ) : (
        <Text className="text-xl font-bold">No user logged in</Text>
      )}
    </View>
  );
};

export default QRCodeScreen;
