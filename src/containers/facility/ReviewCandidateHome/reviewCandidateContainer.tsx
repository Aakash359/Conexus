import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator, Alert, Keyboard} from 'react-native';
import {useSelector} from '../../../redux/reducers/index';
import {AppColors} from '../../../theme';
import {CandidateList} from './candidateList';
import {facilitySubmissionsService} from '../../../services/ApiServices';

let submissionsStorePromise: Promise<any>;

const ReviewCandidateContainer = () => {
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
  }, []);

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
