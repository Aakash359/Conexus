import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';
import NavigationService from './src/navigation/NavigationService';

// OneSignal Initialization
OneSignal.setAppId('e1de43b0-7a53-48e2-bf45-3a501f8bbf94');

// Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    try {
      const notification = notificationReceivedEvent.getNotification();
      console.log('AppState.currentState:- ', AppState.currentState);
      if (AppState.currentState === 'active') {
        notificationReceivedEvent.complete(null);
        const {additionalData} = notification;
        NavigationService.navigate('CallPage', {
          userName: additionalData.userName,
          roomId: additionalData.roomId,
          callerName: additionalData.callerName,
        });
      } else {
        notificationReceivedEvent.complete(notification);
      }
    } catch (error) {
      console.log(error);
    }
  },
);

// Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  const {action} = notification;
  const {type} = action;
  if (type === 0) {
    console.log('Push Clicked');
  } else {
    const {actionId} = action;
    console.log(`${actionId} Clicked`);
  }
});

AppRegistry.registerComponent(appName, () => App);
