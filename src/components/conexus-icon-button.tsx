import React, {Component} from 'react';
import {
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
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
}

export const ConexusIconButton = (props: ConexusIconButtonProps) => {
  const {disabled, textStyle, onPress, title, style, iconName, iconSize} =
    props;

  const color = () => {
    return disabled ? variables.gray : color || variables.blue;
  };

  const IconSize = iconSize || 24;
  const Style = style || {};
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[defaultStyle.button, Style]}>
      <Icon
        style={title ? {marginBottom: 6} : {}}
        name={iconName}
        size={IconSize}
        color={color}
      />
      {/* <ConexusIcon
        name={iconName}
        size={IconSize}
        // color={color()}
        style={title ? {marginBottom: 6} : {}}
      /> */}
      {title && (
        <Text
          style={StyleSheet.flatten([
            defaultStyle.text,
            {color: color()},
            textStyle,
          ])}>
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

  text: {
    ...AppFonts.bodyTextNormal,
    fontWeight: '600',
  },
});
