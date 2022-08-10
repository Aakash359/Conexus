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
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

interface MakeOfferLightboxProps {
  photoUrl: string;
  photoLabel: string;
  candidateTitle: string;
  candidateDescription: string;
  startDateProp: string;
  customStyle: any;
  onSubmit: ({startDate: string}) => any;
}

export const MakeOfferModal = (props: MakeOfferLightboxProps) => {
  const {
    photoUrl,
    onClose,
    photoLabel,
    candidateTitle,
    cancel,
    visible,
    customStyle,
    startDateProp,
    title,
    onSubmit,
    customTitleStyle,
    candidateDescription,
  } = props;

  const dateFormat = 'MM/DD/YYYY';

  const [startDate, setStartDate] = useState(
    moment(startDateProp).isValid()
      ? moment(startDateProp).format(dateFormat)
      : moment().format(dateFormat),
  );
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [mode1, setMode1] = useState('date');
  const [mode2, setMode2] = useState('date');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {}, []);

  const showMode1 = currentMode => {
    setShow1(true);
    console.log('Shiwe====>', setShow1(true));

    setMode1(currentMode);
  };

  const onChange1 = (event: any, selectedDate: Date) => {
    let currentDate1 = selectedDate || date1;
    console.log('Datre====>');

    setShow1(Platform.OS === 'ios');
    setDate1(currentDate1);
    let tempDate = new Date(currentDate1);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1) +
      '/' +
      tempDate.getFullYear();
  };

  const onStartDatePicked = () => {
    showMode1('date');
  };

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
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.topBackground}>
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
          </View>
          <View style={styles.containerStart}>
            <Avatar
              style={{width: 108, marginBottom: 8}}
              size={108}
              source={photoUrl || ''}
              title={photoLabel || ''}
            />
            <Text style={AppFonts.bodyTextXtraLarge}>
              {candidateTitle || ''}
            </Text>
            {!!candidateDescription && (
              <Text style={AppFonts.bodyTextXtraSmall}>
                {candidateDescription}
              </Text>
            )}
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
              onPress={onStartDatePicked}
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
            {show1 && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date1}
                mode={mode1}
                is24Hour={true}
                onChange={onChange1}
                placeholder=" "
              />
            )}
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
    left: 5,
    textAlign: 'center',
  },
});
