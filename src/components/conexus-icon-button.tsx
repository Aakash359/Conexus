import React, {Component} from 'react';
import {Text} from 'native-base';
import {
  ViewProperties,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ConexusIcon} from '../components/conexus-icon';
import variables from '../theme';
import {AppFonts} from '../theme';

interface ConexusIconButtonProps extends ViewProperties {
  title?: string;
  iconName: string;
  iconSize: number;
  color?: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  textStyle?: TextStyle;
}

export class ConexusIconButton extends Component<ConexusIconButtonProps> {
  componentWillMount() {}

  get color(): string {
    return this.props.disabled
      ? variables.gray
      : this.props.color || variables.blue;
  }

  render() {
    const {title, onPress, disabled, iconName, textStyle} = this.props;
    const style = this.props.style || {};
    const iconSize = this.props.iconSize || 24;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[defaultStyle.button, style]}>
        <ConexusIcon
          name={iconName}
          size={iconSize}
          color={this.color}
          style={title ? {marginBottom: 6} : {}}
        />
        {title && (
          <Text
            style={StyleSheet.flatten([
              defaultStyle.text,
              {color: this.color},
              textStyle,
            ])}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

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
