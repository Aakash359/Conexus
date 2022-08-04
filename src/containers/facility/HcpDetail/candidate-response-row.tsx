
import React from 'react'
import { Text } from 'native-base'
import { ViewProperties, StyleSheet, View, TouchableOpacity } from 'react-native'
import { AppFonts, AppColors } from '../../../theme'
import { Circle, ConexusIcon } from '../../../components'
import { CandidateResponseModel } from '../../../stores'

export interface CandidateResponseRowProps extends ViewProperties {
    response: typeof CandidateResponseModel.Type,
    onPlayResponse: () => any
}

export class CandidateResponseRow extends React.Component<CandidateResponseRowProps, any> {

    constructor(props) {
        super(props);
    }

    openResponse() {
        //Actions[ScreenType.FACILITIES.QUESTION_DETAIL_EDIT]({ question });
    }

    playResponse() {
        const { onPlayResponse } = this.props;

        if (onPlayResponse && !!onPlayResponse.call) {
            onPlayResponse();
        }
    }

    _renderRatingIcon(rating: -1 | 0 | 1) {
        return (
            <Circle size={24} color={rating === 1 ? AppColors.green : AppColors.red} style={styles.ratingCircle}>
                {rating === 1 && <ConexusIcon style={styles.ratingIcon} name={"cn-thumbs-up"} color={AppColors.white} size={10} />}
                {rating === -1 && <ConexusIcon style={styles.ratingIcon} name={"cn-thumbs-down"} color={AppColors.white} size={10} />}
            </Circle>
        )
    }

    _renderPlayIcon() {

        return (
            <Circle size={46} color={AppColors.white} style={styles.circle}>
                <ConexusIcon style={styles.playIcon} name={"cn-play"} color={AppColors.blue} size={24} />

            </Circle>
        )
    }

    render() {
        const { response } = this.props;

        return (
            <TouchableOpacity style={[styles.item]} onPress={this.playResponse.bind(this)}>
                <View>
                    {this._renderPlayIcon()}
                    {response.feedbackResponse !== 0 && this._renderRatingIcon(response.feedbackResponse as -1 | 0 | 1)}
                </View>
                <View style={{ flex: 1, overflow: 'hidden' }}>
                    <Text style={styles.text}>{response.questionText}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        padding: 15,
        marginTop: 8,
        marginBottom: 4,
        marginHorizontal: 8,
        borderRadius: 6,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightBlue
    },

    text: {
        ...AppFonts.bodyTextMediumTouchable,
    },

    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 46,
        marginRight: 12,
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
    ratingCircle: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        borderWidth: 2,
        borderColor: AppColors.white
    },
    ratingIcon: {

    }
})
