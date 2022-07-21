import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewProperties,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Text} from 'native-base';
// import { Actions } from 'react-native-router-flux';
import {AppFonts, AppColors, AppSizes} from '../theme';
import {ConexusIconButton} from '../components';
const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

export interface ConexusLightboxProps extends ViewProperties {
  children: any;
  title?: string;
  closeable?: boolean;
  transparentHeader?: boolean;
  horizontalPercent?: number;
  verticalPercent?: number;
  hideHeader?: boolean;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  onClose?: () => any;
  showHeaderBorder?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  adjustForTopTab?: boolean;
}

export interface ConexusLightboxState {
  opacity: Animated.Value;
}

const closeIconSize = 18;
const closeIconPadding = 12;

export class ConexusLightbox extends Component<
  ConexusLightboxProps,
  ConexusLightboxState
> {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      duration: 100,
      toValue: 1,
    }).start();
  }

  closeModal() {
    const {onClose} = this.props;

    Animated.timing(this.state.opacity, {
      duration: 100,
      toValue: 0,
    }).start(() => {
      // Actions.pop()

      if (onClose && onClose.call) {
        onClose();
      }
    });
  }

  _renderLightBox() {
    const {
      children,
      horizontalPercent,
      verticalPercent,
      closeable,
      title,
      height,
      width,
      style,
      hideHeader,
      adjustForTopTab,
      showHeaderBorder,
      transparentHeader,
      headerStyle,
      headerTextStyle,
    } = this.props;

    let calcHeight = height;
    if (!!verticalPercent) {
      calcHeight = verticalPercent
        ? deviceHeight * verticalPercent
        : deviceHeight;
    }

    let calcWidth = width;
    if (!!horizontalPercent) {
      calcWidth = horizontalPercent
        ? deviceWidth * horizontalPercent
        : deviceWidth;
    }

    return (
      <View
        style={[
          styles.lightbox,
          {width: calcWidth, height: calcHeight},
          style,
        ]}>
        {!hideHeader && (
          <View
            style={[
              styles.header,
              showHeaderBorder ? styles.headerBorder : {},
              headerStyle,
              transparentHeader ? styles.transparentHeader : {},
              adjustForTopTab ? styles.topTabHeaderAdjustment : {},
            ]}>
            <Text
              style={[
                styles.title,
                closeable && {
                  paddingLeft: closeIconSize + closeIconPadding + 12,
                },
                headerTextStyle,
              ]}>
              {title}
            </Text>
            {closeable && (
              <ConexusIconButton
                style={styles.closeButton}
                iconName="cn-x"
                iconSize={closeIconSize}
                onPress={this.closeModal.bind(this)}
              />
            )}
          </View>
        )}
        {hideHeader && closeable && (
          <ConexusIconButton
            style={styles.closeButtonHideHeader}
            iconName="cn-x"
            iconSize={closeIconSize}
            onPress={this.closeModal.bind(this)}
          />
        )}
        {children}
      </View>
    );
  }

  render() {
    return (
      <Animated.View style={[styles.container, {opacity: this.state.opacity}]}>
        {this._renderLightBox()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52,52,52,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightbox: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: AppColors.white,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  headerBorder: {
    borderBottomColor: AppColors.lightBlue,
    borderBottomWidth: 1,
  },
  transparentHeader: {
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  title: {
    ...AppFonts.lightboxTitle,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 24,
  },
  closeButton: {
    //position: 'absolute',
    padding: closeIconPadding,
    alignSelf: 'center',
    zIndex: 11,
  },
  closeButtonHideHeader: {
    position: 'absolute',
    top: 10,
    right: 4,
    padding: closeIconPadding,
    alignSelf: 'center',
    zIndex: 11,
  },
  topTabHeaderAdjustment: {
    height: AppSizes.isIPhoneX ? 76 : 48,
    paddingTop: AppSizes.isIPhoneX ? 44 : 0,
  },
});
