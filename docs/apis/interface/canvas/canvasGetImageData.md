---
title: Taro.canvasGetImageData(param, componentInstance)
sidebar_label: canvasGetImageData
---

获取 canvas 区域隐含的像素数据。

## 参数

### object param

| Name | Type | Description |
| --- | --- | --- |
| canvasId | <code>String</code> | 画布标识，传入 &lt;Canvas&gt; 组件的 canvasId 属性。 |
| x | <code>Number</code> | 将要被提取的图像数据矩形区域的左上角横坐标 |
| y | <code>Number</code> | 将要被提取的图像数据矩形区域的左上角纵坐标 |
| width | <code>Number</code> | 将要被提取的图像数据矩形区域的宽度 |
| height | <code>Number</code> | 将要被提取的图像数据矩形区域的高度 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

### Component componentInstance

在自定义组件下，当前组件实例的this，以操作组件内的 &lt;Canvas&gt; 组件。

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.canvasGetImageData | ✔️ | ✔️ |  |

