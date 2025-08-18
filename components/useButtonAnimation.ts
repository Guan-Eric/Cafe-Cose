import { useSharedValue, withSpring } from 'react-native-reanimated';

const useButtonAnimation = (value: number) => {
  const scaleValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withSpring(value, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return { scaleValue, handlePressIn, handlePressOut };
};

export default useButtonAnimation;
