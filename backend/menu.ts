import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_STR, FIRESTORE_DB } from '../firebaseConfig';
import { MenuItem } from 'components/types';
import { ref, listAll, deleteObject } from 'firebase/storage';

export async function getMenu(): Promise<MenuItem[]> {
  try {
    const menuRef = collection(FIRESTORE_DB, 'Menu');
    const snapshot = await getDocs(menuRef);

    if (snapshot.empty) {
      return [];
    }
    const menu: MenuItem[] = snapshot.docs.map((doc) => {
      const data = {
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        imageUrl: doc.data().imageUrl,
        available: doc.data().available,
        category: doc.data().category,
        index: doc.data().index,
      } as MenuItem;
      return data;
    });
    return menu;
  } catch (error) {
    console.error('Error fetching menu:', error);

    return [];
  }
}

export async function getMenuItem(id: string): Promise<MenuItem> {
  try {
    const menuItemRef = doc(FIRESTORE_DB, `Menu/${id}`);
    const menuItemDoc = await getDoc(menuItemRef);
    if (!menuItemDoc.exists()) {
      throw new Error('Menu item does not exist');
    }
    return menuItemDoc.data() as MenuItem;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
}

export async function addMenuItem(menuItem: Partial<MenuItem>): Promise<MenuItem> {
  try {
    const menuCollectionRef = collection(FIRESTORE_DB, 'Menu');
    const menuItemDocRef = await addDoc(menuCollectionRef, {
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl || '',
      available: menuItem.available,
      category: menuItem.category,
      index: await calculateIndex(),
    });
    await updateDoc(menuItemDocRef, { id: menuItemDocRef.id });
    return { ...menuItem, id: menuItemDocRef.id } as MenuItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
}

export async function editMenuItem(menuItem: MenuItem): Promise<void> {
  try {
    const menuItemRef = doc(FIRESTORE_DB, `Menu/${menuItem.id}`);
    await updateDoc(menuItemRef, {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      available: menuItem.available,
      category: menuItem.category,
      index: await calculateIndex(),
    });
  } catch (error) {
    console.error('Error editing menu item:', error);
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const menuItemRef = doc(FIRESTORE_DB, `Menu/${id}`);
    await deleteDoc(menuItemRef);
    const storageRef = ref(FIREBASE_STR, `menu`);
    const listResult = await listAll(storageRef);

    const deletePromises = listResult.items
      .filter((itemRef) => itemRef.name.startsWith(id))
      .map((itemRef) => deleteObject(itemRef));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

export async function calculateIndex(): Promise<number> {
  try {
    const menuCollectionRef = collection(FIRESTORE_DB, 'Menu');
    const menuSnapshot = await getDocs(menuCollectionRef);
    const menuItems = menuSnapshot.docs.map((doc) => doc.data() as MenuItem);

    const maxIndex = menuItems.reduce((max, item) => Math.max(max, item.index), -1);
    return maxIndex + 1;
  } catch (error) {
    console.error('Error calculating index:', error);
    throw error;
  }
}
