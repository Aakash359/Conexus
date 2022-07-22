import React from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  Keyboard,
  EmitterSubscription,
  Animated,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  ViewProperties,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Text, View} from 'native-base';
const SafeAreaView = require('react-native').SafeAreaView;

let moment = require('moment');
import {ConexusIconButton, ConexusIcon, Circle} from '../../components';

import {ScreenType, showYesNoAlert} from '../../common';
// import { Actions } from 'react-native-router-flux'
import {UserStore, VideoStore} from '../../stores';
import {logger} from 'react-native-logs';
import {AppFonts, AppSizes, AppColors} from '../../theme';
import {
  ConversationStore,
  ConversationModel,
  ConversationMessageModel,
  conversationStoreInstance,
} from '../../stores/message-center';

interface ConversationContainerProps extends ViewProperties {
  conversationStore: typeof ConversationStore.Type;
  userStore: UserStore;
  videoStore: VideoStore;
  conversationId?: string;
  submissionId?: string;
  recipientUserId?: string;
  recipientPhotoUrl?: string;
  recipientName?: string;
  startVideoMessage?: boolean;
  onMessageSendCallback?: (conversationId: string) => any;
}

interface ConversationContainerState {
  sendEnabled: boolean;
  showFooterActions: boolean;
  messageText: string;
  conversationId: string;
  refreshing: boolean;
  loading: boolean;
}

const actionRowHeight = 60;
const footerInputVerticalPadding = 12;
const inputMinHeight = 44;
const inputMaxHeight = 164;
const log = logger.createLogger();

export class ConversationContainer extends React.Component<
  ConversationContainerProps,
  ConversationContainerState
