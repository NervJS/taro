---
title: Taro.startPullDownRefresh(param)
sidebar_label: startPullDownRefresh
---

开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。

使用方式同 [`wx.startPullDownRefresh`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startPullDownRefresh.html)，支持 `Promise` 化使用。

## 参数

### object param

属性|类型|默认值|必填|说明
:-:|:-:|:-:|:-:|:-:
success|function||否|接口调用成功的回调函数
fail|function||否|接口调用失败的回调函数
complete|function||否|接口调用结束的回调函数（调用成功、失败都会执行）

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.startPullDownRefresh(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startPullDownRefresh | ✔️ | ✔️ | ✔️(无动画效果) |

