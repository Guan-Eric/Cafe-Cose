import { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Pressable, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Carousel from 'react-native-reanimated-carousel';
import useButtonAnimation from './useButtonAnimation';
import { saveImageToGallery } from 'backend/image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface ImageHeaderCarouselProps {
  data: string[];
  runId: string; // Add runId prop
  imageStoragePaths?: string[]; // Optional: if you have the storage paths
  isDownloadable: boolean;
}

const ImageHeaderCarousel = ({
  data,
  runId,
  imageStoragePaths,
  isDownloadable,
}: ImageHeaderCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const screenWidth = Dimensions.get('window').width;
  const MAX_HEIGHT = screenWidth;
  const MIN_HEIGHT = 120;
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(1.05);

  const headerHeight = useSharedValue(MAX_HEIGHT);
  const dotsOpacity = useSharedValue(1);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      headerHeight.value = Math.min(
        MAX_HEIGHT,
        Math.max(MIN_HEIGHT, headerHeight.value + e.translationY)
      );
      console.log(headerHeight.value);
    })
    .onEnd(() => {
      const midpoint = (MAX_HEIGHT + MIN_HEIGHT) / 2;
      headerHeight.value =
        headerHeight.value < midpoint
          ? withSpring(MIN_HEIGHT, { damping: 15 })
          : withSpring(MAX_HEIGHT, { damping: 15 });
      console.log(headerHeight.value);
    });

  const showDotsWithTimer = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    dotsOpacity.value = withTiming(1, { duration: 200 });

    hideTimeout.current = setTimeout(() => {
      dotsOpacity.value = withTiming(0, { duration: 400 });
    }, 3000);
  };

  useEffect(() => {
    showDotsWithTimer();
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: screenWidth,
    height: headerHeight.value,
  }));

  const dotsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: isDownloadable ? [{ scale: scaleValue.value }] : [],
  }));

  const handleSaveImage = async (index: number) => {
    const confirmSave = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Save Image',
        'Do you want to save this image to your gallery?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: () => resolve(true),
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    });

    if (confirmSave) {
      try {
        // If we have storage paths, use them; otherwise construct from runId
        const storagePath = imageStoragePaths?.[index] || `runs/${runId}_${index}`;
        await saveImageToGallery(storagePath);
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Error', 'Failed to save image to gallery');
      }
    }
  };

  const renderCarouselItem = ({ item, index }: { item: string; index: number }) => (
    <View
      style={{
        width: screenWidth,
        height: screenWidth,
      }}>
      <Pressable
        onLongPress={() => handleSaveImage(index)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}>
        <Animated.Image
          style={[
            {
              alignSelf: 'center',
              width: screenWidth,
              height: screenWidth,
              resizeMode: 'cover',
            },
            animatedImageStyle,
          ]}
          source={{ uri: item }}
        />
      </Pressable>
    </View>
  );

  const renderSingleImage = () => (
    <Pressable
      onLongPress={() => handleSaveImage(0)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        width: screenWidth,
        height: screenWidth, // Fixed height as in your original code
        position: 'relative',
      }}>
      <Animated.Image
        style={[
          {
            alignSelf: 'center',
            width: screenWidth,
            height: screenWidth,
            resizeMode: 'cover',
          },
          animatedImageStyle,
        ]}
        source={{ uri: data[0] }}
      />
      <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background pb-2 pt-3">
        <View className=" h-1.5 w-10 rounded-full bg-input" />
      </View>
    </Pressable>
  );

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[{ alignItems: 'center' }, animatedStyle]}
        className="relative bg-background">
        {data?.length > 1 ? (
          <>
            <Carousel
              data={data}
              renderItem={renderCarouselItem}
              width={screenWidth}
              height={screenWidth}
              loop={false}
              onProgressChange={(_offsetProgress, absoluteProgress) => {
                const index = Math.round(absoluteProgress);
                setCurrentIndex(index);
                showDotsWithTimer();
              }}
            />
            <Animated.View
              style={dotsAnimatedStyle}
              className="absolute bottom-10 items-center rounded-full bg-background p-3"
              pointerEvents="none">
              <AnimatedDotsCarousel
                length={data?.length}
                currentIndex={currentIndex}
                maxIndicators={data?.length}
                activeIndicatorConfig={{
                  color: '#762e1f',
                  margin: 3,
                  opacity: 1,
                  size: 10,
                }}
                inactiveIndicatorConfig={{
                  color: '#e7e6e4',
                  margin: 3,
                  opacity: 1,
                  size: 8,
                }}
                decreasingDots={[
                  {
                    config: {
                      color: '#e7e6e4',
                      margin: 3,
                      opacity: 1,
                      size: 8,
                    },
                    quantity: 1,
                  },
                ]}
              />
            </Animated.View>
            <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background pb-2 pt-3">
              <View className=" h-1.5 w-10 rounded-full bg-input" />
            </View>
          </>
        ) : data?.length === 1 ? (
          renderSingleImage()
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
};

export default ImageHeaderCarousel;
