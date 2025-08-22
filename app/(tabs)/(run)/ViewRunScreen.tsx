import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Participant, RSVPStatus } from 'components/types';
import { editRSVPRun, getParticipants } from 'backend/run';
import { FIREBASE_AUTH } from 'firebaseConfig';
import ReminderModal from 'components/modals/ReminderModal';
import BackButton from 'components/BackButton';
import ParticipantsCard from 'components/cards/ParticipantsCard';
import ImageHeaderCarousel from 'components/ImageHeaderCarousel';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

const ViewRunScreen = () => {
  const { id, runTitle, runMessage, runDate, runImageUrls, runIsRSVP, runParticipants } =
    useLocalSearchParams();

  const [participants, setParticipants] = useState<Participant[]>(
    runParticipants ? JSON.parse(runParticipants as string) : []
  );
  const [RSVP, setRSVP] = useState<RSVPStatus>(
    participants.find((participant) => participant.id === FIREBASE_AUTH.currentUser?.uid)?.status ||
      undefined
  );
  const [modalVisible, setModalVisible] = useState(false);
  const updatedImageUrl = (runImageUrls as string)?.replaceAll('/o/runs/', '/o/runs%2F');
  const imageUrls = updatedImageUrl.length > 0 ? updatedImageUrl.split(',') : [];

  const formattedRunDate =
    new Date(runDate as string).toLocaleDateString([], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) +
    ' at ' +
    new Date(runDate as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getStatusCount = (status: RSVPStatus) => {
    return participants.filter((p: Participant) => p.status === status).length;
  };

  let yesCount = getStatusCount('yes');
  let noCount = getStatusCount('no');
  let maybeCount = getStatusCount('maybe');

  const handleRSVP = async (option: RSVPStatus) => {
    setRSVP(option);
    editRSVPRun(id as string, FIREBASE_AUTH.currentUser?.uid as string, option);
    setParticipants(await getParticipants(id as string));
    yesCount = getStatusCount('yes');
    noCount = getStatusCount('no');
    maybeCount = getStatusCount('maybe');
  };

  return (
    <View className="flex-1">
      {imageUrls.length > 0 ? (
        <>
          <BackButtonWithBackground />
          <ImageHeaderCarousel data={imageUrls} runId={id as string} isDownloadable={true} />
        </>
      ) : null}
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView>
          {imageUrls.length === 0 ? <BackButton color="#3C2A20" /> : null}
          <View className="mt-2 flex-row px-4">
            <Text className="font-sans text-2xl text-text">{runTitle}</Text>
          </View>

          <View className="flex-1 px-4 pb-2">
            <View className="mt-3 flex-row items-center justify-between">
              <Text className=" text-text">{formattedRunDate}</Text>
              {new Date(runDate as string) > new Date() && (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="mr-1 rounded rounded-lg bg-blue-500 p-2">
                  <Text className="text-center text-white">Set Reminder</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text className="mt-2 text-text">{runMessage}</Text>
            <ReminderModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              runDate={runDate as string}
            />
            {runIsRSVP && (
              <View>
                {new Date(runDate as string) > new Date() ? (
                  <>
                    <Text className="mt-2 text-lg font-semibold text-text">Will you attend?</Text>
                    <View className="mt-2 flex-row justify-between">
                      <TouchableOpacity
                        disabled={RSVP === 'yes'}
                        onPress={() => handleRSVP('yes')}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'yes' ? 'bg-green-600' : 'bg-green-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'yes' ? 'text-white' : 'text-green-600'}`}>
                          Yes: {yesCount}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={RSVP === 'maybe'}
                        onPress={() => handleRSVP('maybe')}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'maybe' ? 'bg-yellow-500' : 'bg-yellow-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'maybe' ? 'text-white' : 'text-yellow-600'}`}>
                          Maybe: {maybeCount}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={RSVP === 'no'}
                        onPress={() => handleRSVP('no')}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'no' ? 'bg-red-600' : 'bg-red-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'no' ? 'text-white' : 'text-red-600'}`}>
                          No: {noCount}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="mt-2 flex-row justify-between">
                      <TouchableOpacity
                        disabled={true}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'yes' ? 'bg-green-600' : 'bg-green-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'yes' ? 'text-white' : 'text-green-600'}`}>
                          Yes: {yesCount}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={true}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'maybe' ? 'bg-yellow-500' : 'bg-yellow-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'maybe' ? 'text-white' : 'text-yellow-600'}`}>
                          Maybe: {maybeCount}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={true}
                        className={`mx-1 flex-1 flex-row items-center justify-center rounded-lg py-3 ${RSVP === 'no' ? 'bg-red-600' : 'bg-red-100'}`}>
                        <Text
                          className={` font-sans ${RSVP === 'no' ? 'text-white' : 'text-red-600'}`}>
                          No: {noCount}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <View>
                  <Text className="my-2 font-sans text-lg text-text">Participants:</Text>
                  {participants.length > 0 ? (
                    <View className="rounded-lg bg-gray-50 p-2">
                      {participants
                        .sort((a, b) => {
                          const statusOrder: { [key: string]: number } = {
                            yes: 1,
                            maybe: 2,
                            no: 3,
                          };
                          return statusOrder[a.status as string] - statusOrder[b.status as string];
                        })
                        .map((participant: Participant) => (
                          <ParticipantsCard key={participant.id} participant={participant} />
                        ))}
                    </View>
                  ) : (
                    <Text className="italic text-gray-500">No participants yet. Be the first!</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ViewRunScreen;
