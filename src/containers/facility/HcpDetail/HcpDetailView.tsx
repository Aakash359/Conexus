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
} from 'react-native';
import {phoneFormatter} from '../../../common/phone-formatter';
import {initiatePhoneCallService} from '../../../services/Facility/phoneCallService';
import {windowDimensions} from '../../../common';
import variables from '../../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../../../theme/styles';
import {AppFonts, AppSizes, AppColors} from '../../../theme';
import {facilitySubmissionsService} from '../../../services/Facility/facilitySubmissionsService';
import {TabDetails, ScreenFooterButton} from '../../../components';
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
import {onChange} from 'react-native-reanimated';
import {makeOfferService} from '../../../services/makeOfferService';
import {TOP_TAB_SCREENS} from '../../../navigation/TabNavigator';
import {TabBar} from '../../../components/tab-bar';

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
  const [stateCandidate, setStateCandidate] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [phoneCallModalVisible, setPhoneCallModalVisible] = useState(false);
  const [contactOptionModalVisible, setContactOptionModalVisible] =
    useState(false);
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
  const {onMessageSendCallback, screen} = props;

  // get responses(): typeof CandidateResponseModel.Type[] {
  //   const {candidate} = this.state;

  //   if (!candidate) {
  //     return [];
  //   }

  //   const result = [];

  //   candidate.sections.forEach(section => {
  //     section.questions.forEach(question => {
  //       if (question.answerVideoUrl || question.answerAudioPath) {
  //         result.push(question);
  //       }
  //     });
  //   });

  //   return result;
  // }

  const refreshCandidate = (refreshing: boolean = false) => {
    console.log('Okkk===>', 'loading', loadingSummary);

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
    console.log('Data====>', data);

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

      setData(data);
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

  // getAnswerPlaylist(): AnswerRatingItem[] {
  //   const responses = this.responses;

  //   var answers = responses.map(response => {
  //     return {
  //       id: response.questionId,
  //       videoUrl: response.answerVideoUrl,
  //       audioUrl: response.answerAudioPath,
  //       questionText: response.questionText,
  //       rating: response.feedbackResponse as -1 | 0 | 1,
  //       saveResponse: (questionId: string, rating: -1 | 0 | 1) => {
  //         return this.state.candidate
  //           .saveFeedbackResponse(questionId, rating)
  //           .then(() => {
  //             return new Promise((resolve, reject) => {
  //               this.forceUpdate(resolve);
  //             });
  //           });
  //       },
  //     };
  //   });
  //   return answers;
  // }

  // showAnswers(initialIndex = 0) {
  //   const answerPlaylist = this.getAnswerPlaylist();

  //   if (answerPlaylist.length === 0) {
  //     Alert.alert(
  //       'Interviews Unavailable',
  //       'The answers for the specified interview questions are currently unavailable.',
  //     );
  //   } else {
  //     if (answerPlaylist[initialIndex].audioUrl) {
  //       this.playAudioAnswer(initialIndex);
  //     } else {
  //       this.showInterviewRatingsLightBox(initialIndex);
  //     }
  //   }
  // }

  // showInterviewRatingsLightBox(initialIndex = 0) {
  //   const answerPlaylist = this.getAnswerPlaylist();

  //   Actions[ScreenType.ANSWER_RATINGS_LIGHTBOX]({
  //     initialIndex,
  //     answers: answerPlaylist,
  //     title: this.state.candidate.display.title,
  //   });
  // }

  // playAudioAnswer(index = 0) {
  //   const {candidate} = this.state;
  //   const answerPlaylist = this.getAnswerPlaylist();
  //   const answer = answerPlaylist[index];
  //   const avatarTitle = `${candidate.firstName} ${candidate.lastName}`;
  //   const avatarDescription = answer.questionText;
  //   const parms = {
  //     audioUrl: answer.audioUrl,
  //     avatarUrl: candidate.photoUrl,
  //     avatarTitle,
  //     avatarDescription,
  //   };

  //   Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms);
  // }

  const renderQuestions = () => {
    const responses = [];
    data.sections.forEach((section: {questions: any[]}) => {
      section.questions.forEach(response => {
        responses.push(response);
      });
    });

    if (!responses.length) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 40,
            paddingBottom: 80,
          }}>
          <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
          <Text style={Styles.cnxNoDataMessageText}>
            No Responses Available
          </Text>
        </View>
      );
    }

    // return (
    //   <FlatList
    //     style={{paddingBottom: 220}}
    //     data={responses}
    //     renderItem={({item, index}) => (
    //       <CandidateResponseRow
    //         response={item}
    //         onPlayResponse={this.showAnswers.bind(this, index)}
    //       />
    //     )}
    //   />
    // );
  };

  const openImageGallery = () => {
    NavigationService.navigate('ImageGallery', {
      // images: candidate.resumePages.images,
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

  const onChange = (changedDate: any) => {
    console.log('Data', changedDate);
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

        <View style={headerStyle.actionRowView}>
          <ConexusIconButton
            onPress={() => setModalVisible(true)}
            iconName="offer"
            iconSize={20}
            title="Not Interested"
          />
          <ConexusIconButton
            disabled={!candidate || !candidate.conversationAllowed}
            onPress={() => setOfferModalVisible(true)}
            iconName="offer"
            iconSize={20}
            title="Make Offer"
          />
        </View>

        <TabBar
          selectedTabId={selectedTab.id}
          tabs={tabs}
          onTabSelection={tab => setSelectedTab(tab)}
          // onTabSelection={tab => this.setState({selectedTab: tab})}
          style={{flex: 1}}
        />
        {offerModalVisible && (
          <MakeOfferModal
            title={'Make Offer'}
            value={date}
            onMakeOffer={(result: any) => onClickMakeOffer(result)}
            // onChange={data => console.log('CHnagedDate===>', data)}
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

  const onCallbackChangeText = (callbackNumber: string) => {
    setCallBackNumber({
      callbackNumber: phoneFormatter.stripFormatting(callbackNumber),
    });
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
    NavigationService.navigate('ConversationContainer');
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

  const renderCandidate = () => {
    return (
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              Refreshing={refreshing}
              onRefresh={() => refreshCandidate(true)}
            />
          }
          style={styles.rootView}
          contentContainerStyle={styles.rootViewContent}>
          <View style={styles.headerViews}>
            <Icon
              style={styles.closeButton}
              name="ios-close-circle-sharp"
              size={22}
              onPress={() => NavigationService.goBack()}
            />
            <Avatar
              style={{width: 108, marginBottom: 14}}
              size={108}
              source={candidate.photoUrl}
              title={candidate.photoLabel}
            />
            <Text style={AppFonts.bodyTextXtraLarge}>
              {candidate.display.title}
            </Text>
            {renderActionHeader()}
          </View>
          {loadingSummary && selectedTab === tabs[0] && (
            <ConexusContentList
              style={styles.contentList}
              data={candidate.submissionSummary}
            />
          )}
          {selectedTab === tabs[1] && renderQuestions(data)}
          {/* {loadingSummary && renderLoading(100)} */}
        </ScrollView>
        {!!candidate && candidate.conversationAllowed && (
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
        )}

        {contactOptionModalVisible && (
          <ContactOptionModal
            title={'Contact Options'}
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
      </View>
    );
  };

  const renderLoading = (paddingTop: number = 0) => {
    return (
      <ActivityIndicator
        color={AppColors.blue}
        style={{flex: 1, alignSelf: 'center', paddingTop}}
      />
    );
  };

  return renderCandidate();
};

const styles = StyleSheet.create({
  rootView: {
    width: windowDimensions.width,
    backgroundColor: variables.baseGray,
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
    marginTop: 1,
    paddingBottom: 120,
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  actionRowView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 18,
  },
});

export default HcpDetailView;
