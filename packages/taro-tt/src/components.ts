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
  },
  Textarea: {
    'disable-default-padding': 'false',
    'confirm-type': singleQuote('return'),
    'confirm-hold': 'false',
    'show-confirm-bar': 'true',
    'adjust-position': 'true',
    'hold-keyboard': 'false'
  },
  Canvas: {
    type: ''
  },
  Map: {
    polygons: '[]',
    rotate: '0',
    skew: '0',
    'max-scale': '19',
    'min-scale': '3',
    'enable-3D': 'false',
    'show-compass': 'false',
    'show-scale': 'false',
    'enable-overlooking': 'false',
    'enable-zoom': 'true',
    'enable-scroll': 'true',
    'enable-rotate': 'false',
    'enable-satellite': 'false',
    'enable-traffic': 'false',
    'enable-poi': 'true',
    'enable-building': 'true',
    bindLabelTap: '',
    bindRegionChange: '',
    bindAnchorPointTap: ''
  },
  // ======== 额外组件 ========
  RtcRoom: {
    'user-id': '',
    mode: 'camera',
    'device-position': 'front',
    bindError: ''
  }
}
