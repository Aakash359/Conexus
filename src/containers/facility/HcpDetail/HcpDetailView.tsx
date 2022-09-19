import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Keyboard,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import {phoneFormatter} from '../../../common/phone-formatter';
import {initiatePhoneCallService} from '../../../services/Facility/phoneCallService';
import {windowDimensions} from '../../../common';
import variables from '../../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../../../theme/styles';
import {AppFonts, AppSizes, AppColors} from '../../../theme';
import {facilitySubmissionsService} from '../../../services/Facility/facilitySubmissionsService';
import {TabDetails} from '../../../components';
import {ConexusIconButton} from '../../../components/conexus-icon-button';
import {ActionButton} from '../../../components/action-button';
import {Avatar} from '../../../components/avatar';

import {CandidateResponseRow} from './candidate-response-row';
import moment from 'moment';
// import {ImageCacheManager} from 'react-native-cached-image';
import {useSelector} from '../../../redux/reducers/index';
import NavigationService from '../../../navigation/NavigationService';
import {NotInterestedModal} from '../../../components/Modals/NotInterestedModal';
import {MakeOfferModal} from '../../../components/Modals/MakeOfferModal';
import {ContactOptionModal} from '../../../components/Modals/ContactOptionModal';
import ConexusContentList from '../../../components/conexus-content-list';
import {PhoneCallModal} from '../../../components/Modals/phoneCallModal';
import {candidateSubmissionsService} from '../../../services/candidateSubmissioService';
import {notInterestedService} from '../../../services/notInterestedService';
import {makeOfferService} from '../../../services/makeOfferService';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

interface HcpDetailProps {
  submissionId: string;
  candidate?: any;
  onClose?: () => any;
  screen: any;
}

interface HcpDetailState {
  refreshing: boolean;
  loadingSummary: boolean;
  candidate?: any;
  selectedTab?: TabDetails;
}

const tabs = [
  {id: 'summary', title: 'Summary'},
  {id: 'interviews', title: 'Virtual Interviews'},
];

// const imageCacheManager = ImageCacheManager();
const preloadResumeCount = 3;
const dateFormat = 'MM/DD/YYYY';

