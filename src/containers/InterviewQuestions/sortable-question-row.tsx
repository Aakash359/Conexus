import React, {useState, useEffect} from 'react';
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
import {Circle} from '../../components/circle';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppFonts, AppColors} from '../../theme';

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

const SortableQuestionRow = (props: SortableQuestionProps) => {
  const _activeAnimationValue: any = new Animated.Value(0);

  const {
    onOpenQuestion,
    onPlayQuestion,
    onDeleteQuestion,
    videoUrl,
    allowDeleteQuestion,
    editing,
    marginBottom,
    text,
  } = props;

  const getIosStyle = () => {
    return {
      transform: [
        {
          scale: _activeAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          }),
        },
      ],
      shadowRadius: _activeAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 10],
      }),
    };
  };

  const getAndroidStyle = () => {
    return {
      transform: [
        {
          scale: _activeAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.03],
          }),
        },
      ],
      elevation: _activeAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 6],
      }),
    };
  };

  const _style = Platform.OS === 'android' ? getAndroidStyle() : getIosStyle();

  const openQuestion = () => {
    if (props.onOpenQuestion && !!props.onOpenQuestion.call) {
      onOpenQuestion(editing);
    }
  };

  const playQuestion = () => {
    if (props.onPlayQuestion && !!props.onPlayQuestion.call) {
      onPlayQuestion();
    }
  };

  const deleteQuestion = () => {
    if (props.onDeleteQuestion && props.onDeleteQuestion.call) {
      onDeleteQuestion();
    }
  };

  const renderPlayIcon = () => {
    if (!videoUrl) {
      return (
        <Icon
          style={styles.playIcon}
          name={'play-circle-outline'}
          color={AppColors.lightBlue}
          size={46}
        />
      );
    }

    return (
      <TouchableOpacity onPress={playQuestion}>
        <Icon
          style={styles.playIcon}
          name={'play-circle-outline'}
          color={AppColors.blue}
          size={46}
        />
      </TouchableOpacity>
    );
  };

  const renderIcon = () => {
    return (
      <View style={[styles.iconContainer, {marginRight: 12}]}>
        {!editing && renderPlayIcon()}
        {editing && (
          <Icon
            name={'menu-outline'}
            color={AppColors.blue}
            size={38}
            style={{}}
          />
        )}
      </View>
    );
  };

  const renderDeleteIcon = () => {
    return (
      <TouchableOpacity
        style={[styles.iconContainer, {marginLeft: 12}]}
        onPress={deleteQuestion}
      >
        <Icon
          name={'close-outline'}
          color={AppColors.red}
          size={35}
          style={{}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[styles.question, _style, {marginBottom: marginBottom || 0}]}
    >
      {renderIcon()}
      {editing && (
        <View style={styles.questionDetailsButton}>
          <Text style={styles.questionTextEditing}>
            {text}
            {_style.marginBottom}
          </Text>
        </View>
      )}
      {!editing && (
        <TouchableOpacity
          style={styles.questionDetailsButton}
          onPress={editing ? null : openQuestion}
        >
          <Text style={styles.questionText}>
            {text}
            {_style.marginBottom}
          </Text>
        </TouchableOpacity>
      )}
      {editing && allowDeleteQuestion && renderDeleteIcon()}
    </Animated.View>
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
    position: 'relative',
    left: 6,
  },
});

export default SortableQuestionRow;
