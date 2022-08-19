import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Animated,
  Easing,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {AppFonts, AppColors} from '../../../theme';
import {Circle, ConexusIcon} from '../../../components';

export interface SortableQuestionProps {
  editing: boolean;
  videoUrl: string;
  text: string;
  dragActive: boolean;
  allowDeleteQuestion?: boolean;
  onDeleteQuestion?: () => any;
  onOpenQuestion?: (editing: boolean) => any;
  onPlayQuestion?: () => any;
  marginBottom?: number;
}

const SortableQuestionRow = (props:SortableQuestionProps)=>{
  
  const _style: ViewStyle;
  const _activeAnimationValue: any;

  constructor(props, state) {
    super(props, state);

    this._activeAnimationValue = new Animated.Value(0);
    this._style =
      Platform.OS === 'android' ? this._getAndroidStyle() : this._getIosStyle();
  }
  _getIosStyle() {
    return {
      transform: [
        {
          scale: this._activeAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          }),
        },
      ],
      shadowRadius: this._activeAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 10],
      }),
    };
  }

  _getAndroidStyle() {
    return {
      transform: [
        {
          scale: this._activeAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.03],
          }),
        },
      ],
      elevation: this._activeAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 6],
      }),
    };
  }

  _openQuestion() {
    const {onOpenQuestion, editing} = this.props;

    if (onOpenQuestion && !!onOpenQuestion.call) {
      onOpenQuestion(editing);
    }
  }

  _playQuestion() {
    const {onPlayQuestion} = this.props;

    if (onPlayQuestion && !!onPlayQuestion.call) {
      onPlayQuestion();
    }
  }

  _deleteQuestion() {
    const {onDeleteQuestion} = this.props;

    if (onDeleteQuestion && onDeleteQuestion.call) {
      onDeleteQuestion();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dragActive !== nextProps.dragActive) {
      Animated.timing(this._activeAnimationValue, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.dragActive),
      }).start();
    }
  }

  _renderPlayIcon() {
    const {videoUrl} = this.props;

    if (!videoUrl) {
      return (
        <Circle size={46} color={AppColors.white} style={styles.circle}>
          <ConexusIcon
            style={styles.playIcon}
            name={'cn-play'}
            color={AppColors.lightBlue}
            size={24}
          />
        </Circle>
      );
    }

    return (
      <TouchableOpacity onPress={this._playQuestion.bind(this)}>
        <Circle size={46} color={AppColors.white} style={styles.circle}>
          <ConexusIcon
            style={styles.playIcon}
            name={'cn-play'}
            color={AppColors.blue}
            size={24}
          />
        </Circle>
      </TouchableOpacity>
    );
  }

  _renderIcon() {
    const {editing} = this.props;

    return (
      <View style={[styles.iconContainer, {marginRight: 12}]}>
        {!editing && this._renderPlayIcon()}
        {editing && (
          <ConexusIcon
            name={'cn-hamburger'}
            color={AppColors.blue}
            size={16}
            style={{}}
          />
        )}
      </View>
    );
  }

  _renderDeleteIcon() {
    return (
      <TouchableOpacity
        style={[styles.iconContainer, {marginLeft: 12}]}
        onPress={this._deleteQuestion.bind(this)}>
        <ConexusIcon name={'cn-x'} color={AppColors.red} size={16} style={{}} />
      </TouchableOpacity>
    );
  }

  render() {
    const {text, editing, marginBottom, allowDeleteQuestion} = this.props;

    return (
      <Animated.View
        style={[
          styles.question,
          this._style,
          {marginBottom: marginBottom || 0},
        ]}>
        {this._renderIcon()}
        {editing && (
          <View style={styles.questionDetailsButton}>
            <Text style={styles.questionTextEditing}>
              {text}
              {this._style.marginBottom}
            </Text>
          </View>
        )}
        {!editing && (
          <TouchableOpacity
            style={styles.questionDetailsButton}
            onPress={editing ? null : this._openQuestion.bind(this)}>
            <Text style={styles.questionText}>
              {text}
              {this._style.marginBottom}
            </Text>
          </TouchableOpacity>
        )}
        {editing && allowDeleteQuestion && this._renderDeleteIcon()}
      </Animated.View>
    );
  }
}

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
  question: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    padding: 15,
    marginTop: 8,
    marginBottom: 4,
    marginHorizontal: 8,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
    ...getRowShadows(),
    overflow: 'hidden',
  },

  questionDetailsButton: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    overflow: 'hidden',
  },

  questionText: {
    ...AppFonts.bodyTextMediumTouchable,
  },

  questionTextEditing: {
    ...AppFonts.bodyTextMedium,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
  },

  circle: {
    borderWidth: 1,
    borderColor: AppColors.lightBlue,
    margin: 9,
  },

  playIcon: {
    margin: 16,
    width: 24,
    height: 24,
    position: 'relative',
    left: 6,
  },
});
