import { types, flow, getSnapshot } from 'mobx-state-tree'
import { Actions } from 'react-native-router-flux'
import OneSignal from 'react-native-onesignal'
import * as _ from 'lodash'
import axios from 'axios'
import { userService } from '../services/user-service'
// import { rest } from '../services/rest' 
import { showApiErrorAlert } from '../common'
// import { getConexusApiEnvironment } from '../services/rest'
import { IUser, IRegisterUser } from '../services'
import { logger } from 'react-native-logs'
import { ScreenType } from '../common/constants'
import { deviceStore } from './deviceStore'
import { conversationStoreInstance } from '../stores/message-center'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const log = logger.createLogger()
export declare type ApiEnvironment = 'dev' | 'prod'

const defaultEnvironment = deviceStore.isDebugEnabled ? 'dev' : 'prod' /// TEMPORARILY DISABLED 'prod'

const devUrl = 'https://app.centrafi.net/conexustest/api'
const productionUrl = 'https://app.centrafi.net/conexus/api'
const defaultBaseUrl = deviceStore.isDebugEnabled ? devUrl : productionUrl
let currentEnvironment: ApiEnvironment = defaultEnvironment

  const setConexusApiEnvironment = (env: ApiEnvironment) => {
  // codePush.getUpdateMetadata().then((details) => {
  //   if (details.deploymentKey === 'UXrzeFYjiGySFOm2mOfuU8pm08Cfaa10473a-eea0-4543-a44c-79c6482beade' || details.deploymentKey === 'OCHtsMWbGSdmM6XRfKhCB5SYFy1saa10473a-eea0-4543-a44c-79c6482beade')
  //     env = 'dev'
  // })
  if (env === 'dev') {
    console.log('setting to dev environment')
    // rest.defaults.baseURL = devUrl
    currentEnvironment = 'dev'
  } else {
    console.log('setting to production environment')
    // rest.defaults.baseURL = productionUrl
    currentEnvironment = 'prod'
  }
}

  const getConexusApiEnvironment = () => {
  return currentEnvironment
  }

  const rest = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export const UserFacilityModel = types.model('UserFacility', {
    facilityName: types.optional(types.string, ''),
    facilityId: types.optional(types.string, ''),
    photoUrl: types.optional(types.string, ''),
    manager: types.model('UserFacilityManager', {
        acctManagerName: types.optional(types.string, ''),
        acctManagerPhone: types.optional(types.string, ''),
        acctManagerPhotoUrl: types.optional(types.string, '')
    })
}).actions(self => {
        return {
            sendMessage: flow(function* (messageText: string) {
                return yield rest.post('facility/insertFacilityNote', {
                    note: messageText,
                    facilityId: self.facilityId
                })
            }),
            sendFeedback: flow(function* (messageText: string) {
                return yield rest.post('facility/insertAppFeedback', {
                    note: messageText,
                    facilityId: self.facilityId
                })
            })
        }
    })

const User = types.model('User', {
    userId: types.string,
    username: types.optional(types.string, ''),
    firstName: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    photoUrl: types.union(types.string, types.undefined),
    userType: types.optional(types.string, ''),
    userTypeId: types.optional(types.string, ''),
    phoneNumber: types.optional(types.string, ''),
    userFacilities: types.optional(types.array(UserFacilityModel), []),
})

export type UserCredentials = { username: string, password: string, environment: ApiEnvironment }
export type ProfileUpdateDetails = { firstName: string, lastName: string, title: string }
export const USER_STORE_AUTH_TOKEN_STORAGE_KEY = '@USER'
export const USER_STORE_PROFILE_EDITED_STORAGE_KEY = '@PROFILE_EDIT_VIEWED'

