import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Alert, StatusBar, Platform } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import { ConexusIconButton, ScreenFooterButton, Circle } from '../../../components'
import { ConexusLightbox} from '../../../lightboxes'
import { InterviewQuestionStore, NurseSubmissionsStore, NurseSubmissionModel, InterviewQuestionModel, } from '../../../stores'
import { AppColors, AppFonts } from '../../../theme'
import { InterviewComplete } from './components/interview-complete'
import { QuestionAnswerRecorder } from './components/question-answer-recorder'
import { logger } from 'react-native-logs'
import InCallManager from 'react-native-incall-manager'
const log = logger.createLogger()
export interface NurseInterviewProps {
    submissionId: string,
    nurseSubmissionsStore: typeof NurseSubmissionsStore.Type,
    onClose?: () => any    
}


export interface NurseInterviewState {
    loading: boolean,
    closeable: boolean,
    introDisplayed: boolean,
    questionIndex: number,
    interviewComplete: boolean,
    showIntro: boolean
}

@inject('nurseSubmissionsStore')
@observer
export class NurseInterview extends React.Component<NurseInterviewProps, NurseInterviewState> {

    private questionStore: typeof InterviewQuestionStore.Type = InterviewQuestionStore.create({})
    private submission: typeof NurseSubmissionModel.Type

    get currentQuestion(): typeof InterviewQuestionModel.Type {
        const { questionIndex, interviewComplete } = this.state

        if (questionIndex < 0 || interviewComplete) {
            return null
        }

        return this.questionStore.questions[questionIndex]
    }

    get questionCount(): number {
        return this.questionStore.questions.length
    }

    get maxThinkSeconds() : number {
        if (this.questionStore.questions.length) {
            return this.questionStore.questions[0].maxThinkSeconds
        }

        return 0
    }

    get maxAnswerLengthSeconds() : number {
        if (this.questionStore.questions.length) {
            return this.questionStore.questions[0].maxAnswerLengthSeconds
        }

        return 0
    }

    constructor(props, state) {
        super(props, state)

        this.state = {
            loading: false,
            closeable: false,
            introDisplayed: false,
            questionIndex: -1,
            interviewComplete: false,
            showIntro: false
        }
    }

    componentDidMount() {
        this.loadQuestions()
    }

    componentWillMount() {
        const { submissionId, nurseSubmissionsStore } = this.props
        this.submission = nurseSubmissionsStore.availableInterviews.find(i => i.submissionId === submissionId)
        StatusBar.setHidden(true)
        InCallManager.setKeepScreenOn(true)
    }

    componentWillUnmount() {
        this.props.nurseSubmissionsStore.load().then(() => {
            StatusBar.setHidden(false)
        }, (error) => {
            StatusBar.setHidden(false)
            log.info('NurseSubmissionStore Error', error)
        })

        if (this.props.onClose && this.props.onClose.call) {
            this.props.onClose()
        }
        InCallManager.setKeepScreenOn(false)
    }

    loadQuestions() {
        this.setState({ loading: true })

        this.questionStore.load(this.submission.submissionId)
            .then(() => {
                this.setState({ loading: false }, this.goNextStep.bind(this))
            },
            (error) => {
                log.info(error)
                this.setState({ loading: false })
                Alert.alert("Error", "An error occurred while loading the interview. Please try again.")
                Actions.pop()
            })
    }

    goNextStep() {
        const { questionIndex, introDisplayed, interviewComplete } = this.state
        const nextState = { questionIndex: questionIndex + 1, closeable: false }

        log.info('nurse-interview: goNextStep')

        // No Questions -- Should never happen.  Previous screen should protect
        if (this.questionCount === 0) {
            Alert.alert('No Questions Available')
            Actions.pop()
        }

        // Before First Question 
        if (questionIndex === -1) {

            if (interviewComplete) {
                // Do nothing, stay on current step
                return
            }

            if (!introDisplayed) {
                this.setState({ showIntro: true })
                return
            }

            // GoTo first question
            this.setState(nextState)
            return
        }

        // On Last Question
        if (questionIndex == this.questionCount - 1) {
            this.setState({ interviewComplete: true, questionIndex })
            return
        }

        // On Question
        // for one cycle set question index = -1. This will force the question answer recorder to 
        // re-init instead of the existing instance being used.
        this.setState({ questionIndex: -1 }, () => {
            this.setState(nextState)
        })

        return
    }

    onAnswerError(error) {
        // Add any additional error handling here based on the error
        // The control display an error page

    }


    onAnswerComplete(archiveId) {
        log.info('Answer complete, calling save', archiveId)
        this.currentQuestion.saveVideoAnswer(this.submission.submissionId, archiveId)
            .then(() => {
                // Do nothing, recorder will display break
            })
            .catch((error) => {
                log.info('SAVE ANSWER ERROR', error)
                this.goNextStep()
            })
    }

