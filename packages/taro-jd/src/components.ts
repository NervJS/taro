import { singleQuote } from '@tarojs/shared'

export const components = {
  // ======== 调整属性 ========
  Swiper: {
    'easing-function': singleQuote('default')
  },
  Canvas: {
    type: ''
  },
  Button: {
    bindGetPhoneNumber: ''
  },
  Map: {
    bindRegionChange: ''
  },
  WebView: {
    height: ''
  },
  Input: {
    'adjust-position': 'true',
  },
  Textarea: {
    'show-confirm-bar': 'true',
    'adjust-position': 'true',
  },
}
