import { Dimensions, View } from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const MAX_HEIGHT = screenWidth;
const MIN_HEIGHT = 10;
const assetId = require('assets/run.mp4');
const videoSource: VideoSource = { assetId };

export default function RunVideoHeader() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
    player.loop = true;
    player.muted = true;
  });

  const headerHeight = useSharedValue(MAX_HEIGHT);

  const dragOffset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      // Cancel any ongoing animations when gesture begins
      dragOffset.value = 0;
    })
    .onUpdate((e) => {
      // Use accumulative translation for smoother feel
      const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, MAX_HEIGHT + e.translationY));

      // Apply rubber band effect at boundaries
      if (newHeight <= MIN_HEIGHT) {
        const overscroll = MAX_HEIGHT + e.translationY - MIN_HEIGHT;
        const resistance = Math.max(0.1, 1 - Math.abs(overscroll) / 100);
        headerHeight.value = MIN_HEIGHT + overscroll * resistance;
      } else if (newHeight >= MAX_HEIGHT) {
        const overscroll = MAX_HEIGHT + e.translationY - MAX_HEIGHT;
        const resistance = Math.max(0.1, 1 - Math.abs(overscroll) / 100);
        headerHeight.value = MAX_HEIGHT + overscroll * resistance;
      } else {
        headerHeight.value = newHeight;
      }
    })
    .onEnd((e) => {
      const velocity = e.velocityY;
      const currentHeight = headerHeight.value;

      // More sophisticated snapping logic
      const distanceFromMin = Math.abs(currentHeight - MIN_HEIGHT);
      const distanceFromMax = Math.abs(currentHeight - MAX_HEIGHT);
      const threshold = (MAX_HEIGHT - MIN_HEIGHT) * 0.3; // 30% threshold

      // Consider both position and velocity for snapping decision
      let targetHeight: number;

      if (Math.abs(velocity) > 800) {
        // High velocity - respect the direction
        targetHeight = velocity > 0 ? MIN_HEIGHT : MAX_HEIGHT;
      } else if (distanceFromMin < threshold) {
        // Close to min - snap to min
        targetHeight = MIN_HEIGHT;
      } else if (distanceFromMax < threshold) {
        // Close to max - snap to max
        targetHeight = MAX_HEIGHT;
      } else {
        // In middle - snap to closest
        targetHeight = distanceFromMin < distanceFromMax ? MIN_HEIGHT : MAX_HEIGHT;
      }

      // Use different spring configs based on target
      const isSnappingToMin = targetHeight === MIN_HEIGHT;

      headerHeight.value = withSpring(targetHeight, {
        damping: isSnappingToMin ? 25 : 20,
        stiffness: isSnappingToMin ? 200 : 180,
        mass: 0.8,
        velocity: velocity * 0.3, // Inherit some velocity but dampen it
      });
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
