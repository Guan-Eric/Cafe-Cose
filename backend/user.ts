import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { User } from 'components/types';

export async function addUser(name: string) {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser?.uid}`);
    await setDoc(userDocRef, {
      name: name,
      email: FIREBASE_AUTH.currentUser?.email,
      id: FIREBASE_AUTH.currentUser?.uid,
      points: 0,
      url: 'https://firebasestorage.googleapis.com/v0/b/fitai-2e02d.appspot.com/o/profile%2Fprofile.png?alt=media&token=89a32c06-e6df-4bfa-abe9-b9ebf463582a',
      showTermsCondition: true,
      announcements: true,
      runs: true,
      admin: false,
    });
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.data() as User;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

export async function savePushToken(token: string) {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser?.uid}`);

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const tokens = data.tokens ?? [];

      if (!tokens.includes(token)) {
        tokens.push(token);
        await updateDoc(userDocRef, { tokens: tokens });
      }
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

async function getUserPushTokens(userId: string) {
  const docRef = doc(FIRESTORE_DB, `Users/${userId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.tokens ?? [];
  } else {
    return [];
  }
}

export async function updateUserAvatar(url: string) {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser?.uid}`);
    updateDoc(userDocRef, { url: url });
  } catch (error) {
    console.error('Error updating user avatar:', error);
  }
}

export async function updateTermsCondition(): Promise<void> {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser?.uid}`);
    await updateDoc(userDocRef, {
      showTermsCondition: false,
    });
  } catch (error) {
    console.error('Error saving Terms and Condition:', error);
  }
}

export async function deleteAccount() {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser?.uid}`);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error('Error deleting account:', error);
  }
}

export async function incrementStamp(userId: string) {
  try {
    const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentStamps = userData.points ?? 0;
      await updateDoc(userDocRef, { points: currentStamps + 1 });
    } else {
      console.error('User document does not exist');
    }
  } catch (error) {
    console.error('Error incrementing stamp:', error);
  }
}
