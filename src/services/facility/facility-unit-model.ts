import { types, getSnapshot } from 'mobx-state-tree'
import { rest } from '../../services/rest'

export const FacilityUnitModel = types.model({
    unitId: types.optional(types.string, '-1'),
    unitName: types.optional(types.string, ''),
    unitType: types.optional(types.string, ''),
    unitDescription: types.optional(types.string, ''),
    specialties: types.optional(types.string, ''),
    specialtyIds: types.optional(types.string, ''),
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})

export const loadFacilityUnits = function (facilityId) {
    const url = `/facility/listUnits/${facilityId}`;

    return rest.get(url).then((response) => {
        const result = response.data.map(unitData => {
            return FacilityUnitModel.create(unitData)
        })

        return Promise.resolve(result);
    }, (err) => {
        return Promise.reject(err)
    })


}