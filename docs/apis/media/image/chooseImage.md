---
title: Taro.chooseImage(OBJECT)
sidebar_label: chooseImage
---


使用方式同 [`wx.chooseImage `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseImage.html)，支持 `Promise` 化使用。

注：RN 端该 API 不支持 `count` 属性；不支持相机与相册同时选择，只会取 `sourceType` 数组里的第一个值。默认从相册选取图片。

## 参数

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>Object</code> |  | 参数 |
| [object.sourceType] | <code>Array.&lt;string&gt;</code> | <code>[&#x27;album&#x27;, &#x27;camera&#x27;]</code> | 选择图片的来源（h5端未实现） |
| [object.sizeType] | <code>Array.&lt;string&gt;</code> | <code>[&#x27;original&#x27;, &#x27;compressed&#x27;]</code> | 所选的图片的尺寸（h5端未实现） |
| [object.count] | <code>number</code> | <code>9</code> | 最多可以选择的图片张数 |
| [object.success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [object.fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [object.complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |
| [object.imageId] | <code>string</code> |  | 用来上传的input元素ID（仅h5端） |

## 返回值

### Promise &lt;object res&gt;

| Name | Type | Description |
| --- | --- | --- |
| res.tempFilePaths |	Array.<string> | 图片的本地临时文件路径列表	
| res.tempFiles |	Array.<Object> | 图片的本地临时文件列表

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.chooseImage(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

