import * as AppleAuthentication from 'expo-apple-authentication';
import {
  OAuthProvider,
  signInWithCredential,
  linkWithCredential,
  UserCredential,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';

// Type definitions to fix TypeScript errors
interface ExtendedUserCredential extends UserCredential {
  additionalUserInfo?: {
    isNewUser: boolean;
    providerId: string;
    profile?: any;
  };
}

interface ExtendedAppleCredential extends AppleAuthentication.AppleAuthenticationCredential {
  nonce?: string;
}

export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.error('Error checking Apple Auth availability:', error);
    return false;
  }
};

export const signInWithApple = async (): Promise<boolean> => {
  try {
    const credential = (await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })) as ExtendedAppleCredential;

    if (credential.identityToken) {
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken,
        rawNonce: credential.nonce || undefined, // Handle optional nonce
      });

      const result = (await signInWithCredential(
        FIREBASE_AUTH,
        firebaseCredential
      )) as ExtendedUserCredential;

      // Store user data if it's a new user
      if (result.additionalUserInfo?.isNewUser) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName:
            result.user.displayName ||
            `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim() ||
            'Apple User', // Fallback name
          photoURL: result.user.photoURL,
          provider: 'apple',
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(FIRESTORE_DB, 'Users', result.user.uid), userData);
      }

      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Apple Sign-In error:', error);
    if (error.code === 'ERR_REQUEST_CANCELED') {
      // User canceled the sign-in flow
      return false;
    }
    throw error;
  }
};

export const linkAppleAccount = async (): Promise<boolean> => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    const credential = (await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })) as ExtendedAppleCredential;

    if (credential.identityToken) {
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken,
        rawNonce: credential.nonce || undefined, // Handle optional nonce
      });

      await linkWithCredential(user, firebaseCredential);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Apple account linking error:', error);
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return false;
    }
    // Handle account already linked error
    if (error.code === 'auth/credential-already-in-use') {
      throw new Error('This Apple account is already linked to another user');
    }
    throw error;
  }
};

// Additional utility function for better error handling
export const getAppleAuthErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'ERR_REQUEST_CANCELED':
      return 'Sign-in was canceled';
    case 'auth/credential-already-in-use':
      return 'This Apple account is already linked to another user';
    case 'auth/invalid-credential':
      return 'Invalid Apple credentials';
    case 'auth/operation-not-allowed':
      return 'Apple sign-in is not enabled';
    case 'auth/user-disabled':
      return 'User account has been disabled';
    default:
      return 'An error occurred during Apple sign-in';
  }
};
