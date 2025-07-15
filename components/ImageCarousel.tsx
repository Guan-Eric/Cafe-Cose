import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

interface ImageCarouselProps {
  data: string[];
  width: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ data, width }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const renderCarouselItem = ({ item }: { item: string }) => (
    <View
      style={{
        width: width,
        height: width * 1.25,
      }}>
      <Image
        source={{ uri: item }}
        style={{
          alignSelf: 'center',
          width: width,
          height: width,
          resizeMode: 'cover',
          borderRadius: 20,
        }}
      />
    </View>
  );

  return (
    <View style={{ alignItems: 'center', gap: 10 }} className="bg-background">
      {data?.length > 1 ? (
        <>
          <Carousel
            data={data}
            renderItem={renderCarouselItem}
            width={width}
            height={width}
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
      ) : data?.length == 1 ? (
        <Image
          source={{ uri: data[0] }}
          style={{
            alignSelf: 'center',
            width: width,
            height: width,
            resizeMode: 'cover',
            borderRadius: 20,
          }}
        />
      ) : null}
    </View>
  );
};

export default ImageCarousel;
