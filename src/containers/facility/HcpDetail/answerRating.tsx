import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProperties,
  Alert,
  AlertButton,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppFonts, AppColors, AppSizes} from '../../../theme';
// import {ConexusIcon} from '../components';
import {
  ConexusVideoPlayer,
  ConexusVideoActionButton,
  Circle,
} from '../components';
import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import NavigationService from '../../../navigation/NavigationService';

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

  const {title} = props;
  console.log('props====>', currentAnswerIndex);

  //   useEffect(() => {
  //     // setTimeout(() => {
  //     //   if (IndicatorViewPager) {
  //     //     IndicatorViewPager.setPage(currentAnswerIndexes);
  //     //   }
  //     // }, 100);
  //     StatusBar.setHidden(true);
  //     StatusBar.setHidden(false);
  //   }, []);

  //   const currentAnswerIndexes = (): number => {
  //     return currentAnswerIndex;
  //   };

  //   const currentAnswer = (): AnswerRatingItem => {
  //     return props.answers[currentAnswerIndex];
  //   };

  //   const isLastAnswer = (): boolean => {
  //     return !!!props.answers[currentAnswerIndex + 1];
  //   };

  //   const switchingQuestions = (): boolean => {
  //     return switchingQuestions;
  //   };

  //   const videoLoaded = (): boolean => {
  //     return videoLoaded;
  //   };

  const count = (): number => {
    return props.answers.length;
  };

  const subheaderTitle = (): string => {
    return `Response ${currentAnswerIndex + 1} of ${count}`;
  };

  //   const setCurrentAnswer = (index: number) => {
  //     if (settingCurrent) {
  //       return;
  //     }

  //     try {
  //       settingCurrent = true;

  //       if (IndicatorViewPager) {
  //         IndicatorViewPager.setPage(index);
  //       }
  //       setCurrentAnswer(index);
  //       settingCurrent = false;
  //     } catch (error) {
  //       console.log('SetCurrentAnswer Error', error);
  //       settingCurrent = false;
  //     }
  //   };

  //   const rateAndGoNext = (rating: -1 | 0 | 1) => {
  //     console.log('Setting Rating', rating);
  //     setVideoLoaded(false);
  //     setSwitchingQuestions(true);
  //     currentAnswer.rating = rating;

  //     // this.currentAnswer
  //     //   .saveResponse(this.currentAnswer.id, this.currentAnswer.rating)
  //     //   .then(() => {
  //     //     this.setState({switchingQuestions: false}, () => {
  //     //       this.goNext();
  //     //     });
  //     //   })
  //     //   .catch(error => {
  //     //     Alert.alert(
  //     //       'Rating Error',
  //     //       'An error occurred while saving your rating. Please try again.',
  //     //     );
  //     //     this.setState({switchingQuestions: false});
  //     //   });
  //   };

  //   const goNext = () => {
  //     if (isLastAnswer()) {
  //       console.log('Last Answer, closing');
  //       NavigationService.goBack();
  //     } else {
  //       log.info('Going next answer');
  //       setCurrentAnswer(currentAnswerIndex + 1);
  //     }
  //   };

  //   const onVideoLoad = () => {
  //     setVideoLoaded(true);
  //   };

  //   const onError = (error, code?: string) => {
  //     setShowPlayer(false);

  //     //TODO: Might handle this better with a retry and cancel
  //     setTimeout(() => {
  //       const buttons: AlertButton[] = [
  //         {
  //           text: 'Retry',
  //           onPress: () => {
  //             setShowPlayer(true);
  //           },
  //         },
  //         {text: 'Cancel', onPress: onCancel()},
  //       ];

  //       Alert.alert(
  //         `We're Sorry`,
  //         `An error occurred while playing this video.${
  //           code ? ` (${code})` : ''
  //         }`,
  //         buttons,
  //       );
  //     }, 0);
  //   };

  //   const onClose = () => {
  //     StatusBar.setHidden(false);
  //     NavigationService.goBack();
  //   };

  //   const onCancel = () => {
  //     setShowPlayer(true);
  //     setSwitchingQuestions(false);
  //     if (isLastAnswer()) {
  //       console.log('Last Answer, closing');
  //       NavigationService.goBack();
  //     } else {
  //       log.info('Going next answer');
  //       goNext();
  //     }
  //   };

  //   const renderAnswer = (answer: AnswerRatingItem, index: number) => {
  //     return (
  //       <View key={index.toString()} style={styles.answerCard}>
  //         {currentAnswerIndex === index && (
  //           <ConexusVideoPlayer
  //             mediaUrl={answer.videoUrl || answer.audioUrl}
  //             autoPlay={true}
  //             pausable={true}
  //             showActionsOnEnd={true}
  //             volumeLocation={'top-right'}
  //             hideErrorIcon={true}
  //             errorDisplayText="This response is currently unavailable."
  //             menuButtons={this.menuButtons}
  //             onLoad={this.onVideoLoad.bind(this)}
  //             overlayContentWithErrorStyle={{
  //               justifyContent: 'flex-start',
  //               paddingTop: 80,
  //               marginBottom: 0,
  //             }}
  //             overlayContentStyle={{
  //               justifyContent: 'flex-start',
  //               paddingTop: 180,
  //               marginBottom: 0,
  //             }}
  //             overlayFooterStyle={styles.overlayFooter}
  //           />
  //         )}
  //         <View style={styles.questionBox}>
  //           <Text style={styles.questionBg}>{answer.questionText}</Text>
  //           <Text style={styles.question}>{answer.questionText}</Text>
  //         </View>
  //         <View style={[styles.footer]}>
  //           <View style={styles.actions}>
  //             <TouchableOpacity
  //               onPress={() => this.rateAndGoNext(-1)}
  //               style={styles.rateDown}
  //             >
  //               <Circle
  //                 size={80}
  //                 color={
  //                   answer.rating === 1 || answer.rating === 0
  //                     ? 'transparent'
  //                     : AppColors.red
  //                 }
  //                 style={[styles.actionCircle]}
  //               >
  //                 <ConexusIcon
  //                   name="cn-thumbs-down"
  //                   size={40}
  //                   color={AppColors.white}
  //                 />
  //               </Circle>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               onPress={() => this.rateAndGoNext(1)}
  //               style={styles.rateUp}
  //             >
  //               <Circle
  //                 size={80}
  //                 color={
  //                   answer.rating === -1 || answer.rating === 0
  //                     ? 'transparent'
  //                     : AppColors.green
  //                 }
  //                 style={[styles.actionCircle]}
  //               >
  //                 <ConexusIcon
  //                   name="cn-thumbs-up"
  //                   size={40}
  //                   color={AppColors.white}
  //                 />
  //               </Circle>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     );
  //   };

  //   const activityIndicator = (
  //     <ActivityIndicator style={{flex: 1}} color={AppColors.white} />
  //   );

  return (
    // <ConexusLightbox
    //   title={title}
    //   adjustForTopTab
    //   headerStyle={{backgroundColor: AppColors.white}}
    //   headerTextStyle={{color: AppColors.blue}}
    //   verticalPercent={1}
    //   horizontalPercent={1}
    //   closeable
    //   style={styles.lightbox}
    // >
    <View style={styles.header}>
      <Icon
        style={styles.closeButton}
        name="close-outline"
        size={35}
        color={AppColors.blue}
        onPress={() => NavigationService.goBack()}
      />
      <View style={styles.modalSubheader}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  lightbox: {
    padding: 0,

    backgroundColor: AppColors.black,
  },

  header: {
    height: 35,
    backgroundColor: AppColors.gray,
  },
  pager: {
    flex: 1,
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
    paddingLeft: 18,
    paddingBottom: 30,
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
