import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import BackButton from '../../../components/BackButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView>
        <View className="flex-row items-center ">
          <BackButton />
          <Text className="text-2xl font-bold text-text">Settings</Text>
        </View>
        {[
          {
            title: 'Edit Profile',
            route: '/(tabs)/(home)/EditProfileScreen',
          },
          {
            title: 'Notification Settings',
            route: '/(tabs)/(home)/NotificationSettings',
          },
        ].map((item, index) => (
          <Pressable
            key={index}
            className="m-2 w-[90%] flex-row self-center rounded-2xl bg-white p-5 shadow-sm"
            onPress={() => router.push(item.route as Href)}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonTitle}>{item.title}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#000" />
            </View>
          </Pressable>
        ))}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Lato_700Bold',
  },
  title: {
    fontFamily: 'Lato_700Bold',
    fontSize: 32,
    marginLeft: 16,
  },
});

export default SettingsScreen;
