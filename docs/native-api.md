# 端能力API

由于不同的端自身会提供不同的端能力API，例如微信小程序中提供了网络请求、本地存储等等端能力的封装，目前在所有端中，微信小程序所提供的端能力API最为丰富，所以 Taro 在设计之初端能力的 API 便是采用微信小程序标准，在其他端各自对应实现，同时又对微信小程序的 API 进行了一些优化处理，例如异步的 API 支持 `Promise` 化，利用队列解决了 `wx.request` 的请求个数限制问题等等。

因为采用微信小程序标准的缘故，Taro 项目在编译到微信小程序端 API 都是可以正常运行的，如果编译到其他端，则要视当前端的能力支持而定，例如H5端就无法调用扫码、蓝牙等端能力，所以这些 API 在H5端运行的时候将什么也不做。

## 网络

### 发起请求

#### Taro.request

使用方式同 [`wx.request`](https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.request(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.request | ✔️ | ✔️ | ✔️ |

### 上传、下载

#### Taro.uploadFile

使用方式同 [`wx.uploadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxuploadfileobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

const uploadTask = Taro.uploadFile(params).then(...)
```

#### Taro.downloadFile

使用方式同 [`wx.downloadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxdownloadfileobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.downloadFile(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.uploadFile | ✔️ | ✔️ | ✔️ |
| Taro.downloadFile | ✔️ | ✔️ | ✔️ |

### WebSocket

#### Taro.connectSocket(OBJECT)

创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 链接。

支持存在最多**两个** WebSocket 链接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](native-api.md#sockettask)。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| url | String | 是 | 开发者服务器接口地址，必须是 wss 协议 |
| header | Object | 否 | HTTP Header , header 中不能设置 Referer |
| method | String | 否 | 默认是GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| protocols | StringArray | 否 | 子协议数组 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

示例代码：

```javascript
import Taro from '@tarojs/taro'

Taro.connectSocket({
  url: 'ws://echo.websocket.org/echo',
  success: function () {
    console.log('connect success')
  }
})
  .then(task => {
    task.onOpen(function () {
      console.log('onOpen')
      task.send({ data: 'xxx'})
    })
    task.onMessage(function (msg) {
      console.log('onMessage: ', msg)
      task.close()
    })
    task.onError(function () {
      console.log('onError')
    })
    task.onClose(function (e) {
      console.log('onClose: ', e)
    })
  })
```

#### SocketTask

WebSocket 任务，可通过 [wx.connectSocket()](native-api.md#taroconnectsocketobject) 接口创建返回。

属性

socketTask.readyState: websocket 当前的连接状态。

socketTask.CONNECTING: websocket 状态：连接中。

socketTask.OPEN: websocket 状态：已连接。

socketTask.CLOSING: websocket 状态：关闭中。

socketTask.CLOSED: websocket 状态：已关闭。 

socketTask.ws: 浏览器 websocket 实例。（**h5 端独有**）

方法

SocketTask.send(OBJECT)

通过 WebSocket 连接发送数据。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| data | String/ArrayBuffer | 是 | 需要发送的内容 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.close(OBJECT)

关闭 WebSocket 连接。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| code | Number | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭） |
| reason | String | 否 | 一个可读的字符串，表示连接被关闭的原因 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.onOpen(CALLBACK)

监听 WebSocket 连接打开事件。

SocketTask.onClose(CALLBACK)

监听 WebSocket 连接关闭事件。

**CALLBACK返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| code | Number | 关闭连接的状态号 |
| reason | String | 连接被关闭的原因 |

SocketTask.onError(CALLBACK)

监听 WebSocket 错误。

**CALLBACK返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| errMsg | String | 错误信息 |

SocketTask.onMessage(CALLBACK)

监听WebSocket接受到服务器的消息事件。

**CALLBACK返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | String/ArrayBuffer | 服务器返回的消息 |

#### Taro.onSocketOpen

`@Deprecated` 请使用 **SocketTask.onOpen**

#### Taro.onSocketError

`@Deprecated` 请使用 **SocketTask.onError**

#### Taro.sendSocketMessage

`@Deprecated` 请使用 **SocketTask.send**

#### Taro.onSocketMessage

`@Deprecated` 请使用 **SocketTask.onMessage**

#### Taro.closeSocket

`@Deprecated` 请使用 **SocketTask.close**

#### Taro.onSocketClose

`@Deprecated` 请使用 **SocketTask.onClose**

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ |
| SocketTask | ✔️ | ✔️ | ✔️ |
| Taro.onSocketOpen | ✔️ |  | ✔️ |
| Taro.onSocketError | ✔️ |  | ✔️ |
| Taro.sendSocketMessage | ✔️ |  | ✔️ |
| Taro.onSocketMessage | ✔️ |  | ✔️ |
| Taro.closeSocket | ✔️ |  | ✔️ |
| Taro.onSocketClose | ✔️ |  | ✔️ |

## 数据缓存

#### Taro.setStorage(OBJECT)

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

```javascript
import Taro from '@tarojs/taro'

Taro.setStorage({ key: 'key', data: 'value' })
  .then(res => console.log(res))
```

#### Taro.setStorageSync(KEY, DATA)

将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

Taro.setStorageSync('key', 'value')
```

#### Taro.getStorage(OBJECT)

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

```javascript
import Taro from '@tarojs/taro'

Taro.getStorage({ key: 'key' })
  .then(res => console.log(res.data))
```

#### Taro.getStorageSync(KEY)

从本地缓存中同步获取指定 key 对应的内容。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

const data = Taro.getStorageSync('key')
```

#### Taro.getStorageInfo(OBJECT)

异步获取当前storage的相关信息，支持 `Promise` 化使用。

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

```javascript
import Taro from '@tarojs/taro'

Taro.getStorageInfo()
  .then(res => console.log(res.keys))
```

#### Taro.getStorageInfoSync

同步获取当前storage的相关信息。

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

const res = Taro.getStorageInfoSync()
console.log(res.keys)
```

#### Taro.removeStorage(OBJECT)

从本地缓存中异步移除指定 key，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| keys | String | 是 | 本地缓存中的指定的 key |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

Taro.removeStorage({ key: 'key' })
  .then(res => console.log(res))
```

#### Taro.removeStorageSync(KEY)

从本地缓存中同步移除指定 key 。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

Taro.removeStorageSync('key')
```

#### Taro.clearStorage()

清理本地数据缓存。

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

Taro.clearStorage()
```

#### Taro.clearStorageSync()

同步清理本地数据缓存

**示例代码：**

```javascript
import Taro from '@tarojs/taro'

Taro.clearStorageSync()
```

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
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

## 界面

### 交互反馈

#### Taro.showToast

使用方式同 [`wx.showToast `](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html)

#### Taro.showLoading

使用方式同 [`wx.showLoading`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowloadingobject)

#### Taro.hideToast

使用方式同 [`wx.hideToast`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxhidetoast)

#### Taro.hideLoading

使用方式同 [`wx.hideLoading`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxhideloading)

#### Taro.showModal

使用方式同 [`wx.showModal`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowmodalobject)

#### Taro.showActionSheet

使用方式同 [`wx.showActionSheet`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowactionsheetobject)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
| Taro.hideToast | ✔️ | ✔️ | ✔️ |
| Taro.hideLoading | ✔️ | ✔️ | ✔️ |
| Taro.showModal | ✔️ | ✔️ | ✔️ |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |

### 导航

#### Taro.navigateTo

使用方式同 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html)

#### Taro.redirectTo

使用方式同 [`wx.redirectTo`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html#wxredirecttoobject)

#### Taro.navigateBack

使用方式同 [`wx.navigateBack`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html#wxnavigatebackobject)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |

### WXML节点信息

#### Taro.createSelectorQuery

使用方式同 [`wx.createSelectorQuery`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#wxcreateselectorquery)

#### selectorQuery.in

使用方式同 [`selectorQuery.in`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryincomponent)

#### selectorQuery.select

使用方式同 [`selectorQuery.select`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectselector)

#### selectorQuery.selectAll

使用方式同 [`selectorQuery.selectAll`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectallselector)

#### selectorQuery.selectViewport

使用方式同 [`selectorQuery.selectViewport`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectviewport)

#### nodesRef.boundingClientRect

使用方式同 [`nodesRef.boundingClientRect`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesrefboundingclientrectcallback)

#### nodesRef.scrollOffset

使用方式同 [`nodesRef.scrollOffset`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesrefscrolloffsetcallback)

#### nodesRef.fields

使用方式同 [`nodesRef.fields`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesreffieldsfieldscallback)

#### selectorQuery.exec

使用方式同 [`selectorQuery.exec`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryexeccallback)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.createSelectorQuery | ✔️ | ✔️ |  |
| selectorQuery.in | ✔️ | ✔️ |  |
| selectorQuery.select | ✔️ | ✔️ |  |
| selectorQuery.selectAll | ✔️ | ✔️ |  |
| selectorQuery.selectViewport | ✔️ | ✔️ |  |
| nodesRef.boundingClientRect | ✔️ | ✔️ |  |
| nodesRef.scrollOffset | ✔️ | ✔️ |  |
| nodesRef.fields | ✔️ | ✔️ |  |
| selectorQuery.exec | ✔️ | ✔️ |  |