const HcpDetailView = (props: HcpDetailProps, state: HcpDetailState) => {
  const [candidate, setCandidate] = useState(
    props?.route?.params?.candidate || {},
  );
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [phoneCallModalVisible, setPhoneCallModalVisible] = useState(false);
  const [contactOptionModalVisible, setContactOptionModalVisible] = useState(
    false,
  );
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [refreshing, setRefreshing] = useState('');
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.userReducer);
  const [callbackNumber, setCallBackNumber] = useState(
    userInfo?.user?.phoneNumber,
  );
  const [calling, setCalling] = useState(false);
  const submissionId = props?.route?.params?.submissionId;
  const validPhone = phoneFormatter.isValid10DigitPhoneNumber(callbackNumber);
  const {onMessageSendCallback} = props;

  const responses = (): any => {
    if (!candidate) {
      return [];
    }
    const result: any[] = [];
    candidate.sections.forEach((section: {questions: any[]}) => {
      section.questions.forEach(
        (question: {answerVideoUrl: any; answerAudioPath: any}) => {
          if (question.answerVideoUrl || question.answerAudioPath) {
            result.push(question);
          }
        },
      );
    });

    return result;
  };

  const refreshCandidate = (refreshing: boolean = false) => {
    setRefreshing(refreshing);
    setLoadingSummary(loadingSummary);

    // loadCandidateBySubmissionId(submissionId).then(
    //   (candidate: ) => {
    //     this.setState({refreshing: false, candidate, loadingSummary: false});
    //     this._preloadResumePages();
    //   },
    //   () => {
    //     //TODO HANDLE ERROR
    //     this.setState({
    //       refreshing: false,
    //       candidate: null,
    //       loadingSummary: false,
    //     });
    //   },
    // );
  };

  const preloadResumePages = (data: any) => {
    let i = 0;
    const promises = [];

    if (data) {
      while (i < preloadResumeCount && i < data.resumePages.pageCount) {
        promises.push(
          new Promise((resolve, reject) => {
            console.log(
              'Pre-loading candidate resume image: ' +
                candidate.resumePages.originalPdf,
            );
            return imageCacheManager
              .downloadAndCacheUrl(candidate.resumePages.originalPdf)
              .then(resolve, reject);
          }),
        );
        i += 1;
      }

      return Promise.all(promises);
    }

    return Promise.resolve();
  };

  const loadCandidate = async () => {
    setRefreshing(true);
    setLoadingSummary(true);
    try {
      const {data} = await candidateSubmissionsService(submissionId);
      let questionsData = data ? data : [];
      setData(questionsData);
      preloadResumePages(data);
      setRefreshing(false);
      setLoadingSummary(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // this.state.candidate.setViewed(candidate.submissionId);
    loadCandidate();

    // if (!candidate) {

    // }
    // else if (
    //   !candidate.resumePages.pageCount ||
    //   !candidate.submissionSummary ||
    //   !candidate.submissionSummary.length
    // ) {
    //   setCandidate(candidate);
    //   setRefreshing(true);
    //   //  refreshCandidate();
    // }
  }, []);

  const getAnswerPlaylist = (): any => {
    const playListResponse = responses();

    var answers = playListResponse.map(
      (response: {
        questionId: any;
        answerVideoUrl: any;
        answerAudioPath: any;
        questionText: any;
        feedbackResponse: number;
      }) => {
        return {
          id: response.questionId,
          videoUrl: response.answerVideoUrl,
          audioUrl: response.answerAudioPath,
          questionText: response.questionText,
          rating: response.feedbackResponse as -1 | 0 | 1,
          saveResponse: (questionId: string, rating: -1 | 0 | 1) => {
            return this.state.candidate
              .saveFeedbackResponse(questionId, rating)
              .then(() => {
                return new Promise((resolve, reject) => {
                  this.forceUpdate(resolve);
                });
              });
          },
        };
      },
    );
    return answers;
  };

  const showInterviewRatingsLightBox = (initialIndex = 0) => {
    const answerPlaylist = getAnswerPlaylist();

    // Actions[ScreenType.ANSWER_RATINGS_LIGHTBOX]({
    //   initialIndex,
    //   answers: answerPlaylist,
    //   title: this.state.candidate.display.title,
    // });
  };

  const showAnswers = (initialIndex = 0) => {
    const answerPlaylist = getAnswerPlaylist();

    if (answerPlaylist.length === 0) {
      Alert.alert(
        'Interviews Unavailable',
        'The answers for the specified interview questions are currently unavailable.',
      );
    } else {
      if (answerPlaylist[initialIndex].audioUrl) {
        playAudioAnswer(initialIndex);
      } else {
        showInterviewRatingsLightBox(initialIndex);
      }
    }
  };

  const playAudioAnswer = (index = 0) => {
    const answerPlaylist = getAnswerPlaylist();
    const answer = answerPlaylist[index];
    const avatarTitle = `${candidate.firstName} ${candidate.lastName}`;
    const avatarDescription = answer.questionText;
    const parms = {
      audioUrl: answer.audioUrl,
      avatarUrl: candidate.photoUrl,
      avatarTitle,
      avatarDescription,
    };

    // Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms);
  };

  const renderQuestions = (data: never[] | []) => {
    const responses: string | readonly any[] | null | undefined = [];
    // data.sections.forEach((section: {questions: any[]}) => {
    //   section.questions.forEach(response => {
    //     responses.push(response);
    //   });
    // });

    if (!responses.length) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 40,
            paddingBottom: 80,
          }}
        >
          <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
          <Text style={Styles.cnxNoDataMessageText}>
            No Responses Available
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        style={{paddingBottom: 220}}
        data={responses}
        renderItem={({item, index}) => (
          <CandidateResponseRow
            response={item}
            onPlayResponse={showAnswers(index)}
          />
        )}
      />
    );
  };

  const openImageGallery = (
    data: {resumePages: {originalPdf: any}} | undefined,
  ) => {
    console.log('Candiddate---->', data);

    NavigationService.navigate('ImageGallery', {
      images: data?.resumePages?.originalPdf,
      title: candidate.display.title,
      // initialRenderCount: preloadResumeCount,
    });
  };

  const callNotInterested = async () => {
    try {
      setLoading(true);
      const {data} = await notInterestedService({
        declineSubmission: true,
        submissionId: submissionId,
      });
      console.log('response', data);
      setModalVisible(false);
    } catch (error) {
      setModalVisible(false);
      console.log('Error', error);
    }
  };

  const onClickMakeOffer = async (result: any) => {
    try {
      setLoading(false);
      const {data} = await makeOfferService({
        startDate: result,
        submissionId: submissionId,
        offerSubmission: true,
      });
      console.log('response', data);
      setLoading(true);
      setOfferModalVisible(false);
    } catch (error) {
      setOfferModalVisible(false);
      setLoading(true);
      console.log('Error', error);
    }
  };
  const Summary = () => {
    return (
      <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
        {loadingSummary && renderLoading(100)}
        <ConexusContentList
          style={styles.contentList}
          data={candidate.submissionSummary}
        />
      </View>
    );
  };
  const VirtualInterView = () => {
    return (
      <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
        {renderQuestions(data || [])}
      </View>
    );
  };

  const MyTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarPressColor: AppColors.transparent,
          headerShown: true,
          tabBarShowLabel: true,
          tabBarStyle: {backgroundColor: AppColors.white},
          tabBarLabelStyle: {fontWeight: 'bold'},
          tabBarActiveTintColor: AppColors.blue,
          tabBarInactiveTintColor: AppColors.mediumGray,
        }}
      >
        <Tab.Screen
          name="Summary"
          component={Summary}
          options={{
            title: 'Summary',
          }}
        />
        <Tab.Screen
          name="Virtual InterView"
          component={VirtualInterView}
          options={{
            title: 'Virtual Interview',
          }}
        />
      </Tab.Navigator>
    );
  };

  const renderActionHeader = () => {
    let date = moment(candidate.startDate).format(dateFormat);
    return (
      <View style={headerStyle.rootView}>
        <View style={StyleSheet.flatten([headerStyle.actionRowView])}>
          <ActionButton
            // disabled={candidate.resumePages.pageCount === 0}
            onPress={() => openImageGallery()}
            title="VIEW PROFILE"
            customTitleStyle={{
              fontSize: 10,
              color: AppColors.blue,
              fontFamily: AppFonts.family.fontFamily,
            }}
            customStyle={headerStyle.viewProfileButton}
          />
        </View>

        <View style={headerStyle.wrapperView}>
          <ConexusIconButton
            textStyle={styles.buttonText}
            onPress={() => setModalVisible(true)}
            style={styles.image}
            imageSource={require('../../../components/Images/add-person.png')}
            iconSize={20}
            title="Not Interested"
          />
          <ConexusIconButton
            textStyle={styles.buttonText}
            style={
              !candidate || !candidate.conversationAllowed
                ? [
                    {
                      width: 25,
                      height: 25,
                      tintColor: AppColors.gray,
                      marginHorizontal: 20,
                      marginTop: 5,
                      alignSelf: 'center',
                    },
                  ]
                : [styles.image]
            }
            disabled={!candidate || !candidate.conversationAllowed}
            onPress={() => setOfferModalVisible(true)}
            imageSource={require('../../../components/Images/offer_icon.png')}
            iconSize={20}
            title="Make Offer"
          />
        </View>
        {offerModalVisible && (
          <MakeOfferModal
            title={'Make Offer'}
            value={date}
            onMakeOffer={(result: any) => onClickMakeOffer(result)}
            source={candidate.photoUrl}
            candidateTitle={candidate.display.title}
            onRequestClose={() => setOfferModalVisible(false)}
            onDismiss={() => setOfferModalVisible(false)}
            onPress={() => openMessageScreen()}
            onClose={() => setOfferModalVisible(false)}
            cancel={() => setOfferModalVisible(false)}
          />
        )}
        {modalVisible && (
          <NotInterestedModal
            title={'Are you sure you are not interested in this candidate?'}
            onRequestClose={() => setModalVisible(false)}
            onPress={() => callNotInterested()}
            onDismiss={() => setModalVisible(false)}
            onClose={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
          />
        )}
      </View>
    );
  };

  const showPhoneCallModal = () => {
    setContactOptionModalVisible(false);
    setPhoneCallModalVisible(true);
  };

  const makeCall = async () => {
    setCalling(true);
    Keyboard.dismiss();
    try {
      setLoading(true);
      const {data} = await initiatePhoneCallService({
        conversationId: '',
        submissionId: submissionId,
        callbackNumber: callbackNumber,
        messageTypeId: '2',
      });
      console.log('response', data);
      setPhoneCallModalVisible(false);
      setLoading(false);
    } catch (error) {
      setPhoneCallModalVisible(false);
      setLoading(false);
      console.log('Error', error);
    }
  };

  const openConversations = () => {
    NavigationService.navigate('ConversationContainer', {
      candidate: candidate,
      conversationId: candidate.conversationId || '',
    });
    setContactOptionModalVisible(false);
  };

  const onClickVideoMessage = () => {
    NavigationService.navigate('VideoRecorder', {
      finishedButtonTitle: 'Send',
      videoMessage: true,
      conversationId: candidate.conversationId,
      submissionId: candidate.submissionId,
      onMessageSendCallback: onMessageSendCallback,
    });
    setContactOptionModalVisible(false);
  };

  let communicationTypes: any = candidate.communicationTypes;
  let videoChat =
    communicationTypes.filter((type: {typeId: string}) => {
      return type.typeId == '1';
    })[0].available || false;

  let videoCall =
    communicationTypes.filter((type: {typeId: string}) => {
      return type.typeId == '2';
    })[0].available || false;

  const renderLoading = (paddingTop: number = 0) => {
    return (
      <ActivityIndicator
        color={AppColors.blue}
        style={{flex: 1, alignSelf: 'center', paddingTop}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        // scrollEnabled={true}
        // nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.dataView}
        refreshControl={
          <RefreshControl
            Refreshing={refreshing}
            // onRefresh={() => refreshCandidate(true)}
          />
        }
      >
        <View style={styles.headerViews}>
          <Icon
            style={styles.closeButton}
            name="ios-close-circle-sharp"
            size={22}
            onPress={() => NavigationService.goBack()}
          />
          <Image
            source={{uri: candidate.photoUrl}}
            style={styles.circleStyle}
          />
          <Text style={AppFonts.bodyTextXtraLarge}>
            {candidate.display.title}
          </Text>
          {renderActionHeader()}
        </View>
        {MyTabs()}
      </ScrollView>

      {
        <View style={styles.footer}>
          <ActionButton
            loading={loading}
            title="CONTACT"
            onPress={() => {
              setContactOptionModalVisible(true);
            }}
            customStyle={styles.contact}
            customTitleStyle={{
              fontSize: 12,
              fontFamily: AppFonts.family.fontFamily,
            }}
          />
        </View>
      }
      {contactOptionModalVisible && (
        <ContactOptionModal
          title={'Contact Options'}
          videoCall={videoCall}
          videoChat={videoChat}
          onRequestClose={() => setContactOptionModalVisible(false)}
          onDismiss={() => setContactOptionModalVisible(false)}
          onPress={() => showPhoneCallModal()}
          onMessage={() => openConversations()}
          onVideMessage={() => onClickVideoMessage()}
          onClose={() => setContactOptionModalVisible(false)}
        />
      )}
      {phoneCallModalVisible && (
        <PhoneCallModal
          title={candidate.display.title}
          value={phoneFormatter.format10Digit(callbackNumber)}
          // onChangeText={onCallbackChangeText()}
          // disabled={!validPhone}
          onRequestClose={() => setPhoneCallModalVisible(false)}
          onDismiss={() => setPhoneCallModalVisible(false)}
          onPress={() => makeCall()}
          onClose={() => setPhoneCallModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: AppColors.baseGray,
  },
  circleStyle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  dataView: {
    flexGrow: 1,
  },
  buttonText: {
    ...AppFonts.bodyTextNormal,
    width: 100,
    marginBottom: -10,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  image: {
    width: 25,
    height: 25,
    tintColor: AppColors.blue,
    marginHorizontal: 30,
    marginTop: 5,
    alignSelf: 'center',
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  contact: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  addPerson: {
    right: 32,
    color: AppColors.blue,
  },
  headerViews: {
    paddingTop: AppSizes.navbarHeight,
    backgroundColor: variables.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    flex: 0.1 / 2,
    borderColor: variables.lightBlue,
    width: windowDimensions.width,
  },
  rootViewContent: {
    flexDirection: 'column',
    width: windowDimensions.width,
    justifyContent: 'flex-start',
  },
  actionHeader: {
    marginTop: 12,
  },
  contentList: {
    flex: 1,
  },
});

const headerStyle = StyleSheet.create({
  viewProfileButton: {
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    height: 30,
    width: windowDimensions.width * 0.3,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
    marginTop: 20,
  },

  rootView: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  actionRowView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 18,
  },
  wrapperView: {
    flexDirection: 'row',
    paddingBottom: 18,
  },
});

export default HcpDetailView;
