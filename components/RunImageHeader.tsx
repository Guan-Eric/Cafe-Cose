import { Dimensions, View } from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';

const screenWidth = Dimensions.get('window').width;
const assetId = require('assets/run.mp4');
const videoSource: VideoSource = {
  assetId,
};

export default function RunImageHeader() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
    player.loop = true;
    player.muted = true;
  });
  return (
    <View className="relative">
      <VideoView
        contentFit="cover"
        player={player}
        style={{ width: screenWidth, height: screenWidth }}
        nativeControls={false}
      />
      <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background p-3" />
    </View>
  );
}
