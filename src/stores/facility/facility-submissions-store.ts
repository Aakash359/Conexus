import { types, flow, getSnapshot } from 'mobx-state-tree'
import { rest } from '../../services/rest'
import { logger } from 'react-native-logs'
import { FacilityModel } from './facility-model';
const log = logger.createLogger()
export const FacilitySubmissionsStore = types
    .model({
        submissions: types.optional(types.array(FacilityModel), []),
        // loadedOnce: types.optional(types.boolean, false),
        loading: types.optional(types.boolean, false)
    })

    .actions(self => {
        return {
            reset: function () {
                self.submissions.clear();
                self.loading = false;
            },
            getSnapshot: function() {
                return getSnapshot(self) as any
            },
            refresh: flow(function* () {
                try {
                    log.info('Facility Submissions Store', 'Loading Facility Submissions')
                    const response = yield rest.get('/facility/facilitySubmissions')
                    log.info('Facility Submissions Store', 'Response', response)

                    // Transform comparison data
                    for (var facility of response.data) {
                        for (var position of facility.positions) {
                            const compTypes = <Array<any>>position.comps;

                            for (var candidate of position.candidates) {
                                for (var dataItem of candidate.compData || []) {
                                    const compType = compTypes.find(i => i.Id === dataItem.Id);
                                    if (compType) {
                                        dataItem.type = compType.type,
                                        dataItem.headerTitle = compType.title
                                    }
                                }
                            }
                        }
                    }

                    // response.data
                    self.submissions = response.data

                } catch (error) {
                    log.info('Facility Submissions Store', 'ERROR RESPONSE', error)
                    throw error
                }
            }),

            load: flow(function* () {
                try {
                    self.loading = true
                    log.info('Facility Submissions Store', 'Loading Facility Submissions')
                    const response = yield rest.get('/facility/facilitySubmissions')
                    log.info('Facility Submissions Store', 'Response', response)

                    // Transform comparison data
                    for (var facility of response.data) {
                        for (var position of facility.positions) {
                            const compTypes = <Array<any>>position.comps;

                            for (var candidate of position.candidates) {
                                for (var dataItem of candidate.compData || []) {
                                    const compType = compTypes.find(i => i.Id === dataItem.Id);
                                    if (compType) {
                                        dataItem.type = compType.type,
                                        dataItem.headerTitle = compType.title
                                    }
                                }
                            }
                        }
                    }

                    // response.data
                    self.submissions = response.data
                    self.loading = false

                } catch (error) {
                    self.loading = false
                    log.info('Facility Submissions Store', 'ERROR RESPONSE', error)
                    throw error
                }
            })
        }
    })


export const facilitySubmissionsStoreInstance = FacilitySubmissionsStore.create()
