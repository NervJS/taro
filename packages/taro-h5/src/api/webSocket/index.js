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

import SocketTask from './socketTask'
import { shouleBeObject, getParameterError } from '../utils'

let socketTasks = []
let socketsCounter = 1

function connectSocket (options) {
  const name = 'connectSocket'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `${name}${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }

    const { url, protocols, success, fail, complete } = options
    const res = { errMsg: 'connectSocket:ok' }

    // options.url must be String
    if (typeof url !== 'string') {
      res.errMsg = getParameterError({
        name,
        para: 'url',
        correct: 'String',
        wrong: url
      })
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return reject(res)
    }

    // options.url must be invalid
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      res.errMsg = `request:fail invalid url "${url}"`
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return reject(res)
    }

    // protocols must be array
    const _protocols = Array.isArray(protocols) ? protocols : null

    // 2 connection at most
    if (socketTasks.length > 1) {
      res.errMsg = '同时最多发起 2 个 socket 请求，更多请参考文档。'
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return reject(res)
    }

    const task = new SocketTask(url, _protocols)
    task._destroyWhenClose = function () {
      socketTasks = socketTasks.filter(socketTask => socketTask !== this)
    }
    socketTasks.push(task)

    res.socketTaskId = socketsCounter++
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)

    return resolve(task)
  })
}

function onSocketOpen () {
  console.warn('Deprecated.Please use socketTask.onOpen instead.')
}

function onSocketError () {
  console.warn('Deprecated.Please use socketTask.onError instead.')
}

function sendSocketMessage () {
  console.warn('Deprecated.Please use socketTask.send instead.')
}

function onSocketMessage () {
  console.warn('Deprecated.Please use socketTask.onMessage instead.')
}

function closeSocket () {
  console.warn('Deprecated.Please use socketTask.close instead.')
}

function onSocketClose () {
  console.warn('Deprecated.Please use socketTask.onClose instead.')
}

export {
  connectSocket,
  onSocketOpen,
  onSocketError,
  sendSocketMessage,
  onSocketMessage,
  closeSocket,
  onSocketClose
}
