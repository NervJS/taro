---
title: VKSession
sidebar_label: VKSession
---

vision kit 会话对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| state | `keyof State` | 会话状态 |
| config | `Config` | 会话配置 |
| cameraSize | `Size` | 相机尺寸 |

### cancelAnimationFrame

取消由 requestAnimationFrame 添加到计划中的动画帧请求

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.cancelAnimationFrame.html)

```tsx
(requestID: number) => void
```

| 参数 | 类型 |
| --- | --- |
| requestID | `number` |

### destroy

销毁会话

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.destroy.html)

```tsx
() => void
```

### getVKFrame

获取帧对象，每调用一次都会触发一次帧分析过程

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.getVKFrame.html)

```tsx
(width: number, height: number) => VKFrame
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| width | `number` | 宽度 |
| height | `number` | 高度 |

### hitTest

触摸检测，v1 版本只支持单平面（即 hitTest 生成一次平面后，后续 hitTest 均不会再生成平面，而是以之前生成的平面为基础进行检测）。

如果需要重新识别其他平面，可以在调用此方法时将 reset 参数置为 true。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.hitTest.html)

```tsx
(x: number, y: number, reset?: boolean) => hitTestResult[]
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 相对视窗的横坐标，取值范围为 [0, 1]，0 为左边缘，1 为右边缘 |
| y | `number` | 相对视窗的纵坐标，取值范围为 [0, 1]，0 为上边缘，1 为下边缘 |
| reset | `boolean` | 是否需要重新识别其他平面，v2 版本不再需要此参数 |

### off

取消监听会话事件。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.off.html)

```tsx
(eventName: string, fn: Function) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `string` | 事件名称 |
| fn | `Function` | 事件监听函数 |

### on

监听会话事件。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.on.html)

```tsx
(eventName: string, fn: Function) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `string` | 事件名称 |
| fn | `Function` | 事件监听函数 |

### requestAnimationFrame

在下次进行重绘时执行。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.requestAnimationFrame.html)

```tsx
(callback: Function) => number
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Function` | 执行函数 |

### start

开启会话。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.start.html)

```tsx
(callback: (status: keyof StartStatus) => void) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `(status: keyof StartStatus) => void` | 开启会话回调 |

### stop

停止会话。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.stop.html)

```tsx
() => void
```

## 参数

### State

state 的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 不可用 |
| 1 | 运行中 |
| 2 | 暂停中 |

### Config

会话配置

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| version | `keyof version` | 不可用 |
| track | `track` | 运行中 |

### version

vision kit 版本

| 参数 | 说明 |
| --- | --- |
| v1 | 旧版本 |
| v2 | v2 版本，目前只有 iOS 基础库 2.22.0 以上支持 |

### track

跟踪配置

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| plane | `plane` | 平面跟踪配置 |

### plane

平面跟踪配置

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mode | `keyof PlaneMode` | 平面跟踪配置模式 |

### PlaneMode

平面跟踪配置模式合法值

| 参数 | 说明 |
| --- | --- |
| 1 | 检测横向平面 |
| 2 | 检测纵向平面，只有 v2 版本支持 |
| 3 | 检测横向和纵向平面，只有 v2 版本支持 |

### Size

相机尺寸

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| width | `number` | 宽度 |
| height | `number` | 高度 |

### hitTestResult

hitTest 检测结果

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| transform | `Float32Array` | 包含位置、旋转、放缩信息的矩阵，以列为主序 |

### StartStatus

start status 的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 成功 |
| 2000000 | 系统错误 |
| 2000001 | 参数错误 |
| 2000002 | 设备不支持 |
| 2000003 | 系统不支持 |
| 2003000 | 会话不可用 |
| 2003001 | 未开启系统相机权限 |
| 2003002 | 未开启小程序相机权限 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VKSession | ✔️ |  |  |
| VKSession.cancelAnimationFrame | ✔️ |  |  |
| VKSession.destroy | ✔️ |  |  |
| VKSession.getVKFrame | ✔️ |  |  |
| VKSession.hitTest | ✔️ |  |  |
| VKSession.off | ✔️ |  |  |
| VKSession.on | ✔️ |  |  |
| VKSession.requestAnimationFrame | ✔️ |  |  |
| VKSession.start | ✔️ |  |  |
| VKSession.stop | ✔️ |  |  |
