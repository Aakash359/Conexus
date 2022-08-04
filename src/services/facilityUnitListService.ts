import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../redux/constants'


export const facilityUnitListService = async(data: { facilityId: any; }) => {
 
 const { facilityId } = data
 return axios.get(`${defaultBaseUrl}/facility/listUnits/${facilityId}`, {
    headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
}).then((response)=>{
   const result = response.data.map((unitData: any) => {
            console.log("Unitedata",unitData);
            
        })
}
);

}
