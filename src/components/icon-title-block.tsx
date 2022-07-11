import React from 'react'
import { StyleSheet, ViewProperties } from 'react-native'
import { Text, View } from 'native-base'
import {ConexusIcon} from '../components'
import { AppColors } from '../theme'

interface IconTitleBlockProps extends ViewProperties {
    text: string,
    iconName?: string,
    textColor?: string,
    iconColor?: string
}

interface IconTitleBlockState {

}

export class IconTitleBlock extends React.Component<IconTitleBlockProps, IconTitleBlockState> {

    get textColor() : string {
        return this.props.textColor || AppColors.darkBlue
    }

    get iconColor() : string {
        return this.props.iconColor || AppColors.blue
    }

    constructor(props, state) {
        super(props, state)
        this.state = {}
    }

    get iconName() : string {
        return this.props.iconName
    }

    render() {
        const { text } = this.props;

        return (
            <View style={[style.container, this.props.style]}>
                {!!this.iconName && <ConexusIcon size={64} name={this.iconName} style={[style.icon, {color: this.iconColor}]}  /> }
                <Text style={[style.text, {color: this.textColor}]}>{text}</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center'
    },
    text: {
        color: AppColors.darkBlue
    },
    icon: {
        color: AppColors.blue,
        marginBottom: 18
    },
})