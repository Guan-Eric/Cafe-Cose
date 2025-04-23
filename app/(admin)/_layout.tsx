import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(menu)"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="coffee" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(announcement)"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(run)"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="run" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
