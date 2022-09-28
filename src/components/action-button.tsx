import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import theme from '../theme';
import variables from '../theme';
import {AppFonts, AppColors} from '../theme';

interface buttonProps {
  title: string;
  onPress: Function;
  primary?: boolean;
  danger?: boolean;
  secondary?: boolean;
  smallSecondary?: boolean;
  smallSecondaryNotRounded?: boolean;
  style?: any;
  textColor?: any;
  disabled?: boolean;
  textStyle?: any;
  textStyleDisabled?: any;
  loadingProps: any;
  loadingColor: string;
  loading: any;
  buttonColor: any;
  borderColor: any;
  customStyle: any;
  customTitleStyle: any;
}
// const textStyleDisabled = props.textStyleDisabled|| variables.gray
export const ActionButton = (props: buttonProps) => {
  const {
    title,
    loadingColor,
    customStyle,
    textColor,
    borderColor,
    loading,
    disabled,
    customTitleStyle,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      textColor={textColor}
      loading={loading}
      disabled={disabled || loading}
      loadingProps={{
        size: 'small',
        color: loadingColor,
      }}
      style={[styles.btnStyle, {borderColor: borderColor}, {...customStyle}]}
    >
      <Text style={[styles.primaryButtonText, {...customTitleStyle}]}>
        {title}
      </Text>
      {loading && (
        <ActivityIndicator
          size="small"
          color={AppColors.white}
          style={{
            bottom: Platform.OS === 'android' ? 20 : 10,
            justifyContent: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: AppColors.blue,
    justifyContent: 'center',
    height: 45,
    borderRadius: 28,
  },
  primaryButtonText: {
    color: theme.white,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
  },
});
