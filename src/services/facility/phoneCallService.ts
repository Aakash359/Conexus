import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const initiatePhoneCallService = async(data: string) => axios.get(`${defaultBaseUrl}/facility/facilitySubmissions`,{});