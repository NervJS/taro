---
title: Taro.showLoading(OBJECT)
sidebar_label: showLoading
---


显示 Loading 提示框, 需主动调用 Taro.hideLoading 才能关闭提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.showLoading({
  title: 'loading'
})
  .then(res => console.log(res))
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |

