import { logger } from 'react-native-logs'
import { Alert } from 'react-native';

export type LogFn = (log: (...args: Array<any>) => void) => void

export type ConexusApiErrorAlertOptions = {
    defaultTitle: string,
    defaultDescription: string,
    loggerName: string,
    loggerTitle: string,
    error: any
}

export const showApiErrorAlert = (options: ConexusApiErrorAlertOptions) => {
    // logger.group(options.loggerName, options.loggerTitle, (log:LogFn) => {
        const error = options.error;
        let { defaultTitle, defaultDescription } = options;
        defaultTitle = defaultTitle  || 'Error';
        defaultDescription = defaultDescription || '';
        
        if (error && error.response && error.response.data) {
            const { title, description } = error.response.data;
            Alert.alert(title || defaultTitle, description || defaultDescription);
        } else {
            Alert.alert(defaultTitle, defaultDescription);
        }
    // });
}