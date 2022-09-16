import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {UserStore} from '../../../stores/userStore';
// import {FacilitySubmissionsStore} from '../../../stores/facility/facility-submissions-store';
import {useSelector} from '../../../redux/reducers/index';
// import {FacilityModel} from '../../stores/facility/facility-model';
import FacilitySelectionContainer from '../../../components/facility-selection-container';
import NavigationService from '../../../navigation/NavigationService';
import PushNotification from 'react-native-push-notification';
import {facilitySubmissionsService} from '../../../services/Facility/facilitySubmissionsService';
import {AppColors} from '../../../theme';
import {CandidateList} from './candidateList';
import OneSignal from 'react-native-onesignal';

import RemotePushController from '../../../services/remoteNotificationService';
interface ReviewContainerProps {
  // facilitySubmissionsStore: typeof FacilitySubmissionsStore.Type;
  userStore: UserStore;
  forceRefresh?: boolean;
}

interface ReviewContainerState {
  refreshing: boolean;
}
let submissionsStorePromise: Promise<any>;

const ReviewCandidateContainer = (
  props: ReviewContainerProps,
  state: ReviewContainerState,
) => {
  const userInfo = useSelector(state => state.userReducer);
  const [facilityId, setFacilityId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {
    load(true);
    saveToken();
    getToken();
    OneSignal.setAppId('901bc478-b323-4f6f-bc1f-bee60a47c811');
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });
  }, []);

  // const selectedFacility = () => {

  //   if (data) {
  //     return data.find(
  //       facility => facility.facilityId === userStore.selectedFacilityId,
  //     );
  //   }

  //   return null;
  // };

  // const showNoData =(): boolean => {
  //   const {facilitySubmissionsStore} = props;
  //   if (refreshing || facilitySubmissionsStore.loading) {
  //     return false;
  //   }

  //   return (
  //     !this.selectedFacility || this.selectedFacility.positions.length === 0
  //   );
  // }

  const showLoading = (): boolean => {
    const {facilitySubmissionsStore} = this.props;

    if (refreshing) {
      return false;
    }
    return facilitySubmissionsStore.loading;
  };

  const load = async () => {
    if (!submissionsStorePromise) {
      setLoading(true);
      try {
        const {data} = await facilitySubmissionsService();
        if (data && data.length > 0) {
          let position = data.map((item: {positions: any}) => item.positions);
          let facilityId = data.map(
            (item: {facilityId: any}) => item.facilityId,
          );
          setFacilityId(facilityId);
          setData(position);
        }
        setLoading(false);
        // Alert.alert(data.description);
      } catch (error) {
        console.log('Error', error);
        setLoading(false);
        // Alert.alert(error?.response?.data?.error?.description);
      }
    } else {
      setLoading(false);
      console.log(
        'ReviewContainer',
        'Joining existing submission store load',
        refreshing,
      );
    }
  };

  return (
    // <FacilitySelectionContainer
    //   // showLoading={loading}
    //   noDataText="No Positions Available"
    //   facilityHeaderCaption="Showing positions for"
    //   // refreshing={refreshing}
    //   onRefresh={() => load(true)}
    //   onFacilityChosen={(facilityId: string) => this.forceUpdate()}
    // >
    //   {/* <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
    //     {data && renderPositionList(data)}
    //   </View> */}
    // </FacilitySelectionContainer>
    <>
      <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
        {loading && (
          <ActivityIndicator
            color={AppColors.blue}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
        {data && (
          <CandidateList
            submissions={data}
            selectedFacilityId={facilityId}
            refreshing={refreshing}
            onRefresh={() => load(false)}
          />
        )}
      </View>
    </>
  );
};

export default ReviewCandidateContainer;
