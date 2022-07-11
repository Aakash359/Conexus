import {Dimensions, StatusBar, Platform} from 'react-native';

const {height, width} = Dimensions.get('window');

export const windowDimensions = {
    width,
    height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight
}
