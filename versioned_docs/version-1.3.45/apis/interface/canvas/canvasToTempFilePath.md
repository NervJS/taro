---
title: Taro.canvasToTempFilePath(param, componentInstance)
sidebar_label: canvasToTempFilePath
---

把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。

## 参数

### object param

| Name | Type | Description |
| --- | --- | --- |
| [x] | <code>Number</code> | 指定的画布区域的左上角横坐标，默认值 0 |
| [y] | <code>Number</code> | 指定的画布区域的左上角纵坐标，默认值 0 |
| [width] | <code>Number</code> | 指定的画布区域的宽度，默认值 canvas宽度-x |
| [height] | <code>Number</code> | 指定的画布区域的高度，默认值 canvas宽度-y |
| [destWidth] | <code>Number</code> | 输出的图片的宽度，默认值 width*屏幕像素密度 |
| [destHeight] | <code>Number</code> | 输出的图片的高度，默认值 height*屏幕像素密度 |
| canvasId | <code>String</code> | 画布标识，传入 &lt;Canvas&gt; 组件的 canvasId |
| [fileType] | <code>String</code> | 目标文件的类型，默认值 png |
| quality | <code>Number</code> | 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

### Component componentInstance

在自定义组件下，当前组件实例的this，以操作组件内 &lt;Canvas&gt; 组件

## API支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.canvasToTempFilePath | ✔️ | ✔️ |  |

