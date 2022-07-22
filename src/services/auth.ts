import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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


// import {BASE_URL} from '../redux/constants/index';

const DevUrl = 'https://app.centrafi.net/conexustest/api';

export const loginWithPass = (data: { username: string; password: string; App: boolean; }) => axios.post(`${DevUrl}/user/login-with-credentials`);

export const signUp = (data: IRegisterUser) => axios.post(`${DevUrl}/user/newRegister`, data);

export const forgotPassword = (data:{username:string}) => axios.post(`${DevUrl}/user/PasswordRequest`, data);
