

import React from 'react'
import { StyleSheet, View, ViewProperties, FlexAlignType, ActivityIndicator, StatusBar } from 'react-native'
import { Text } from 'native-base'
import { ScreenFooterButton, ConexusVideoPlayer, QuestionPlaybackHeader } from '../../../components'
import { ConexusLightbox } from '../../../lightboxes'
// import { observer, inject } from 'mobx-react'
// import { Actions } from 'react-native-router-flux'
import { logger } from 'react-native-logs'
import { AppColors, AppSizes } from '../../../theme'
import { VideoStore } from '../../../stores'
// import { Publisher } from 'react-native-opentok'

import LinearGradient from 'react-native-linear-gradient'
const log = logger.createLogger()
interface CatalogVideoContainerProps extends ViewProperties {
    text: string,
    onSave: (archiveId: string) => void,
    onError: (error: string) => void,
    onClose: () => void,
    videoStore?: VideoStore
}

interface CatalogVideoContainerState {
    stepIndex: number,
    videoUrl: string,
    archiveId: string,
    counterValue: number,
    saving: boolean,
    closeable,
    hasPlayerError: boolean
}

interface Step {
    stepState?: { [key: string]: any },
    counterTitle: string,
    initStep: () => any,
    render: () => any,
    onComplete: () => any
}


export class CatalogVideoContainer extends React.Component<CatalogVideoContainerProps, CatalogVideoContainerState> {
    // private _publisher: Publisher;
    private steps: Array<any> = [];

    get currentStep(): Step {
        const { stepIndex } = this.state
        return this.steps[stepIndex];
    }

    get style(): any[] {
        return [this.props.style, { backgroundColor: AppColors.black }]
    }

    constructor(props: CatalogVideoContainerProps, state: CatalogVideoContainerState) {
        super(props, state)

        this.state = {
            videoUrl: '',
            stepIndex: 0,
            archiveId: '',
            counterValue: 0,
            saving: false,
            closeable: true,
            hasPlayerError: false
        }
    }

    componentDidMount() {
        this.initSteps()
    }

    componentWillMount() {
        StatusBar.setHidden(true)
    }

    componentWillUnmount() {
        StatusBar.setHidden(false)
        this.clearCounter()
        // this._publisher = null
    }

    handleVideoPlayerActionButton() {

    }

    initSteps() {

        log.info('CatalogVideoContainer', 'initSteps');

        this.steps = [];
        const self = this;

        const playStep: Step = {
            counterTitle: '',
            initStep: () => {
                log.info('CatalogVideoContainer', 'playStep', 'initStep');
                this.setState({closeable: true})
                return Promise.resolve()
            },
            render: () => {
                return (
                    <View style={[{ flex: 1 }, this.style]}>
                        <ConexusVideoPlayer style={styles.player}
                            mediaUrl={self.state.videoUrl}
                            onError={(error) => {
                                log.info('Catalog-Video-Container - Video Play Error', error);
                                this.setState({ hasPlayerError: true })
                            }}
                            volumeLocation="top-left"
                            overlayFooterStyle={styles.overlayButton}
                            pausable={true}
                            actionButton={() => {
                                if (self.state.hasPlayerError) {
                                    return {
                                        title: 'Cancel',
                                        onPress: () => {
                                            // Actions.pop();
                                        },
                                        showOnError: true,
                                    }
                                }

                                return {
                                    title: 'Save',
                                    onPress: () => {
                                        this.setState({ saving: true }, () => {
                                            this.props.onSave(this.state.archiveId);
                                        })

                                    },
                                    showOnError: true,
                                }
                            }}
                            // replayTitle="Play"
                            menuButtons={[
                                { title: 'Re-Record', onPress: () => { self.goFirstStep() }, showOnError: false, },
                                { title: 'Cancel', onPress: () => 
                                { 
                                    // Actions.pop() 
                                } 
                            }
                            ]}
                            showActionsOnEnd={true}
                            renderPlayOverlay={() => {
                                return <LinearGradient style={styles.header} colors={['rgba(0, 0, 0, .4)', 'rgba(0, 0, 0, 0)']}>
                                    <Text style={styles.questionText}>{self.props.text}</Text>
                                </LinearGradient>
                            }}
                        />
                        {/* {self.renderQuestionHeader(false)} */}
                    </View>
                )
            },
            onComplete: () => {
                self.goNextStep()
            }
        }

        const recordStep = {
            counterTitle: '',
            stepState: {
                mode: 'waiting',
                recording: false
            },
            initStep: () => {
                log.info('CatalogVideoContainer', 'recordStep', 'initStep');
                recordStep.stepState.mode = 'waiting';

                return this.props.videoStore
                    .initVideoSession()
                    .then((response) => {
                        log.info('CatalogVideoContainer', 'recordStep', 'initVideoSession complete', response);

                        // Once we have a session, we will show the publisher
                        this.setState({ closeable: true }, this.forceUpdate);

                    })
                    .catch(error => {
                        log.info('CatalogVideoContainer', 'recordStep', 'initVideoSession error', error);

                        // Stop Countdown here and allow retry?
                        self.clearCounter()
                        self.props.onError(error)
                    })

            },
            onComplete: () => {
                log.info('CatalogVideoContainer', 'recordStep', 'onComplete');

                if (recordStep.stepState.mode === 'waiting') {
                    recordStep.stepState.mode = 'recording-start';

                    this.setState({ closeable: false }, () => {
                        log.info('CatalogVideoContainer', 'calling videoStore.recordSession()');

                        this.props.videoStore
                            .recordSession()
                            .then(() => {
                                log.info('CatalogVideoContainer', 'recordSessionComplete');

                                // Once we have a session, we will show the publisher
                                recordStep.stepState.mode = 'recording';
                                recordStep.counterTitle = 'Elaspsed Time'
                                self.clearCounter()
                                self.beginCounter()
                            })
                            .catch(error => {
                                log.info('CatalogVideoContainer', 'recordSession error', error);

                                self.clearCounter()
                                self.props.onError(error)
                            })
                    })



                } else {
                    recordStep.stepState.mode = 'recording-ending';
                    self.clearCounter()

                    log.info('CatalogVideoContainer', 'calling videoStore.stopRecordingSession()');

                    this.props.videoStore.stopRecordingSession()
                        .then(
                            (archive: any) => {
                                log.info('CatalogVideoContainer', 'stopRecordingSession complete', archive);

                                recordStep.stepState.mode = 'recording-end';

                                this.setState({ archiveId: archive.Id, videoUrl: archive.Url }, () => {
                                    self.goNextStep()
                                })

                            }, (error) => {
                                log.info('CatalogVideoContainer', 'stopRecordingSession error', error);
                                self.clearCounter()
                                self.props.onError && this.props.onError(error)
                            })
                }

                return void 0;
            },
            render: () => {
                let footerButton = <View />
                let showCounter = false
                let showQuestion = true
                let showPublisher = !!this.props.videoStore.sessionId
                let showActivity = false

                if (recordStep.stepState.mode === 'waiting') {
                    showActivity = !showPublisher

                    if (showPublisher) {
                        footerButton = <ScreenFooterButton hideGradient title="Start Recording" onPress={() => {
                            self.clearCounter();
                            recordStep.onComplete()
                        }} />
                    }
                }

                if (recordStep.stepState.mode === 'recording-start') {
                    showActivity = true
                    showQuestion = false
                    footerButton = <View />
                }

                if (recordStep.stepState.mode === 'recording') {
                    showCounter = true;
                    footerButton = <ScreenFooterButton danger hideGradient title="End Recording" onPress={() => {
                        self.clearCounter();
                        recordStep.onComplete()
                    }} />
                }

                if (recordStep.stepState.mode === 'recording-ending') {
                    showQuestion = false
                    showPublisher = false
                    showActivity = true
                }

                if (recordStep.stepState.mode === 'recording-end') {
                    showPublisher = false
                    showQuestion = false
                }

                return (
                    <View style={[{ flex: 1 }, this.style]}>
                        {/* {showPublisher && <Publisher style={recordingStyleStyle.publisher} ref={(i) => this._publisher = i} sessionId={this.props.videoStore.sessionId} />}
                        {/* {self.renderQuestionHeader(showCounter)} */}
                        {showQuestion && this.renderQuestion()}
                        {showActivity && this.renderActivity()}
                        {footerButton} */}
                    </View>
                )
            },
        }

