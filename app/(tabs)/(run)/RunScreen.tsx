import { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { getRuns } from 'backend/run'; // Assuming you have a similar function to fetch runs
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

  return (
    <ScrollView className="flex-1 bg-background">
      <RunImageHeader />
      <SafeAreaView className="flex-1 ">
        <Text className="pl-4 text-2xl font-bold text-text">Café Cosé Run Club</Text>
        <Text className="pl-4 text-text">Join us every week on</Text>
        <Text className="pl-4 text-text">Tuesday 7 AM</Text>
        <Text className="pl-4 text-text">Wednesday 6:30 PM</Text>
        <Text className="pl-4 text-text">Saturday 9 AM</Text>

        <View className="mt-2 ">
          {loading ? (
            <View className="gap-4">
              <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
              <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
              <CardLoader width={Dimensions.get('window').width * 0.9} height={200} />
            </View>
          ) : (
            <>
              {upcomingRuns.length > 0 && (
                <Text className="pl-4 text-2xl font-bold text-text">Upcoming Runs</Text>
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
                        runImageUrl: run.imageUrl || '',
                        runIsRSVP: run.isRSVP?.toString(),
                        runParticipants: JSON.stringify(run.participants || []),
                      },
                    })
                  }
                />
              ))}
            </>
          )}
          <Text className="pl-2 text-2xl font-bold text-text">Past Runs</Text>
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
                    runImageUrl: run.imageUrl || '',
                    runIsRSVP: run.isRSVP?.toString(),
                    runParticipants: JSON.stringify(run.participants || []),
                  },
                })
              }
            />
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default RunScreen;
