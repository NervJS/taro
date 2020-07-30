---
title: Taro.setClipboardData(OBJECT)
sidebar_label: setClipBoardData
---

设置系统剪贴板的内容。

使用方式同 [`wx.setClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setClipboardData.html)，支持 `Promise` 化使用。

## 参数

### object param

属性|类型|默认值|必填|说明
:-:|:-:|:-:|:-:|:-:
data|string| |是|剪贴板的内容
success|function| |否|接口调用成功的回调函数
fail|function| |否|接口调用失败的回调函数
complete|function| |否|接口调用结束的回调函数（调用成功、失败都会执行）


## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.setClipBoardData(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setClipBoardData | ✔️ | ✔️(部分实现) | ✔️ |

