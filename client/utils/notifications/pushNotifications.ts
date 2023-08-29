import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const schedulePushNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Borowise: ${title}`,
      body: `${body}`,
    },
    trigger: { seconds: 2 },
  });
};

async function registerForPushNotificationsAsync(): Promise<string> {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // eslint-disable-next-line no-alert
      alert('Failed to get push token for push notification!');
      return '';
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // eslint-disable-next-line no-console
    console.log('Expo push token:', token);
  } else {
    // eslint-disable-next-line no-alert
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      bypassDnd: true,
    });
  }
  return token || '';
}

const pushNotify = async (title: string, body: string) => {
  if (title && body) {
    await registerForPushNotificationsAsync();
    await schedulePushNotification(title, body);
  }
};

export default pushNotify;
