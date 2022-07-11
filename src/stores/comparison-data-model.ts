import { types, getSnapshot } from 'mobx-state-tree'
import { ContentListModel } from './content-list-model';
export const ComparisonDataModel = types.model("ComparisonData", {
    type: types.optional(types.string, ''),
    headerTitle: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    icon: types.optional(types.string, ''),
    iconColor: types.optional(types.string, ''),
    navParams: types.optional(types.string, ''),
    imageUrl: types.optional(types.string, ''),
    details: types.maybe(types.array(ContentListModel))
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})