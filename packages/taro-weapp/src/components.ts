import { singleQuote } from '@tarojs/shared'

export const components = {
  // ======== 调整属性 ========
  Progress: {
    'border-radius': '0',
    'font-size': '16',
    duration: '30',
    bindActiveEnd: ''
  },
  RichText: {
    space: ''
  },
  Text: {
    'user-select': 'false'
  },
  Map: {
    polygons: '[]',
    subkey: '',
    rotate: '0',
    skew: '0',
    'enable-3D': 'false',
    'show-compass': 'false',
    'show-scale': 'false',
    'enable-overlooking': 'false',
    'enable-zoom': 'true',
    'enable-scroll': 'true',
    'enable-rotate': 'false',
    'enable-satellite': 'false',
    'enable-traffic': 'false',
    setting: '[]',
    bindLabelTap: '',
    bindRegionChange: '',
    bindPoiTap: ''
  },
  Button: {
    lang: 'en',
    'session-from': '',
    'send-message-title': '',
    'send-message-path': '',
    'send-message-img': '',
    'app-parameter': '',
    'show-message-card': 'false',
    'business-id': '',
    bindGetUserInfo: '',
    bindContact: '',
    bindGetPhoneNumber: '',
    bindError: '',
    bindOpenSetting: '',
    bindLaunchApp: ''
  },
  Form: {
    'report-submit-timeout': '0'
  },
  Input: {
    'always-embed': 'false',
    'adjust-position': 'true',
    'hold-keyboard': 'false',
    bindKeyboardHeightChange: ''
  },
  Picker: {
    'header-text': ''
  },
  PickerView: {
    bindPickStart: '',
    bindPickEnd: ''
  },
  Slider: {
    color: singleQuote('#e9e9e9'),
    'selected-color': singleQuote('#1aad19')
  },
  Textarea: {
    'show-confirm-bar': 'true',
    'adjust-position': 'true',
    'hold-keyboard': 'false',
    'disable-default-padding': 'false',
    bindKeyboardHeightChange: ''
  },
  ScrollView: {
    'enable-flex': 'false',
    'scroll-anchoring': 'false',
    'refresher-enabled': 'false',
    'refresher-threshold': '45',
    'refresher-default-style': singleQuote('black'),
    'refresher-background': singleQuote('#FFF'),
    'refresher-triggered': 'false',
    enhanced: 'false',
    bounces: 'true',
    'show-scrollbar': 'true',
    'paging-enabled': 'false',
    'fast-deceleration': 'false',
    bindDragStart: '',
    bindDragging: '',
    bindDragEnd: '',
    bindRefresherPulling: '',
    bindRefresherRefresh: '',
    bindRefresherRestore: '',
    bindRefresherAbort: ''
  },
  Swiper: {
    'snap-to-edge': 'false',
    'easing-function': singleQuote('default')
  },
  SwiperItem: {
    'skip-hidden-item-layout': 'false'
  },
  Navigator: {
    target: singleQuote('self'),
    'app-id': '',
    path: '',
    'extra-data': '',
    version: singleQuote('version')
  },
  Camera: {
    mode: singleQuote('normal'),
    resolution: singleQuote('medium'),
    'frame-size': singleQuote('medium'),
    bindInitDone: '',
    bindScanCode: ''
  },
  Image: {
    webp: 'false',
    'show-menu-by-longpress': 'false'
  },
  LivePlayer: {
    mode: singleQuote('live'),
    'sound-mode': singleQuote('speaker'),
    'auto-pause-if-navigate': 'true',
    'auto-pause-if-open-native': 'true',
    'picture-in-picture-mode': '[]',
    bindstatechange: '',
    bindfullscreenchange: '',
    bindnetstatus: '',
    bindAudioVolumeNotify: '',
    bindEnterPictureInPicture: '',
    bindLeavePictureInPicture: ''
  },
  Video: {
    title: '',
    'play-btn-position': singleQuote('bottom'),
    'enable-play-gesture': 'false',
    'auto-pause-if-navigate': 'true',
    'auto-pause-if-open-native': 'true',
    'vslide-gesture': 'false',
    'vslide-gesture-in-fullscreen': 'true',
    'ad-unit-id': '',
    'poster-for-crawler': '',
    'show-casting-button': 'false',
    'picture-in-picture-mode': '[]',
    // picture-in-picture-show-progress 属性先注释掉的原因如下：
    // 该属性超过了 wxml 属性的长度限制，实际无法使用且导致编译报错。可等微信官方修复后再放开。
    // 参考1：https://developers.weixin.qq.com/community/develop/doc/000a429beb87f0eac07acc0fc5b400
    // 参考2: https://developers.weixin.qq.com/community/develop/doc/0006883619c48054286a4308258c00?_at=vyxqpllafi
    // 'picture-in-picture-show-progress': 'false',
    'enable-auto-rotation': 'false',
    'show-screen-lock-button': 'false',
    bindProgress: '',
    bindLoadedMetadata: '',
    bindControlsToggle: '',
    bindEnterPictureInPicture: '',
    bindLeavePictureInPicture: '',
    bindSeekComplete: '',
    bindAdLoad: '',
    bindAdError: '',
    bindAdClose: '',
    bindAdPlay: ''
  },
  Canvas: {
    type: ''
  },
  Ad: {
    'ad-type': singleQuote('banner'),
    'ad-theme': singleQuote('white')
  },
  CoverView: {
    'marker-id': '',
    slot: ''
  },
  // ======== 额外组件 ========
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
  MatchMedia: {
    'min-width': '',
    'max-width': '',
    width: '',
    'min-height': '',
    'max-height': '',
    height: '',
    orientation: ''
  },
  FunctionalPageNavigator: {
    version: singleQuote('release'),
    name: '',
    args: '',
    bindSuccess: '',
    bindFail: '',
    bindCancel: ''
  },
  LivePusher: {
    url: '',
    mode: singleQuote('RTC'),
    autopush: 'false',
    muted: 'false',
    'enable-camera': 'true',
    'auto-focus': 'true',
    orientation: singleQuote('vertical'),
    beauty: '0',
    whiteness: '0',
    aspect: singleQuote('9:16'),
    'min-bitrate': '200',
    'max-bitrate': '1000',
    'audio-quality': singleQuote('high'),
    'waiting-image': '',
    'waiting-image-hash': '',
    zoom: 'false',
    'device-position': singleQuote('front'),
    'background-mute': 'false',
    mirror: 'false',
    'remote-mirror': 'false',
    'local-mirror': 'false',
    'audio-reverb-type': '0',
    'enable-mic': 'true',
    'enable-agc': 'false',
    'enable-ans': 'false',
    'audio-volume-type': singleQuote('voicecall'),
    'video-width': '360',
    'video-height': '640',
    'beauty-style': singleQuote('smooth'),
    filter: singleQuote('standard'),
    animation: '',
    bindStateChange: '',
    bindNetStatus: '',
    bindBgmStart: '',
    bindBgmProgress: '',
    bindBgmComplete: '',
    bindAudioVolumeNotify: ''
  },
  OfficialAccount: {
    bindLoad: '',
    bindError: ''
  },
  OpenData: {
    type: '',
    'open-gid': '',
    lang: singleQuote('en'),
    'default-text': '',
    'default-avatar': '',
    bindError: ''
  },
  NavigationBar: {
    title: '',
    loading: 'false',
    'front-color': '',
    'background-color': '',
    'color-animation-duration': '0',
    'color-animation-timing-func': singleQuote('linear')
  },
  PageMeta: {
    'background-text-style': '',
    'background-color': '',
    'background-color-top': '',
    'background-color-bottom': '',
    'scroll-top': singleQuote(''),
    'scroll-duration': '300',
    'page-style': singleQuote(''),
    'root-font-size': singleQuote(''),
    bindResize: '',
    bindScroll: '',
    bindScrollDone: ''
  },
  VoipRoom: {
    openid: '',
    mode: singleQuote('camera'),
    'device-position': singleQuote('front'),
    bindError: ''
  },
  AdCustom: {
    'unit-id': '',
    'ad-intervals': '',
    bindLoad: '',
    bindError: ''
  },
  PageContainer: {
    show: 'false',
    duration: '300',
    'z-index': '100',
    overlay: 'true',
    position: singleQuote('bottom'),
    round: 'false',
    'close-on-slideDown': 'false',
    'overlay-style': '',
    'custom-style': '',
    bindBeforeEnter: '',
    bindEnter: '',
    bindAfterEnter: '',
    bindBeforeLeave: '',
    bindLeave: '',
    bindAfterLeave: '',
    bindClickOverlay: ''
  }
}
