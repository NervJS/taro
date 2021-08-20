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

import { Gyroscope } from 'expo-sensors'
import { createCallbackManager, errorHandler, successHandler } from '../utils'

const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
    game: 20,
    ui: 60,
    normal: 200
}

/**
 * 开始监听陀螺仪数据
 * @param opts 
 * @param {string} [opts.interval='normal'] 监听陀螺仪数据回调函数的执行频率
 */
function startGyroscope(opts: Taro.startGyroscope.Option = {}): Promise<Taro.General.CallbackResult> {
    const { interval = 'normal', success, fail, complete } = opts
    const res = { errMsg: 'startGyroscope:ok' }
    try {
        // 适配微信小程序行为：重复 start 失败
        if (_listener) {
            console.error('startGyroscope:fail')
            throw new Error('startGyroscope:fail')
        }
        _listener = Gyroscope.addListener(e => {
            _cbManager.trigger(e)
        })
        Gyroscope.setUpdateInterval(intervalMap[interval])
        
        return successHandler(success, complete)(res)
    } catch (error) {
        res.errMsg = 'startGyroscope:fail'
        return errorHandler(fail, complete)(res)
    }
}

/**
 * 停止监听陀螺仪数据
 * @param opts 
 */
function stopGyroscope(opts: Taro.stopGyroscope.Option = {}): Promise<Taro.General.CallbackResult> {
    const { success, fail, complete } = opts
    const res = { errMsg: 'stopGyroscope:ok' }
    try {
        _listener.remove()
        _listener = null
        return successHandler(success, complete)(res)
    } catch (error) {
        res.errMsg = 'stopGyroscope:fail'
        return errorHandler(fail, complete)(res)
    }
}

/**
 * 监听陀螺仪数据变化事件
 * @param opts 
 */
function onGyroscopeChange(fnc: Taro.onGyroscopeChange.Callback): void {
    _cbManager.add(fnc)
}

/**
 * 取消监听陀螺仪数据变化事件
 * @param opts 
 */
function offGyroscopeChange(fnc?: Taro.onGyroscopeChange.Callback) {
    if (fnc && typeof fnc === 'function') {
        _cbManager.remove(fnc)
    } else if (fnc === undefined) {
        _cbManager.clear()
    } else {
        console.warn('offGyroscopeChange failed')
    }
}

export {
    startGyroscope,
    stopGyroscope,
    onGyroscopeChange,
    offGyroscopeChange,
}
