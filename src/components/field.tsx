import autobind from 'autobind-decorator';
import React, {Component} from 'react';
import {windowDimensions} from '../common';
import {AppColors} from '../theme';
// import {Item, Input, View} from 'native-base';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react/native';
import {
  TextInputProps,
  TextStyle,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import theme from '../theme';
import {phoneFormatter} from '../common/index';

interface FieldProps extends TextInputProps {
  placeholder: string;
  defaultValue?: string;
  last?: boolean;
  inverse?: boolean;
  right?: () => any;
  disabled?: boolean;
}

@observer
export class Field extends Component<FieldProps, any> {
  props: FieldProps;
  @observable value: string;

  componentWillMount() {
    this.setValue(this.props.defaultValue || '');
  }

  @autobind
  @action
  setValue(value: string) {
    this.value = value;
  }

  getStyle() {
    const {inverse} = this.props;
    return inverse
      ? ({
          color: theme.darkBlue,
          fontWeight: '400',
          paddingLeft: 14,
        } as TextStyle)
      : {};
  }

  render() {
    const {placeholder, autoCapitalize} = this.props;
    return (
      <TextInput
        style={style.input}
        placeholder={placeholder}
        placeholderTextColor={AppColors.gray}
        autoCapitalize={autoCapitalize}
        onChangeText={this.setValue}
        {...{value: this.value}}
        {...this.props}
      />
    );
  }
}

@observer
export class PhoneNumberField extends Field {
  constructor(props: FieldProps, context: any) {
    super(props, context);
  }

  componentWillMount() {
    super.componentWillMount();
    this.setPhoneNumber(this.props.value || '');
  }

  setPhoneNumber(value: string) {
    this.setValue(phoneFormatter.stripFormatting(value));
  }

  renderField() {
    const props = this.props;

    let onChange = this.props.onChange;
    let onChangeText = this.props.onChangeText;

    if (onChange) {
      onChange = (event: any) => {
        this.setPhoneNumber(event.nativeEvent.text);
        event.nativeEvent.text = this.value;
        props.onChange(event);
      };
    }

    if (onChangeText) {
      onChangeText = text => {
        this.setPhoneNumber(text);
        props.onChangeText(this.value);
      };
    }

    const value = phoneFormatter.format10Digit(this.value);
    const {placeholder, autoCapitalize, keyboardType} = this.props;
    return (
      <TextInput
        placeholder={placeholder}
        maxLength={12}
        keyboardType={keyboardType}
        placeholderTextColor={AppColors.gray}
        onChangeText={this.setPhoneNumber.bind(this)}
        {...{style: this.getStyle()}}
        {...this.props}
        value={value}
        {...{onChange, onChangeText}}
      />
      // <Input
      //   keyboardType="phone-pad"
      //   placeholderTextColor={theme.gray}
      //   onChangeText={this.setPhoneNumber.bind(this)}
      //   maxLength={12}
      //   {...{style: this.getStyle()}}
      //   {...this.props}
      //   {...{onChange, onChangeText}}
      //   value={value}
      // />
    );
  }
}

const style = StyleSheet.create({
  input: {
    height: windowDimensions.height * 0.08,
    width: windowDimensions.width * 0.8,
    borderWidth: 2,
    borderColor: AppColors.lightBlue,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
  },
  containerNoQuestions: {
    paddingTop: 60,
  },
});
