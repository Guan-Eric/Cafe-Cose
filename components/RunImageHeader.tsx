import { Dimensions, View } from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const MAX_HEIGHT = screenWidth;
const MIN_HEIGHT = 10;
const assetId = require('assets/run.mp4');
const videoSource: VideoSource = { assetId };

export default function RunImageHeader() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
    player.loop = true;
    player.muted = true;
  });

  const headerHeight = useSharedValue(MAX_HEIGHT);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      // Apply resistance/damping to make dragging feel smoother
      const resistance = 0.8; // Adjust this value (0.1 = very resistant, 1.0 = no resistance)
      const dampedTranslation = e.translationY * resistance;

      headerHeight.value = Math.min(
        MAX_HEIGHT,
        Math.max(MIN_HEIGHT, headerHeight.value + dampedTranslation)
      );
    })
    .onEnd((e) => {
      const midpoint = (MAX_HEIGHT + MIN_HEIGHT) / 2;
      const velocity = e.velocityY;

      // Consider velocity for more natural feel
      // If user is swiping fast in a direction, respect that intention
      const shouldSnapToMin =
        headerHeight.value < midpoint || (velocity > 500 && headerHeight.value < MAX_HEIGHT * 0.8);

      const shouldSnapToMax =
        headerHeight.value >= midpoint ||
        (velocity < -500 && headerHeight.value > MIN_HEIGHT * 1.2);

      if (shouldSnapToMin) {
        headerHeight.value = withSpring(MIN_HEIGHT, {
          damping: 20, // Lower damping = more bouncy
          stiffness: 150, // Higher stiffness = faster animation
          velocity: velocity * 0.5, // Consider current velocity
        });
      } else if (shouldSnapToMax) {
        headerHeight.value = withSpring(MAX_HEIGHT, {
          damping: 20,
          stiffness: 150,
          velocity: velocity * 0.5,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: screenWidth,
    height: headerHeight.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        className="w-full"
        style={[animatedStyle, { maxHeight: screenWidth, minHeight: 120 }]}>
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
