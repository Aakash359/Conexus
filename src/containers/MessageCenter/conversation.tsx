import React, {useState, useEffect, useRef} from 'react';
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
  Button,
  Text,
  View,
} from 'react-native';
import {ConexusIcon, Circle, ActionButton} from '../../components';
import {ConexusIconButton} from '../../components/conexus-icon-button';
import {ScreenType, showYesNoAlert} from '../../common';
import {UserStore, VideoStore} from '../../stores';
import {logger} from 'react-native-logs';
import {AppFonts, AppSizes, AppColors} from '../../theme';
import {TouchableOpacity} from 'react-native';
import {
  ConversationStore,
  ConversationModel,
  ConversationMessageModel,
  conversationStoreInstance,
} from '../../stores/message-center';
import {sendTextMessageService} from '../../services/MessageCenter/sendTextMessageService';
import {loadTextMessageService} from '../../services/MessageCenter/loadTextMessageService';

let moment = require('moment');
const SafeAreaView = require('react-native').SafeAreaView;

interface ConversationContainerProps {
  conversationStore: any;
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
const footerInputVerticalPadding = 20;
const inputMinHeight = 55;
const inputMaxHeight = 164;
const log = logger.createLogger();

const ConversationContainer = (
  props: ConversationContainerProps,
  state: ConversationContainerState,
) => {
  const contentHeight: number = 0;
  const currentKeyboardHeight = 0;
  const paddingBottom = new Animated.Value(0);
  const footerActionsOpacity = new Animated.Value(0);
  const footerInputHeight = new Animated.Value(inputMinHeight);
  const footerInputTargetValue = inputMinHeight;
  const scrollRef = React.createRef<ScrollView>();
  const animatableRef = useRef(new Animated.Value(0.0)).current;
  const [messageList, setMessageList] = useState([]);
  const [sendEnabled, setSendEnabled] = useState(false);
  const [showFooterActions, setShowFooterActions] = useState(false);
  const [messageText, setMessageTexts] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {startVideoMessage} = props;
  const params = props?.route?.params;

  const {conversationId} = params;

  const loadMessages = async () => {
    try {
      const {data} = await loadTextMessageService(conversationId);
      Keyboard.dismiss();
      setMessageList(data?.messages);
      console.log('data===>', data?.messages);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
      setLoading(false);
      Alert.alert(
        'Message Center Error',
        'We are having trouble loading your conversation. Please try again.',
      );
    }
  };

  useEffect(() => {
    applyMeasurements();
    setTimeout(() => {
      loadMessages();
      if (startVideoMessage) {
        // sendVideoMessage();
      }
    }, 100);
  }, []);
  // const conversationId =

  // this.paddingBottom = new Animated.Value(0);
  // this.applyMeasurements();

  // const hcpUserId = (): string => {
  //   return this.activeConversation
  //     ? this.activeConversation.hcpUserId
  //     : this.props.recipientUserId;
  // };

  // const recipientPhotoUrl = (): string => {
  //   return this.activeConversation
  //     ? this.activeConversation.hcpPhotoUrl
  //     : this.props.recipientPhotoUrl;
  // };

  // const recipientName = (): string => {
  //   return this.activeConversation
  //     ? this.activeConversation.hcpFirstName +
  //         ' ' +
  //         this.activeConversation.hcpLastName
  //     : this.props.recipientName;
  // };

  // const canMakePhoneCall = (): boolean => {
  //   return (
  //     this.props.userStore.isFacilityUser &&
  //     !!this.hcpUserId &&
  //     !!this.recipientName
  //   );
  // };

  // const submissionId = (): string => {
  //   return this.activeConversation
  //     ? this.activeConversation.submissionId
  //     : this.props.submissionId;
  // };

  // const canMakeVideoCall = (): boolean => {
  //   return this.props.userStore.isFacilityUser && !!this.submissionId;
  // };

  const applyMeasurements = () => {
    const footerActionsOpacity = showFooterActions ? 1 : 0;
    const duration = 100;
    let paddingBottom = currentKeyboardHeight;

    if (AppSizes.isIPhoneX) {
      paddingBottom -= AppSizes.iPhoneXFooterSize;
    }

    // Animated.parallel([
    //   Animated.timing(paddingBottom, {
    //     duration,
    //     toValue: paddingBottom,
    //   }),
    //   Animated.timing(footerActionsOpacity, {
    //     duration: duration,
    //     toValue: footerActionsOpacity,
    //   }),
    //   Animated.timing(footerInputHeight, {
    //     duration: duration,
    //     toValue: footerInputTargetValue + footerInputVerticalPadding,
    //   }),
    // ]).start();
  };

  // keyboardDidCloseSubscription: EmitterSubscription;
  // keyboardWillShowSubscription: EmitterSubscription;
  // keyboardWillHideSubscription: EmitterSubscription;

  // componentDidMount() {
  //   const {startVideoMessage} = this.props;

  //   setTimeout(() => {
  //     this.loadMessages();

  //     if (startVideoMessage) {
  //       this.sendVideoMessage();
  //     }
  //   }, 100);
  // }

  // componentWillMount() {
  //   this.keyboardWillShowSubscription = Keyboard.addListener(
  //     'keyboardWillShow',
  //     this.keyboardWillShow,
  //   );
  //   this.keyboardWillHideSubscription = Keyboard.addListener(
  //     'keyboardWillHide',
  //     this.keyboardWillHide,
  //   );
  // }

  // componentWillUnmount() {
  //   const {conversationStore} = this.props;
  //   this.keyboardWillShowSubscription.remove();
  //   this.keyboardWillHideSubscription.remove();
  //   conversationStore.clearActiveConversation();
  //   this.scrollView = null;
  //   this.view = null;
  // }

  // const onMessageSend = (conversationId: string) => {
  //   if (
  //     this.props.onMessageSendCallback &&
  //     this.props.onMessageSendCallback.call
  //   ) {
  //     try {
  //       this.props.onMessageSendCallback(conversationId);
  //     } catch (error) {
  //       log.info('ConversationContainer', 'onMessageSendError', error);
  //     }
  //   }
  // };

  // const keyboardWillShow = event => {
  //   if (Platform.OS === 'android') {
  //     this.currentKeyboardHeight = event.endCoordinates.height + 56;
  //     this.applyMeasurements();
  //   } else {
  //     this.currentKeyboardHeight = event.endCoordinates.height;
  //     this.applyMeasurements();
  //   }

  //   setTimeout(() => {
  //     if (this.scrollView) {
  //       this.scrollView.scrollToEnd();
  //     }
  //   }, 400);
  // };

  // const keyboardWillHide = event => {
  //   this.currentKeyboardHeight = 0;
  //   this.applyMeasurements();
  // };

  const setMessageText = (messageText: string) => {
    messageText = messageText || '';
    setMessageTexts(messageText);
    setSendEnabled(!!messageText);
  };

  const clearMessageText = () => {
    setMessageTexts('');
    setSendEnabled(false);
  };

  const onInputContentSizeChange = event => {
    let newInputHeight = event.nativeEvent.contentSize.height + 12;
    if (newInputHeight > inputMaxHeight) {
      newInputHeight = inputMaxHeight;
    }
    if (newInputHeight < inputMinHeight) {
      newInputHeight = inputMinHeight;
    }
    // footerInputTargetValue = newInputHeight;
    // this.applyMeasurements();
  };

  const onLayout = () => {
    // if (!view) return;
    // view._component.measureInWindow((winX, winY, winWidth, winHeight) => {
    //   contentHeight = winHeight;
    //   applyMeasurements();
    // });
  };

  // const removeRead = (message: any) => {
  //   log.info(message);
  //   log.info('Read it');
  //   message.updateReadState(true);
  // };

  // const playVideoMessage = (videoUrl: string, message: any) => {
  //   const parms = {videoUrl, audioUrl: undefined};
  //   log.info('ConversationContainer', 'playVideoMessage', parms);
  //   // Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX](parms)
  //   log.info('Marking video viewed');
  //   conversationStoreInstance.markRead(message.messageId);
  //   this.removeRead(message);
  // };

  // const playAudioMessage = (message: any) => {
  //   log.info('Message data: ', message);
  //   const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
  //   const avatarTitle = `${message.senderFirstName} ${message.senderLastName}`;
  //   const avatarDescription = `Message recorded ${time}`;
  //   const parms = {
  //     audioUrl: message.audioUrl,
  //     videoUrl: undefined,
  //     avatarUrl: message.senderPhotoUrl,
  //     avatarTitle,
  //     avatarDescription,
  //   };

  //   // Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms)
  // };

  const toggleFooterActions = () => {
    // setTimeout(() => {
    //   if (scrollView && !showFooterActions) {
    //     scrollView.scrollToEnd();
    //   }
    // }, 200);
    setShowFooterActions(!showFooterActions);
    // this.setState(
    //   {showFooterActions: !showFooterActions},
    //   this.applyMeasurements.bind(this),
    // );
  };

  // const sendVideoMessage = () => {
  //   Keyboard.dismiss();

  //   const conversationId = this.activeConversation
  //     ? this.activeConversation.conversationId
  //     : '';
  //   const submissionId = this.props.submissionId;
  //   // Actions[ScreenType.VIDEO_RECORDER_LIGHTBOX]({ finishedButtonTitle: 'Send', videoMessage: true, conversationId, submissionId, onFinished: this.onVideoMessageSent.bind(this), onMessageSendCallback: this.onMessageSend.bind(this) });
  // };

  // const onVideoMessageSent = (archiveId: string, videoUrl: string) => {
  //   try {
  //     this.scrollView.scrollToEnd({animated: true});
  //   } catch (error) {
  //     log.info('ConversationContainer', 'onVideoMessageSent', 'Error', error);
  //   }
  // };

  const sendTextMessage = async () => {
    if (!sendEnabled) {
      return;
    }
    clearMessageText();
    try {
      const {data} = await sendTextMessageService({
        conversationId: conversationId || null,
        submissionId: null,
        messageText: messageText.replace(/\s+$/g, ''),
        messageTypeId: '1',
      });
      Keyboard.dismiss();
      console.log('data===>', data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
      setMessageTexts(messageText);
      setSendEnabled(!!messageText);
      showYesNoAlert({
        title: 'Send Error',
        message: 'The message could not be sent. Please try again.',
        yesTitle: 'Try Again',
        noTitle: 'Cancel',
        // onYes: this.sendTextMessage.bind(this),
        onNo: () => {},
      });
    }
  };

  // const initVideoCall = () => {
  //   const {videoStore} = this.props;
  //   if (this.canMakeVideoCall) {
  //     videoStore.call(this.submissionId, this.hcpUserId, {
  //       title: '',
  //       name: this.recipientName,
  //       subTitle: '',
  //       photo: this.recipientPhotoUrl,
  //     });
  //   }
  // };

  // const initPhoneCall = () => {
  //   if (this.canMakePhoneCall) {
  //     // Actions.push(ScreenType.HCP_PHONE_CALL_LIGHTBOX, {
  //     //     submissionId: this.submissionId,
  //     //     photoUrl: this.recipientPhotoUrl,
  //     //     title: this.recipientName
  //     // })
  //   }
  // };

  // const renderAudioMessageView = (
  //   message: typeof ConversationMessageModel.Type,
  //   index: number,
  // ) => {
  //   const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
  //   const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

  //   if (!message.audioUrl) {
  //     log.info('Skipping audio message render.  Empty tokBoxArchiveUrl');
  //     return <View key={`message-${message.messageId}-${index}`} />;
  //   }

  //   return (
  //     <View
  //       key={`message-${message.messageId}-${index}`}
  //       style={[
  //         style.messageView,
  //         style.audioMessageView,
  //         message.sentByMe ? style.messageFromMeView : {},
  //       ]}>
  //       <TouchableHighlight
  //         onPress={this.playAudioMessage.bind(this, message)}
  //         style={[
  //           style.audioMessageWrapper,
  //           message.sentByMe ? style.audioMessageWrapperFromMe : {},
  //         ]}>
  //         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
  //           <Circle
  //             size={28}
  //             color={message.sentByMe ? AppColors.white : AppColors.blue}
  //             style={{alignItems: 'center', justifyContent: 'center'}}>
  //             <ConexusIcon
  //               style={{paddingLeft: 3}}
  //               name="cn-play"
  //               size={18}
  //               color={message.sentByMe ? AppColors.blue : AppColors.white}
  //             />
  //           </Circle>
  //           <Text
  //             style={[
  //               style.audioMessageText,
  //               message.sentByMe ? style.audioMessageTextFromMe : {},
  //             ]}>
  //             Audio Message
  //           </Text>
  //         </View>
  //       </TouchableHighlight>
  //       <Text
  //         style={[style.caption, message.sentByMe ? style.captionFrom : {}]}>
  //         {caption}
  //       </Text>
  //     </View>
  //   );
  // };

  // const renderVideoMessageView = (
  //   message: typeof ConversationMessageModel.Type,
  //   index: number,
  // ) => {
  //   const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
  //   const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

  //   if (!message.tokBoxArchiveUrl) {
  //     log.info('Skipping video message render.  Empty tokBoxArchiveUrl');
  //     return <View key={`message-${message.messageId}-${index}`} />;
  //   }
  //   return (
  //     <View
  //       key={`message-${message.messageId}-${index}`}
  //       style={[
  //         style.messageView,
  //         style.videoMessageView,
  //         message.sentByMe ? style.messageFromMeView : {},
  //       ]}>
  //       <TouchableHighlight
  //         onPress={this.playVideoMessage.bind(
  //           this,
  //           message.tokBoxArchiveUrl,
  //           message,
  //         )}
  //         style={[
  //           style.videoMessageWrapper,
  //           message.sentByMe ? style.videoMessageWrapperFromMe : {},
  //         ]}>
  //         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
  //           <Circle
  //             size={28}
  //             color={message.sentByMe ? AppColors.white : AppColors.blue}
  //             style={{alignItems: 'center', justifyContent: 'center'}}>
  //             <ConexusIcon
  //               style={{paddingLeft: 3}}
  //               name="cn-play"
  //               size={18}
  //               color={message.sentByMe ? AppColors.blue : AppColors.white}
  //             />
  //           </Circle>
  //           <Text
  //             style={[
  //               style.videoMessageText,
  //               message.sentByMe ? style.videoMessageTextFromMe : {},
  //             ]}>
  //             Video Message {message.read ? '' : ' *'}
  //           </Text>
  //         </View>
  //       </TouchableHighlight>
  //       <Text
  //         style={[style.caption, message.sentByMe ? style.captionFrom : {}]}>
  //         {caption}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderTextMessageView = (message: any, index: number) => {
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;
    console.log('Okkk===>', message.messageId);

    return (
      <View
        key={`message-${message.messageId}-${index}`}
        style={[
          style.messageView,
          style.textMessageView,
          message.sentByMe ? style.messageFromMeView : {},
        ]}
        // style={[
        //   style.messageView,
        //   style.textMessageView,
        //   message.sentByMe ? style.messageFromMeView : {},
        // ]}
      >
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
  };

  const renderMessageScrollView = () => {
    return (
      <ScrollView
        style={style.messageListView}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({animated: true})
        }
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={loadMessages(true)}
        //   />
        // }
      >
        {messageList.map((message, index) => {
          if (message.messageTypeId === '1') {
            return renderTextMessageView(message, index);
          }

          // if (message.messageTypeId === '2') {
          //   return this.renderAudioMessageView(message, index);
          // }

          // if (message.messageTypeId === '3') {
          //   return this.renderVideoMessageView(message, index);
          // }

          return <View key={`scroll-item-${index}`} />;
        })}
      </ScrollView>
    );
  };

  const renderMessageList = () => {
    if (messageList.length) {
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
          {renderMessageScrollView()}
        </Animated.View>
      );
    }
    if (loading) {
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
            {/* {!!recipientName && ( */}

            <Text>This is your first conversation with</Text>
            {/* )} */}
            {/* {!!this.recipientName && <Text>{this.recipientName}</Text>} */}
            {/* {!this.recipientName &&  */}
            <Text>No Messages Available</Text>
            {/* } */}
          </View>
        }
      </Animated.View>
    );
  };

  const renderFooter = () => {
    return (
      <Animated.View key="footer" style={[footerStyle.footerView]}>
        <Animated.View
          style={[footerStyle.inputRow, {height: footerInputHeight}]}>
          <View style={footerStyle.inputWrapper}>
            <ConexusIconButton
              iconName="cn-more"
              iconSize={16}
              color={AppColors.blue}
              onPress={() => toggleFooterActions()}
              style={footerStyle.moreButton}
            />
            <TextInput
              underlineColorAndroid={'transparent'}
              value={messageText}
              selectionColor={AppColors.blue}
              onChangeText={messageText => setMessageText(messageText)}
              returnKeyType="default"
              editable={true}
              multiline={true}
              style={footerStyle.input}
              onContentSizeChange={onInputContentSizeChange}
            />
          </View>
          <TouchableOpacity
            style={StyleSheet.flatten([
              footerStyle.sendButton,
              !sendEnabled && footerStyle.sendButtonDisabled,
            ])}
            onPress={() => sendTextMessage()}>
            <Text
              style={[
                footerStyle.sendButtonText,
                !sendEnabled && footerStyle.sendButtonTextDisabled,
              ]}>
              SEND
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {!!showFooterActions && (
          <View style={[footerStyle.actionsRow]}>
            <ConexusIconButton
              disabled={!showFooterActions}
              title="Video Message"
              iconName="cn-video-message"
              iconSize={24}
              color={AppColors.blue}
              // onPress={this.sendVideoMessage.bind(this)}
              style={footerStyle.actionRowButton}
              textStyle={footerStyle.actionButtonText}
            />
            {
              // canMakeVideoCall && (
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Video Call"
                iconName="cn-video"
                iconSize={24}
                color={AppColors.blue}
                // onPress={this.initVideoCall.bind(this)}
                style={footerStyle.actionRowButton}
                textStyle={footerStyle.actionButtonText}
              />
              // )
            }
            {
              // this.canMakePhoneCall &&
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Phone Call"
                iconName="cn-phone"
                iconSize={24}
                color={AppColors.blue}
                // onPress={this.initPhoneCall.bind(this)}
                style={footerStyle.actionRowButton}
                textStyle={footerStyle.actionButtonText}
              />
            }
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: 'white'}]}>
      <Animated.View
        style={{flex: 1, paddingBottom: paddingBottom}}
        onLayout={onLayout}
        ref={animatableRef}
        ref={animatableRef}>
        {renderMessageList()}
        {renderFooter()}
      </Animated.View>
    </SafeAreaView>
  );
};

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
    right: 0,
    left: 0,
    position: 'absolute',
    bottom: 0,
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
    color: AppColors.gray,
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
    margin: 8,
    marginTop: 0,
    paddingVertical: 5,
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
    padding: 10,
    maxWidth: AppSizes.screen.width * 0.65,
    minWidth: AppSizes.screen.width * 0.65,
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

export default ConversationContainer;
