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
