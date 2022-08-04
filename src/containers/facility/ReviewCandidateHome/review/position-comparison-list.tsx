
import React from 'react'
import { Text } from 'native-base'
import { StyleSheet, View, ScrollView, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { observer } from 'mobx-react'
import variables, { AppColors } from '../../../theme'
import { ScreenType } from '../../../common/constants'
import { PositionModel, CandidateModel } from '../../../stores/facility'
import { ComparisonList, Avatar } from '../../../components';
import { AppFonts, AppSizes } from '../../../theme';
import { logger } from 'react-native-logs'

export interface CanidateHeaderItemProps {
    candidate: typeof CandidateModel.Type,
    index: number,
    count: number,
    minHeight?: number,
    sizeChanged: (size: number) => void
}

export interface CanidateHeaderItemState {
    height: number
}
const log = logger.createLogger()
@observer
export class CanidateHeaderItem extends React.Component<CanidateHeaderItemProps, CanidateHeaderItemState>  {
    constructor(props) {
        super(props)
        this.state = { height: 0 }
    }

    render() {
        const { candidate, index, count, minHeight, sizeChanged } = this.props;
        const lastCell = index + 1 === count;
        return (
            <TouchableHighlight key={`candidate-${candidate.submissionId}-${index}`} onPress={() => Actions[ScreenType.FACILITIES.HCP_DETAIL]({ submissionId: candidate.submissionId, candidate })} >
                <View onLayout={(event) => { this.setState({ height: event.nativeEvent.layout.height }); sizeChanged(event.nativeEvent.layout.height) }} style={StyleSheet.flatten([styles.candidateCell, lastCell && { borderRightWidth: 0 }, minHeight && { height: minHeight }])} >
                    <Avatar size={86} source={candidate.photoUrl} title={candidate.photoLabel} titleStyle={{ backgroundColor: "#C7D8E0" }} />
                    {candidate.display.title && <Text style={styles.candidateName}>{candidate.display.title}</Text>}
                    <Text style={{ position: 'absolute', left: 0, bottom: 0, zIndex: 2, fontSize: 8 }}>{this.state.height}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}
export interface PositionComparisonListProps {
    position: typeof PositionModel.Type,
    updateViewed: (s: string) => any
}

export interface PositionComparisonListState {
    minHeight?: number
    showAll?: boolean
    comparing?: boolean
}

// @observer
export class PositionComparisonList extends React.Component<PositionComparisonListProps, PositionComparisonListState>  {
    constructor(props: PositionComparisonListProps, state: PositionComparisonListState) {
        super(props, state);
        this.state = state || { showAll: false, comparing: false, minHeight: 0 }
    }

    componentWillMount() {

    }

    showAll() {
        this.setState({ showAll: true })
    }

    _getCellWidth(cellCount: number): number {
        if (cellCount === 1) {
            return AppSizes.screen.width;
        }

        if (cellCount <= 2) {
            return AppSizes.screen.width / 2;
        }

        if (cellCount === 3) {
            return AppSizes.screen.width / 3;
        }

        return (AppSizes.screen.width * .94) / 3;  // First 3 items should take up all but 6% of screen width
    }

    _renderCandidateCell(candidate: typeof CandidateModel.Type, index: number, count: number) {
        const lastCell = index + 1 === count;
        let cellStyle = { width: this._getCellWidth(count) };
        log.info(candidate)
        return (
            <View key={`${index}`} style={StyleSheet.flatten([styles.candidateCell, cellStyle, lastCell && { borderRightWidth: 0 }, !!!candidate.viewedSubmission && { borderBottomWidth: 5, borderBottomColor: AppColors.blue }])} >
                {<Avatar size={86} source={candidate.photoUrl} title={candidate.photoLabel} style={{ height: 96 }} titleStyle={{ backgroundColor: "#36D8A3" }} />}
                {!!candidate.display.title && <Text style={styles.candidateName} numberOfLines={2} ellipsizeMode="tail">{candidate.display.title}</Text>}
            </View>
        )
    }

    private _renderCandidate(candidate: typeof CandidateModel.Type, index: number, count: number) {
        const { updateViewed } = this.props
        return (
            <View key={`candidate-${candidate.submissionId}-${index}`}>
                <TouchableHighlight onPress={() => Actions[ScreenType.FACILITIES.HCP_DETAIL]({
                    submissionId: candidate.submissionId,
                    candidate, onClose: () => {
                        this.props.updateViewed(candidate.submissionId)
                    }
                })}>
                    {this._renderCandidateCell(candidate, index, count)}
                </TouchableHighlight>
                <ComparisonList index={index} cellWidth={this._getCellWidth(count)} count={count} data={candidate.compData} />
            </View>
        )
    }

    render() {
        const { position } = this.props;

        return (
            <ScrollView horizontal={true} style={{ position: 'relative' }}>
                {position.candidates.map((candidate, index) => this._renderCandidate(candidate, index, position.candidates.length))}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    candidateCell: {
        flexDirection: 'column',
        alignItems: "center",
        padding: 12,
        paddingTop: 18,
        paddingBottom: 36,
        backgroundColor: 'white',

        borderColor: variables.lightBlue,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        height: 205
    },
    candidateName: {
        opacity: .95,
        textAlign: 'center',
        ...AppFonts.candidateComparison.candidateTitle,
        paddingTop: 8,
    }
})