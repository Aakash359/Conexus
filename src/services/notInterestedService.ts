import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'


export const notInterestedService = async(data: { declineSubmission: boolean; submissionId: any; }) => axios.post(`${defaultBaseUrl}/facility/updateSubmissionStatus`,data,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});
