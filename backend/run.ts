import { RSVPStatus, Run } from 'components/types';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';

export async function createRun(run: Partial<Run>): Promise<Run> {
  try {
    const runCollectionRef = collection(FIRESTORE_DB, 'Runs');
    const runDocRef = await addDoc(runCollectionRef, {
      title: run.title,
      message: run.message,
      notificationMessage: run.notificationMessage,
      date: run.date,
      imageUrl: run.imageUrl,
      isRSVP: run.isRSVP,
      rsvps: run.rsvps,
    });
    await updateDoc(runDocRef, { id: runDocRef.id });
    return { ...run, id: runDocRef.id } as Run;
  } catch (error) {
    console.error('Error creating run:', error);
    throw error;
  }
}

export async function editRun(updatedRun: Run): Promise<Run> {
  try {
    const runRef = doc(FIRESTORE_DB, `Runs/${updatedRun.id}`);
    await updateDoc(runRef, {
      title: updatedRun.title,
      message: updatedRun.message,
      notificationMessage: updatedRun.notificationMessage,
      date: updatedRun.date,
      imageUrl: updatedRun.imageUrl,
      isRSVP: updatedRun.isRSVP,
      rsvps: updatedRun.rsvps,
    });
    const updatedDoc = await getDoc(runRef);
    return updatedDoc.data() as Run;
  } catch (error) {
    console.error('Error editing run:', error);
    throw error;
  }
}

export async function addToRun(id: string, userId: string, choice: RSVPStatus): Promise<Run> {
  try {
    const runRef = doc(FIRESTORE_DB, `Runs/${id}`);
    await updateDoc(runRef, {
      rsvps: arrayUnion({ userId, choice }),
    });
    const runDoc = await getDoc(runRef);
    return runDoc.data() as Run;
  } catch (error) {
    console.error('Error adding user to run:', error);
    throw error;
  }
}

export async function editRSVPRun(id: string, userId: string, choice: RSVPStatus): Promise<Run> {
  try {
    const runRef = doc(FIRESTORE_DB, `Runs/${id}`);
    await updateDoc(runRef, {
      rsvps: arrayRemove(userId),
    });
    await updateDoc(runRef, {
      rsvps: arrayUnion({ userId, choice }),
    });
    const runDoc = await getDoc(runRef);
    return runDoc.data() as Run;
  } catch (error) {
    console.error('Error removing user from run:', error);
    throw error;
  }
}

export async function getRuns(): Promise<Run[]> {
  try {
    const runCollectionRef = collection(FIRESTORE_DB, 'Runs');
    const runSnapshot = await getDocs(runCollectionRef);
    const runs: Run[] = runSnapshot.docs.map((doc) => ({
      id: doc.data().id,
      title: doc.data().title,
      message: doc.data().message,
      date: doc.data().date.toDate(),
      imageUrl: doc.data().imageUrl,
      userIds: doc.data().userIds,
      notificationMessage: doc.data().notificationMessage,
      participants: doc.data().participants,
      isRSVP: doc.data().isRSVP,
      rsvps: doc.data().rsvps,
    }));
    return runs;
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw error;
  }
}

export async function deleteRun(id: string) {
  try {
    const runDocRef = doc(FIRESTORE_DB, `Runs/${id}`);
    deleteDoc(runDocRef);
  } catch (error) {
    console.error('Error deleting run doc', error);
  }
}
