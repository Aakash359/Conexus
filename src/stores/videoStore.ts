
// import Sound from 'react-native-sound'
import { Actions } from 'react-native-router-flux'
import { videoService } from '../services'
import { logger } from 'react-native-logs'
// import OpenTok from 'react-native-opentok'
import { ScreenType } from '../common'
import { types, flow } from 'mobx-state-tree'
import { deviceStore } from '.';

const log = logger.createLogger()

enum VideoStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}
export enum VideoType {
  INBOUND_CALL = 'INBOUND_CALL',
  OUTBOUND_CALL = 'OUTBOUND_CALL',
  ARCHIVE = 'ARCHIVE',
  NONE = 'NONE'
}
interface Session {
  sessionId: string
  token: string
  isRemoteConnected?: boolean
  status?: VideoStatus
  type?: VideoType
  autoRetry?: boolean
}
// interface Caller {
//   title?: string,
//   subTitle?: string,
//   photo?: string
// }
// let ringer: Sound = undefined

const RETRY_COUNT: number = 3

const CallerModel = types.model('CallerModel', {
  title: types.optional(types.union(types.string, types.undefined), ''),
  name: types.optional(types.union(types.string, types.undefined), ''),
  subTitle: types.optional(types.union(types.string, types.undefined), ''),
  photo: types.optional(types.union(types.string, types.undefined), '')
})

