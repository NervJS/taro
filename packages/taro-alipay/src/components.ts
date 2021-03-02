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
    'ground-overlays': '',
    'tile-overlay': '',
    'custom-map-style': '',
    setting: '{}',
    bindRegionChange: '',
    bindPanelTap: ''
  },
  Button: {
    scope: '',
    'public-id': '',
    bindGetAuthorize: '',
    bindError: ''
  },
  Checkbox: {
    bindChange: ''
  },
  Input: {
    'random-number': 'false',
    controlled: 'false',
    enableNative: 'false'
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
  Canvas: {
    width: singleQuote('300px'),
    height: singleQuote('225px')
  },
  Video: {
    'poster-size': singleQuote('contain'),
    'mobilenet-hint-type': '1',
    enableNative: 'false',
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
    repeatCount: '0',
    autoReverse: 'false',
    assetsPath: '',
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
  }
}
