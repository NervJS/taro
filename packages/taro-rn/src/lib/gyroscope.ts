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
function startGyroscope(opts: Taro.startGyroscope.Option = {}): Promise<TaroGeneral.CallbackResult> {
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
function stopGyroscope(opts: Taro.stopGyroscope.Option = {}): Promise<TaroGeneral.CallbackResult> {
    const { success, fail, complete } = opts
    const res = { errMsg: 'stopGyroscope:ok' }
    try {
        _listener && _listener.remove()
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
