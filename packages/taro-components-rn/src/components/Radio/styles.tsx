import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderColor: '#f3f3f3',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  wrapperChecked: {
    // borderColor: '#09BB07',
  },
  wrapperIcon: {
    opacity: 0
  },
  wrapperCheckedIcon: {
    opacity: 1
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
