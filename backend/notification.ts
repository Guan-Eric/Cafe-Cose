import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';
import { getUser } from './user';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const { notification } = response;
      console.log(notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return { expoPushToken, notification };
}

export async function sendPushNotifications(tokens: string[], title: string, body: string) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
  }));

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages.length > 1 ? messages : messages[0]),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

export async function notifyAnnouncement(title: string, body: string) {
  try {
    const usersRef = collection(FIRESTORE_DB, `Users`);
    const q = query(usersRef, where('announcements', '==', true));
    const usersSnapshot = await getDocs(q);

    const tokenPromises = usersSnapshot.docs.map(async (doc) => {
      return doc.data().tokens;
    });

    const tokens = (await Promise.all(tokenPromises)).filter((token) => !!token);
    if (tokens.length > 0) {
      const flatTokens = tokens.flat();
      await sendPushNotifications(flatTokens, title, body);
    }

    return tokens.length;
  } catch (error) {
    console.error('Error notifying participants:', error);
    throw error;
  }
}

export async function notifyRun(title: string, body: string) {
  try {
    const usersRef = collection(FIRESTORE_DB, `Users`);
    const q = query(usersRef, where('runs', '==', true));
    const usersSnapshot = await getDocs(q);

    const tokenPromises = usersSnapshot.docs.map(async (doc) => {
      return doc.data().tokens;
    });

    const tokens = (await Promise.all(tokenPromises)).filter((token) => !!token);

    if (tokens.length > 0) {
      const flatTokens = tokens.flat();
      await sendPushNotifications(flatTokens, title, body);
    }

    return tokens.length;
  } catch (error) {
    console.error('Error notifying participants:', error);
    throw error;
  }
}

export async function notifyRunParticipants(runId: string, title: string, body: string) {
  try {
    const participantsRef = collection(FIRESTORE_DB, `Runs/${runId}/Participants`);
    const q = query(participantsRef, where('status', '==', 'yes'));
    const participantsSnapshot = await getDocs(q);

    const tokenPromises = participantsSnapshot.docs.map(async (doc) => {
      if ((await getUser(doc.id))?.runs) return (await getUser(doc.id))?.tokens;
    });

    const tokens = (await Promise.all(tokenPromises)).filter((token) => !!token);

    if (tokens.length > 0) {
      const flatTokens = tokens.flat();
      await sendPushNotifications(flatTokens, title, body);
    }

    return tokens.length;
  } catch (error) {
    console.error('Error notifying participants:', error);
    throw error;
  }
}

export async function scheduleRunReminder(runDate: Date, timeBeforeRun: number) {
  const reminderTime = new Date(runDate.getTime() - timeBeforeRun * 60 * 1000);

  const now = new Date();
  if (reminderTime <= now) {
    console.log("Can't schedule reminder in the past");
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Run Reminder`,
        body: `Your run starts in ${timeBeforeRun} minutes at ${runDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
      },
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw error;
  }
}
