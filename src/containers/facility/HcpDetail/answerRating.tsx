import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AlertButton,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {AppFonts, AppColors, AppSizes} from '../../../theme';
import {ConexusVideoActionButton, Circle} from '../../../components';
import PagerView from 'react-native-pager-view';
import NavigationService from '../../../navigation/NavigationService';
import ConexusVideoPlayer from '../../../components/conexus-video-player';
import {Platform} from 'react-native';

export interface AnswerRatingItem {
  id: string;
  initialIndex?: number;
  videoUrl: string;
  audioUrl: string;
  questionText: string;
  rating: -1 | 0 | 1;
  saveResponse: (id: string, rating: -1 | 0 | 1) => Promise<any>;
}

interface AnswerRatingsProps {
  answers: AnswerRatingItem[];
  title: string;
}

interface AnswerRatingsState {
  showPlayer: boolean;
  currentAnswerIndex: number;
  switchingQuestions: boolean;
  videoLoaded: boolean;
}

export const AnswerIndicator = () => {
  const settingCurrent: boolean = false;
  const render = () => {
    return <View />;
  };

  const onPageSelected = (e: any) => {
    if (settingCurrent) {
      return;
    }

    try {
      settingCurrent = true;
      props.answerRatingsLightbox.setCurrentAnswer(e.position);
    } catch (error) {
      console.log('Error', error);
    } finally {
      settingCurrent = false;
    }
  };
};

