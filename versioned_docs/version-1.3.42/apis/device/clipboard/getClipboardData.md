---
title: Taro.getClipboardData(param)
sidebar_label: getClipBoardData
---

获取系统剪贴板的内容。

使用方式同 [`wx.getClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getClipboardData.html)，支持 `Promise` 化使用。

## 参数

### object param

属性|类型|默认值|必填|说明
:-:|:-:|:-:|:-:|:-:
success|function| |否|接口调用成功的回调函数
fail|function| |否|接口调用失败的回调函数
complete|function| |否|接口调用结束的回调函数（调用成功、失败都会执行）

#### success(res)

**object res**

属性|类型|说明
:-:|:-:|:-:
data|string|剪贴板的内容

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.getClipBoardData(params).then(...)
```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getClipBboardData | ✔️ | ✔️(部分实现) | ✔️ |

