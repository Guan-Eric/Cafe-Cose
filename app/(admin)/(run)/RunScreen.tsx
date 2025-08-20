import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { getRuns } from 'backend/run'; // Assuming you have a similar function to fetch runs
import { router, useFocusEffect } from 'expo-router';
import { Run } from 'components/types';
import RunCard from 'components/cards/RunCard';

function RunScreen() {
  const [runs, setRuns] = useState<Run[]>([]);

  const fetchRuns = async () => {
    const data = await getRuns();
    setRuns(data);
  };

  useEffect(() => {
    fetchRuns();
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
          <Text className="font-sans text-3xl text-text">Runs</Text>
          <TouchableOpacity onPress={handleAddRun} className="rounded-full bg-primary px-4 py-2">
            <Text className="font-sans text-lg text-offwhite">+ Add Run</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 ">
          <View className="mt-2 items-center">
            {runs.length > 0 ? (
              runs.map((run) => (
                <RunCard
                  key={run.id}
                  run={run}
                  onPress={() =>
                    router.push({
                      pathname: '/(admin)/(run)/EditRunScreen',
                      params: {
                        id: run.id,
                        runTitle: run.title,
                        runMessage: run.message,
                        runNotificationMessage: run.notificationMessage,
                        runDate: run.date?.toISOString(),
                        runImageUrls: run.imageUrls,
                        runIsRSVP: run.isRSVP?.toString(),
                        runParticipants: JSON.stringify(run.participants || []),
                      },
                    })
                  }
                />
              ))
            ) : (
              <Text className="text-text">No runs available.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default RunScreen;
