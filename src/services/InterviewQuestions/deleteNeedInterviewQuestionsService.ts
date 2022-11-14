import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

export const deleteNeedInterviewQuestionsService = async(needPayload: { facilityId: string; id: string; deleted: boolean; },needId:any) => 
axios.post(`${defaultBaseUrl}/facility/updateNeedQuestion/${needId}`,needPayload,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
}
);