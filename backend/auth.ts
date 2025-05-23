import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { addUser } from './user';
import { Alert } from 'react-native';

export async function logIn(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      alert('Sign up failed: ' + error.message);
    } else {
      alert('Sign up failed: An unknown error occurred');
    }
    return false;
  }
  return true;
}

export async function register(email: string, password: string, name: string): Promise<boolean> {
  try {
    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    addUser(name);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      alert('Sign up failed: ' + error.message);
    } else {
      alert('Sign up failed: An unknown error occurred');
    }
    return false;
  }
  return true;
}

export function logOut() {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to log out?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          FIREBASE_AUTH.signOut();
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  );
}
