import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';

notifee.onForegroundEvent(({type, detail}) => {
  const {notification, pressAction} = detail;
  // if (type === EventType.ACTION_PRESS && pressAction.id === 'accept') {
  //   console.log('User pressed an action with the id: ', pressAction.id);
  // } else if (type === EventType.ACTION_PRESS && pressAction.id === 'decline') {
  //   console.log('User pressed an action with the id: ', pressAction.id);
  // }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  // if (type === EventType.ACTION_PRESS && pressAction.id === 'accept') {
  //   invokeApp();
  //   setTimeout(() => {
  //     onCallAccept(notification.data.userName, notification.data.roomId);
  //   }, 500);
  // } else if (type === EventType.ACTION_PRESS && pressAction.id === 'decline') {
  //   console.log('User pressed an action with the id: ', pressAction.id);
  // }
});

async function localNotifeePush(data) {
  // if (AppState.currentState === 'active') {
  //   RootNavigation.navigate('Call', {
  //     userName: data.userName,
  //     roomId: data.roomId,
  //     callerName: data.callerName,
  //   });
  // }

  // Delete Channel
  //   await notifee.deleteChannel('playSoundPush');

  // Create Channel
  const channelId = await notifee.createChannel({
    id: 'localPushPlaySound',
    name: 'Push Sound Notification',
    sound: 'my_song',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'remoteMessage.notification.title',
    body: 'remoteMessage.notification.body',
    data: {
      userName: data.userName,
      roomId: data.roomId,
      callerName: data.callerName,
    },
    android: {
      channelId,
      sound: 'my_song',
      lightUpScreen: true,
      actions: [
        {
          title: 'Accept',
          pressAction: {
            id: 'accept',
          },
        },
        {
          title: 'Decline',
          pressAction: {
            id: 'decline',
          },
        },
      ],
    },
  });
}

// OneSignal Initialization
OneSignal.setAppId('e1de43b0-7a53-48e2-bf45-3a501f8bbf94');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

// Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    try {
      const notification = notificationReceivedEvent.getNotification();
      localNotifeePush(notification.additionalData);

      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(null);
      notificationReceivedEvent.complete(notification);
    } catch (error) {
      console.log(error);
    }
  },
);

AppRegistry.registerComponent(appName, () => App);
