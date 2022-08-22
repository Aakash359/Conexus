import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const initiatePhoneCallService = async(data: { conversationId?: string; submissionId: any; callbackNumber?: any; messageTypeId?: string; }) => axios.post(`${defaultBaseUrl}/conference/messageSend`,data,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});

