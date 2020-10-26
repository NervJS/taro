import { StyleSheet } from 'react-native'

const AUDIO_HEIGHT = 67
const PROGRESS_BAR_HEIGHT = 2

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    borderColor: '#e0e0e0',
    height: AUDIO_HEIGHT,
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: 'white'
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#c9c9c9'
  },
  progressBarTint: {
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#09BB07'
  },
  poster: {
    width: AUDIO_HEIGHT - 2 - PROGRESS_BAR_HEIGHT,
    height: AUDIO_HEIGHT - 2 - PROGRESS_BAR_HEIGHT,
    backgroundColor: '#e6e6e6'
  },
  posterImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    textAlign: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 14,
    height: AUDIO_HEIGHT - 2 - PROGRESS_BAR_HEIGHT,
  },
  detail: {
    justifyContent: 'center'
  },
  name: {
  },
  nameText: {
    fontSize: 13,
    color: '#353535'
  },
  author: {
    marginTop: 9
  },
  authorText: {
    fontSize: 12,
    color: '#888'
  },
  time: {
  },
  timeText: {
    fontSize: 10,
    color: '#888'
  }
})
