import React, {useEffect, useState, createRef} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import {phoneFormatter} from '../../../common/phone-formatter';
import {windowDimensions} from '../../../common';
import variables from '../../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../../../theme/styles';
import {AppFonts, AppSizes, AppColors} from '../../../theme';
import {ConexusIconButton} from '../../../components/conexus-icon-button';
import {ActionButton} from '../../../components/action-button';
import {CandidateResponseRow} from './candidate-response-row';
import moment from 'moment';
import {useSelector} from '../../../redux/reducers/index';
import NavigationService from '../../../navigation/NavigationService';
import {NotInterestedModal} from '../../../components/Modals/NotInterestedModal';
import {MakeOfferModal} from '../../../components/Modals/MakeOfferModal';
import {ContactOptionModal} from '../../../components/Modals/ContactOptionModal';
import ConexusContentList from '../../../components/conexus-content-list';
import {PhoneCallModal} from '../../../components/Modals/phoneCallModal';
import Tabs from '../../../components/customTab';

import {
  candidateSubmissionsService,
  makeOfferService,
  notInterestedService,
  saveFeedbackResponseApi,
} from '../../../services/ApiServices';

interface HcpDetailProps {
  submissionId: string;
  candidate?: any;
  onClose?: () => any;
  screen: any;
  navigation: any;
}

interface HcpDetailState {
  refreshing: boolean;
  loadingSummary: boolean;
  candidate?: any;
}

const preloadResumeCount = 3;
// const imageCacheManager = ImageCacheManager();
// console.log('ChachManager====>', imageCacheManager);

const dateFormat = 'MM/DD/YYYY';

const HcpDetailView = (props: HcpDetailProps, state: HcpDetailState) => {
  const [candidate, setCandidate] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [phoneCallModalVisible, setPhoneCallModalVisible] = useState(false);
  const [contactOptionModalVisible, setContactOptionModalVisible] = useState(
    false,
  );
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.userReducer);
  const [callbackNumber, setCallBackNumber] = useState(
    userInfo?.user?.phoneNumber || '',
  );
  const [calling, setCalling] = useState(false);
  const submissionId = props?.route?.params?.submissionId;
  const validPhone = phoneFormatter.isValid10DigitPhoneNumber(callbackNumber);

  const {onMessageSendCallback, navigation} = props;

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
    setRefreshing(false);
    loadCandidate();
    setLoadingSummary(false);
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
      setCandidate(data);
      preloadResumePages(data);
      setRefreshing(false);
      setLoadingSummary(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  // const loadUserData = async () => {
  //   const userData = await AsyncStorage.getItem('userData');
  //   console.log('call ho raha hai ye', JSON.parse(userData).id);
  // };

  useEffect(async () => {
    loadCandidate(false);
    // loadUserData();

    if (props.onClose && props.onClose().call) {
      props.onClose();
    }
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
            const payload = {
              questionId,
              rating,
              submissionId,
            };
            return saveFeedbackResponseApi(payload).then(() => {
              return new Promise((resolve, reject) => {
                console.log('resolve', resolve);
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
    NavigationService.navigate('AnswerRatings', {
      initialIndex,
      answers: answerPlaylist,
      title: candidate.display.title,
    });
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
    // NavigationService.navigate('AudioPlayer', {
    //   parms,
    // });
  };

  const renderQuestions = (candidate: any) => {
    const responses = [];

    candidate.sections.forEach((section: {questions: any[]}) => {
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
        scrollEnabled={false}
        contentContainerStyle={{marginTop: 40}}
        data={responses}
        renderItem={({item, index}) => (
          <CandidateResponseRow
            response={item}
            onPlayResponse={() => showAnswers(index)}
          />
        )}
      />
    );
  };

  const openImageGallery = (candidate: any) => {
    NavigationService.navigate('ImageGallery', {
      images: candidate.resumePages?.originalPdf,
      title: candidate.display.title,
      initialRenderCount: preloadResumeCount,
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
      <View
        style={{flex: 1, backgroundColor: AppColors.baseGray, marginTop: 40}}
      >
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
      <View
        style={{flex: 1, backgroundColor: AppColors.baseGray, marginTop: 15}}
      >
        {renderQuestions(candidate || [])}
      </View>
    );
  };

  const renderActionHeader = (candidate: any) => {
    let date = moment(candidate.startDate).format(dateFormat);
    return (
      <View style={headerStyle.rootView}>
        <View style={StyleSheet.flatten([headerStyle.actionRowView])}>
          <ActionButton
            // disabled={candidate.resumePages.pageCount === 0}
            onPress={() => openImageGallery(candidate)}
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
            source={{uri: candidate.photoUrl}}
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

  const showPhoneCallModal = async () => {
    setContactOptionModalVisible(false);
    setPhoneCallModalVisible(true);
  };

  const makeCall = (candidate: any) => {};

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

  let communicationTypes: any =
    Object.keys(candidate).length > 0 && candidate.communicationTypes;

  let videoChat =
    (Object.keys(candidate).length > 0 &&
      communicationTypes.filter((type: {typeId: string}) => {
        return type.typeId == '1';
      })[0].available) ||
    false;

  let videoCall =
    (Object.keys(candidate).length > 0 &&
      communicationTypes.filter((type: {typeId: string}) => {
        return type.typeId == '2';
      })[0].available) ||
    false;

  const renderLoading = (paddingTop: number = 0) => {
    return (
      <ActivityIndicator
        color={AppColors.blue}
        style={{flex: 1, alignSelf: 'center', paddingTop}}
      />
    );
  };

  const PROFILETAB = [
    {
      name: 'Summary',
      key: 'summary',
      component: Summary,
      ref: createRef(),
      idx: 0,
    },
    {
      name: 'VirtualInterView',
      key: 'virtualInterView',
      component: VirtualInterView,
      ref: createRef(),
      idx: 1,
    },
  ];

  const onCallbackChangeText = (callbackNumber: any) => {
    setCallBackNumber(phoneFormatter.stripFormatting(callbackNumber));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.dataView}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => loadCandidate(true)}
          />
        }
      >
        <View style={styles.headerViews}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.closeButton}
            onPress={() => NavigationService.goBack()}
          >
            <Icon name="close-outline" size={40} color={AppColors.blue} />
          </TouchableOpacity>

          <Image
            source={{uri: candidate.photoUrl}}
            style={styles.circleStyle}
          />
          <Text style={[AppFonts.bodyTextXtraLarge, {marginTop: 15}]}>
            {Object.keys(candidate).length > 0 && candidate.display.title}
          </Text>
          {Object.keys(candidate).length > 0 && renderActionHeader(candidate)}
        </View>
        <View style={{marginTop: 5}}>
          {Object.keys(candidate).length > 0 && (
            <Tabs
              data={PROFILETAB.map(_ => ({..._}))}
              navigation={navigation}
            />
          )}
        </View>
      </ScrollView>

      {candidate && candidate?.conversationAllowed && (
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
          source={{uri: candidate.photoUrl}}
          value={phoneFormatter.format10Digit(callbackNumber)}
          onChangeText={(text: any) => onCallbackChangeText(text)}
          disabled={!validPhone}
          onRequestClose={() => console.log('Ok')}
          onDismiss={() => console.log('Ok')}
          onPress={() => makeCall(candidate)}
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
