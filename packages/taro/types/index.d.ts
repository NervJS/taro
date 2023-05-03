/**
 * Taro 类型定义文件
 *
 * 目录结构
 * ├── api                                  小程序端能力 API
 * │   ├── ad
 * │   │   └── index.d.ts                   广告 API
 * │   ├── alipay
 * │   │   └── index.d.ts                   支付宝小程序 API
 * │   ├── base
 * │   │   ├── index.d.ts                   基础 API
 * │   │   ├── debug.d.ts                   基础 -> 调试 API
 * │   │   ├── system.d.ts                  基础 -> 系统 API
 * │   │   ├── update.d.ts                  基础 -> 更新 API
 * │   │   ├── weapp                        基础 -> 小程序 API
 * │   │   │   ├── life-cycle.d.ts          基础 -> 小程序 API -> 生命周期
 * │   │   │   └── app-event.d.ts           基础 -> 小程序 API -> 应用级事件
 * │   │   └── env.d.ts                     基础 -> ENV
 * │   ├── canvas
 * │   │   └── index.d.ts                   画布 API
 * │   ├── cloud
 * │   │   └── index.d.ts                   微信小程序云开发 API
 * │   ├── device
 * │   │   ├── accelerometer.d.ts           设备 -> 加速计 API
 * │   │   ├── battery.d.ts                 设备 -> 电量 API
 * │   │   ├── ble.d.ts                     设备 -> 低功耗蓝牙 API
 * │   │   ├── bluetooth.d.                 设备 -> 蓝牙 API
 * │   │   ├── clipboard.d.ts               设备 -> 剪贴板 API
 * │   │   ├── compass.d.ts                 设备 -> 罗盘 API
 * │   │   ├── contact.d.ts                 设备 -> 联系人 API
 * │   │   ├── motion.d.ts                  设备 -> 设备方向 API
 * │   │   ├── gyroscope.d.ts               设备 -> 陀螺仪 API
 * │   │   ├── iBeacon.d.ts                 设备 -> iBeacon API
 * │   │   ├── network.d.ts                 设备 -> 网络 API
 * │   │   ├── nfc.d.ts                     设备 -> NFC API
 * │   │   ├── performance.d.ts             设备 -> 性能 API
 * │   │   ├── phone.d.ts                   设备 -> 电话 API
 * │   │   ├── scan.d.ts                    设备 -> 扫码 API
 * │   │   ├── screen.d.ts                  设备 -> 屏幕 API
 * │   │   ├── vibrate.d.ts                 设备 -> 振动 API
 * │   │   └── wifi.d.ts                    设备 -> Wi-Fi API
 * │   ├── ext
 * │   │   └── index.d.ts                   第三方平台 API
 * │   ├── files
 * │   │   └── index.d.ts                   文件 API
 * │   ├── framework
 * │   │   └── index.d.ts                   小程序框架 API
 * │   ├── location
 * │   │   └── index.d.ts                   位置 API
 * │   ├── media
 * │   │   ├── audio.d.ts                   媒体 -> 音频 API
 * │   │   ├── background-audio.d.ts        媒体 -> 背景音频 API
 * │   │   ├── camera.d.ts                  媒体 -> 相机 API
 * │   │   ├── editor.d.ts                  媒体 -> 富文本 API
 * │   │   ├── image.d.ts                   媒体 -> 图片 API
 * │   │   ├── live.d.ts                    媒体 -> 实时音视频 API
 * │   │   ├── map.d.ts                     媒体 -> 地图 API
 * │   │   ├── recorder.d.ts                媒体 -> 录音 API
 * │   │   ├── video.d.ts                   媒体 -> 视频 API
 * │   │   └── video-processing.d.ts        媒体 -> 音视频合成 API
 * │   ├── network
 * │   │   ├── download.d.ts                网络 -> 下载 API
 * │   │   ├── mdns.d.ts                    网络 -> mDNS API
 * │   │   ├── request.d.ts                 网络 -> 发起请求 API
 * │   │   ├── udp.d.ts                     网络 -> UDP 通信 API
 * │   │   ├── upload.d.ts                  网络 -> 上传 API
 * │   │   └── websocket.d.ts               网络 -> WebSocket API
 * │   ├── open-api
 * │   │   ├── account.d.ts                 开放接口 -> 账号信息 API
 * │   │   ├── address.d.ts                 开放接口 -> 收货地址 API
 * │   │   ├── authorize.d.ts               开放接口 -> 授权 API
 * │   │   ├── card.d.ts                    开放接口 -> 卡券 API
 * │   │   ├── data-analysis.d.ts           开放接口 -> 数据分析 API
 * │   │   ├── facial.d.ts                  开放接口 -> 人脸识别 API // 在微信小程序文档已找不到
 * │   │   ├── invoice.d.ts                 开放接口 -> 发票 API
 * │   │   ├── login.d.ts                   开放接口 -> 登录 API
 * │   │   ├── navigate.d.ts                开放接口 -> 小程序跳转 API
 * │   │   ├── payment.d.ts                 开放接口 -> 支付 API
 * │   │   ├── report.d.ts                  开放接口 -> 数据上报 API
 * │   │   ├── settings.d.ts                开放接口 -> 设置 API
 * │   │   ├── soter.d.ts                   开放接口 -> 生物认证 API
 * |   |   ├── subscribe-message.d.ts       开放接口 -> 订阅消息 API
 * │   │   ├── user-info.d.ts               开放接口 -> 用户信息 API
 * │   │   ├── customer-service.d.ts        开放接口 -> 微信客服 API
 * │   │   └── werun.d.ts                   开放接口 -> 微信运动 API
 * │   ├── route
 * │   │   └── index.d.ts                   路由 API
 * │   ├── share
 * │   │   └── index.d.ts                   转发 API
 * │   ├── storage
 * │   │   ├── background-fetch.d.ts        数据缓存 -> 后台获取 API
 * │   │   └── index.d.ts                   数据缓存 API
 * │   ├── swan
 * │   │   └── index.d.ts                   百度小程序 API
 * │   ├── ui
 * │   │   ├── animation.d.ts               界面 -> 动画 API
 * │   │   ├── background.d.ts              界面 -> 背景 API
 * │   │   ├── custom-component.d.ts        界面 -> 自定义组件 API
 * │   │   ├── fonts.d.ts                   界面 -> 字体 API
 * │   │   ├── keyboard.d.ts                界面 -> 键盘 API
 * │   │   ├── menu.d.ts                    界面 -> 菜单 API
 * │   │   ├── navigation-bar.d.ts          界面 -> 导航栏 API
 * │   │   ├── pull-down-refresh.d.ts       界面 -> 下拉刷新 API
 * │   │   ├── scroll.d.ts                  界面 -> 滚动 API
 * │   │   ├── sticky.d.ts                  界面 -> 置顶 API
 * │   │   ├── tab-bar.d.ts                 界面 -> TabBar API
 * │   │   ├── window.d.ts                  界面 -> 窗口 API
 * │   │   └── interaction.d.ts             界面 -> 交互 API
 * │   ├── worker
 * │   │   └── index.d.ts                   Worker API
 * │   ├── wxml
 * │   │   └── index.d.ts                   WXML API
 * │   ├── taro.extend.d.ts                 Taro 扩展 API 类型定义
 * │   └── taro.hooks.d.ts                  Taro Hooks 类型定义
 * ├── index.d.ts                           此文件
 * ├── taro.component.d.ts                  Taro Component 类型定义
 * ├── taro.config.d.ts                      Taro 小程序 App 与 Window 设置类型定义
 * └── taro.lifecycle.d.ts                  Taro 生命周期类型定义
 */

/// <reference path="global.d.ts" />

/// <reference path="taro.api.d.ts" />
/// <reference path="taro.component.d.ts" />
/// <reference path="taro.config.d.ts" />
/// <reference path="taro.lifecycle.d.ts" />

/// <reference types="@tarojs/plugin-platform-alipay/types/shims-alipay" />
/// <reference types="@tarojs/plugin-platform-jd/types/shims-jd" />
/// <reference types="@tarojs/plugin-platform-swan/types/shims-swan" />
/// <reference types="@tarojs/plugin-platform-tt/types/shims-tt" />
/// <reference types="@tarojs/plugin-platform-weapp/types/shims-weapp" />

export = Taro
export as namespace Taro

declare const Taro: Taro.TaroStatic

declare namespace Taro {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TaroStatic {}
}
declare global {
  const defineAppConfig: (config: Taro.Config) => Taro.Config
  const definePageConfig: (config: Taro.Config) => Taro.Config
}
