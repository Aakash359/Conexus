import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, Alert, TouchableOpacity, Text, View} from 'react-native';
import {UserStore} from '../../../stores/userStore';
// import {FacilitySubmissionsStore} from '../../../stores/facility/facility-submissions-store';
import {PositionList} from './position-list';
// import {FacilityModel} from '../../stores/facility/facility-model';
import FacilitySelectionContainer from '../../../components/facility-selection-container';
import NavigationService from '../../../navigation/NavigationService';

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
  // mounted: boolean = false;

  const [refreshing, setRefreshing] = useState('');

  // const selectedFacility =(): typeof FacilityModel.Type => {
  //   const {facilitySubmissionsStore, userStore} = this.props;

  //   if (facilitySubmissionsStore.loading) {
  //     return null;
  //   }

  //   if (userStore.selectedFacilityId) {
  //     return facilitySubmissionsStore.submissions.find(
  //       facility => facility.facilityId === userStore.selectedFacilityId,
  //     );
  //   }

  //   return null;
  // }

  // const showNoData =(): boolean => {
  //   const {facilitySubmissionsStore} = this.props;
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

  // componentDidMount() {
  //   console.log('Yehi Problem hai====>', FacilitySubmissionsStore);

  //   this.mounted = true;

  //   if (this.props.userStore.isFacilityUser) {
  //     this.load(false);
  //   }
  // }

  // const load=(refreshing: boolean = false) =>{
  //   const {facilitySubmissionsStore} = this.props;
  //   setRefreshing(refreshing)

  //   if (!submissionsStorePromise) {
  //     log.info('ReviewContainer', 'Loading Submissions', refreshing);
  //     submissionsStorePromise = facilitySubmissionsStore.load();
  //   } else {
  //     log.info(
  //       'ReviewContainer',
  //       'Joining existing submission store load',
  //       refreshing,
  //     );
  //   }

  //   submissionsStorePromise.then(
  //     () => {
  //       if (this.mounted) {
  //         log.info('ReviewContainer', 'Submissions loaded');

  //         this.setState({refreshing: false}, () => {
  //           submissionsStorePromise = undefined;
  //         });
  //       } else {
  //         log.info(
  //           'ReviewContainer',
  //           'Not mounted so doing nothing after data loaded.',
  //         );
  //       }
  //     },
  //     error => {
  //       if (this.mounted) {
  //         submissionsStorePromise = undefined;
  //         this.setState({refreshing: false});
  //       } else {
  //         log.info(
  //           'ReviewContainer',
  //           'Not mounted so doing nothing after data loaded.',
  //         );
  //       }

  //       log.info('ReviewContainer', 'ERROR', error);
  //       Alert.alert(
  //         'Error',
  //         'We are having trouble loading your positions and candidates. Please try again.',
  //       );
  //     },
  //   );
  // }

  // const renderPositionList =()=> {
  //     const {facilitySubmissionsStore} = this.props;
  //     const {refreshing} = this.state;

  //     return (
  //       <PositionList
  //         style={{flex: 1}}
  //         submissions={facilitySubmissionsStore.getSnapshot().submissions}
  //         selectedFacilityId={
  //           this.selectedFacility ? this.selectedFacility.facilityId : ''
  //         }
  //         refreshing={refreshing}
  //         onRefresh={this.load.bind(this, true)}
  //       />
  //     );
  //   }

  const openHcpDetailView = () => {
    NavigationService.navigate('HcpDetailView');
  };

  getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
    console.log('Mil gya token', token);
  };

  // const {facilitySubmissionsStore} = this.props;

  return (
    <View>
      <FacilitySelectionContainer
        // showNoData={showNoData}
        // showLoading={showLoading}
        noDataText="No Positions Available"
        facilityHeaderCaption="Showing positions for"
        refreshing={refreshing}
        // onRefresh={load(true)}
        // onFacilityChosen={(facilityId: string) => this.forceUpdate()}
      >
        {/* {!!facilitySubmissionsStore.submissions && renderPositionList()} */}
      </FacilitySelectionContainer>
      <TouchableOpacity onPress={openHcpDetailView}>
        <Text style={styles.screenTitle}>Restaurants</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 24,
  },
  restaurantCard: {
    backgroundColor: '#efefef',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default ReviewCandidateContainer;
