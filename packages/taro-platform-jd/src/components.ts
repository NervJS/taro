import { singleQuote } from '@tarojs/shared'

const _true = 'true'
const _false = 'false'
const _empty = ''

export const components = {
  // ======== 调整属性 ========
  Swiper: {
    'easing-function': singleQuote('default')
  },
  Canvas: {
    type: _empty
  },
  Button: {
    bindGetPhoneNumber: _empty
  },
  Map: {
    bindRegionChange: _empty
  },
  WebView: {
    height: _empty
  },
  Input: {
    'adjust-position': _true,
  },
  Textarea: {
    'show-confirm-bar': _true,
    'adjust-position': _true,
    'disable-default-padding': _false,
  },
  RootPortal: {
    enable: _true
  },
  Editor: {
    'read-only': _false,
    placeholder: _empty,
    'show-img-size': _false,
    'show-img-toolbar': _false,
    'show-img-resize': _false,
    focus: _false,
    bindReady: _empty,
    bindFocus: _empty,
    bindBlur: _empty,
    bindInput: _empty,
    bindStatusChange: _empty,
    name: _empty
  },
  PageContainer: {
    show: _false,
    duration: '300',
    'z-index': '100',
    overlay: _true,
    position: "'bottom'",
    round: _false,
    'close-on-slide-down': _false,
    'overlay-style': _empty,
    'custom-style': _empty,
    bindBeforeEnter: _empty,
    bindEnter: _empty,
    bindAfterEnter: _empty,
    bindBeforeLeave: _empty,
    bindLeave: _empty,
    bindAfterLeave: _empty,
    bindClickOverlay: _empty
  },
  PickerView: {
    'immediate-change': _false,
  },
  MatchMedia: {
    'min-width': _empty,
    'max-width': _empty,
    width: _empty,
    'min-height': _empty,
    'max-height': _empty,
    height: _empty,
    orientation: _empty
  },
  RichText: {
    space: _empty,
    'user-select': _false
  },
  ScrollView: {
    'scroll-x': _false,
    'scroll-y': _false,
    'upper-threshold': '50',
    'lower-threshold': '50',
    'scroll-top': _empty,
    'scroll-left': _empty,
    'scroll-into-view': _empty,
    'scroll-with-animation': _false,
    'enable-back-to-top': _false,
    bindscrolltoupper: _empty,
    bindscrolltolower: _empty,
    bindscroll: _empty,
    'enable-flex': _false,
    'enable-passive': _false,
    'refresher-enabled': _false,
    'refresher-threshold': '45',
    'refresher-default-style': singleQuote('black'),
    'refresher-background': singleQuote('#FFF'),
    'refresher-triggered': _false,
    bindrefresherpulling: _empty,
    bindrefresherrefresh: _empty,
    bindrefresherrestore: _empty,
    bindrefresherabort: _empty
  },
}
