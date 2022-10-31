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
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import {AppFonts, AppColors, AppSizes} from '../../theme';
import {nurseDataLoadService} from '../../services/Nurse/nurseDataLoadService';
import {facilitySubmissionsService} from '../../services/Facility/facilitySubmissionsService';
import SubmissionCardList from './submission-card-list';
import PastSubmissionsTabList from './past-submissions-tab-list';

interface NurseHomeProps {}

interface NurseHomeState {
  refreshing: boolean;
}

const NurseHome = (props: NurseHomeProps, state: NurseHomeState) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nurseData, setNurseData] = useState([]);
  const userInfo = useSelector(state => state.userReducer);
  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {
    load();
    saveToken();
    getToken();
  }, []);

  const availableInterviews = (data: any) => {
    return data.filter((i: any) => {
      return (
        i.interviewStatus === 'Avaliable' || i.interviewStatus === 'Available'
      );
    });
  };

  const interviewableSubmissions = availableInterviews;
  const load = async () => {
    setIsLoading(true);
    try {
      const {data} = await nurseDataLoadService();
      setIsLoading(false);
      setNurseData(data);
      availableInterviews(data);
    } catch (error) {
      console.log('Error', error);
      setIsLoading(false);
      setRefreshing(false);
      Alert.alert(
        'Message Center Error',
        'We are having trouble loading your conversations. Please try again.',
      );
      // Alert.alert(error?.response?.data?.error?.description);
    }
  };

  const startVirtualInterview = (submissionId: string) => {
    // Actions[ScreenType.NURSES.INTERVIEW]({submissionId});
  };

  const renderLoading = () => {
    return (
      <View key="loading" style={styles.screen}>
        <ActivityIndicator
          color={AppColors.blue}
          style={StyleSheet.flatten([
            {
              width: AppSizes.screen.width,
              height: AppSizes.screen.height - 200,
            },
          ])}
        />
      </View>
    );
  };

  const handleSubmissionAction = (submissionId: string, actionType: string) => {
    // setTimeout(() => {
    //   switch (actionType.toLowerCase()) {
    //     case 'schedule':
    //       showYesNoAlert({
    //         title: 'Still In Development',
    //         yesTitle: 'Try Interview Instead',
    //         noTitle: 'OK',
    //         onYes: () => {
    //           startVirtualInterview(submissionId);
    //         },
    //       });
    //       break;
    //     case 'startvi':
    //       startVirtualInterview(submissionId);
    //       break;
    //   }
    // }, 0);
  };

  const renderSubmissions = () => {
    return (
      <View key="submissions" style={{flex: 1}}>
        <Text style={styles.introTitle}>
          You are a candidate for {interviewableSubmissions.length} positions
        </Text>
        <SubmissionCardList
          submissions={nurseData}
          onSubmissionAction={() => handleSubmissionAction()}
        />
        <PastSubmissionsTabList nurseHomeData={nurseData} />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View key="empty" style={styles.center}>
        <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
        <Text style={Styles.cnxNoDataMessageText}>No current interviews</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load()} />
      }
    >
      {isLoading ? (
        renderLoading()
      ) : (
        <>
          {interviewableSubmissions.length === 0
            ? renderEmpty()
            : renderSubmissions()}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    width: AppSizes.screen.width,
  },
  center: {
    alignItems: 'center',
    marginTop: 300,
  },
  introTitle: {
    ...AppFonts.bodyTextMedium,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default NurseHome;
