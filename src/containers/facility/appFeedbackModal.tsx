import React, {Component, FC} from 'react';
// import {Container, Textarea} from 'native-base';
import {
  ViewProperties,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
// import { Actions } from 'react-native-router-flux'
import {
  ModalHeader,
  ConexusIconButton,
  ScreenFooterButton,
} from '../../components';
import {UserStore} from '../../stores';
import {AppFonts, AppColors} from '../../theme';

const SafeAreaView = require('react-native').SafeAreaView;

interface AppFeedbackModalProps extends ViewProperties {
  userStore: UserStore;
}

interface AppFeedbackModalState {
  messageText: string;
  sending: boolean;
}

const AppFeedbackModal: React.FC<AppFeedbackModalState> = ({}) => {
  // constructor(props, state) {
  //   super(props, state);

  //   this.state = {
  //     messageText: '',
  //     sending: false,
  //   };
  // }

  // componentWillMount() {}

  const sendMessage = () => {
    // const {userStore} = this.props;
    // const {messageText} = this.state;
    // if (!!!messageText.trim()) {
    //   return Promise.resolve(
    //     Alert.alert('Invalid Message', 'Please type a message to send.'),
    //   );
    // }
    // return userStore.selectedFacility.sendFeedback(messageText).then(
    //   () => {
    //     this.setState({sending: false});
    //     Alert.alert('Success', 'Your message has been sent.');
    //     // Actions.pop()
    //   },
    //   error => {
    //     this.setState({sending: false});
    //     Alert.alert(
    //       'Error',
    //       'An error occurred while sending your message. Please try again.',
    //     );
    //     console.error(error);
    //   },
    // );
  };

  // _renderForm() {
  //   const {messageText} = this.state;

  //   return (
  //     <View>
  //       <Textarea
  //         style={style.messageInput}
  //         maxLength={1000}
  //         rowSpan={12}
  //         placeholder="Type your feedback here"
  //         autoFocus={false}
  //         value={messageText}
  //         returnKeyType="done"
  //         blurOnSubmit={true}
  //         multiline={false}
  //         onChangeText={messageText => {
  //           this.setState({messageText});
  //         }}
  //       />
  //     </View>
  //   );
  // }

  // render() {
  //   const {sending} = this.state;

  return (
    <SafeAreaView>
      {/* <ModalHeader
        title="App Feedback"
        // right={() => (
        //   <ConexusIconButton
        //     iconName="cn-x"
        //     iconSize={15}
        //     // onPress={Actions.pop}
        //   ></ConexusIconButton>
        // )}
      /> */}
      <KeyboardAvoidingView style={style.innerContainer}>
        {/* {this._renderForm()} */}
      </KeyboardAvoidingView>
      {/* <ScreenFooterButton
        // disabled={sending}
        title="Send"
        onPress={sendMessage}
      /> */}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  formLabel: {
    ...AppFonts.bodyTextMedium,
    color: AppColors.darkBlue,
    fontWeight: '600',
    paddingRight: 16,
  },
  messageInput: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    borderColor: AppColors.lightBlue,
    borderWidth: 1,
    padding: 6,
    marginTop: 18,
  },
});

export default AppFeedbackModal;
