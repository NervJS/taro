import { StyleSheet, Platform } from 'react-native'

interface Styles {
  [propName: string]: any
}

export function create(styles: Styles): any {
  const platformStyles: any = {}
  Object.keys(styles).forEach((name) => {
    const copyStyles = { ...styles[name] }
    const ios = copyStyles.ios
    const android = copyStyles.android
    /* eslint-disable no-param-reassign */
    delete styles[name].ios
    delete styles[name].android
    /* eslint-enable no-param-reassign */
    let { ...style } = { ...styles[name] }
    if (ios && Platform.OS === 'ios') {
      style = { ...style, ...ios }
    }
    if (android && Platform.OS === 'android') {
      style = { ...style, ...android }
    }
    platformStyles[name] = style
  })
  return StyleSheet.create(platformStyles)
}

export default { create }
