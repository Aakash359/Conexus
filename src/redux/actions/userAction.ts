import axios from 'axios';
import {Dispatch} from 'react';
import {defaultBaseUrl} from '../../redux/constants';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

export interface LogoutAction {
  readonly type: 'ON_LOGOUT';
  payload: any;
}

export interface ErrorAction {
  readonly type: 'ON_ERROR';
  payload: any;
}

export type UserAction = LoginAction | ErrorAction | LogoutAction;

export const loginRequest = (data: {
  username: string;
  password: string;
  App: boolean;
}) => {
return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(
        `${defaultBaseUrl}/user/login-with-credentials`,
        data,
      );
      console.log('response', response);
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
      Alert.alert('Error', error?.response?.data?.description);
    }
  };
};

export const getStoredUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@currentUser');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('_getStoredUser error: ', e);
  }
};

export const removeStoredUser = async () => {
  try {
    await AsyncStorage.removeItem('@currentUser');
  } catch (e) {
    console.error('_removeStoredUser error: ', e);
  }
};

export const logoutRequest = (data: {authToken: string}) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: 'ON_LOGOUT',
      payload: data,
    });
  };
};
