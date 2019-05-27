import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
  },
  btnMini: {
    height: 30
  },

  btnText: {
    fontSize: 18,
    color: '#000',
  },
  btnTextMini: {
    fontSize: 13
  },

  loading: {
    marginRight: 5,
  },
  loadingImg: {
    width: 20,
    height: 20
  }
})
