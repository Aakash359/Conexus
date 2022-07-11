import React, { Component } from 'react'
import { Text, Container, Textarea } from 'native-base'
import { observer, inject } from 'mobx-react'
import { ViewProperties, StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ModalHeader, ConexusIconButton, Avatar, ScreenFooterButton } from '../../components'
import { UserStore } from '../../stores'
import { AppFonts, AppColors } from '../../theme';

interface AgentMessageModalProps extends ViewProperties {
    userStore: UserStore
}

interface AgentMessageModalState {
    messageText: string,
    sending: boolean
}

@inject('userStore')
@observer
export class AgentMessageModal extends Component<AgentMessageModalProps, AgentMessageModalState> {

    constructor(props, state) {
        super(props, state);

        this.state = {
            messageText: '',
            sending: false
        }
    }

    componentWillMount() {

    }

    _renderAccountManager() {
        const { userStore } = this.props;
        const manager = userStore.selectedFacility.manager;

        return (
            <View style={managerStyle.container}>
                <Avatar source={manager.acctManagerPhotoUrl} size={38} style={managerStyle.avatar} />
                <View style={managerStyle.textContainer}>
                    <Text style={managerStyle.title}>{manager.acctManagerName}</Text>
                </View>
            </View>
        )
    }

    _sendMessage() {
        const { userStore } = this.props;
        const { messageText } = this.state;

        if (!!!messageText.trim()) {
            return Promise.resolve(Alert.alert("Invalid Message", "Please type a message to send."))
        }

        return userStore.selectedFacility.sendMessage(messageText)
            .then(() => {
                this.setState({sending: false})
                Alert.alert('Success', 'Your message has been sent.')
                Actions.pop()
            },
            (error) => {
                this.setState({sending: false})
                Alert.alert('Error', 'An error occurred while sending your message. Please try again.')
                console.error(error)
            })
    }

    _renderForm() {
        const { messageText } = this.state;

        return (<View>

            <Textarea
                style={style.messageInput}
                maxLength={1000}
                rowSpan={12}
                placeholder="Type your mesage"
                autoFocus={false}
                value={messageText}
                returnKeyType="done"
                blurOnSubmit={true}
                multiline={false}
                onChangeText={(messageText) => { this.setState({ messageText }) }} />

        </View>)
    }

    render() {
        const { sending } = this.state;

        return (
            <Container>
                <ModalHeader title="New Message" right={() =>
                    <ConexusIconButton iconName="cn-x" iconSize={15} onPress={Actions.pop}></ConexusIconButton>
                } />
                <KeyboardAvoidingView style={style.innerContainer}>
                    {this._renderAccountManager()}
                    {this._renderForm()}
                </KeyboardAvoidingView>
                <ScreenFooterButton disabled={sending} title="Send" onPress={this._sendMessage.bind(this)} />
            </Container>
        )
    }
}

const managerStyle = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    avatar: {
        paddingRight: 8
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 8,
        paddingTop: 10
    },
    title: {
        ...AppFonts.bodyTextLargeTouchable
    }
})

const style = StyleSheet.create({
    innerContainer: {
        flex: 1,
        padding: 20
    },
    formLabel: {
        ...AppFonts.bodyTextMedium,
        color: AppColors.darkBlue,
        fontWeight: '600',
        paddingRight: 16
    },
    messageInput: {
        backgroundColor: AppColors.white,
        borderRadius: 6,
        borderColor: AppColors.lightBlue,
        borderWidth: 1,
        padding: 6,
        marginTop: 18
    },
})