const UserStore = types
    .model('UserStore', {
        user: types.union(User, types.undefined),
        selectedFacilityId: types.optional(types.string, ''),
        isRecoveringPassword: types.optional(types.boolean, false),
        isAuthenticating: types.optional(types.boolean, false),
        isSavingProfile: types.optional(types.boolean, false),
        inWalkthroughMode: types.optional(types.boolean, false)
    })

    .views(self => {
        return {
            get isLoggedIn(): boolean { return !!(self.user && self.user.userId) },

            get isFacilityUser(): boolean {
                if (!self.user) {
                    return false
                }
                const userType = (self.user.userType || 'HCP').toUpperCase()
                return userType === 'HCP' ? false : true
            },

            get selectedFacility(): typeof UserFacilityModel.Type | null {
                if (this.user) {
                    return this.user.userFacilities.find(uf => {
                        return uf.facilityId === self.selectedFacilityId
                    })
                }

                return null
            },

            get isNurseUser(): boolean {
                if (!self.user) {
                    return false
                }
                const userType = (self.user.userType || 'HCP').toUpperCase()
                return userType === 'HCP' ? true : false
            },
            get homeView(): string {
                 
                if (!self.user) {
                   return ScreenType.NURSES.HOME
                }
                const userType = (self.user.userType || 'HCP').toUpperCase()                
                return userType != 'HCP' ? ScreenType.NURSES.HOME : ScreenType.FACILITIES.REVIEW_HOME
            },
            get shouldShowWalkThrough(): boolean {
                if (!self.user) {
                    return false
                }

                return !self.user.photoUrl || !self.user.firstName || !self.user.lastName
            }
        }
    })

    .actions(self => {

        const actions = {
            setSelectedFacility: (id: string) => {
                if (!self.user) {
                    log.info('setSelectedFacility', 'user not available');
                }
                self.selectedFacilityId = id;
            },

            applyUserAuthorizationToken: flow(function* (token: string) {
                rest.defaults.headers.common.Authorization = `Bearer ${token}`
                deviceStore.setAuthToken(token)
                yield AsyncStorage.setItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY, JSON.stringify({token, environment: getConexusApiEnvironment()}))
            }),

            resetAuthorizationToken: flow(function* () {
                // delete rest.defaults.headers.common.Authorization
                deviceStore.setAuthToken('')
                yield AsyncStorage.removeItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY)
            }),

            refreshAuthorizationToken: flow(function* () {
                try {
                    const data = yield userService.refreshAuthorizationToken()
                    yield actions.applyUserAuthorizationToken(data.authToken, getConexusApiEnvironment())
                    return true
                } catch (error) {
                    log.info('UserStore', 'RefreshAuthToken', 'Error', error)
                    self.isAuthenticating = false
                    return false
                }
            }),

            initUser: flow<IUser>(function* (user: IUser) {
                self.user = User.create(user)
                // OneSignal.setSubscription(true);
                // OneSignal.syncHashedEmail(user.username)
                const tags = {
                    'env': getConexusApiEnvironment(),
                    'userType': user.userType,
                    'userId': user.userId
                }
                OneSignal.sendTags(tags)
           
                
                yield conversationStoreInstance.loadUnreadCount()
                    .then(
                        (unreadCount) => {
                            log.info('UserStore', 'UnreadCount', unreadCount)
                        }
                    )
                    .catch((error) => log.info('UserStore', 'LoadUnreadCount', 'error', error))

                self.selectedFacilityId = self.user.userFacilities.length ? self.user.userFacilities[0].facilityId : ''
                const profileEditHistoryString = yield AsyncStorage.getItem(USER_STORE_PROFILE_EDITED_STORAGE_KEY)
                const profileEditHistory = JSON.parse(profileEditHistoryString || '{"edited": false}')
                if (!profileEditHistory.edited && self.shouldShowWalkThrough) {
                    self.inWalkthroughMode = true
                    return ScreenType.WALKTHROUGH
                }

                return self.homeView

            }),

            logout: flow(function* () {
                log.info('UserStore:Logout', 'Start')

                yield actions.resetAuthorizationToken()
                self.isAuthenticating = false

                try {
                    self.user = undefined

                    log.info('Unsubscribe user from oneSignal')
                    deviceStore.reset()

                } catch { }

                try {
                    deviceStore.reset()
                } catch (err) { log.info('UserStore:Logout:Error', err) }

                Actions.reset('root')
                log.info('UserStore:Logout', 'Complete')
            }),

            saveProfile: flow(function* (profile: ProfileUpdateDetails) {
                self.isSavingProfile = true
                try {
                    log.info('UserStore:SaveProfile:FormData', JSON.stringify(profile, null, 4))
                    const snapShot = getSnapshot(self.user)
                    const payload = <IUser>Object.assign({}, snapShot, _.pick(profile, Object.keys(snapShot)))
                    
                    const saveResult = yield userService.saveProfile(payload)
                    log.info('UserStore:SaveProfile:Received', JSON.stringify(saveResult, null, 4))

                    self.isSavingProfile = false

                    const loadResult = yield userService.getProfile()
                    log.info('UserStore:SaveProfile:LoadProfile:Received', loadResult)
                    self.user = loadResult

                    yield AsyncStorage.setItem(USER_STORE_PROFILE_EDITED_STORAGE_KEY, JSON.stringify({ edited: true }))

                    if (self.inWalkthroughMode) {
                        self.inWalkthroughMode = false
                        Actions[self.homeView]()
                    } else {
                        Actions.pop()
                    }

                    return true
                }
                catch (error) {
                    self.isSavingProfile = false

                    showApiErrorAlert({
                        defaultTitle: 'Save Profile Error',
                        defaultDescription: 'An unexpected error occurred while saving your profile',
                        loggerName: 'UserStore',
                        loggerTitle: 'saveProfile:error',
                        error: error
                    })

                    return false
                }
            }),
            register: flow<IRegisterUser>(function*(registerData: IRegisterUser){
                log.info('UserStore: ', registerData)
                try{
                    const registration = yield userService.register(registerData)
                    return registration.Success
                } catch (error) {
                    showApiErrorAlert({
                        defaultTitle: 'Registration error',
                        defaultDescription: '',
                        loggerName: 'UserStore',
                        loggerTitle: 'Registration:error',
                        error: error
                    })
                    log.info(error)
                    return ''
                }
            }),
            login: flow<UserCredentials>(function* (credentials: UserCredentials) {
                self.isAuthenticating = true
                console.log("Credentials",credentials.username, credentials.password);
                
                try {                    
                    const user = yield userService.login(credentials.username, credentials.password)
                    yield actions.applyUserAuthorizationToken(user.authToken)
                    self.isAuthenticating = false
                    return actions.initUser(user)

                } catch (error) {
                    self.isAuthenticating = false

                    showApiErrorAlert({
                        defaultTitle: 'Login Failed',
                        defaultDescription: 'Something went wrong',
                        loggerName: 'UserStore',
                        loggerTitle: 'login:error',
                        error: error
                    })

                    log.info(error);

                    return ''
                }
            }),
            tryLoadTokenFromCache: flow(function* () {
                const data = JSON.parse(yield AsyncStorage.getItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY))
                
                if (data.token && data.token.length) {
                    setConexusApiEnvironment(data.environment)                    
                    yield actions.applyUserAuthorizationToken(data.token, data.environment)
                    actions.refreshAuthorizationToken() // fire and forget (don't care if it fails, just trying to keep it current if possible)
                }
            }),
            tryLoadFromCache: flow(function* () {
                const data = JSON.parse(yield AsyncStorage.getItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY))
                
                if (data.token && data.token.length) {
                    setConexusApiEnvironment(data.environment)
                    yield actions.applyUserAuthorizationToken(data.token)
                    const validToken = yield actions.refreshAuthorizationToken()

                    if (validToken) {
                        return yield actions.initUser(yield userService.getProfile())
                    } 
                }

                return ScreenType.LOGIN
            }),

            recoverPassword: flow(function* (username: string) {
                self.isRecoveringPassword = true

                try {
                    const response = yield userService.recoverPassword(username)
                    self.isRecoveringPassword = false
                    Alert.alert(response.title, response.description)
                    return true

                } catch (error) {
                    self.isRecoveringPassword = false

                    showApiErrorAlert({
                        defaultTitle: 'Password Recovery Error',
                        defaultDescription: 'An unexpected error occurred while recovering your password. Please try again.',
                        loggerName: 'UserStore',
                        loggerTitle: 'recoverPassword',
                        error: error
                    })

                    return false
                }
            }),

            setUserImage: (image: string) => { self.user.photoUrl = image }
        }

        return actions
    })

export const userStoreInstance = UserStore.create()
export type UserStore = typeof UserStore.Type