// @flow
import React, {Component} from 'react';
import {
  StyleSheet,
  StyleSheetProperties,
  ImageStyle,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableHighlight,
  View,
  ImageURISource,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import {Thumbnail} from 'native-base';
import {CachedImage} from '@georstat/react-native-image-cache';
import {Images} from './';
import {logger} from 'react-native-logs';
import {BubbleLabel} from './bubble-label';
import {AppColors} from '../theme';

interface AvatarProps {
  size: number;
  id: number;
  source: string;
  style: ImageStyle | Array<ImageStyle>;
  facility: boolean;
  title: string;
  titleStyle: StyleProp<ViewStyle>;
  titleTextStyle: StyleProp<TextStyle>;
  titleHeight: number;
  borderWidth: number;
  borderColor: string;
  onClick?: (event?: any) => void;
}

export const Avatar = (props: AvatarProps) => {
  const defaultProps = {
    // size: 20,
    // id: 0,
    // source: 75,
    // style: '',
    // facility: false,
    // title: '',
    // titleStyle: '',
    // titleTextStyle: '',
    // titleHeight: '',
    // borderWidth: '',
    // borderColor: '',
    // onClick: '',
  };

  const titleHeight = () => {
    const {titleHeight} = props;
    return titleHeight || 26;
  };

  const titleBottomOffset = () => {
    return titleHeight() * 0.6;
  };

  const renderLabel = () => {
    Alert.alert('hi');
    // const {title, titleStyle, titleTextStyle, size} = props;
    // let _style = StyleSheet.flatten([
    //   titleStyle || {},
    //   {
    //     position: 'absolute',
    //     top: size - 23,
    //     left: size < 70 ? 0 : '12%',
    //     right: size < 70 ? 0 : '12%',
    //   },
    // ]);
    // let _title = !!title ? title : '';
    // return (
    //   <BubbleLabel
    //     containerStyle={_style as StyleProp<ViewStyle>}
    //     title={_title}
    //     // height={titleHeight()}
    //     textStyle={titleTextStyle}
    //   />
    // );
  };

  const renderImage = () => {
    const {size, style, source, borderColor, facility, title} = props;
    console.log('Size===>', size);

    // let imgSource: ImageURISource = facility
    //   ? Images.defaultFacilityAvatar
    //   : Images.defaultAvatar;

    if (source && source !== '') {
      // imgSource = {uri: source};
    }
    const circleStyle = {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 30 / 2,
    } as ViewStyle;

    // if (borderWidth == null) {
    //   borderWidth = 2;
    // }

    // if (borderColor == null) {
    //   borderColor = AppColors.blue; // '#FDAD40'
    // }

    // const viewHeight = size + (title == null ? 0 : titleBottomOffset);

    return (
      <View>
        <View style={[circleStyle]} />
      </View>
    );
  };

  if (props.onClick) {
    return (
      // <TouchableHighlight>
      //   <Text>ji</Text>
      //   {/* {renderImage()} */}
      // </TouchableHighlight>
      <View style={{backgroundColor: 'red'}}>
        <Text>hi</Text>
      </View>
    );
  }

  return renderImage();
};
