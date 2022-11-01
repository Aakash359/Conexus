import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const nurseInterviewQuestionService = async(submissionId: any) => 
axios.get(`${defaultBaseUrl}/hcp/interviewquestions/${submissionId}`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});