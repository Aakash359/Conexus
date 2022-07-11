import { types, getSnapshot } from 'mobx-state-tree'

export const CommunicationTypeModel = types.model('CommunicationType', {
    typeId: types.string,
    type: types.string,
    available: types.boolean
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})