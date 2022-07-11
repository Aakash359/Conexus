
import React from 'react'
import { ViewProperties } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import { ScreenType } from '../../../common'
import { UserStore, UserFacilityModel } from '../../../stores'
import { FacilitySelectionContainer, ScreenFooterButton } from '../../../components'

export interface SchedulingContainerProps extends ViewProperties {
    userStore: UserStore
}

export interface SchedulingContainerState {
    refreshing: boolean,
}

@inject('userStore')
@observer
export class SchedulingContainer extends React.Component<SchedulingContainerProps, SchedulingContainerState>  {

    get selectedFacility(): typeof UserFacilityModel.Type {
        const { userStore } = this.props

        if (userStore.selectedFacilityId) {
            return userStore.selectedFacility
        }

        return null;
    }

    get showNoData(): boolean {
        return true
    }

    get showLoading(): boolean {
        return false
    }

    constructor(props, state) {
        super(props, state)

        this.state = {
            refreshing: false
        }
    }

    showScheduleAvailability() {
        Actions[ScreenType.FACILITIES.SCHEDULING.SCHEDULE_AVAILABILITY]()
    }

    load() {
        
    }

    render() {
        return (
            <FacilitySelectionContainer
                showNoData={false}//this.showNoData}
                showLoading={this.showLoading}
                noDataText="Scheduling not yet available."
                facilityHeaderCaption="Showing schedules for"
                refreshing={this.state.refreshing}
                onRefresh={this.load.bind(this, true)}
                onFacilityChosen={(facilityId: string) => this.forceUpdate()}>
                <ScreenFooterButton title="Schedule Availability" onPress={this.showScheduleAvailability.bind(this)} />
            </FacilitySelectionContainer>
        )
    }
}