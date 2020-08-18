---
title: Taro.getImageInfo(OBJECT)
sidebar_label: getImageInfo
---

获取图片信息。网络图片需先配置download域名才能生效。

使用方式同 [`wx.getImageInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getImageInfo.html)，支持 `Promise` 化使用。

## 参数

| Property | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | 图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 返回值

### Promise &lt;object res&gt;

| Name | Type | Description |
| --- | --- | --- |
| res.width | <code>number</code> | 图片原始宽度，单位px。不考虑旋转。 |
| res.height | <code>number</code> | 图片原始高度，单位px。不考虑旋转。 |
| res.path | <code>string</code> | 图片的本地路径 |
| res.orientation | <code>&#x27;up&#x27;</code> / <code>&#x27;up-mirrored&#x27;</code> / <code>&#x27;down&#x27;</code> / <code>&#x27;down-mirrored&#x27;</code> / <code>&#x27;left-mirrored&#x27;</code> / <code>&#x27;right&#x27;</code> / <code>&#x27;right-mirrored&#x27;</code> / <code>&#x27;left&#x27;</code> | 拍照时设备方向（h5平台不支持） |
| res.type | <code>string</code> | 图片格式 |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.getImageInfo(params).then(...)
```

## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.getImageInfo | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

