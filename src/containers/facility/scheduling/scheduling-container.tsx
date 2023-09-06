import React from 'react';
import {Strings} from '../../../common/Strings';

import {ScreenFooterButton} from '../../../components';

const {UNAVAILABLE_SCHEDULING} = Strings;

export class SchedulingContainer extends React.Component {
  // get selectedFacility(): typeof UserFacilityModel.Type {
  //   const {userStore} = this.props;

  //   if (userStore.selectedFacilityId) {
  //     return userStore.selectedFacility;
  //   }

  //   return null;
  // }

  get showNoData(): boolean {
    return true;
  }

  get showLoading(): boolean {
    return false;
  }

  constructor(props, state) {
    super(props, state);

    this.state = {
      refreshing: false,
    };
  }

  showScheduleAvailability() {
    // Actions[ScreenType.FACILITIES.SCHEDULING.SCHEDULE_AVAILABILITY]()
  }

  load() {}

  render() {
    return (
      <FacilitySelectionContainer
        showNoData={false} //this.showNoData}
        showLoading={this.showLoading}
        noDataText={UNAVAILABLE_SCHEDULING}
        facilityHeaderCaption="Showing schedules for"
        refreshing={this.state.refreshing}
        onRefresh={this.load.bind(this, true)}
        onFacilityChosen={(facilityId: string) => this.forceUpdate()}
      >
        <ScreenFooterButton
          title="Schedule Availability"
          onPress={this.showScheduleAvailability.bind(this)}
        />
      </FacilitySelectionContainer>
    );
  }
}
