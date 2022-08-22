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
import {ActionButton} from '../action-button';

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
  onCancel: any;
  onAction: any;
}

export const NotInterestedModal = (props: NotInterestedModalProps) => {
  const {
    visible,
    title,
    onClose,
    loading,
    onPress,
    data,
    customStyle,
    textColor,
    borderColor,
    disabled,
    onCancel,
    customTitleStyle,
  } = props;

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
          <View
            style={[
              styles.wrapperView,
              {
                marginTop: 60,
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
            ]}>
            <ActionButton
              title="I'M NOT INTERESTED"
              loading={loading}
              customTitleStyle={{
                fontSize: 12,
                fontFamily: AppFonts.family.fontFamily,
              }}
              // disabled={inputs.email ? loading : 'false'}
              onPress={onPress}
              customStyle={styles.notInterested}
            />
            <ActionButton
              title="CANCEL"
              loading={loading}
              customTitleStyle={{
                color: AppColors.blue,
                fontSize: 12,
                fontFamily: AppFonts.family.fontFamily,
              }}
              // disabled={inputs.email ? loading : 'false'}
              // onPress={validate}
              onPress={props.onCancel}
              customStyle={styles.cancelBtn}
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
  wrapperView: {
    flexDirection: 'row',
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
