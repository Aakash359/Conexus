
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { defaultBaseUrl } from '../../redux/constants'

// const log = logger.createLogger()
// class VideoService {
//     initVideoConference(submissionId?: string, ids?: string[]) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'init-video-conference', log => {
//             const data: any = { submissionId: submissionId ||  uuid() }
//             if (ids) {
//                 data.users = ids 
//             }
//             rest.post('/conference/begin', data)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, reject)
//           // })
//         })
//       }
//       initVideoSession() {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'init-video-session', log => {
//             rest.get('/conference/createSession')
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, reject)
//           // })
//         })
//       }
//       endVideoSession(sessionId: string, userId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'end-video-session', log => {
//             let data = { sessionId, userId }
//             rest.post(`/conference/end`, data)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res)
//               }, reject)
//           // })
//         })
//       }
//       startRecordVideoSession(sessionId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'start-record-video-session', log => {
//             log.info('url', `/conference/archive/start/${sessionId}`)
//             rest.get(`/conference/archive/start/${sessionId}`)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, (res) => {
//                 log.info('err', res)
//                 reject(res)
//               })
//           // })
//         })
//       }
      
//       endRecordVideoSession(archiveId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'end-record-video-session', log => {
//             log.info('url', `/conference/archive/stop/${archiveId}`)
//             rest.get(`/conference/archive/stop/${archiveId}`)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, (res) => {
//                 log.info('err', res)
//                 reject(res)
//               })
//           // })
//         })
//       }
//       saveVideo(archiveId: string, questionId: number) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'save-video-archive', log => {
//             rest.get(`/conference/archive/save/${archiveId}/${questionId}`)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, (res) => {
//                 log.info('err', res)
//                 reject(res)
//               })
//           // })
//         })
//       }

//       saveVideoAnswer(submissionId: string, archiveId: string, questionId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'save-video-answer-archive', log => {
//             const data = {submissionId, archiveId, questionId}
//             log.info('sending', data)
//             rest.post(`/hcp/submitInterviewQuestion`, data)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, (res) => {
//                 log.info('err', res)
//                 reject(res)
//               })
//           // })
//         })
//       }

//       getVideoArchive(archiveId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'get-video-archive', log => {
//             log.info('url', `/conference/archive/get/${archiveId}`)
//             rest.get(`/conference/archive/get/${archiveId}`)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, (res) => {
//                 log.info('err', res)
//                 reject(res)
//               })
//           // })
//         })
//       }
//       deleteVideoArchive(archiveId: string) {
//         return new Promise<any>((resolve, reject) => {
//           // logger.group('api', 'delete-video-archive', log => {
//             rest.get(`/conference/archive/delete/${archiveId}`)
//               .then((res) => {
//                 log.info('response', res)
//                 resolve(res.data)
//               }, reject)
//           // })
//         })
//       }
// }



// export const videoService = new VideoService()



export const initVideoConferenceService = async(payload: { [x: number]: any; submissionId: any; }) => 
axios.post(`${defaultBaseUrl}/conference/begin`,payload,{
   headers: {
      Authorization: `Bearer ${ await AsyncStorage.getItem('authToken')}`,
    },
});