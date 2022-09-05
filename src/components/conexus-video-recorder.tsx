import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlexAlignType,
  ActivityIndicator,
  ViewStyle,
  Alert,
} from 'react-native';
import {ActionButton, ScreenFooterButton} from '../components';
import {logger} from 'react-native-logs';
import {AppFonts, AppColors, AppSizes} from '../theme';
import {VideoStore} from '../stores';
import {Publisher} from 'react-native-opentok';
import {windowDimensions} from '../common';

interface ConexusVideoRecorderProps {
  onRecordComplete?: (archiveId: string, videoUrl: string) => any;
  onRecordError?: (error) => any;
  onRecordStart?: () => any;
  style: any;
  onRecordStep?: () => any;
  onErrorStep?: () => any;
  videoStore?: VideoStore;
  onComplete: (success, data: any) => any;
}

interface Step {
  stepState?: {[key: string]: any};
  initStep: () => Promise<any>;
  startRender: () => any;
  onComplete: () => any;
}

interface VideoRecorderState {
  currentStep: Step;
}

export const ConexusVideoRecorder = (
  props: ConexusVideoRecorderProps,
  state: VideoRecorderState,
) => {
  // const _publisher: Publisher;
  const {onErrorStep, onRecordStep} = props;
  const [currentStep, setCurrentStep] = useState('');

  const style = (): any[] => {
    return [props.style, {backgroundColor: AppColors.black}];
  };

  const currentSteps = (): Step => {
    return state.currentStep;
  };

  // const recordStep = (): Step => {
  //   const initStep
  // };

  const goNextStep = (nextStep: Step) => {
    setTimeout(() => {
      if (nextStep) {
        nextStep.initStep().then(
          () => setCurrentStep(nextStep),
          () => {
            errorStep.initStep().then(
              () => {
                setCurrentStep(errorStep);
              },
              error => {
                console.log('Conexus Video Recorder', 'ERROR', error);
              },
            );
          },
        );
      }
    }, 0);
  };

  useEffect(() => {
    goNextStep(recordStep());
  }, []);

  // const errorStep: Step = {
  //   initStep: () => {
  //     const onErrorStep = this.props.onErrorStep;

  //     log.info('ErrorStep Init');

  //     if (onErrorStep && onErrorStep.call) {
  //       log.info('Call parent onErrorStep');
  //       onErrorStep();
  //     }

  //     log.info('ErrorStep Init Complete');
  //     return Promise.resolve();
  //   },
  //   // render: () => {
  //   //   log.info('Error step render');
  //   //   return (
  //   //     <View style={this.style}>
  //   //       <View style={{flex: 1, padding: 20}}>
  //   //         <Text
  //   //           style={{
  //   //             marginTop: 200,
  //   //             textAlign: 'center',
  //   //             ...AppFonts.bodyTextLarge,
  //   //             color: 'white',
  //   //           }}>
  //   //           An error occurred while recording.
  //   //         </Text>
  //   //         <Text
  //   //           style={{
  //   //             marginTop: 12,
  //   //             textAlign: 'center',
  //   //             ...AppFonts.bodyTextNormal,
  //   //             color: 'white',
  //   //           }}>
  //   //           Please try again.
  //   //         </Text>
  //   //         <ScreenFooterButton
  //   //           hideGradient
  //   //           title="Continue"
  //   //           onPress={this.errorStep.onComplete.bind(this)}
  //   //         />
  //   //       </View>
  //   //     </View>
  //   //   );
  //   // },
  //   onComplete: () => {
  //     log.info('ErrorStep, OnComplete');

  //     if (this.props.onComplete && this.props.onComplete.call) {
  //       this.props.onComplete(false, null);
  //     }
  //   },
  // };

  const startRender = () => {
    Alert.alert('hi');
    let footerButton = <View />;
    let showCountdown = false;
    let showQuestion = true;
    // let showPublisher = !!this.props.videoStore.sessionId;
    let showActivity = false;

    if (state?.currentStep?.stepState?.mode == 'waiting') {
      showCountdown = true;
      footerButton = (
        <View style={recorderStyle.footer}>
          <ActionButton
            title={actionButton.title}
            customStyle={recorderStyle.btnEnable}
            onPress={actionButton.onPress}
          />
        </View>
        // <ScreenFooterButton
        //   hideGradient
        //   title="Start Recording"
        //   onPress={() => {
        //     this.recordStep.onComplete();
        //   }}
        // />
      );
    }

    // if (this.recordStep.stepState.mode === 'recording-start') {
    //   showActivity = true;
    //   showQuestion = false;
    //   footerButton = <View />;
    // }

    // if (this.recordStep.stepState.mode === 'recording') {
    //   showCountdown = true;
    //   footerButton = (
    //     <ScreenFooterButton
    //       danger
    //       hideGradient
    //       title="Stop Recording"
    //       onPress={() => {
    //         this.recordStep.onComplete();
    //       }}
    //     />
    //   );
    // }

    // if (this.recordStep.stepState.mode === 'recording-ending') {
    //   showQuestion = false;
    //   showPublisher = false;
    //   showActivity = true;
    // }

    // if (this.recordStep.stepState.mode === 'recording-end') {
    //   showPublisher = false;
    //   showQuestion = false;
    // }
    // return (
    //   <View style={this.style}>
    //     {showPublisher && (
    //       <Publisher
    //         style={recorderStyle.publisher}
    //         ref={i => (this._publisher = i)}
    //         sessionId={videoStore.sessionId}
    //       />
    //     )}
    //     {showActivity && this.renderActivity()}
    //     {footerButton}
    //   </View>
    // );
  };

  // if (!!currentStep) {
  //   return state.currentStep.startRender();
  // }

  // renderActivity() {
  //   return (
  //     <ActivityIndicator color={AppColors.blue} style={absolutePosition} />
  //   );
  // }

  return <View style={props.style} />;
};

const absolutePosition = {
  position: 'absolute' as 'absolute' | 'relative',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  height: AppSizes.screen.height,
  width: AppSizes.screen.width,
  alignItems: 'center' as FlexAlignType,
};

const recorderStyle = StyleSheet.create({
  publisher: {
    ...absolutePosition,
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
});
