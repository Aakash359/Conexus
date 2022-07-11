import { Platform } from 'react-native'
import _ from 'lodash'
import variable from '..'

export default (variables = variable) => {
  const h1Theme = {
      color: variables.textColor,
      fontSize: variables.fontSizeH1,
      fontWeight: 'bold',
      lineHeight: variables.lineHeightH1,
      fontFamily: variables.titleFontfamily
  }

  return h1Theme
}
