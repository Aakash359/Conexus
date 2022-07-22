import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, Button} from 'react-native';
import theme from '../theme';
import variables from '../theme';
import {AppFonts, AppColors} from '../theme';

interface buttonProps {
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
  loadingProps: any;
  loadingColor: string;
  loading: any;
}
// const textStyleDisabled = props.textStyleDisabled|| variables.gray
export const ActionButton: React.FC<buttonProps> = ({
  title,
  onPress,
  primary,
  secondary,
  smallSecondary,
  textColor,
  disabled,
  danger,
  loading,
  loadingProps,
  loadingColor,
  style,
  textStyleDisabled = 'textStyleDisabled' || variables.gray,
  textStyle = 'textStyle' || variables.gray,
  smallSecondaryNotRounded,
}) => {
  return (
    <Button
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      loadingProps={{
        size: 'small',
        color: loadingColor,
      }}
      titleStyle={[
        styles.primaryButtonText,
        disabled ? textStyleDisabled : textStyle,
      ]}
      title={title}
      style={StyleSheet.flatten([
        styles.primaryButton,
        !!danger && styles.dangerButton,
        style,
      ])}
    />
  );
};

const styles = StyleSheet.create({
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
