import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Notification } from '@/types';

export const createNotification = async (
  userId: string,
  type: Notification['type'],
  message: string,
  reportId?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      title: message,
      body: message,
      reportId: reportId || null,
      isRead: false,
      createdAt: serverTimestamp(),
    });
    
    await updateDoc(docRef, {
      id: docRef.id,
    });

    await updateDoc(docRef, {
      notificationId: docRef.id,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotificationsByUser = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationsAsRead = async (notificationIds: string[]): Promise<void> => {
  try {
    await Promise.all(
      notificationIds.map(async (id) => {
        const docRef = doc(db, 'notifications', id);
        await updateDoc(docRef, {
          isRead: true,
        });
      })
    );
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};
