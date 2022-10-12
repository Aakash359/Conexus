import axios from 'axios'
import codePush from 'react-native-code-push'


const devUrl = 'https://app.centrafi.net/conexustest/api'
const productionUrl = 'https://app.centrafi.net/conexus/api'



// const defaultEnvironment = deviceStore.isDebugEnabled ? 'dev' : 'prod' /// TEMPORARILY DISABLED 'prod'
// const defaultBaseUrl = deviceStore.isDebugEnabled ? devUrl : productionUrl /// TEMPORARILY DISABLED 'prod'

export const defaultBaseUrl = productionUrl // devUrl  //productionUrl



export let rest = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})





