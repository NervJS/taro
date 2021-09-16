---
title: General
sidebar_label: General
---

## Parameters

### CallbackResult

Generic error results

| Property | Type | Description |
| --- | --- | --- |
| errMsg | `string` | Error message |

### BluetoothError

Bluetooth error

| Property | Type | Description |
| --- | --- | --- |
| errMsg | `string` | Error message |
| errCode | 0, 10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10012, 10013 | Error code |

### WifiError

WIFI error

| Property | Type | Description |
| --- | --- | --- |
| errMsg | `string` | Error message |
| errCode | 0, 12000, 12001, 12002, 12003, 12004, 12005, 12006, 12007, 12008, 12009, 12010, 12011, 12013 | Error code |

### NFCError

NFC error

| Property | Type | Description |
| --- | --- | --- |
| errMsg | `string` | Error message |
| errCode | 0, 13000, 13001, 13002, 13003, 13004, 13005, 13006 | Error code |

### IBeaconError

iBeacon error

| Property | Type | Description |
| --- | --- | --- |
| errMsg | `string` | Error message |
| errCode | 0, 11000, 11001, 11002, 11003, 11004, 11005, 11006 | Error code |

### SafeAreaResult

Safe area when in the positive direction of the vertical screen

| Property | Type | Description |
| --- | --- | --- |
| bottom | `number` | The vertical coordinate of the lower right corner of the safe area. |
| height | `number` | Height of the safe area in logical pixels. |
| left | `number` | The horizontal coordinate of the upper left corner of the safe area. |
| right | `number` | Horizontal coordinate of the lower right corner of the safe area. |
| top | `number` | Vertical coordinates of the upper left corner of the safe area. |
| width | `number` | Width of the safe area in logical pixels. |

### AdErrCode

An error code is obtained by executing the binderror callback.

| Code | Exception | Cause | Solution |
| --- | :---: | :---: | :---: |
| 1000 | Call failed due to a backend error | This error is not caused by developers. | Ignore the error, and it will be automatically recovered after a period of time. |
| 1001 | Parameter error | The parameter is incorrectly used. | For details, visit developers.weixin.qq.com. (There are different courses specific to Mini Programs and Mini Games. In the top tab, you can switch between the courses on the right of the **Design** column.) |
| 1002 | Invalid ad unit | The spelling may be incorrect or the ad ID of another app may be used. | Visit mp.weixin.qq.com to confirm the ad ID. |
| 1003 | Internal error | This error is not caused by developers. | Ignore the error, and it will be automatically recovered after a period of time. |
| 1004 | No suitable ad | The ad does not appear every time. Maybe it is not appropriate to the user. | This is a normal case. In addition, you need to improve compatibility in this case. |
| 1005 | The ad component is being reviewed. | Your ad is being reviewed and therefore cannot be displayed. | Visit mp.weixin.qq.com to check the review status. In addition, you need to improve compatibility in this case. |
| 1006 | The ad component is rejected. | Your ad failed to pass the review and therefore cannot be displayed. | Visit mp.weixin.qq.com to check the review status. In addition, you need to improve compatibility in this case. |
| 1007 | The ad component is rejected. | Your advertising capability is suspended. ads cannot be displayed during the suspension. | Visit mp.weixin.qq.com to check the Mini Program ad suspension status. |
| 1008 | The ad unit is disabled. | The advertising capability in the advertising space is disabled. | Visit mp.weixin.qq.com to enable the display in the advertising space. |

### BluetoothErrCode

Bluetooth error code

| Error Code | Error Message | Description |
| --- | :---: | --- |
| 0 | `ok` | Normal |
| 10000 | `not init` | The Bluetooth adapter is not initialized |
| 10001 | `not available` | The current Bluetooth adapter is unavailable |
| 10002 | `no device` | The specified device was not found |
| 10003 | `connection fail` | Connection failed |
| 10004 | `no service` | The specified service was not found |
| 10005 | `no characteristic` | The specified characteristic was not found |
| 10006 | `no connection` | The current connection has disconnected |
| 10007 | `property not support` | The current characteristic does not support this operation |
| 10008 | `system error` | All other system errors |
| 10009 | `system not support` | System versions under 4.3 do not support BLE (Android only). |
| 10012 | `operate time out` | Connection timeout |
| 10013 | `invalid_data` | Empty deviceId or invalid format |

### IBeaconErrCode

iBeacon error code

| Error Code | Error Message | Description |
| --- | :---: | --- |
| 0 | `ok` | Normal |
| 11000 | `unsupport` | The system or device is not supported |
| 11001 | `bluetooth service unavailable` | The Bluetooth service is not available |
| 11002 | `location service unavailable` | The location service is not available |
| 11003 | `already start` | Searching has already started |
| 11004 | `not startBeaconDiscovery` | Searching has not already started |
| 11005 | `system error` | All other system errors |
| 11006 | `invalid data` | Incorrect or invalid parameters |

### WifiErrCode

WIFI error code

| Error Code | Error Message | Description |
| --- | :---: | --- |
| 0 | `ok` | Normal |
| 12000 | `not init` | The `startWifi` API should be called first |
| 12001 | `system not support` | The system does not support related capabilities |
| 12002 | `password error Wi-Fi` | Incorrect password |
| 12003 | `connection timeout` | Connection timeout |
| 12004 | `duplicate request` | Repeated Wi-Fi connection |
| 12005 | `wifi not turned on` | Wi-Fi switch is disabled (only for Android) |
| 12006 | `wifi not turned on` | GPS switch is disabled (only for Android) |
| 12007 | `user denied` | Authorization to connect to Wi-Fi was rejected by user |
| 12008 | `invalid SSID` | Invalid SSID |
| 12009 | `system config err` | The connection to the Wi-Fi network was rejected due to system operator configuration |
| 12010 | `system internal error` | Other system errors. Specific error causes need to be printed in errmsg. |
| 12011 | `weapp in background` | The Wi-Fi network cannot be disconnected when the app runs in the background |
| 12013 | `wifi config may be expired` | The Wi-Fi configuration saved in the system expired. It is recommended to forget this Wi-Fi network and try again. |

### NFCErrCode

NFC error code

| Error Code | Error Message | Description |
| --- | :---: | --- |
| 0 | `ok` | Normal |
| 13000 |  | The current device does not support NFC |
| 13001 |  | The current device supports NFC, but the NFC switch is disabled in the system. |
| 13002 |  | The current device supports NFC but does not support HCE. |
| 13003 |  | Invalid parameter format in AID list |
| 13004 |  | WeChat is not set as the default NFC payment app |
| 13005 |  | Invalid return command |
| 13006 |  | Failed to register AID |

### LaunchOptionsApp

启动参数

| Property | Type | Description |
| --- | --- | --- |
| path | `string` | The path for Mini Program startup |
| query | `Record<string, any>` | The query parameter for Mini Program startup |
| referrerInfo | `ReferrerInfo` | The source information. This is returned when a user enters the Mini Program from another Mini Program, Official Account, or app. Otherwise, `{}` is returned. (see the Note below for details.) |
| scene | `number` | The [scene value](https://developers.weixin.qq.com/miniprogram/en/dev/framework/app-service/scene.html) for Mini Program startup |
| shareTicket | `string` | The shareTicket. See [Obtaining More Forwarded Information](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share.html) for details. |

#### ReferrerInfo

| Property | Type | Description |
| --- | --- | --- |
| appId | `string` | The appId of the source Mini Program, Official Account, or app. |
| extraData | `Record<string, any>` | The data transfered from the source Mini Program, supported when scene=1037 or 1038. |
