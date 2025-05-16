import { Participant, RSVPStatus, Run } from 'components/types';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';
import { getUser } from './user';

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
    });
    const updatedDoc = await getDoc(runRef);
    return updatedDoc.data() as Run;
  } catch (error) {
    console.error('Error editing run:', error);
    throw error;
  }
}

export async function editRSVPRun(id: string, userId: string, status: RSVPStatus) {
  try {
    const participantsRef = doc(FIRESTORE_DB, `Runs/${id}/Participants/${userId}`);
    await setDoc(participantsRef, {
      status: status,
    });
  } catch (error) {
    console.error('Error removing user from run:', error);
    throw error;
  }
}

export async function getRuns(): Promise<Run[]> {
  try {
    const runCollectionRef = collection(FIRESTORE_DB, 'Runs');
    const runSnapshot = await getDocs(runCollectionRef);
    const runs: Run[] = await Promise.all(
      runSnapshot.docs.map(async (doc) => ({
        id: doc.data().id,
        title: doc.data().title,
        message: doc.data().message,
        date: doc.data().date.toDate(),
        imageUrl: doc.data().imageUrl,
        notificationMessage: doc.data().notificationMessage,
        participants: await getParticipants(doc.data().id),
        isRSVP: doc.data().isRSVP,
      }))
    );
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

export async function getParticipants(runId: string): Promise<Participant[]> {
  try {
    const participantsCollectionRef = collection(FIRESTORE_DB, `Runs/${runId}/Participants`);
    const participantsSnapshot = await getDocs(participantsCollectionRef);
    const participants: Participant[] = await Promise.all(
      participantsSnapshot.docs.map(async (doc) => ({
        id: doc.id,
        name: (await getUser(doc.id))?.name as string,
        status: doc.data().status,
        url: (await getUser(doc.id))?.url as string,
      }))
    );
    return participants;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}
