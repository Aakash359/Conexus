import axios from 'axios';
import {Dispatch} from 'react';
import {defaultBaseUrl} from '../../redux/constants';
import {Alert} from 'react-native';
import {
  setPreferences,
  USER_ACCESS_TOKEN,
} from '../../utils/AsyncStorageHelper';

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
      if (response && response?.data) {
        if (response?.data.authToken) {
          setPreferences(USER_ACCESS_TOKEN, response?.data.authToken);
          dispatch({
            type: 'ON_LOGIN',
            payload: response.data,
          });
        }
      } else {
        dispatch({
          type: 'ON_ERROR',
          payload: error,
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

export const logoutRequest = (data: {authToken: string}) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: 'ON_LOGOUT',
      payload: data,
    });
  };
};
