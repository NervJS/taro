import { singleQuote } from '@tarojs/shared'

const _true = '!0'
const _false = '!1'
const _empty = ''

export const components = {
  // ======== 调整属性 ========
  Icon: {
    size: '24'
  },
  Input: {
    'adjust-position': _true,
    'hold-keyboard': _false,
    'clue-type': '0',
    bindKeyboardHeightChange: _empty,
  },
  Button: {
    bindGetPhoneNumber: _empty,
    'data-channel': _empty,
    'data-aweme-id': _empty,
    'group-id': _empty,
    'data-is-half-page': _empty,
    bindOpenAwemeUserProfile: _empty,
    bindJoinGroup: _empty,
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
    fixed: _empty,
    type: singleQuote('banner'),
    scale: '100'
  },
  Textarea: {
    'disable-default-padding': _false,
    'confirm-type': singleQuote('return'),
    'confirm-hold': _false,
    'show-confirm-bar': _true,
    'adjust-position': _true,
    'hold-keyboard': _false
  },
  ScrollView: {
    enhanced: _false,
    bounces: _true,
    'refresher-enabled': _false,
    'refresher-threshold': '55',
    'refresher-default-style': "'black'",
    'refresher-background': "'#FFF'",
    'refresher-triggered': _false,
    bindRefresherPulling: _empty,
    bindRefresherRefresh: _empty,
    bindRefresherRestore: _empty,
    bindRefresherAbort: _empty,
  },
  Canvas: {
    type: _empty
  },
  Map: {
    polygons: '[]',
    rotate: '0',
    skew: '0',
    'max-scale': '19',
    'min-scale': '3',
    'enable-3D': _false,
    'show-compass': _false,
    'show-scale': _false,
    'enable-overlooking': _false,
    'enable-zoom': _true,
    'enable-scroll': _true,
    'enable-rotate': _false,
    'enable-satellite': _false,
    'enable-traffic': _false,
    'enable-poi': _true,
    'enable-building': _true,
    bindLabelTap: _empty,
    bindRegionChange: _empty,
    bindAnchorPointTap: _empty
  },
  // ======== 额外组件 ========
  RtcRoom: {
    'user-id': _empty,
    mode: 'camera',
    'device-position': 'front',
    bindError: _empty
  },
  PayButton: {
    mode: '1',
    'goods-id': _empty,
    'goods-type': _empty,
    'order-status': '0',
    'order-id': _empty,
    'refund-id': _empty,
    'refund-total-amount': _empty,
    'biz-line': '1',
    'marketing-ready': _false,
    bindGetGoodsInfo: _empty,
    bindPlaceOrder: _empty,
    bindError: _empty,
    bindApplyRefund: _empty,
    bindRefund: _empty,
    bindPay: _empty
  },
  ConsumeCard: {
    'order-id': _empty,
    bindConsume: _empty,
    bindRefund: _empty,
    bindApplyRefund: _empty,
    bindError: _empty
  },
  AwemeData: {
    'aweme-id': _empty,
    type: singleQuote('avatar'),
    'disable-default': _empty,
    'default-avatar': _empty,
    'default-text': _empty,
    bindError: _empty
  },
  RateButton: {
    'order-id': _empty,
    bindInit: _empty,
    bindSuccess: _empty,
    bindError: _empty,
  },
  OpenData: {
    type: _empty,
    'default-text': _empty,
    'default-avatar': _empty,
    'use-empty-value': _false,
    bindError: _empty
  }
}
