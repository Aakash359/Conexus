// import { types, flow, getSnapshot } from 'mobx-state-tree'
// import { rest } from '../../services/rest'

// import { FacilityModel } from './facility-model'
// import { QuestionModel } from './question-model'
// import { QuestionSectionModel } from './question-model'
// import _ from 'lodash'
// import { logger } from 'react-native-logs'
// const log = logger.createLogger()
// export const FacilityQuestionsStore = types
//     .model({
//         facilities: types.optional(types.array(FacilityModel), []),
//         needSection: types.maybe(QuestionSectionModel),
//         needId: types.optional(types.string, ''),
//         loading: types.optional(types.boolean, false),
//         loadingError: types.optional(types.string, '')
//     })
//     .actions(self => {

//         const actions = {
//             reset: function () {
//                 self.facilities.clear()
//                 self.needSection = null,
//                     self.needId = ''
//                 self.loading = false
//                 self.loadingError = ''
//             },
//             refresh() {
//                 return actions.load(self.needId)
//             },

//             findQuestionSection(facilityId: string, sectionId: string): typeof QuestionSectionModel.Type {
//                 const facility = self.facilities.find(i => i.facilityId === facilityId);
//                 if (facility) {
//                     return facility.questionSections.find(section => section.sectionId === sectionId)
//                 }

//                 return null
//             },

//             findQuestion(facilityId, questionId): typeof QuestionModel.Type {
//                 for (const fac of self.facilities) {
//                     for (var section of fac.questionSections) {
//                         var question = section.findQuestion(questionId);
//                         if (question) {
//                             return question
//                         }
//                     }
//                 }

//                 if (self.needSection) {
//                     var question = self.needSection.findQuestion(questionId);
//                     if (question) {
//                         return question
//                     }
//                 }

//                 return null;
//             },

//             findQuestionWithoutFacility(questionId: string, needId: string) {
//                 for (const fac of self.facilities) {
//                     var question = actions.findQuestion(fac.facilityId, questionId);
//                     if (question) {
//                         return question;
//                     }
//                 }

//                 if (self.needSection) {
//                     var needQuestion = self.needSection.findQuestion(questionId);
//                     if (needQuestion) {
//                         return needQuestion;
//                     }
//                 }

//                 return null;
//             },

//             load: flow<string>(function* (needId: string) {
                
//                 try {
//                     self.loading = true
//                     const url = needId ? `/facility/needInterviewQuestions/${needId}` : '/facility/listInterviewQuestions'
//                     log.info('Loading questions from ' + url)

//                     const response = yield rest.get(url)
//                     actions.reset()

//                     if (needId) {
//                         var questions = _.orderBy(response.data, ['displayOrder'], ['asc']);

//                         self.needSection = QuestionSectionModel.create({
//                             questions: questions
//                         })
//                         self.needSection.setNeedId(needId) // Server doesn't return the need id in the question results
//                     } else {
//                         self.facilities = response.data.filter(i => !!i)
//                     }

//                     self.loading = false
//                     self.loadingError = ''

//                 } catch (error) {
//                     self.loading = false
//                     self.loadingError = error
//                     throw error
//                 }
//             }),

//             deleteQuestion: flow<string, string>(function* (questionId, needId) {

//                 const question = actions.findQuestionWithoutFacility(questionId, needId);

//                 if (question) {
//                     question.setDeleted();

//                     if (question.needId) {
//                         const url = `/facility/updateNeedQuestion/${needId}`
//                         const data = {
//                             facilityId: question.facilityId,
//                             id: question.id,
//                             deleted: true
//                         };

//                         log.info('deleting question for need', url, data)

//                         return yield rest.post(url, data).then(
//                             (response) => {
//                                 log.info('delete success', response);
//                             }, (error) => {
//                                 log.info('delete failed', error)
//                             })

//                     } else {
//                         const url = `/conference/deleteFacilityQuestion/${questionId}`
//                         log.info('deleting question', url)

//                         return yield rest.delete(url).then(
//                             (response) => {
//                                 log.info('delete success', response);
//                             }, (error) => {
//                                 log.info('delete failed', error)
//                             })
//                     }
//                 }
//             }),

//             getSnapshot() {
//                 return getSnapshot(self)
//             }

//         }

//         return actions
//     })


// export const facilityQuestionsStoreInstance = FacilityQuestionsStore.create()


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'


export const facilityQuestionsService = async() => axios.get(`${defaultBaseUrl}/facility/listInterviewQuestions`,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});

