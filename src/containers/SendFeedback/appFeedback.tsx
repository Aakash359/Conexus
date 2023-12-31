import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import {ActionButton} from '../../components/action-button';
import {useSelector} from '../../redux/reducers/index';
import {AppColors} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import NavigationService from '../../navigation/NavigationService';
import {appFeedbackService} from '../../services/ApiServices';
import {Strings} from '../../common/Strings';
interface AppFeedbackModalState {
  messageText: string;
}
const SafeAreaView = require('react-native').SafeAreaView;
const {FEEDBACK_NOTIFY, SEND, API_ERROR, INVALID_MSG, TYPE_FEEDBACK} = Strings;
const SendFeedback = (props: AppFeedbackModalState) => {
  const userInfo = useSelector(state => state.userReducer);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');

  const onSendFeedback = async () => {
    if (messageText && messageText.length) {
      try {
        setLoading(true);
        const {data} = await appFeedbackService({
          note: messageText,
          facilityId: userInfo?.user?.userFacilities?.[0]?.facilityId,
        });
        if (data?.Success) {
          setLoading(false);
          Keyboard.dismiss();
          setMessageText('');
          NavigationService.navigate('ReviewCandidateHomeScreen');
          ToastAndroid.show(FEEDBACK_NOTIFY, ToastAndroid.SHORT);
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
          placeholder={TYPE_FEEDBACK}
          placeholderTextColor={AppColors.mediumGray}
          autoFocus={false}
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
      {renderForm()}
      <View style={style.footer}>
        <ActionButton
          loading={loading}
          title={SEND}
          customStyle={style.btnEnable}
          onPress={onSendFeedback}
        />
      </View>
    </SafeAreaView>
  );
};

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

export default SendFeedback;
