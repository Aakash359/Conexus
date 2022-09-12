import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const initVideoSessionService = async() => axios.get(`${defaultBaseUrl}/conference/createSession`,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});