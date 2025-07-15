import { Promotion } from 'components/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { FIREBASE_STR, FIRESTORE_DB } from 'firebaseConfig';

export async function getLatestPromotion(): Promise<Promotion | null> {
  try {
    const promotionsCollection = collection(FIRESTORE_DB, 'Promotions');
    const q = query(promotionsCollection, orderBy('createdAt', 'desc'));
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

export async function createPromotion(promotion: Partial<Promotion>): Promise<Promotion> {
  try {
    const PromotionCollectionRef = collection(FIRESTORE_DB, 'Promotions');
    const PromotionDocRef = await addDoc(PromotionCollectionRef, {
      title: promotion.title,
      message: promotion.message,
      notificationMessage: promotion.notificationMessage,
      createdAt: new Date(),
      imageUrl: promotion.imageUrl || '',
    });
    await updateDoc(PromotionDocRef, { id: PromotionDocRef.id });
    return { ...promotion, id: PromotionDocRef.id } as Promotion;
  } catch (error) {
    console.error('Error creating Promotion:', error);
    throw error;
  }
}

export async function editPromotion(updatedPromotion: Promotion): Promise<Promotion> {
  try {
    const PromotionRef = doc(FIRESTORE_DB, `Promotions/${updatedPromotion.id}`);
    await updateDoc(PromotionRef, {
      title: updatedPromotion.title,
      message: updatedPromotion.message,
      notificationMessage: updatedPromotion.notificationMessage,
      createdAt: updatedPromotion.createdAt,
      imageUrl: updatedPromotion.imageUrl,
    });
    const updatedDoc = await getDoc(PromotionRef);
    return updatedDoc.data() as Promotion;
  } catch (error) {
    console.error('Error editing Promotion:', error);
    throw error;
  }
}

export async function deletePromotion(id: string) {
  try {
    const announcementItemRef = doc(FIRESTORE_DB, `Promotions/${id}`);
    await deleteDoc(announcementItemRef);
    const storageRef = ref(FIREBASE_STR, `promotions`);
    const listResult = await listAll(storageRef);

    const deletePromises = listResult.items
      .filter((itemRef) => itemRef.name.startsWith(id))
      .map((itemRef) => deleteObject(itemRef));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting promotion item:', error);
    throw error;
  }
}
