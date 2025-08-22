import { Hours } from 'components/types';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';

export async function updateHours(hours: Hours): Promise<Hours> {
  try {
    const holidayCollectionRef = doc(FIRESTORE_DB, 'Hours/TJiptCzUKv9qrHetytcq');
    await updateDoc(holidayCollectionRef, {
      defaultHours: hours.defaultHours,
      holiday: hours.holiday,
    });
    return hours as Hours;
  } catch (error) {
    console.error('Error updating hours:', error);
    throw error;
  }
}

export async function getOpeningHours(): Promise<Hours | null> {
  try {
    const holidayCollectionRef = doc(FIRESTORE_DB, 'Hours/TJiptCzUKv9qrHetytcq');
    const docSnapshot = await getDoc(holidayCollectionRef);

    if (docSnapshot.exists()) {
      const data = {
        defaultHours: docSnapshot.data()?.defaultHours,
        holiday: docSnapshot.data()?.holiday.map((holiday: any) => ({
          date: holiday.date.toDate(),
          open: holiday.open,
          close: holiday.close,
          name: holiday.name,
        })),
      } as Hours;

      return data;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching opening hours:', error);
    throw error;
  }
}
