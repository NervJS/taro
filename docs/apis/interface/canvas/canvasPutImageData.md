---
title: Taro.canvasPutImageData(param, componentInstance)
sidebar_label: canvasPutImageData
---

将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 &lt;Canvas&gt; 组件。

## 参数

### object param

| Name | Type | Description |
| --- | --- | --- |
| canvasId | <code>String</code> | 画布标识，传入 &lt;Canvas&gt; 组件的 canvasId 属性。 |
| data | <code>Uint8ClampedArray</code> | 图像像素点数据，一维数组，每四项表示一个像素点的 rgba |
| x | <code>Number</code> | 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量） |
| y | <code>Number</code> | 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量） |
| width | <code>Number</code> | 源图像数据矩形区域的宽度 |
| height | <code>Number</code> | 源图像数据矩形区域的高度 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

### Component componentInstance

在自定义组件下，当前组件实例的this，以操作组件内 &lt;Canvas&gt; 组件

## API支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.canvasPutImageData | ✔️ | ✔️ |  |

