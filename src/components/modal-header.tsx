import React, {Component} from 'react';
import {Text, ViewStyle, StyleSheet, View} from 'react-native';
import variables from '../theme';
import {AppFonts} from '../theme';

interface ModalHeaderProps {
  title: string;
  right?: () => any;
  left?: () => any;
  style?: ViewStyle;
}

export const ModalHeader = (props: ModalHeaderProps) => {
  const {left, right, title, style} = props;

  const renderLeft = () => {
    return <View style={styles.leftContainer}>{!!left && left()}</View>;
  };

  const renderRight = () => {
    return <View style={styles.rightContainer}>{!!right && right()}</View>;
  };

  return (
    <View style={StyleSheet.flatten([styles.header, style])}>
      {!!left && renderLeft()}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {!!right && renderRight()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-start',
    backgroundColor: variables.white,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 26,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: variables.lightBlue,
    position: 'relative',
    height: 76,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    ...AppFonts.navbarTitle,
    paddingBottom: 2,
  },
  leftContainer: {
    position: 'absolute',
    left: 4,
    bottom: 10,
  },
  rightContainer: {
    position: 'absolute',
    right: 4,
    bottom: 14,
  },
});
