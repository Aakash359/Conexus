
import React, { Component } from 'react'
import { Text } from 'native-base'
import { observer } from 'mobx-react'
import { ViewProperties, ViewStyle, StyleSheet, View } from 'react-native'
import variables from '../theme'
import { AppFonts } from '../theme';

interface ModalHeaderProps extends ViewProperties {
    title: string,
    right?: () => any,
    left?: () => any,
    style?: ViewStyle
}

@observer
export class ModalHeader extends Component<ModalHeaderProps> {
    constructor(props) {
        super(props, {});
    }

    componentWillMount() {

    }

    _renderLeft() {
        return (
            <View style={styles.leftContainer}>
                {!!this.props.left && this.props.left()}
            </View>
        );
    }

    _renderRight() {
        return (
            <View style={styles.rightContainer}>
                {!!this.props.right && this.props.right()}
            </View>
        );
    }

    render() {
        return (
            <View style={StyleSheet.flatten([styles.header, this.props.style ])}>
                {!!this.props.left && this._renderLeft()}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                {!!this.props.right && this._renderRight()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        alignSelf: 'flex-start',
        backgroundColor: variables.white,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 26,
        paddingBottom: 4,
        borderBottomWidth: .5,
        borderBottomColor: variables.lightBlue,
        position: 'relative',
        height: 76
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

    title: {
        ...AppFonts.navbarTitle,
        paddingBottom: 2,
    },

    leftContainer: { 
        position: 'absolute',
        left: 4,
        bottom: 10
    },
    
    rightContainer: { 
        position: 'absolute',
        right: 4,
        bottom: 14
    }
});