import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'


export const makeOfferService = async(data: { startDate: any; submissionId: any; offerSubmission: boolean; }) => axios.post(`${defaultBaseUrl}/facility/submissionOffer`,data,{
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});
