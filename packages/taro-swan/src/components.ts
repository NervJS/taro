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
    bindChooseInvoiceTitle: '',
    bindLogin: ''
  },
  Form: {
    'report-type': 'default',
    'template-id': '',
    'subscribe-id': '',
    'skip-subscribe-authorize': 'false'
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
    loop: 'false',
    autoplay: 'false',
    'alpha-direction': singleQuote('left'),
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
  },
  Login: {
    'button-class': '',
    'checked-color': singleQuote('#3388FF'),
    'theme-color': singleQuote('#3388FF'),
    bindGetPhoneNumber: '',
    bindLoadError: ''
  },
  Like: {
    'is-liked': 'false',
    mode: singleQuote('icon'),
    'icon-type': singleQuote('hand'),
    'like-text': singleQuote('赞'),
    'like-num': '0',
    'like-type': '0',
    'animation-type': '1',
    'is-show-toast': 'false',
    'toast-text': "['已点赞', '已取消']",
    'like-param': '',
    bindError: '',
    bindSuccess: '',
    bindFail: '',
  },
  CommentList: {
    'comment-param': '',
    'toolbar-config': '',
    'is-page-scroll': 'true',
    'need-toolbar': 'true',
    'add-comment': 'false',
    'detail-path': '',
    'is-folded': 'false',
    'fold-num': '3',
    'view-more-path': '',
    'view-more-style': '',
    bindClickComment: '',
    bindViewMore: '',
  },
  CommentDetail: {
    'comment-param': '',
    srid: '',
    'is-page-scroll': 'true',
    'need-toolbar': 'true',
    'need-like-btn': 'true',
    'back-list-after-delete': 'true',
    'add-comment': 'false',
    bindDelete: '',
  },
  FollowSwan: {
    size: singleQuote('default'),
    type: singleQuote('primary'),
    bindFavorStatusChange: '',
  },
  InlinePaymentPanel: {
    'total-amount': '',
    'deal-id': '',
    'app-key': '',
    'promotion-tag': '',
    'enable-page-back-modal': '',
    'custom-style': '',
    'style-type': singleQuote('default'),
    bindGetPaymentInfo: '',
    bindError: ''
  },
}
