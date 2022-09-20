import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

export const updateQuestionListService = async(payload: { facilityId?: any; videoUrl?: any; needId?: any; }) => 
axios.post(`${defaultBaseUrl}/facility/updateQuestion/${payload?.facilityId}`,payload,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});