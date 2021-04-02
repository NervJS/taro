import { Gyroscope } from 'expo-sensors'

const gyroCase: any = {
    callbacks: [],
}
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
    gyroCase.interval = interval
    const res = { errMsg: 'startGyroscope:ok' }
    try {
        // 适配微信小程序行为：重复 start 失败
        if (gyroCase.listener) {
            throw new Error('startGyroscope:fail')
        }
        gyroCase.listener = Gyroscope.addListener(e => {
            gyroCase.callbacks.forEach((cb: Taro.onGyroscopeChange.Callback) => {
                cb?.(e)
            });
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
        gyroCase.listener.remove()
        gyroCase.listener = null
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
    gyroCase.callbacks.push(fnc)
}

/**
 * 取消监听陀螺仪数据变化事件
 * @param opts 
 */
function offGyroscopeChange(fnc?: Taro.onGyroscopeChange.Callback) {
    if (fnc && typeof fnc === 'function') {
        gyroCase.callbacks = gyroCase.callbacks.filter((cb: Taro.onGyroscopeChange.Callback) => {
            return cb !== fnc
        })
    } else if (fnc === undefined) {
        gyroCase.callbacks = []
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
