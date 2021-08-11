import { singleQuote } from '@tarojs/shared'

export const components = {
  // ======== 调整属性 ========
  Icon: {
    size: '24'
  },
  Button: {
    bindGetPhoneNumber: '',
    'data-channel': ''
  },
  Form: {
    'report-submit-timeout': '0'
  },
  Slider: {
    color: singleQuote('#e9e9e9'),
    'selected-color': singleQuote('#1aad19')
  },
  WebView: {
    'progressbar-color': singleQuote('#51a0d8')
  },
  Video: {
    'play-btn-position': singleQuote('center'),
    'pre-roll-unit-id': '',
    'post-roll-unit-id': '',
    bindAdStart: '',
    bindAdEnded: '',
    bindAdLoad: '',
    bindAdClose: '',
    bindAdError: ''
  },
  Ad: {
    fixed: '',
    type: singleQuote('banner'),
    scale: '100'
  }
}
