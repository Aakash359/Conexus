import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppColors} from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface IconTitleBlockProps {
  text: string;
  iconNames?: string;
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
    return props.iconNames;
  };

  return (
    <View style={[style.container]}>
      {!!iconName && (
        <Icon name={'information-circle'} size={64} style={[style.icon]} />
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
