import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {defaultBaseUrl} from './../redux/constants';

export interface IUser {
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  userType?: string;
  userTypeId?: number;
  password?: string;
  authToken?: string;
}

export interface IRegisterUser {
  firstName: string;
  lastName: string;
  company?: string;
  title?: string;
  eMail: string;
  phoneNumber: string;
  howHeard: string;
  isFacility: boolean;
}

export const facilityNeedService = async () =>
  axios.get(`${defaultBaseUrl}/facility/needs`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const facilitySubmissionsService = async () =>
  axios.get(`${defaultBaseUrl}/facility/facilitySubmissions`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const initiatePhoneCallService = async (data: {
  conversationId?: string;
  submissionId: any;
  callbackNumber?: any;
  messageTypeId?: string;
}) =>
  axios.post(`${defaultBaseUrl}/conference/messageSend`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const deleteNeedInterviewQuestionsService = async (
  needPayload: {facilityId: string; id: string; deleted: boolean},
  needId: any,
) =>
  axios.post(
    `${defaultBaseUrl}/facility/updateNeedQuestion/${needId}`,
    needPayload,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    },
  );

export const deleteInterviewQuestionsService = async (interviewQuestionPayload: {
  questionId: string;
}) =>
  axios.delete(
    `${defaultBaseUrl}/conference/deleteFacilityQuestion/${interviewQuestionPayload?.questionId}`,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    },
  );

export const facilityQuestionsService = async () =>
  axios.get(`${defaultBaseUrl}/facility/listInterviewQuestions`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const needQuestionsService = async (needId: any) =>
  axios.get(`${defaultBaseUrl}/facility/needInterviewQuestions/${needId}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const conversationsService = async (submissionId: any) =>
  axios.get(`${defaultBaseUrl}/conference/conversationList`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const loadTextMessageService = async (conversationId: any) =>
  axios.get(`${defaultBaseUrl}/conference/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const sendTextMessageService = async (data: {
  conversationId: any;
  submissionId: any;
  messageText: string;
  messageTypeId: string;
}) =>
  axios.post(`${defaultBaseUrl}/conference/messageSend`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const nurseDataLoadService = async () =>
  axios.get(`${defaultBaseUrl}/hcp/submissions`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const nurseInterviewQuestionService = async (submissionId: any) =>
  axios.get(`${defaultBaseUrl}/hcp/interviewquestions/${submissionId}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const getProfileService = async () =>
  axios.get(`${defaultBaseUrl}/user/current`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const initVideoSessionService = async () =>
  axios.get(`${defaultBaseUrl}/conference/createSession`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const initVideoConferenceService = async (payload: {
  [x: number]: any;
  submissionId: any;
}) =>
  axios.post(`${defaultBaseUrl}/conference/begin`, payload, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const updateNeedQuestionListService = async (payload: {
  needId: any;
  videoUrl: any;
}) =>
  axios.post(
    `${defaultBaseUrl}/facility/updateNeedQuestion/${payload?.needId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    },
  );

export const updateQuestionListService = async (payload: {
  facilityId?: any;
  videoUrl?: any;
  needId?: any;
}) =>
  axios.post(
    `${defaultBaseUrl}/facility/updateQuestion/${payload?.facilityId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    },
  );

export const sendMessageService = async (data: {
  note: string;
  facilityId: any;
}) =>
  axios.post(`${defaultBaseUrl}/facility/insertFacilityNote`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const candidateSubmissionsService = async (submissionId: any) =>
  axios.get(`${defaultBaseUrl}/hcp/details/${submissionId}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const facilityUnitListService = async (data: {facilityId: any}) => {
  const {facilityId} = data;
  return axios
    .get(`${defaultBaseUrl}/facility/listUnits/${facilityId}`, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    })
    .then(response => {
      const result = response.data.map((unitData: any) => unitData);
      return result;
    });
};

export const makeOfferService = async (data: {
  startDate: any;
  submissionId: any;
  offerSubmission: boolean;
}) =>
  axios.post(`${defaultBaseUrl}/facility/submissionOffer`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const notInterestedService = async (data: {
  declineSubmission: boolean;
  submissionId: any;
}) =>
  axios.post(`${defaultBaseUrl}/facility/updateSubmissionStatus`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const saveFeedbackResponseApi = async (payload: {
  questionId: string;
  rating: 0 | 1 | -1;
  submissionId: any;
}) =>
  axios.post(`${defaultBaseUrl}/facility/feedbackResponse`, payload, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const appFeedbackService = async (data: {
  note: string;
  facilityId: any;
}) =>
  axios.post(`${defaultBaseUrl}/facility/insertAppFeedback`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const updateProfile = async (data: {
  userId: any;
  imageUrl: any;
  firstName: any;
  lastName: any;
  title: any;
  phoneNumber: any;
}) =>
  axios.put(`${defaultBaseUrl}/user/current`, data, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const uploadPhoto = async (data: {base64Image: any; fileExt: string}) =>
  axios.post(`${defaultBaseUrl}/user/current/base64Photo`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const tokenRefreshService = async () =>
  axios.get(`${defaultBaseUrl}/user/refreshToken`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
    },
  });

export const signUp = (data: IRegisterUser) =>
  axios.post(`${defaultBaseUrl}/user/newRegister`, data);

export const forgotPassword = (data: {username: string}) =>
  axios.post(`${defaultBaseUrl}/user/PasswordRequest`, data);
