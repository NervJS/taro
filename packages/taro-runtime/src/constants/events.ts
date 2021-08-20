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

/**
 * 支持冒泡的事件, 除 支付宝小程序外，其余的可冒泡事件都和微信保持一致
 * 详见 见 https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html
 */
export const BUBBLE_EVENTS = new Set([
  'touchstart',
  'touchmove',
  'touchcancel',
  'touchend',
  'touchforcechange',
  'tap',
  'longpress',
  'longtap',
  'transitionend',
  'animationstart',
  'animationiteration',
  'animationend'
])
