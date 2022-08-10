import React from 'react';
import {Text, Button} from 'native-base';
import {View, StyleSheet, ViewProperties, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {inject} from 'mobx-react';
import {ConexusLightbox} from './base-lightbox';
import {creatInputChangeHandler} from '../common';
import {ActionButton, Avatar, Field} from '../components';
import {DatePickerDialog} from 'react-native-datepicker-dialog';
import {FacilitySubmissionsStore} from '../stores/facility';
import {AppColors, AppFonts, AppSizes} from '../theme';
import moment from 'moment';
import {logger} from 'react-native-logs';
const log = logger.createLogger();
interface MakeOfferLightboxProps extends ViewProperties {
  photoUrl: string;
  photoLabel: string;
  candidateTitle: string;
  candidateDescription: string;
  startDate: string;
  onSubmit: ({startDate: string}) => any;
}

interface MakeOfferLightboxState {
  startDate: string;
}

const dateFormat = 'MM/DD/YYYY';

@inject('facilitySubmissionsStore')
export class MakeOfferLightbox extends React.Component<
  MakeOfferLightboxProps,
  MakeOfferLightboxState
> {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(props.startDate).isValid()
        ? moment(props.startDate).format(dateFormat)
        : moment().format(dateFormat),
    };
  }

  submitOffer() {
    this.props.onSubmit({startDate: this.state.startDate});
    Actions.pop();
  }

  onStartDatePicked = date => {
    this.setState({
      startDate: moment(date).format(dateFormat),
    });
  };

  onStartDatePressed = () => {
    log.info('onStartDatePressed');
    const dialog = this.refs['startDateDialog'] as any;
    //To open the dialog
    dialog.open({
      date: moment(this.state.startDate).toDate(),
      minDate: moment().toDate(),
      maxDate: moment().add(2, 'year').toDate(),
    });
  };

  render() {
    const {photoUrl, photoLabel, candidateTitle, candidateDescription} =
      this.props;
    const {startDate} = this.state;

    return (
      <ConexusLightbox
        title="Make Offer"
        closeable
        verticalPercent={0.8}
        horizontalPercent={0.9}>
        <View style={styles.topBackground}></View>
        <View style={styles.containerStart}>
          <Avatar
            style={{width: 108, marginBottom: 8}}
            size={108}
            source={photoUrl || ''}
            title={photoLabel || ''}></Avatar>
          <Text style={AppFonts.bodyTextXtraLarge}>{candidateTitle || ''}</Text>
          {!!candidateDescription && (
            <Text style={AppFonts.bodyTextXtraSmall}>
              {candidateDescription}
            </Text>
          )}
          <Text
            style={{
              ...AppFonts.bodyTextNormal,
              fontWeight: '500',
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
            title={startDate}
            onPress={this.onStartDatePressed.bind(this)}
          />
        </View>
        <View style={styles.containerEnd}>
          <ActionButton
            primary
            style={{width: '60%', marginTop: 18}}
            title="Make Offer"
            onPress={() => {
              this.submitOffer();
            }}
          />
          <ActionButton
            secondary
            style={{width: '60%', marginTop: 18}}
            title="Cancel"
            onPress={() => {
              Actions.pop();
            }}
          />
        </View>
        <DatePickerDialog
          ref="startDateDialog"
          onDatePicked={this.onStartDatePicked.bind(this)}
        />
      </ConexusLightbox>
    );
  }
}

const styles = StyleSheet.create({
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 118,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52,170,224, .24)',
    backgroundColor: 'rgba(52,170,224, .2)',
  },
  containerStart: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  containerEnd: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
});
