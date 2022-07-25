// import autobind from 'autobind-decorator';
// import React, {Component} from 'react';
// import {windowDimensions} from '../common';
// import {AppColors} from '../theme';
// // import {Item, Input, View} from 'native-base';
// import {
//   TextStyle,
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
// } from 'react-native';
// import theme from '../theme';
// import {phoneFormatter} from '../common/index';

// interface TextFieldProps {
//   placeholder: string;
//   defaultValue?: string;
//   last?: boolean;
//   inverse?: boolean;
//   right?: () => any;
//   disabled?: boolean;
// }

// const Field :React.FC<TextFieldProps> ({
//   placeholder,
//   isSecure = false,
//   onTextChange,
// })=>{

//     return (
//       <TextInput
//         style={style.input}
//         onChangeText={(text) => onTextChange(text)}
//         placeholder={placeholder}
//         placeholderTextColor={AppColors.gray}
//         autoCapitalize={autoCapitalize}

//       />
//     );

// }

// // const PhoneNumberField = ()=> {
// //   constructor(props: FieldProps, context: any) {
// //     super(props, context);
// //   }

// //   componentWillMount() {
// //     super.componentWillMount();
// //     this.setPhoneNumber(this.props.value || '');
// //   }

// //   setPhoneNumber(value: string) {
// //     this.setValue(phoneFormatter.stripFormatting(value));
// //   }

// //   renderField() {
// //     const props = this.props;

// //     let onChange = this.props.onChange;
// //     let onChangeText = this.props.onChangeText;

// //     if (onChange) {
// //       onChange = (event: any) => {
// //         this.setPhoneNumber(event.nativeEvent.text);
// //         event.nativeEvent.text = this.value;
// //         props.onChange(event);
// //       };
// //     }

// //     if (onChangeText) {
// //       onChangeText = text => {
// //         this.setPhoneNumber(text);
// //         props.onChangeText(this.value);
// //       };
// //     }

// //     const value = phoneFormatter.format10Digit(this.value);
// //     const {placeholder, autoCapitalize, keyboardType} = this.props;
// //     return (
// //       <TextInput
// //         placeholder={placeholder}
// //         maxLength={12}
// //         keyboardType={keyboardType}
// //         placeholderTextColor={AppColors.gray}
// //         onChangeText={this.setPhoneNumber.bind(this)}
// //         {...{style: this.getStyle()}}
// //         {...this.props}
// //         value={value}
// //         {...{onChange, onChangeText}}
// //       />
// //       // <Input
// //       //   keyboardType="phone-pad"
// //       //   placeholderTextColor={theme.gray}
// //       //   onChangeText={this.setPhoneNumber.bind(this)}
// //       //   maxLength={12}
// //       //   {...{style: this.getStyle()}}
// //       //   {...this.props}
// //       //   {...{onChange, onChangeText}}
// //       //   value={value}
// //       // />
// //     );
// //   }
// // }

// const style = StyleSheet.create({
//   input: {
//     height: windowDimensions.height * 0.08,
//     width: windowDimensions.width * 0.8,
//     borderWidth: 2,
//     borderColor: AppColors.lightBlue,
//     borderRadius: 8,
//     fontWeight: 'bold',
//     fontSize: 15,
//     paddingLeft: 10,
//   },
//   container: {
//     flex: 1,
//   },
//   containerNoQuestions: {
//     paddingTop: 60,
//   },
// });

// export default Field

import React, {useState, useEffect, VoidFunctionComponent} from 'react';
import {windowDimensions} from '../common';
import {AppColors} from '../theme';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface TextFieldProps {
  placeholder: string;
  defaultValue?: string;
  isSecure?: boolean;
  onTextChange: Function;
  value: string;
  returnKeyType: string;
  onFocus: Function;
  autoCapitalize: any;
  keyboardType: any;
  showError: boolean;
  errorMessage: string;
  handleFocus: () => void;
  onBlur: () => void;
  autoFocus: any;
  hideLabel: any;
  handleBlur: () => void;
  maxLength: number;
  customStyle: any;
}

export const Field: React.FC<TextFieldProps> = ({
  placeholder,
  isSecure = false,
  onTextChange,
  value,
  onFocus,
  maxLength,
  autoCapitalize,
  returnKeyType = 'next',
  keyboardType = 'default',
  showError,
  errorMessage,
  autoFocus,
  hideLabel,
  onBlur,
  customStyle,
}) => {
  const [isPassword, setIsPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (props: any) => {
    setIsFocused(true);
    if (props.handleFocus) {
      props.handleFocus();
    }
  };

  const handleBlur = (props: any) => {
    if (hideLabel) {
      setIsFocused(true);
    } else {
      if (!value) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    }
    if (onBlur) {
      onBlur();
    }
  };

  useEffect(() => {
    setIsPassword(isSecure);
    handleBlur();
    if (autoFocus) {
      handleFocus();
    }
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onFocus={handleFocus}
        keyboardType={keyboardType}
        placeholderTextColor={AppColors.gray}
        autoCapitalize={autoCapitalize}
        secureTextEntry={isPassword}
        onBlur={() => handleBlur(true)}
        errorMessage={showError ? errorMessage : null}
        returnKeyType={returnKeyType}
        onChangeText={text => onTextChange(text)}
        style={[styles.textField, {...customStyle}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowDimensions.height * 0.08,
    width: windowDimensions.width * 0.8,
    borderWidth: 2,
    borderColor: AppColors.lightBlue,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 10,
  },
  textField: {
    flex: 1,
    fontWeight: '500',
    height: 50,
    fontSize: 18,
    color: AppColors.black,
  },
});
