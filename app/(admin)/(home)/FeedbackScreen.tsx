import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, Pressable } from 'react-native';
import { getFeedbacks } from 'backend/feedback'; // Assuming there's a function to fetch feedbacks
import { Feedback } from 'components/types';
import BackButton from 'components/BackButton';
import { router } from 'expo-router';

const FeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const renderItem = ({ item }: { item: Feedback }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(admin)/(home)/ViewFeedbackScreen',
          params: {
            id: item.id,
            feedback: item.feedback,
            name: item.name,
            createdAt: item.createdAt.toLocaleString(),
          },
        })
      }
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
      <Text>{item.feedback}</Text>
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <BackButton color="#3C2A20" />
      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
      />
    </SafeAreaView>
  );
};

export default FeedbackScreen;
