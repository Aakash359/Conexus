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
}

export const ContactOptionModal = (props: NotInterestedModalProps) => {
  const {
    visible,
    title,
    onClose,
    onPress,
    data,
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
                iconName="cn-phone"
                iconSize={32}
                title="Phone Call"
                onPress={onPress}
              />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton
                iconName="cn-chat-bubble-1"
                iconSize={32}
                title="Message"
                // onPress={this._sendMessage.bind(this)}
              />
            </View>
          </View>
          <View style={styles.iconRow2}>
            <View style={styles.iconContainerLeft}>
              <ConexusIconButton
                iconName="cn-video-message"
                iconSize={32}
                title="Video Message"
                // onPress={this._videoMessage.bind(this)}
                // disabled={!videoCall}
              />
            </View>
            <View style={styles.iconContainerRight}>
              <ConexusIconButton
                iconName="cn-video"
                iconSize={32}
                title="Video Call"
                // onPress={this._videoCall.bind(this)}
                // disabled={!videoChat}
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
