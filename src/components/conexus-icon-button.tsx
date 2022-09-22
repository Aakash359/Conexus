import React, {Component} from 'react';
import {
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {ConexusIcon} from '../components/conexus-icon';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../theme';
import {AppFonts} from '../theme';

interface ConexusIconButtonProps {
  title?: string;
  iconName: string;
  iconSize: number;
  color?: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  textStyle?: TextStyle;
  imageSource: any;
}

export const ConexusIconButton = (props: ConexusIconButtonProps) => {
  const {
    disabled,
    imageSource,
    textStyle,
    onPress,
    title,
    style,
    iconName,
    iconSize,
  } = props;

  const IconSize = iconSize || 24;
  const Style = style || {};
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[defaultStyle.button, Style]}
    >
      <Image style={[style]} source={imageSource} />

      {title && (
        <Text
          style={[
            disabled
              ? [textStyle, {color: variables.gray}]
              : [textStyle, {color: variables.blue}],
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const defaultStyle = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
