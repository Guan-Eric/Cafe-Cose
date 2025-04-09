import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { logIn } from '../../backend/auth';
import BackButton from '../../components/BackButton';

function SignInScreen() {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const signIn = async () => {
    setLoading(true);
    setEmailError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      setLoading(false);
      return;
    }
    if (await logIn(email, password)) setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <SafeAreaView className="flex-1">
            <BackButton />
            <View className="flex-1 items-center justify-center">
              <View className="items-center pb-[60px]">
                <Image
                  className="h-[100px] w-[250px] self-center"
                  resizeMode="contain"
                  source={require('../../assets/logo.png')}
                />
                <Text className="self-center text-4xl font-[Lato_400Regular] text-text">
                  Sign In
                </Text>
              </View>

              <View className="pb-[90px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">E-mail</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    placeholder="e.g. johnsmith@email.com"
                    value={email}
                    onChangeText={onChangeEmail}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                  {emailError ? <Text className="text-xs text-red-500">{emailError}</Text> : null}
                </View>

                <View className="mt-10 h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Password</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={password}
                    onChangeText={onChangePassword}
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                </View>
              </View>

              <Pressable
                onPress={signIn}
                disabled={loading}
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Sign In</Text>
                )}
              </Pressable>

              <View className="items-center pt-5">
                <Text className="text-base font-[Lato_400Regular] text-gray-500">
                  Don't have an account?
                </Text>
                <Pressable
                  onPress={() => router.push('/(auth)/SignUpScreen')}
                  className="h-[42px] w-[100px] items-center justify-center">
                  <Text className="text-base font-[Lato_400Regular] text-primary">Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SignInScreen;
