import React, {Component} from 'react';
import {ViewProperties, ViewStyle, StyleSheet, View} from 'react-native';

interface FloatingFooterProps extends ViewProperties {
  right?: () => any;
  left?: () => any;
  center?: () => any;
  style?: ViewStyle;
}

export class FloatingFooter extends Component<FloatingFooterProps> {
  constructor(props) {
    super(props, {});
  }

  componentWillMount() {}

  _renderLeft() {
    return (
      <View style={styles.leftContainer}>
        {!!this.props.left && this.props.left()}
      </View>
    );
  }

  _renderRight() {
    return (
      <View style={styles.rightContainer}>
        {!!this.props.right && this.props.right()}
      </View>
    );
  }

  _renderCenter() {
    return (
      <View style={styles.centerContainer}>
        {!!this.props.right && this.props.right()}
      </View>
    );
  }

  render() {
    return (
      <View style={StyleSheet.flatten([styles.footer, this.props.style])}>
        {!!this.props.left && this._renderLeft()}
        {!!this.props.center && this._renderCenter()}
        {!!this.props.right && this._renderRight()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 26,
    paddingBottom: 4,
    height: 76,
  },

  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  leftContainer: {
    position: 'absolute',
    left: 4,
    bottom: 10,
  },

  rightContainer: {
    position: 'absolute',
    right: 4,
    bottom: 10,
  },
});
