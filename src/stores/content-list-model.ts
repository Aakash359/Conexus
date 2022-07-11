import { types, getSnapshot } from 'mobx-state-tree'

export const ContentListItemModel = types.model('ContentListItem', {
    text: types.optional(types.string, ''),
    icon: types.optional(types.string, ''),
    image: types.optional(types.string, ''),
    iconColor: types.optional(types.string, '')
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})

export const ContentListModel = types.model('ContentList', {
    title: types.optional(types.string, ''),
    list: types.optional(types.array(ContentListItemModel), [])
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})