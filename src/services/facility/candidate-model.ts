import { types, flow, getSnapshot, applySnapshot } from 'mobx-state-tree'
import { TitleDescriptionModel } from '../title-description-model'
import { CommunicationTypeModel } from '../communication-type-model'
import { ComparisonDataModel } from '../comparison-data-model'
import { ContentListModel } from '../content-list-model'
import { ResumePagesModel } from './resume-pages-model'
import { CandidateResponseSectionModel } from './candidate-response-model'

import { Alert } from 'react-native'
import { rest } from '../../services'
import { logger } from 'react-native-logs'
const log = logger.createLogger()

export const loadCandidateBySubmissionId = (submissionId: string, handleOnError = true) => {

    let url = `/hcp/details/${submissionId}`;
    log.info('calling ' + url);

    return rest.get(url)
        .then((response) => {
            log.info('response', response.data);
            const result = CandidateModel.create(response.data);
            return result.resumePages.attachAuthToken()
                .then(() => {
                    return result;
                })
        })
}

export const CandidateModel = types.model('Candidate', {
    display: TitleDescriptionModel,
    userId: types.optional(types.string, ''),
    timeOff: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    firstName: types.optional(types.string, ''),
    viewedSubmission: types.optional(types.boolean, false),
    photoUrl: types.union(types.optional(types.string, '')),
    photoLabel: types.union(types.optional(types.string, '')),
    conversationAllowed: types.optional(types.boolean, false),
    startDate: types.optional(types.string, ''),
    submissionId: types.optional(types.string, ''),
    conversationId: types.optional(types.string, ''),
    communicationTypes: types.maybe(types.array(CommunicationTypeModel)),
    compData: types.maybe(types.array(ComparisonDataModel)),
    submissionSummary: types.optional(types.array(ContentListModel), []),
    resumePages: types.optional(ResumePagesModel, {}),
    sections: types.optional(types.array(CandidateResponseSectionModel), []),
    loading: types.optional(types.boolean, false)
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            },
            setName(first, last) {
                self.firstName = first
                self.lastName = last
                self.display.title = self.firstName + ' ' + self.lastName
            },
            setConversationId(conversationId: string) {
                self.conversationId = conversationId
            },
            setStartDate(startDate: string) {
                self.startDate = startDate
            },
            setViewed: flow<string>(function* (viewed: string) {                
                const response = yield rest.post(`hcp/submissionViewed/${viewed}`)               
            }),
            saveNotInterested: flow(function* () {
                const response = yield rest.post(`facility/updateSubmissionStatus`, {
                    submissionId: self.submissionId,
                    declineSubmission: true
                })
            }),

            saveMakeOffer: flow(function* () {
                const response = yield rest.post(`facility/submissionOffer`, {
                    submissionId: self.submissionId,
                    offerSubmission: true,
                    startDate: self.startDate
                })
                self.conversationAllowed = false
            }),

            saveFeedbackResponse: flow<string, number>(function* (questionId: string, feedbackResponse: number) {
                try {
                    const data = {
                        submissionId: self.submissionId,
                        questionId,
                        feedbackResponse
                    };

                    const url = '/facility/feedbackResponse';
                    const response = yield rest.post(url, data)
                    
                    self.sections.map(section => {
                        const question = section.questions.find(question => {
                            return question.questionId === questionId
                        })

                        if (question) {
                            question.setFeedbackResponse(feedbackResponse)
                        }
                    })

                    const { facilitySubmissionsStoreInstance } = require('./facility-submissions-store')
                    facilitySubmissionsStoreInstance.refresh().catch((error) => {
                        log.info('CandidateModel', 'facilitySubmissionsStoreInstance.load Error', error)
                    })

                } catch (error) {
                    log.info('ConversationStore', 'sendTextMessage:error', error)
                    throw error
                }
            }),

            refresh: flow(function* () {
                log.info("Refreshing")

                try {
                    const response = yield rest.get(`/hcp/details/${self.submissionId}`)
                    CandidateModel.applySnapshot(self.$treenode, response.data)
                    self.loading = false;
                    return true;

                } catch (error) {
                    self.loading = false;
                    let defaultTitle = 'Error';
                    let defaultDescription = 'An unexpected error occurred while loading the canidate.';
                    if (error.response && error.response.data) {
                        const { title, description } = error.response.data;
                        Alert.alert(title || defaultTitle, description || defaultDescription);
                    } else {
                        Alert.alert(defaultTitle, defaultDescription);
                    }

                    return false;
                }
            })
        }
    })