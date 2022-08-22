import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import {AppColors, AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {ActionButton} from '../action-button';
import {Avatar} from '../avatar';

interface HcpPhoneCallProps {
  submissionId: string;
  photoUrl: string;
  photoLabel?: string;
  title?: string;
  description?: string;
  phoneNumber?: string;
  onClose: any;
  visible: any;
  customStyle: any;
  customTitleStyle: any;
  onPress: any;
  value: any;
  disabled: any;
  onChangeText: any;
  onSubmit: ({startDate: string}) => any;
  // conversationStore: typeof ConversationStore.Type;
}

interface HcpPhoneCallState {
  callbackNumber: string;
  calling: boolean;
}

export const PhoneCallModal = (
  props: HcpPhoneCallProps,
  state: HcpPhoneCallState,
) => {
  const [loading, setLoading] = useState(false);
  const {
    photoUrl,
    onPress,
    description,
    onClose,
    photoLabel,
    visible,
    value,
    onChangeText,
    disabled,
    customStyle,
    title,
    customTitleStyle,
  } = props;

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}>
      <View style={styles.cardStyle}>
        <View style={styles.cardItemStyle}>
          <View style={styles.wrapperView}>
            <Text style={styles.titleText}>{'Candidate Phone Call'}</Text>
            <Icon
              style={{
                color: AppColors.mediumGray,
                alignSelf: 'flex-end',
                right: 10,
                top: 16,
              }}
              name="ios-close-circle-sharp"
              size={22}
              onPress={onClose}
            />
          </View>
          <View style={styles.containerStart}>
            <Avatar
              style={{width: 108, marginBottom: 8}}
              size={108}
              source={photoUrl || ''}
              title={photoLabel || ''}
            />
            <Text style={AppFonts.bodyTextXtraLargeTouchable}>{title}</Text>
            {!!description && (
              <Text style={AppFonts.bodyTextXtraSmall}>{description}</Text>
            )}
            <Text
              style={[
                AppFonts.bodyTextNormal,
                {textAlign: 'center', marginTop: 24},
              ]}>
              Please confirm your phone number. This number will ring shortly,
              then we will connect your call.
            </Text>
            <Text
              style={[
                AppFonts.bodyTextNormal,
                {marginTop: 28, color: AppColors.darkBlue, fontWeight: 'bold'},
              ]}>
              Callback Number
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              keyboardType="numeric"
              value={value}
              onChangeText={onChangeText}
              placeholder="XXX-XXX-XXXX"
              maxLength={12}
              style={styles.phoneInput}
            />
          </View>

          <View style={styles.containerEnd}>
            <ActionButton
              customTitleStyle={{
                fontSize: 14,
                color: AppColors.white,
                fontFamily: AppFonts.family.fontFamily,
              }}
              loading={loading}
              disabled={disabled}
              customStyle={styles.makeOfrBtn}
              title="CALL"
              onPress={onPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  phoneInput: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: AppColors.gray,
    justifyContent: 'center',
    width: windowDimensions.width * 0.6,
    marginTop: 4,
    textAlign: 'center',
    color: AppColors.darkBlue,
    ...AppFonts.bodyTextXtraLarge,
  },
  date: {
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    height: 30,
    borderRadius: 3,
    width: windowDimensions.width * 0.3,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
  },
  topBackground: {
    position: 'absolute',
    top: -18,
    left: -38,
    right: -38,
    height: 128,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52,170,224, .24)',
    backgroundColor: 'rgba(52,170,224, .2)',
  },
  makeOfrBtn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
    borderColor: AppColors.gray,
  },

  containerStart: {
    flex: 1,
    top: 40,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  wrapperView: {
    flexDirection: 'row',
  },
  containerEnd: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  notInterested: {
    alignSelf: 'center',
    backgroundColor: AppColors.red,
    height: 45,
    width: windowDimensions.width * 0.7,
  },
  cancelBtn: {
    alignSelf: 'center',
    marginTop: 15,
    backgroundColor: AppColors.white,
    width: windowDimensions.width * 0.5,
    borderWidth: 1,
    borderColor: AppColors.gray,
  },
  cardItemStyle: {
    width: windowDimensions.width * 0.8,
    height: windowDimensions.height * 0.7,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    paddingTop: 15,

    alignItems: 'center',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 16,
    color: AppColors.mediumGray,
    width: '80%',
    left: 5,
    top: 17,
    textAlign: 'center',
  },
});
