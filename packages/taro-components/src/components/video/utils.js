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

export const formatTime = time => {
  if (time == null) return ''
  const sec = Math.round(time % 60)
  const min = Math.round((time - sec) / 60)
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const calcDist = (x, y) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const normalizeNumber = number => {
  return Math.max(-1, Math.min(number, 1))
}

export const throttle = (fn, threshhold) => {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime > threshhold) {
      fn.apply(this, arguments)
      lastTime = now
    }
  }
}

/**
 * @returns: {requestFullscreen: 'requestFullscreen', exitFullscreen: 'exitFullscreen', ...}
 */
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
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror'
  ]
  let i = 0
  const l = fnMap.length
  const ret = {}
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
