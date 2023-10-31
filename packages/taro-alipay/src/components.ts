import { singleQuote } from '@tarojs/shared'

export const components = {
  // ======== 调整属性 ========
  View: {
    'disable-scroll': 'false',
    hidden: 'false',
    bindAppear: '',
    bindDisappear: '',
    bindFirstAppear: ''
  },
  Text: {
    'number-of-lines': ''
  },
  Map: {
    skew: '0',
    rotate: '0',
    polygons: '[]',
    'include-padding': '',
    'ground-overlays': '[]',
    'tile-overlay': '',
    'custom-map-style': '',
    panels: '[]',
    setting: '{}',
    optimize: 'false',
    'show-compass': 'false',
    'show-scale': 'false',
    'enable-overlooking': 'false',
    'enable-zoom': 'true',
    'enable-scroll': 'true',
    'enable-rotate': 'false',
    'enable-traffic': 'false',
    'enable-poi': 'true',
    'enable-building': 'true',
    'enable-satellite': 'false',
    bindRegionChange: '',
    bindPanelTap: '',
    bindInitComplete: ''
  },
  Button: {
    scope: '',
    'public-id': '',
    bindGetAuthorize: '',
    bindError: '',
    bindGetUserInfo: '',
    bindGetPhoneNumber: '',
    bindFollowLifestyle: ''
  },
  Checkbox: {
    bindChange: ''
  },
  Input: {
    'always-system': 'false',
    'random-number': 'false',
    controlled: 'false',
    enableNative: 'true',
    name: ''
  },
  Slider: {
    'track-size': '4',
    'handle-size': '22',
    'handle-color': singleQuote('#ffffff')
  },
  Switch: {
    controlled: 'false'
  },
  Textarea: {
    'show-count': 'true',
    controlled: 'false',
    enableNative: 'false'
  },
  MovableView: {
    bindChangeEnd: ''
  },
  ScrollView: {
    'scroll-animation-duration': '',
    'trap-scroll': 'false'
  },
  Swiper: {
    'active-class': '',
    'changing-class': '',
    acceleration: 'false',
    'disable-programmatic-animation': 'false',
    'disable-touch': 'false',
    bindAnimationEnd: ''
  },
  Image: {
    'default-source': ''
  },
  Camera: {
    mode: singleQuote('normal'),
    'output-dimension': singleQuote('720P'),
    'frame-size': singleQuote('medium'),
    bindScanCode: '',
    bindReady: '',
  },
  Canvas: {
    type: '',
    width: singleQuote('300px'),
    height: singleQuote('225px'),
    bindReady: ''
  },
  Video: {
    'poster-size': singleQuote('contain'),
    'show-thin-progress-bar': 'false',
    'mobilenet-hint-type': '1',
    'floating-mode': singleQuote('none'),
    enableNative: 'true',
    bindLoading: '',
    bindUserAction: '',
    bindStop: '',
    bindRenderStart: ''
  },
  // ======== 额外组件 ========
  Lottie: {
    autoplay: 'false',
    path: '',
    speed: '1.0',
    'repeat-count': '0',
    'auto-reverse': 'false',
    'assets-path': '',
    placeholder: '',
    djangoId: '',
    md5: '',
    optimize: 'false',
    bindDataReady: '',
    bindDataFailed: '',
    bindAnimationStart: '',
    bindAnimationEnd: '',
    bindAnimationRepeat: '',
    bindAnimationCancel: '',
    bindDataLoadReady: ''
  },
  Lifestyle: {
    'public-id': '',
    memo: '',
    bindFollow: ''
  },
  LifeFollow: {
    sceneId: '',
    checkFollow: '',
    bindCheckFollow: '',
    bindClose: ''
  },
  ContactButton: {
    'tnt-inst-id': '',
    scene: '',
    size: '25',
    color: singleQuote('#00A3FF'),
    icon: '',
    'alipay-card-no': '',
    'ext-info': ''
  },
  ArCamera: {
    devicePosition: singleQuote('back'),
    marker: '',
    mode: singleQuote('imageTracking'),
    useCapturedImage: 'false',
    bindInit: '',
    bindStop: '',
    bindError: '',
    bindARFrame: ''
  },
  PageContainer: {
    show: 'false',
    duration: '300',
    'z-index': '100',
    overlay: 'true',
    position: singleQuote('bottom'),
    round: 'false',
    'close-on-slide-down': 'false',
    'overlay-style': '',
    'custom-style': '',
    bindBeforeEnter: '',
    bindEnter: '',
    bindEnterCancelled: '',
    bindAfterEnter: '',
    bindBeforeLeave: '',
    bindLeave: '',
    bindLeaveCancelled: '',
    bindAfterLeave: '',
    bindClickOverlay: '',
  },
  ShareElement: {
    name: '',
    transform: 'false',
    duration: '300',
    'easing-function': singleQuote('ease-out'),
  },
  RootPortal: {
    enable: 'true'
  }
}
