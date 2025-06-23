import { Promotion } from 'components/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';

export async function getLatestPromotion(): Promise<Promotion | null> {
  try {
    const promotionsCollection = collection(FIRESTORE_DB, 'Promotions');
    const q = query(promotionsCollection, orderBy('createdBy', 'desc'));
    const promoSnapshot = await getDocs(q);

    if (!promoSnapshot.empty) {
      return promoSnapshot.docs[0].data() as Promotion;
    } else {
      console.log('No promotions found!');
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
