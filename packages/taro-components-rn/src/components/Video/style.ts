import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  'taro-video': {
    width: '100%',
    height: 225,
    lineHeight: 0,
    overflow: 'hidden',
    position: 'relative'
  },

  'taro-video-container': {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },

  'taro-video-type-fullscreen': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999
  },

  'taro-video-cover': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 1
  },

  'taro-video-cover-play-button': {
    width: 30,
    height: 30,
  },

  'taro-video-cover-duration': {
    color: '#fff',
    fontSize: 16,
    marginTop: 10
  },

})
