---
title: 数据缓存
sidebar_label: 数据缓存
---

## Taro.setStorage(OBJECT)

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setStorage({ key: 'key', data: 'value' })
  .then(res => console.log(res))
```

## Taro.setStorageSync(KEY, DATA)

将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setStorageSync('key', 'value')
```

## Taro.getStorage(OBJECT)

从本地缓存中异步获取指定 key 对应的内容，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | String | key 对应的内容 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getStorage({ key: 'key' })
  .then(res => console.log(res.data))
```

## Taro.getStorageSync(KEY)

从本地缓存中同步获取指定 key 对应的内容。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const data = Taro.getStorageSync('key')
```

## Taro.getStorageInfo(OBJECT)

异步获取当前 storage 的相关信息，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，详见返回参数说明 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| keys | String Array | 当前 storage 中所有的 key |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getStorageInfo()
  .then(res => console.log(res.keys))
```

## Taro.getStorageInfoSync()

同步获取当前 storage 的相关信息。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const res = Taro.getStorageInfoSync()
console.log(res.keys)
```

## Taro.removeStorage(OBJECT)

从本地缓存中异步移除指定 key，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| keys | String | 是 | 本地缓存中的指定的 key |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.removeStorage({ key: 'key' })
  .then(res => console.log(res))
```

## Taro.removeStorageSync(KEY)

从本地缓存中同步移除指定 key 。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.removeStorageSync('key')
```

## Taro.clearStorage()

清理本地数据缓存。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.clearStorage()
```

## Taro.clearStorageSync()

同步清理本地数据缓存

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.clearStorageSync()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setStorage | ✔️ | ✔️ | ✔️ |
| Taro.setStorageSync | ✔️ | ✔️ |  |
| Taro.getStorage | ✔️ | ✔️ | ✔️ |
| Taro.getStorageSync | ✔️ | ✔️ |  |
| Taro.getStorageInfo | ✔️ | ✔️ | ✔️ |
| Taro.getStorageInfoSync | ✔️ | ✔️ |  |
| Taro.removeStorage | ✔️ | ✔️ | ✔️ |
| Taro.removeStorageSync | ✔️ | ✔️ |  |
| Taro.clearStorage | ✔️ | ✔️ | ✔️ |
| Taro.clearStorageSync | ✔️ | ✔️ |  |
