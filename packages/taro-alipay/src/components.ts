/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
    bindError: ''
  },
  Checkbox: {
    bindChange: ''
  },
  Input: {
    'always-system':'false',
    'random-number': 'false',
    controlled: 'false',
    enableNative: 'true',
    name:''
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
    'mobilenet-hint-type': '1',
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
}
