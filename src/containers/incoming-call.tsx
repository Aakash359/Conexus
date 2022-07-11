import React from 'react'
import { Icon, H1, H3 } from 'native-base'
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native'
import Sound from 'react-native-sound'
import { Avatar, Circle } from '../components'
import { windowDimensions } from '../common'
import variables from '../theme'
import { logger } from 'react-native-logs'

import { inject } from 'mobx-react'
import { observer } from 'mobx-react'
import { VideoStore } from '../stores/videoStore'
import { deviceStore } from '../stores/deviceStore'
import { Actions } from 'react-native-router-flux'
import timer from 'react-native-timer'

interface ICallProps {
    isIncoming?: boolean
    title?: string,
    subTitle?: string,
    photo?: string,
    videoStore: VideoStore
}
const log = logger.createLogger()
@inject('videoStore')
@observer
export class IncomingCall extends React.Component<ICallProps, {}> {
    ringer: Sound
    timeout: any
    componentWillMount() {
        // deviceStore.disableScreenTimeout(true)
        this.ringer = new Sound(`ringtone${Platform.OS === 'ios' ? '.caf' : '.mp3'}`, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                log.info('failed to load the sound', error)
                return
            }
            this.ringer.play()
        })
    }

    constructor(props, context) {
        super(props, context)

    }
    componentDidMount() {
        timer.setTimeout(this, 'End Call After 30 sec', () => {
            this.close()
            this.ringer.stop();
        }, 30000)
    }
    componentWillUnmount() {
        this.ringer.stop()
    }
    close = () => {
        timer.clearTimeout(this)
        this.ringer.stop()
        Actions.pop()
    }
    answer = () => {
        this.close()
    }
    render() {
        let photo = this.props.photo;
        let title = this.props.title;
        let subTitle = this.props.subTitle;
        return (
            <View style={styles.screen}>
                <View style={styles.callHeader}>
                    <View style={styles.avatarContainer}>
                        <Avatar source={photo} size={94} />
                    </View>
                    <H1 style={styles.h1}>{title}</H1>
                    <H3 style={styles.h3}>{subTitle}</H3>
                </View>
                <View style={styles.incomingCallButtons}>
                    <TouchableOpacity onPress={this.close} style={styles.ignoreBtn}>
                        <Circle size={70} color={variables.red}>
                            <Icon name="ios-call" color="white" style={StyleSheet.flatten(styles.ignoreIcon)} />
                        </Circle>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.answer} style={styles.answerBtn}>
                        <Circle size={70} color={variables.green}>
                            <Icon name="ios-call" color="white" style={StyleSheet.flatten(styles.answerIcon)} />
                        </Circle>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#4C4C4C'
    },
    background: {
        flex: 1,
        // resizeMode: 'contain',
        // backgroundColor: variables.green
    },
    avatarContainer: {
        alignSelf: 'center',
        marginTop: 100,
        width: 102,
        height: 102,
        borderRadius: 51,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,.87)'
    },
    callHeader: {
        flex: 2,
        width: windowDimensions.width,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    h1: {
        marginTop: 20,
        color: variables.white,
        fontWeight: '500',
        fontSize: 24,
        padding: 0
    },
    h3: {
        color: variables.white,
        fontWeight: '400',
        fontSize: 18,
        padding: 0
    },
    closeBtn: {

    },
    ignoreIcon: {
        color: variables.white,
        fontSize: 40,
        transform: [{ rotate: '133deg' }],
        marginLeft: -3
    },
    answerBtn: {

    },
    answerIcon: {
        color: variables.white,
        fontSize: 40,
        marginTop: 3
    },
    ignoreBtn: {

    },
    incomingCallButtons: {
        flex: 1,
        width: windowDimensions.width,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: variables.red
    }
})

export default IncomingCall