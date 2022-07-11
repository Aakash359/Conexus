import { types, getSnapshot } from 'mobx-state-tree'
import { ConversationPositionModel } from './conversation-position-model'

export const ConversationFacilityModel = types.model('ConversationFacilityModel', {
    facilityId: types.optional(types.string, ''),
    facility: types.optional(types.string, ''),
    positions: types.optional(types.array(ConversationPositionModel), []),
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})