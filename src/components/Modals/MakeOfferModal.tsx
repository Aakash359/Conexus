import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
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
  source: string;
  photoLabel: string;
  candidateTitle: string;
  candidateDescription: string;
  startDateProp: string;
  customStyle: any;
  onPress: any;
  value: any;
  onChange: any;
  onMakeOffer: any;
}

export const MakeOfferModal = (props: MakeOfferLightboxProps) => {
  const {
    source,
    onClose,
    value,
    photoLabel,
    candidateTitle,
    cancel,
    onMakeOffer,
    onPress,
    visible,
    customStyle,
    startDateProp,
    title,
    customTitleStyle,
    candidateDescription,
  } = props;

  const dateFormat = 'MM/DD/YYYY';

  const [startDate, setStartDate] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {}, []);

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event: any, selectedDate: Date) => {
    let currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.onChange(currentDate);
    console.log('selectedDate====>', data);
  };

  const onStartDatePicked = () => {
    showMode('date');
  };

  const onSubmit = () => {
    let startDate = moment(date).format(dateFormat);
    props.onMakeOffer(startDate);
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
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
            <Image source={source} style={styles.circleStyle} />
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
              }}
            >
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
              title={value ? value : 'statDate'}
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
              onPress={onSubmit}
            />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                minimumDate={new Date()}
                is24Hour={true}
                onChange={onChange}
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
  circleStyle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
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
