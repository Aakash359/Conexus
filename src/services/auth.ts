import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'

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

export const signUp = (data: IRegisterUser) => axios.post(`${defaultBaseUrl}/user/newRegister`, data);

export const forgotPassword = (data:{username:string}) => axios.post(`${defaultBaseUrl}/user/PasswordRequest`, data);
