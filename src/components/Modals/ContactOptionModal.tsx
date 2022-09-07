import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {AppColors, AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {ConexusIconButton} from '../../components/conexus-icon-button';

interface NotInterestedModalProps {
  title: string;
  onPress: Function;
  primary?: boolean;
  danger?: boolean;
  secondary?: boolean;
  smallSecondary?: boolean;
  smallSecondaryNotRounded?: boolean;
  style?: any;
  textColor?: any;
  disabled?: boolean;
  textStyle?: any;
  textStyleDisabled?: any;
  loadingProps: any;
  loadingColor: string;
  loading: any;
  buttonColor: any;
  borderColor: any;
  customStyle: any;
  customTitleStyle: any;
  visible: boolean;
  onClose: any;
  data: any;
  onPhoneCall: any;
  onMessage: any;
  onVideMessage: any;
  videoCall: any;
  videoChat: any;
}

export const ContactOptionModal = (props: NotInterestedModalProps) => {
  const {
    visible,
    title,
    onClose,
    onPress,
    onMessage,
    onVideMessage,
    videoCall,
    videoChat,
    customStyle,
    textColor,
    borderColor,
    disabled,
    customTitleStyle,
  } = props;

  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {}, []);

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      overlayPointerEvents={'auto'}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}>
      <View style={styles.cardStyle}>
        <View style={styles.cardItemStyle}>
          <View style={styles.wrapperView}>
            <Text style={styles.titleText}>{title}</Text>
            <Icon
              style={{color: AppColors.mediumGray, marginLeft: 15}}
              name="ios-close-circle-sharp"
              size={22}
              onPress={onClose}
            />
          </View>
          <View style={styles.iconRow1}>
            <View style={styles.iconContainerLeft}>
              <ConexusIconButton
                imageSource={require('../Images/phone-call.png')}
                style={styles.image}
                iconName="cn-phone"
                title="Phone Call"
                onPress={onPress}
              />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton
                style={styles.image}
                imageSource={require('../Images/message.png')}
                title="Message"
                onPress={onMessage}
              />
            </View>
          </View>
          <View style={styles.iconRow2}>
            <View style={styles.iconContainerLeft}>
              <ConexusIconButton
                style={
                  !videoCall
                    ? [
                        {
                          width: 35,
                          height: 35,
                          tintColor: AppColors.gray,
                          alignSelf: 'center',
                        },
                      ]
                    : [styles.image]
                }
                imageSource={require('../Images/video-call.png')}
                title="Video Message"
                onPress={onVideMessage}
                disabled={!videoCall}
              />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton
                style={
                  !videoChat
                    ? [
                        {
                          width: 35,
                          height: 35,
                          tintColor: AppColors.gray,
                          alignSelf: 'center',
                        },
                      ]
                    : [styles.image]
                }
                imageSource={require('../Images/video-message.png')}
                title="Video Call"
                // onPress={this._videoCall.bind(this)}
                disabled={!videoChat}
              />
            </View>
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
  image: {
    width: 35,
    height: 35,
    tintColor: AppColors.blue,
    alignSelf: 'center',
  },
  iconContainerRight: {
    padding: 12,
    borderLeftWidth: 1,
    borderColor: AppColors.lightBlue,
    width: '50%',
    height: '100%',
  },
  iconRow2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapperView: {
    flexDirection: 'row',
  },
  iconRow1: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: AppColors.lightBlue,
  },
  iconContainerLeft: {
    padding: 12,
    width: '50%',
    height: '100%',
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
    height: 45,
    width: windowDimensions.width * 0.7,
    borderWidth: 1,
    borderColor: AppColors.gray,
  },
  cardItemStyle: {
    width: windowDimensions.width * 0.9,
    height: windowDimensions.height * 0.4,
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
    textAlign: 'center',
  },
});
