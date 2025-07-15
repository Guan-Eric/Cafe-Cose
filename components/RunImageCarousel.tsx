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
}

const RunImageCarousel = ({ data, runId, imageStoragePaths }: RunImageCarouselProps) => {
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
            transform: [{ scale: scaleValue }],
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
      }}>
      <Animated.Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          transform: [{ scale: scaleValue }],
        }}
        source={{ uri: data[0] }}
      />
    </Pressable>
  );

  return (
    <View style={{ alignItems: 'center', gap: 10 }} className="bg-background">
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
        </>
      ) : data?.length === 1 ? (
        renderSingleImage()
      ) : null}
    </View>
  );
};

export default RunImageCarousel;
