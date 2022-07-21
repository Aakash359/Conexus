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

const AUTH = 'https://app.centrafi.net/conexus/api';

export const loginWithPass = (data: { username: string; password: string; App: boolean; }) => axios.post(`${AUTH}/user/login-with-credentials`, data, {headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }});

export const signUp = (data: IRegisterUser) => axios.post(`${AUTH}/user/newRegister`, data);
