import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 12,
    height: 12,
    borderColor: '#f3f3f3',
    borderWidth: 1,
    borderRadius: 2
  },
  wrapperChecked: {
    borderColor: '#2BA245',
    backgroundColor: '#2BA245'
  },
  wrapperIcon: {
    opacity: 0
  },
  wrapperCheckedIcon: {
    opacity: 1
  }
})
