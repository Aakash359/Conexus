import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  TextInput,
  Keyboard,
} from 'react-native';
import {ActionButton} from '../../components/action-button';
import {useSelector} from '../../redux/reducers/index';
import {AppColors} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Toast from 'react-native-toast-message';
import {appFeedbackService} from '../../services/sendFeedbackService';
import NavigationService from '../../navigation/NavigationService';

interface AppFeedbackModalState {
  messageText: string;
}
const SafeAreaView = require('react-native').SafeAreaView;

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
          ToastAndroid.show(
            'Feedback submitted successfully!',
            ToastAndroid.SHORT,
          );
        } else {
          setLoading(false);
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
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
      Alert.alert(
        'Invalid message',
        'Invalid message please type a message to send.',
      );
    }
  };

  const renderForm = () => {
    return (
      <View>
        <TextInput
          style={style.messageInput}
          maxLength={1000}
          rowSpan={12}
          placeholder="Type your feedback here"
          placeholderTextColor={AppColors.mediumGray}
          autoFocus={false}
          value={messageText}
          returnKeyType="done"
          multiline={false}
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
          title="SEND"
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

  messageInput: {
    textAlignVertical: 'top',
    backgroundColor: AppColors.white,
    marginTop: 40,
    height: 380,
    fontSize: 16,
    color: AppColors.black,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.lightBlue,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
});

export default SendFeedback;
