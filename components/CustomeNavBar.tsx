import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = '#762e1f';
const SECONDARY_COLOR = '#f8f9fa';

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

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
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? SECONDARY_COLOR : 'transparent' },
            ]}>
            {getIconByRouteName(route.name, isFocused ? PRIMARY_COLOR : SECONDARY_COLOR)}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}>
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case '(home)':
        return <MaterialCommunityIcons name="home-variant" size={24} color={color} />;
      case '(run)':
        return <MaterialCommunityIcons name="run" size={24} color={color} />;
      case '(announcement)':
        return <MaterialCommunityIcons name="bell" size={24} color={color} />;

      default:
        return <MaterialCommunityIcons name="home-variant" size={24} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    width: '90%',
    alignSelf: 'center',
    bottom: 40,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
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
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default CustomNavBar;
