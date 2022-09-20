import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

export const updateNeedQuestionListService = async(payload: { needId: any; videoUrl: any; }) => 
axios.post(`${defaultBaseUrl}/facility/updateNeedQuestion/${payload?.needId}`,payload,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});