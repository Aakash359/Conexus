/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from "react-native-onesignal";

// OneSignal Initialization
OneSignal.setAppId('e1de43b0-7a53-48e2-bf45-3a501f8bbf94');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

// Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    // console.log(
    //   "OneSignal: notification will show in foreground:",
    //   notificationReceivedEvent
    // );
    try {
        console.log(
            'notificationReceivedEvent: ',
            JSON.stringify(notificationReceivedEvent),
          ); 
    } catch (error) {
        
    }
    // let notification = notificationReceivedEvent.getNotification();
    // const data = notification.additionalData;
    // console.log('additionalData: ', data);
    // // Complete with null means don't show a notification.
    // notificationReceivedEvent.complete(notification);
  },
);

// Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});

AppRegistry.registerComponent(appName, () => App);
