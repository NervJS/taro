/*
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

import Vue from 'vue'
import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'
import Picker from './components/picker'
import Text from './components/text'
import Image from './components/image'
import Icon from './components/icon'
import ScrollView from './components/scroll-view'

import { simpleComponents } from './simpleComponents'

simpleComponents.map(component => {
  if (typeof component === 'string') {
    Vue.component(component, createComponent(component))
  } else {
    const { name, classNames } = component
    Vue.component(name, createComponent(name, classNames))
  }
})

const Input = createFormsComponent('taro-input', 'input')
const Textarea = createFormsComponent('taro-textarea', 'input')
const Switch = createFormsComponent('taro-switch', 'change', 'checked')
const Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])

Vue.component('taro-input', Input)
Vue.component('taro-textarea', Textarea)
Vue.component('taro-switch', Switch)
Vue.component('taro-slider', Slider)
Vue.component('taro-text', Text)
Vue.component('taro-picker', Picker)
Vue.component('taro-image', Image)
Vue.component('taro-icon', Icon)
Vue.component('taro-scroll-view', ScrollView)

Vue.config.ignoredElements = [
  'root',
  'block',
  /^taro-/
]
