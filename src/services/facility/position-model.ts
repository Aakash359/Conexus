import { types, getSnapshot } from 'mobx-state-tree'
import { TitleDescriptionModel } from '../title-description-model';
import { CandidateModel } from './candidate-model';

export const PositionModel = types.model('Position', {
    display: TitleDescriptionModel,
    needId: types.optional(types.string, ''),
    unit: types.optional(types.string, ''),
    discipline: types.optional(types.string, ''),
    specialty: types.optional(types.string, ''),
    shift: types.optional(types.string, ''),
    candidates: types.maybe(types.array(CandidateModel))
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        }
    }
})
