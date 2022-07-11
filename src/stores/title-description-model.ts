import { types, getSnapshot } from 'mobx-state-tree'

export const TitleDescriptionModel = types.model({
    title: types.optional(types.string, ''),
    description: types.optional(types.string, '')
}).actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})