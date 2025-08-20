import { Dimensions, View } from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const EXPANDED_HEIGHT = screenWidth;
const COLLAPSED_HEIGHT = 80;
const assetId = require('assets/run.mp4');
const videoSource: VideoSource = { assetId };

export default function RunVideoHeader() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
    player.loop = true;
    player.muted = true;
  });

  const height = useSharedValue(EXPANDED_HEIGHT);
  const startHeight = useSharedValue(EXPANDED_HEIGHT);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = height.value;
    })
    .onUpdate((event) => {
      const newHeight = startHeight.value + event.translationY;
      height.value = Math.max(COLLAPSED_HEIGHT, Math.min(EXPANDED_HEIGHT, newHeight));
    })
    .onEnd((event) => {
      const middle = (EXPANDED_HEIGHT + COLLAPSED_HEIGHT) / 2;
      const shouldCollapse = height.value < middle;
      console.log(shouldCollapse);
      height.value = withSpring(shouldCollapse ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View className="w-full" style={animatedStyle}>
        <VideoView
          contentFit="cover"
          player={player}
          style={{ width: screenWidth, height: '100%' }}
          nativeControls={false}
        />
        <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background pb-2 pt-3">
          <View className=" h-1.5 w-10 rounded-full bg-input" />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
