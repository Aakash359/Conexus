
export class ScreenType {
  static SETTINGS = 'settings'
  static DRAWER = 'drawer'
  static LOGIN = 'login'
  static FORGOT_PASSWORD = 'forgot-password'
  static SELECT_ACCOUNT = 'select-account'
  static REQUEST_ACCOUNT = 'request-account'
  static PROFILE = 'profile-view'
  static PROFILE_EDIT = 'profile-edit'
  static WALKTHROUGH = 'walkthrough'
  static CALL = 'call'
  static CHAT = 'chat'
  static MAIN = 'main-nav'
  static YES_NO_LIGHTBOX = 'yes-no-lightbox'
  static RADIO_LIST_LIGHTBOX = 'radio-list-lightbox'
  static CONTACT_CANDIDATE_LIGHTBOX = 'contact-candidate-lightbox'
  static DEVICE_INFO_LIGHTBOX = 'device-info-lightbox'
  static CONTENT_LIST_MODAL = 'content-list'
  static IMAGE_GALLERY = 'image-gallery'
  static CONTENT_LIGHTBOX = 'content-lightbox'
  static VIDEO_RECORDER_LIGHTBOX = 'video-recorder-lightbox'
  static HCP_PHONE_CALL_LIGHTBOX = 'hcp-phone-call'
  static ANSWER_RATINGS_LIGHTBOX = 'answer-ratings-lightbox'
  static AUDIO_PLAYER_LIGHTBOX = 'audio-player-lightbox'
  
  static MESSAGE_CENTER = {
    NURSE_CONVERSATION_LIST: 'nurse-conversation-list',
    CONVERSATION_LIST: 'message-center-conversation-list',
    CONVERSATION: 'message-center-conversation'
  }
  static NURSES = {
    HOME: 'nurse-home',
    INTERVIEW: 'nurse-interview',
  }
  static FACILITIES = {
    HCP_DETAIL: "hcp-detail",
    NEED_QUESTION_LIST: "need-question-list",
    CATALOG: "question-catalog",
    CATALOG_SECTION: "catalog-section",
    CATALOG_QUESTION: "catalog-question",
    RECORD_QUESTION: 'record-question',
    REVIEW_HOME: 'review-home',
    REQUESTS_HOME: 'requests-home',
    AGENT_MESSAGE_MODAL: 'agent-message-modal',
    APP_FEEDBACK_MODAL: 'app-feedback-modal',
    QUESTION_PLAYBACK_LIGHTBOX: 'question-playback-lightbox',
    MAKE_OFFER_LIGHTBOX: 'make-offer',
    SCHEDULING: {
      HOME: 'scheduling-home',
      SCHEDULE_AVAILABILITY: 'schedule-availaility'
    }
  }
}

export class StoreType {
  static USER = 'userStore'
  static DEVICE = 'deviceStore'
  static ALL = [StoreType.USER, StoreType.DEVICE]
}