const AnswerRatings = (
  props: AnswerRatingsProps,
  state: AnswerRatingsState,
) => {
  const settingCurrent: boolean = false;
  //   const drawerRef = useRef(PagerDotIndicator);
  const menuButtons: ConexusVideoActionButton[] = [];
  const [showPlayer, setShowPlayer] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(
    props?.route?.params?.initialIndex || 0,
  );
  const [switchingQuestions, setSwitchingQuestions] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const propsData = props?.route?.params;
  const {answers, initialIndex} = propsData;
  const {title} = props;
  const screenName = props?.route?.name;
  console.log();

  useEffect(() => {
    StatusBar.setHidden(true);
    StatusBar.setHidden(false);
  }, []);

  //   const currentAnswerIndexes = (): number => {
  //     return currentAnswerIndex;
  //   };

  const currentAnswer = (): AnswerRatingItem => {
    return answers[currentAnswerIndex];
  };

  const isLastAnswer = (): boolean => {
    return !!!answers[currentAnswerIndex + 1];
  };

  // const switchingQuestions = (): boolean => {
  //   return switchingQuestions;
  // };

  // const videoLoaded = (): boolean => {
  //   return videoLoaded;
  // };

  const count = (): number => {
    return answers.length;
  };

  const subheaderTitle = (): string => {
    return `Response ${currentAnswerIndex + 1} of ${count()}`;
  };

  const setCurrentAnswer = (index: number) => {
    if (settingCurrent) {
      return;
    }

    try {
      settingCurrent = true;

      if (IndicatorViewPager) {
        IndicatorViewPager.setPage(index);
      }
      setCurrentAnswer(index);
      settingCurrent = false;
    } catch (error) {
      console.log('SetCurrentAnswer Error', error);
      settingCurrent = false;
    }
  };

  const rateAndGoNext = (rating: -1 | 0 | 1) => {
    console.log('Setting Rating', rating);
    setVideoLoaded(false);
    setSwitchingQuestions(true);
    currentAnswer().rating = rating;
    currentAnswer()
      .saveResponse(currentAnswer().id, currentAnswer().rating)
      .then(() => {
        setSwitchingQuestions(false);
        goNext();
      })
      .catch(error => {
        Alert.alert(
          'Rating Error',
          'An error occurred while saving your rating. Please try again.',
        );
        console.log('Error', error);
        setSwitchingQuestions(false);
      });
  };

  const goNext = () => {
    if (isLastAnswer()) {
      console.log('Last Answer, closing');
      NavigationService.goBack();
    } else {
      console.log('Going next answer');
      setCurrentAnswer(currentAnswerIndex + 1);
    }
  };

  const onVideoLoad = () => {
    setVideoLoaded(true);
  };

  const onError = (error, code?: string) => {
    setShowPlayer(false);

    //TODO: Might handle this better with a retry and cancel
    setTimeout(() => {
      const buttons: AlertButton[] = [
        {
          text: 'Retry',
          onPress: () => {
            setShowPlayer(true);
          },
        },
        {text: 'Cancel', onPress: onCancel()},
      ];

      Alert.alert(
        `We're Sorry`,
        `An error occurred while playing this video.${
          code ? ` (${code})` : ''
        }`,
        buttons,
      );
    }, 0);
  };

  const onClose = () => {
    StatusBar.setHidden(false);
    NavigationService.goBack();
  };

  const onCancel = () => {
    setShowPlayer(true);
    setSwitchingQuestions(false);
    if (isLastAnswer()) {
      console.log('Last Answer, closing');
      NavigationService.goBack();
    } else {
      console.log('Going next answer');
      goNext();
    }
  };

  const renderAnswer = (answer: AnswerRatingItem, index: number) => {
    return (
      <View key={index.toString()} style={styles.answerCard}>
        {currentAnswerIndex === index && (
          <ConexusVideoPlayer
            mediaUrl={answer.videoUrl || answer.audioUrl}
            screenName={screenName}
            autoPlay={true}
            pausable={true}
            showActionsOnEnd={true}
            volumeLocation={'top-right'}
            hideErrorIcon={true}
            errorDisplayText="This response is currently unavailable."
            menuButtons={menuButtons}
            onLoad={() => onVideoLoad()}
            overlayContentStyle={{
              justifyContent: 'flex-start',
              paddingTop: 180,
              marginBottom: 0,
            }}
            overlayFooterStyle={styles.overlayFooter}
          />
        )}
        <View style={styles.questionBox}>
          <Text style={styles.questionBg}>{answer.questionText}</Text>
          <Text style={styles.question}>{answer.questionText}</Text>
        </View>
        <View style={[styles.footer]}>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => rateAndGoNext(-1)}
              style={styles.rateDown}
            >
              <Circle
                size={80}
                color={
                  answer.rating === 1 || answer.rating === 0
                    ? 'transparent'
                    : AppColors.red
                }
                style={[styles.actionCircle]}
              >
                <Icon name="thumbs-down" size={40} color={AppColors.white} />
              </Circle>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => rateAndGoNext(1)}
              style={styles.rateUp}
            >
              <Circle
                size={80}
                color={
                  answer.rating === -1 || answer.rating === 0
                    ? 'transparent'
                    : AppColors.green
                }
                style={[styles.actionCircle]}
              >
                <Icon name="thumbs-up" size={40} color={AppColors.white} />
              </Circle>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const activityIndicator = (
    <ActivityIndicator style={{flex: 1}} color={AppColors.white} />
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.closeButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon name="close-outline" size={35} color={AppColors.blue} />
        </TouchableOpacity>

        <View style={styles.modalSubheader}>
          <Text style={styles.modalSubheaderText}>{subheaderTitle()}</Text>
        </View>
      </View>
      <PagerView
        style={styles.pager}
        initialPage={initialIndex}
        orientation="horizontal"
        scrollEnabled
      >
        {answers.map((answer, index) => renderAnswer(answer, index))}
      </PagerView>
    </>
  );
};

const styles = StyleSheet.create({
  lightbox: {
    padding: 0,

    backgroundColor: AppColors.black,
  },

  header: {
    height: 35,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
    backgroundColor: AppColors.baseGray,
  },
  pager: {
    flex: 1,
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    alignSelf: 'center',
    right: 12,
  },
  answerCard: {},
  modalSubheader: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 35,
    height: 20,
    paddingLeft: 18,
    paddingRight: 18,
  },
  modalSubheaderText: {
    ...AppFonts.bodyTextNormal,
    color: AppColors.white,
  },
  questionBox: {
    position: 'relative',
    paddingBottom: 100,
    paddingLeft: 20,
    paddingRight: 20,
    top: 60,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: 44,
    paddingRight: 44,
    paddingBottom: 44,
    zIndex: 20,
  },
  question: {
    ...AppFonts.bodyTextXtraLarge,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: AppColors.white,
  },
  questionBg: {
    ...AppFonts.bodyTextXtraLarge,
    position: 'absolute',
    textAlign: 'center',
    top: 1,
    left: 1,
    right: -1,
    color: AppColors.black,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionCircle: {
    borderWidth: 1,
    borderColor: AppColors.white,
  },
  rateUp: {},
  rateDown: {},
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0,
  },
});

export default AnswerRatings;
