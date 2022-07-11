import React from 'react'
import { observer, inject } from 'mobx-react'
import { View, StyleSheet, ViewProperties } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ConexusLightbox } from './base-lightbox'
import { AppColors } from '../theme'
import { ScreenType } from '../common'
import { ConexusIconButton } from '../components'
import { CandidateModel } from '../stores/facility'
import { VideoStore } from '../stores/videoStore'
import { CommunicationType } from '../services/facility-service'

export interface ContactCandidateLightboxProps extends ViewProperties {
  candidate: typeof CandidateModel.Type,
  videoStore: VideoStore,
  onMessageSendCallback?: (conversationId: string) => any
}

@inject('videoStore')
@observer
export class ContactCandidateLightbox extends React.Component<ContactCandidateLightboxProps, any> {

  constructor(props: ContactCandidateLightboxProps) {
    super(props, {});
  }

  _call() {
    const { candidate } = this.props
    Actions.pop();

    setTimeout(() => {
      Actions.push(ScreenType.HCP_PHONE_CALL_LIGHTBOX, {
        submissionId: candidate.submissionId,
        photoUrl: candidate.photoUrl,
        photoLabel: candidate.photoLabel,
        title: candidate.display.title,
        description: candidate.display.description
      })
    }, 250);
  }

  _sendMessage() {
    const { candidate } = this.props
    Actions.pop();

    setTimeout(() => {
      Actions.push(ScreenType.MESSAGE_CENTER.CONVERSATION, {
        conversationId: candidate.conversationId,
        submissionId: candidate.submissionId, title: `${candidate.firstName} ${candidate.lastName}`,
        recipientName: `${candidate.firstName} ${candidate.lastName}`,
        recipientPhotoUrl: candidate.photoUrl,
        recipientUserId: candidate.userId,
        onMessageSendCallback: this.props.onMessageSendCallback
      })
    }, 250);
  }

  _videoMessage() {
    const { candidate } = this.props
    Actions.pop()

    setTimeout(() => {
      Actions[ScreenType.VIDEO_RECORDER_LIGHTBOX]({
        finishedButtonTitle: 'Send',
        videoMessage: true,
        conversationId: candidate.conversationId,
        submissionId: candidate.submissionId,
        onMessageSendCallback: this.props.onMessageSendCallback
      })
    }, 250)
  }

  _videoCall() {
    const { candidate, videoStore } = this.props
    Actions.pop()
    
    setTimeout(() => {
      videoStore.call(candidate.submissionId, candidate.userId, { name: candidate.firstName + ' ' + candidate.lastName, title: "", subTitle: candidate.display.description, photo: candidate.photoUrl })
    }, 250)
  }

  render() {
    let communicationTypes: CommunicationType[] = this.props.candidate.communicationTypes
    let videoChat = communicationTypes.filter(type => { return type.typeId == "1" })[0].available || false
    let videoCall = communicationTypes.filter(type => { return type.typeId == "2" })[0].available || false
    
    return (
      <ConexusLightbox title="Contact Options" closeable horizontalPercent={0.9}>
        <View style={styles.iconsContainer}>
          <View style={styles.iconRow1}>
            <View style={styles.iconContainerLeft}>
              <ConexusIconButton iconName="cn-phone" iconSize={32} title="Phone Call" onPress={this._call.bind(this)} />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton iconName="cn-chat-bubble-1" iconSize={32} title="Message" onPress={this._sendMessage.bind(this)} />
            </View>
          </View>
          <View style={styles.iconRow2}>
            <View style={styles.iconContainerLeft}>
              <ConexusIconButton iconName="cn-video-message" iconSize={32} title="Video Message" onPress={this._videoMessage.bind(this)} disabled={!videoCall} />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton iconName="cn-video" iconSize={32} title="Video Call" onPress={this._videoCall.bind(this)} disabled={!videoChat} />
            </View>
          </View>
        </View>
      </ConexusLightbox>
    )

  }
}

const styles = StyleSheet.create({
  iconsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  iconRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: AppColors.lightBlue,
  },
  iconRow2: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainerLeft: {
    padding: 12,
    width: '50%',
    height: '100%'
  },
  iconContainerRight: {
    padding: 12,
    borderLeftWidth: 1,
    borderColor: AppColors.lightBlue,
    width: '50%',
    height: '100%'
  }
});