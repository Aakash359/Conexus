
import { logger } from 'react-native-logs'
import { rest } from './rest'
const log = logger.createLogger()
export type DisplayDetails = {
    title: string,
    description: string
}

export type CommunicationType = {
    typeId: string,
    type: string,
    available: boolean
}

export type Candidate = {
    display: DisplayDetails,
    submissionId: string,
    timeOff: string,
    lastName: string,
    firstName: string,
    photoUrl: string,
    startDate: string,
    communicationTypes: CommunicationType[]
}

export type Position = {
    needId: string,
    unit: string,
    discipline: string,
    specialty: string,
    shift: string
}

export type FacilitySubmission = {
    display: DisplayDetails,
    facilityName: string,
    facilityId: string,
    positions: Position[],
    candidate: Candidate[]
}

class FacilityService {
  submissions() {
    return new Promise<FacilitySubmission[]>((resolve, reject) => {
      // logger.group('api', 'facility', 'facilitySubmissions', log => {
        
        rest.get('/facility/facilitySubmissions')
          .then((res) => {
            log.info('response', res)
            resolve(res.data)
          }, reject)
      })
    // })
  }
}

export const facilityService = new FacilityService()
