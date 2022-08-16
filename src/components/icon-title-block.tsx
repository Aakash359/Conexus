import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConexusIcon} from '../components/conexus-icon';
import {AppColors} from '../theme';

interface IconTitleBlockProps {
  text: string;
  iconName?: string;
  textColor?: string;
  iconColor?: string;
}

const IconTitleBlock = (props: IconTitleBlockProps) => {
  const {text} = props;

  const textColor = (): string => {
    return props.textColor || AppColors.darkBlue;
  };

  const iconColor = (): string => {
    return props.iconColor || AppColors.blue;
  };

  const iconName = (): string => {
    return props.iconName;
  };

  return (
    <View style={[style.container]}>
      {!!iconName && (
        <ConexusIcon
          size={64}
          name={iconName}
          style={[style.icon, {color: iconColor}]}
        />
      )}
      <Text style={[style.text, {color: textColor}]}>{text}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: AppColors.darkBlue,
  },
  icon: {
    color: AppColors.blue,
    marginBottom: 18,
  },
});

export default IconTitleBlock;
