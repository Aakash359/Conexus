import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'


export const sendMessageService = async(data: { note: string; facilityId: any; }) => axios.post(`${defaultBaseUrl}/facility/insertFacilityNote`,data ,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});