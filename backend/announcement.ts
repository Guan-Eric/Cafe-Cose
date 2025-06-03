import { Announcement } from 'components/types';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
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
      imageUrl: announcement.imageUrl || '',
    });
    await updateDoc(announcementDocRef, { id: announcementDocRef.id });
    return { ...announcement, id: announcementDocRef.id } as Announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

export async function editAnnouncement(updatedAnnouncement: Announcement): Promise<Announcement> {
  try {
    const announcementRef = doc(FIRESTORE_DB, `Announcements/${updatedAnnouncement.id}`);
    await updateDoc(announcementRef, {
      title: updatedAnnouncement.title,
      message: updatedAnnouncement.message,
      notificationMessage: updatedAnnouncement.notificationMessage,
      createdAt: updatedAnnouncement.createdAt,
      imageUrl: updatedAnnouncement.imageUrl,
    });
    const updatedDoc = await getDoc(announcementRef);
    return updatedDoc.data() as Announcement;
  } catch (error) {
    console.error('Error editing announcement:', error);
    throw error;
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementCollectionRef = collection(FIRESTORE_DB, 'Announcements');
    const announcementSnapshot = await getDocs(announcementCollectionRef);
    const announcements: Announcement[] = announcementSnapshot.docs.map((doc) => ({
      id: doc.data().id,
      title: doc.data().title,
      message: doc.data().message,
      notificationMessage: doc.data().notificationMessage,
      createdAt: doc.data().createdAt.toDate(),
      imageUrl: doc.data().imageUrl,
    })) as Announcement[];
    return announcements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const announcementItemRef = doc(FIRESTORE_DB, `Announcements/${id}`);
    await deleteDoc(announcementItemRef);
  } catch (error) {
    console.error('Error deleting announcement item:', error);
    throw error;
  }
}
