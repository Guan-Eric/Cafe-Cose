import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from 'firebaseConfig';
import { getUser } from './user';
import { NotificationTriggerInput } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
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
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

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

export async function notifyRunParticipants(runId: string, title: string, body: string) {
  try {
    const participantsRef = collection(FIRESTORE_DB, 'runs', runId, 'participants');
    const q = query(participantsRef, where('status', '==', 'yes'));
    const participantsSnapshot = await getDocs(q);

    const tokenPromises = participantsSnapshot.docs.map(async (doc) => {
      return (await getUser(doc.id))?.tokens;
    });

    const tokens = (await Promise.all(tokenPromises)).filter((token) => !!token);

    if (tokens.length > 0) {
      const flatTokens = tokens.flat(); // Flatten the array in case of nested arrays
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

  const secondsUntilReminder = Math.floor((reminderTime.getTime() - now.getTime()) / 1000);

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Run Reminder`,
        body: `Your run starts in 30 minutes at ${runDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      },
      trigger: {
        seconds: secondsUntilReminder,
        repeats: false,
      } as NotificationTriggerInput,
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw error;
  }
}