> {
  contentHeight: number = 0;
  currentKeyboardHeight = 0;
  paddingBottom = new Animated.Value(0);
  footerActionsOpacity = new Animated.Value(0);
  footerInputHeight = new Animated.Value(inputMinHeight);
  footerInputTargetValue = inputMinHeight;
  private scrollView: any;
  private view: any;

  get hcpUserId(): string {
    return this.activeConversation
      ? this.activeConversation.hcpUserId
      : this.props.recipientUserId;
  }

  get recipientPhotoUrl(): string {
    return this.activeConversation
      ? this.activeConversation.hcpPhotoUrl
      : this.props.recipientPhotoUrl;
  }

  get recipientName(): string {
    return this.activeConversation
      ? this.activeConversation.hcpFirstName +
          ' ' +
          this.activeConversation.hcpLastName
      : this.props.recipientName;
  }

  get canMakePhoneCall(): boolean {
    return (
      this.props.userStore.isFacilityUser &&
      !!this.hcpUserId &&
      !!this.recipientName
    );
  }

  get submissionId(): string {
    return this.activeConversation
      ? this.activeConversation.submissionId
      : this.props.submissionId;
  }

  get canMakeVideoCall(): boolean {
    return this.props.userStore.isFacilityUser && !!this.submissionId;
  }

  get activeConversation(): typeof ConversationModel.Type {
    const conversationStore: typeof ConversationStore.Type =
      this.props.conversationStore;
    return conversationStore.activeConversation;
  }

  get showableMessages(): typeof ConversationMessageModel.Type[] {
    if (!this.activeConversation) {
      return [];
    }

    var result = this.activeConversation.messages || [];

    return result;
  }

  constructor(
    props: ConversationContainerProps,
    state: ConversationContainerState,
  ) {
    super(props, state);

    this.state = {
      sendEnabled: false,
      showFooterActions: false,
      messageText: '',
      conversationId: props.conversationId,
      refreshing: false,
      loading: true,
    };

    log.info('ConversationContainer', 'Starting Props', this.props);
    log.info('ConversationContainer', 'Starting State', this.state);

    if (!props.conversationId && !this.props.submissionId) {
      throw new Error(
        'Neither a conversation was found or a submissionId suplied to start a new conversation. One or the other is required.',
      );
    }

    this.paddingBottom = new Animated.Value(0);
    this.applyMeasurements();
  }

  keyboardDidCloseSubscription: EmitterSubscription;
  keyboardWillShowSubscription: EmitterSubscription;
  keyboardWillHideSubscription: EmitterSubscription;

  componentDidMount() {
    const {startVideoMessage} = this.props;

    setTimeout(() => {
      this.loadMessages();

      if (startVideoMessage) {
        this.sendVideoMessage();
      }
    }, 100);
  }

  componentWillMount() {
    this.keyboardWillShowSubscription = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    const {conversationStore} = this.props;
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
    conversationStore.clearActiveConversation();
    this.scrollView = null;
    this.view = null;
  }

  onMessageSend(conversationId: string) {
    if (
      this.props.onMessageSendCallback &&
      this.props.onMessageSendCallback.call
    ) {
      try {
        this.props.onMessageSendCallback(conversationId);
      } catch (error) {
        log.info('ConversationContainer', 'onMessageSendError', error);
      }
    }
  }

  keyboardWillShow = event => {
    if (Platform.OS === 'android') {
      this.currentKeyboardHeight = event.endCoordinates.height + 56;
      this.applyMeasurements();
    } else {
      this.currentKeyboardHeight = event.endCoordinates.height;
      this.applyMeasurements();
    }

    setTimeout(() => {
      if (this.scrollView) {
        this.scrollView.scrollToEnd();
      }
    }, 400);
  };

  keyboardWillHide = event => {
    this.currentKeyboardHeight = 0;
    this.applyMeasurements();
  };

  setMessageText = (messageText: string) => {
    messageText = messageText || '';
    this.setState({messageText, sendEnabled: !!messageText});
  };

  clearMessageText = () => {
    this.setState({messageText: '', sendEnabled: false});
  };

  scrollViewContentSizeChangeHandler(contentWidth, contentHeight) {
    this.scrollView.scrollToEnd({animated: false});
  }

  onInputContentSizeChange = event => {
    let newInputHeight = event.nativeEvent.contentSize.height + 12;

    if (newInputHeight > inputMaxHeight) {
      newInputHeight = inputMaxHeight;
    }

    if (newInputHeight < inputMinHeight) {
      newInputHeight = inputMinHeight;
    }

    this.footerInputTargetValue = newInputHeight;

    this.applyMeasurements();
  };

  onLayout = () => {
    if (!this.view) return;

    this.view._component.measureInWindow((winX, winY, winWidth, winHeight) => {
      this.contentHeight = winHeight;
      this.applyMeasurements();
    });
  };

  applyMeasurements() {
    const {showFooterActions} = this.state;
    const footerActionsOpacity = showFooterActions ? 1 : 0;
    const duration = 100;
    let paddingBottom = this.currentKeyboardHeight;

    if (AppSizes.isIPhoneX) {
      paddingBottom -= AppSizes.iPhoneXFooterSize;
    }

    Animated.parallel([
      Animated.timing(this.paddingBottom, {
        duration,
        toValue: paddingBottom,
      }),
      Animated.timing(this.footerActionsOpacity, {
        duration: duration,
        toValue: footerActionsOpacity,
      }),
      Animated.timing(this.footerInputHeight, {
        duration: duration,
        toValue: this.footerInputTargetValue + footerInputVerticalPadding,
      }),
    ]).start();
  }
  removeRead(message: typeof ConversationMessageModel.Type) {
    log.info(message);
    log.info('Read it');
    message.updateReadState(true);
  }
  playVideoMessage(
    videoUrl: string,
    message: typeof ConversationMessageModel.Type,
  ) {
    const parms = {videoUrl, audioUrl: undefined};
    log.info('ConversationContainer', 'playVideoMessage', parms);
    // Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX](parms)
    log.info('Marking video viewed');
    conversationStoreInstance.markRead(message.messageId);
    this.removeRead(message);
  }

  playAudioMessage(message: typeof ConversationMessageModel.Type) {
    log.info('Message data: ', message);
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const avatarTitle = `${message.senderFirstName} ${message.senderLastName}`;
    const avatarDescription = `Message recorded ${time}`;
    const parms = {
      audioUrl: message.audioUrl,
      videoUrl: undefined,
      avatarUrl: message.senderPhotoUrl,
      avatarTitle,
      avatarDescription,
    };

    // Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms)
  }

  toggleFooterActions = () => {
    const {showFooterActions} = this.state;

    setTimeout(() => {
      if (this.scrollView && !showFooterActions) {
        this.scrollView.scrollToEnd();
      }
    }, 200);

    this.setState(
      {showFooterActions: !showFooterActions},
      this.applyMeasurements.bind(this),
    );
  };

  sendVideoMessage = () => {
    Keyboard.dismiss();

    const conversationId = this.activeConversation
      ? this.activeConversation.conversationId
      : '';
    const submissionId = this.props.submissionId;
    // Actions[ScreenType.VIDEO_RECORDER_LIGHTBOX]({ finishedButtonTitle: 'Send', videoMessage: true, conversationId, submissionId, onFinished: this.onVideoMessageSent.bind(this), onMessageSendCallback: this.onMessageSend.bind(this) });
  };

  onVideoMessageSent = (archiveId: string, videoUrl: string) => {
    try {
      this.scrollView.scrollToEnd({animated: true});
    } catch (error) {
      log.info('ConversationContainer', 'onVideoMessageSent', 'Error', error);
    }
  };

  sendTextMessage = () => {
    const {conversationStore, submissionId} = this.props;
    const {messageText, conversationId, sendEnabled} = this.state;

    if (!sendEnabled) {
      return;
    }

    this.clearMessageText();

    return conversationStore
      .sendTextMessage(
        conversationId,
        submissionId,
        messageText.replace(/\s+$/g, ''),
      )
      .then(conversationId => {
        this.clearMessageText();
        Keyboard.dismiss();

        log.info(
          `SubmissionId: ${submissionId} generated conversationId: ${conversationId}`,
        );
        this.setState({conversationId});
        this.onMessageSend(conversationId);
      })
      .catch(error => {
        this.setState({messageText, sendEnabled: !!messageText});
        log.info('_sendTextMessage', error);
        showYesNoAlert({
          title: 'Send Error',
          message: 'The message could not be sent. Please try again.',
          yesTitle: 'Try Again',
          noTitle: 'Cancel',
          onYes: this.sendTextMessage.bind(this),
          onNo: () => {},
        });
      });
  };

  initVideoCall() {
    const {videoStore} = this.props;
    if (this.canMakeVideoCall) {
      videoStore.call(this.submissionId, this.hcpUserId, {
        title: '',
        name: this.recipientName,
        subTitle: '',
        photo: this.recipientPhotoUrl,
      });
    }
  }

  initPhoneCall() {
    if (this.canMakePhoneCall) {
      // Actions.push(ScreenType.HCP_PHONE_CALL_LIGHTBOX, {
      //     submissionId: this.submissionId,
      //     photoUrl: this.recipientPhotoUrl,
      //     title: this.recipientName
      // })
    }
  }

  loadMessages(refreshing = false) {
    const {conversationStore} = this.props;
    const {conversationId} = this.state;

    if (conversationId && !conversationStore.loading) {
      const loading = !refreshing;
      this.setState({refreshing, loading});

      conversationStore.loadActiveConversation(conversationId).then(
        () => {
          this.setState({
            refreshing: false,
            loading: false,
            conversationId,
          });
        },
        error => {
          if (loading) {
            Alert.alert(
              'Message Center Error',
              'We are having trouble loading your conversation. Please try again.',
            );
          }
          this.setState({refreshing: false, loading: false});
        },
      );
    } else {
      this.setState({loading: false});
    }
  }

  renderAudioMessageView(
    message: typeof ConversationMessageModel.Type,
    index: number,
  ) {
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

    if (!message.audioUrl) {
      log.info('Skipping audio message render.  Empty tokBoxArchiveUrl');
      return <View key={`message-${message.messageId}-${index}`} />;
    }

    return (
      <View
        key={`message-${message.messageId}-${index}`}
        style={[
          style.messageView,
          style.audioMessageView,
          message.sentByMe ? style.messageFromMeView : {},
        ]}>
        <TouchableHighlight
          onPress={this.playAudioMessage.bind(this, message)}
          style={[
            style.audioMessageWrapper,
            message.sentByMe ? style.audioMessageWrapperFromMe : {},
          ]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Circle
              size={28}
              color={message.sentByMe ? AppColors.white : AppColors.blue}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <ConexusIcon
                style={{paddingLeft: 3}}
                name="cn-play"
                size={18}
                color={message.sentByMe ? AppColors.blue : AppColors.white}
              />
            </Circle>
            <Text
              style={[
                style.audioMessageText,
                message.sentByMe ? style.audioMessageTextFromMe : {},
              ]}>
              Audio Message
            </Text>
          </View>
        </TouchableHighlight>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}>
          {caption}
        </Text>
      </View>
    );
  }

  renderVideoMessageView(
    message: typeof ConversationMessageModel.Type,
    index: number,
  ) {
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

    if (!message.tokBoxArchiveUrl) {
      log.info('Skipping video message render.  Empty tokBoxArchiveUrl');
      return <View key={`message-${message.messageId}-${index}`} />;
    }
    return (
      <View
        key={`message-${message.messageId}-${index}`}
        style={[
          style.messageView,
          style.videoMessageView,
          message.sentByMe ? style.messageFromMeView : {},
        ]}>
        <TouchableHighlight
          onPress={this.playVideoMessage.bind(
            this,
            message.tokBoxArchiveUrl,
            message,
          )}
          style={[
            style.videoMessageWrapper,
            message.sentByMe ? style.videoMessageWrapperFromMe : {},
          ]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Circle
              size={28}
              color={message.sentByMe ? AppColors.white : AppColors.blue}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <ConexusIcon
                style={{paddingLeft: 3}}
                name="cn-play"
                size={18}
                color={message.sentByMe ? AppColors.blue : AppColors.white}
              />
            </Circle>
            <Text
              style={[
                style.videoMessageText,
                message.sentByMe ? style.videoMessageTextFromMe : {},
              ]}>
              Video Message {message.read ? '' : ' *'}
            </Text>
          </View>
        </TouchableHighlight>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}>
          {caption}
        </Text>
      </View>
    );
  }

  renderTextMessageView(
    message: typeof ConversationMessageModel.Type,
    index: number,
  ) {
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

    return (
      <View
        key={`message-${message.messageId}-${index}`}
        style={[
          style.messageView,
          style.textMessageView,
          message.sentByMe ? style.messageFromMeView : {},
        ]}>
        <View
          style={[
            style.textMessageTextWrapper,
            message.sentByMe ? style.textMessageTextWrapperFromMe : {},
          ]}>
          <Text
            selectable
            style={[
              style.textMessageText,
              message.sentByMe ? style.textMessageTextFromMe : {},
            ]}>
            {message.messageText}
          </Text>
        </View>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}>
          {caption}
        </Text>
      </View>
    );
  }

  renderMessageScrollView() {
    return (
      <ScrollView
        style={style.messageListView}
        ref={ref => (this.scrollView = ref)}
        onContentSizeChange={this.scrollViewContentSizeChangeHandler.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadMessages.bind(this, true)}
          />
        }>
        {this.showableMessages.map((message, index) => {
          if (message.messageTypeId === '1') {
            return this.renderTextMessageView(message, index);
          }

          if (message.messageTypeId === '2') {
            return this.renderAudioMessageView(message, index);
          }

          if (message.messageTypeId === '3') {
            return this.renderVideoMessageView(message, index);
          }

          return <View key={`scroll-item-${index}`} />;
        })}
      </ScrollView>
    );
  }

  renderMessageList() {
    const {loading} = this.state;

    if (this.showableMessages.length) {
      return (
        <Animated.View
          style={[
            {
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              backgroundColor: AppColors.baseGray,
            },
          ]}>
          {this.renderMessageScrollView()}
        </Animated.View>
      );
    } else if (loading) {
      return (
        <Animated.View
          style={[
            {
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              backgroundColor: AppColors.baseGray,
            },
          ]}>
          <ActivityIndicator
            color={AppColors.blue}
            style={{flex: 1}}></ActivityIndicator>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'center',
            backgroundColor: AppColors.baseGray,
          },
        ]}>
        {
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 180,
            }}>
            {!!this.recipientName && (
              <Text>This is your first conversation with</Text>
            )}
            {!!this.recipientName && <Text>{this.recipientName}</Text>}
            {!this.recipientName && <Text>No Messages Available</Text>}
          </View>
        }
      </Animated.View>
    );
  }

  renderFooter() {
    const {sendEnabled, showFooterActions, messageText} = this.state;

    return (
      <Animated.View key="footer" style={[footerStyle.footerView]}>
        <Animated.View
          style={[footerStyle.inputRow, {height: this.footerInputHeight}]}>
          <View style={footerStyle.inputWrapper}>
            <ConexusIconButton
              iconName="cn-more"
              iconSize={16}
              color={AppColors.blue}
              onPress={this.toggleFooterActions.bind(this)}
              style={footerStyle.moreButton}></ConexusIconButton>
            <TextInput
              underlineColorAndroid={'transparent'}
              value={messageText}
              selectionColor={AppColors.blue}
              onChangeText={this.setMessageText.bind(this)}
              returnKeyType="default"
              editable={true}
              multiline={true}
              style={footerStyle.input}
              onContentSizeChange={this.onInputContentSizeChange.bind(this)}
            />
          </View>
          <Button
            style={StyleSheet.flatten([
              footerStyle.sendButton,
              !sendEnabled && footerStyle.sendButtonDisabled,
            ])}
            onPress={this.sendTextMessage.bind(this)}>
            <Text
              style={[
                footerStyle.sendButtonText,
                !sendEnabled && footerStyle.sendButtonTextDisabled,
              ]}>
              Send
            </Text>
          </Button>
        </Animated.View>
        {!!showFooterActions && (
          <View style={[footerStyle.actionsRow]}>
            <ConexusIconButton
              disabled={!showFooterActions}
              title="Video Message"
              iconName="cn-video-message"
              iconSize={24}
              color={AppColors.blue}
              onPress={this.sendVideoMessage.bind(this)}
              style={footerStyle.actionRowButton}
              textStyle={footerStyle.actionButtonText}></ConexusIconButton>
            {this.canMakeVideoCall && (
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Video Call"
                iconName="cn-video"
                iconSize={24}
                color={AppColors.blue}
                onPress={this.initVideoCall.bind(this)}
                style={footerStyle.actionRowButton}
                textStyle={footerStyle.actionButtonText}></ConexusIconButton>
            )}
            {this.canMakePhoneCall && (
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Phone Call"
                iconName="cn-phone"
                iconSize={24}
                color={AppColors.blue}
                onPress={this.initPhoneCall.bind(this)}
                style={footerStyle.actionRowButton}
                textStyle={footerStyle.actionButtonText}></ConexusIconButton>
            )}
          </View>
        )}
      </Animated.View>
    );
  }

  render() {
    const {sendEnabled, showFooterActions, messageText} = this.state;

    return (
      <SafeAreaView style={[{flex: 1, backgroundColor: 'white'}]}>
        <Animated.View
          style={{flex: 1, paddingBottom: this.paddingBottom}}
          onLayout={this.onLayout}
          ref={c => {
            this.view = c;
          }}>
          {this.renderMessageList()}
          {this.renderFooter()}
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const getMessageShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 2,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};

const getFooterShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 4,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};

