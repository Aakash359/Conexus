import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ScreenFooterButton,
  ConexusVideoPlayer,
  QuestionPlaybackHeader,
} from '../../../../components';
import {logger} from 'react-native-logs';
import {AppFonts, AppColors, AppSizes} from '../../../../theme';
import {VideoStore} from '../../../../stores';
// import { Publisher } from 'react-native-opentok'
import {onPatch} from 'mobx-state-tree';
import {IDisposer} from 'mobx-state-tree/dist/utils';
import InCallManager from 'react-native-incall-manager';
import {showApiErrorAlert} from '../../../../common';

interface QuestionAnswerRecorderProps extends ViewProperties {
  questionUrl: string;
  questionText: string;
  createdByName: string;
  createdByTitle: string;
  createdByUrl: string;

  thinkSeconds: number;
  answerLengthSeconds: number;
  hideBreak: boolean;

  onAnswerComplete?: (archiveId: string) => any;
  onAnswerError?: (error) => any;

  onPlayStep?: () => any;
  onBreakStep?: () => any;
  onAnswerStep?: () => any;
  onErrorStep?: () => any;

  onComplete: (success, data: any) => any;
  videoStore?: VideoStore;
}

interface QuestionAnswerRecorderState {
  currentStep: Step;
}

interface Step {
  stepState?: {[key: string]: any};
  secondsLeft: number;
  countDownTitle: string;
  stepName: string;
  initStep: () => Promise<any>;
  render: () => any;
  onComplete: () => any;
}
const log = logger.createLogger();

export class QuestionAnswerRecorder extends React.Component<
  QuestionAnswerRecorderProps,
  QuestionAnswerRecorderState
