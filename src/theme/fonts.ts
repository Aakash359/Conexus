import { Dimensions, Platform, PixelRatio, StyleSheet, TextStyle } from 'react-native'
import { colors } from './colors'
import { AppColors } from './index';

// https://stackoverflow.com/questions/33628677/react-native-responsive-font-size
const {
  width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window')

// based on iphone 5s's scale
// const scale = SCREEN_WIDTH / 320

// ### REMOVED FOR TIME BEING TO USE PIXEL RATIO WHICH I BELIEVE IS WHAT SCALE WAS DOING FOR SINGLE DENSITY (iPHONE 5)
// export function normalizePixels(pixelSize) {
//     if (Platform.OS === 'ios') {
//         return Math.round(PixelRatio.roundToNearestPixel(pixelSize))
//     } else {
//         return Math.round(PixelRatio.roundToNearestPixel(pixelSize)) - 2
//     }
// }

const pixelRatio = PixelRatio.get()
const normalize = (size) => {
    // Using this for the demo
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(size))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(size)) - 3
    }
    //return size;
    // if (pixelRatio === 1) {
    //     return size
    // }

    // if (pixelRatio === 2) {
    //     return size * 1.33
    // }

    // if (pixelRatio === 3) {
    //     return size
    // }

    // return size * pixelRatio
}

type fontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export const calcLineHeight = (fontSize) => {
    const multiplier = (fontSize > 20) ? 0.1 : 0.25
    return parseInt(fontSize + (fontSize * multiplier), 10)
}

const fontWeight: { [key: string]: fontWeight } = {
    thin: '100',
    ultraLight: '200',
    light: '300',
    regular: '400',
    roman: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    heavy: '800',
    black: '900'
}

export const family = {
    ...Platform.select({
        ios: {
            fontFamily: 'Avenir'
        },
        android: {
            fontFamily: 'Nunito'
        }
    })
}

const fontColors = {
    touchable: {
        color: colors.blue
    },
    touchableInverse: {
        color: colors.white,
    },
    body: {
        color: colors.darkBlue
    },
    bodyTitle: {
        color: colors.darkBlue
    },
    bodySubTitle: {
        color: colors.darkBlue
    }
}

export const componentStyles = {

    calcLineHeight,
    
    
    buttonTextSmall: {
        ...family,
        fontSize: normalize(13),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(13)
    },

    buttonText: {
        ...family,
        fontSize: normalize(15),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(15),
    },

    tabLabelText: {
        ...family,
        fontSize: normalize(13),
        fontWeight: fontWeight.semiBold,
        lineHeight: calcLineHeight(13),
    },

    drawerItemButtonText: {
        ...family,
        ...fontColors.touchable,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },

    drawerItemButtonTextInverse: {
        ...family,
        ...fontColors.touchableInverse,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },

    title: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(16),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(16)
    },

    headerTitle: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },

    description: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(13),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(13)
    },

    listItemTitle: {
        ...family,
        fontSize: normalize(18),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(18)
    },

    listItemTitleTouchable: {
        // Placeholder - contents filled in later
    },

    listItemDescription: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(13),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(13)
    },

    bodyTextXtraSmallSize: normalize(12),

    bodyTextXtraSmall: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(12),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(12)
    },

    bodyTextXtraXtraSmall: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(10),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(10)
    },

    bodyTextXtraSmallTouchable: {
        // Placeholder - contents filled in later
    },

    bodyTextNormalSize: normalize(14),
    
    bodyTextNormal: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(14),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(14)
    },

    bodyTextNormalTouchable: {
        // Placeholder - contents filled in later
    },

    bodyTextMediumSize: normalize(16),
    bodyTextMedium: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(16),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(16)
    },

    bodyTextMediumTouchable: {
        // Placeholder - contents filled in later
    },

    bodyTextLargeSize: normalize(24),
    bodyTextLarge: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(18),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(18)
    },

    bodyTextLargeTouchable: {
        // Placeholder - contents filled in later
    },

    bodyTextXtraLargeSize: normalize(21),
    bodyTextXtraLarge: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },

    bodyTextXtraLargeTouchable: {
        // Placeholder - contents filled in later
    },

    bodyTextXtraXtraLargeSize: normalize(24),
    bodyTextXtraXtraLarge: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(24),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(24)
    },

    navbarTitle: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(18),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(18)
    },

    subHeaderTitle: {
        ...family,
        ...fontColors.body,
        fontSize: normalize(18.5),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(18.5)
    },

    drawerItemTitle: {
        ...family,
        ...fontColors.touchableInverse,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },
    drawerItemTitleInverse: {
        ...family,
        ...fontColors.touchableInverse,
        fontSize: normalize(21),
        fontWeight: fontWeight.roman,
        lineHeight: calcLineHeight(21)
    },

    lightboxTitle: {
        // Placeholder - contents filled in later
    },

    candidateComparison: {
        candidateTitle: {
            ...family,
            ...fontColors.touchable,
            fontSize: normalize(16),
            fontWeight: fontWeight.heavy,
            lineHeight: calcLineHeight(16)
        },
        textCellTitle: {
            ...family,
            ...fontColors.body,
            fontSize: normalize(24),
            fontWeight: fontWeight.semiBold,
            lineHeight: calcLineHeight(24)
        },
        textCellTitleTouchable: {
            // Placeholder - contents filled in later
        },
        textCellDescription: {
            ...family,
            ...fontColors.body,
            fontSize: normalize(15),
            fontWeight: fontWeight.roman,
            lineHeight: calcLineHeight(15)
        }
    }
}

componentStyles.listItemTitleTouchable = {
    ...componentStyles.listItemTitle,
    ...fontColors.touchable
}

componentStyles.lightboxTitle = {
    ...family,
    ...componentStyles.bodyTextLarge
}

componentStyles.bodyTextXtraSmallTouchable = {
    ...componentStyles.bodyTextXtraSmall,
    ...fontColors.touchable
}

componentStyles.bodyTextNormalTouchable = {
    ...componentStyles.bodyTextNormal,
    ...fontColors.touchable
}

componentStyles.bodyTextMediumTouchable = {
    ...componentStyles.bodyTextMedium,
    ...fontColors.touchable
}

componentStyles.bodyTextLargeTouchable = {
    ...componentStyles.bodyTextLarge,
    ...fontColors.touchable
}

componentStyles.bodyTextXtraLargeTouchable = {
    ...componentStyles.bodyTextXtraLarge,
    ...fontColors.touchable
}

componentStyles.candidateComparison.textCellTitleTouchable = {
    ...componentStyles.candidateComparison.textCellTitle,
    ...fontColors.touchable
}

export const fonts = {
    ...componentStyles,
    base: { ...componentStyles.bodyTextNormal },
    h1: { ...componentStyles.bodyTextXtraLarge },
    h2: { ...componentStyles.bodyTextLarge },
    h3: { ...componentStyles.bodyTextMedium },
    h4: { ...componentStyles.bodyTextNormal },
    h5: { ...componentStyles.bodyTextNormal },
    family
}

export default fonts