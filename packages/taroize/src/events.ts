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

export const specialEvents = new Map<string, string>()
specialEvents.set('bindtimeupdate', 'onTimeUpdate')
specialEvents.set('bindgetphoneNumber', 'onGetPhoneNumber')
specialEvents.set('bindgetrealnameauthinfo', 'onGetRealnameAuthInfo')
specialEvents.set('bindopensetting', 'onOpenSetting')
specialEvents.set('bindscancode', 'onScanCode')
specialEvents.set('bindstatechange', 'onStateChange')
specialEvents.set('bindhtouchmove', 'onHTouchMove')
specialEvents.set('bindvtouchmove', 'onVTouchMove')
specialEvents.set('bindcolumnchange', 'onColumnChange')
specialEvents.set('bindscrolltoupper', 'onScrollToUpper')
specialEvents.set('bindscrolltolower', 'onScrollToLower')
specialEvents.set('bindanimationfinish', 'onAnimationFinish')
specialEvents.set('bindfullscreenchange', 'onFullscreenChange')
specialEvents.set('bindtouchstart', 'onTouchStart')
specialEvents.set('bindtouchmove', 'onTouchMove')
specialEvents.set('bindtouchcancel', 'onTouchCancel')
specialEvents.set('bindtouchend', 'onTouchEnd')
specialEvents.set('bindlongpress', 'onLongPress')
specialEvents.set('bindlongclick', 'onLongClick')
specialEvents.set('bindtransitionend', 'onTransitionEnd')
specialEvents.set('bindanimationstart', 'onAnimationStart')
specialEvents.set('bindanimationtteration', 'onAnimationIteration')
specialEvents.set('bindanimationend', 'onAnimationEnd')
specialEvents.set('bindtouchforcechange', 'onTouchForceChange')
specialEvents.set('bindtap', 'onClick')
specialEvents.forEach((value, key) => {
  specialEvents.set(key.replace(/^bind/, 'catch'), value)
})