> {
  // private _publisher: Publisher
  private _patch: IDisposer;

  private readonly playStep: Step = {
    stepName: 'Play Question',
    countDownTitle: '',
    secondsLeft: -1,
    initStep: () => {
      InCallManager.setKeepScreenOn(true);
      const onPlayStep = this.props.onPlayStep;

      if (onPlayStep && onPlayStep.call) {
        onPlayStep();
      }

      log.info('Question Answer Recorder', 'Starting Play Question Step');
      return Promise.resolve();
    },
    render: () => {
      return (
        <View style={{flex: 1, backgroundColor: AppColors.black}}>
          <ConexusVideoPlayer
            style={styles.player}
            mediaUrl={this.props.questionUrl}
            autoPlay={true}
            pausable={false}
            showActionsOnEnd={false}
            playWhenInactive={true}
            volumeLocation="top-right"
            renderPlayOverlay={this.renderQuestionHeader.bind(this)}
            renderStoppedOverlay={this.renderQuestionHeader.bind(this)}
            onError={() => this.goNextStep(this.errorStep)}
            onEnd={() => this.playStep.onComplete()}
          />
        </View>
      );
    },
    onComplete: () => {
      log.info('Question Answer Recorder', 'Play Step', 'onComplete');

      this.goNextStep(this.answerStep);
    },
  };

  private readonly answerStep: Step = {
    stepName: 'Answer',
    countDownTitle: 'Recorded Answer Starts In',
    secondsLeft: this.props.thinkSeconds || 30,
    stepState: {
      mode: 'thinking',
    },
    initStep: () => {
      log.info('Question Answer Recorder', 'Answer Step Init');
      const onAnswerStep = this.props.onAnswerStep;
      if (onAnswerStep && onAnswerStep.call) {
        onAnswerStep();
      }

      this.answerStep.stepState.mode = 'thinking';
      InCallManager.setKeepScreenOn(true);
      this.beginCountdown(
        this.answerStep.secondsLeft,
        this.answerStep.onComplete,
      );
      return Promise.resolve();
    },
    onComplete: () => {
      this.clearCountdown();
      InCallManager.setKeepScreenOn(true);

      if (this.answerStep.stepState.mode === 'thinking') {
        this.answerStep.stepState.mode = 'recording-start';

        this.forceUpdate(() => {
          this.props.videoStore
            .recordSession()
            .then(() => {
              this.forceUpdate();
              this.answerStep.stepState.mode = 'recording';
              this.answerStep.countDownTitle = 'Answer Time Left';
              this.beginCountdown(
                this.props.answerLengthSeconds || 120,
                this.answerStep.onComplete,
              );
            })
            .catch(error => {
              log.info(
                'Question Answer Recorder',
                'Record session failure',
                error,
              );
              this.props.onAnswerError(error);
              this.goNextStep(this.errorStep);
            });
        });
      } else {
        log.info('Question Answer Recorder', 'Ending recording');
        this.answerStep.stepState.mode = 'recording-ending';
        //this.forceUpdate()
        this.props.videoStore.stopRecordingSession().then(
          (archive: any) => {
            log.info(
              'Question Answer Recorder',
              'Recording complete',
              'Disconnecting videoStore',
            );
            if (archive.Size == 0) {
              showApiErrorAlert({
                defaultTitle: 'There was an error recording your response.',
                defaultDescription: 'Please check connectivity and try again.',
                loggerName: 'qaRecorder',
                loggerTitle: 'response:error',
                error: 'Size 0',
              });
              this.forceUpdate(() => {
                this.goNextStep(this.errorStep);
              });
            } else {
              this.forceUpdate(() => {
                this.props.onAnswerComplete(archive.Id);
                if (this.props.hideBreak && this.props.onComplete) {
                  this.props.onComplete(true, null);
                } else {
                  this.goNextStep(this.breakStep);
                }
              });
            }
          },
          error => {
            log.info('Question Answer Recorder', 'Stop Recording Error', error);
            this.props.onAnswerError(error);
            this.goNextStep(this.errorStep);
          },
        );
      }
      return void 0;
    },
    render: () => {
      let {isConnected, sessionId} = this.props.videoStore;
      let footerButton = <View />;
      let showCountdown = false;
      let showQuestion = true;
      let showActivity = false;
      if (this.answerStep.stepState.mode === 'thinking') {
        showCountdown = true;
        footerButton = (
          <ScreenFooterButton
            hideGradient
            title="Answer"
            onPress={() => {
              this.clearCountdown();
              this.answerStep.onComplete();
            }}
          />
        );
      }

      if (this.answerStep.stepState.mode === 'recording-start') {
        showActivity = true;
        // showQuestion = false
        footerButton = <View />;
      }

      if (this.answerStep.stepState.mode === 'recording') {
        showCountdown = true;
        footerButton = (
          <ScreenFooterButton
            danger
            hideGradient
            title="End Recording"
            onPress={() => {
              this.clearCountdown();
              this.answerStep.onComplete();
            }}
          />
        );
      }

      if (this.answerStep.stepState.mode === 'recording-ending') {
        // showQuestion = false
        showActivity = true;
      }

      if (this.answerStep.stepState.mode === 'recording-end') {
        showQuestion = false;
      }
      log.info('*** render state', isConnected, sessionId);

      return (
        <View key="answer-step" style={{flex: 1}}>
          {this.renderQuestionHeader(showCountdown)}
          {showActivity && this.renderActivity()}
          {footerButton}
        </View>
      );
    },
  };

  private readonly breakStep: Step = {
    stepName: 'Question Break',
    countDownTitle: '',
    secondsLeft: -1,
    initStep: () => {
      const onBreakStep = this.props.onBreakStep;
      if (onBreakStep && onBreakStep.call) {
        onBreakStep();
      }
      InCallManager.setKeepScreenOn(true);
      return Promise.resolve();
    },
    render: () => {
      return (
        <View style={{flex: 1, backgroundColor: AppColors.black}}>
          <View style={{flex: 1, padding: 20}}>
            <Text
              style={{
                marginTop: 200,
                textAlign: 'center',
                ...AppFonts.bodyTextLarge,
                color: 'white',
              }}>
              Yay! You answered a question.
            </Text>
            <Text
              style={{
                marginTop: 12,
                textAlign: 'center',
                ...AppFonts.bodyTextNormal,
                color: 'white',
              }}>
              Take a break and continue when ready
            </Text>
            <ScreenFooterButton
              hideGradient
              title="Next Question"
              onPress={this.breakStep.onComplete.bind(this)}
            />
          </View>
        </View>
      );
    },
    onComplete: () => {
      log.info('Question Answer Recorder', 'BreakStep, OnComplete');

      if (this.props.onComplete && this.props.onComplete.call) {
        this.props.onComplete(true, null);
      }
    },
  };

  private readonly errorStep: Step = {
    stepName: 'Question Error',
    countDownTitle: '',
    secondsLeft: -1,
    initStep: () => {
      const onErrorStep = this.props.onErrorStep;

      log.info('Question Answer Recorder', 'ErrorStep Init');

      if (onErrorStep && onErrorStep.call) {
        log.info('Question Answer Recorder', 'Call parent onErrorStep');
        onErrorStep();
      }

      log.info('Question Answer Recorder', 'ErrorStep Init Complete');
      return Promise.resolve();
    },
    render: () => {
      log.info('Question Answer Recorder', 'Error step render');
      return (
        <View style={{flex: 1, backgroundColor: AppColors.black}}>
          <View style={{flex: 1, padding: 20}}>
            <Text
              style={{
                marginTop: 200,
                textAlign: 'center',
                ...AppFonts.bodyTextLarge,
                color: 'white',
              }}>
              An error occurred while presenting this question.
            </Text>
            <Text
              style={{
                marginTop: 12,
                textAlign: 'center',
                ...AppFonts.bodyTextNormal,
                color: 'white',
              }}>
              We'll skip this one for now. Click continue when ready for the
              next question.
            </Text>
            <ScreenFooterButton
              hideGradient
              title="Continue"
              onPress={this.errorStep.onComplete.bind(this)}
            />
          </View>
        </View>
      );
    },
    onComplete: () => {
      log.info('Question Answer Recorder', 'ErrorStep, OnComplete');

      if (this.props.onComplete && this.props.onComplete.call) {
        this.props.onComplete(false, null);
      }
    },
  };

  get currentStep(): Step {
    return this.state.currentStep;
  }

  get style(): any[] {
    return [this.props.style, {backgroundColor: 'transparent'}];
  }

  constructor(
    props: QuestionAnswerRecorderProps,
    state: QuestionAnswerRecorderState,
  ) {
    super(props, state);

    this.state = {
      currentStep: null,
    };
    this._patch = onPatch(this.props.videoStore, patch => {
      log.info('VIDEO_STORE_CHANGED', patch);
    });
  }

  componentDidMount() {
    InCallManager.setKeepScreenOn(true);

    log.info('***** componentDidMount');
    log.info('Props', this.props);
    this.props.videoStore.initVideoSession().then(
      () => {
        if (!this.props.questionUrl.trim()) {
          log.info(
            'Question Answer Recorder',
            'Empty question url. Can not play question',
          );
          this.goNextStep(this.errorStep);
        } else {
          log.info('Video Play step call');
          this.goNextStep(this.playStep);
        }
      },
      (err: any) => {
        log.info('Something else went wrong', err);
        this.goNextStep(this.errorStep);
      },
    );
  }

  componentWillUnmount() {
    InCallManager.setKeepScreenOn(false);

    // this._publisher = null

    if (this._patch) {
      this._patch();
    }
    this.clearCountdown();
  }

  goNextStep(nextStep: Step) {
    setTimeout(() => {
      if (nextStep) {
        nextStep.initStep().then(
          () => {
            this.setState({currentStep: nextStep}, () => {
              log.info('Question Answer Recorder', 'Go Next Step Complete');
            });
          },
          error => {
            log.info(
              'Question Answer Recorder',
              'Go Next Step',
              'ERROR',
              error,
            );

            this.errorStep.initStep().then(
              () => {
                this.setState({currentStep: this.errorStep});
              },
              error => {
                log.info(
                  'Question Answer Recorder',
                  'Go Next Step',
                  'ERROR',
                  error,
                );
              },
            );
          },
        );
      }
    }, 0);
  }

  countdownTimeoutHandle: number;

  clearCountdown() {
    clearTimeout(this.countdownTimeoutHandle);
    this.currentStep.secondsLeft = 0;
  }

  beginCountdown(secondsLeft: number, onComplete: () => any) {
    if (secondsLeft < 0) {
      secondsLeft = 0;
    }

    this.currentStep.secondsLeft = secondsLeft;
    this.forceUpdate();

    if (secondsLeft > 0) {
      this.countdownTimeoutHandle = setTimeout(() => {
        secondsLeft = secondsLeft - 1;
        this.currentStep.secondsLeft = secondsLeft;

        this.forceUpdate(() => {
          this.beginCountdown(secondsLeft, onComplete);
        });
      }, 1000);
    } else {
      onComplete();
    }

    return void 0;
  }

  renderActivity() {
    return (
      <ActivityIndicator color={AppColors.blue} style={absolutePosition} />
    );
  }

  renderQuestionHeader(showCountdown) {
    const {createdByName, createdByTitle, createdByUrl, questionText} =
      this.props;
    return (
      <QuestionPlaybackHeader
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        showAvatar={true}
        avatarTitle={createdByName}
        avatarDescription={createdByTitle}
        avatarUrl={createdByUrl}
        showCountdown={showCountdown}
        countdownTitle={this.currentStep.countDownTitle}
        countdownDescription={this.currentStep.secondsLeft.toString()}
        questionText={questionText}
      />
    );
  }

  render() {
    let thisStep = '';
    if (!!this.currentStep) {
      thisStep = this.currentStep.stepName;
    }
    log.info('Step: ', thisStep);
    return (
      <View style={{flex: 1}}>
        {/* {!!this.props.videoStore.sessionId && thisStep === "Answer" && Platform.OS !== "android" && <Publisher style={answerStyle.publisher} ref={(i) => this._publisher = i} sessionId={this.props.videoStore.sessionId} />}
                {!!this.props.videoStore.sessionId && Platform.OS === "android" && <Publisher style={answerStyle.publisher} ref={(i) => this._publisher = i} sessionId={this.props.videoStore.sessionId} />}
                {!!this.currentStep && this.currentStep.render()} */}
      </View>
    );
  }
}

const absolutePosition = {
  position: 'absolute' as 'absolute' | 'relative',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

const answerStyle = StyleSheet.create({
  publisher: {
    ...absolutePosition,
    flex: 1,
    backgroundColor: 'black',
  },
});

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    height: '50%',
  },

  player: {
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    flex: 1,
  },
});
