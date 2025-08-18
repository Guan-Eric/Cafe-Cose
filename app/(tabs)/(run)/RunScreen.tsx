import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { getRuns } from 'backend/run';
import { router, useFocusEffect } from 'expo-router';
import { Run } from 'components/types';
import RunCard from 'components/cards/RunCard';
import CardLoader from 'components/loaders/CardLoader';
import RunImageHeader from 'components/RunImageHeader';

function RunScreen() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [upcomingRuns, setUpcomingRuns] = useState<Run[]>([]);
  const [pastRuns, setPastRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRuns = async () => {
    const data = await getRuns();
    setRuns(data);
    setUpcomingRuns(data.filter((run) => run.date > new Date()));
    setPastRuns(data.filter((run) => run.date < new Date()));
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

  return (
    <View className="flex-1 bg-background">
      <RunImageHeader />
      <ScrollView className="flex-1 ">
        <SafeAreaView className="flex-1 px-4 ">
          <View className="mb-2 px-6 ">
            <Text className="font-sans text-2xl text-text">Café Cosé Run Club 🏃‍♂️</Text>
            <Text className="font-sans text-text">• Tuesday 7 AM</Text>
            <Text className="font-sans text-text">• Wednesday 6:30 PM</Text>
            <Text className="font-sans text-text">• Saturday 9 AM</Text>
          </View>
          <View>
            {loading ? (
              <View className="gap-4">
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
                <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
              </View>
            ) : (
              <>
                {upcomingRuns.length > 0 && (
                  <Text className="mb-2 ml-6 font-sans text-xl text-text">Upcoming Runs</Text>
                )}
                {upcomingRuns.map((run) => (
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
                          runImageUrls: run.imageUrls || '',
                          runIsRSVP: run.isRSVP?.toString(),
                          runParticipants: JSON.stringify(run.participants || []),
                        },
                      })
                    }
                  />
                ))}
                <Text className="mb-2 ml-6 font-sans text-xl text-text">Past Runs</Text>
                {pastRuns.map((run) => (
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
                          runImageUrls: run.imageUrls || '',
                          runIsRSVP: run.isRSVP?.toString(),
                          runParticipants: JSON.stringify(run.participants || []),
                        },
                      })
                    }
                  />
                ))}
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export default RunScreen;
