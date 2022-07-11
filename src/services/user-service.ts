
import { logger } from 'react-native-logs'
// import {rest} from './rest'
import { deviceStore } from '../stores/deviceStore'
import { Platform } from 'react-native'
import axios from 'axios'

const log = logger.createLogger()
export interface IUser {
  userId?: number
  username?: string
  firstName?: string
  lastName?: string
  photoUrl?: string
  userType?: string
  userTypeId?: number
  password?: string
  authToken?: string
}
export interface IRegisterUser {
  firstName: string,
  lastName: string,
  company?: string,
  title?: string,
  eMail: string,
  phoneNumber: string,
  howHeard: string,
  isFacility: boolean
}

const devUrl = 'https://app.centrafi.net/conexustest/api'
const productionUrl = 'https://app.centrafi.net/conexus/api'
const defaultBaseUrl = deviceStore.isDebugEnabled ? devUrl : productionUrl

  const rest = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

 export class UserService {

  register(userInfo: IRegisterUser){
    return new Promise<boolean>((resolve, reject) => {
        const payload = userInfo
        log.info('payload', payload)
        rest.post('/user/newRegister', payload)
          .then((res) => {
            log.info('response', res)
            resolve(res.data)
          }, reject)
    })
  }
 

  login(username, password) {
    return new Promise<IUser>((resolve, reject) => {
        const payload = { username, password, app: true }
        rest.post('/user/login-with-credentials', payload)
          .then((res) => {
            resolve(res.data)
          }, reject)
    })
  }
  
  refreshAuthorizationToken() {
    return new Promise<IUser>((resolve, reject) => {
        rest.get('/user/refreshToken')
          .then((res) => {
            log.info('response', res)
            resolve(res.data)
          }, reject)
    })
  }

  getProfile() {
    return new Promise<IUser>((resolve, reject) => {
        rest.get('/user/current')
          .then((res) => {
            log.info('response', res)
            resolve(res.data)
          },
          reject)
    })
  }

  saveProfile(profile: IUser) {
    return new Promise<IUser>((resolve, reject) => {
        log.info('payload', profile)
        rest.put('/user/current', profile).then((res) => {
          log.info('response', res)
          resolve(res.data)
        }, reject)
    })
  }

  savePhoto(photo:string, mimeType: string = 'image/jpg') {
    return new Promise<IUser>((resolve, reject) => {
        let ext = mimeType.split('/')[1] || 'jpg';
        if (ext === 'jpeg') {
          ext = 'jpg';
        }
       const payload = { base64Image: photo, fileExt: ext  }
        rest.post('/user/current/base64Photo', payload).then((res) => {
          resolve(res.data)
        }, reject)
    })
  }

  recoverPassword(username) {
    return new Promise<any>((resolve, reject) => {
        const payload = { username }
        log.info('payload', payload)
        rest.post('/user/PasswordRequest', payload).then((res) => {
          resolve(res.data)
        }, reject)
    })
  }

  updateVideoSession(pollingUserId: string) {
    return new Promise<IUser>((resolve, reject) => {
        const payload = { pollingUserId: pollingUserId }
        log.info('payload', payload)
        rest.post('/user/updateVideoSession', payload).then((res) => {
          log.info('response', res)
          resolve(res.data)
        }, reject)
    })
  }

  updateDeviceToken(tokenInfo: Object) {
    return new Promise<IUser>((resolve, reject) => {
        const payload = { ...tokenInfo, deviceType: Platform.OS }
        log.info('payload', payload)
        rest.post('/user/deviceToken', payload).then((res) => {
          log.info('response', res)
          resolve(res.data)
        }, reject)
    })
  }

  respondPingRequest(pollingUserId: string) {
    return new Promise<IUser>((resolve, reject) => {
        const payload = { pollingUserId }
        log.info('payload', payload)
        rest.post('/user/updateVideoSession', payload).then((res) => {
          log.info('response', res)
          resolve(res.data)
        }, reject)
    })
  }
}

export const userService = new UserService()

