import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Participant, RSVPStatus, Run } from 'components/types';
import { editRSVPRun } from 'backend/run';
import { FIREBASE_AUTH } from 'firebaseConfig';

const ViewRunScreen = () => {
  const {
    id,
    runTitle,
    runMessage,
    runNotificationMessage,
    runDate,
    runImageUrl,
    runIsRSVP,
    runParticipants,
  } = useLocalSearchParams();

  const [RSVP, setRSVP] = useState<RSVPStatus>();
  const participants = runParticipants ? JSON.parse(runParticipants as string) : [];
  const updatedImageUrl = (runImageUrl as string)?.replace('/o/runs/', '/o/runs%2F');
  const formattedRunDate = new Date(runDate as string).toLocaleString();

  const getStatusCount = (status: RSVPStatus) => {
    return participants.filter((p: Participant) => p.status === status).length;
  };

  const yesCount = getStatusCount('yes');
  const noCount = getStatusCount('no');
  const maybeCount = getStatusCount('maybe');

  const handleRSVP = (option: RSVPStatus) => {
    setRSVP(option);
    editRSVPRun(id as string, FIREBASE_AUTH.currentUser?.uid as string, option);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 py-2">
        <Text className="text-2xl font-bold text-text">{runTitle}</Text>
        {runImageUrl ? (
          <Image
            source={{ uri: updatedImageUrl }}
            className="h-[350px] w-[350px] self-center rounded-lg shadow-lg"
            resizeMode="cover"
          />
        ) : null}
        <Text className="mt-2 text-text">{runMessage}</Text>
        <Text className="mt-2 text-text">{formattedRunDate}</Text>
        {runIsRSVP && (
          <View>
            <Text className="my-2 text-lg font-semibold text-text">Will you attend?</Text>
            <View className="mb-2 flex-row justify-between">
              <TouchableOpacity
                disabled={RSVP === 'yes'}
                onPress={() => handleRSVP('yes')}
                className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${
                  RSVP === 'yes' ? 'bg-green-600' : 'bg-green-100'
                }`}>
                <Text
                  className={` font-medium ${RSVP === 'yes' ? 'text-white' : 'text-green-600'}`}>
                  Yes: {RSVP === 'yes' ? yesCount + 1 : yesCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={RSVP === 'maybe'}
                onPress={() => handleRSVP('maybe')}
                className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${
                  RSVP === 'maybe' ? 'bg-yellow-500' : 'bg-yellow-100'
                }`}>
                <Text
                  className={` font-medium ${RSVP === 'maybe' ? 'text-white' : 'text-yellow-600'}`}>
                  Maybe: {RSVP === 'maybe' ? maybeCount + 1 : maybeCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={RSVP === 'no'}
                onPress={() => handleRSVP('no')}
                className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${
                  RSVP === 'no' ? 'bg-red-600' : 'bg-red-100'
                }`}>
                <Text className={` font-medium ${RSVP === 'no' ? 'text-white' : 'text-red-600'}`}>
                  No: {RSVP === 'no' ? noCount + 1 : noCount}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="mb-2 text-lg font-semibold text-text">Participants:</Text>
              {participants.length > 0 ? (
                <View className="rounded-lg bg-gray-50 p-2">
                  {participants.map((participant: Participant) => (
                    <View
                      key={participant.id}
                      className="flex-row items-center border-b border-gray-100 py-1">
                      <View
                        className={`mr-2 h-2 w-2 rounded-full ${
                          participant.status === 'yes'
                            ? 'bg-green-500'
                            : participant.status === 'maybe'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <Text className="text-gray-700">{participant.id}</Text>
                      <Text className="ml-auto text-xs text-gray-400">{participant.status}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="italic text-gray-500">No participants yet. Be the first!</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ViewRunScreen;
