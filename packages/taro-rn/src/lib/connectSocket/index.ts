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

import SocketTask from './socketTask'

let socketsCounter = 1
let socketTasks: any[] = []

export function connectSocket(opts: Taro.connectSocket.Option): Promise<Taro.SocketTask> {
  return new Promise((resolve, reject) => {
    const { url, success, fail, complete } = opts
    let { protocols } = opts
    const res: any = { errMsg: 'connectSocket:ok' }

    if (typeof url !== 'string') {
      const error = new Error('connectSocket:fail parameter error: parameter.url should be String')
      res.errMsg = error.message
      fail?.(res)
      complete?.(res)
      return reject(res)
    }

    if (Object.prototype.toString.call(protocols) !== '[object Array]') {
      protocols = undefined
    }

    // 最多同时存在两个SocketTask
    if (socketTasks.length >= 2) {
      const error = new Error('同时最多发起 2 个 socket 请求，更多请参考文档。')
      res.errMsg = error.message
      fail?.(res)
      complete?.(res)
      return reject(res)
    }

    const task: any = new SocketTask(url, protocols)
    task._destroyWhenClose = () => {
      socketTasks = socketTasks.filter(socketTask => { return socketTask !== task })
    }
    socketTasks.push(task)

    res.socketTaskId = socketsCounter++
    res.socketTask = task

    success?.(res)
    complete?.(res)

    return resolve(task)
  })
}

function onSocketOpen (): void {
  console.warn('已废弃。请使用socketTask.onOpen方法')
}

function onSocketError (): void {
  console.warn('已废弃。请使用socketTask.onError方法')
}

function sendSocketMessage (): void {
  console.warn('已废弃。请使用socketTask.send方法')
}

function onSocketMessage (): void {
  console.warn('已废弃。请使用socketTask.onMessage方法')
}

function closeSocket (): void {
  console.warn('已废弃。请使用socketTask.close方法')
}

function onSocketClose (): void {
  console.warn('已废弃。请使用socketTask.onClose方法')
}

export default {
  connectSocket,
  onSocketOpen,
  onSocketError,
  sendSocketMessage,
  onSocketMessage,
  closeSocket,
  onSocketClose
}
