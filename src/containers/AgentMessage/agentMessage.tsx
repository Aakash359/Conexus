import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Text,
  TextInput,
  ToastAndroid,
  Keyboard,
  Platform,
} from 'react-native';
import {ActionButton} from '../../components/action-button';
import {useSelector} from '../../redux/reducers/index';
import {AppColors} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import NavigationService from '../../navigation/NavigationService';
import {sendMessageService} from '../../services/ApiServices';
import {Strings} from '../../common/Strings';

const SafeAreaView = require('react-native').SafeAreaView;
const {MESSAGE_SENT, TYPE_MESSAGE, API_ERROR, INVALID_MSG, SEND} = Strings;
const AgentMessage = () => {
  const userInfo = useSelector(state => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageTextError, setMessageTextError] = useState(false);

  const messageTextBlur = () => {
    if (messageText && messageText.length) {
      setMessageTextError(false);
    } else {
      setMessageTextError(true);
    }
  };

  const renderAccountManager = () => {
    return (
      <View style={managerStyle.textContainer}>
        <Image
          style={managerStyle.image}
          source={require('../../components/Images/bg.png')}
        />
        <Text style={managerStyle.title}>
          {userInfo?.user?.userFacilities?.[0]?.manager?.acctManagerName}
        </Text>
      </View>
    );
  };

  const onSendMessage = async () => {
    if (messageText && messageText.length) {
      try {
        setLoading(true);
        const {data} = await sendMessageService({
          note: messageText,
          facilityId: userInfo?.user?.userFacilities?.[0]?.facilityId,
        });
        if (data?.Success) {
          Keyboard.dismiss();
          setLoading(false);
          setMessageText('');
          NavigationService.navigate('ReviewCandidateHomeScreen');
          ToastAndroid.show(MESSAGE_SENT, ToastAndroid.SHORT);
        } else {
          setLoading(false);
          ToastAndroid.show(API_ERROR, ToastAndroid.SHORT);
        }
      } catch (error) {
        setLoading(false);
        console.log('Error', error);
        Alert.alert(
          error?.response?.statusText,
          error?.response?.data?.Message,
        );
      }
    } else {
      Alert.alert('Invalid message', INVALID_MSG);
    }
  };

  const renderForm = () => {
    return (
      <View style={style.messageInput}>
        <TextInput
          style={style.textInput}
          maxLength={1000}
          rowSpan={12}
          placeholder={TYPE_MESSAGE}
          placeholderTextColor={AppColors.mediumGray}
          value={messageText}
          returnKeyType="done"
          multiline={true}
          onChangeText={(text: any) => setMessageText(text)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      {renderAccountManager()}
      {renderForm()}
      <View style={style.footer}>
        <ActionButton
          loading={loading}
          title={SEND}
          customStyle={style.btnEnable}
          onPress={onSendMessage}
        />
      </View>
    </SafeAreaView>
  );
};

const managerStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
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
    marginTop: 12,
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
    backgroundColor: AppColors.baseGray,
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
  textInput: {
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  messageInput: {
    alignSelf: 'center',
    borderWidth: 0.8,
    borderColor: AppColors.lightBlue,
    backgroundColor: AppColors.white,
    marginTop: 40,
    height: 350,
    fontSize: 16,
    color: AppColors.black,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5,
  },
});

export default AgentMessage;
