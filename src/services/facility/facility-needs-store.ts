import { types, flow, getSnapshot, applySnapshot } from 'mobx-state-tree'
import { rest } from '../../services'
import { TitleDescriptionModel } from '../title-description-model'
import {logger} from 'react-native-logger'

export const NeedStatModel = types.model('NeedStat', {
    title: types.optional(types.string, ''),
    description: types.optional(types.string, '')
})

export const NeedDetailModel = types.model('Need', {
    needId: types.optional(types.string, ''),
    display: types.maybe(TitleDescriptionModel),
    encryptedId: types.optional(types.string, ''),
    facilityId: types.optional(types.string, ''),
    facility: types.optional(types.string, ''),
    city: types.optional(types.string, ''),
    state: types.optional(types.string, ''),
    discipline: types.optional(types.string, ''),
    specialty: types.optional(types.string, ''),
    unitType: types.optional(types.string, ''),
    shift: types.optional(types.string, ''),
    profileCount: types.optional(types.number, 0),
    availablePositions: types.optional(types.number, 0),
    isNew: types.optional(types.boolean, false),
    jobTypeId: types.optional(types.string, ''),
    jobType: types.optional(types.string, ''),
    interviewQuestionCount: types.optional(types.number, 0),
    stats: types.optional(types.array(NeedStatModel), [])
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })


export const NeedSummaryModel = types.model('NeedSummery', {
    Status: types.optional(types.string, ''),
    needDetails: types.optional(types.array(NeedDetailModel), [])
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })

export const FacilityNeedsModel = types.model('FacilityNeeds', {
    facilityId: types.optional(types.string, ''),
    facility: types.optional(types.string, ''),
    needs: types.optional(types.array(NeedSummaryModel), [])
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })

export const FacilityNeedsStore = types.model('FacilityNeedsStore', {
    facilities: types.optional(types.array(FacilityNeedsModel), []),
    loading: types.optional(types.boolean, false)
})
    .views(self => {
        return {
            findNeed: (needId) => {
                var result: typeof NeedDetailModel.Type = null;

                self.facilities.find(facility => {
                    return !!facility.needs.find(need => {
                        return !!need.needDetails.find(detail => {
                            if (detail.needId === needId) {
                                result = detail;
                                return true;
                            }

                            return false;
                        })
                    })
                })

                return result;
            }
        }
    })
    .actions(self => {
        return {
            reset() {
                try {
                    logger('FacilityNeedsStore', 'Reset')
                    applySnapshot(self, {})

                } catch (error) {
                    logger('FacilityNeedsStore', 'Reset', 'Error', error)
                }
            },
            load: flow(function* () {
                self.loading = true

                try {
                    logger.log('FacilityNeedsStore', 'loading needs')

                    const response = yield rest.get(`/facility/needs`)
                    FacilityNeedsStore.applySnapshot(self.$treenode, {
                        facilities: response.data,
                        //loading: false
                    })
                    
                    logger.log('FacilityNeedsStore', 'needs loaded', response)
                    return true;

                } catch (error) {
                    self.loading = false;
                    return false;
                }
            }),
            getSnapshot() {
                return getSnapshot(self) as any
            }
        }
    })


export const facilityNeedsStoreInstance = FacilityNeedsStore.create();