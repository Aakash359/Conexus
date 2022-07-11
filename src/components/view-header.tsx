
import React from 'react'
import { Text } from 'native-base'
import { ViewProperties, StyleSheet, StyleProp, View, TextStyle, Platform } from 'react-native'

import { ActionButton } from '../components/action-button';
import { AppFonts, AppColors } from '../theme';

export interface ViewHeaderProps extends ViewProperties {
    title: string,
    description?: string,
    actionText?: string,
    onActionPress?: () => any,
    actionStyle?: any,
    actionTextStyle?: any,
    titleStyle?: StyleProp<TextStyle>,
    first?: boolean,
    descriptionStyle?: StyleProp<TextStyle>
}

export interface ViewHeaderState {

}

export class ViewHeader extends React.Component<ViewHeaderProps, ViewHeaderState>  {
    constructor(props: ViewHeaderProps, state: ViewHeaderState) {
        super(props, state);
    }

    componentWillMount() {

    }

    render() {
        const { title, description, actionText, onActionPress, actionStyle, actionTextStyle, titleStyle, descriptionStyle, style, first } = this.props;
        const buttonStyle = StyleSheet.flatten([styles.actionButton, actionStyle])

        return (
            <View style={[styles.container, style]}>
                <View style={styles.left}>
                    <Text style={StyleSheet.flatten([AppFonts.bodyTextLarge, titleStyle])}>{title}</Text>
                    {!!description && <Text style={StyleSheet.flatten([AppFonts.description, descriptionStyle])}>{description}</Text>}
                </View>
                {!!actionText &&
                    <View style={styles.right}>
                        <ActionButton style={buttonStyle} smallSecondary textStyle={actionTextStyle} title={actionText} onPress={onActionPress} />
                    </View>
                }
            </View>
        )
    }
}

const getRowShadows = () => {
    return Platform.OS === 'android' ?
        {
            elevation: 2,
        } :
        {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: .8 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
        }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: AppColors.baseGray,
        alignItems: 'stretch',
        paddingBottom: 16,
        paddingTop: 16,
        paddingLeft: 16,
        borderBottomWidth: 1,
        borderColor: AppColors.lightBlue,

        ...getRowShadows()
    },

    left: {
        flex: 1
    },

    right: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: 16
    },

    actionButton: {
        height: 33,
        width: 100
    }
})