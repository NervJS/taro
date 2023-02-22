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

export const specialEvents = new Map<string, string>()
specialEvents.set('bindtimeupdate', 'onTimeUpdate')
specialEvents.set('bindgetphoneNumber', 'onGetPhoneNumber')
specialEvents.set('bindchooseavatar', 'onChooseAvatar')
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
