---
title: Taro.previewImage(param)
sidebar_label: previewImage
---

在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。

使用方式同 [`wx.previewImage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.previewImage.html)，支持 `Promise` 化使用。

## 参数

### object param

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| urls | <code>Array.&lt;string&gt;</code> |  | 需要预览的图片链接列表。 |
| [current] | <code>string</code> | <code>&quot;urls[0]&quot;</code> | urls的第一张 当前显示图片的链接 |
| [success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |


## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.previewImage(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.previewImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

