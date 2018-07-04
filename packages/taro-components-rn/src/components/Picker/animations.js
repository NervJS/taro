/**
 * Ref:: React-native-modal
 *
 * Since react-native-animatable applies by default a margin of 100 to its sliding animation,
 * we reset them here overriding the margin to 0.
 */
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

const makeSlideTranslation = (translationType, fromValue, toValue) => {
  return {
    from: {
      [translationType]: fromValue
    },
    to: {
      [translationType]: toValue
    }
  }
}

export const slideInDown = makeSlideTranslation('translateY', -height, 0)

export const slideInUp = makeSlideTranslation('translateY', height, 0)

export const slideInLeft = makeSlideTranslation('translateX', -width, 0)

export const slideInRight = makeSlideTranslation('translateX', width, 0)

export const slideOutDown = makeSlideTranslation('translateY', 0, height)

export const slideOutUp = makeSlideTranslation('translateY', 0, -height)

export const slideOutLeft = makeSlideTranslation('translateX', 0, -width)

export const slideOutRight = makeSlideTranslation('translateX', 0, width)
