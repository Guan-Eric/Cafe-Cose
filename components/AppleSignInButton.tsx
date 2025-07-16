import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithApple, isAppleAuthAvailable } from '../backend/appleAuth';

interface AppleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  style?: 'WHITE' | 'WHITE_OUTLINE' | 'BLACK';
  type?: 'SIGN_IN' | 'CONTINUE' | 'SIGN_UP';
}

const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onSuccess,
  onError,
  style = 'BLACK',
  type = 'SIGN_IN',
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const available = await isAppleAuthAvailable();
      setIsAvailable(available);
    };
    checkAvailability();
  }, []);

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const success = await signInWithApple();

      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Apple Sign-In failed:', error);
      onError?.(error as Error);
      Alert.alert('Sign In Failed', 'There was an error signing in with Apple. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <View className="w-[240px]">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType[type]}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle[style]}
        cornerRadius={20}
        style={{
          width: 240,
          height: 42,
        }}
        onPress={handleAppleSignIn}
      />
      {loading && (
        <View className="absolute inset-0 items-center justify-center rounded-[20px] bg-black/20">
          <ActivityIndicator color="white" />
        </View>
      )}
    </View>
  );
};

export default AppleSignInButton;
