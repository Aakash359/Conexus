import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
  Keyboard,
  Animated,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';
import { phoneFormatter } from '../../common/phone-formatter';
import { ConexusIconButton } from '../../components/conexus-icon-button';
import { showYesNoAlert } from '../../common';
import { useSelector } from '../../redux/reducers/index';
import { UserStore, VideoStore } from '../../stores';
import { logger } from 'react-native-logs';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppFonts, AppSizes, AppColors } from '../../theme';
import { TouchableOpacity } from 'react-native';
import NavigationService from '../../navigation/NavigationService';
import { PhoneCallModal } from '../../components/Modals/phoneCallModal';
import {
  initiatePhoneCallService,
  initVideoConferenceService,
  loadTextMessageService,
  sendTextMessageService,
} from '../../services/ApiServices';
import { users } from '../../containers/facility/HcpDetail/config-users';
import { useNavigation } from '@react-navigation/native';

let moment = require('moment');
const SafeAreaView = require('react-native').SafeAreaView;

interface ConversationContainerProps {
  route: any;
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
  const footerActionOpacity = new Animated.Value(0);
  const footerInputHeight = new Animated.Value(inputMinHeight);
  const footerInputTargetValue = inputMinHeight;
  const scrollRef = React.createRef<ScrollView>();
  const [calling, setCalling] = useState(false);
  const animatableRef = useRef(new Animated.Value(0.0)).current;
  const [messageList, setMessageList] = useState([]);
  const [sendEnabled, setSendEnabled] = useState(false);
  const [showFooterActions, setShowFooterActions] = useState(false);
  const userInfo = useSelector(state => state.userReducer);
  const currentUser = useSelector(state => state.currentUser);
  const [callbackNumber, setCallBackNumber] = useState(userInfo?.user?.phoneNumber || '',);
  const [messageText, setMessageTexts] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneCallModalVisible, setPhoneCallModalVisible] = useState(false);
  const validPhone = phoneFormatter.isValid10DigitPhoneNumber(callbackNumber);
  const { startVideoMessage } = props;
  const params = props?.route?.params ? props?.route?.params : {};
  const { conversationId, candidate } = params ? params : '';
  const navigation = useNavigation();
  const callingId = currentUser?.id

  useEffect(() => {
    setTimeout(() => {
      loadMessages();
      if (startVideoMessage) {
        sendVideoMessage();
      }
    }, 100);
  }, []);
  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await loadTextMessageService(conversationId);
      Keyboard.dismiss();
      setMessageList(data?.messages);
      setRefreshing(false);
      setLoading(false);
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
  // const conversationId =

  // this.applyMeasurements();

  const hcpUserId = (): string => {
    return messageList ? messageList.hcpUserId : userId;
  };

  // const recipientPhotoUrl = (): string => {
  //   return this.activeConversation
  //     ? this.activeConversation.hcpPhotoUrl
  //     : this.props.recipientPhotoUrl;
  // };

  const recipientName = (): any => {
    return messageList
      ? messageList.hcpFirstName + ' ' + messageList.hcpLastName
      : recipientName;
  };

  const canMakePhoneCall = (): boolean => {
    return !!hcpUserId && !!recipientName;
  };

  const canMakeVideoCall = (): boolean => {
    return messageList.submissionId;
  };

  const activeConversation = (): any => {
    return messageList;
  };

  const submissionIdFun = (): string => {
    return messageList ? messageList.submissionId : props.submissionId;
  };
  const paddingBottom = new Animated.Value(0);
  const applyMeasurements = () => {
    const footerActionsOpacity = showFooterActions ? 1 : 0;
    const duration = 100;

    if (AppSizes.isIPhoneX) {
      currentKeyboardHeight = AppSizes.iPhoneXFooterSize;
    }

    Animated.parallel([
      Animated.timing(paddingBottom, {
        duration,
        toValue: paddingBottom,
      }),
      Animated.timing(footerActionOpacity, {
        duration: duration,
        toValue: footerActionsOpacity,
        useNativeDriver: false,
      }),
      Animated.timing(footerInputHeight, {
        duration: duration,
        toValue: footerInputTargetValue + footerInputVerticalPadding,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onMessageSend = (conversationId: string) => {
    if (conversationId) {
      try {
        onMessageSendCallback(conversationId);
      } catch (error) {
        log.info('ConversationContainer', 'onMessageSendError', error);
      }
    }
  };

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

  const onInputContentSizeChange = (event: {
    nativeEvent: { contentSize: { height: number } };
  }) => {
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
    // if (!view:any) return;
    // view._component.measureInWindow((winX, winY, winWidth, winHeight) => {
    //   contentHeight = winHeight;
    //   applyMeasurements();
    // });
  };

  const removeRead = (message: any) => {
    log.info(message);
    log.info('Read it');
    // message.updateReadState(true);
  };

  const playVideoMessage = (videoUrl: string, message: any) => {
    const parms = { videoUrl, audioUrl: undefined };
    log.info('ConversationContainer', 'playVideoMessage', parms);
    NavigationService.navigate('VideoPlayer', parms);
    log.info('Marking video viewed');
    // conversationStoreInstance.markRead(message.messageId);
    removeRead(message);
  };

  const playAudioMessage = (message: any) => {
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
    NavigationService.navigate('AudioPlayer', parms);

    // Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms)
  };

  const toggleFooterActions = () => {
    setTimeout(() => {
      if (scrollRef.current && !showFooterActions) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 200);
    setShowFooterActions(!showFooterActions);
    applyMeasurements();
  };

  const onVideoMessageSent = (archiveId: string, videoUrl: string) => {
    try {
      scrollRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      log.info('ConversationContainer', 'onVideoMessageSent', 'Error', error);
    }
  };

  const sendVideoMessage = () => {
    Keyboard.dismiss();

    NavigationService.navigate('VideoRecorder', {
      finishedButtonTitle: 'Send',
      videoMessage: true,
      conversationId,
      submissionId: props?.route?.params?.candidate?.submissionId || '',
      onFinished: onVideoMessageSent(),
      // onMessageSendCallback: onMessageSend(),
    });
  };

  const sendTextMessage = async () => {
    if (!sendEnabled) {
      return;
    }
    clearMessageText();
    try {
      const { data } = await sendTextMessageService({
        conversationId: conversationId || null,
        submissionId: null,
        messageText: messageText.replace(/\s+$/g, ''),
        messageTypeId: '1',
      });
      Keyboard.dismiss();
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
        onNo: () => { },
      });
    }
  };

  const videoCall = async (data: any, userId: any, submissionId: any) => {
    try {
      const payload = {
        submissionId,
        userId: userId ? [userId] : '',
      };

      const { data } = await initVideoConferenceService(payload);
      let result = {
        sessionId: data.sessionId,
        token: data.token,
        autoAnswer: true,
        isOutgoing: true,
      };
      NavigationService.navigate('VideoCalling', result);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      // setRefreshing(false);
      // setMessageTexts(messageText);
      // setSendEnabled(!!messageText);
      // showYesNoAlert({
      //   title: 'Send Error',
      //   message: 'The message could not be sent. Please try again.',
      //   yesTitle: 'Try Again',
      //   noTitle: 'Cancel',
      //   // onYes: this.sendTextMessage.bind(this),
      //   onNo: () => {},
      // });
    }
  };

  const initVideoCall = () => {
    NavigationService.navigate('VideoCalling');
    // let hcpUserId = messageList ? messageList.hcpUserId : userId;
    // let submissionId = messageList
    //   ? messageList.submissionId
    //   : props.submissionId;
    // const payload = {
    //   title: '',
    //   name: recipientName || '',
    //   subTitle: '',
    //   photo: photoUrl || '',
    // };
    // return videoCall(payload, userId, submissionId);
  };

  const initPhoneCall = () => {
    setPhoneCallModalVisible(true);
    // if (this.canMakePhoneCall) {
    //   // Actions.push(ScreenType.HCP_PHONE_CALL_LIGHTBOX, {
    //   //     submissionId: this.submissionId,
    //   //     photoUrl: this.recipientPhotoUrl,
    //   //     title: this.recipientName
    //   // })
    // }
  };

  const renderAudioMessageView = (message: any, index: number) => {
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
        ]}
      >
        <TouchableHighlight
          activeOpacity={0.8}
          onPress={() => playAudioMessage(message)}
          style={[
            style.audioMessageWrapper,
            message.sentByMe ? style.audioMessageWrapperFromMe : {},
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Icon
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              name={'play-circle-outline'}
              color={message.sentByMe ? AppColors.white : AppColors.red}
              size={25}
            />
            <Text
              style={[
                style.audioMessageText,
                message.sentByMe ? style.audioMessageTextFromMe : {},
              ]}
            >
              Audio Message
            </Text>
          </View>
        </TouchableHighlight>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}
        >
          {caption}
        </Text>
      </View>
    );
  };

  const renderVideoMessageView = (message: any, index: number) => {
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
        ]}
      >
        <TouchableHighlight
          onPress={() => playVideoMessage(message.tokBoxArchiveUrl, message)}
          style={[
            style.videoMessageWrapper,
            message.sentByMe ? style.videoMessageWrapperFromMe : {},
          ]}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              name={'play-circle-outline'}
              color={message.sentByMe ? AppColors.white : AppColors.blue}
              size={28}
            />
            <Text
              style={[
                style.videoMessageText,
                message.sentByMe ? style.videoMessageTextFromMe : {},
              ]}
            >
              Video Message {message.read ? '' : ' *'}
            </Text>
          </View>
        </TouchableHighlight>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}
        >
          {caption}
        </Text>
      </View>
    );
  };

  const renderTextMessageView = (message: any, index: number) => {
    const time = moment(message.messageTimestamp).format('M/D/YYYY h:mm a');
    const caption = `${message.senderFirstName} ${message.senderLastName}, ${time}`;

    return (
      <View
        key={`message-${message.messageId}-${index}`}
        style={[
          style.messageView,
          style.textMessageView,
          message.sentByMe ? style.messageFromMeView : {},
        ]}
      >
        <View
          style={[
            style.textMessageTextWrapper,
            message.sentByMe ? style.textMessageTextWrapperFromMe : {},
          ]}
        >
          <Text
            selectable
            style={[
              style.textMessageText,
              message.sentByMe ? style.textMessageTextFromMe : {},
            ]}
          >
            {message.messageText}
          </Text>
        </View>
        <Text
          style={[style.caption, message.sentByMe ? style.captionFrom : {}]}
        >
          {caption}
        </Text>
      </View>
    );
  };

  const makeCall = (user: any) => {


    NavigationService.navigate('Callpage',);
    // setCalling(true);
    // try {
    //   setLoading(true);
    //   const {data} = await initiatePhoneCallService({
    //     conversationId: '',
    //     submissionId: submissionId,
    //     callbackNumber: callbackNumber,
    //     messageTypeId: '2',
    //   });
    //   console.log('response', data);
    //   setPhoneCallModalVisible(false);
    //   setLoading(false);
    // } catch (error) {
    //   setPhoneCallModalVisible(false);
    //   setLoading(false);
    //   console.log('Error', error);
    // }
  };

  const onCallbackChangeText = (callbackNumber: any) => {
    setCallBackNumber(phoneFormatter.stripFormatting(callbackNumber));
  };

  const renderMessageScrollView = () => {
    return (
      <ScrollView
        style={style.messageListView}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMessages(true)}
          />
        }
      >
        {phoneCallModalVisible && (
          <PhoneCallModal
            source={{
              uri: candidate
                ? candidate.photoUrl
                : props?.route?.params?.conversation?.hcpPhotoUrl,
            }}
            onPress={() => makeCall()}
            title={
              candidate
                ? candidate.display.title
                : props?.route?.params?.conversation?.display?.title
            }
            value={phoneFormatter.format10Digit(callbackNumber)}
            onChangeText={(text: any) => onCallbackChangeText(text)}
            disabled={!validPhone}
            onRequestClose={() => setPhoneCallModalVisible(false)}
            onDismiss={() => setPhoneCallModalVisible(false)}
            onClose={() => setPhoneCallModalVisible(false)}
          />
        )}
        {messageList.map((message, index) => {
          if (message.messageTypeId === '1') {
            return renderTextMessageView(message, index);
          }

          if (message.messageTypeId === '2') {
            return renderAudioMessageView(message, index);
          }

          if (message.messageTypeId === '3') {
            return renderVideoMessageView(message, index);
          }

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
              marginBottom: '24%',
              justifyContent: 'center',
              backgroundColor: AppColors.baseGray,
            },
          ]}
        >
          {renderMessageScrollView()}
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
          ]}
        >
          <ActivityIndicator color={AppColors.blue} style={{ flex: 1 }} />
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
        ]}
      >
        {
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 180,
            }}
          >
            {recipientName() && (
              <Text>This is your first conversation with</Text>
            )}
            {recipientName && <Text>{recipientName()}</Text>}
            {!recipientName && <Text>No Messages Available</Text>}
          </View>
        }
      </Animated.View>
    );
  };

  const renderFooter = () => {
    return (
      <Animated.View key="footer" style={[footerStyle.footerView]}>
        <Animated.View
          style={[footerStyle.inputRow, { height: footerInputHeight }]}
        >
          <View style={footerStyle.inputWrapper}>
            <ConexusIconButton
              imageSource={require('../../components/Images/more.png')}
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
            activeOpacity={0.8}
            style={StyleSheet.flatten([
              footerStyle.sendButton,
              !sendEnabled && footerStyle.sendButtonDisabled,
            ])}
            onPress={() => sendTextMessage()}
          >
            <Text
              style={[
                footerStyle.sendButtonText,
                !sendEnabled && footerStyle.sendButtonTextDisabled,
              ]}
            >
              SEND
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {!!showFooterActions && (
          <View style={[footerStyle.actionsRow]}>
            <ConexusIconButton
              disabled={!showFooterActions}
              title="Video Message"
              imageSource={require('../../components/Images/video-message.png')}
              iconSize={24}
              color={AppColors.blue}
              onPress={() => sendVideoMessage()}
              style={footerStyle.image}
              textStyle={footerStyle.actionButtonText}
            />
            {
              // canMakeVideoCall() && (
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Video Call"
                style={footerStyle.image}
                imageSource={require('../../components/Images/video-call.png')}
                iconSize={24}
                color={AppColors.blue}
                onPress={() => initVideoCall()}
                textStyle={footerStyle.actionButtonText}
              />
              // )
            }
            {
              // canMakePhoneCall() && (
              <ConexusIconButton
                disabled={!showFooterActions}
                title="Phone Call"
                style={footerStyle.image}
                imageSource={require('../../components/Images/phone-call.png')}
                iconSize={24}
                color={AppColors.blue}
                onPress={() => initPhoneCall()}
                textStyle={footerStyle.actionButtonText}
              />
              // )
            }
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: 'white' }]}>
      <Animated.View
        style={{ flex: 1, paddingBottom: paddingBottom }}
        onLayout={onLayout()}
        ref={animatableRef}
      >
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
      shadowOffset: { width: 0, height: 0.8 },
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
      shadowOffset: { width: 0, height: -0.8 },
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
  image: {
    width: 25,
    height: 25,
    marginHorizontal: 45,
    tintColor: AppColors.blue,
    alignSelf: 'center',
  },
  buttonText: {},
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
    width: 28,
    height: 28,
    margin: 12,
    tintColor: AppColors.blue,
    alignSelf: 'center',
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
    flexDirection: 'row',
    margin: 15,
    alignItems: 'stretch',
  },

  actionRowButton: {
    flex: 1,
    height: actionRowHeight,
  },

  actionButtonText: {
    ...AppFonts.bodyTextNormal,
    width: 100,
    marginBottom: -10,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '600',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: AppSizes.screen.width * 0.1,
    maxWidth: AppSizes.screen.width * 0.5,
    minWidth: AppSizes.screen.width * 0.5,
    padding: 8,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 8 : 8,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    ...getMessageShadows(),
    alignItems: 'flex-end',
    backgroundColor: AppColors.blue,
  },

  videoMessageText: {
    ...AppFonts.bodyTextMedium,
    paddingLeft: 8,
  },

  videoMessageTextFromMe: {
    ...AppFonts.bodyTextMedium,
    alignSelf: 'flex-end',
    color: AppColors.white,
  },

  audioMessageView: {},

  audioMessageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: AppSizes.screen.width * 0.5,
    minWidth: AppSizes.screen.width * 0.5,
    maxHeight: AppSizes.screen.width * 0.1,
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
    alignContent: 'center',
    textAlignVertical: 'center',
  },
  audioMessageTextFromMe: {
    ...AppFonts.bodyTextMedium,
    alignSelf: 'flex-end',
    color: AppColors.white,
    alignContent: 'center',
    textAlignVertical: 'center',
  },
});

export default ConversationContainer;
