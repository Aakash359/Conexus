import axios from 'axios';
import { Dispatch } from 'react';
import { defaultBaseUrl } from '../../redux/constants'
import { Alert } from 'react-native';

export interface UserModel {
  firstName: string;
  lastName: string;
  subscription: string;
  token: string;
}

export interface LoginAction {
  readonly type: 'ON_LOGIN';
  payload: UserModel;
}

export interface ErrorAction {
  readonly type: 'ON_ERROR';
  payload: any;
}

export type UserAction = LoginAction | ErrorAction;

// we need to dispatch action
export const loginRequest = (data: { username: string; password: string; App: boolean }) => {

  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${defaultBaseUrl}/user/login-with-credentials`,data);
      console.log("Response====>",response);
      
      if (!response) {
        dispatch({
          type: 'ON_ERROR',
          payload: 'Login issue with API',
        });
      } else {
        dispatch({
          type: 'ON_LOGIN',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_ERROR',
        payload: error,
      });
      // console.log("Error===>",error?.response?.data?.description)
      Alert.alert("Error",error?.response?.data?.description )
    }
  };
};