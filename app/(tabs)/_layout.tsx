import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomNavBar from 'components/CustomeNavBar';

function TabLayout() {
  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#762e1f',
        tabBarInactiveTintColor: '#a9a9a9',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      }}
      tabBar={(props) => <CustomNavBar {...props} />}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="(run)"
        options={{
          title: 'Run',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="run" size={size} color={color} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="(announcement)"
        options={{
          title: 'Announcement',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="(information)"
        options={{
          title: 'Information',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="information" size={size} color={color} />
          ),
          animation: 'shift',
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
