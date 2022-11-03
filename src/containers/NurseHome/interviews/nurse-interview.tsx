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
import {ConexusIconButton, Circle, ActionButton} from '../../../components';
import {AppColors, AppFonts} from '../../../theme';
import InCallManager from 'react-native-incall-manager';
import {nurseInterviewQuestionService} from '../../../services/NurseInterviewQuestions/NurseInterviewQuestionsService';
import {windowDimensions} from '../../../common';
import InterviewComplete from './components/interview-complete';
import NavigationService from '../../../navigation/NavigationService';
import QuestionAnswerRecorder from './components/question-answer-recorder';

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
      return nurseQuestions[0].maxThinkSeconds;
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
    StatusBar.setHidden(true);
    InCallManager.setKeepScreenOn(true);

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
    InCallManager.setKeepScreenOn(false);
  }, []);

  const goNextStep = () => {
    const nextState = {questionIndex: questionIndex + 1, closeable: false};
    if (questionCount() === 0) {
      // Alert.alert('No Questions Available');
    }
    if (questionIndex === -1) {
      if (interviewComplete) {
        return;
      }

      if (!introDisplayed) {
        setShowIntro(true);
        return;
      }
      // this.setState(nextState);
      return;
    }
    if (questionIndex == questionCount() - 1) {
      setInterviewComplete(true);
      setQuestionIndex(questionIndex);
      return;
    }
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

  const onAnswerError = (error: any) => {
    // Add any additional error handling here based on the error
    // The control display an error page
  };

  const onAnswerComplete = (archiveId: string) => {
    // this.currentQuestion
    //   .saveVideoAnswer(this.submission.submissionId, archiveId)
    //   .then(() => {
    //     // Do nothing, recorder will display break
    //   })
    //   .catch(error => {
    //     log.info('SAVE ANSWER ERROR', error);
    //     this.goNextStep();
    //   });
  };

  const renderLoading = () => {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={AppColors.blue} />
        </View>
      </View>
    );
  };

  const renderHeader = (submission: any) => {
    const questionCount = nurseQuestions.length;

    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>{submission.facilityName}</Text>
          {closeable && (
            <ConexusIconButton
              style={styles.icon}
              iconName="cn-x"
              iconSize={16}
              onPress={() => NavigationService.goBack()}
            />
          )}
        </View>
        <View style={styles.modalSubheader}>
          <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
            <Text style={styles.modalSubheaderText}>
              {submission.position.display.title}
            </Text>
            {questionIndex > -1 && (
              <Text style={styles.stepText}>
                {questionIndex + 1} of {questionCount}
              </Text>
            )}
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
            onPress={() => {
              setShowIntro(false), setIntroDisplayed(false), goNextStep();
            }}
          />
        </View>
      </View>
    );
  };

  const renderInterview = () => {
    const lastQuestion = questionCount() <= questionIndex + 1;
    return (
      <>
        {isLoading && renderLoading()}
        {!isLoading && !introDisplayed && renderIntro()}
        {introDisplayed &&
          !interviewComplete &&
          renderHeader(props?.route?.params?.paramsData?.submission)}
        {introDisplayed && !interviewComplete && currentQuestion() && (
          <View style={styles.contentContainer}>
            <QuestionAnswerRecorder
              style={{flex: 1}}
              questionUrl={currentQuestion().questionUrl}
              questionText={currentQuestion().questionText}
              createdByName={
                currentQuestion().createdByFirstName +
                ' ' +
                currentQuestion().createdByLastName
              }
              createdByTitle={currentQuestion().createdByTitle}
              createdByUrl={''}
              hideBreak={lastQuestion}
              thinkSeconds={currentQuestion().maxThinkSeconds}
              answerLengthSeconds={currentQuestion().maxAnswerLengthSeconds}
              onPlayStep={() => setCloseable(false)}
              onAnswerStep={() => setCloseable(false)}
              onBreakStep={() => setCloseable(false)}
              onErrorStep={() => setCloseable(false)}
              onComplete={(result, data) => {
                goNextStep();
              }}
              onAnswerComplete={onAnswerComplete()}
              onAnswerError={onAnswerError()}
            />
          </View>
        )}
        {introDisplayed && interviewComplete && (
          <View style={{flex: 1}}>
            <InterviewComplete
              submission={props?.route?.params?.paramsData?.submission}
            />
          </View>
        )}
      </>
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
