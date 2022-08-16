import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'




export const facilityNeedService = async() => axios.get(`${defaultBaseUrl}/facility/needs`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});
