import { useRef } from 'react';
import { Animated } from 'react-native';

const useButtonAnimation = (value: number) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: value, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return { scaleValue, handlePressIn, handlePressOut };
};

export default useButtonAnimation;
