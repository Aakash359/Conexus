import { types, getSnapshot } from 'mobx-state-tree'

export const CandidateResponseModel = types.model("CandidateResponseModel", {
    needId: types.optional(types.string, ''),
    facilityId: types.optional(types.string, ''),
    facility: types.optional(types.string, ''),
    specialty: types.optional(types.string, ''),
    shift: types.optional(types.string, ''),
    unitName: types.optional(types.string, ''),
    unitId: types.optional(types.string, ''),
    mediaDurationSeconds: types.optional(types.string, ''),
    maxAnswerLengthSeconds: types.optional(types.string, ''),
    maxThinkSeconds: types.optional(types.string, ''),
    createdByFirstName: types.optional(types.string, ''),
    createdByLastName: types.optional(types.string, ''),
    createdByTitle: types.optional(types.string, ''),
    questionId: types.optional(types.string, ''),
    questionNum: types.optional(types.string, ''),
    questionText: types.optional(types.string, ''),
    questionUrl: types.optional(types.string, ''),
    feedbackResponse: types.optional(types.number, 0),
    ResponseByFirstName: types.optional(types.string, ''),
    ResponseByLastName: types.optional(types.string, ''),
    ResponseByTitle: types.optional(types.string, ''),
    HCPViewedFlag: types.optional(types.boolean, false),
    answerAudioPath: types.optional(types.string, ''),
    answerMediaDuration: types.optional(types.string, ''),
    answerMediaType: types.optional(types.string, ''),
    answerVideoUrl: types.optional(types.string, ''),
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            },
            setFeedbackResponse(feedbackResponse: number) {
                self.feedbackResponse = feedbackResponse
            }
        }
    })

export const CandidateResponseSectionModel = types.model("CandidateResponseSectionModel", {
    sectionId: types.optional(types.string, ''),
    sectionTitle: types.optional(types.string, ''),
    questions: types.optional(types.array(CandidateResponseModel), [])
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })
