import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'


export const saveFeedbackResponseApi = async(payload: { questionId: string; rating: 0 | 1 | -1; submissionId: any; }) => axios.post(`${defaultBaseUrl}/facility/feedbackResponse`,payload,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});
