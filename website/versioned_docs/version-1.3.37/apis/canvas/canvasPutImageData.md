---
title: Taro.canvasPutImageData(option, component)
sidebar_label: canvasPutImageData
id: version-1.3.37-canvasPutImageData
original_id: canvasPutImageData
---

将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasPutImageData.html)

## 类型

```tsx
(option: Option, component?: Record<string, any>) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| canvasId | `string` | 是 | 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件的 canvas-id 属性。 |
| data | `Uint8ClampedArray` | 是 | 图像像素点数据，一维数组，每四项表示一个像素点的 rgba |
| height | `number` | 是 | 源图像数据矩形区域的高度 |
| width | `number` | 是 | 源图像数据矩形区域的宽度 |
| x | `number` | 是 | 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量） |
| y | `number` | 是 | 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量） |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
const data = new Uint8ClampedArray([255, 0, 0, 1])
Taro.canvasPutImageData({
  canvasId: 'myCanvas',
  x: 0,
  y: 0,
  width: 1,
  data: data,
  success: function (res) {}
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasPutImageData | ✔️ | ✔️ |  |
