declare namespace TaroGeneral {
  type IAnyObject = Record<string, any>
  type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F
  type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }
  type TFunc = (...args: any[]) => any
  /** 事件监听函数 */
  type EventCallback = (
    /** 触发事件参数 */
    ...args: any
  ) => void
  /** 通用错误 */
  interface CallbackResult {
    /** 错误信息 */
    errMsg: string
  }
  type CommonEventFunction<T = any> = (event: BaseEventOrig<T>) => any
  interface BaseEventOrig<T> {
    /** 事件类型 */
    type: string

    /** 事件生成时的时间戳 */
    timeStamp: number

    /** 触发事件的组件的一些属性值集合 */
    target: Target

    /** 当前组件的一些属性值集合 */
    currentTarget: currentTarget

    /** 额外的信息 */
    detail: T

    /** 阻止元素发生默认的行为 */
    preventDefault: () => void

    /** 阻止事件冒泡到父元素,阻止任何父事件处理程序被执行 */
    stopPropagation: () => void
  }
  interface currentTarget extends Target { }
  interface Target {
    /** 事件源组件的id */
    id: string
    /** 当前组件的类型 */
    tagName: string
    /** 事件源组件上由data-开头的自定义属性组成的集合 */
    dataset: {
      [key: string]: any
    }
  }
  /** 蓝牙错误 */
  interface BluetoothError extends CallbackResult {
    /** 错误信息 */
    errMsg: string
    /** 错误码 */
    errCode: keyof BluetoothErrCode
  }
  /** WIFI 错误 */
  interface WifiError extends CallbackResult {
    /** 错误信息 */
    errMsg: string
    /** 错误码 */
    errCode: keyof WifiErrCode
  }
  /** NFC 错误 */
  interface NFCError extends CallbackResult {
    /** 错误信息 */
    errMsg: string
    /** 错误码 */
    errCode: keyof NFCErrCode
  }

  /** iBeacon 错误 */
  interface IBeaconError extends CallbackResult {
    /** 错误信息 */
    errMsg: string
    /** 错误码 */
    errCode: keyof IBeaconErrCode
  }

  /** 在竖屏正方向下的安全区域 */
  interface SafeAreaResult {
    /** 安全区域右下角纵坐标 */
    bottom: number
    /** 安全区域的高度，单位逻辑像素 */
    height: number
    /** 安全区域左上角横坐标 */
    left: number
    /** 安全区域右下角横坐标 */
    right: number
    /** 安全区域左上角纵坐标 */
    top: number
    /** 安全区域的宽度，单位逻辑像素 */
    width: number
  }
  /**
   * 广告错误码
   *
   * 错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
   * 在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。
   */
  interface AdErrCode {
    /**
     * @illustrate 后端接口调用失败
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1000
    /**
     * @illustrate 参数错误
     * @reason 使用方法错误
     * @solution 可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。
     */
    1001
    /**
     * @illustrate 广告单元无效
     * @reason 可能是拼写错误、或者误用了其他APP的广告ID
     * @solution 请重新前往 mp.weixin.qq.com 确认广告位ID。
     */
    1002
    /**
     * @illustrate 内部错误
     * @reason 该项错误不是开发者的异常情况
     * @solution 一般情况下忽略一段时间即可恢复。
     */
    1003
    /**
     * @illustrate 无合适的广告
     * @reason 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告
     * @solution 属于正常情况，且开发者需要针对这种情况做形态上的兼容。
     */
    1004
    /**
     * @illustrate 广告组件审核中
     * @reason 你的广告正在被审核，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1005
    /**
     * @illustrate 广告组件被驳回
     * @reason 你的广告审核失败，无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
     */
    1006
    /**
     * @illustrate 广告组件被封禁
     * @reason 你的广告能力已经被封禁，封禁期间无法展现广告
     * @solution 请前往 mp.weixin.qq.com 确认小程序广告封禁状态。
     */
    1007
    /**
     * @illustrate 广告单元已关闭
     * @reason 该广告位的广告能力已经被关闭
     * @solution 请前往 mp.weixin.qq.com 重新打开对应广告位的展现。
     */
    1008
    // [key: number]: string
  }
  /** 蓝牙错误码 */
  interface BluetoothErrCode {
    /** ok
     * @illustrate 正常
     */
    0
    /** not init
     * @illustrate 未初始化蓝牙适配器
     */
    10000
    /** not available
     * @illustrate 当前蓝牙适配器不可用
     */
    10001
    /** no device
     * @illustrate 没有找到指定设备
     */
    10002
    /** connection fail
     * @illustrate 连接失败
     */
    10003
    /** no service
     * @illustrate 没有找到指定服务
     */
    10004
    /** no characteristic
     * @illustrate 没有找到指定特征值
     */
    10005
    /** no connection
     * @illustrate 当前连接已断开
     */
    10006
    /** property not support
     * @illustrate 当前特征值不支持此操作
     */
    10007
    /** system error
     * @illustrate 其余所有系统上报的异常
     */
    10008
    /** system not support
     * @illustrate Android 系统特有，系统版本低于 4.3 不支持 BLE
     */
    10009
    /** operate time out
     * @illustrate 连接超时
     */
    10012
    /** invalid_data
     * @illustrate 连接 deviceId 为空或者是格式不正确
     */
    10013
  }
  /** iBeacon 错误码 */
  interface IBeaconErrCode {
    /** ok
     * @illustrate 正常
     */
    0
    /** nonsupport
     * @illustrate 系统或设备不支持
     */
    11000
    /** bluetooth service unavailable
     * @illustrate 蓝牙服务不可用
     */
    11001
    /** location service unavailable
     * @illustrate 位置服务不可用
     */
    11002
    /** already start
     * @illustrate 已经开始搜索
     */
    11003
    /** not startBeaconDiscovery
     * @illustrate 还未开始搜索
     */
    11004
    /** system error
     * @illustrate 系统错误
     */
    11005
    /** invalid data
     * @illustrate 参数不正确
     */
    11006
  }
  /** WIFI 错误码 */
  interface WifiErrCode {
    /** ok
     * @illustrate 正常
     */
    0
    /** not init
     * @illustrate 未先调用 `startWifi` 接口
     */
    12000
    /** system not support
     * @illustrate 当前系统不支持相关能力
     */
    12001
    /** password error Wi-Fi
     * @illustrate 密码错误
     */
    12002
    /** connection timeout
     * @illustrate 连接超时
     */
    12003
    /** duplicate request
     * @illustrate 重复连接 Wi-Fi
     */
    12004
    /** wifi not turned on
     * @illustrate Android 特有，未打开 Wi-Fi 开关
     */
    12005
    /** gps not turned on
     * @illustrate Android 特有，未打开 GPS 定位开关
     */
    12006
    /** user denied
     * @illustrate 用户拒绝授权链接 Wi-Fi
     */
    12007
    /** invalid SSID
     * @illustrate 无效 SSID
     */
    12008
    /** system config err
     * @illustrate 系统运营商配置拒绝连接 Wi-Fi
     */
    12009
    /** system internal error
     * @illustrate 系统其他错误，需要在 errmsg 打印具体的错误原因
     */
    12010
    /** weapp in background
     * @illustrate 应用在后台无法配置 Wi-Fi
     */
    12011
    /** wifi config may be expired
     * @illustrate 系统保存的 Wi-Fi 配置过期，建议忘记 Wi-Fi 后重试
     */
    12013
  }
  /** NFC 错误码 */
  interface NFCErrCode {
    /** ok
     * @illustrate 正常
     */
    0
    /** @illustrate 当前设备不支持 NFC */
    13000
    /** @illustrate 当前设备支持 NFC，但系统 NFC 开关未开启 */
    13001
    /** @illustrate 当前设备支持 NFC，但不支持 HCE */
    13002
    /** @illustrate AID 列表参数格式错误 */
    13003
    /** @illustrate 未设置微信为默认 NFC 支付应用 */
    13004
    /** @illustrate 返回的指令不合法 */
    13005
    /** @illustrate 注册 AID 失败 */
    13006
    /** @illustrate 未知错误 */
    13010
    /** user is not authorized
     * @illustrate 用户未授权
     */
    13019
    /** invalid parameter
     * @illustrate 参数无效
     */
    13011
    /** parse NdefMessage failed
     * @illustrate 将参数解析为 NdefMessage 失败
     */
    13012
    /** NFC tag has not been discovered
     * @illustrate 未扫描到NFC标签
     */
    13013
    /** invalid tech
     * @illustrate 无效的标签技术
     */
    13014
    /** unavailable tech
     * @illustrate 从标签上获取对应技术失败
     */
    13015
    /** connect fail
     * @illustrate 连接失败
     */
    13016
    /** system internal error
     * @illustrate 相关读写操作失败
     */
    13017
    /** NFC discovery has not started
     * @illustrate 尝试在未开始 NFC 扫描时停止 NFC 扫描
     */
    13018
    /** NFC discovery already started
     * @illustrate 已经开始 NFC 扫描
     */
    13021
    /** Tech already connected
     * @illustrate 标签已经连接
     */
    13022
    /** Tech has not connected
     * @illustrate 尝试在未连接标签时断开连接
     */
    13023
    /** function not support
     * @illustrate 当前标签技术不支持该功能
     */
    13024
  }
  type EventName = string | symbol
  // Events
  class Events {
    /**
     * 监听一个事件，接受参数
     */
    on (eventName: EventName, listener: (...args: any[]) => void): this

    /**
     * 添加一个事件监听，并在事件触发完成之后移除Callbacks链
     */
    once (eventName: EventName, listener: (...args: any[]) => void): this

    /**
     * 取消监听一个事件
     */
    off (eventName: EventName, listener?: (...args: any[]) => void): this

    /**
     * 取消监听的所有事件
     */
    off (): this

    /**
     * 触发一个事件，传参
     */
    trigger (eventName: EventName, ...args: any[]): this
  }

  // ENV_TYPE
  enum ENV_TYPE {
    ASCF = 'ASCF',
    WEAPP = 'WEAPP',
    SWAN = 'SWAN',
    ALIPAY = 'ALIPAY',
    TT = 'TT',
    QQ = 'QQ',
    JD = 'JD',
    WEB = 'WEB',
    RN = 'RN',
    HARMONY = 'HARMONY',
    QUICKAPP = 'QUICKAPP',
    HARMONYHYBRID = 'HARMONYHYBRID'
  }

  type TDeviceRatio = Record<string, number>
}
