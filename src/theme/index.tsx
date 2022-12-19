// @flow
// import color from './colors'

import {Platform, Dimensions, PixelRatio} from 'react-native';
import Fonts from './fonts';
import {calcLineHeight} from './fonts';
import Sizes from './sizes';
import Colors from './colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;

export {
  Fonts as AppFonts,
  Sizes as AppSizes,
  Colors as AppColors,
  calcLineHeight,
};

export default {
  appContainer: {
    backgroundColor: '#F1F3F8',
  },

  // Default
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.baseGray,
  },
  containerCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  windowSize: {
    height: Sizes.screen.height,
    width: Sizes.screen.width,
  },

  // Aligning items
  leftAligned: {
    alignItems: 'flex-start',
  },
  centerAligned: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAligned: {
    alignItems: 'flex-end',
  },

  // Text Styles
  baseText: {
    fontFamily: Fonts.base.fontFamily,
    fontSize: Fonts.base.fontSize,
    lineHeight: Fonts.base.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '400',
  },
  p: {
    fontFamily: Fonts.base.fontFamily,
    fontSize: Fonts.base.fontSize,
    lineHeight: Fonts.base.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '400',
    marginBottom: 8,
  },
  h1: {
    fontFamily: Fonts.h1.fontFamily,
    fontSize: Fonts.h1.fontSize,
    lineHeight: Fonts.h1.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h2: {
    fontFamily: Fonts.h2.fontFamily,
    fontSize: Fonts.h2.fontSize,
    lineHeight: Fonts.h2.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h3: {
    fontFamily: Fonts.h3.fontFamily,
    fontSize: Fonts.h3.fontSize,
    lineHeight: Fonts.h3.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '500',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h4: {
    fontFamily: Fonts.h4.fontFamily,
    fontSize: Fonts.h4.fontSize,
    lineHeight: Fonts.h4.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h5: {
    fontFamily: Fonts.h5.fontFamily,
    fontSize: Fonts.h5.fontSize,
    lineHeight: Fonts.h5.lineHeight,
    color: Colors.darkBlue,
    fontWeight: '800',
    margin: 0,
    marginTop: 4,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  strong: {
    fontWeight: '900',
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.darkBlue,
  },
  subtext: {
    fontFamily: Fonts.base.fontFamily,
    fontSize: Fonts.base.fontSize * 0.8,
    lineHeight: Fonts.base.lineHeight * 0.8,
    color: Colors.darkBlue,
    fontWeight: '500',
  },

  // Helper Text Styles
  textCenterAligned: {
    textAlign: 'center',
  },
  textRightAligned: {
    textAlign: 'right',
  },

  // Give me padding
  padding: {
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding,
  },
  paddingHorizontal: {
    paddingHorizontal: Sizes.padding,
  },
  paddingLeft: {
    paddingLeft: Sizes.padding,
  },
  paddingRight: {
    paddingRight: Sizes.padding,
  },
  paddingVertical: {
    paddingVertical: Sizes.padding,
  },
  paddingTop: {
    paddingTop: Sizes.padding,
  },
  paddingBottom: {
    paddingBottom: Sizes.padding,
  },
  paddingSml: {
    paddingVertical: Sizes.paddingSml,
    paddingHorizontal: Sizes.paddingSml,
  },
  paddingHorizontalSml: {
    paddingHorizontal: Sizes.paddingSml,
  },
  paddingLeftSml: {
    paddingLeft: Sizes.paddingSml,
  },
  paddingRightSml: {
    paddingRight: Sizes.paddingSml,
  },
  paddingVerticalSml: {
    paddingVertical: Sizes.paddingSml,
  },
  paddingTopSml: {
    paddingTop: Sizes.paddingSml,
  },
  paddingBottomSml: {
    paddingBottom: Sizes.paddingSml,
  },

  // General HTML-like Elements
  hr: {
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkBlue,
    height: 1,
    backgroundColor: 'transparent',
    marginTop: Sizes.padding,
    marginBottom: Sizes.padding,
  },

  // Grid
  row: {
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flex6: {
    flex: 6,
  },

  // Navbar
  navbar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
  },
  navbarTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: Fonts.base.fontFamily,
    fontSize: Fonts.base.fontSize,
  },
  navbarButton: {
    tintColor: '#ffffff',
  },

  // TabBar
  tabbar: {
    backgroundColor: Colors.baseGray,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: 1,
  },

  platformStyle,
  platform,
  // AndroidRipple
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

  // Badge
  badgeBg: '#ED1727',
  badgeColor: '#fff',
  // New Variable
  badgePadding: platform === 'ios' ? 3 : 0,

  // Button
  btnFontFamily: 'Avenir-Book',
  btnDisabledBg: '#b5b5b5',
  btnDisabledClr: '#f1f1f1',

  // CheckBox
  CheckboxRadius: platform === 'ios' ? 13 : 0,
  CheckboxBorderWidth: platform === 'ios' ? 1 : 2,
  CheckboxPaddingLeft: platform === 'ios' ? 4 : 2,
  CheckboxPaddingBottom: platform === 'ios' ? 0 : 5,
  CheckboxIconSize: platform === 'ios' ? 21 : 14,
  CheckboxIconMarginTop: platform === 'ios' ? undefined : 1,
  CheckboxFontSize: platform === 'ios' ? 23 / 0.9 : 18,
  DefaultFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Segment
  segmentBackgroundColor: '#3F51B5',
  segmentActiveBackgroundColor: '#fff',
  segmentTextColor: '#fff',
  segmentActiveTextColor: '#3F51B5',
  segmentBorderColor: '#fff',
  segmentBorderColorMain: '#3F51B5',

  // New Variable
  get defaultTextColor() {
    return this.textColor;
  },

  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return this.fontSizeBase * 1.1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },

  buttonPadding: 0,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: '#fff',

  transparent: 'rgba(0,0,0,0)',
  brandPrimary: Colors.blue,
  brandInfo: '#50D2C2',
  brandSecondary: '#D667CE',
  brandSuccess: Colors.green,
  brandDanger: Colors.red,
  brandWarning: '#f0ad4e',
  brandSidebar: '#252932',
  white: Colors.white,
  black: Colors.black,
  gray: Colors.gray,
  baseGray: Colors.baseGray,
  darkBlue: Colors.darkBlue,
  blue: Colors.blue,
  lightBlue: Colors.lightBlue,
  red: Colors.red,
  green: Colors.green,
  fontFamily: 'Avenir-Book',
  fontSizeBase: 15,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  get footerDefaultBg() {
    return this.brandInfo;
  },

  // FooterTab
  tabBarTextColor: 'white',
  tabBarTextSize: platform === 'ios' ? 14 : 11,
  activeTab: platform === 'ios' ? '#007aff' : '#fff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: '#fff',
  tabActiveBgColor: platform === 'ios' ? '#1569f4' : undefined,

  // Tab
  tabDefaultBg: 'white',
  topTabBarTextColor: '#b3c7f9',
  topTabBarActiveTextColor: '#fff',
  topTabActiveBgColor: platform === 'ios' ? '#1569f4' : undefined,
  topTabBarBorderColor: '#fff',
  get topTabBarActiveBorderColor() {
    return this.brandInfo;
  },

  // Header
  toolbarBtnColor: Colors.white,
  get toolbarDefaultBg() {
    return this.brandPrimary;
  },
  toolbarHeight: platform === 'ios' ? 64 : 56,
  toolbarIconSize: platform === 'ios' ? 20 : 22,
  toolbarSearchIconSize: platform === 'ios' ? 20 : 23,
  toolbarInputColor: platform === 'ios' ? '#CECDD2' : '#fff',
  searchBarHeight: platform === 'ios' ? 30 : 40,
  toolbarInverseBg: '#222',
  toolbarTextColor: Colors.white,
  iosStatusbar: 'dark-content',
  toolbarDefaultBorder: '#2874F0',
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: platform === 'ios' ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: platform === 'ios' ? 33 : 24,

  // InputGroup
  inputFontSize: 16,
  inputBorderColor: '#D6E2E9',
  inputBackgroundColor: Colors.white,
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return Colors.gray;
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 12,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8;
  },

  // Line Height
  btnLineHeight: 24,
  lineHeightH1: 37,
  lineHeightH2: 32,
  lineHeightH3: 27,
  iconLineHeight: platform === 'ios' ? 37 : 30,
  lineHeight: platform === 'ios' ? 20 : 24,

  // List
  listBorderColor: '#c9c9c9',
  listDividerBg: Colors.gray,
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',
  listBg: '#ccc',

  // Card
  cardBorderColor: '#ccc',

  // Changed Variable
  listItemPadding: platform === 'ios' ? 10 : 10,

  listNoteColor: '#808080',
  listNoteSize: 13,

  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: platform === 'ios' ? 25 : 23,
  radioSelectedColorAndroid: '#5067FF',

  // New Variable
  radioBtnLineHeight: platform === 'ios' ? 29 : 24,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return color(this.radioColor)
      .darken(0.2)
      .hex();
  },

  // Spinner
  defaultSpinnerColor: Colors.blue,
  inverseSpinnerColor: '#1A191B',

  // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,
  tabTextColor: '#222222',

  // Text
  textColor: Colors.darkBlue,
  inputTextColor: Colors.darkBlue,
  inverseTextColor: 'rgba(255,255,255,.87)',
  noteFontSize: 14,

  // Title
  titleFontfamily: 'Avenir-Light',
  titleFontSize: 17,
  subTitleFontSize: 12,
  subtitleColor: '#FFF',

  // New Variable
  titleFontColor: Colors.white,

  // Other
  borderRadiusBase: platform === 'ios' ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

  // New Variable
  inputGroupRoundedBorderRadius: 30,
};
