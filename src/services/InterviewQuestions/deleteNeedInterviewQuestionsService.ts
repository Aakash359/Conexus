import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

export const deleteNeedInterviewQuestionsService = async(needPayload: { facilityId: string; id: string; needId: string; deleted: boolean; }) => 
axios.post(`${defaultBaseUrl}/facility/updateNeedQuestion/${needPayload?.needId}`,needPayload,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});