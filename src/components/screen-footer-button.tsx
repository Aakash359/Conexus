import React from 'react';
import {ViewProperties, StyleSheet, View, Platform} from 'react-native';
import {AppColors, AppSizes} from '../theme';
import {ActionButton} from '../components/action-button';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenFooterButtonProps {
  title: string;
  onPress?: () => any;
  disabled?: boolean;
  hideGradient?: boolean;
  danger?: boolean;
}

// export interface ScreenFooterButtonState {}

const ScreenFooterButton: React.FC<ScreenFooterButtonProps> = ({
  title,
  onPress,
  disabled,
  hideGradient,
  danger,
}) => {
  // constructor(props: ScreenFooterButtonProps, state: ScreenFooterButtonState) {
  //   super(props, state);
  // }

  // componentWillMount() {}

  if (hideGradient) {
    return (
      <View style={styles.root}>
        <ActionButton
          disabled={disabled}
          danger={danger}
          style={styles.button}
          primary
          title={title}
          // onPress={onPress}
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
        // onPress={onPress}
      />
    </LinearGradient>
  );
};

const getPaddingBottom = (): number => {
  if (AppSizes.isIPhoneX) {
    return AppSizes.iPhoneXFooterSize;
  }

  if (Platform.OS === 'android') {
    return 22;
  }

  return 0;
};

const styles = StyleSheet.create({
  root: {
    height: AppSizes.conexusFooterButtonHeight,
    paddingBottom: getPaddingBottom(),
  },

  button: {
    justifyContent: 'flex-end',
  },
});

export default ScreenFooterButton;
