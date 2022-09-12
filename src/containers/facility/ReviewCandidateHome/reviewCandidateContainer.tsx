import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, Alert, TouchableOpacity, Text, View} from 'react-native';
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
  const mounted: boolean = false;
  const userInfo = useSelector(state => state.userReducer);
  const [facilityId, setFacilityId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
    console.log('Mil gya token', token);
  };

  useEffect(() => {
    load(false);
    saveToken();
    getToken();
    OneSignal.setAppId('901bc478-b323-4f6f-bc1f-bee60a47c811');
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });
  }, []);

  // const selectedFacility = () => {
  //   // const {facilitySubmissionsStore, userStore} = this.props;

  //   // if (facilitySubmissionsStore.loading) {
  //   //   return null;
  //   // }

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

  // const showLoading=(): boolean =>{
  //   const {facilitySubmissionsStore} = this.props;

  //   if (refreshing) {
  //     return false;
  //   }
  //   return facilitySubmissionsStore.loading;
  // }

  const load = async (refreshing: boolean = false) => {
    if (!submissionsStorePromise) {
      try {
        const {data} = await facilitySubmissionsService();
        setData(data);
        setFacilityId(data?.[0]?.facilityId);
        for (let facility of data) {
          for (let position of facility.positions) {
            const compTypes = position.comps;
            for (var candidate of position.candidates) {
              for (var dataItem of candidate.compData || []) {
                const compType = compTypes.find(
                  (i: any) => i.Id === dataItem.Id,
                );
                if (compType) {
                  (dataItem.type = compType.type),
                    (dataItem.headerTitle = compType.title);
                  console.log(
                    'type & headers',
                    dataItem.type,
                    dataItem.headerTitle,
                  );
                }
              }
            }
          }
        }

        // Alert.alert(data.description);
      } catch (error) {
        console.log('Error', error);
        // Alert.alert(error?.response?.data?.error?.description);
      }
    } else {
      console.log(
        'ReviewContainer',
        'Joining existing submission store load',
        refreshing,
      );
    }
  };

  const renderPositionList = (data: string) => {
    return (
      <CandidateList
        submissions={data}
        selectedFacilityId={facilityId}
        refreshing={refreshing}
        onRefresh={() => load(true)}
      />
    );
  };

  return (
    // <FacilitySelectionContainer
    //   // showNoData={showNoData}
    //   // showLoading={showLoading}
    //   noDataText="No Positions Available"
    //   facilityHeaderCaption="Showing positions for"
    //   refreshing={refreshing}
    //   // onRefresh={load(true)}
    //   // onFacilityChosen={(facilityId: string) => this.forceUpdate()}
    // >

    // </FacilitySelectionContainer>
    <>
      <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
        {/* <TouchableOpacity onPress={() => handleButtonPress()}>
          <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
            Hi
          </Text>
        </TouchableOpacity>
        <RemotePushController /> */}

        {data && renderPositionList(data)}
      </View>
    </>
  );
};

export default ReviewCandidateContainer;
