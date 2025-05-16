import { Participant } from 'components/types';
import { View, Image, Text } from 'react-native';

const ParticipantsCard = ({ participant }: { participant: Participant }) => {
  return (
    <View key={participant.id} className="flex-row items-center py-1">
      <Image
        source={{ uri: participant.url.replace('/o/profile/', '/o/profile%2F') }}
        className="mx-2 h-8 w-8 rounded-full"
      />
      <Text className="text-gray-700">{participant.name}</Text>

      <Text className="ml-auto text-xs text-gray-400">{participant.status}</Text>
      <View
        className={`ml-2 h-2 w-2 rounded-full ${
          participant.status === 'yes'
            ? 'bg-green-500'
            : participant.status === 'maybe'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      />
    </View>
  );
};

export default ParticipantsCard;
