import React, {Component} from 'react';
import {Button, Text} from 'native-base';
// import { observer } from 'mobx-react'
import {ButtonProperties, StyleSheet, Platform} from 'react-native';
import theme from '../theme';
import variables from '../theme';
import {AppFonts, AppColors} from '../theme';

@observer
export class ActionButton extends Component<ButtonProperties> {
  props: {
    title: string;
    onPress: () => void;
    primary?: boolean;
    danger?: boolean;
    secondary?: boolean;
    smallSecondary?: boolean;
    smallSecondaryNotRounded?: boolean;
    style?: any;
    textColor?: string;
    disabled?: boolean;
    textStyle?: any;
    textStyleDisabled?: any;
  };

  componentWillMount() {}

  render() {
    const {
      title,
      onPress,
      primary,
      secondary,
      smallSecondary,
      textColor,
      disabled,
      danger,
      smallSecondaryNotRounded,
    } = this.props;
    const style = this.props.style || {};
    const textStyle = this.props.textStyle || {};
    const textStyleDisabled = this.props.textStyleDisabled || {
      color: variables.gray,
    };

    if (primary) {
      return (
        <Button
          rounded
          onPress={onPress}
          disabled={disabled}
          style={StyleSheet.flatten([
            defaultStyle.primaryButton,
            !!danger && defaultStyle.dangerButton,
            style,
          ])}>
          <Text
            style={StyleSheet.flatten([
              defaultStyle.primaryButtonText,
              disabled ? textStyleDisabled : textStyle,
            ])}>
            {title}
          </Text>
        </Button>
      );
    }

    if (secondary) {
      return (
        <Button
          rounded
          onPress={onPress}
          disabled={disabled}
          style={StyleSheet.flatten([
            defaultStyle.secondaryButton,
            !!danger && defaultStyle.dangerButton,
            style,
          ])}>
          <Text
            style={StyleSheet.flatten([
              defaultStyle.secondaryButtonText,
              ,
              disabled ? textStyleDisabled : textStyle,
            ])}>
            {title}
          </Text>
        </Button>
      );
    }

    if (smallSecondary) {
      return (
        <Button
          rounded
          onPress={onPress}
          disabled={disabled}
          style={StyleSheet.flatten([
            defaultStyle.smallSecondaryButton,
            !!danger && defaultStyle.dangerButton,
            style,
          ])}>
          <Text
            style={StyleSheet.flatten([
              defaultStyle.smallSecondaryButtonText,
              ,
              disabled ? textStyleDisabled : textStyle,
            ])}>
            {title}
          </Text>
        </Button>
      );
    }

    if (smallSecondaryNotRounded) {
      return (
        <Button
          onPress={onPress}
          disabled={disabled}
          style={StyleSheet.flatten([
            defaultStyle.smallSecondaryButton,
            !!danger && defaultStyle.dangerButton,
            style,
          ])}>
          <Text
            style={StyleSheet.flatten([
              defaultStyle.smallSecondaryButtonText,
              ,
              disabled ? textStyleDisabled : textStyle,
            ])}>
            {title}
          </Text>
        </Button>
      );
    }

    return (
      <Button
        rounded
        onPress={onPress}
        disabled={disabled}
        style={StyleSheet.flatten([defaultStyle.transparentButton, style])}>
        <Text
          style={StyleSheet.flatten([
            defaultStyle.transparentButtonText,
            {color: textColor ? textColor : theme.darkBlue},
            ,
            disabled ? textStyleDisabled : textStyle,
          ])}>
          {title}
        </Text>
      </Button>
    );
  }
}

const defaultStyle = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.brandPrimary,
    alignSelf: 'center',
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderColor: variables.blue,
    borderWidth: 1,
  },

  dangerButton: {
    backgroundColor: theme.red,
    borderColor: variables.red,
  },

  primaryButtonText: {
    ...AppFonts.buttonText,
    color: theme.white,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    top: Platform.OS === 'android' ? -1 : 0,
  },

  secondaryButton: {
    backgroundColor: theme.white,
    borderColor: '#D8D8D8',
    borderWidth: 1,
    alignSelf: 'center',
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
  },

  secondaryButtonText: {
    color: AppColors.blue,
    ...AppFonts.buttonText,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    top: Platform.OS === 'android' ? -1 : 0,
  },

  smallSecondaryButton: {
    backgroundColor: theme.white,
    borderColor: '#D8D8D8',
    borderWidth: 1,
    alignSelf: 'center',
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    height: 33,
  },

  smallSecondaryButtonText: {
    ...AppFonts.buttonTextSmall,
    color: AppColors.blue,
    marginTop: 0,
    marginBottom: 0,
    position: 'relative',
    top: Platform.OS === 'android' ? -1 : 0,
  },

  transparentButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    alignSelf: 'center',
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },

  transparentButtonText: {
    ...AppFonts.buttonText,
    color: AppColors.blue,
    position: 'relative',
    top: Platform.OS === 'android' ? -1 : 0,
  },
});
