import React from 'react';
import {ViewProperties, StyleSheet, View, Platform} from 'react-native';
import {AppColors, AppSizes} from '../theme';
import {ActionButton} from '../components';
import LinearGradient from 'react-native-linear-gradient';

export interface ScreenFooterButtonProps extends ViewProperties {
  title: string;
  onPress?: () => any;
  disabled?: boolean;
  hideGradient?: boolean;
  danger?: boolean;
}

export interface ScreenFooterButtonState {}

export class ScreenFooterButton extends React.Component<
  ScreenFooterButtonProps,
  ScreenFooterButtonState
> {
  constructor(props: ScreenFooterButtonProps, state: ScreenFooterButtonState) {
    super(props, state);
  }

  componentWillMount() {}

  render() {
    const {title, onPress, disabled, hideGradient, danger} = this.props;

    if (hideGradient) {
      return (
        <View style={styles.root}>
          <ActionButton
            disabled={disabled}
            danger={danger}
            style={styles.button}
            primary
            title={title}
            onPress={onPress}
          />
        </View>
      );
    }

    return (
      <LinearGradient
        style={styles.root}
        colors={[
          'rgba(241, 243, 248, 0)',
          'rgba(241, 243, 248, .9)',
          AppColors.baseGray,
        ]}>
        <ActionButton
          disabled={disabled}
          danger={danger}
          style={styles.button}
          primary
          title={title}
          onPress={onPress}
        />
      </LinearGradient>
    );
  }
}

const getPaddingBottom = (): number => {
  if (AppSizes.isIPhoneX) {
    return AppSizes.iPhoneXFooterSize;
  }

  if (Platform.OS === 'android') {
    return 44;
  }

  return 0;
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: AppSizes.conexusFooterButtonHeight,
    paddingBottom: getPaddingBottom(),
    zIndex: 99,
  },

  button: {},
});
