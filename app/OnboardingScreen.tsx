import { useRef, useState } from 'react';
import { Animated, View, Text, Image, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from 'firebaseConfig';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Café Cosé',
    description: 'Earn stamps with every coffee you buy.',
    image: require('../assets/logo.png'),
  },
  {
    title: 'Join our Run Club',
    description: 'Stay active and enjoy your runs with us.',
    image: require('../assets/logo.png'),
  },
  {
    title: 'Get Exclusive Offers',
    description: 'Be the first to know about new deals or drinks.',
    image: require('../assets/logo.png'),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f5f1' }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          width: width * slides.length,
          transform: [{ translateX }],
        }}>
        {slides.map((slide, i) => (
          <View key={i} style={{ width, alignItems: 'center', padding: 20 }}>
            <Image source={slide.image} style={{ width: 250, height: 250 }} resizeMode="contain" />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginTop: 20 }}>
              {slide.title}
            </Text>
            <Text style={{ fontSize: 16, color: '#555', marginTop: 10, textAlign: 'center' }}>
              {slide.description}
            </Text>
          </View>
        ))}
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 6,
              backgroundColor: i === index ? '#762e1f' : '#ccc',
            }}
          />
        ))}
      </View>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Pressable
          onPress={handleNext}
          style={{ backgroundColor: '#762e1f', padding: 14, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {index === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
