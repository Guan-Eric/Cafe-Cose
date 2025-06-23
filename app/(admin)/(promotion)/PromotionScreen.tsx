import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Promotion } from 'components/types';
import AnnouncementCard from 'components/cards/AnnouncementCard';
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

  const handleCreatePromotion = async () => {
    router.push('/(admin)/(promotion)/CreatePromotionScreen');
  };

  const handleEditPromotion = async () => {
    router.push('/(admin)/(promotion)/EditPromotionScreen');
  };

  return (
    <View>
      <PromotionComponent
        id={promotion?.id || ''}
        title={promotion?.title || ''}
        message={promotion?.message || ''}
        buttonTitle="Edit"
        handleDismiss={handleEditPromotion}
      />
    </View>
  );
}

export default PromotionScreen;
