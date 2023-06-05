import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator, Alert} from 'react-native';
import {UserStore} from '../../../stores/userStore';
import {useSelector} from '../../../redux/reducers/index';
import NavigationService from '../../../navigation/NavigationService';
import PushNotification from 'react-native-push-notification';
import {AppColors} from '../../../theme';
import {CandidateList} from './candidateList';
import OneSignal from 'react-native-onesignal';
import {facilitySubmissionsService} from '../../../services/ApiServices';
interface ReviewContainerProps {
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
  const [positions, setPositions] = useState([]);

  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {
    saveToken();
    getToken();
    setTimeout(() => {
      load(true);
    }, 2000);

    OneSignal.setAppId('e1de43b0-7a53-48e2-bf45-3a501f8bbf94');
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

  const logOutFromApp = async () => {
    Alert.alert(
      'Your app has been logged out due to session expire so you have to login again',
    );
    await AsyncStorage.removeItem('authToken');
    NavigationService.navigate('LoginScreen');
  };

  const load = async () => {
    if (!submissionsStorePromise) {
      setLoading(true);
      try {
        const {data} = await facilitySubmissionsService();

        for (var facility of data) {
          for (var position of facility.positions) {
            const compTypes = position.comps;
            for (var candidate of position.candidates) {
              for (var dataItem of candidate.compData || []) {
                const compType = compTypes.find(i => i.Id === dataItem.Id);
                if (compType) {
                  (dataItem.type = compType.type),
                    (dataItem.headerTitle = compType.title);
                }
              }
            }
          }
        }
        if (data && data.length > 0) {
          let positionData = data.map(
            (item: {positions: any}) => item.positions,
          );
          let facilityId = data.map(
            (item: {facilityId: any}) => item.facilityId,
          );
          setFacilityId(facilityId);
          setPositions(positionData);
          setLoading(false);
        }
      } catch (error) {
        if (
          error?.response?.data?.message &&
          error?.response?.data?.invalidConexusToken == true
        )
          global.message = error?.response?.data?.invalidConexusToken;
        // logOutFromApp();
        setLoading(false);
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
        {positions && (
          <CandidateList
            submissions={positions?.[0]}
            selectedFacilityId={facilityId}
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        )}
      </View>
    </>
  );
};

export default ReviewCandidateContainer;
