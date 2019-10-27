/**
 * Taro 类型定义文件
 * 
 * 目录结构
 * ├── api                                  小程序端能力 API
 * │   ├── advertisement
 * │   │   └── advertisement.d.ts           广告 API
 * │   ├── alipay
 * │   │   └── alipay.d.ts                  支付宝小程序 API
 * │   ├── base
 * │   │   ├── base.d.ts                    基础 API
 * │   │   ├── base.debug.d.ts              基础 -> 调试 API
 * │   │   ├── base.system.d.ts             基础 -> 系统 API
 * │   │   ├── base.update.d.ts             基础 -> 更新 API
 * │   │   └── base.weapp.d.ts              基础 -> 小程序 API
 * │   ├── canvas
 * │   │   └── canvas.d.ts                  画布 API
 * │   ├── cloud
 * │   │   └── cloud.d.ts                   微信小程序云开发 API
 * │   ├── device
 * │   │   ├── device.accelerometer.d.ts    设备 -> 加速计 API
 * │   │   ├── device.battery.d.ts          设备 -> 电量 API
 * │   │   ├── device.ble.d.ts              设备 -> 低功耗蓝牙 API
 * │   │   ├── device.bluetooth.d.          设备 -> 蓝牙 API
 * │   │   ├── device.clipboard.d.ts        设备 -> 剪贴板 API
 * │   │   ├── device.compass.d.ts          设备 -> 罗盘 API
 * │   │   ├── device.contact.d.ts          设备 -> 联系人 API
 * │   │   ├── device.gyroscope.d.ts        设备 -> 陀螺仪 API
 * │   │   ├── device.iBeacon.d.ts          设备 -> iBeacon API
 * │   │   ├── device.motion.d.ts           设备 -> 设备方向 API
 * │   │   ├── device.network.d.ts          设备 -> 网络 API
 * │   │   ├── device.nfc.d.ts              设备 -> NFC API
 * │   │   ├── device.performance.d.ts      设备 -> 性能 API
 * │   │   ├── device.phone.d.ts            设备 -> 电话 API
 * │   │   ├── device.scan.d.ts             设备 -> 扫码 API
 * │   │   ├── device.screen.d.ts           设备 -> 屏幕 API
 * │   │   ├── device.vibrate.d.ts          设备 -> 振动 API
 * │   │   └── device.wifi.d.ts             设备 -> Wi-Fi API
 * │   ├── ext
 * │   │   └── ext.d.ts                     第三方平台 API
 * │   ├── files
 * │   │   └── files.d.ts                   文件 API
 * │   ├── framework
 * │   │   └── framework.d.ts               小程序框架 API
 * │   ├── location
 * │   │   └── location.d.ts                位置 API
 * │   ├── media
 * │   │   ├── media.audio.d.ts             媒体 -> 音频 API
 * │   │   ├── media.backgroundAudio.d.ts   媒体 -> 背景音频 API
 * │   │   ├── media.camera.d.ts            媒体 -> 相机 API
 * │   │   ├── media.editor.d.ts            媒体 -> 富文本 API
 * │   │   ├── media.image.d.ts             媒体 -> 图片 API
 * │   │   ├── media.live.d.ts              媒体 -> 实时音视频 API
 * │   │   ├── media.map.d.ts               媒体 -> 地图 API
 * │   │   ├── media.recorder.d.ts          媒体 -> 录音 API
 * │   │   └── media.video.d.ts             媒体 -> 视频 API
 * │   ├── network
 * │   │   ├── network.download.d.ts        网络 -> 下载 API
 * │   │   ├── network.mDNS.d.ts            网络 -> mDNS API
 * │   │   ├── network.request.d.ts         网络 -> 发起请求 API
 * │   │   ├── network.udp.d.ts             网络 -> UDP 通信 API
 * │   │   ├── network.upload.d.ts          网络 -> 上传 API
 * │   │   └── network.webSocket.d.ts       网络 -> WebSocket API
 * │   ├── openAPI
 * │   │   ├── openAPI.account.d.ts         开放接口 -> 账号信息 API
 * │   │   ├── openAPI.address.d.ts         开放接口 -> 收货地址 API
 * │   │   ├── openAPI.authorize.d.ts       开放接口 -> 授权 API
 * │   │   ├── openAPI.card.d.ts            开放接口 -> 卡券 API
 * │   │   ├── openAPI.dataAnalysis.d.ts    开放接口 -> 数据分析 API
 * │   │   ├── openAPI.facial.d.ts          开放接口 -> 人脸识别 API // 在微信小程序文档已找不到
 * │   │   ├── openAPI.invoice.d.ts         开放接口 -> 发票 API
 * │   │   ├── openAPI.login.d.ts           开放接口 -> 登录 API
 * │   │   ├── openAPI.navigate.d.ts        开放接口 -> 小程序跳转 API
 * │   │   ├── openAPI.payment.d.ts         开放接口 -> 支付 API
 * │   │   ├── openAPI.report.d.ts          开放接口 -> 数据上报 API
 * │   │   ├── openAPI.settings.d.ts        开放接口 -> 设置 API
 * │   │   ├── openAPI.soter.d.ts           开放接口 -> 生物认证 API
 * |   |   ├── openAPI.subscribeMessage.d.ts开放接口 -> 订阅消息 API
 * │   │   ├── openAPI.userInfo.d.ts        开放接口 -> 用户信息 API
 * │   │   └── openAPI.weRun.d.ts           开放接口 -> 微信运动 API
 * │   ├── router
 * │   │   └── router.d.ts                  路由 API
 * │   ├── share
 * │   │   └── share.d.ts                   转发 API
 * │   ├── storage
 * │   │   ├── storage.backgroundFetch.d.ts 数据缓存 -> 后台获取 API
 * │   │   └── storage.d.ts                 数据缓存 API
 * │   ├── swan
 * │   │   └── swan.d.ts                    百度小程序 API
 * │   ├── ui
 * │   │   ├── ui.animation.d.ts            界面 -> 动画 API
 * │   │   ├── ui.background.d.ts           界面 -> 背景 API
 * │   │   ├── ui.customComponent.d.ts      界面 -> 自定义组件 API
 * │   │   ├── ui.fonts.d.ts                界面 -> 字体 API
 * │   │   ├── ui.keyboard.d.ts             界面 -> 键盘 API
 * │   │   ├── ui.menu.d.ts                 界面 -> 菜单 API
 * │   │   ├── ui.navigationBar.d.ts        界面 -> 导航栏 API
 * │   │   ├── ui.pullDownRefresh.d.ts      界面 -> 下拉刷新 API
 * │   │   ├── ui.scroll.d.ts               界面 -> 滚动 API
 * │   │   ├── ui.sticky.d.ts               界面 -> 置顶 API
 * │   │   ├── ui.tabBar.d.ts               界面 -> TabBar API
 * │   │   ├── ui.window.d.ts               界面 -> 窗口 API
 * │   │   └── ul.interaction.d.ts          界面 -> 交互 API
 * │   ├── worker
 * │   │   └── worker.d.ts                  Worker API
 * │   └── wxml
 * │       └── wxml.d.ts                    WXML API
 * ├── index.d.ts                           此文件
 * ├── taro.component.d.ts                  Taro Component 类型定义
 * ├── taro.config.d.ts                     Taro 小程序 App 与 Window 设置类型定义
 * ├── taro.extend.d.ts                     Taro 扩展 API 类型定义
 * ├── taro.hooks.d.ts                      Taro Hooks 类型定义
 * └── taro.lifecycle.d.ts                  Taro 生命周期类型定义
 */

