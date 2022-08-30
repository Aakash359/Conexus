
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const deleteQuestionsService = async(data) => axios.post(`${defaultBaseUrl}/facility/updateNeedQuestion/${needId}`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});