import React from 'react'
import { View, Text, StyleSheet, ViewProperties, Alert, AlertButton, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ConexusLightbox } from '../lightboxes/base-lightbox'
import { AppFonts, AppColors, AppSizes } from '../theme'
import { ConexusIcon } from '../components'
import { ConexusVideoPlayer, ConexusVideoActionButton, Circle } from '../components'
import { logger } from 'react-native-logs'
import LinearGradient from 'react-native-linear-gradient'
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager'
const log = logger.createLogger()
export interface AnswerRatingItem {
  id: string,
  initialIndex?: number,
  videoUrl: string,
  audioUrl: string,
  questionText: string,
  rating: -1 | 0 | 1,
  saveResponse: (id: string, rating: -1 | 0 | 1) => Promise<any>
}

interface AnswerRatingsLightboxProps extends ViewProperties {
  answers: AnswerRatingItem[],
  title: string
}

interface AnswerRatingsLightboxState {
  showPlayer: boolean,
  currentAnswerIndex: number,
  switchingQuestions: boolean,
  videoLoaded: boolean
}

export default class AnswerIndicator extends React.Component<{ answerRatingsLightbox: AnswerRatingsLightbox }, any> {
  constructor(props) {
    super(props, {})
  }

  render() {
    return <View />
  }

  settingCurrent: boolean = false

  onPageSelected = (e) => {
    if (this.settingCurrent) {
      return;
    }

    try {
      this.settingCurrent = true
      this.props.answerRatingsLightbox.setCurrentAnswer(e.position)
    }
    catch (error) {
      log.info('AnswerIndicator', 'Error', error)
    }
    finally {
      this.settingCurrent = false;
    }
  }
}

export class AnswerRatingsLightbox extends React.Component<AnswerRatingsLightboxProps, AnswerRatingsLightboxState> {

  pager: IndicatorViewPager

  get currentAnswerIndex(): number {
    return this.state.currentAnswerIndex;
  }

  get currentAnswer(): AnswerRatingItem {
    return this.props.answers[this.state.currentAnswerIndex];
  }

  get isLastAnswer(): boolean {
    return !!!this.props.answers[this.state.currentAnswerIndex + 1]
  }

  get switchingQuestions(): boolean {
    return this.state.switchingQuestions
  }

  get videoLoaded(): boolean {
    return this.state.videoLoaded
  }

  get count(): number {
    return this.props.answers.length
  }

  get subheaderTitle(): string {
    return `Response ${this.currentAnswerIndex + 1} of ${this.count}`
  }

  constructor(props, state) {
    super(props, state);

    this.state = {
      showPlayer: true,
      currentAnswerIndex: props.initialIndex || 0,
      switchingQuestions: false,
      videoLoaded: false
    };

    setTimeout(() => {
      if (this.pager) {
        this.pager.setPage(this.state.currentAnswerIndex)      
      }
    }, 100)
  }

  settingCurrent: boolean = false

  setCurrentAnswer(index: number) {
    if (this.settingCurrent) {
      return
    }

    try {
      this.settingCurrent = true

      if (this.pager) {
        this.pager.setPage(index)
      }

      this.setState({ currentAnswerIndex: index }, () => {
        this.settingCurrent = false;
      })
    }
    catch (error) {
      log.info('SetCurrentAnswer Error', error)
      this.settingCurrent = false;
    }
  }

  rateAndGoNext(rating: -1 | 0 | 1) {
    log.info('Setting Rating', rating)
    this.setState({ switchingQuestions: true, videoLoaded: false })
    this.currentAnswer.rating = rating

    this.currentAnswer.saveResponse(this.currentAnswer.id, this.currentAnswer.rating)
      .then(() => {
        this.setState({ switchingQuestions: false }, () => {
          this.goNext()
        });
      })
      .catch(error => {
        Alert.alert('Rating Error', 'An error occurred while saving your rating. Please try again.')
        this.setState({ switchingQuestions: false })
      })
  }

  goNext() {
    if (this.isLastAnswer) {
      log.info('Last Answer, closing')
      Actions.pop()
    } else {
      log.info('Going next answer')
      this.setCurrentAnswer(this.state.currentAnswerIndex + 1)
    }
  }

  componentWillMount() {
    StatusBar.setHidden(true)
  }

  componentWillUnMount() {
    StatusBar.setHidden(false)
  }

  onVideoLoad() {
    this.setState({ videoLoaded: true })
  }

