---
title: Taro.canvasToTempFilePath(option, component)
sidebar_label: canvasToTempFilePath
---

把当前画布指定区域的内容导出生成指定大小的图片。在 `draw()` 回调里调用该方法才能保证图片导出成功。

**Bug & Tip：**

1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html)

## 类型

```tsx
(option: Option, component?: TaroGeneral.IAnyObject) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| option | `Option` |  |
| component | `TaroGeneral.IAnyObject` | 在自定义组件下，当前组件实例的this，以操作组件内 [canvas](/docs/components/canvas/canvas) 组件 |

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| canvas | `CanvasProps` |  | 否 | 画布标识，传入 [canvas](/docs/components/canvas/canvas) 组件实例 （canvas type="2d" 时使用该属性）。 |
| canvasId | `string` |  | 否 | 画布标识，传入 [canvas](/docs/components/canvas/canvas) 组件的 canvas-id |
| quality | `number` |  | 否 | 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 |
| complete | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| destHeight | `number` |  | 否 | 输出的图片的高度 |
| destWidth | `number` |  | 否 | 输出的图片的宽度 |
| fail | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| fileType | `keyof FileType` | `"png"` | 否 | 目标文件的类型 |
| height | `number` |  | 否 | 指定的画布区域的高度 |
| success | `(result: SuccessCallbackResult) => void` |  | 否 | 接口调用成功的回调函数 |
| width | `number` |  | 否 | 指定的画布区域的宽度 |
| x | `number` |  | 否 | 指定的画布区域的左上角横坐标 |
| y | `number` |  | 否 | 指定的画布区域的左上角纵坐标 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 生成文件的临时路径 |
| errMsg | `string` | 调用结果 |

### FileType

| 参数 | 说明 |
| --- | --- |
| jpg | jpg 图片 |
| png | png 图片 |

### CanvasProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| type | `string` |  | 否 | 指定 canvas 类型，支持 2d 和 webgl |
| canvasId | `string` |  | 否 | canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性 |
| disableScroll | `boolean` | `false` | 否 | 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新 |
| onTouchStart | `TaroGeneral.CommonEventFunction` |  | 否 | 手指触摸动作开始 |
| onTouchMove | `TaroGeneral.CommonEventFunction` |  | 否 | 手指触摸后移动 |
| onTouchEnd | `TaroGeneral.CommonEventFunction` |  | 否 | 手指触摸动作结束 |
| onTouchCancel | `TaroGeneral.CommonEventFunction` |  | 否 | 手指触摸动作被打断，如来电提醒，弹窗 |
| onLongTap | `TaroGeneral.CommonEventFunction` |  | 否 | 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动 |
| onError | `TaroGeneral.CommonEventFunction<onErrorEventDetail>` |  | 否 | 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'} |

#### onErrorEventDetail

| 参数 | 类型 |
| --- | --- |
| errMsg | `string` |

## 示例代码

```tsx
Taro.canvasToTempFilePath({
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  destWidth: 100,
  destHeight: 100,
  canvasId: 'myCanvas',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```
