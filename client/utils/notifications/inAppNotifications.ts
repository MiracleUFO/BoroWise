import * as Notifications from 'expo-notifications';

const notify = (title: string, body?: string) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}`,
      body: `${body || ''}`,
    },
    trigger: null,
  });
};

export default notify;