  onError(error, code?: string) {
    this.setState({ showPlayer: false });

    //TODO: Might handle this better with a retry and cancel
    setTimeout(() => {
      const buttons: AlertButton[] = [
        { text: 'Retry', onPress: () => { this.setState({ showPlayer: true }) } },
        { text: 'Cancel', onPress: this.onCancel.bind(this) }
      ]

      Alert.alert(`We're Sorry`, `An error occurred while playing this video.${code ? ` (${code})` : ''}`, buttons);

    }, 0)
  }

  onClose() {
    StatusBar.setHidden(false)
    Actions.pop();
  }

  onCancel() {
    this.setState({ showPlayer: true }, () => {
      this.setState({ switchingQuestions: false })

      if (this.isLastAnswer) {
        log.info('Last Answer, closing')
        Actions.pop()
      } else {
        log.info('Going next answer')
        this.goNext()
      }
    })
  }

  menuButtons: ConexusVideoActionButton[] = []

  renderAnswer(answer: AnswerRatingItem, index: number) {
    return <View key={index.toString()} style={styles.answerCard}>

      {
        this.currentAnswerIndex === index &&
        <ConexusVideoPlayer
          mediaUrl={answer.videoUrl || answer.audioUrl}
          autoPlay={true}
          pausable={true}
          showActionsOnEnd={true}
          volumeLocation={'top-right'}
          hideErrorIcon={true}
          errorDisplayText="This response is currently unavailable."
          menuButtons={this.menuButtons}
          onLoad={this.onVideoLoad.bind(this)}
          overlayContentWithErrorStyle={{ justifyContent: 'flex-start', paddingTop: 80, marginBottom: 0 }}
          overlayContentStyle={{ justifyContent: 'flex-start', paddingTop: 180, marginBottom: 0 }}
          overlayFooterStyle={styles.overlayFooter}
        />
      }
<View style={styles.questionBox}>
          <Text style={styles.questionBg}>{answer.questionText}</Text>
          <Text style={styles.question}>{answer.questionText}</Text>
        </View>
      <View style={[styles.footer]}>
              
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => this.rateAndGoNext(-1)} style={styles.rateDown}>
            <Circle size={80} color={answer.rating === 1 || answer.rating === 0 ? 'transparent' : AppColors.red} style={[styles.actionCircle]}>
              <ConexusIcon name="cn-thumbs-down" size={40} color={AppColors.white} />
            </Circle>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.rateAndGoNext(1)} style={styles.rateUp} >
            <Circle size={80} color={answer.rating === -1 || answer.rating === 0 ? 'transparent' : AppColors.green} style={[styles.actionCircle]}>
              <ConexusIcon name="cn-thumbs-up" size={40} color={AppColors.white} />
            </Circle>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  }

  render() {
    const { title } = this.props
    const { showPlayer } = this.state

    const activityIndicator = (<ActivityIndicator style={{ flex: 1 }} color={AppColors.white} />)

    return (
      <ConexusLightbox
        title={title}
        adjustForTopTab
        headerStyle={{ backgroundColor: AppColors.white }}
        headerTextStyle={{ color: AppColors.blue }}
        verticalPercent={1}
        horizontalPercent={1}
        closeable style={styles.lightbox}>
        <View style={styles.modalSubheader}>
          <Text style={styles.modalSubheaderText}>{this.subheaderTitle}</Text>
        </View>
        <IndicatorViewPager
          ref={c => { this.pager = c }}
          indicator={<AnswerIndicator answerRatingsLightbox={this} />}
          style={[styles.pager]}>
          {this.props.answers.map((answer, index) => this.renderAnswer(answer, index))}
        </IndicatorViewPager>
      </ConexusLightbox>
    )
  }
}

const styles = StyleSheet.create({
  lightbox: {
    padding: 0,
    backgroundColor: AppColors.black
  },

  pager: {
    flex: 1
  },

  answerCard: {

  },

  modalSubheader: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingLeft: 18,
    paddingBottom: 8,
    paddingRight: 18,
  },

  modalSubheaderText: {
    ...AppFonts.bodyTextNormal,
    color: AppColors.white,
  },

  // videoPlayer: {
  //   flex: 1,
  //   zIndex: 0
  // },
  // lightbox: {
  //   padding: 0,
  //   backgroundColor: AppColors.black
  // },
  questionBox:{
    position: 'relative', 
    paddingBottom: 100, 
    paddingLeft: 20, 
    paddingRight: 20,
    top:60
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
    alignItems: 'flex-start'
  },
  actionCircle: {
    borderWidth: 1,
    borderColor: AppColors.white
  },
  rateUp: {
  },
  rateDown: {
  },
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0
  }
});