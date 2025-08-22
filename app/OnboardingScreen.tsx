import { useRef, useState } from 'react';
import { Animated, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from 'firebaseConfig';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Café Cosé',
    description: 'Earn stamps with every coffee you buy.',
    image: require('../assets/slide_1.png'),
  },
  {
    title: 'Join our Run Club',
    description: 'Stay active and enjoy your runs with us.',
    image: require('../assets/slide_2.png'),
  },
  {
    title: 'Get Exclusive Offers',
    description: 'Be the first to know about new deals or drinks.',
    image: require('../assets/slide_3.png'),
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const handleNext = async () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
      Animated.spring(translateX, {
        toValue: -(index + 1) * width,
        useNativeDriver: true,
      }).start();
    } else {
      await AsyncStorage.setItem('hasOnboarded', 'false');
      if (FIREBASE_AUTH.currentUser?.uid) {
        router.replace('/(tabs)/(home)/HomeScreen');
      } else {
        router.replace('/(auth)/SignUpScreen');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-around bg-background">
      <Animated.View
        style={{
          width: width * slides.length,
          transform: [{ translateX }],
        }}
        className="flex-row">
        {slides.map((slide, i) => (
          <View key={i} className="w-full items-center p-5" style={{ width }}>
            <Image source={slide.image} style={{ width, height: width }} resizeMode="contain" />
            <Text className="mt-5 font-sans text-2xl text-primary">{slide.title}</Text>
            <Text className="text-sans mt-2 text-center text-text">{slide.description}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Dots */}
      <View className="mt-5 flex-row justify-center">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`mx-1.5 h-2 w-2 rounded-full ${i === index ? 'bg-primary' : 'bg-[#ccc]'}`}
          />
        ))}
      </View>

      {/* Button */}
      <View className="items-center p-5">
        <TouchableOpacity onPress={handleNext} className="rounded-full bg-primary px-6 py-3">
          <Text className="font-bold text-white">
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
