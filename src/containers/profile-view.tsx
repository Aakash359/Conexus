import React from 'react'
import { Container } from 'native-base'
import { Text, StyleSheet, View } from 'react-native'

import { Avatar, ActionButton, ScreenFooterButton } from '../components'
import { windowDimensions } from '../common'
import Styles from '../theme/styles'
import { observer, inject } from 'mobx-react';
import { UserStore } from '../stores';
import { ScreenType } from '../common/constants'
import { Actions } from 'react-native-router-flux';

interface ProfileProps {
    avatar: any,
    userStore: UserStore
}
interface ProfileState {
}

@inject('userStore')
@observer
export class Profile extends React.Component<ProfileProps, ProfileState> {

    renderTitle() {
        if (this.props.userStore.user) {
            let { title } = this.props.userStore.user
    
            if (title) {
                return (<Text style={[Styles.cnxProfileViewSubtitleText, style.subTitleText]}>{title}</Text>)
            }
        }

        return (<View />)
    }

    render() {
        let { firstName, lastName, photoUrl } = this.props.userStore.user || { firstName: '', lastName: '', photoUrl: ''}

        return (
            <Container>
                <View style={style.avatarContainer} >
                    <Avatar source={photoUrl} size={90} />
                </View>
                <View style={style.detailsContainer}>
                    <Text style={[Styles.cnxProfileViewTitleText, style.titleText]}>{firstName} {lastName}</Text>
                    {this.renderTitle()}
                    <ActionButton smallSecondary title="Edit" onPress={Actions[ScreenType.PROFILE_EDIT]} style={style.editButton} />
                </View>
                <ScreenFooterButton title="Logout" onPress={this.props.userStore.logout} />
            </Container>
        )
    }
}

const style = StyleSheet.create({
    logoutBtn: {
        width: windowDimensions.width * .75,        
    },

    editButton: {
        marginTop: 36
    },

    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 36,
        paddingBottom: 18
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    footerContainer: {
        justifyContent: 'center',
        alignItems: 'center',

        paddingBottom: 36
    },

    titleText: {
        marginBottom: 3
    },

    subTitleText: {

    }
});