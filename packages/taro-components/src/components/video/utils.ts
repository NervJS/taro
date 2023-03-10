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

export const formatTime = (time?: number): string => {
  if (!time) return ''
  const sec = Math.round(time % 60)
  const min = Math.round((time - sec) / 60)
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const calcDist = (x: number, y: number): number => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const normalizeNumber = (number: number): number => {
  return Math.max(-1, Math.min(number, 1))
}

export let scene = 'default'

export const screenFn = (function () {
  let val
  const fnMap = [
    [
      'requestFullscreen',
      'exitFullscreen',
      'fullscreenElement',
      'fullscreenEnabled',
      'fullscreenchange',
      'fullscreenerror'
    ],
    // New WebKit
    [
      'webkitRequestFullscreen',
      'webkitExitFullscreen',
      'webkitFullscreenElement',
      'webkitFullscreenEnabled',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    // Old WebKit
    [
      'webkitRequestFullScreen',
      'webkitCancelFullScreen',
      'webkitCurrentFullScreenElement',
      'webkitCancelFullScreen',
      'webkitfullscreenchange',
      'webkitfullscreenerror'
    ],
    [
      'mozRequestFullScreen',
      'mozCancelFullScreen',
      'mozFullScreenElement',
      'mozFullScreenEnabled',
      'mozfullscreenchange',
      'mozfullscreenerror'
    ],
    [
      'msRequestFullscreen',
      'msExitFullscreen',
      'msFullscreenElement',
      'msFullscreenEnabled',
      'MSFullscreenChange',
      'MSFullscreenError'
    ]
  ]
  var defaultIOSMap = [
    'webkitEnterFullscreen',
    'webkitExitFullscreen',
    'webkitCurrentFullScreenElement',
    'webkitSupportsFullscreen',
    'fullscreenchange',
    'fullscreenerror'
  ]
  let i = 0
  const l = fnMap.length
  const ret: Record<string, any> = {}
  // This for loop essentially checks the current document object for the property/methods above.
  for (; i < l; i++) {
    val = fnMap[i]
    if (val && val[1] in document) {
      for (i = 0; i < val.length; i++) {
        ret[fnMap[0][i]] = val[i]
      }
      return ret
    }
  }
  if (!ret[fnMap[0][0]]) {
    scene = 'iOS'
    // when there is no any APIs be set.

    // In IOS, there is no 'webkitEnterFullscreen' property `in document` but video can use it for fullscreen.
    // ref: https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
    for (i = 0; i < defaultIOSMap.length; i++) {
      ret[fnMap[0][i]] = defaultIOSMap[i]
    }
  }
  // If it doesn't find any of them, this whole function returns {}
  // and the fn variable is set to this returned value.
  return ret
})()

export const isHls = url => /\.(m3u8)($|\?)/i.test(url)
