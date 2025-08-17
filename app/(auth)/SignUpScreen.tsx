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
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { register } from '../../backend/auth';
import BackButton from '../../components/BackButton';
import PasswordErrorModal from '../../components/modals/PasswordErrorModal';
import AppleSignInButton from '../../components/AppleSignInButton';

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

    return password.length >= minLength && password === confirmPassword;
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

  const handleAppleSignInSuccess = () => {
    // Navigate to main app after successful Apple sign-in
    router.replace('/(tabs)/(home)/HomeScreen');
  };

  const handleAppleSignInError = (error: Error) => {
    console.error('Apple Sign-In error:', error);
    // Handle error if needed
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <SafeAreaView className="flex-1">
            <BackButton />
            <View className="flex-1 items-center justify-center">
              <View className="items-center pb-[40px]">
                <Image
                  className="h-[100px] w-[250px] self-center"
                  resizeMode="contain"
                  source={require('../../assets/logo.png')}
                />
                <Text className="self-center font-sans text-4xl text-text">Sign Up</Text>
              </View>

              <View className="pb-[30px]">
                <View className="h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Name</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                    placeholderTextColor="gray"
                  />
                </View>

                <View className="mt-5 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">E-mail</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    placeholder="e.g. johnsmith@email.com"
                    value={email}
                    onChangeText={onChangeEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                  />
                  {emailError ? <Text className="text-xs text-red-500">{emailError}</Text> : null}
                </View>

                <View className="mt-5 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Password</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                </View>

                <View className="mt-5 h-[60px] w-[254px]">
                  <Text className="font-sans text-text">Confirm Password</Text>
                  <TextInput
                    className="text-m bg-input mt-2 flex-1 rounded-[10px] px-[10px] font-sans text-text"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={signUp}
                disabled={loading}
                className="mb-4 h-[42px] w-[240px] items-center justify-center rounded-[20px] bg-primary">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="font-sans text-white">Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* Apple Sign-In Button */}
              <AppleSignInButton
                onSuccess={handleAppleSignInSuccess}
                onError={handleAppleSignInError}
                style="WHITE_OUTLINE"
                type="SIGN_UP"
              />

              <View className="items-center pt-5">
                <Text className="font-sans text-base text-gray-500">Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/SignInScreen')}
                  className="h-[42px] w-[100px] items-center justify-center">
                  <Text className="font-sans text-base text-primary">Sign In</Text>
                </TouchableOpacity>
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
