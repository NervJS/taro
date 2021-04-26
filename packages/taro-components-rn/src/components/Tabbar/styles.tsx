import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native'

const { width, height }: { width: number; height: number } = Dimensions.get('window')

// @todo what about header height.
const contHeight = Platform.select({
  ios: height,
  android: height - (StatusBar.currentHeight || 0)
})

export default StyleSheet.create({
  container: {
    width,
    height: contHeight,
  },
  panel: {
    flexGrow: 1,
  },
  bar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#F7F7FA'
  },
  barItem: {
    flex: 1,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  barItemIcon: {
    width: 27,
    height: 27
  },
  barItemLabel: {
    fontSize: 10,
    color: '#999'
  }
})
