import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { getFeedbacks } from 'backend/feedback'; // Assuming there's a function to fetch feedbacks
import { Feedback } from 'components/types';

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
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
      <Text>{item.feedback}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString()}
      />
    </SafeAreaView>
  );
};

export default FeedbackScreen;
