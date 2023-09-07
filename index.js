import React from 'react';
import {AppRegistry, AppState, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';
import NavigationService from './src/navigation/NavigationService';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initVideoCall} from './src/containers/MessageCenter/conversation';

OneSignal.setAppId('e1de43b0-7a53-48e2-bf45-3a501f8bbf94');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

// This is used to complete room disconnection
// fetch(
//   `https://67c6-2405-201-4-b871-39fa-cedf-69e9-a0c9.ngrok-free.app/rooms/testRoom?status=completed`,
//   {method: 'POST'},
// );

// Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    try {
      const notification = notificationReceivedEvent.getNotification();
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
  const {additionalData} = notification.notification;
  const {type} = action;
  if (type === 0) {
    console.log('Push Clicked');
  } else {
    const {actionId} = action;
    if (actionId === 'accept') {
      initVideoCall(additionalData.userName, additionalData.roomId);
    } else {
      console.log('Call Declined');
    }
  }
});

const AppConfig = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppConfig);
