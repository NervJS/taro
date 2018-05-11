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

##### Taro.connectSocket

使用方式同 [`wx.connectSocket`](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html#wxdownloadfileobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

const socketTask = Taro.connectSocket(params).then(...)
```

##### Taro.onSocketOpen

使用方式同 [`wx.onSocketOpen`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxclosesocket)

##### Taro.onSocketError

使用方式同 [`wx.onSocketError`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxclosesocket)

##### Taro.sendSocketMessage

使用方式同 [`wx.sendSocketMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxclosesocket)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.sendSocketMessage(params).then(...)
```

##### Taro.onSocketMessage

使用方式同 [`wx.onSocketMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxclosesocket)

##### Taro.closeSocket

使用方式同 [`wx.closeSocket`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxclosesocket)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.closeSocket(params).then(...)
```

##### Taro.onSocketClose

使用方式同 [`wx.onSocketClose`](https://developers.weixin.qq.com/miniprogram/dev/api/network-socket.html#wxonsocketclosecallback)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ |
| Taro.onSocketOpen | ✔️ | ✔️ | ✔️ |
| Taro.onSocketError | ✔️ | ✔️ | ✔️ |
| Taro.sendSocketMessage | ✔️ | ✔️ | ✔️ |
| Taro.onSocketMessage | ✔️ | ✔️ | ✔️ |
| Taro.closeSocket | ✔️ | ✔️ | ✔️ |
| Taro.onSocketClose | ✔️ | ✔️ | ✔️ |

## 数据缓存

#### Taro.setStorage

使用方式同 [`wx.setStorage`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstorageobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.setStorage(params).then(...)
```

#### Taro.setStorageSync

使用方式同 [`wx.setStorageSync`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstoragesynckeydata)

#### Taro.getStorage

使用方式同 [`wx.getStorage`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.getStorage(params).then(...)
```

#### Taro.getStorageSync

使用方式同 [`wx.getStorageSync`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstoragesynckey)

#### Taro.getStorageInfo

使用方式同 [`wx.getStorageInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageinfoobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.getStorageInfo(params).then(...)
```

#### Taro.getStorageInfoSync

使用方式同 [`wx.getStorageInfoSync`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageinfosync)

#### Taro.removeStorage

使用方式同 [`wx.removeStorage`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestorageobject)，支持 `Promise` 化使用

```javascript
import Taro from '@tarojs/taro'

Taro.removeStorage(params).then(...)
```

#### Taro.removeStorageSync

使用方式同 [`wx.removeStorageSync`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestoragesynckey)

#### Taro.clearStorage

使用方式同 [`wx.clearStorage`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxclearstorage)

#### Taro.clearStorageSync

使用方式同 [`wx.clearStorageSync`](https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxclearstoragesync)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.setStorage | ✔️ | ✔️ | ✔️ |
| Taro.setStorageSync | ✔️ | ✔️ | ✔️ |
| Taro.getStorage | ✔️ | ✔️ | ✔️ |
| Taro.getStorageSync | ✔️ | ✔️ | ✔️ |
| Taro.getStorageInfo | ✔️ | ✔️ | ✔️ |
| Taro.getStorageInfoSync | ✔️ | ✔️ | ✔️ |
| Taro.removeStorage | ✔️ | ✔️ | ✔️ |
| Taro.removeStorageSync | ✔️ | ✔️ | ✔️ |
| Taro.clearStorage | ✔️ | ✔️ | ✔️ |
| Taro.clearStorageSync | ✔️ | ✔️ | ✔️ |

## 界面

### 交互反馈

##### Taro.showToast

使用方式同 [`wx.showToast `](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html)

##### Taro.showLoading

使用方式同 [`wx.showLoading`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowloadingobject)

##### Taro.hideToast

使用方式同 [`wx.hideToast`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxhidetoast)

##### Taro.hideLoading

使用方式同 [`wx.hideLoading`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxhideloading)

##### Taro.showModal

使用方式同 [`wx.showModal`](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html#wxshowmodalobject)

##### Taro.showActionSheet

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

##### Taro.navigateTo

使用方式同 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html)

##### Taro.redirectTo

使用方式同 [`wx.redirectTo`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html#wxredirecttoobject)

##### Taro.navigateBack

使用方式同 [`wx.navigateBack`](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html#wxnavigatebackobject)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |

### WXML 节点信息

##### Taro.createSelectorQuery

使用方式同 [`wx.createSelectorQuery`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#wxcreateselectorquery)

##### selectorQuery.in

使用方式同 [`selectorQuery.in`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryincomponent)

##### selectorQuery.select

使用方式同 [`selectorQuery.select`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectselector)

##### selectorQuery.selectAll

使用方式同 [`selectorQuery.selectAll`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectallselector)

##### selectorQuery.selectViewport

使用方式同 [`selectorQuery.selectViewport`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryselectviewport)

##### nodesRef.boundingClientRect

使用方式同 [`nodesRef.boundingClientRect`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesrefboundingclientrectcallback)

##### nodesRef.scrollOffset

使用方式同 [`nodesRef.scrollOffset`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesrefscrolloffsetcallback)

##### nodesRef.fields

使用方式同 [`nodesRef.fields`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#nodesreffieldsfieldscallback)

##### selectorQuery.exec

使用方式同 [`selectorQuery.exec`](https://developers.weixin.qq.com/miniprogram/dev/api/wxml-nodes-info.html#selectorqueryexeccallback)

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.createSelectorQuery | ✔️ | ✔️ | ✔️ |
| selectorQuery.in | ✔️ | ✔️ | ✔️ |
| selectorQuery.select | ✔️ | ✔️ | ✔️ |
| selectorQuery.selectAll | ✔️ | ✔️ | ✔️ |
| selectorQuery.selectViewport | ✔️ | ✔️ | ✔️ |
| nodesRef.boundingClientRect | ✔️ | ✔️ | ✔️ |
| nodesRef.scrollOffset | ✔️ | ✔️ | ✔️ |
| nodesRef.fields | ✔️ | ✔️ | ✔️ |
| selectorQuery.exec | ✔️ | ✔️ | ✔️ |