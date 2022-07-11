import React from 'react'
import { StyleSheet, View, ViewProperties, FlexAlignType, ActivityIndicator, ViewStyle } from 'react-native'
import { Text } from 'native-base'
import { ScreenFooterButton } from '../components'
import { observer, inject } from 'mobx-react'
import { logger } from 'react-native-logs'
import { AppFonts, AppColors, AppSizes } from '../theme'
import { VideoStore } from '../stores'
// import { Publisher } from 'react-native-opentok'

interface ConexusVideoRecorderProps extends ViewProperties {
    onRecordComplete?: (archiveId: string, videoUrl: string) => any,
    onRecordError?: (error) => any,
    onRecordStart?: () => any,

    onRecordStep?: () => any,
    onErrorStep?: () => any,
    videoStore?: VideoStore,
    onComplete: (success, data: any) => any
}

interface VideoRecorderState {
    currentStep: Step
}

interface Step {
    stepState?: { [key: string]: any },
    initStep: () => Promise<any>,
    render: () => any,
    onComplete: () => any
}
const log = logger.createLogger()
@inject('videoStore')
@observer
export class ConexusVideoRecorder extends React.Component<ConexusVideoRecorderProps, VideoRecorderState> {
    // private _publisher: Publisher;

    private readonly recordStep: Step = {
        stepState: {
            mode: 'waiting'
        },
        initStep: () => {
            log.info('ConexusVideoRecorder', 'Starting recording process');

            const onRecordStep = this.props.onRecordStep
            if (onRecordStep && onRecordStep.call) {
                onRecordStep()
            }

            this.recordStep.stepState.mode = 'waiting';

            return Promise.resolve()
        },
        onComplete: () => {

            if (this.recordStep.stepState.mode === 'waiting') {
                log.info('ConexusVideoRecorder', 'Setting recordset mode to "recording-start"');
                this.recordStep.stepState.mode = 'recording-start';

                if (this.props.onRecordStart && this.props.onRecordStart.call) {
                    log.info('ConexusVideoRecorder', 'Calling this.props.onRecordStart');

                    this.props.onRecordStart()
                }

                log.info('ConexusVideoRecorder', 'Calling force update');

                this.forceUpdate(() => {

                    log.info('ConexusVideoRecorder', 'Calling this.props.videoStore.recordSession()');

                    this.props.videoStore
                        .recordSession()
                        .then(() => {
                            log.info('ConexusVideoRecorder', 'Setting this.recordStep.stepState.mode to "recording"');

                            // Once we have a session, we will show the publisher
                            this.recordStep.stepState.mode = 'recording';

                            this.forceUpdate()
                        })
                        .catch(error => {
                            this.props.onRecordError(error)
                            this.goNextStep(this.errorStep)
                        })
                })

            } else {
                log.info('ConexusVideoRecorder', 'Setting this.recordStep.stepState.mode to "recording-ending"');
                this.recordStep.stepState.mode = 'recording-ending';

                log.info('ConexusVideoRecorder', 'Forcing update');

                this.forceUpdate(() => {
                    log.info('ConexusVideoRecorder', 'Telling videostore to stop recording');

                    this.props.videoStore.stopRecordingSession()
                        .then((archive: any) => {
                            this.forceUpdate()

                            if (this.props.onRecordComplete && this.props.onRecordComplete.call) {
                                log.info('ConexusVideoRecorder', 'Calling this.props.onRecordComplete', archive.id, archive.Url);
                                this.props.onRecordComplete(archive.Id, archive.Url)
                            }

                            if (this.props.onComplete && this.props.onComplete.call) {
                                log.info('ConexusVideoRecorder', 'Calling this.props.onComplete', true, null);
                                this.props.onComplete(true, null);
                            }

                        }, (error) => {
                            log.info('ConexusVideoRecorder', 'Error', error);

                            if (this.props.onRecordError && this.props.onRecordError.call) {
                                log.info('ConexusVideoRecorder', 'Calling this.props.onRecordError', error);
                                this.props.onRecordError(error)
                            }


                            this.goNextStep(this.errorStep)
                        })
                })

            }

            return void 0;
        },
        render: () => {
            let footerButton = <View />
            let showCountdown = false
            let showQuestion = true
            let showPublisher = !!this.props.videoStore.sessionId
            let showActivity = false

            if (this.recordStep.stepState.mode === 'waiting') {
                showCountdown = true;
                footerButton = <ScreenFooterButton hideGradient title="Start Recording" onPress={() => {
                    this.recordStep.onComplete()
                }} />
            }

            if (this.recordStep.stepState.mode === 'recording-start') {
                showActivity = true
                showQuestion = false
                footerButton = <View />
            }

            if (this.recordStep.stepState.mode === 'recording') {
                showCountdown = true;
                footerButton = <ScreenFooterButton danger hideGradient title="Stop Recording" onPress={() => {
                    this.recordStep.onComplete()
                }} />
            }

            if (this.recordStep.stepState.mode === 'recording-ending') {
                showQuestion = false
                showPublisher = false
                showActivity = true
            }

            if (this.recordStep.stepState.mode === 'recording-end') {
                showPublisher = false
                showQuestion = false
            }
            const { videoStore } = this.props
            return (
                <View style={this.style}>
                    {/* {showPublisher && <Publisher style={recorderStyle.publisher} ref={(i) => this._publisher = i} sessionId={videoStore.sessionId} />}
                    {showActivity && this.renderActivity()}
                    {footerButton} */}
                </View>
            )
        },
    }