const getInputStyle = () => {
  return Platform.OS === 'android'
    ? {
        padding: 0,
      }
    : {};
};

const footerStyle = StyleSheet.create({
  footerView: {
    flexDirection: 'column',
    alignItems: 'stretch',
    ...getFooterShadows(),
    backgroundColor: AppColors.white,
    paddingVertical: footerInputVerticalPadding,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },

  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: AppColors.lightBlue,
    borderRadius: 6,
    marginRight: 4,
    backgroundColor: AppColors.white,
  },

  moreButton: {
    borderRightWidth: 1,
    borderColor: AppColors.lightBlue,
  },

  input: {
    flex: 1,
    margin: 4,
    marginLeft: 8,
    ...AppFonts.bodyTextMedium,
    ...getInputStyle(),
  },

  sendButton: {
    backgroundColor: AppColors.blue,
    width: 70,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppColors.blue,
    borderWidth: 1,
    borderRadius: 6,
    height: null,
  },
  sendButtonDisabled: {
    borderColor: AppColors.lightBlue,
    backgroundColor: AppColors.white,
  },
  sendButtonText: {
    ...AppFonts.buttonText,
    color: AppColors.white,
  },
  sendButtonTextDisabled: {
    color: AppColors.lightBlue,
  },

  actionsRow: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  actionRowButton: {
    flex: 1,
    height: actionRowHeight,
  },

  actionButtonText: {
    ...AppFonts.bodyTextXtraSmallTouchable,
  },
});

