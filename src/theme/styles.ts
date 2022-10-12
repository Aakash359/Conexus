import {StyleSheet} from 'react-native'

import variables from '../theme'

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
    },

    cnxProfileViewTitleText: {
        fontSize: 21,
        color: '#556F7B',
        fontWeight: '500'
    },
    cnxProfileViewSubtitleText: {
        fontSize: 12,
        color: '#556F7B'
    },
    cnxWhiteHeader: {
        backgroundColor: 'rgb(255,255,255)',
        paddingTop: 60,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1
    },
    cnxNoDataMessageContainer: {
        alignItems: 'center',
    },
    cnxNoDataMessageText: {
        color: variables.darkBlue
    },
    cnxNoDataIcon: {
        fontSize: 64,
        color: variables.blue
    },

})

export default styles
