import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Text,
} from 'react-native';
import {ActionButton, Avatar} from '../components';
import {UserStore, ConversationStore} from '../stores';
import {AppFonts, AppColors} from '../theme';
import {ConexusLightbox} from './base-lightbox';
import {phoneFormatter} from '../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
interface HcpPhoneCallProps {
  submissionId: string;
  photoUrl: string;
  photoLabel?: string;
  title?: string;
  description?: string;
  phoneNumber?: string;

  conversationStore: typeof ConversationStore.Type;
  userStore: UserStore;
}

interface HcpPhoneCallState {
  callbackNumber: string;
  calling: boolean;
}

export class HcpPhoneCallLightbox extends React.Component<
  HcpPhoneCallProps,
  HcpPhoneCallState
> {
  constructor(props: HcpPhoneCallProps, state: HcpPhoneCallState) {
    super(props, state);

    this.state = {
      callbackNumber: props.userStore.user.phoneNumber,
      calling: false,
    };
  }

  _call() {
    const {conversationStore, submissionId} = this.props;
    const {callbackNumber} = this.state;
    this.setState({calling: true});

    Keyboard.dismiss();

    setTimeout(() => {
      conversationStore
        .initiatePhoneCall(submissionId, callbackNumber)
        .then(result => {
          this.setState({calling: true});
          this.forceUpdate();
        })
        .catch(error => {
          Alert.alert(
            'Communications Error',
            'An error occurred while contacting the candidate. Please try again',
          );
          this.setState({calling: false});
          this.forceUpdate();
        });
    });
  }

  _onCallbackChangeText(callbackNumber) {
    this.setState({
      callbackNumber: phoneFormatter.stripFormatting(callbackNumber),
    });
  }

  render() {
    const {photoUrl, photoLabel, title, description} = this.props;
    const {callbackNumber, calling} = this.state;
    const validPhone = phoneFormatter.isValid10DigitPhoneNumber(callbackNumber);

    return (
      <ConexusLightbox
        closeable
        style={{padding: 0}}
        title={'Candidate Phone Call'}
        horizontalPercent={0.8}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={styles.content}>
            <Avatar
              style={{width: 108, marginBottom: 8}}
              size={108}
              source={photoUrl}
              title={photoLabel}></Avatar>
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
                {marginTop: 28, color: AppColors.darkBlue, fontWeight: '600'},
              ]}>
              Callback Number
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              keyboardType="numeric"
              value={phoneFormatter.format10Digit(callbackNumber)}
              onChangeText={this._onCallbackChangeText.bind(this)}
              placeholder="XXX-XXX-XXXX"
              maxLength={12}
              style={[
                {
                  alignSelf: 'stretch',
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: AppColors.gray,
                  padding: 6,
                  margin: 6,
                  textAlign: 'center',
                  color: AppColors.darkBlue,
                  ...AppFonts.bodyTextXtraLarge,
                },
              ]}></TextInput>

            {!calling && (
              <ActionButton
                primary
                style={{margin: 20, marginTop: 40}}
                disabled={!validPhone}
                title="Call"
                onPress={this._call.bind(this)}></ActionButton>
            )}
            {calling && (
              <View style={{marginTop: 32, marginBottom: 32}}>
                <ActivityIndicator
                  style={{marginBottom: 8}}
                  color={AppColors.blue}
                />
                <Text style={[AppFonts.bodyTextXtraLarge]}>Calling Now</Text>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </ConexusLightbox>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 0,
  },
  lightboxFooter: {
    backgroundColor: '#F0FAFF',
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  candidateName: {
    ...AppFonts.bodyTextLarge,
  },
});
