import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const loadTextMessageService = async(conversationId: any) => axios.get(`${defaultBaseUrl}/conference/messages/${conversationId}`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});