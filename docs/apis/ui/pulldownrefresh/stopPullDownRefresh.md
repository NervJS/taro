---
title: Taro.stopPullDownRefresh()
sidebar_label: stopPullDownRefresh
---


停止当前页面下拉刷新。

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

Taro.stopPullDownRefresh()
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.stopPullDownRefresh | ✔️ | ✔️ |  ✔️  |

