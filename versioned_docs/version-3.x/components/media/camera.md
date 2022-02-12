---
title: Camera
sidebar_label: Camera
---

系统相机

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)

## 类型

```tsx
ComponentType<CameraProps>
```

## CameraProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | `keyof Mode` | `"normal"` | 否 | 模式，有效值为normal, scanCode |
| resolution | `keyof Resolution` | `"medium"` | 否 | 分辨率，不支持动态修改 |
| devicePosition | `keyof DevicePosition` | `"back"` | 否 | 摄像头朝向 |
| flash | `keyof Flash` | `"auto"` | 否 | 闪光灯 |
| frameSize | `keyof FrameSize` | `"medium"` | 否 | 指定期望的相机帧数据尺寸 |
| scanArea | `number[]` |  | 否 | 扫码识别区域，格式为[x, y, w, h]，<br />x,y是相对于camera显示区域的左上角，<br />w,h为区域宽度，单位px，仅在 mode="scanCode" 时生效 |
| onStop | `CommonEventFunction` |  | 否 | 摄像头在非正常终止时触发，<br />如退出后台等情况 |
| onError | `CommonEventFunction` |  | 否 | 用户不允许使用摄像头时触发 |
| onInitDone | `CommonEventFunction<onInitDoneEventDetail>` |  | 否 | 相机初始化完成时触发 |
| onScanCode | `CommonEventFunction` |  | 否 | 在成功识别到一维码时触发，<br />仅在 mode="scanCode" 时生效 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CameraProps.mode | ✔️ |  | ✔️ |
| CameraProps.resolution | ✔️ |  |  |
| CameraProps.devicePosition | ✔️ |  | ✔️ |
| CameraProps.flash | ✔️ |  | ✔️ |
| CameraProps.frameSize | ✔️ |  |  |
| CameraProps.scanArea | ✔️ |  |  |
| CameraProps.onStop | ✔️ |  | ✔️ |
| CameraProps.onError | ✔️ |  | ✔️ |
| CameraProps.onInitDone | ✔️ |  | ✔️ |
| CameraProps.onScanCode | ✔️ |  | ✔️ |

### Mode

mode 的合法值

| 参数 | 说明 |
| --- | --- |
| normal | 相机模式 |
| scanCode | 扫码模式 |

### Resolution

resolution 的合法值

| 参数 | 说明 |
| --- | --- |
| low | 低 |
| medium | 中 |
| high | 高 |

### DevicePosition

device-position 的合法值

| 参数 | 说明 |
| --- | --- |
| front | 前置 |
| back | 后置 |

### Flash

flash 的合法值

| 参数 | 说明 |
| --- | --- |
| auto | 自动 |
| on | 打开 |
| off | 关闭 |
| torch | 常亮 |

### FrameSize

frame-size 的合法值

| 参数 | 说明 |
| --- | --- |
| small | 小尺寸帧数据 |
| medium | 中尺寸帧数据 |
| large | 大尺寸帧数据 |

### onInitDoneEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| maxZoom | `number` | 最大变焦 |
