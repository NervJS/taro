/**
 * Default styles
 * @type {StyleSheetPropType}
 */

import {
  StyleSheet
} from 'react-native'

export default StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
    flex: 1
  },

  wrapper: {
    backgroundColor: 'transparent',
  },

  slide: {
    backgroundColor: 'transparent',
  },

  pagination_x: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },

  pagination_y: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})
