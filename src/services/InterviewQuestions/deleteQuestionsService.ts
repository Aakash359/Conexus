
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

export const deleteInterviewQuestionsService = async(interviewQuestionPayload: { questionId: string; }) => 
axios.delete(`${defaultBaseUrl}/conference/deleteFacilityQuestion/${interviewQuestionPayload?.questionId}`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});