        this.steps.push(recordStep)
        this.steps.push(playStep)

        this.goFirstStep()
    }

    goNextStep() {
        const { stepIndex } = this.state
        const nextStep = this.steps[stepIndex + 1];

        if (nextStep) {
            nextStep.initStep()
            this.setState({ stepIndex: stepIndex + 1 })
        }
    }

    goFirstStep() {
        this.clearCounter()
        this.steps[0].initStep()
        this.setState({ stepIndex: 0 })
    }

    counterHandle: number;

    clearCounter() {
        log.info('CatalogVideoContainer', 'ClearCounter')
        clearTimeout(this.counterHandle);
        this.setState({ counterValue: 0 })
    }

    beginCounter() {
        this.counterHandle = setTimeout(() => {
            this.setState({ counterValue: this.state.counterValue + 1 })
            this.beginCounter()
        }, 1000)
    }

    renderQuestion() {
        const { text } = this.props

        return (
            <LinearGradient style={{height: 240, position: 'absolute', top: 0, left: 0, right: 0}} colors={['rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 0)']}>
                <Text style={styles.questionTextBg}>{text}</Text>
                <Text style={styles.questionText}>{text}</Text>
            </LinearGradient>
        )
    }

    renderActivity() {
        return <ActivityIndicator color={AppColors.blue} style={absolutePosition} />
    }

    // renderQuestionHeader(showCountdown) {
    //     const { counterValue } = this.state;

    //     return (
    //         <QuestionPlaybackHeader
    //             showAvatar={false}
    //             showCountdown={showCountdown}
    //             countdownTitle={this.currentStep.counterTitle}
    //             countdownDescription={counterValue.toString()} />
    //     )
    // }

    render() {
        const { saving, closeable } = this.state;

        return (
            <ConexusLightbox hideHeader horizontalPercent={1} verticalPercent={1} closeable={closeable} transparentHeader style={{flex: 1}}>
                {saving &&
                    <View style={[{ flex: 1 }, this.style]}>
                        {this.renderActivity()}
                    </View>
                }
                {!saving && !!this.currentStep && this.currentStep.render()}
            </ConexusLightbox>
        )
    }
}

const absolutePosition = {
    position: "absolute" as 'absolute' | 'relative',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center' as FlexAlignType
}

const recordingStyleStyle = StyleSheet.create({
    publisher: {
        flex: 1,
        //...absolutePosition
    }
})

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        height: '40%',
    },
    questionText: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        color: AppColors.white,
        backgroundColor: 'rgba(0,0,0,0)',
        textAlign: 'center'
    },
    questionTextBg: {
        position: 'absolute',
        top: 61,
        left: 21,
        right: 19,
        color: 'rgba(0,0,0,.87)',
        backgroundColor: 'rgba(0,0,0,0)',
        textAlign: 'center'
    },
    player: {
        ...absolutePosition,
    },
    overlayButton: {
        marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0
    }
})