import { singleQuote } from '@tarojs/shared'

const _true = 'true'
const _false = 'false'
const _empty = ''

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
    'pre-roll-unit-id': _empty,
    'post-roll-unit-id': _empty,
    'vslide-gesture': _false,
    'vslide-gesture-in-fullscreen': _true,
    'enable-play-gesture': _false,
    'show-playback-rate-btn': _false,
    'enable-play-in-background': _false,
    'signature': _empty,
    bindProgress: _empty,
    bindSeekComplete: _empty,
    bindAdLoad: _empty,
    bindAdStart: _empty,
    bindAdEnded: _empty,
    bindAdError: _empty,
    bindAdClose: _empty,
    bindLoadedMetadata: _empty,
    bindPlaybackRateChange: _empty,
    bindMuteChange: _empty,
    bindControlTap: _empty,
    bindEnterBackground: _empty,
    bindCloseBackground: _empty,
    bindLeaveBackground: _empty,
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
