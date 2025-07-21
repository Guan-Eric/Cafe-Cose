import { Feedback } from 'components/types';
import { collection, addDoc, updateDoc, Timestamp, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import { getUser } from './user';

export const createFeedback = async (feedback: string) => {
  try {
    const FeedbackCollectionRef = collection(FIRESTORE_DB, 'Feedback');
    const FeedbackDocRef = await addDoc(FeedbackCollectionRef, {
      feedback,
      userId: FIREBASE_AUTH.currentUser?.uid,
      createdAt: new Date(),
    });
    await updateDoc(FeedbackDocRef, { id: FeedbackDocRef.id });
  } catch (error) {
    console.error('Error creating Feedback:', error);
    throw error;
  }
};
export const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const feedbackCollectionRef = collection(FIRESTORE_DB, 'Feedback');
    const feedbackSnapshot = await getDocs(feedbackCollectionRef);
    const feedbackList = await Promise.all(
      feedbackSnapshot.docs.map(async (doc) => ({
        id: doc.data().id as string,
        feedback: doc.data().feedback as string,
        name: (await getUser(doc.data().userId))?.name as string,
        createdAt: doc.data().createdAt.toDate() as Date,
      }))
    );
    return feedbackList as Feedback[];
  } catch (error) {
    console.error('Error fetching Feedbacks:', error);
    throw error;
  }
};