    renderLoading() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={AppColors.blue} />
                </View>
            </View>
        )
    }


    renderHeader() {
        const { questionIndex, closeable } = this.state
        const questionCount = this.questionStore.questions.length

        return (
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{this.submission.facilityName}</Text>
                    {closeable && <ConexusIconButton style={styles.icon} iconName="cn-x" iconSize={16} onPress={() => { Actions.pop() }} />}
                </View>
                <View style={styles.modalSubheader}>
                    <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                        <Text style={styles.modalSubheaderText}>{this.submission.position.display.title}</Text>
                        {questionIndex > -1 && <Text style={styles.stepText}>{questionIndex + 1} of {questionCount}</Text>}
                    </View>
                </View>
            </View>
        )
    }

    renderIntro() {
        return <View style={{ padding: 0, backgroundColor: AppColors.baseGray, position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}>
            <Text style={introStyle.headerIntro}>You have {this.questionCount} virtual interview question{this.questionCount != 1 ? 's' : '' } to answer.</Text>
            <Text style={introStyle.header}>Here's how it will work:</Text>

            <Circle size={28} color={AppColors.blue} style={introStyle.circle}><Text style={introStyle.circleText}>1</Text></Circle>
            <Text style={introStyle.stepHeader}>VIEW QUESTION</Text>
            <Text style={introStyle.stepBody}>A video question will be played, and the written question will remain on your screen.</Text>

            <Circle size={28} color={AppColors.blue} style={introStyle.circle}><Text style={introStyle.circleText}>2</Text></Circle>
            <Text style={introStyle.stepHeader}>COUNTDOWN</Text>
            <Text style={introStyle.stepBody}>You will be given a {this.maxThinkSeconds} second countdown to allow you time to think about your answer.</Text>

            <Circle size={28} color={AppColors.blue} style={introStyle.circle}><Text style={introStyle.circleText}>3</Text></Circle>
            <Text style={introStyle.stepHeader}>RECORD RESPONSE</Text>
            <Text style={introStyle.stepBody}>Record a video response of no more than {this.maxAnswerLengthSeconds} second{this.maxAnswerLengthSeconds != 1 ? 's' : '' } before moving to the next question.</Text>

            <ScreenFooterButton title="START INTERVIEW" onPress={() => this.setState({ showIntro: false, introDisplayed: true }, this.goNextStep.bind(this))} />
        </View>
    }

    _renderInterview() {
        let { questionIndex, interviewComplete, introDisplayed, loading } = this.state
        const lastQuestion = this.questionCount <= questionIndex + 1
        log.info('Last Question: ' + lastQuestion)

        return (
            <ConexusLightbox hideHeader  horizontalPercent={1} verticalPercent={1} style={styles.container}>
                {loading && this.renderLoading()}
                
                {!loading && !introDisplayed && this.renderIntro()}
                
                {introDisplayed && !interviewComplete && this.renderHeader()}
                {introDisplayed && !interviewComplete && !!this.currentQuestion &&
                    <View style={styles.contentContainer}>
                        <QuestionAnswerRecorder
                            style={{ flex: 1 }}
                            questionUrl={this.currentQuestion.questionUrl}
                            questionText={this.currentQuestion.questionText}
                            createdByName={this.currentQuestion.createdByFirstName + ' ' + this.currentQuestion.createdByLastName}
                            createdByTitle={this.currentQuestion.createdByTitle}
                            createdByUrl={''}
                            hideBreak={lastQuestion}
                            thinkSeconds={this.currentQuestion.maxThinkSeconds}
                            answerLengthSeconds={this.currentQuestion.maxAnswerLengthSeconds}
                            onPlayStep={() => this.setState({ closeable: false })}
                            onAnswerStep={() => this.setState({ closeable: false })}
                            onBreakStep={() => this.setState({ closeable: true })}
                            onErrorStep={() => this.setState({ closeable: true })}
                            onComplete={(result, data) => {
                                this.goNextStep()
                            }}
                            onAnswerComplete={this.onAnswerComplete.bind(this)}
                            onAnswerError={this.onAnswerError.bind(this)} />
                    </View>
                }
                {introDisplayed && interviewComplete &&
                    <View style={{ flex: 1 }}>
                        <InterviewComplete submission={this.submission} />
                    </View>
                }
            </ConexusLightbox>
        )
    }

    render() {
        if (this.submission) {
            return this._renderInterview()
        }

        return <View />
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0
    },
    contentContainer: {
        flex: 1,
        backgroundColor: AppColors.black
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
        flex: 1
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
        paddingRight: 18
    },
    modalSubheaderText: {
        color: AppColors.white,
        fontWeight: '500',
        flex: 1
    }
})

const introStyle = StyleSheet.create({
    header: { 
        marginTop: 30, 
        paddingHorizontal: 30,
        textAlign: 'center', 
        ...AppFonts.bodyTextLarge, 
        color: AppColors.darkBlue,
        fontWeight: '700',
        marginBottom: 20
    },
    headerIntro: { 
        marginTop: 30, 
        paddingHorizontal: 30,
        textAlign: 'center', 
        ...AppFonts.bodyTextXtraXtraLarge, 
        color: AppColors.blue,
        fontWeight: '700',

    },
    

    circle: {
        marginTop: 28,
        backgroundColor: AppColors.blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    circleText: {
        ...AppFonts.bodyTextXtraLarge,
        color: AppColors.white,
        fontWeight: '700',
        // 
        paddingTop: Platform.OS === 'ios' ? 5 : 0
    },
    stepHeader: {
        ...AppFonts.bodyTextLarge,
        textAlign: 'center',
        paddingHorizontal: 30,
        fontWeight: '700',
        color: AppColors.blue,
        marginTop: 8
    },
    stepBody: {
        ...AppFonts.bodyTextNormal,
        textAlign: 'center', 
        paddingHorizontal: 30 
    }
})