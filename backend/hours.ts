import { Hours } from 'components/types';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';

export async function updateHours(hours: Hours): Promise<Hours> {
  try {
    const holidayCollectionRef = doc(FIRESTORE_DB, 'Hours/TJiptCzUKv9qrHetytcq');
    await updateDoc(holidayCollectionRef, {
      hours,
    });
    return hours as Hours;
  } catch (error) {
    console.error('Error updating hours:', error);
    throw error;
  }
}