/// <reference path="taro.lifecycle.d.ts" />
/// <reference path="taro.component.d.ts" />
/// <reference path="taro.hooks.d.ts" />
/// <reference path="taro.config.d.ts" />
/// <reference path="taro.extend.d.ts" />

/**
 *
 * 微信端能力
 * original code from: https://github.com/wx-minapp/minapp-wx/blob/master/typing/wx.d.ts
 * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
 * thanks for the great work by @qiu8310 👍👍👍
 *
 */
/// <reference path="api/advertisement/advertisement.d.ts" />
/// <reference path="api/base/base.d.ts" />
/// <reference path="api/base/base.debug.d.ts" />
/// <reference path="api/base/base.system.d.ts" />
/// <reference path="api/base/base.update.d.ts" />
/// <reference path="api/base/base.weapp.d.ts" />
/// <reference path="api/canvas/canvas.d.ts" />
/// <reference path="api/cloud/cloud.d.ts" />
/// <reference path="api/device/device.accelerometer.d.ts" />
/// <reference path="api/device/device.battery.d.ts" />
/// <reference path="api/device/device.ble.d.ts" />
/// <reference path="api/device/device.bluetooth.d.ts" />
/// <reference path="api/device/device.clipboard.d.ts" />
/// <reference path="api/device/device.compass.d.ts" />
/// <reference path="api/device/device.contact.d.ts" />
/// <reference path="api/device/device.gyroscope.d.ts" />
/// <reference path="api/device/device.iBeacon.d.ts" />
/// <reference path="api/device/device.motion.d.ts" />
/// <reference path="api/device/device.network.d.ts" />
/// <reference path="api/device/device.nfc.d.ts" />
/// <reference path="api/device/device.performance.d.ts" />
/// <reference path="api/device/device.phone.d.ts" />
/// <reference path="api/device/device.scan.d.ts" />
/// <reference path="api/device/device.screen.d.ts" />
/// <reference path="api/device/device.vibrate.d.ts" />
/// <reference path="api/device/device.wifi.d.ts" />
/// <reference path="api/ext/ext.d.ts" />
/// <reference path="api/files/files.d.ts" />
/// <reference path="api/framework/framework.d.ts" />
/// <reference path="api/location/location.d.ts" />
/// <reference path="api/media/media.audio.d.ts" />
/// <reference path="api/media/media.backgroundAudio.d.ts" />
/// <reference path="api/media/media.camera.d.ts" />
/// <reference path="api/media/media.editor.d.ts" />
/// <reference path="api/media/media.image.d.ts" />
/// <reference path="api/media/media.live.d.ts" />
/// <reference path="api/media/media.map.d.ts" />
/// <reference path="api/media/media.recorder.d.ts" />
/// <reference path="api/media/media.video.d.ts" />
/// <reference path="api/network/network.download.d.ts" />
/// <reference path="api/network/network.mDNS.d.ts" />
/// <reference path="api/network/network.request.d.ts" />
/// <reference path="api/network/network.udp.d.ts" />
/// <reference path="api/network/network.upload.d.ts" />
/// <reference path="api/network/network.webSocket.d.ts" />
/// <reference path="api/openAPI/openAPI.account.d.ts" />
/// <reference path="api/openAPI/openAPI.address.d.ts" />
/// <reference path="api/openAPI/openAPI.authorize.d.ts" />
/// <reference path="api/openAPI/openAPI.card.d.ts" />
/// <reference path="api/openAPI/openAPI.dataAnalysis.d.ts" />
/// <reference path="api/openAPI/openAPI.facial.d.ts" />
/// <reference path="api/openAPI/openAPI.invoice.d.ts" />
/// <reference path="api/openAPI/openAPI.login.d.ts" />
/// <reference path="api/openAPI/openAPI.navigate.d.ts" />
/// <reference path="api/openAPI/openAPI.payment.d.ts" />
/// <reference path="api/openAPI/openAPI.report.d.ts" />
/// <reference path="api/openAPI/openAPI.settings.d.ts" />
/// <reference path="api/openAPI/openAPI.soter.d.ts" />
/// <reference path="api/openAPI/openAPI.subscribeMessage.d.ts" />
/// <reference path="api/openAPI/openAPI.userInfo.d.ts" />
/// <reference path="api/openAPI/openAPI.weRun.d.ts" />
/// <reference path="api/router/router.d.ts" />
/// <reference path="api/share/share.d.ts" />
/// <reference path="api/storage/storage.backgroundFetch.d.ts" />
/// <reference path="api/storage/storage.d.ts" />
/// <reference path="api/ui/ui.animation.d.ts" />
/// <reference path="api/ui/ui.background.d.ts" />
/// <reference path="api/ui/ui.customComponent.d.ts" />
/// <reference path="api/ui/ui.fonts.d.ts" />
/// <reference path="api/ui/ui.keyboard.d.ts" />
/// <reference path="api/ui/ui.menu.d.ts" />
/// <reference path="api/ui/ui.navigationBar.d.ts" />
/// <reference path="api/ui/ui.pullDownRefresh.d.ts" />
/// <reference path="api/ui/ui.scroll.d.ts" />
/// <reference path="api/ui/ui.sticky.d.ts" />
/// <reference path="api/ui/ui.tabBar.d.ts" />
/// <reference path="api/ui/ui.window.d.ts" />
/// <reference path="api/ui/ul.interaction.d.ts" />
/// <reference path="api/worker/worker.d.ts" />
/// <reference path="api/wxml/wxml.d.ts" />

/// <reference path="api/alipay/alipay.d.ts" />
/// <reference path="api/swan/swan.d.ts" />

export = Taro
