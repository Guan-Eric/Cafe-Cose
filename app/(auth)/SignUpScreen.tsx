import { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { register } from '../../backend/auth';
import BackButton from '../../components/BackButton';
import PasswordErrorModal from '../../components/modals/PasswordErrorModal';

function SignUpScreen() {
  const [email, onChangeEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordErrorModalVisible, setPasswordErrorModalVisible] = useState(false);

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      password === confirmPassword
    );
  };

  const signUp = async () => {
    try {
      setLoading(true);
      setEmailError('');
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email.');
        setLoading(false);
        return;
      }
      if (!validatePassword(password, confirmPassword)) {
        setPasswordErrorModalVisible(true);
        setLoading(false);
        return;
      }
      if (await register(email, password, name)) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
                  Sign Up
                </Text>
              </View>

              <View className="pb-[90px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Name</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-10 h-[60px] w-[254px]">
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
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View className="mt-10 h-[60px] w-[254px]">
                  <Text className="font-[Lato_400Regular] text-text">Confirm Password</Text>
                  <TextInput
                    className="text-m mt-2 flex-1 rounded-[10px] bg-input px-[10px] font-[Lato_400Regular] text-text"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                  />
                </View>
              </View>

              <Pressable
                onPress={signUp}
                disabled={loading}
                className="h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-[Lato_400Regular] text-white">Sign Up</Text>
                )}
              </Pressable>

              <View className="items-center pt-5">
                <Text className="text-base font-[Lato_400Regular] text-gray-500">
                  Already have an account?
                </Text>
                <Pressable
                  onPress={() => router.push('/(auth)/SignInScreen')}
                  className="h-[42px] w-[100px] items-center justify-center">
                  <Text className="text-base font-[Lato_400Regular] text-primary">Sign In</Text>
                </Pressable>
              </View>
            </View>

            <PasswordErrorModal
              modalVisible={passwordErrorModalVisible}
              onClose={() => setPasswordErrorModalVisible(false)}
              minLength={8}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SignUpScreen;
