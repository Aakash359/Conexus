import axios from 'axios'
// import codePush from 'react-native-code-push'
import { deviceStore } from '../stores'
import { logger } from 'react-native-logs'

const devUrl = 'https://app.centrafi.net/conexustest/api'
const productionUrl = 'https://app.centrafi.net/conexus/api'
const log = logger.createLogger()

export declare type ApiEnvironment = 'dev' | 'prod'
const defaultEnvironment = deviceStore.isDebugEnabled ? 'dev' : 'prod' /// TEMPORARILY DISABLED 'prod'
const defaultBaseUrl = deviceStore.isDebugEnabled ? devUrl : productionUrl /// TEMPORARILY DISABLED 'prod'
let currentEnvironment: ApiEnvironment = defaultEnvironment

log.info(`Setting API BaseURL to ${currentEnvironment}`)



export const setConexusApiEnvironment = (env: ApiEnvironment) => {
  // codePush.getUpdateMetadata().then((details) => {
  //   if (details.deploymentKey === 'UXrzeFYjiGySFOm2mOfuU8pm08Cfaa10473a-eea0-4543-a44c-79c6482beade' || details.deploymentKey === 'OCHtsMWbGSdmM6XRfKhCB5SYFy1saa10473a-eea0-4543-a44c-79c6482beade')
  //     env = 'dev'
  // })
  if (env === 'dev') {
    console.log('setting to dev environment')
    // rest.defaults.baseURL = devUrl
    currentEnvironment = 'dev'
  } else {
    console.log('setting to production environment')
    // rest.defaults.baseURL = productionUrl
    currentEnvironment = 'prod'
  }
}

export const getConexusApiEnvironment = () => {
  return currentEnvironment
}

export default rest
