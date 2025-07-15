import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Promotion } from 'components/types';
import { getLatestPromotion } from 'backend/promotion';
import PromotionComponent from 'components/PromotionComponent';

function PromotionScreen() {
  const [promotion, setPromotion] = useState<Promotion | null>();

  const fetchLatestPromotion = async () => {
    const data = await getLatestPromotion();
    setPromotion(data);
  };

  useEffect(() => {
    fetchLatestPromotion();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLatestPromotion();
    }, [])
  );

  const handleEditPromotion = async () => {
    router.push({
      pathname: '/(admin)/(home)/EditPromotionScreen',
      params: {
        id: promotion?.id,
        title: promotion?.title,
        message: promotion?.message,
        notificationMessage: promotion?.notificationMessage,
        createdAt: promotion?.createdAt?.toString(),
        imageUrl: promotion?.imageUrl,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <PromotionComponent
        id={promotion?.id || ''}
        title={promotion?.title || ''}
        message={promotion?.message || ''}
        imageUrl={promotion?.imageUrl || ''}
        buttonTitle="Edit"
        handleDismiss={handleEditPromotion}
      />
    </View>
  );
}

export default PromotionScreen;
