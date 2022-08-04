
import React from 'react'
import { ViewProperties, View, FlatList, ActivityIndicator } from 'react-native'
import { FacilityModel } from '../../../stores'
import { PositionListItem } from './position-list-item';
import { AppColors } from '../../../theme'

export interface PositionListProps extends ViewProperties {
    submissions: typeof FacilityModel.Type[],
    refreshing: boolean,
    selectedFacilityId: string,
    onRefresh?: () => {},
}

export interface PositionListState {

}

export class PositionList extends React.Component<PositionListProps, PositionListState>  {
    constructor(props: PositionListProps, state: PositionListState) {
        super(props, state);

        this.state = {

        }
    }

    componentWillMount() {

    }

    _getFacilitySelectionItem(facilityId: string, submissions: typeof FacilityModel.Type[]) {
        const facility = submissions.find(i => {
            return i.facilityId.toString() === facilityId
        })

        if (facility) {
            return {
                value: facility.facilityId.toString(),
                title: facility.facilityName
            }
        }

        return null;
    }

    _getFacilitySelectionItems(submissions: typeof FacilityModel.Type[]) {
        return submissions.map(i => {
            return {
                value: i.facilityId.toString(),
                title: i.facilityName
            }
        })
    }

    _getPositionsByFacilityId(facilityId: string, submissions: typeof FacilityModel.Type[]) {
        const facility = submissions.find(i => {
            return i.facilityId.toString() === facilityId
        })

        if (facility) {
            return facility.positions || []
        }

        return []
    }

    render() {
        const { submissions, onRefresh, refreshing } = this.props;
        const positions = this._getPositionsByFacilityId(this.props.selectedFacilityId, submissions);

        return (
            <FlatList
                key="position-list"
                onRefresh={onRefresh}
                refreshControl={<ActivityIndicator color={AppColors.blue} />}
                refreshing={refreshing}
                renderItem={({ item, index }) => <PositionListItem key={`${item.needId}-${index}`} position={item} first={index === 0} />}
                ListFooterComponent={() => { return (<View key="submission-list-footer" style={{ height: 120 }}></View>) }}
                data={positions}
            />
        )
    }
}
