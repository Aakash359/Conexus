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
import SubmissionCardList from './submission-card-list';
import PastSubmissionsTabList from './past-submissions-tab-list';
import NavigationService from '../../navigation/NavigationService';
import {nurseDataLoadService} from '../../services/ApiServices';
import {Strings} from '../../common/Strings';

interface NurseHomeState {
  refreshing: boolean;
}
const {CONVERSATION_LOADING_ERROR} = Strings;
const NurseHome = (props: any, state: NurseHomeState) => {
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
      Alert.alert('Message Center Error', CONVERSATION_LOADING_ERROR);
      // Alert.alert(error?.response?.data?.error?.description);
    }
  };

  const startVirtualInterview = (submissionId: string, paramsData: any) => {
    NavigationService.navigate('NurseInterview', {
      submissionId,
      nurseData,
      paramsData,
    });
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

  const handleSubmissionAction = (
    submissionId: string,
    actionType: string,
    paramsData: any,
  ) => {
    setTimeout(() => {
      switch (actionType.toLowerCase()) {
        case 'schedule':
          showYesNoAlert({
            title: 'Still In Development',
            yesTitle: 'Try Interview Instead',
            noTitle: 'OK',
            onYes: () => {
              startVirtualInterview(submissionId, paramsData);
            },
          });
          break;
        case 'startvi':
          startVirtualInterview(submissionId, paramsData);
          break;
      }
    }, 0);
  };

  const renderSubmissions = () => {
    return (
      <View key="submissions" style={{flex: 1}}>
        <Text style={styles.introTitle}>
          You are a candidate for {interviewableSubmissions.length} positions
        </Text>
        <SubmissionCardList
          submissions={nurseData}
          onSubmissionAction={(
            submissionId: any,
            actionType: any,
            paramsData: any,
          ) => handleSubmissionAction(submissionId, actionType, paramsData)}
        />
        <PastSubmissionsTabList submissionData={nurseData} />
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
