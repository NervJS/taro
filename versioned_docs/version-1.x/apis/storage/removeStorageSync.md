---
title: Taro.removeStorageSync(KEY)
sidebar_label: removeStorageSync
---


从本地缓存中同步移除指定 key 。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.removeStorageSync('key')
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.removeStorageSync | ✔️ | ✔️ |  |

