import { singleQuote } from '@tarojs/shared'
// singleQuote 给字符串增加一个单引号
export const components = {
  // ======== 调整属性 ========
  Icon: {
    size: '23'
  },
  Button: {
    bindgetphonenumber: '',
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
  },
  Textarea: {
    'disable-default-padding': 'false'
  }
}
