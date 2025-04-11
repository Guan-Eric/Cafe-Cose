import { Announcement, Run } from 'components/types';
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  arrayRemove,
} from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';

export async function createAnnouncement(
  announcement: Partial<Announcement>
): Promise<Announcement> {
  try {
    const announcementCollectionRef = collection(FIRESTORE_DB, 'Announcements');
    const announcementDocRef = await addDoc(announcementCollectionRef, {
      title: announcement.title,
      message: announcement.message,
      notificationMessage: announcement.notificationMessage,
      createdAt: new Date(),
    });
    await updateDoc(announcementDocRef, { id: announcementDocRef.id });
    return { ...announcement, id: announcementDocRef.id } as Announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

export async function createRun(announcement: Partial<Run>): Promise<Run> {
  try {
    const announcementCollectionRef = collection(FIRESTORE_DB, 'Runs');
    const announcementDocRef = await addDoc(announcementCollectionRef, {
      title: announcement.title,
      message: announcement.message,
      notificationMessage: announcement.notificationMessage,
      createdAt: new Date(),
    });
    await updateDoc(announcementDocRef, { id: announcementDocRef.id });
    return { ...announcement, id: announcementDocRef.id } as Run;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

export async function addToRun(id: string, userId: string): Promise<Run> {
  try {
    const runRef = doc(FIRESTORE_DB, `Runs/${id}`);
    await updateDoc(runRef, {
      userIds: arrayUnion(userId),
    });
    const runDoc = await getDoc(runRef);
    return runDoc.data() as Run;
  } catch (error) {
    console.error('Error adding user to run:', error);
    throw error;
  }
}

export async function removeFromRun(id: string, userId: string): Promise<Run> {
  try {
    const runRef = doc(FIRESTORE_DB, `Runs/${id}`);
    await updateDoc(runRef, {
      userIds: arrayRemove(userId),
    });
    const runDoc = await getDoc(runRef);
    return runDoc.data() as Run;
  } catch (error) {
    console.error('Error removing user from run:', error);
    throw error;
  }
}
