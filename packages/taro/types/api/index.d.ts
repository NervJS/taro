declare namespace Taro {
  namespace General {
    type IAnyObject = Record<string, any>
    type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F
    type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }
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
    /** 蓝牙错误 */
    interface BluetoothError extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: keyof BluetoothErrCode
    }
    /** WIFI 错误 */
    interface WifiError extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: keyof WifiErrCode
    }
    /** NFC 错误 */
    interface NFCError extends General.CallbackResult {
      /** 错误信息 */
      errMsg: string
      /** 错误码 */
      errCode: keyof NFCErrCode
    }

    /** iBeacon 错误 */
    interface IBeaconError extends General.CallbackResult {
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
       * @abnormal 后端接口调用失败
       * @reason 该项错误不是开发者的异常情况
       * @solution 一般情况下忽略一段时间即可恢复。
       */
      1000
      /**
       * @abnormal 参数错误
       * @reason 使用方法错误
       * @solution 可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。
       */
      1001
      /**
       * @abnormal 广告单元无效
       * @reason 可能是拼写错误、或者误用了其他APP的广告ID
       * @solution 请重新前往 mp.weixin.qq.com 确认广告位ID。
       */
      1002
      /**
       * @abnormal 内部错误
       * @reason 该项错误不是开发者的异常情况
       * @solution 一般情况下忽略一段时间即可恢复。
       */
      1003
      /**
       * @abnormal 无合适的广告
       * @reason 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告
       * @solution 属于正常情况，且开发者需要针对这种情况做形态上的兼容。
       */
      1004
      /**
       * @abnormal 广告组件审核中
       * @reason 你的广告正在被审核，无法展现广告
       * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
       */
      1005
      /**
       * @abnormal 广告组件被驳回
       * @reason 你的广告审核失败，无法展现广告
       * @solution 请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。
       */
      1006
      /**
       * @abnormal 广告组件被封禁
       * @reason 你的广告能力已经被封禁，封禁期间无法展现广告
       * @solution 请前往 mp.weixin.qq.com 确认小程序广告封禁状态。
       */
      1007
      /**
       * @abnormal 广告单元已关闭
       * @reason 该广告位的广告能力已经被关闭
       * @solution 请前往 mp.weixin.qq.com 重新打开对应广告位的展现。
       */
      1008
      // [key: number]: string
    }
    /** 蓝牙错误码 */
    interface BluetoothErrCode {
      /** 正常
       * @abnormal ok
       */
      0
      /** 未初始化蓝牙适配器
       * @abnormal not init
       */
      10000
      /** 当前蓝牙适配器不可用
       * @abnormal not available
       */
      10001
      /** 没有找到指定设备
       * @abnormal no device
       */
      10002
      /** 连接失败
       * @abnormal connection fail
       */
      10003
      /** 没有找到指定服务
       * @abnormal no service
       */
      10004
      /** 没有找到指定特征值
       * @abnormal no characteristic
       */
      10005
      /** 当前连接已断开
       * @abnormal no connection
       */
      10006
      /** 当前特征值不支持此操作
       * @abnormal property not support
       */
      10007
      /** 其余所有系统上报的异常
       * @abnormal system error
       */
      10008
      /** Android 系统特有，系统版本低于 4.3 不支持 BLE
       * @abnormal system not support
       */
      10009
      /** 连接超时
       * @abnormal operate time out
       */
      10012
      /** 连接 deviceId 为空或者是格式不正确
       * @abnormal invalid_data
       */
      10013
    }
    /** iBeacon 错误码 */
    interface IBeaconErrCode {
      /** 正常
       * @abnormal ok
       */
      0
      /** 系统或设备不支持
       * @abnormal unsupport
       */
      11000
      /** 蓝牙服务不可用
       * @abnormal bluetooth service unavailable
       */
      11001
      /** 位置服务不可用
       * @abnormal location service unavailable
       */
      11002
      /** 已经开始搜索
       * @abnormal already start
       */
      11003
      /** 还未开始搜索
       * @abnormal not startBeaconDiscovery
       */
      11004
      /** 系统错误
       * @abnormal system error
       */
      11005
      /** 参数不正确
       * @abnormal invalid data
       */
      11006
    }
    /** WIFI 错误码 */
    interface WifiErrCode {
      /** 正常
       * @abnormal ok
       */
      0
      /** 未先调用 `startWifi` 接口
       * @abnormal not init
       */
      12000
      /** 当前系统不支持相关能力
       * @abnormal system not support
       */
      12001
      /** 密码错误
       * @abnormal password error Wi-Fi
       */
      12002
      /** 连接超时
       * @abnormal connection timeout
       */
      12003
      /** 重复连接 Wi-Fi
       * @abnormal duplicate request
       */
      12004
      /** Android 特有，未打开 Wi-Fi 开关
       * @abnormal wifi not turned on
       */
      12005
      /** Android 特有，未打开 GPS 定位开关
       * @abnormal wifi not turned on
       */
      12006
      /** 用户拒绝授权链接 Wi-Fi
       * @abnormal user denied
       */
      12007
      /** 无效 SSID
       * @abnormal invalid SSID
       */
      12008
      /** 系统运营商配置拒绝连接 Wi-Fi
       * @abnormal system config err
       */
      12009
      /** 系统其他错误，需要在 errmsg 打印具体的错误原因
       * @abnormal system internal error
       */
      12010
      /** 应用在后台无法配置 Wi-Fi
       * @abnormal weapp in background
       */
      12011
      /** 系统保存的 Wi-Fi 配置过期，建议忘记 Wi-Fi 后重试
       * @abnormal wifi config may be expired
       */
      12013
    }
    /** NFC 错误码 */
    interface NFCErrCode {
      /** 正常
       * @abnormal ok
       */
      0
      /** 当前设备不支持NFC */
      13000
      /** 当前设备支持NFC，但系统NFC开关未开启 */
      13001
      /** 当前设备支持NFC，但不支持HCE */
      13002
      /** AID列表参数格式错误 */
      13003
      /** 未设置微信为默认NFC支付应用 */
      13004
      /** 返回的指令不合法 */
      13005
      /** 注册AID失败 */
      13006
    }

    /** 启动参数 */
    interface LaunchOptionsApp {
      /** 启动小程序的路径 */
      path: string
      /** 启动小程序的 query 参数 */
      query: IAnyObject
      /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
      referrerInfo: LaunchOptionsApp.ReferrerInfo
      /** 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
      scene: number
      /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      shareTicket: string
    }

    namespace LaunchOptionsApp {
      interface ReferrerInfo {
        /** 来源小程序、公众号或 App 的 appId */
        appId: string
        /** 来源小程序传过来的数据，scene=1037或1038时支持 */
        extraData: IAnyObject
      }
    }
  }
}
