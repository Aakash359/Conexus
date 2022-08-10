
import React from 'react'
import { Text, ListItem, Left, Body, Right, Thumbnail } from 'native-base'
import { Avatar } from '../../../components/avatar'
import { StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import variables, { AppColors } from '../../../theme'
import { ScreenType } from '../../../common/constants'
import { CandidateModel } from '../../../stores/facility'
import { AppFonts } from '../../../theme';
import { logger } from 'react-native-logs'
import { BubbleLabel } from '../../../components/bubble-label'
import { PositionModel } from '../../../stores/index';
const log = logger.createLogger()
export interface CandidateItemProps {
    candidate: typeof CandidateModel.Type,
    candidatesCount: number,
    index: number,
    showAll: boolean,
    showAllHighlight: boolean,
    positions: typeof PositionModel.Type,
    updateViewed: (s:string) => any,
    onMorePress: () => any
}

export interface CandidateItemState {
    subViewed: boolean
}

// @observer
export class CandidateItem extends React.Component<CandidateItemProps, CandidateItemState>  {
    constructor(props: CandidateItemProps, state: CandidateItemState) {
        super(props, state);
        this.state = {
            subViewed: false
        }
    }

    componentWillMount() {
        this.setState({ subViewed: this.props.candidate.viewedSubmission })
    }

    private _renderItem() {
        let { candidate, positions } = this.props;
        log.info("Render Candidates")
        return (
            <ListItem key={candidate.userId} avatar style={StyleSheet.flatten([styles.listItem, (!!!candidate.viewedSubmission ? styles.unviewed : {})])} onPress={() => Actions[ScreenType.FACILITIES.HCP_DETAIL]({
                submissionId: candidate.submissionId,
                candidate,
                onClose: () => {
                    this.props.updateViewed(candidate.submissionId)
                }
            })}>
                <Left style={styles.itemSection}>
                    <Avatar size={48} source={candidate.photoUrl} />
                </Left>
                <Body style={StyleSheet.flatten([styles.itemSection, styles.body])}>
                    <Text style={AppFonts.listItemTitleTouchable}>{candidate.display.title}</Text>
                    {!!candidate.display.description && <Text style={StyleSheet.flatten(AppFonts.listItemDescription)}>{candidate.display.description}</Text>}
                </Body>
                {!!candidate.photoLabel &&
                    <Right style={styles.itemSection}>
                        <BubbleLabel height={18} textStyle={{ fontSize: 12 }} style={{ width: 48, borderWidth: 0, backgroundColor: "#36D8A3" }} title={candidate.photoLabel} />
                    </Right>
                }
            </ListItem>
        )
    }

    private _renderShowMore() {
        const { candidatesCount, showAllHighlight } = this.props;
        return (
            <ListItem key="show-more" avatar style={StyleSheet.flatten([styles.listItem])} onPress={this.props.onMorePress}>
                <Body style={StyleSheet.flatten([styles.itemSection, styles.body, styles.showMoreBody])}>
                    <Text style={StyleSheet.flatten([AppFonts.bodyTextNormalTouchable, (showAllHighlight ? styles.buttonHighlight : {} )])}>Show All {candidatesCount} Candidates</Text>
                </Body>
            </ListItem>
        )
    }

    render() {
        const { index, showAll } = this.props;

        if (!showAll && index === 3) {
            return this._renderShowMore();
        } else if (!showAll && index > 3) {
            return null;
        }

        return this._renderItem();
    }
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: variables.white,
        paddingLeft: 16,
        paddingRight: 8,
        borderTopWidth: .5,
        borderBottomColor: AppColors.gray,
        borderTopColor: AppColors.gray,
        borderRightColor: AppColors.gray
    },
    buttonHighlight: {
        backgroundColor: AppColors.blue,
        color: AppColors.white,
        borderRadius: 6,
        padding: 5
    },
    unviewed: {
        borderLeftColor: AppColors.blue,
        borderLeftWidth: 5,
        paddingLeft: 11
    },
    itemSection: {
        borderWidth: 0,
        borderBottomWidth: 0
    },
    body: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    showMoreBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})