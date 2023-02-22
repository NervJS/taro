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

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import { SocketTask } from './socketTask'

let socketTasks: SocketTask[] = []
let socketsCounter = 1

export function sendSocketMessage () {
  console.warn('Deprecated.Please use socketTask.send instead.')
}

export function onSocketOpen () {
  console.warn('Deprecated.Please use socketTask.onOpen instead.')
}

export function onSocketMessage () {
  console.warn('Deprecated.Please use socketTask.onMessage instead.')
}

export function onSocketError () {
  console.warn('Deprecated.Please use socketTask.onError instead.')
}

export function onSocketClose () {
  console.warn('Deprecated.Please use socketTask.onClose instead.')
}

export function connectSocket (options?: Taro.connectSocket.Option) {
  const name = 'connectSocket'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { url, protocols, success, fail, complete } = options as Exclude<typeof options, undefined>
    const handle = new MethodHandler<{
      socketTaskId?: number
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof url !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'url',
          correct: 'String',
          wrong: url
        })
      }, { resolve, reject })
    }

    // options.url must be invalid
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      return handle.fail({
        errMsg: `request:fail invalid url "${url}"`
      }, { resolve, reject })
    }

    // protocols must be array
    const _protocols = Array.isArray(protocols) ? protocols : null

    // 2 connection at most
    if (socketTasks.length > 1) {
      return handle.fail({
        errMsg: '同时最多发起 2 个 socket 请求，更多请参考文档。'
      }, { resolve, reject })
    }

    const task = new SocketTask(url, _protocols)
    task._destroyWhenClose = function () {
      socketTasks = socketTasks.filter(socketTask => socketTask !== this)
    }
    socketTasks.push(task)

    handle.success({
      socketTaskId: socketsCounter++
    })

    return resolve(task)
  })
}

export function closeSocket () {
  console.warn('Deprecated.Please use socketTask.close instead.')
}
