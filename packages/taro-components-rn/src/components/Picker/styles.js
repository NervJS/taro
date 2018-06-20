import {
  StyleSheet,
  Dimensions,
  // PixelRatio,
} from 'react-native'

const deviceWidth = Dimensions.get('window').width

export default StyleSheet.create({
  dialogOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  dialogWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dialogContainer: {
    width: deviceWidth,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  dialogHead: {
    height: 40,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dialogCancelText: {
    color: '#888',
  },
  dialogConfirmText: {
    color: '#55b837',
  },
  dialogSlot: {
    paddingVertical: 25,
    height: 260,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
