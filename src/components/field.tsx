import React, {useState} from 'react';
import {windowDimensions} from '../common';
import {AppColors} from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  maxLength: number;
  customStyle: any;
  secureTextEntry: boolean;
  error: string;
  password: any;
  hidePassword: any;
  onSubmit: any;
}

export const Field = (props: TextFieldProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const {
    placeholder,
    onTextChange,
    value,
    maxLength,
    autoCapitalize,
    returnKeyType,
    keyboardType,
    error,
    password,
    onFocus = () => {},
    customStyle,
  } = props;

  return (
    <>
      <View
        style={[
          styles.container,
          {borderColor: isFocused ? AppColors.gray : AppColors.lightBlue},
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          keyboardType={keyboardType}
          placeholderTextColor={AppColors.gray}
          autoCapitalize={autoCapitalize}
          onBlur={() => setIsFocused(false)}
          returnKeyType={returnKeyType}
          onChangeText={text => onTextChange(text)}
          style={[styles.textField, {...customStyle}]}
        />
      </View>
      {error && (
        <Text style={{marginTop: 7, color: AppColors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </>
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
    fontWeight: '700',
    height: 50,
    fontSize: 18,
    paddingLeft: 10,
    color: AppColors.mediumGray,
  },
});

export const Passwordfield = (props: TextFieldProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const {
    placeholder,
    onTextChange,
    value,
    hidePassword,
    onSubmit,
    maxLength,
    autoCapitalize,
    returnKeyType,
    keyboardType,
    error,
    password,
    onFocus = () => {},
    customStyle,
  } = props;

  return (
    <>
      <View
        style={[
          passwordstyles.container,
          {borderColor: isFocused ? AppColors.gray : AppColors.lightBlue},
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          keyboardType={keyboardType}
          placeholderTextColor={AppColors.gray}
          autoCapitalize={autoCapitalize}
          secureTextEntry={hidePassword}
          onBlur={() => setIsFocused(false)}
          returnKeyType={returnKeyType}
          onChangeText={text => onTextChange(text)}
          style={[passwordstyles.textField, {...customStyle}]}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={passwordstyles.touachableButton}
          onPress={onSubmit}
        >
          <Icon
            name={hidePassword ? 'eye-off' : 'eye'}
            style={{color: AppColors.blue, fontSize: 22}}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={{marginTop: 7, color: AppColors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </>
  );
};

const passwordstyles = StyleSheet.create({
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
  touachableButton: {
    position: 'absolute',
    right: 15,
    marginTop: 22,
  },
  textField: {
    flex: 1,
    fontWeight: '700',
    height: 50,
    fontSize: 18,
    paddingLeft: 10,
    color: AppColors.mediumGray,
  },
});