    private readonly errorStep: Step = {
        initStep: () => {
            const onErrorStep = this.props.onErrorStep

            log.info("ErrorStep Init")

            if (onErrorStep && onErrorStep.call) {
                log.info("Call parent onErrorStep")
                onErrorStep()
            }

            log.info('ErrorStep Init Complete')
            return Promise.resolve()
        },
        render: () => {
            log.info('Error step render')
            return (
                <View style={this.style}>
                    <View style={{ flex: 1, padding: 20 }}>
                        <Text style={{ marginTop: 200, textAlign: 'center', ...AppFonts.bodyTextLarge, color: 'white' }}>An error occurred while recording.</Text>
                        <Text style={{ marginTop: 12, textAlign: 'center', ...AppFonts.bodyTextNormal, color: 'white' }}>Please try again.</Text>
                        <ScreenFooterButton hideGradient title="Continue" onPress={this.errorStep.onComplete.bind(this)} />
                    </View>
                </View>
            )
        },
        onComplete: () => {
            log.info('ErrorStep, OnComplete')

            if (this.props.onComplete && this.props.onComplete.call) {
                this.props.onComplete(false, null)
            }
        }
    }


    get currentStep(): Step {
        return this.state.currentStep;
    }

    get style(): any[] {
        return [this.props.style, { backgroundColor: AppColors.black }]
    }

    constructor(props: ConexusVideoRecorderProps, state: VideoRecorderState) {
        super(props, state)

        this.state = {
            currentStep: null
        }
    }

    componentDidMount() {
        this.goNextStep(this.recordStep)
    }

    componentWillUnmount() {

    }

    goNextStep(nextStep: Step) {
        setTimeout(() => {
            if (nextStep) {
                nextStep.initStep()
                    .then(() => {
                        this.setState({ currentStep: nextStep })
                    },
                        () => {
                            this.errorStep.initStep()
                                .then(() => {
                                    this.setState({ currentStep: this.errorStep })
                                },
                                    (error) => {
                                        // Well we tried!   
                                        log.info("Conexus Video Recorder", "ERROR", error)
                                    })
                        })

            }
        }, 0)
    }

    renderActivity() {
        return <ActivityIndicator color={AppColors.blue} style={absolutePosition} />
    }

    render() {
        if (!!this.currentStep) {
            return this.currentStep.render()
        }

        return (
            <View style={this.style} />
        )
    }
}

const absolutePosition = {
    position: "absolute" as 'absolute' | 'relative',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    alignItems: 'center' as FlexAlignType
}

const recorderStyle = StyleSheet.create({
    // publisher: {
    //     ...absolutePosition
    // }
})