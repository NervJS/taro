---
title: Taro.getCurrentPages(OBJECT)
sidebar_label: getCurrentPages
---


使用方式同 [`getCurrentPages`](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html#getcurrentpages)， 获取当前的页面栈，决定需要返回几层。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.getCurrentPages().length
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getCurrentPages | ✔️ |   | ✔️|

