import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Styles from '../../theme/styles';
import {ScreenType} from '../../common/constants';
import {NurseSubmissionsStore} from '../../stores';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import {AppFonts, AppColors, AppSizes} from '../../theme';
import {SubmissionCardList} from './submission-card-list';
import {PastSubmissionsTabList} from './past-submissions-tab-list';
import {nurseDataLoadService} from '../../services/Nurse/nurseDataLoadService';
import {facilitySubmissionsService} from '../../services/Facility/facilitySubmissionsService';

interface NurseHomeProps {}

interface NurseHomeState {
  refreshing: boolean;
}

const NurseHome = (props: NurseHomeProps, state: NurseHomeState) => {
  const [refreshing, setRefreshing] = useState(false);
  const [nurseData, setNurseData] = useState(false);

  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const {data} = await nurseDataLoadService();
    } catch (error) {
      console.log('Error', error);
      console.log(error);
      setRefreshing(false);
      Alert.alert(
        'Message Center Error',
        'We are having trouble loading your conversations. Please try again.',
      );
      // Alert.alert(error?.response?.data?.error?.description);
    }
  };

  // startVirtualInterview(submissionId: string) {
  //   Actions[ScreenType.NURSES.INTERVIEW]({submissionId});
  // }

  // const renderLoading = () => {
  //   return (
  //     <View key="loading" style={styles.screen}>
  //       <ActivityIndicator
  //         color={AppColors.blue}
  //         style={StyleSheet.flatten([
  //           {
  //             width: AppSizes.screen.width,
  //             height: AppSizes.screen.height - 200,
  //           },
  //         ])}
  //       />
  //     </View>
  //   );
  // };

  // const handleSubmissionAction = (submissionId: string, actionType: string) => {
  //   setTimeout(() => {
  //     switch (actionType.toLowerCase()) {
  //       case 'schedule':
  //         showYesNoAlert({
  //           title: 'Still In Development',
  //           yesTitle: 'Try Interview Instead',
  //           noTitle: 'OK',
  //           onYes: () => {
  //             this.startVirtualInterview(submissionId);
  //           },
  //         });

  //         break;
  //       case 'startvi':
  //         this.startVirtualInterview(submissionId);
  //         break;
  //     }
  //   }, 0);
  // };

  // const renderSubmissions = () => {
  //   const {nurseSubmissionsStore} = this.props;
  //   const interviewableSubmissions = nurseSubmissionsStore.availableInterviews; //.filter(i => i.questionCount > 0)

  //   return (
  //     <View key="submissions" style={{flex: 1}}>
  //       <Text style={styles.introTitle}>
  //         You are a candidate for {interviewableSubmissions.length} positions
  //       </Text>
  //       <SubmissionCardList
  //         submissions={interviewableSubmissions}
  //         onSubmissionAction={this.handleSubmissionAction.bind(this)}
  //       />
  //       <PastSubmissionsTabList nurseSubmissionsStore={nurseSubmissionsStore} />
  //     </View>
  //   );
  // };

  // const renderEmpty = () => {
  //   return (
  //     <View>
  //       <View
  //         key="empty"
  //         style={StyleSheet.flatten([
  //           styles.screen,
  //           Styles.cnxNoDataMessageContainer,
  //         ])}>
  //         {/* <Icon name="information-circle" style={Styles.cnxNoDataIcon} /> */}
  //         <Text style={Styles.cnxNoDataMessageText}>No current interviews</Text>
  //       </View>
  //       <PastSubmissionsTabList nurseSubmissionsStore={nurseSubmissionsStore} />
  //     </View>
  //   );
  // };

  // load(refreshing: boolean = true) {
  //   this.setState({refreshing: refreshing});

  //   this.props.nurseSubmissionsStore.load().then(
  //     () => {
  //       this.setState({refreshing: false});
  //     },
  //     error => {
  //       log.info(error);
  //       this.setState({refreshing: false});
  //     },
  //   );
  // }

  // if (
  //   nurseSubmissionsStore.isLoadingSubmissions &&
  //   nurseSubmissionsStore.submissions.length === 0
  // ) {
  //   return this._renderLoading();
  // }

  return (
    <ScrollView
      style={{flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load()} />
      }
    >
      {/* {interviewableSubmissions.length === 0
        ? renderEmpty()
        : renderSubmissions()} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    width: AppSizes.screen.width,
  },

  introTitle: {
    ...AppFonts.bodyTextMedium,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default NurseHome;
