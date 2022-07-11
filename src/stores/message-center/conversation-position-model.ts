import { types, getSnapshot } from 'mobx-state-tree'
import { ConversationModel } from './conversation-model'
import { TitleDescriptionModel } from '../title-description-model'

export const ConversationPositionModel = types.model('ConversationPosition', {
    needId: types.string,
    display: types.maybe(TitleDescriptionModel),
    unitName: types.optional(types.string, ''),
    discipline: types.optional(types.string, ''),
    specialty: types.optional(types.string, ''),
    shiftName: types.optional(types.string, ''),
    conversations: types.optional(types.array(ConversationModel), [])
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})