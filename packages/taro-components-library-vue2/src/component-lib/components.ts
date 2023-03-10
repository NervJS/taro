/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import Icon from './icon'
import Image from './image'
import Picker from './picker'
import ScrollView from './scroll-view'
import Text from './text'

const components = [
  // 视图容器
  'taro-cover-image',
  'taro-cover-view',
  'taro-match-media',
  'taro-movable-area',
  'taro-movable-view',
  'taro-page-container',
  'taro-root-portal',
  ['taro-scroll-view', { type: 'component', component: ScrollView }],
  'taro-share-element',
  'taro-swiper',
  ['taro-swiper-item', { classNames: ['swiper-slide'] }],
  'taro-view',

  // 基础内容
  ['taro-icon', { type: 'component', component: Icon }],
  ['taro-progress', { classNames: ['weui-progress'] }],
  'taro-rich-text',
  ['taro-text', { type: 'component', component: Text }],

  // 表单组件
  'taro-button',
  ['taro-checkbox', { classNames: ['weui-cells_checkbox'] }],
  'taro-checkbox-group',
  'taro-editor',
  'taro-form',
  ['taro-input', { type: 'forms', event: 'input' }],
  'taro-keyboard-accessory',
  'taro-label',
  ['taro-picker', { type: 'component', component: Picker }],
  'taro-picker-view',
  'taro-picker-view-column',
  ['taro-radio', { classNames: ['weui-cells_checkbox'] }],
  ['taro-radio-group', { classNames: ['weui-cells_radiogroup'] }],
  ['taro-slider', { type: 'forms', event: 'change', modelValue: 'value', classNames: ['weui-slider-box'] }],
  ['taro-switch', { type: 'forms', event: 'change', modelValue: 'checked' }],
  ['taro-textarea', { type: 'forms', event: 'input' }],

  // 导航
  'taro-functional-page-navigator',
  'taro-navigator',

  // 媒体组件
  'taro-audio',
  'taro-camera',
  ['taro-image', { type: 'component', component: Image }],
  'taro-live-player',
  ['taro-video', { classNames: ['taro-video-container'] }],
  'taro-voip-room',

  // 地图
  'taro-map',

  // 画布
  'taro-canvas',

  // 开放能力
  'taro-web-view',
  'taro-ad',
  'taro-ad-custom',
  'taro-official-account',
  'taro-open-data',

  // 导航栏
  'taro-navigation-bar',

  // 页面属性配置节点
  'taro-page-meta',

  // 其他
  'taro-block',
  'taro-custom-wrapper',
  'taro-slot'
]

export default components
