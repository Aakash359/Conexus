import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlexAlignType,
  ActivityIndicator,
  ViewStyle,
  Alert,
} from 'react-native';
import {ActionButton} from '../components';

import {AppFonts, AppColors, AppSizes} from '../theme';
import {VideoStore} from '../stores';
import {Publisher, OpenTok} from 'react-native-opentok';
import {windowDimensions} from '../common';

interface ConexusVideoRecorderProps {
  onRecordComplete?: (archiveId: string, videoUrl: string) => any;
  onRecordError?: (error: any) => any;
  onRecordStart?: () => any;
  style: any;
  onRecordStep?: () => any;
  onErrorStep?: () => any;
  videoStore?: VideoStore;
  onComplete: (success: any, data: any) => any;
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
  const {SessionId, SessionToken} = props;
  const cameraRef = useRef(null);
  const style = (): any[] => {
    return [props.style, {backgroundColor: AppColors.black}];
  };

  const setSessionId = (sessionId: string) => {
    return sessionId;
  };

  const currentSteps = (): Step => {
    return state.currentStep;
  };

  const videoRecord = async () => {
    if (cameraRef && cameraRef.current) {
      cameraRef.current.open({maxLength: 30}, data => {
        console.log('captured data', data); // data.uri is the file path
      });
    }
  };
  const initStep = (nextStep: Step) => {
    const stepState = {
      mode: 'waiting',
    };
    const onRecordStep = props.onRecordStep;
    if (onRecordStep && onRecordStep.call) {
      onRecordStep();
    }
    stepState.mode = 'waiting';
    return (
      <>
        <View style={{flex: 1, backgroundColor: 'red'}}>
          <Text>{stepState.mode}</Text>
        </View>
      </>
    );
  };

  const renderActivity = () => {
    return (
      <ActivityIndicator color={AppColors.blue} style={absolutePosition} />
    );
  };

  const startRender = () => {
    let footerButton = <View style={{flex: 1}} />;
    let showCountdown = false;
    let showQuestion = true;
    let showPublisher = SessionId;
    let showActivity = false;
    const stepState = {
      mode: 'waiting',
    };
    if (stepState.mode == 'waiting') {
      showCountdown = true;
      footerButton = (
        <View style={recorderStyle.footer}>
          <ActionButton
            title="START RECORDING"
            customTitleStyle={{fontSize: 16}}
            onPress={() => videoRecord()}
            customStyle={recorderStyle.btnEnable}
          />
        </View>
      );
      return footerButton;
    }
    if (stepState.mode === 'recording-start') {
      showActivity = true;
      showQuestion = false;
      footerButton = <View />;
      return footerButton;
    }

    if (stepState.mode === 'recording') {
      showCountdown = true;
      footerButton = (
        <View style={recorderStyle.footer}>
          <ActionButton
            title="STOP RECORDING"
            customTitleStyle={{fontSize: 16}}
            //  onPress={() => recordQuestion()}
            customStyle={recorderStyle.btnEnable}
          />
        </View>
      );
      return footerButton;
    }

    if (stepState.mode === 'recording-ending') {
      showQuestion = false;
      showPublisher = false;
      showActivity = true;
    }

    if (stepState.mode === 'recording-end') {
      showPublisher = false;
      showQuestion = false;
    }

    return (
      <View style={style}>
        {showPublisher && (
          <Publisher
            style={recorderStyle.publisher}
            // ref={i => (publisher = i)}
            sessionId={SessionId}
          />
        )}
        {showActivity && renderActivity()}

        {footerButton}
      </View>
    );
  };

  const recordStep = (nextStep: Step) => {
    return <>{(initStep(), startRender())}</>;
  };

  useEffect(() => {
    recordStep();
  }, []);

  return (
    <>
      {recordStep()}
      <View style={style} />
    </>
  );
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
