import React, {useState} from 'react';
import {StyleSheet, View, Alert, Image, Text, TextInput} from 'react-native';
import {ActionButton} from '../../components/action-button';
import {useSelector} from '../../redux/reducers/index';
import {AppColors, AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Toast from 'react-native-toast-message';
import {sendMessageService} from '../../services/auth';
import {Avatar} from '../../components/avatar';

const SafeAreaView = require('react-native').SafeAreaView;

interface AgentMessageModalProps extends ViewProperties {
  userStore: UserStore;
}

interface AgentMessageModalState {
  messageText: string;
  sending: boolean;
}

const AgentMessageModal = () => {
  const userInfo = useSelector(state => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageTextError, setMessageTextError] = useState(false);
  console.log('Okk====>', userInfo?.user?.userFacilities?.[0]?.facilityId);

  const messageTextBlur = () => {
    if (messageText && messageText.length) {
      setMessageTextError(false);
    } else {
      setMessageTextError(true);
    }
  };

  const renderAccountManager = () => {
    // const {userStore} = this.props;
    // const manager = userStore.selectedFacility.manager;

    return (
      <View style={managerStyle.container}>
        <View style={managerStyle.textContainer}>
          <Image
            style={managerStyle.image}
            source={require('../../components/Images/bg.png')}
          />
          <Text style={managerStyle.title}>
            {userInfo?.user?.userFacilities?.[0]?.manager?.acctManagerName}
          </Text>
        </View>
      </View>
    );
  };

  const onSendFeedback = async () => {
    if (messageText && messageText.length) {
      try {
        const {data} = await sendMessageService({
          note: messageText,
          facilityId: userInfo?.user?.userFacilities?.[0]?.facilityId,
        });
        setLoading(true);
        console.log('Data====>', data);
      } catch (error) {
        setLoading(false);
        console.log('Error', error);
        Alert.alert(
          error?.response?.statusText,
          error?.response?.data?.Message,
        );
        Toast.show({
          type: 'error',
          text2: error?.response?.data?.Message,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } else {
      messageTextBlur();
    }
  };

  // _sendMessage() {
  //   const {userStore} = this.props;
  //   const {messageText} = this.state;

  //   if (!!!messageText.trim()) {
  //     return Promise.resolve(
  //       Alert.alert('Invalid Message', 'Please type a message to send.'),
  //     );
  //   }

  //   return userStore.selectedFacility.sendMessage(messageText).then(
  //     () => {
  //       this.setState({sending: false});
  //       Alert.alert('Success', 'Your message has been sent.');
  //       // Actions.pop()
  //     },
  //     error => {
  //       this.setState({sending: false});
  //       Alert.alert(
  //         'Error',
  //         'An error occurred while sending your message. Please try again.',
  //       );
  //       console.error(error);
  //     },
  //   );
  // }

  const renderForm = () => {
    return (
      <View>
        <TextInput
          style={style.messageInput}
          maxLength={1000}
          rowSpan={12}
          placeholder="Type your mesaage"
          placeholderTextColor={AppColors.mediumGray}
          autoFocus={false}
          value={messageText}
          showError={messageTextError}
          returnKeyType="done"
          errorMessage={'Invalid Message please type a message to send.'}
          blurOnSubmit={true}
          multiline={false}
          onBlur={messageTextBlur}
          onChangeText={(text: any) => setMessageText(text)}
        />
      </View>
    );
  };

  return (
    <View style={style.container}>
      {renderAccountManager()}
      {renderForm()}
      <View style={style.footer}>
        <ActionButton
          loading={loading}
          title="SEND"
          customStyle={style.btnEnable}
          onPress={onSendFeedback}
        />
      </View>
    </View>
  );
};

const managerStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 15,
  },
  avatar: {
    paddingRight: 8,
  },
  image: {
    position: 'absolute',
    marginLeft: 5,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  textContainer: {
    // flex: 1,
    marginBottom: -20,
    flexDirection: 'row',
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    color: AppColors.blue,
    marginLeft: 70,
    marginTop: 15,
    alignSelf: 'center',
  },
});

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },

  messageInput: {
    textAlignVertical: 'top',
    backgroundColor: AppColors.white,
    marginTop: 40,
    height: 380,
    fontSize: 16,
    color: AppColors.black,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.gray,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
});

export default AgentMessageModal;
