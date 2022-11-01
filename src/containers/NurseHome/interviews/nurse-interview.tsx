import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {
  ConexusIconButton,
  ScreenFooterButton,
  Circle,
  ActionButton,
} from '../../../components';
import {ConexusLightbox} from '../../../lightboxes';
import {
  InterviewQuestionStore,
  NurseSubmissionsStore,
  NurseSubmissionModel,
  InterviewQuestionModel,
} from '../../../stores';
import {AppColors, AppFonts} from '../../../theme';
import {InterviewComplete} from './components/interview-complete';
import {QuestionAnswerRecorder} from './components/question-answer-recorder';
import {logger} from 'react-native-logs';
import InCallManager from 'react-native-incall-manager';
import {nurseInterviewQuestionService} from '../../../services/NurseInterviewQuestions/NurseInterviewQuestionsService';
import {windowDimensions} from '../../../common';
const log = logger.createLogger();

export interface NurseInterviewProps {
  submissionId: string;
  onClose?: () => any;
}

export interface NurseInterviewState {
  loading: boolean;
  closeable: boolean;
  introDisplayed: boolean;
  questionIndex: number;
  interviewComplete: boolean;
  showIntro: boolean;
}

const NurseInterview = (
  props: NurseInterviewProps,
  state: NurseInterviewState,
) => {
  const [closeable, setCloseable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [introDisplayed, setIntroDisplayed] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [nurseQuestions, setNurseQuestions] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const {submissionId, nurseData} = props?.route?.params;

  const currentQuestion = (): any => {
    if (questionIndex < 0 || interviewComplete) {
      return null;
    }
    return nurseQuestions[questionIndex];
  };

  const questionCount = (): number => {
    return nurseQuestions.length;
  };

  const maxThinkSeconds = (): number => {
    if (nurseQuestions.length) {
      // return nurseQuestions.questions[0].maxThinkSeconds;
    }

    return 0;
  };

  const maxAnswerLengthSeconds = (): number => {
    if (nurseQuestions.length) {
      return nurseQuestions[0].maxAnswerLengthSeconds;
    }

    return 0;
  };

  useEffect(() => {
    loadQuestions();

    // this.submission = nurseSubmissionsStore.availableInterviews.find(
    //   i => i.submissionId === submissionId,
    // );
    // StatusBar.setHidden(true);
    // InCallManager.setKeepScreenOn(true);

    //   this.props.nurseSubmissionsStore.load().then(
    //   () => {
    //     StatusBar.setHidden(false);
    //   },
    //   error => {
    //     StatusBar.setHidden(false);
    //     log.info('NurseSubmissionStore Error', error);
    //   },
    // );

    // if (this.props.onClose && this.props.onClose.call) {
    //   this.props.onClose();
    // }
    // InCallManager.setKeepScreenOn(false);
  }, []);

  const goNextStep = () => {
    const nextState = {questionIndex: questionIndex + 1, closeable: false};

    // No Questions -- Should never happen.  Previous screen should protect
    if (questionCount() === 0) {
      // Alert.alert('No Questions Available');
    }

    // Before First Question
    if (questionIndex === -1) {
      if (interviewComplete) {
        // Do nothing, stay on current step
        return;
      }

      if (!introDisplayed) {
        setShowIntro(true);
        return;
      }

      // GoTo first question
      // this.setState(nextState);
      return;
    }

    // On Last Question
    if (questionIndex == this.questionCount - 1) {
      setInterviewComplete(true);
      setQuestionIndex(questionIndex);
      // this.setState({interviewComplete: true, questionIndex});
      return;
    }

    // On Question
    // for one cycle set question index = -1. This will force the question answer recorder to
    // re-init instead of the existing instance being used.
    setQuestionIndex(-1);

    // this.setState({questionIndex: -1}, () => {
    //   this.setState(nextState);
    // });

    return;
  };

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const {data} = await nurseInterviewQuestionService(submissionId);
      let nurseData = data.map((i: any) => {
        return setNurseQuestions(i.questions);
      });
      goNextStep();
      setIsLoading(false);
    } catch (error) {
      console.log('Error', error);
      setIsLoading(false);
      Alert.alert(
        'Error',
        'An error occurred while loading the interview questions. Please try again.',
      );
    }
  };

  // const onAnswerError=(error)=> {
  //   // Add any additional error handling here based on the error
  //   // The control display an error page
  // }

  // const onAnswerComplete=(archiveId) {
  //   this.currentQuestion
  //     .saveVideoAnswer(this.submission.submissionId, archiveId)
  //     .then(() => {
  //       // Do nothing, recorder will display break
  //     })
  //     .catch(error => {
  //       log.info('SAVE ANSWER ERROR', error);
  //       this.goNextStep();
  //     });
  // }

  // const renderLoading=()=> {
  //   return (
  //     <View style={{flex: 1}}>
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //         <ActivityIndicator color={AppColors.blue} />
  //       </View>
  //     </View>
  //   );
  // }

  const submission = (item: any) => {
    return item;
  };

  const renderHeader = (nurseData: any) => {
    // Alert.alert('hi');
    nurseData.map(submission);

    let jnj = submission();
    console.log('nkk====>', jnj);
    const questionCount = nurseQuestions.length;

    return (
      <View>
        <View style={styles.header}>
          {/* <Text style={styles.headerText}>{this.submission.facilityName}</Text> */}
          {closeable && (
            <ConexusIconButton
              style={styles.icon}
              iconName="cn-x"
              iconSize={16}
              // onPress={() => { Actions.pop() }}
            />
          )}
        </View>
        <View style={styles.modalSubheader}>
          <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
            <Text style={styles.modalSubheaderText}>
              hi
              {/* {submission.position.display.title} */}
            </Text>
            {/* {questionIndex > -1 && (
              <Text style={styles.stepText}>
                {questionIndex + 1} of {questionCount}
              </Text>
            )} */}
          </View>
        </View>
      </View>
    );
  };

  const renderIntro = () => {
    return (
      <View
        style={{
          padding: 0,
          backgroundColor: AppColors.baseGray,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      >
        <Text style={introStyle.headerIntro}>
          You have {questionCount()} virtual interview question
          {questionCount() != 1 ? 's' : ''} to answer.
        </Text>
        <Text style={introStyle.header}>Here's how it will work:</Text>

        <Circle size={28} color={AppColors.blue} style={introStyle.circle}>
          <Text style={introStyle.circleText}>1</Text>
        </Circle>
        <Text style={introStyle.stepHeader}>VIEW QUESTION</Text>
        <Text style={introStyle.stepBody}>
          A video question will be played, and the written question will remain
          on your screen.
        </Text>

        <Circle size={28} color={AppColors.blue} style={introStyle.circle}>
          <Text style={introStyle.circleText}>2</Text>
        </Circle>
        <Text style={introStyle.stepHeader}>COUNTDOWN</Text>
        <Text style={introStyle.stepBody}>
          You will be given a {maxThinkSeconds()} second countdown to allow you
          time to think about your answer.
        </Text>

        <Circle size={28} color={AppColors.blue} style={introStyle.circle}>
          <Text style={introStyle.circleText}>3</Text>
        </Circle>
        <Text style={introStyle.stepHeader}>RECORD RESPONSE</Text>
        <Text style={introStyle.stepBody}>
          Record a video response of no more than {maxAnswerLengthSeconds()}{' '}
          second{maxAnswerLengthSeconds() != 1 ? 's' : ''} before moving to the
          next question.
        </Text>
        <View style={introStyle.footer}>
          <ActionButton
            title="START INTERVIEW"
            customStyle={introStyle.btnEnable}
            style={{marginTop: 40}}
            // onPress={()=>setShowIntro({introDisplayed:true,goNextStep()})}
          />
        </View>
      </View>
    );
  };

  const renderInterview = () => {
    const lastQuestion = questionCount() <= questionIndex + 1;
    return (
      <>
        {!isLoading && !introDisplayed && renderIntro()}
        {!isLoading && !introDisplayed && renderHeader(nurseData)}
        {introDisplayed && !interviewComplete && currentQuestion() && (
          <View style={styles.contentContainer}>
            <Text>hidnckdnk</Text>
            {/* <QuestionAnswerRecorder
              style={{flex: 1}}
              questionUrl={this.currentQuestion.questionUrl}
              questionText={this.currentQuestion.questionText}
              createdByName={
                this.currentQuestion.createdByFirstName +
                ' ' +
                this.currentQuestion.createdByLastName
              }
              createdByTitle={this.currentQuestion.createdByTitle}
              createdByUrl={''}
              hideBreak={lastQuestion}
              thinkSeconds={this.currentQuestion.maxThinkSeconds}
              answerLengthSeconds={this.currentQuestion.maxAnswerLengthSeconds}
              onPlayStep={() => this.setState({closeable: false})}
              onAnswerStep={() => this.setState({closeable: false})}
              onBreakStep={() => this.setState({closeable: true})}
              onErrorStep={() => this.setState({closeable: true})}
              onComplete={(result, data) => {
                this.goNextStep();
              }}
              onAnswerComplete={this.onAnswerComplete.bind(this)}
              onAnswerError={this.onAnswerError.bind(this)}
            /> */}
          </View>
        )}
      </>
      // <ConexusLightbox
      //   hideHeader
      //   horizontalPercent={1}
      //   verticalPercent={1}
      //   style={styles.container}>
      //   {loading && this.renderLoading()}

      //   {!loading && !introDisplayed && this.renderIntro()}

      //   {introDisplayed && !interviewComplete && this.renderHeader()}

      //   {introDisplayed && interviewComplete && (
      //     <View style={{flex: 1}}>
      //       <InterviewComplete submission={this.submission} />
      //     </View>
      //   )}
      // </ConexusLightbox>
    );
  };

  if (nurseData) {
    return renderInterview();
  }

  return <View />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: AppColors.black,
  },
  header: {
    flexDirection: 'row',
  },
  headerText: {
    ...AppFonts.bodyTextMedium,
    paddingTop: 14,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 12,
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    padding: 12,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  stepText: {
    color: AppColors.white,
    fontWeight: '500',
  },
  modalSubheader: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingLeft: 18,
    paddingBottom: 12,
    paddingRight: 18,
  },
  modalSubheaderText: {
    color: AppColors.white,
    fontWeight: '500',
    flex: 1,
  },
});

const introStyle = StyleSheet.create({
  header: {
    marginTop: 30,
    paddingHorizontal: 30,
    textAlign: 'center',
    ...AppFonts.bodyTextLarge,
    color: AppColors.darkBlue,
    fontWeight: '700',
    marginBottom: 20,
  },
  headerIntro: {
    marginTop: 30,
    paddingHorizontal: 30,
    textAlign: 'center',
    ...AppFonts.bodyTextXtraXtraLarge,
    color: AppColors.blue,
    fontWeight: '700',
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  footer: {
    justifyContent: 'flex-end',
    marginTop: 250,
  },
  circle: {
    marginTop: 28,
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  circleText: {
    ...AppFonts.bodyTextXtraLarge,
    color: AppColors.white,
    fontWeight: '700',
    //
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
  },
  stepHeader: {
    ...AppFonts.bodyTextLarge,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontWeight: '700',
    color: AppColors.blue,
    marginTop: 8,
  },
  stepBody: {
    ...AppFonts.bodyTextNormal,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default NurseInterview;
