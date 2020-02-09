---
title: General
sidebar_label: General
id: version-1.3.37-General
original_id: General
---

## 参数

### CallbackResult

通用错误

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |

### BluetoothError

蓝牙错误

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | `0 | 10000 | 10001 | 10002 | 10003 | 10004 | 10005 | 10006 | 10007 | 10008 | 10009 | 10012 | 10013` | 错误码 |

### WifiError

WIFI 错误

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | `0 | 12000 | 12001 | 12002 | 12003 | 12004 | 12005 | 12006 | 12007 | 12008 | 12009 | 12010 | 12011 | 12013` | 错误码 |

### NFCError

NFC 错误

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | `0 | 13000 | 13001 | 13002 | 13003 | 13004 | 13005 | 13006` | 错误码 |

### IBeaconError

iBeacon 错误

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | `0 | 11000 | 11001 | 11002 | 11003 | 11004 | 11005 | 11006` | 错误码 |

### SafeAreaResult

在竖屏正方向下的安全区域

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 安全区域右下角纵坐标 |
| height | `number` | 安全区域的高度，单位逻辑像素 |
| left | `number` | 安全区域左上角横坐标 |
| right | `number` | 安全区域右下角横坐标 |
| top | `number` | 安全区域左上角纵坐标 |
| width | `number` | 安全区域的宽度，单位逻辑像素 |

### AdErrCode

广告错误码

错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。

| 参数 | 异常情况 | 理由 | 解决方案 |
| --- | :---: | :---: | :---: |
| 1000 | `后端接口调用失败` | `该项错误不是开发者的异常情况` | `一般情况下忽略一段时间即可恢复。` |
| 1001 | `参数错误` | `使用方法错误` | `可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。` |
| 1002 | `广告单元无效` | `可能是拼写错误、或者误用了其他APP的广告ID` | `请重新前往 mp.weixin.qq.com 确认广告位ID。` |
| 1003 | `内部错误` | `该项错误不是开发者的异常情况` | `一般情况下忽略一段时间即可恢复。` |
| 1004 | `无合适的广告` | `广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告` | `属于正常情况，且开发者需要针对这种情况做形态上的兼容。` |
| 1005 | `广告组件审核中` | `你的广告正在被审核，无法展现广告` | `请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。` |
| 1006 | `广告组件被驳回` | `你的广告审核失败，无法展现广告` | `请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。` |
| 1007 | `广告组件被封禁` | `你的广告能力已经被封禁，封禁期间无法展现广告` | `请前往 mp.weixin.qq.com 确认小程序广告封禁状态。` |
| 1008 | `广告单元已关闭` | `该广告位的广告能力已经被关闭` | `请前往 mp.weixin.qq.com 重新打开对应广告位的展现。` |

### BluetoothErrCode

蓝牙错误码

| 参数 | 异常情况 | 说明 |
| --- | :---: | --- |
| 0 | `ok` | 正常 |
| 10000 | `not init` | 未初始化蓝牙适配器 |
| 10001 | `not available` | 当前蓝牙适配器不可用 |
| 10002 | `no device` | 没有找到指定设备 |
| 10003 | `connection fail` | 连接失败 |
| 10004 | `no service` | 没有找到指定服务 |
| 10005 | `no characteristic` | 没有找到指定特征值 |
| 10006 | `no connection` | 当前连接已断开 |
| 10007 | `property not support` | 当前特征值不支持此操作 |
| 10008 | `system error` | 其余所有系统上报的异常 |
| 10009 | `system not support` | Android 系统特有，系统版本低于 4.3 不支持 BLE |
| 10012 | `operate time out` | 连接超时 |
| 10013 | `invalid_data` | 连接 deviceId 为空或者是格式不正确 |

### IBeaconErrCode

iBeacon 错误码

| 参数 | 异常情况 | 说明 |
| --- | :---: | --- |
| 0 | `ok` | 正常 |
| 11000 | `unsupport` | 系统或设备不支持 |
| 11001 | `bluetooth service unavailable` | 蓝牙服务不可用 |
| 11002 | `location service unavailable` | 位置服务不可用 |
| 11003 | `already start` | 已经开始搜索 |
| 11004 | `not startBeaconDiscovery` | 还未开始搜索 |
| 11005 | `system error` | 系统错误 |
| 11006 | `invalid data` | 参数不正确 |

### WifiErrCode

WIFI 错误码

| 参数 | 异常情况 | 说明 |
| --- | :---: | --- |
| 0 | `ok` | 正常 |
| 12000 | `not init` | 未先调用 `startWifi` 接口 |
| 12001 | `system not support` | 当前系统不支持相关能力 |
| 12002 | `password error Wi-Fi` | 密码错误 |
| 12003 | `connection timeout` | 连接超时 |
| 12004 | `duplicate request` | 重复连接 Wi-Fi |
| 12005 | `wifi not turned on` | Android 特有，未打开 Wi-Fi 开关 |
| 12006 | `wifi not turned on` | Android 特有，未打开 GPS 定位开关 |
| 12007 | `user denied` | 用户拒绝授权链接 Wi-Fi |
| 12008 | `invalid SSID` | 无效 SSID |
| 12009 | `system config err` | 系统运营商配置拒绝连接 Wi-Fi |
| 12010 | `system internal error` | 系统其他错误，需要在 errmsg 打印具体的错误原因 |
| 12011 | `weapp in background` | 应用在后台无法配置 Wi-Fi |
| 12013 | `wifi config may be expired` | 系统保存的 Wi-Fi 配置过期，建议忘记 Wi-Fi 后重试 |

### NFCErrCode

NFC 错误码

| 参数 | 异常情况 | 说明 |
| --- | :---: | --- |
| 0 | `ok` | 正常 |
| 13000 |  | 当前设备不支持NFC |
| 13001 |  | 当前设备支持NFC，但系统NFC开关未开启 |
| 13002 |  | 当前设备支持NFC，但不支持HCE |
| 13003 |  | AID列表参数格式错误 |
| 13004 |  | 未设置微信为默认NFC支付应用 |
| 13005 |  | 返回的指令不合法 |
| 13006 |  | 注册AID失败 |

### LaunchOptionsApp

启动参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| path | `string` | 启动小程序的路径 |
| query | `Record<string, any>` | 启动小程序的 query 参数 |
| referrerInfo | `ReferrerInfo` | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) |
| scene | `number` | 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) |
| shareTicket | `string` | shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) |

#### ReferrerInfo

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string` | 来源小程序、公众号或 App 的 appId |
| extraData | `Record<string, any>` | 来源小程序传过来的数据，scene=1037或1038时支持 |
