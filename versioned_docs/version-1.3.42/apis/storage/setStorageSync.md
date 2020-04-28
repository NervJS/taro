---
title: Taro.setStorageSync(KEY, DATA)
sidebar_label: setStorageSync
---


将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.setStorageSync('key', 'value')
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setStorageSync | ✔️ | ✔️ |  |

