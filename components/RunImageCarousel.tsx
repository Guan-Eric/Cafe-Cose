import React, { useState } from 'react';
import { View, Image, Dimensions, Pressable, Animated, Alert } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import useButtonAnimation from './useButtonAnimation';
import { saveImageToGallery } from 'backend/image';

interface RunImageCarouselProps {
  data: string[];
  runId: string; // Add runId prop
  imageStoragePaths?: string[]; // Optional: if you have the storage paths
  isDownloadable: boolean;
}

const RunImageCarousel = ({
  data,
  runId,
  imageStoragePaths,
  isDownloadable,
}: RunImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const ScreenWidth = Dimensions.get('screen').width;
  const { scaleValue, handlePressIn, handlePressOut } = useButtonAnimation(1.05);

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
        width: ScreenWidth,
        height: ScreenWidth,
      }}>
      <Pressable
        onLongPress={() => handleSaveImage(index)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}>
        <Animated.Image
          style={{
            alignSelf: 'center',
            width: ScreenWidth,
            height: ScreenWidth,
            resizeMode: 'cover',
            transform: isDownloadable ? [{ scale: scaleValue }] : undefined,
          }}
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
        width: ScreenWidth,
        height: 350, // Fixed height as in your original code
        position: 'relative',
      }}>
      <Animated.Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          transform: isDownloadable ? [{ scale: scaleValue }] : undefined,
        }}
        source={{ uri: data[0] }}
      />
      <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background p-3" />
    </Pressable>
  );

  return (
    <View style={{ alignItems: 'center' }} className="relative bg-background">
      {data?.length > 1 ? (
        <>
          <Carousel
            data={data}
            renderItem={renderCarouselItem}
            width={ScreenWidth}
            height={ScreenWidth}
            loop={false}
            onProgressChange={(_offsetProgress, absoluteProgress) => {
              const index = Math.round(absoluteProgress);
              setCurrentIndex(index);
            }}
          />
          <View className="absolute bottom-0 w-full items-center rounded-tl-3xl rounded-tr-3xl bg-background pt-3">
            <AnimatedDotsCarousel
              length={data?.length}
              currentIndex={currentIndex}
              maxIndicators={data?.length}
              activeIndicatorConfig={{
                color: '#762e1f',
                margin: 3,
                opacity: 1,
                size: 8,
              }}
              inactiveIndicatorConfig={{
                color: 'black',
                margin: 3,
                opacity: 0.5,
                size: 6,
              }}
              decreasingDots={[
                {
                  config: {
                    color: 'black',
                    margin: 3,
                    opacity: 0.5,
                    size: 6,
                  },
                  quantity: 1,
                },
              ]}
            />
          </View>
        </>
      ) : data?.length === 1 ? (
        renderSingleImage()
      ) : null}
    </View>
  );
};

export default RunImageCarousel;
