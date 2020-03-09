---
title: Navigator
sidebar_label: Navigator
id: version-1.3.38-navigator
original_id: navigator
---

页面链接

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)

## 类型

```tsx
ComponentType<NavigatorProps>
```

## NavigatorProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| target | "self" or "miniProgram" | `"self"` | 否 | 在哪个目标上发生跳转，默认当前小程序 |
| url | `string` |  | 否 | 当前小程序内的跳转链接 |
| openType | "navigate" or "redirect" or "switchTab" or "reLaunch" or "navigateBack" or "exit" | `"navigate"` | 否 | 跳转方式 |
| delta | `number` |  | 否 | 当 open-type 为 'navigateBack' 时有效，表示回退的层数 |
| appId | `string` |  | 否 | 当 `target="miniProgram"` 时有效，要打开的小程序 appId |
| path | `string` |  | 否 | 当 `target="miniProgram"` 时有效，打开的页面路径，如果为空则打开首页 |
| extraData | `object` |  | 否 | 当 `target="miniProgram"` 时有效，需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch()`，`App.onShow()` 中获取到这份数据. |
| version | "develop" or "trial" or "release" |  | 否 | 当 `target="miniProgram"` 时有效，要打开的小程序版本 |
| hoverClass | `string` | `"navigator-hover"` | 否 | 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果 |
| hoverStopPropagation | `boolean` | `false` | 否 | 指定是否阻止本节点的祖先节点出现点击态 |
| hoverStartTime | `number` | `50` | 否 | 按住后多久出现点击态，单位毫秒 |
| hoverStayTime | `number` | `600` | 否 | 手指松开后点击态保留时间，单位毫秒 |
| onSuccess | `BaseEventOrigFunction<any>` |  | 否 | 当 `target="miniProgram"` 时有效，跳转小程序成功 |
| onFail | `BaseEventOrigFunction<any>` |  | 否 | 当 `target="miniProgram"` 时有效，跳转小程序失败 |
| onComplete | `BaseEventOrigFunction<any>` |  | 否 | 当 `target="miniProgram"` 时有效，跳转小程序完成 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| NavigatorProps.target | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.url | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.openType | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.delta | ✔️ | ✔️ |  | ✔️ |  |  |
| NavigatorProps.appId | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.path | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.extraData | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.version | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.hoverClass | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.hoverStopPropagation | ✔️ | ✔️ |  | ✔️ |  |  |
| NavigatorProps.hoverStartTime | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.hoverStayTime | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| NavigatorProps.onSuccess | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.onFail | ✔️ | ✔️ |  |  |  |  |
| NavigatorProps.onComplete | ✔️ | ✔️ |  |  |  |  |

### target

target 的合法值

| 参数 | 说明 |
| --- | --- |
| self | 当前小程序 |
| miniProgram | 其它小程序 |

### openType

open-type 的合法值

| 参数 | 说明 |
| --- | --- |
| navigate | 对应 Taro.navigateTo 或 Taro.navigateToMiniProgram 的功能 |
| redirect | 对应 Taro.redirectTo 的功能 |
| switchTab | 对应 Taro.switchTab 的功能 |
| reLaunch | 对应 Taro.reLaunch 的功能 |
| navigateBack | 对应 Taro.navigateBack 的功能 |
| exit | 退出小程序，`target="miniProgram"` 时生效 |

### version

version 的合法值

| 参数 | 说明 |
| --- | --- |
| develop | 开发版 |
| trial | 体验版 |
| release | 正式版，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是正式版，则打开的小程序必定是正式版。 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Navigator | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
