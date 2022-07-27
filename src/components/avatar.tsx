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
} from 'react-native';
import {Thumbnail} from 'native-base';
import {CachedImage} from 'react-native-cached-image';
import {Images} from './';
import {logger} from 'react-native-logs';
import {BubbleLabel} from './bubble-label';
import {AppColors} from '../theme';

export class Avatar extends Component<any, any> {
  props: {
    size: number;
    id?: number;
    source?: string;
    style?: ImageStyle | Array<ImageStyle>;
    facility?: boolean;
    title?: string;
    titleStyle?: StyleProp<ViewStyle>;
    titleTextStyle?: StyleProp<TextStyle>;
    titleHeight?: number;
    borderWidth?: number;
    borderColor?: string;

    onClick?: (event?) => void;
  };

  static defaultProps = {
    size: 20,
    id: 0,
  };

  get titleHeight() {
    const {titleHeight} = this.props;
    return titleHeight || 26;
  }

  get titleBottomOffset() {
    return this.titleHeight * 0.6;
  }

  private _renderLabel() {
    const {title, titleStyle, titleTextStyle, size} = this.props;

    let _style = StyleSheet.flatten([
      titleStyle || {},
      {
        position: 'absolute',
        top: size - this.titleBottomOffset,
        left: size < 70 ? 0 : '12%',
        right: size < 70 ? 0 : '12%',
      },
    ]);
    let _title = !!title ? title : '';
    return (
      <BubbleLabel
        containerStyle={_style as StyleProp<ViewStyle>}
        title={_title}
        height={this.titleHeight}
        textStyle={titleTextStyle}
      />
    );
  }

  private _renderImage() {
    let {
      size,
      id,
      style,
      source,
      onClick,
      title,
      borderWidth,
      borderColor,
      facility,
    } = this.props;
    let imgSource: ImageURISource = facility
      ? Images.defaultlFacilityAvatar
      : Images.defaultAvatar;

    if (source && source !== '') {
      imgSource = {uri: source};
    }
    const circleStyle = {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: size / 2,
    } as ViewStyle;

    if (borderWidth == null) {
      borderWidth = 2;
    }

    if (borderColor == null) {
      borderColor = AppColors.blue; // '#FDAD40'
    }

    const viewHeight = size + (title == null ? 0 : this.titleBottomOffset);

    return (
      <View style={[style, {width: size, height: viewHeight}]}>
        {/* <CachedImage loadingIndicator={() => <ActivityIndicator color={AppColors.blue} />} source={imgSource} style={circleStyle} /> */}
        <Thumbnail
          circular
          style={circleStyle as StyleProp<ImageStyle>}
          source={imgSource}
        />
        <View style={[circleStyle, {borderWidth, borderColor}]}></View>
        {!!title && this._renderLabel()}
      </View>
    );
  }

  render(): React.ReactElement<any> {
    const {onClick} = this.props;

    if (onClick) {
      return (
        <TouchableHighlight onPress={onClick}>
          {this._renderImage()}
        </TouchableHighlight>
      );
    }

    return this._renderImage();
  }
}
