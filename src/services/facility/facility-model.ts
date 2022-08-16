import { types, getSnapshot } from 'mobx-state-tree'
import { TitleDescriptionModel } from '../title-description-model'
import { PositionModel } from './position-model'
import { QuestionSectionModel, QuestionModel } from './question-model'

export const FacilityModel = types.model('Submission', {
    facilityId: types.optional(types.string, ''),
    display: types.optional(TitleDescriptionModel, TitleDescriptionModel.create()),
    facilityName: types.optional(types.string, ''),
    facPhotoUrl: types.optional(types.string, ''),
    positions: types.optional(types.array(PositionModel), []),
    questionSections: types.optional(types.array(QuestionSectionModel), [])
})

    // .actions(self => {
    //     return {
    //         findQuestion: (id: string) => {
    //             let result: typeof QuestionModel.Type

    //             self.questionSections.find(section => {
    //                 result = section.findQuestion(id);
    //                 return !!result
    //             })

    //             return result
    //         },
    //         getSnapshot() {
    //             return getSnapshot(self)
    //         }
    //     }
    // })