const VideoStore = types
  .model('VideoStore', {
    sessionId: types.optional(types.union(types.string, types.undefined), undefined),
    token: types.optional(types.union(types.string, types.undefined), undefined),
    retryCount: types.optional(types.number, 0),
    status: types.optional(types.enumeration('VideoStatus', [VideoStatus.CONNECTING, VideoStatus.CONNECTED, VideoStatus.DISCONNECTED]), VideoStatus.DISCONNECTED),
    type: types.optional(types.enumeration('VideoType', [VideoType.NONE, VideoType.OUTBOUND_CALL, VideoType.INBOUND_CALL, VideoType.ARCHIVE]), VideoType.NONE),
    isRecording: types.optional(types.boolean, false),
    isPublishing: types.optional(types.boolean, false),
    isSubscribed: types.optional(types.boolean, false),
    inCall: types.optional(types.boolean, false),
    isOutgoing: types.optional(types.boolean, false),
    isAutoAnswer: types.optional(types.boolean, false),
    archiveId: types.optional(types.union(types.string, types.undefined), ''),
    videoUrl: types.optional(types.union(types.string, types.undefined), ''),
    caller: types.optional(types.union(CallerModel, types.undefined), undefined),
  })
  .views(self => ({
    get hasVideo() { return (self.type === VideoType.ARCHIVE && (self.archiveId || self.videoUrl)) },
    get isConnected() { return (self.status === VideoStatus.CONNECTED) },
    get isCall() { return (self.type === VideoType.INBOUND_CALL || self.type === VideoType.OUTBOUND_CALL) },
    get retry() { return self.retryCount > 0 }
  }))
  .actions(self => {
    {
      const connectSession = flow(function* () {
        
        self.isPublishing = false
        self.isSubscribed = false
        self.inCall = false
        if (self.status !== VideoStatus.CONNECTED) {
          log.info('VideoStore:connectingSession:', self.status)
          self.status = VideoStatus.CONNECTING
          self.inCall = true
          // let result = yield OpenTok.connect(self.sessionId, self.token)
          // if (result) {
          //   log.info('VideoStore:connectedSession:', self.status)
          //   self.status = VideoStatus.CONNECTED
          // } else {
          //   log.info('VideoStore:connectingFailedSession:', self.status)
          // }
        } else {
          log.info('VideoStore:alreadyConnected', self.status)
        }
      })

      const call = flow<string, string, typeof CallerModel.Type>(function* (submissionId, userId, contact?: typeof CallerModel.Type) {
        reset(VideoType.OUTBOUND_CALL)
        const result = yield videoService.initVideoConference(submissionId, [userId])
        self.sessionId = result.sessionId
        self.token = result.token
        self.isAutoAnswer = true
        self.isOutgoing = true
        if (!!contact) {
          self.caller = CallerModel.create(contact)
        }
        Actions[ScreenType.CALL]({ sessionId: self.sessionId, token: self.token, autoAnswer: true, isOutgoing: true  })
        return result
      })
      const endCall = flow<string>(function* (userId: string) {
        yield videoService.endVideoSession(self.sessionId, userId) 
      })

      const callRecieved = flow<Session, typeof CallerModel.Type, boolean>(function* (session: Session, caller: typeof CallerModel.Type, autoAnswer: boolean = false) {
        reset(VideoType.INBOUND_CALL)
        self.sessionId = session.sessionId
        self.token = session.token
        log.info(`VideoStore:Caller:`, caller)
        self.caller = CallerModel.create(caller)
        self.isPublishing = false
        self.isSubscribed = false
        self.inCall = false
        self.isAutoAnswer = autoAnswer
        self.isOutgoing = false
        log.info(`VideoStore:callRecieved:${autoAnswer}`)
        if (!deviceStore.isInBackground) {
          setTimeout(() => {
            Actions[ScreenType.CALL]({ sessionId: self.sessionId, token: self.token, autoAnswer, inOutgoing: false })
          }, 200)
        }
        log.info('VideoStore:callRecieved:afterScreenPush', self)
      })

      const initVideoSession = flow(function* () {
        log.info('VideoStore', 'initVideoSession', 'Current connection state: ', self.status)
        reset(VideoType.ARCHIVE)
        const result = yield videoService.initVideoSession()
        log.info('VideoStore', 'initVideoSession:Response', result)
        self.sessionId = result.sessionId
        self.token = result.token
        yield connectSession()
        return result
      })

      const recordSession = flow(function* () {
        log.info('VideoStore', 'Record session')

        const result = yield videoService.startRecordVideoSession(self.sessionId)
        log.info('VideoStore', 'recordSession:Response', result)
        self.archiveId = result.Id
        self.isRecording = true
        return result
      })

      const stopRecordingSession = flow(function* () {
        log.info('VideoStore', 'Stop recording session')

        const result = yield videoService.endRecordVideoSession(self.archiveId)
        log.info('VideoStore', 'stopRecordingSession:Response', result)
        self.videoUrl = result.Url
        self.isRecording = false
        return result
      })

      const saveRecording = flow(function* (archiveId: string, questionId: number) {
        const result = yield videoService.saveVideo(archiveId, questionId)
        self.videoUrl = result.Url
        return result
      })

      const saveRecordingAnswer = flow(function* (submissionId: string, archiveId: string, questionId: string) {
        const result = yield videoService.saveVideoAnswer(submissionId, archiveId, questionId)
        self.videoUrl = result.Url
        return result
      })

      const getArchive = flow(function* (archiveId: string) {
        const result = yield videoService.getVideoArchive(archiveId)
        self.videoUrl = result.Url
        return result
      })

      const deleteArchive = flow<string>(function* (archiveId: string) {
        log.info('VideoStore', 'Deleting archive', archiveId)

        const result = yield videoService.deleteVideoArchive(archiveId)
        self.videoUrl = ''
        self.archiveId = ''
        return result
      })
      const reset = (type?: VideoType) => {
        log.info('VideoStore ********RESET**********', 'Resetting')
        self.sessionId = ''
        self.token = ''
        self.caller = self.caller = CallerModel.create({})
        self.retryCount = RETRY_COUNT
        self.status = VideoStatus.DISCONNECTED
        self.type = type ? type : VideoType.NONE
        self.archiveId = ''
        self.videoUrl = ''
        self.isSubscribed = false
        self.isPublishing = false 
        self.inCall = false
      }
      const setSession = (session: Session) => {
        log.info('VideoStore', 'Setting session', session)
        self.sessionId = session.sessionId
        self.token = session.token
      }
      const setSessionId = (sessionId: string) => {
        log.info('VideoStore', 'Setting sessionId', sessionId)
        self.sessionId = sessionId
      }
      const setIsSubscribed = (isSubscribed: boolean) => {
        log.info('VideoStore', 'Setting IsSubscribed', isSubscribed)
        self.isSubscribed = isSubscribed
      }
      const setIsPublishing = (isPublishing: boolean) => {
        log.info('VideoStore', 'Setting IsPublishing', isPublishing)
        self.isPublishing = isPublishing
      }
      const setInCall = (inCall: boolean) => {
        self.inCall = inCall
      }
      const setConnected = flow(function* (isConnected: boolean) {
        self.status = isConnected ? VideoStatus.CONNECTED : VideoStatus.DISCONNECTED
        if (!isConnected && self.isCall && self.retry) {
          self.retryCount--
          yield connectSession()
        }
      })

      const disconnect = () => {
        log.info('VideoStore: Disconnecting')
        // reset(VideoType.NONE)
        if (self.sessionId) {
          try {
            // OpenTok.disconnectAll()
            
            log.info("Did it stop");
            log.info('VideoStore:Disconnected')
          } catch (error) {
            log.info(`VideoStore:Error`, error)
          }
          self.sessionId = undefined
        }
      }

      return {
        call, setSession, callRecieved, disconnect, setSessionId, setIsSubscribed, setIsPublishing, setConnected, initVideoSession,
        recordSession, stopRecordingSession, getArchive, deleteArchive, saveRecording, saveRecordingAnswer, connectSession, endCall, setInCall
      }
    }
  })

export const videoStore = VideoStore.create()
export type VideoStore = typeof VideoStore.Type

// OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, (e) => { log.info(OpenTok.events.ON_SIGNAL_RECEIVED, e) })
// OpenTok.on(OpenTok.events.ON_SESSION_DID_CONNECT, (e) => {
//   log.info('did-connect', e)
//   videoStore.setSessionId(e.sessionId)
//   videoStore.setConnected(true)
// })

// OpenTok.on(OpenTok.events.ON_SESSION_DID_FAIL_WITH_ERROR, (e) => {
//   log.info(OpenTok.events.ON_SESSION_DID_FAIL_WITH_ERROR, e)
  
//     videoStore.setConnected(false)
// })

// OpenTok.on(OpenTok.events.ON_SESSION_DID_DISCONNECT, (e) => {
//   log.info(OpenTok.events.ON_SESSION_DID_DISCONNECT, e)
  
//     videoStore.setConnected(false)
// })
