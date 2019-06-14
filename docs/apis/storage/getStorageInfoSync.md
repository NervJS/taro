---
title: Taro.getStorageInfoSync()
sidebar_label: getStorageInfoSync
---


同步获取当前 storage 的相关信息。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

const res = Taro.getStorageInfoSync()
console.log(res.keys)
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getStorageInfoSync | ✔️ | ✔️ |  |

