import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const facilityQuestionsService = async() => axios.get(`${defaultBaseUrl}/facility/listInterviewQuestions`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});

