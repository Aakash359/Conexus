import React from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  View,
  TextStyle,
  Platform,
} from 'react-native';
import {windowDimensions} from '../common/window-dimensions';

import {ActionButton} from '../components/action-button';
import {AppFonts, AppColors} from '../theme';

export interface ViewHeaderProps {
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => any;
  actionStyle?: any;
  actionTextStyle?: any;
  titleStyle?: StyleProp<TextStyle>;
  first?: boolean;
  descriptionStyle?: StyleProp<TextStyle>;
  style?: any;
}

export const ViewHeader = (props: ViewHeaderProps) => {
  const {
    title,
    description,
    actionText,
    onActionPress,
    titleStyle,
    descriptionStyle,
    style,
    first,
  } = props;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text style={StyleSheet.flatten([AppFonts.bodyTextLarge, titleStyle])}>
          {title}
        </Text>
        {!!description && (
          <Text
            style={StyleSheet.flatten([AppFonts.description, descriptionStyle])}
          >
            {description}
          </Text>
        )}
      </View>
      {!!actionText && (
        <View style={styles.right}>
          <ActionButton
            customStyle={styles.compareBtn}
            customTitleStyle={styles.compareText}
            title={actionText}
            onPress={onActionPress}
          />
        </View>
      )}
    </View>
  );
};

const getRowShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 2,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppColors.baseGray,
    alignItems: 'stretch',
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: AppColors.lightBlue,
    ...getRowShadows(),
  },
  compareText: {
    fontSize: 12,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
    color: AppColors.blue,
    fontFamily: AppFonts.family.fontFamily,
  },
  compareBtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    height: 35,
    width: windowDimensions.width * 0.3,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  actionButton: {
    height: 33,
    width: 0,
  },
});
