
import React from 'react'
import { ViewProperties, StyleSheet, Alert } from 'react-native'
import { inject, observer } from 'mobx-react'
import { FacilitySubmissionsStore, FacilityModel, UserStore } from '../../../stores'
import { FacilitySelectionContainer } from '../../../components'
import { logger } from 'react-native-logs'
import { PositionList } from './position-list'

export interface ReviewContainerProps extends ViewProperties {
    facilitySubmissionsStore: typeof FacilitySubmissionsStore.Type,
    userStore: UserStore,
    forceRefresh?: boolean
}

export interface ReviewContainerState {
    refreshing: boolean
}
const log = logger.createLogger()
let submissionsStorePromise: Promise<any>;

@inject('facilitySubmissionsStore', 'userStore')
//@observer
export class ReviewContainer extends React.Component<ReviewContainerProps, ReviewContainerState>  {

    mounted: boolean = false;

    get selectedFacility(): typeof FacilityModel.Type {
        const { facilitySubmissionsStore, userStore } = this.props

        if (facilitySubmissionsStore.loading) {
            return null
        }

        if (userStore.selectedFacilityId) {
            return facilitySubmissionsStore.submissions.find(facility => facility.facilityId === userStore.selectedFacilityId)
        }

        return null;
    }

    get showNoData(): boolean {
        const { facilitySubmissionsStore } = this.props
        if (this.state.refreshing || facilitySubmissionsStore.loading) {
            return false
        }

        return !this.selectedFacility
            || this.selectedFacility.positions.length === 0
    }

    get showLoading(): boolean {
        const { facilitySubmissionsStore } = this.props

        if (this.state.refreshing) {
            return false
        }
        return facilitySubmissionsStore.loading
    }

    constructor(props, state) {
        super(props, state);
        this.state = {
            refreshing: false
        }

        log.info('ReviewContainer', 'constructor') // This component is being inited more than once on startup
    }

    componentDidMount() {
        this.mounted = true;

        if (this.props.userStore.isFacilityUser) {
            this.load(false)
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    private load(refreshing: boolean = false) {
        const { facilitySubmissionsStore } = this.props

        log.info('ReviewContainer', 'Load', refreshing)
        this.setState({ refreshing: refreshing });


        if (!submissionsStorePromise) {
            log.info('ReviewContainer', 'Loading Submissions', refreshing)
            submissionsStorePromise = facilitySubmissionsStore.load()
        } else {
            log.info('ReviewContainer', 'Joining existing submission store load', refreshing)
        }

        submissionsStorePromise
            .then(() => {
                if (this.mounted) {
                    log.info('ReviewContainer', 'Submissions loaded')

                    this.setState({ refreshing: false }, () => {
                        submissionsStorePromise = undefined
                    })
                } else {
                    log.info('ReviewContainer', 'Not mounted so doing nothing after data loaded.')
                }
            },
                (error) => {
                    if (this.mounted) {
                        submissionsStorePromise = undefined
                        this.setState({ refreshing: false })
                    } else {
                        log.info('ReviewContainer', 'Not mounted so doing nothing after data loaded.')
                    }

                    log.info('ReviewContainer', 'ERROR', error)
                    Alert.alert('Error', 'We are having trouble loading your positions and candidates. Please try again.')
                })
    }

    renderPositionList() {
        const { facilitySubmissionsStore } = this.props
        const { refreshing } = this.state;

        return <PositionList
            style={{ flex: 1 }}
            submissions={facilitySubmissionsStore.getSnapshot().submissions}
            selectedFacilityId={this.selectedFacility ? this.selectedFacility.facilityId : ''}
            refreshing={refreshing}
            onRefresh={this.load.bind(this, true)}
        />
    }

    render() {
        const { facilitySubmissionsStore } = this.props

        return <FacilitySelectionContainer
            showNoData={this.showNoData}
            showLoading={this.showLoading}
            noDataText="No Positions Available"
            facilityHeaderCaption="Showing positions for"
            refreshing={this.state.refreshing}
            onRefresh={this.load.bind(this, true)}
            onFacilityChosen={(facilityId: string) => this.forceUpdate()}>

            {!!facilitySubmissionsStore.submissions && this.renderPositionList()}

        </FacilitySelectionContainer>
    }

    styles = StyleSheet.create({

    })
}