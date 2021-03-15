import { singleQuote } from '@tarojs/shared'

export const components = {
  // ======== 调整属性 ========
  Progress: {
    'border-radius': '0',
    'font-size': '16',
    duration: '30'
  },
  RichText: {
    selectable: 'false',
    name: '',
    attrs: '',
    children: '[]',
    text: '',
    'image-menu-prevent': 'false',
    preview: ''
  },
  Map: {
    polygons: '[]',
    'enable-3D': 'false',
    'show-compass': 'false',
    'enable-overlooking': 'false',
    'enable-zoom': 'true',
    'enable-scroll': 'true',
    'enable-rotate': 'false',
    bindRegionChange: '',
    bindPoiTap: ''
  },
  Button: {
    bindGetPhoneNumber: '',
    bindGetUserInfo: '',
    bindOpenSetting: '',
    bindContact: '',
    bindChooseAddress: '',
    bindChooseInvoiceTitle: ''
  },
  Form: {
    'report-type': 'default',
    'template-id': '',
    'subscribe-id': ''
  },
  Input: {
    'adjust-position': 'true'
  },
  Textarea: {
    'confirm-type': singleQuote('default'),
    'confirm-hold': 'false',
    'show-confirm-bar': 'true',
    'adjust-position': 'true'
  },
  Navigator: {
    target: singleQuote('self'),
    'app-id': '',
    path: '',
    'extra-data': '',
    version: singleQuote('version')
  },
  Image: {
    webp: 'false',
    'image-menu-prevent': 'false',
    preview: '',
    'original-src': ''
  },
  Video: {
    title: '',
    'show-no-wifi-tip': 'true',
    'vslide-gesture': 'false',
    'vslide-gesture-in-fullscreen': 'true',
    'enable-play-gesture': 'false',
    'show-rate-btn': 'false',
    'show-vslide-btn-in-fullscreen': 'true',
    'silent-play': 'false',
    bindLoadedMetadata: ''
  },
  Ad: {
    appid: '',
    apid: '',
    type: singleQuote('feed'),
    updatetime: '',
    bindStatus: ''
  },
  // ======== 额外组件 ========
  Tabs: {
    'tabs-background-color': singleQuote('#fff'),
    'tabs-active-text-color': singleQuote('#000'),
    'tabs-inactive-text-color': singleQuote('#666'),
    'tabs-underline-color': singleQuote('#333'),
    'active-name': '',
    'url-query-name': '',
    'max-tab-item-amount': '5',
    bindTabChange: ''
  },
  TabItem: {
    label: '',
    name: '',
    'badge-type': '',
    'badge-text': ''
  },
  AnimationVideo: {
    'resource-width': '800',
    'resource-height': '400',
    'canvas-style': singleQuote('width:400px;height:400px'),
    path: '',
    loop: 'fasle',
    autoplay: 'fasle',
    bindStarted: '',
    bindEnded: ''
  },
  AnimationView: {
    path: '',
    loop: 'false',
    autoplay: 'true',
    action: singleQuote('play'),
    hidden: 'true',
    bindEnded: ''
  },
  ArCamera: {
    key: '',
    type: '',
    flash: singleQuote('off'),
    bindError: '',
    bindLoad: '',
    bindMessage: '',
    bindScanCode: ''
  },
  RtcRoom: {
    id: '',
    'enable-camera': 'true',
    'enable-auto-focus': 'true',
    'enable-zoom': 'false',
    'device-position': singleQuote('front'),
    'enable-mic': 'true',
    'enable-agc': 'false',
    'enable-ans': 'false',
    bitrate: '900',
    'video-width': '360',
    'video-height': '640',
    'enable-remote-mirror': 'false',
    'local-mirror': singleQuote('auto'),
    'sound-mode': singleQuote('speaker'),
    bindStateChange: '',
    bindError: ''
  },
  RtcRoomItem: {
    id: '',
    type: '',
    'user-id': ''
  },
  OpenData: {
    type: ''
  }
}
