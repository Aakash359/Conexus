
import React from 'react'
import { ViewProperties, View, StyleSheet } from 'react-native'
import { PositionModel, CandidateModel } from '../../../stores'
import { ViewHeader } from '../../../components';
import { CandidateItem } from './candidate-item';
import { PositionComparisonList } from './position-comparison-list';
import { logger } from 'react-native-logs'

const log = logger.createLogger()

export interface PositionListItemProps extends ViewProperties {
    position: typeof PositionModel.Type,
    first?: boolean
}

export interface PositionListItemState {
    showAll: boolean,
    comparing: boolean,
    position: typeof PositionModel.Type
}

export class PositionListItem extends React.Component<PositionListItemProps, PositionListItemState>  {

    constructor(props: PositionListItemProps, state: PositionListItemState) {
        super(props, state);
        const posit = Object.assign({}, this.props.position)
        this.state = state || { showAll: false, comparing: false, position: posit }
    }

    componentWillMount() {
        if (!this.state.position)
            this.setState({ position: this.props.position })
    }

    showAll() {
        this.setState({ showAll: true })
    }
    setViewedSubmission(subId: string) {
        this.setState(currentState => ({
            ...currentState,
            position: {
                ...currentState.position,
                candidates: currentState.position.candidates.map((c) => ({
                    ...c,
                    viewedSubmission: (c.submissionId === subId ? true : c.viewedSubmission)
                }))
            }
        }))
    }
    private _renderStandardList() {
        let { position } = this.state;
        const showAll = this.state.showAll;
        let showAllHighlight = position.candidates.find((cand, ind: number) => {
            return ind > 2 && !cand.viewedSubmission
        })
        log.info(showAllHighlight)
        return (position.candidates
            .map((candidate, index: number) => <CandidateItem positions={position} key={`${candidate.submissionId}-${index}`} candidate={candidate} candidatesCount={position.candidates.length} index={index} showAllHighlight={!!showAllHighlight} showAll={showAll}
                onMorePress={this.showAll.bind(this)}
                updateViewed={(s: string) => this.setViewedSubmission(s)} />))
    }

    private _renderComparingList() {
        const { position } = this.state;
        return (<PositionComparisonList position={position} updateViewed={(s: string) => this.setViewedSubmission(s)} />)
    }

    render() {
        log.info("State", this.props)
        const position = this.state.position;
        const { first } = this.props;
        const comparing = this.state.comparing;
        const defaultStyle = StyleSheet.create({
            comparing: {
                fontSize: 12
            }
        })

        return (
            <View key={position.needId.toString()}>
                {position.candidates.length > 0 && <ViewHeader title={position.display.title} description={position.display.description} first={first} actionTextStyle={!comparing ? defaultStyle.comparing : {}} actionText={comparing ? "List" : "Compare"} onActionPress={() => this.setState({ comparing: !comparing })} />}
                {comparing ? this._renderComparingList() : this._renderStandardList()}
            </View>
        )
    }
}
