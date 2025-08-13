import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { useEffect, useState } from 'react';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = '#F7F5F1';
const SECONDARY_COLOR = '#762e1f';
const UNSELECTED_COLOR = '#e5e5e5';

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const [tabLayouts, setTabLayouts] = useState<{ [key: number]: { x: number; width: number } }>({});
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(15);

  // Filter out unwanted routes and get visible routes
  const visibleRoutes = state.routes.filter(
    (route) => !['_sitemap', '+not-found'].includes(route.name)
  );
  const focusedIndex = visibleRoutes.findIndex((_, index) => {
    const originalIndex = state.routes.findIndex((route) => route.key === visibleRoutes[index].key);
    return originalIndex === state.index;
  });

  useEffect(() => {
    if (tabLayouts[focusedIndex]) {
      const { x, width } = tabLayouts[focusedIndex];

      const indicatorX = x + width / 2 - 7.5;

      indicatorPosition.value = withSpring(indicatorX, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [focusedIndex, tabLayouts]);

  const handleTabLayout = (index: number, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({
      ...prev,
      [index]: { x, width },
    }));
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View style={styles.container}>
      {visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = index === focusedIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            onLayout={(event) => handleTabLayout(index, event)}
            style={[styles.tabItem]}>
            {getIconByRouteName(
              route.name,
              isFocused ? SECONDARY_COLOR : UNSELECTED_COLOR,
              isFocused ? 'transparent' : SECONDARY_COLOR
            )}
          </AnimatedTouchableOpacity>
        );
      })}
      <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
    </View>
  );

  function getIconByRouteName(routeName: string, color: string, borderColor: string) {
    switch (routeName) {
      case '(home)':
        return (
          <MaterialCommunityIcons
            name="home-variant"
            size={24}
            color={color}
            borderColor={borderColor}
          />
        );
      case '(run)':
        return (
          <MaterialCommunityIcons name="run" size={24} color={color} borderColor={borderColor} />
        );
      case '(announcement)':
        return (
          <MaterialCommunityIcons name="bell" size={24} color={color} borderColor={borderColor} />
        );

      default:
        return (
          <MaterialCommunityIcons
            name="home-variant"
            size={24}
            color={color}
            borderColor={borderColor}
          />
        );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    width: '100%',
    alignSelf: 'center',
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 15,
    paddingBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  indicator: {
    position: 'absolute',
    bottom: 45,
    left: 2.5,
    height: 4,
    width: 10,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 2,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default CustomNavBar;
