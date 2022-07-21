import React from 'react';
import {StyleSheet, View, ViewProperties} from 'react-native';
import {Text} from 'native-base';
import {Avatar} from './';
import {AppFonts, AppColors, AppSizes} from '../theme';
import {ConexusLightbox} from '../lightboxes/base-lightbox';
import LinearGradient from 'react-native-linear-gradient';

interface QuestionPlaybackHeaderProps extends ViewProperties {
  onClose?: () => any;
  showAvatar?: boolean;
  avatarTitle?: string;
  avatarDescription?: string;
  avatarUrl?: string;
  showCountdown?: boolean;
  countdownTitle?: string;
  countdownDescription?: string;
  questionText?: string;
}

interface QuestionPlaybackState {}

export class QuestionPlaybackHeader extends React.Component<
  QuestionPlaybackHeaderProps,
  QuestionPlaybackState
> {
  lightbox: ConexusLightbox;

  constructor(
    props: QuestionPlaybackHeaderProps,
    state: QuestionPlaybackState,
  ) {
    super(props, state);

    this.state = {};
  }

  close() {
    this.lightbox.closeModal();
  }

  render() {
    const {
      style,
      showAvatar,
      avatarTitle,
      avatarDescription,
      avatarUrl,
      showCountdown,
      countdownTitle,
      countdownDescription,
      questionText,
    } = this.props;

    if (showAvatar || showCountdown) {
      return (
        <View style={style}>
          <LinearGradient
            style={{
              height: 240,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
            colors={['rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 0)']}></LinearGradient>
          <View style={[styles.questionHeader]}>
            {showAvatar && (
              <View style={styles.avatarContainer}>
                <Avatar size={34} source={avatarUrl} />
                <View style={{position: 'relative'}}>
                  <View style={[{position: 'absolute', top: 1, left: 1}]}>
                    <Text style={styles.avatarTitleBg}>{avatarTitle}</Text>
                    <Text style={styles.avatarDescriptionBg}>
                      {avatarDescription}
                    </Text>
                  </View>
                  <View style={[]}>
                    <Text style={styles.avatarTitle}>{avatarTitle}</Text>
                    <Text style={styles.avatarDescription}>
                      {avatarDescription}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {showCountdown && (
              <View
                style={[
                  countdownStyle.view,
                  {position: 'absolute', right: 19, top: 21},
                ]}>
                <Text style={countdownStyle.titleBg}>{countdownTitle}</Text>
                <Text style={countdownStyle.secondsLeftBg}>
                  {countdownDescription}
                </Text>
              </View>
            )}
            {showCountdown && (
              <View style={[countdownStyle.view, {right: 20, top: 20}]}>
                <Text style={countdownStyle.title}>{countdownTitle}</Text>
                <Text style={countdownStyle.secondsLeft}>
                  {countdownDescription}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              position: 'relative',
              ...{marginTop: showAvatar ? 12 : 175},
            }}>
            <Text style={styles.questionTextBg}>{questionText}</Text>
            <Text style={styles.questionText}>{questionText}</Text>
          </View>
        </View>
      );
    }

    return <View />;
  }
}

const countdownStyle = StyleSheet.create({
  view: {
    position: 'absolute',
    flex: 1,
    alignItems: 'flex-end',
  },

  title: {
    ...AppFonts.bodyTextXtraSmall,
    color: AppColors.red,
    paddingBottom: 4,
  },
  titleBg: {
    ...AppFonts.bodyTextXtraSmall,
    color: 'rgba(0, 0, 0, .87)',
    paddingBottom: 4,
  },
  secondsLeft: {
    ...AppFonts.bodyTextXtraXtraLarge,
    color: AppColors.red,
  },
  secondsLeftBg: {
    ...AppFonts.bodyTextXtraXtraLarge,
    color: 'rgba(0, 0, 0, .87)',
  },
});

const styles = StyleSheet.create({
  questionHeader: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
  },

  avatarContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  avatarTitle: {
    ...AppFonts.bodyTextNormal,
    color: AppColors.white,
    paddingLeft: 6,
  },
  avatarDescription: {
    ...AppFonts.bodyTextXtraSmall,
    color: AppColors.white,
    paddingLeft: 6,
  },
  avatarTitleBg: {
    ...AppFonts.bodyTextNormal,
    color: 'rgba(0,0,0,.87)',
    paddingLeft: 6,
  },
  avatarDescriptionBg: {
    ...AppFonts.bodyTextXtraSmall,
    color: 'rgba(0,0,0,.87)',
    paddingLeft: 6,
  },
  questionText: {
    position: 'absolute',
    left: 20,
    right: 20,
    color: AppColors.white,
    textAlign: 'center',
  },
  questionTextBg: {
    top: 1,
    position: 'absolute',
    left: 21,
    right: 19,
    color: 'rgba(0,0,0,.87)',
    textAlign: 'center',
  },
});
