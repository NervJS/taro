/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
    'ground-overlays': '',
    'tile-overlay': '',
    'custom-map-style': '',
    setting: '{}',
    optimize: '',
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
