import { Platform } from 'react-native'
import { Toast } from 'native-base'
import OneSignal from 'react-native-onesignal'
import { logger } from 'react-native-logs'
import { types, flow } from 'mobx-state-tree'
import { userService } from '../services/user-service'
import { userStoreInstance } from '../stores/userStore'
import _ from 'lodash'
import Permissions from 'react-native-permissions'
// import codePush from 'react-native-code-push'
const log = logger.createLogger()
declare const global: any;

interface AppPermissions {
  [s: string]: string
}

const Permission = types.model({
  description: types.optional(types.string, 'Needs Description'),
  value: types.maybe(types.boolean)
}).views(self => {
  return {
    get isGranted() {
      return self.value !== false
    }
  }
})
type Permission = typeof Permission.Type
const PermissionStore = types.model('Permissions', {
  camera: types.optional(Permission, { description: '', value: true }),
  microphone: types.optional(Permission, { description: '', value: true }),
  photo: types.optional(Permission, { description: '', value: true }),
  reminder: types.optional(Permission, { description: '', value: true }),
  notification: types.optional(Permission, { description: '', value: true }),
  callPhone: types.optional(Permission, { description: '', value: true }),
})
//let isDebugEnabled = (global && typeof global.__DEV__ !== 'undefined' && !!global.__DEV__)

const isDebugEnabled = false;
// const isDebugEnabled = codePush.getUpdateMetadata().then((details) => {
//   //if (details.deploymentKey == "UXrzeFYjiGySFOm2mOfuU8pm08Cfaa10473a-eea0-4543-a44c-79c6482beade" || details.deploymentKey == "OCHtsMWbGSdmM6XRfKhCB5SYFy1saa10473a-eea0-4543-a44c-79c6482beade")
//   //  return true
//   //  else return false
//   return false;
// })

const DeviceStore = types.model('DeviceStore', {
    authToken: types.optional(types.union(types.string, types.undefined, types.null), undefined),
    pushToken: types.optional(types.union(types.string, types.undefined, types.null), undefined),
    allowNotifications: types.optional(types.union(types.boolean, types.undefined, types.null), undefined),
    isKeepAwake: types.optional(types.boolean, false),
    isInBackground: types.optional(types.boolean, false),
    // permissions: types.optional(PermissionStore, PermissionStore.create())
  })
  .views(self => {
    return {
      get isDebugEnabled() {
        return isDebugEnabled
      }
    }
  })

  .actions(self => {
    {
      // const config = {
      //   openTokAppKey: '45976802',
      //   openTokAppSecret: 'e30d86e7ae99aebbab5eee31bf744dd51b8d4098'
      // }
      const appPermissions: AppPermissions = {
        camera: 'camera',
        microphone: 'microphone',
        // photo: 'photo',
        // reminder: 'reminder',
        notification: 'notification',
        // callPhone: 'callPhone'
      }

      const checkPermissions = flow(function* () {
        let supportedPermissions = _.intersection(Object.keys(appPermissions), Permissions.getTypes())
        let response = yield Permissions.checkMultiple(supportedPermissions)
        let missing = []
        Object.keys(response).forEach(key => {
          self.permissions[key].value = response[key] === 'authorized' ? true : false
          if (response[key] !== 'authorized') {
            log.info('missing-permission', key, response[key])
            missing.push(key)
          }
        })
        for (let index = 0; index < missing.length; index++) {
          const p = missing[index]
          yield Permissions.request(p)
        }
      })

      // const syncNotifications = flow(function* () {
      //   OneSignal.getPermissionSubscriptionState((res) => {
      //     log.info('OneSignal', res)
      //     deviceStore.setAllowNotifications(res.notificationsEnabled)
      //     OneSignal.inFocusDisplaying(0)
      //     if (res.subscriptionEnabled === false) {
      //       OneSignal.setSubscription(true)
      //       if (Platform.OS === 'ios') {
      //         const permissions = {
      //           alert: true,
      //           badge: true,
      //           sound: true
      //         }
      //         OneSignal.requestPermissions(permissions)
      //       }
      //     } else {
      //       deviceStore.setPushTokenData({ pushToken: res.pushToken, userId: res.userId })
      //     }
      //   })
      // })
      // const reset = () => {
      //   OneSignal.setSubscription(false)
      //   self.authToken = undefined
      //   self.pushToken = undefined
      //   // localStorage.clear() <-- THIS WAS THROWING AN UNDEFINED ERROR
      // }
      const setAuthToken = (token: string) => {
        self.authToken = token
        // syncNotifications()
      }
      // const setAllowNotifications = (allowNotifications: boolean) => {
      //   self.allowNotifications = allowNotifications
      // }
      const setPushTokenData = ({ pushToken, userId }: { pushToken: string, userId?: string }) => {
        self.pushToken = pushToken
        if (userStoreInstance.isLoggedIn) {
          userService.updateDeviceToken({ token: self.pushToken, playerId: userId }).catch((reason) => log.info('setPushTokenData ERROR', reason))
        }
      }
      // const toggleDevMode = () => {
      //   self.isInDevMode = !self.isInDevMode
      //   Toast.show({
      //     text: `Dev mode has been ${self.isInDevMode ? 'enabled' : 'disabled'}`,
      //     position: 'bottom',
      //     duration: 2000
      //   })
      // }
      // const disableScreenTimeout = (val: boolean) => {
      //   self.isInDevMode = !self.isInDevMode
      // }
      const setInBackgroundMode = (inBackground: boolean) => self.isInBackground = inBackground

      const respondPingRequest = (pollingUserId: string) => {
        userService.respondPingRequest(pollingUserId).catch((reason) => log.info('respondPingRequest ERROR', reason))
      }

      return {
        setAuthToken, 
        // reset, 
        // , setAllowNotifications, 
        setPushTokenData, checkPermissions, setInBackgroundMode, respondPingRequest
      }
    }
  })
export type DeviceStore = typeof DeviceStore.Type
export const deviceStore = DeviceStore.create()
