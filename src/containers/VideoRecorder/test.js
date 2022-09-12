I am using the react-native-vision-camera package for recording the video.

I want to auto-start recording video as soon as the camera opens. and stop recording when I press the stop button and start recording another video as soon as I stop the previous video.

This is my code.

import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Camera, sortDevices } from 'react-native-vision-camera'

const App = () => {
    const camera = React.useRef(null)
    const [devices, setDevices] = useState([])
    const device = useMemo(() => devices.find((d) => d.position === 'back'), [devices])
    const [permissons, setPermissons] = useState(false)

    useEffect(() => {
        loadDevices()
        getPermissons()
    }, [])

    const getPermissons = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        const microphonePermission = await Camera.getMicrophonePermissionStatus()
        if (microphonePermission === 'authorized' && cameraPermission === 'authorized') {
            setPermissons(true)
        }
    }

    const loadDevices = async () => {
        try {
            const availableCameraDevices = await Camera.getAvailableCameraDevices()
            const sortedDevices = availableCameraDevices.sort(sortDevices)
            setDevices(sortedDevices)
        } catch (e) {
            console.error('Failed to get available devices!', e)
        }
    }

    async function StartRecodingHandler() {
        camera.current.startRecording({
            flash: 'off',
            onRecordingFinished: (video) => console.log(video, 'videodata'),
            onRecordingError: (error) => console.error(error, 'videoerror'),
        })
    }

    async function stopRecodingHandler() {
        await camera.current.stopRecording()
    }

    if (device == null) {
        return null
    }

    return (
        <View>
            <View style={{ height: 600 }}>
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    video={true}
                    audio={true}
                    setIsPressingButton={true}
                />
            </View>
            <View>
                <TouchableOpacity onPress={() => { stopRecodingHandler() }}>
                    <Text style={{ fontSize: 35 }}>STOP Recoding</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default App