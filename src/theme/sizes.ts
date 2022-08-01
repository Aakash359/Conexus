import { Dimensions, Platform,   NativeModules } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;


// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const { PlatformConstants = {} } = NativeModules;

const isIPhoneX = (() => {
  if (Platform.OS === 'web') return false;

  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  );
})();

const isIPad = (() => {
  if (Platform.OS !== 'ios' || isIPhoneX) return false;

  // if portrait and width is smaller than iPad width
  if (D_HEIGHT > D_WIDTH && D_WIDTH < PAD_WIDTH) {
    return false;
  }

  // if landscape and height is smaller that iPad height
  if (D_WIDTH > D_HEIGHT && D_HEIGHT < PAD_WIDTH) {
    return false;
  }

  return true;
})();


export default {
  // Window Dimensions
  screen: {
    height: screenHeight,
    width: screenWidth,
    widthHalf: screenWidth * 0.5,
    widthThird: screenWidth * 0.333,
    widthTwoThirds: screenWidth * 0.666,
    widthQuarter: screenWidth * 0.25,
    widthThreeQuarters: screenWidth * 0.75,
  },
  conexusFooterButtonHeight: 80,
  navbarHeight: (Platform.OS === 'ios') ? 64 : 54,
  statusBarHeight: (Platform.OS === 'ios') ? 16 : 0,
  padding: 20,
  paddingSml: 10,
  isIPhoneX,
  isIPad,
  iPhoneXFooterSize: 44
};