import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import {BASE_URL} from '../redux/constants/index';

const AUTH = 'https://app.centrafi.net/conexus/api';

export const loginWithPass = (data: { username: string; password: string; App: boolean; }) => axios.post(`${AUTH}/user/login-with-credentials`, data, {headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }});