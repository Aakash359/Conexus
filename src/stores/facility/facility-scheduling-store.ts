import { types, flow, getSnapshot, applySnapshot } from 'mobx-state-tree'
import { rest } from '../../services'
import { TitleDescriptionModel } from '../title-description-model'

export const ScheduleEntryModel = types.model('ScheduleEntryModel', {
    scheduleDay: types.optional(types.string, ''),
    scheduleStartDate: types.optional(types.string, ''),
    scheduleEndDate: types.optional(types.string, ''),
    booked: types.optional(types.boolean, false),
    submissionId: types.optional(types.string, ''),
    hcpUserId: types.optional(types.string, ''),
    firstName: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    hcpPhotoUrl: types.optional(types.string, '')
})

export const ScheduleEntryGroupModel = types.model('ScheduleEntryGroupModel', {
    display: types.maybe(TitleDescriptionModel),
    entries: types.optional(types.array(ScheduleEntryModel), [])
})

export const FacilityScheduleStore = types.model('FacilityScheduleStore', {

})
    .actions(self => {
        return {

        }
    })

export const facilityScheduleStoreInstance = FacilityScheduleStore.create();