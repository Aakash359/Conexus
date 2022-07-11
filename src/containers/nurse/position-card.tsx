
import React  from 'react'
import { Text } from 'native-base'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react'
import { AppFonts } from '../../theme'

export type CardInfoLineProps = {
    title?: string,
    description?: string,
    info?: string
}

const cardInfoLineStyles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        paddingHorizontal: 4,
        paddingVertical: 1
    },
    title: {
        ...AppFonts.bodyTextNormal
    },
    description: {
        ...AppFonts.bodyTextXtraSmall,
        flex: 1,
    },
    info: {
        ...AppFonts.bodyTextXtraSmall,
        flex: 1,
        textAlign: 'right'
    }
});

export const CardInfoLine = observer((props: CardInfoLineProps) => {
    const { title, description, info } = props

    return (
        <View style={StyleSheet.flatten([cardInfoLineStyles.container])}>
            {title ? <Text style={cardInfoLineStyles.title}>{title}</Text> : null}
            <View style={{ flexDirection: 'row' }}>
                {description ? <Text style={cardInfoLineStyles.description}>{description}</Text> : null}
                {info ? <Text style={cardInfoLineStyles.info}>{info}</Text> : null}
            </View>
        </View>
    )
})


export type CardHeaderProps = {
    title?: string,
    description: string
}
const cardHeaderStyles = StyleSheet.create({
    header: {
        margin: 10,
        flexDirection: 'row'
    },
    avatar: {
        height: 48
    },
    titleContainer: {
        //marginLeft: 8
    },
    title: {
        ...AppFonts.bodyTextLargeTouchable
    },
    description: {
        ...AppFonts.bodyTextNormal
    }
});

export const CardHeader = observer((props: CardHeaderProps) => {
    const { title, description } = props

    return (
        <View style={cardHeaderStyles.header}>
            <View style={cardHeaderStyles.titleContainer}>
                {title ? <Text style={cardHeaderStyles.title}>{title}</Text> : null}
                {description ? <Text style={cardHeaderStyles.description}>{description}</Text> : null}
            </View>
        </View>
    )
})


