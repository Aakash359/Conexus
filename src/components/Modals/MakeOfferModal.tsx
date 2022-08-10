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
import {Avatar} from '../avatar';
import NavigationService from '../../navigation/NavigationService';

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
  cancel: any;
}

export const MakeOfferModal = (props: NotInterestedModalProps) => {
  const {
    visible,
    title,
    onClose,
    data,
    cancel,
    customStyle,
    textColor,
    borderColor,
    disabled,
    customTitleStyle,
  } = props;

  const [loading, setLoading] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
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
            <View style={styles.topBackground}></View>
          </View>
          <View style={styles.containerStart}>
            <Avatar
              style={{width: 108, marginBottom: 8}}
              size={108}
              // source={photoUrl || ''}
              // title={photoLabel || ''}
            />

            <Text style={AppFonts.bodyTextXtraLarge}>
              {/* {candidateTitle || ''} */}
            </Text>
            {/* {!!candidateDescription && (
                <Text style={AppFonts.bodyTextXtraSmall}>
                  {candidateDescription}
                </Text>
              )} */}
            <Text
              style={{
                ...AppFonts.bodyTextNormal,
                fontWeight: '900',
                marginTop: 32,
                marginBottom: 8,
              }}>
              Confirm Start Date
            </Text>
            <ActionButton
              smallSecondaryNotRounded
              textStyle={{
                ...AppFonts.bodyTextNormalTouchable,
                textAlign: 'center',
              }}
              customTitleStyle={{
                fontSize: 10,
                color: AppColors.blue,
                fontFamily: AppFonts.family.fontFamily,
              }}
              customStyle={styles.date}
              title={'statDate'}
              // onPress={this.onStartDatePressed.bind(this)}
            />
          </View>
          <View style={styles.containerEnd}>
            <ActionButton
              customTitleStyle={{
                fontSize: 14,
                color: AppColors.white,
                fontFamily: AppFonts.family.fontFamily,
              }}
              customStyle={styles.makeOfrBtn}
              title="MAKE OFFER"
              onPress={() => {
                // this.submitOffer();
              }}
            />
            <ActionButton
              customTitleStyle={{
                fontSize: 14,
                color: AppColors.blue,
                fontFamily: AppFonts.family.fontFamily,
              }}
              customStyle={styles.cancelBtn}
              title="CANCEL"
              onPress={props.cancel}
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
    left: -18,
    right: -18,
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
    top: 30,
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
    width: windowDimensions.width * 0.9,
    height: windowDimensions.height * 0.8,
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
    left: 20,
    textAlign: 'center',
  },
});
