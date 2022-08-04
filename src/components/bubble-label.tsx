import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  StyleProp,
  ViewStyle,
  FlexStyle,
} from 'react-native';
import {AppColors} from '../theme';

interface BubbleLabelProps {
  title: string;
  height: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const BubbleLabel = (props: BubbleLabelProps) => {
  // render() {
  //   const {title, height} = this.props;
  //   const defaultHeight = 26;
  //   const _containerStyle = StyleSheet.flatten([
  //     style.container,
  //     this.props.containerStyle || {},
  //     {
  //       height: height || defaultHeight,
  //       borderRadius: (height || defaultHeight) / 2,
  //     },
  //   ]);
  //   const _textStyle = StyleSheet.flatten([
  //     style.text,
  //     this.props.textStyle || {},
  //   ]);

  return (
    <View style={_containerStyle}>
      <Text style={_textStyle}>{title}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: AppColors.white,

    flexDirection: 'column',
    backgroundColor: AppColors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    color: 'white',
  },
});

export default BubbleLabel;
