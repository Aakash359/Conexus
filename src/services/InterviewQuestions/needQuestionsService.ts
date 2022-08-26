import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const needQuestionsService = async(needId: any) => 
axios.get(`${defaultBaseUrl}/facility/needInterviewQuestions/${needId}`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});