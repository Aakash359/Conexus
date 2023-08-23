import OneSignal from 'react-native-onesignal';
import {logger} from 'react-native-logs';
import {Actions} from 'react-native-router-flux';
import {deviceStore} from '../stores/deviceStore';
import {videoStore} from '../stores/videoStore';
import {
  ConversationStore,
  conversationStoreInstance,
} from '../stores/message-center/conversation-store';
import {showYesNoAlert} from './cancel-retry-alert';
import {ScreenType} from './constants';
import {Platform} from 'react-native';
import {userStoreInstance} from '../stores';
import {userService} from '../services/user-service';
import Sound from 'react-native-sound';
const log = logger.createLogger();

// const PushIOS: any = PushNotificationIOS;

// PushNotification.configure({
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   popInitialNotification: true,
//   requestPermissions: true,
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function(token) {
//     log.info('TOKEN:', token);
//   },
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: function(notification) {
//     log.info('NOTIFICATION:', notification);
//     notification.finish(PushIOS.FetchResult.NoData);
//   },
// });

const handleIncomingCall = (data, caller, autoAnswer) => {
  let photoUrl: string = caller.photo || '';
  photoUrl = photoUrl.startsWith('http') ? photoUrl : `https://${photoUrl}`;
  log.info('handleIncomingCall', data);
  videoStore.callRecieved(
    {sessionId: data.sessionId, token: data.token},
    caller,
    autoAnswer,
  );
};
const onReceived = ({isAppInFocus, payload}) => {
  const {action, caller, ...data} = payload.additionalData;
  log.info('additionalData: ', payload.additionalData);
  log.info(`MSG: ${action} (onReceived: ${isAppInFocus})}`, data, caller);
  log.info('Found caller', caller);
  log.info(`Found data `, data);
  if (data.pushId) {
    log.info(`Got pushId: ${data.pushId}`);
    respondPushReceived(data.pushId);
  } else {
    log.info('No push id');
  }
  Sound.setActive(true);
  switch (action) {
    case 'incoming-call':
      isAppInFocus && handleIncomingCall(data, caller, false);
      break;
    case 'ping-request':
      respondPingRequest(data.pollingUserId);
      break;
    case 'updateinterviewavailability':
      // Todo
      break;
    case 'interviewrequest':
      // Todo
      break;
    case 'new-message':
      if (data.conversationId) {
        handleNewMessage(
          data.conversationId,
          data.title,
          data.description,
          isAppInFocus,
        );
      }
      break;
    case 'video-call-disconnect':
      log.info('Current scene: ', Actions.currentScene);
      if (deviceStore.isInBackground) {
        deviceStore.setInBackgroundMode(false);
      } else {
        if (Actions.currentScene === ScreenType.CALL) {
          log.info('Popping scene');
          Actions.pop();
        }
      }
      Sound.setActive(false);
      break;
    case 'candidate-availability-update':
      // Todo
      break;
    case 'call-complete':
    case 'call-connected':
      Actions.currentScene === ScreenType.HCP_PHONE_CALL_LIGHTBOX &&
        Actions.pop();
      break;
    default:
  }
};
const onOpened = openResult => {
  let isAppInFocus = false;
  const {
    action,
    caller,
    ...data
  } = openResult.notification.payload.additionalData;
  log.info(
    `MSG: ${action} (OnOpened: ${isAppInFocus})`,
    data,
    caller,
    openResult,
  );
  if (Platform.OS === 'android')
    OneSignal.cancelNotification(openResult.notification.androidNotificationId);

  switch (action) {
    case 'new-message':
      log.info('New message', data.conversationId);
      if (data.conversationId) {
        handleNewMessage(
          data.conversationId,
          data.title,
          data.description,
          isAppInFocus,
        );
      }
      break;

    case 'incoming-call':
      const {type, actionID} = openResult.action;
      if (openResult.action) {
        switch (actionID) {
          case 'reject_call':
            videoStore.setSessionId(data.sessionId);
            videoStore.endCall(userStoreInstance.user.userId);
            break;
          case 'answer_call':
            deviceStore.setInBackgroundMode(true);
            log.info('incoming-call:loadCache', Date());
            userStoreInstance.tryLoadTokenFromCache().then(() => {
              log.info('incoming-call:loadCache:complete', Date());
              handleIncomingCall(data, caller, true);
            });
            break;
          default:
            log.info('incoming-call:defaultSwitch');
            deviceStore.setInBackgroundMode(true);
            userStoreInstance.tryLoadTokenFromCache().then(() => {
              log.info('incoming-call:default');
              handleIncomingCall(data, caller, false);
            });
        }
      }
      break;
    default:
  }
};

const respondPushReceived = (pushId: string) => {
  return conversationStoreInstance
    .pushReceived(pushId)
    .catch(err => log.info('Push received error', err));
};

const respondPingRequest = (pollingUserId: string) => {
  return userService
    .updateVideoSession(pollingUserId)
    .catch(err => log.info('Respond ping request error', err));
};

const handleNewMessage = (
  conversationId: string,
  alertTitle,
  alertDescription,
  isAppInFocus: boolean,
) => {
  try {
    if (isAppInFocus) {
      if (
        conversationStoreInstance.activeConversation &&
        conversationStoreInstance.activeConversation.conversationId ===
          conversationId
      ) {
        conversationStoreInstance
          .loadActiveConversation(conversationId)
          .then(unreadCount => {
            log.info('Notications', 'loadActiveConversation', 'complete');
          })
          .catch(error =>
            log.info('UserStore', 'loadActiveConversation', 'error', error),
          );
      }

      if (
        Actions.currentScene === ScreenType.MESSAGE_CENTER.CONVERSATION_LIST ||
        Actions.currentScene ===
          ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST
      ) {
        conversationStoreInstance
          .load()
          .then(unreadCount => {
            log.info('Notications', 'Conversations', 'load');
          })
          .catch(error =>
            log.info('Notications', 'Conversations', 'load', 'error', error),
          );
      } else {
        conversationStoreInstance
          .loadUnreadCount()
          .then(unreadCount => {
            log.info(
              'Notications',
              'Conversations',
              'UnreadCount',
              unreadCount,
            );
          })
          .catch(error =>
            log.info(
              'Notications',
              'Conversations',
              'LoadUnreadCount',
              'error',
              error,
            ),
          );
      }

      if (Actions.currentScene !== ScreenType.MESSAGE_CENTER.CONVERSATION) {
        showYesNoAlert({
          title: alertTitle,
          message: alertDescription,
          onNo: () => {
            Actions[ScreenType.MESSAGE_CENTER.CONVERSATION]({conversationId});
          },
          yesTitle: 'Ignore',
          noTitle: 'View',
        });
      }
    } else {
      log.info('New message handler', conversationId);

      const i = setInterval(() => {
        log.info('hit', Actions.currentScene);
        if (Actions.currentScene === ScreenType.NURSES.HOME) {
          // || Actions.currentScene === ScreenType.FACILITIES.REVIEW_HOME) {
          clearInterval(i);
          Actions[ScreenType.MESSAGE_CENTER.CONVERSATION]({conversationId});
        }
      }, 100);
    }
  } catch (error) {
    log.info('Noticiations', 'handleNewMessage', 'Error', error);
  }
};

const onRegistered = notifData => {
  console.log('Device Registered: ', notifData);
};
const onIds = device => {
  log.info('onIds', device);
  deviceStore.setPushTokenData(device);
};

export const setupNotifications = () => {
  deviceStore.syncNotifications();
  OneSignal.addEventListener('received', onReceived);
  OneSignal.addEventListener('opened', onOpened);
  OneSignal.addEventListener('registered', onRegistered);
  OneSignal.addEventListener('ids', onIds);
};

// export const destroyNotifications = () => {
//   log.info('destroyed application')
//   OneSignal.removeEventListener('received', onReceived)
//   OneSignal.removeEventListener('opened', onOpened)
//   OneSignal.removeEventListener('registered', onRegistered)
//   OneSignal.removeEventListener('ids', onIds)
// }
