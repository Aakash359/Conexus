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

export const uploadPhoto = async (data: { base64Image: any; fileExt: string}) => 
axios.post(`${defaultBaseUrl}/user/current/base64Photo`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`},
  },
);

export const updateProfile = () => 
axios.get(`${defaultBaseUrl}/user/current`);

export const forgotPassword = (data:{username:string}) => axios.post(`${defaultBaseUrl}/user/PasswordRequest`, data);