const style = StyleSheet.create({
  messageListView: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },

  messageView: {
    flex: 1,
    margin: 12,
    marginTop: 6,
    marginBottom: 16,
    alignItems: 'stretch',
  },

  textMessageView: {},
  messageFromMeView: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },

  caption: {
    marginTop: Platform.OS === 'android' ? 0 : 4,
    ...AppFonts.bodyTextXtraXtraSmall,
    paddingRight: Platform.OS === 'android' ? 4 : 0,
    paddingLeft: Platform.OS === 'android' ? 4 : 0,
  },
  captionFrom: {
    alignSelf: 'flex-end',
  },

  textMessageTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: AppSizes.screen.width * 0.65,
    minWidth: AppSizes.screen.width * 0.65,
    padding: 8,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 6 : 8,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    ...getMessageShadows(),
  },

  textMessageTextWrapperFromMe: {
    alignItems: 'flex-end',
    backgroundColor: AppColors.blue,
  },

  textMessageText: {
    ...AppFonts.bodyTextMedium,
  },
  textMessageTextFromMe: {
    ...AppFonts.bodyTextMedium,
    alignSelf: 'flex-end',
    color: AppColors.white,
    padding: 0,
  },

  videoMessageView: {},

  videoMessageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: AppSizes.screen.width * 0.5,
    minWidth: AppSizes.screen.width * 0.5,
    padding: 8,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 8 : 8,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    ...getMessageShadows(),
  },
  videoMessageWrapperFromMe: {
    alignItems: 'flex-end',
    backgroundColor: AppColors.blue,
  },

  videoMessageText: {
    ...AppFonts.bodyTextMedium,
    paddingLeft: 8,
  },
  messageUnred: {
    color: AppColors.red,
  },
  videoMessageTextFromMe: {
    ...AppFonts.bodyTextMedium,
    alignSelf: 'flex-end',
    color: AppColors.white,
    paddingBottom: 4,
  },

  audioMessageView: {},

  audioMessageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: AppSizes.screen.width * 0.5,
    minWidth: AppSizes.screen.width * 0.5,
    padding: 8,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 8 : 8,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    ...getMessageShadows(),
  },

  audioMessageWrapperFromMe: {
    alignItems: 'flex-end',
    backgroundColor: AppColors.blue,
  },

  audioMessageText: {
    ...AppFonts.bodyTextMedium,
    paddingLeft: 8,
  },
  audioMessageTextFromMe: {
    ...AppFonts.bodyTextMedium,
    alignSelf: 'flex-end',
    color: AppColors.white,
    paddingBottom: 4,
  },
});
