import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, Dimensions } from 'react-native';
import { getRuns } from 'backend/run'; // Assuming you have a similar function to fetch runs
import { router, useFocusEffect } from 'expo-router';
import { Run } from 'components/types';
import RunCard from 'components/cards/RunCard';
import CardLoader from 'components/loaders/CardLoader';

function RunScreen() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRuns = async () => {
    const data = await getRuns();
    setRuns(data);
  };

  const sleep = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  useEffect(() => {
    let showLoading = setTimeout(() => setLoading(true), 200);

    const loadData = async () => {
      await fetchRuns();
      clearTimeout(showLoading);
      setLoading(false);
    };

    loadData();

    return () => clearTimeout(showLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRuns();
    }, [])
  );

  const handleAddRun = () => {
    router.push('/(admin)/(run)/CreateRunScreen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="pl-2 text-2xl font-bold text-text">Runs</Text>
        </View>
        <ScrollView className="flex-1 px-4">
          <View className="mt-2 items-center">
            {loading ? (
              <View className="gap-4">
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
              </View>
            ) : (
              runs.map((run) => (
                <RunCard
                  key={run.id}
                  run={run}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/(run)/ViewRunScreen',
                      params: {
                        id: run.id,
                        runTitle: run.title,
                        runMessage: run.message,
                        runNotificationMessage: run.notificationMessage,
                        runDate: run.date?.toISOString(),
                        runImageUrl: run.imageUrl || '',
                        runIsRSVP: run.isRSVP?.toString(),
                        runParticipants: JSON.stringify(run.participants || []),
                      },
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default RunScreen;
