import {Alert, AlertButton, ViewStyle} from 'react-native';

export function showYesNoAlert(options: {
  title: string;
  message?: string;
  onNo?: () => any;
  onYes?: () => any;
  yesTitle?: string;
  yesStyle?: any;
  noTitle?: string;
  noStyle?: any;
}) {
  Alert.alert(options.title, options.message, [
    {
      text: options.yesTitle || 'Yes',
      onPress: options.onYes,
      style: options.yesStyle,
    },
    {
      text: options.noTitle || 'No',
      onPress: options.onNo,
      style: options.noStyle,
    },
  ]);
}
