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
    'disable-default-padding': 'false',
  },
  RootPortal: {
    enable: 'true'
  },
  Editor: {
    'read-only': 'false',
    placeholder: '',
    'show-img-size': 'false',
    'show-img-toolbar': 'false',
    'show-img-resize': 'false',
    focus: 'false',
    bindReady: '',
    bindFocus: '',
    bindBlur: '',
    bindInput: '',
    bindStatusChange: '',
    name: ''
  },
  PageContainer: {
    show: 'false',
    duration: '300',
    'z-index': '100',
    overlay: 'true',
    position: "'bottom'",
    round: 'false',
    'close-on-slide-down': 'false',
    'overlay-style': '',
    'custom-style': '',
    bindBeforeEnter: '',
    bindEnter: '',
    bindAfterEnter: '',
    bindBeforeLeave: '',
    bindLeave: '',
    bindAfterLeave: '',
    bindClickOverlay: ''
  },
}
