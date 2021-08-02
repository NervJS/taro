import { Gyroscope } from 'expo-sensors'

const _callbacks = new Set()
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
            throw new Error('startGyroscope:fail')
        }
        _listener = Gyroscope.addListener(e => {
            _callbacks.forEach((cb: Taro.onGyroscopeChange.Callback) => {
                cb?.(e)
            })
        })
        success?.(res)
        complete?.(res)
    } catch (error) {
        res.errMsg = 'startGyroscope:fail'
        fail?.(res)
        complete?.(res)
        return Promise.reject(res)
    }
    Gyroscope.setUpdateInterval(intervalMap[interval])
    return Promise.resolve(res)
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
        success?.(res)
        complete?.(res)
        return Promise.resolve(res)
    } catch (error) {
        res.errMsg = 'stopGyroscope:fail'
        fail?.(res)
        complete?.(res)
        return Promise.reject(res)
    }
}

/**
 * 监听陀螺仪数据变化事件
 * @param opts 
 */
function onGyroscopeChange(fnc: Taro.onGyroscopeChange.Callback): void {
    _callbacks.add(fnc)
}

/**
 * 取消监听陀螺仪数据变化事件
 * @param opts 
 */
function offGyroscopeChange(fnc?: Taro.onGyroscopeChange.Callback) {
    if (fnc && typeof fnc === 'function') {
        _callbacks.delete(fnc)
    } else if (fnc === undefined) {
        _callbacks.clear()
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
