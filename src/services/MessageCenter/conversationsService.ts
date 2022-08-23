import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const conversationsService = async(submissionId: any) => axios.get(`${defaultBaseUrl}/conference/conversationList`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});