import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const sendTextMessageService = async(data: { conversationId: any; submissionId: any; messageText: string; messageTypeId: string; }) => axios.post(`${defaultBaseUrl}/conference/messageSend`,data,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});