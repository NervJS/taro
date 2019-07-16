---
title: 端能力 API
---

由于不同的端自身会提供不同的端能力 API，例如微信小程序中提供了网络请求、本地存储等等端能力的封装，目前在所有端中，微信小程序所提供的端能力 API 最为丰富，所以 Taro 在设计之初端能力的 API 便是采用微信小程序标准，在其他端各自对应实现，同时又对微信小程序的 API 进行了一些优化处理，例如异步的 API 支持 `Promise` 化，利用队列解决了 `wx.request` 的请求个数限制问题等等。

因为采用微信小程序标准的缘故，Taro 项目在编译到微信小程序端 API 都是可以正常运行的，如果编译到其他端，则要视当前端的能力支持而定，例如 H5 端就无法调用扫码、蓝牙等端能力，所以这些 API 在 H5 端运行的时候将什么也不做。

## 网络

### 发起请求

#### Taro.request(OBJECT)

发起网络请求，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| url | String | 是 |  | 开发者服务器接口地址 |
| data | Object/String/ArrayBuffer | 否 |  |请求的参数 |
| header | Object | 否 |  | 设置请求的 header，header 中不能设置 Referer。 |
| method | String | 否 | GET | （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| dataType | String | 否 | json | 如果设为 json，会尝试对返回的数据做一次 JSON.parse |
| responseType | String | 否 | text | 设置响应的数据类型。合法值：text、arraybuffer |
| success | Function | 否 |  | 接口调用成功的回调函数 |
| fail | Function | 否 |  | 接口调用失败的回调函数 |
| complete | Function | 否 |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**H5 端附加参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| jsonp | String/Boolean | 否 |  | 使用 jsonp，且使用此值作为回调函数名 |
| jsonpCache | Boolean | 否 | false | jsonp 请求 url 是否需要被缓存 |
| mode | String | 否 | same-origin | 是否允许跨域请求。有效值：no-cors, cors, same-origin |
| credentials | String | 否 | omit | 是否携带 Cookie。有效值：include, same-origin, omit |
| cache | String | 否 | default | 缓存模式。有效值：default, no-cache, reload, force-cache, only-if-cached |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | Object/String/ArrayBuffer | 开发者服务器返回的数据 |
| statusCode | Number | 开发者服务器返回的 HTTP 状态码 |
| header | Object | 开发者服务器返回的 HTTP Response Header |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.request({
  url: 'http://localhost:8080/test',
  data: {
    foo: 'foo',
    bar: 10
  },
  header: {
    'content-type': 'application/json'
  }
})
  .then(res => console.log(res.data))
```

#### 拦截器

> 自 `1.2.16` 开始支持

可以使用拦截器在请求发出前或发出后做一些额外操作。

在调用 `Taro.request` 发起请求之前，调用 `Taro.addInterceptor` 方法为请求添加拦截器，拦截器的调用顺序遵循洋葱模型。

拦截器是一个函数，接受 chain 对象作为参数。chain 对象中含有 **requestParmas** 属性，代表请求参数。拦截器内最后需要调用 `chain.proceed(requestParams)` 以调用下一个拦截器或发起请求。

拦截器例子：

```js
const interceptor = function (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  return chain.proceed(requestParams)
    .then(res => {
      console.log(`http <-- ${url} result:`, res)
      return res
    })
}

Taro.addInterceptor(interceptor)
Taro.request({ url })
```

Taro 提供了两个内置拦截器 `logInterceptor` 与 `timeoutInterceptor`，分别用于打印请求的相关信息和在请求超时时抛出错误。

```js
Taro.addInterceptor(Taro.interceptors.logInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
Taro.request({ url })
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 轻应用 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.request | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.addInterceptor | ✔️ | ✔️ |  | ✔️ | ✔️ | ✔️ | ✔️ |

### 上传、下载

#### Taro.uploadFile(OBJECT)

使用方式同 [`wx.uploadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.uploadFile.html)，支持 `Promise` 化使用。

**参数说明**
属性 | 类型 | 默认值 | 必填 | 说明
 :-: | :-: | :-: | :-: | :-: 
url | string | | 是 | 开发者服务器地址
filePath | string | | 是 | 要上传文件资源的路径
name | string | | 是 | 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
header | Object | | 否 | HTTP 请求 Header，Header 中不能设置 Referer
formData | Object | | 否 | HTTP 请求中其他额外的 form data
success | function | | 否 | 接口调用成功的回调函数
fail | function | | 否 | 接口调用失败的回调函数
complete | function | | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const uploadTask = Taro.uploadFile(params).then(...)
```

#### Taro.downloadFile(OBJECT)

使用方式同 [`wx.downloadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.downloadFile.html)，支持 `Promise` 化使用。

**参数说明**
属性 | 类型 | 默认值 | 必填 | 说明
 :-: | :-: | :-: | :-: | :-: 
 url | string | 下载资源的 url
 header] | Object | HTTP 请求的 Header，Header 中不能设置 Referer
 filePath] | string | *指定文件下载后存储的路径
 success] | function | 接口调用成功的回调函数
 fail] | function | 接口调用失败的回调函数
 complete] | function | 接口调用结束的回调函数（调用成功、失败都会执行）


**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.downloadFile(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.uploadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.downloadFile | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### WebSocket

#### Taro.connectSocket(OBJECT)

创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 链接。

支持存在最多**两个** WebSocket 链接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](native-api.md#sockettask)。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| url | String | 是 | 开发者服务器接口地址，必须是 wss 协议 |
| header | Object | 否 | HTTP Header , header 中不能设置 Referer |
| method | String | 否 | 默认是 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| protocols | StringArray | 否 | 子协议数组 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.connectSocket({
  url: 'ws://echo.websocket.org/echo',
  success: function () {
    console.log('connect success')
  }
}).then(task => {
  task.onOpen(function () {
    console.log('onOpen')
    task.send({ data: 'xxx' })
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

socketTask.readyState: WebSocket 当前的连接状态。

socketTask.CONNECTING: WebSocket 状态值：连接中。

socketTask.OPEN: WebSocket 状态值：已连接。

socketTask.CLOSING: WebSocket 状态值：关闭中。

socketTask.CLOSED: WebSocket 状态值：已关闭。

socketTask.ws: 浏览器 WebSocket 实例。（**H5 端独有**）

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
| code | Number | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是 1000 （表示正常连接关闭） |
| reason | String | 否 | 一个可读的字符串，表示连接被关闭的原因 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.onOpen(CALLBACK)

监听 WebSocket 连接打开事件。

SocketTask.onClose(CALLBACK)

监听 WebSocket 连接关闭事件。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| code | Number | 关闭连接的状态号 |
| reason | String | 连接被关闭的原因 |

SocketTask.onError(CALLBACK)

监听 WebSocket 错误。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| errMsg | String | 错误信息 |

SocketTask.onMessage(CALLBACK)

监听 WebSocket 接受到服务器的消息事件。

**CALLBACK 返回参数**

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

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SocketTask | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.onSocketOpen | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketError | ✔️ |  |  | ✔️ | ✔️ |
| Taro.sendSocketMessage | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketMessage | ✔️ |  |  | ✔️ | ✔️ |
| Taro.closeSocket | ✔️ |  |  | ✔️ | ✔️ |
| Taro.onSocketClose | ✔️ |  |  | ✔️ | ✔️ |

## 媒体

### 图片

#### Taro.chooseImage(OBJECT)

使用方式同 [`wx.chooseImage `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseImage.html)，支持 `Promise` 化使用。

注：RN 端该 API 不支持 `count` 属性；不支持相机与相册同时选择，只会取 `sourceType` 数组里的第一个值。默认从相册选取图片。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseImage(params).then(...)
```

#### Taro.previewImage(OBJECT)

使用方式同 [`wx.previewImage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.previewImage.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.previewImage(params).then(...)
```

#### Taro.getImageInfo(OBJECT)

使用方式同 [`wx.getImageInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getImageInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getImageInfo(params).then(...)
```

#### Taro.saveImageToPhotosAlbum(OBJECT)

使用方式同 [`wx.saveImageToPhotosAlbum`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveImageToPhotosAlbum.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.saveImageToPhotosAlbum(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Taro.previewImage | ✔️ |  | ✔️ | ✔️ | ✔️ |
| Taro.getImageInfo | ✔️ |  | ✔️ | ✔️ | ✔️ |
| Taro.saveImageToPhotosAlbum | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### 录音

#### Taro.startRecord(OBJECT)

使用方式同 [`wx.startRecord`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startRecord.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params).then(...)
```

#### Taro.stopRecord()

​主动调用停止录音。

​**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopRecord()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.startRecord | ✔️ |  |  |  |  |
| Taro.stopRecord | ✔️ |  |  |  |  |

### 录音管理

#### Taro.getRecorderManager()

使用方式同 [`wx.getRecorderManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getRecorderManager.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const recorderManager = Taro.getRecorderManager()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.getRecorderManager | ✔️ |  | ✔️ |  |  |

### 音频播放控制

#### Taro.playVoice(OBJECT)

使用方式同 [`wx.playVoice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.playVoice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.playVoice(params).then(...)
```

#### Taro.pauseVoice()

暂停正在播放的语音。再次调用 Taro.playVoice 播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 Taro.stopVoice。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.pauseVoice, 5000)
  })
```

#### Taro.stopVoice

结束播放语音。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startRecord(params)
  .then(res => {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  })
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.playVoice | ✔️ |  |  |  |  |
| Taro.pauseVoice | ✔️ |  |  |  |  |
| Taro.stopVoice | ✔️ |  |  |  |  |

### 音乐播放控制

#### Taro.getBackgroundAudioPlayerState(OBJECT)

使用方式同 [`wx.getBackgroundAudioPlayerState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBackgroundAudioPlayerState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBackgroundAudioPlayerState(params).then(...)
```

#### Taro.playBackgroundAudio(OBJECT)

使用方式同 [`wx.playBackgroundAudio`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.playBackgroundAudio.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.playBackgroundAudio(params).then(...)
```

#### Taro.pauseBackgroundAudio()

暂停播放音乐。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.pauseBackgroundAudio()
```

#### Taro.seekBackgroundAudio(OBJECT)

使用方式同 [`wx.seekBackgroundAudio`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.seekBackgroundAudio.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.seekBackgroundAudio(params).then(...)
```

#### Taro.stopBackgroundAudio()

停止播放音乐。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBackgroundAudio()
```

#### Taro.onBackgroundAudioPlay(CALLBACK)

监听音乐播放。

#### Taro.onBackgroundAudioPause(CALLBACK)

监听音乐暂停。

#### Taro.onBackgroundAudioStop(CALLBACK)

监听音乐停止。

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.getBackgroundAudioPlayerState | ✔️ |  |  |
| Taro.playBackgroundAudio | ✔️ |  |  |
| Taro.pauseBackgroundAudio | ✔️ |  |  |
| Taro.seekBackgroundAudio | ✔️ |  |  |
| Taro.stopBackgroundAudio | ✔️ |  |  |
| Taro.onBackgroundAudioPlay | ✔️ |  |  |
| Taro.onBackgroundAudioPause | ✔️ |  |  |
| Taro.onBackgroundAudioStop | ✔️ |  |  |

### 背景音频播放管理

#### Taro.getBackgroundAudioManager()

使用方式同 [`wx.getBackgroundAudioManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBackgroundAudioManager.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const backgroundAudioManager = Taro.getBackgroundAudioManager()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getBackgroundAudioManager | ✔️ |  |  |

### 音频组件控制

#### Taro.createAudioContext(audioId, this.$scope)

使用方式同 [`wx.createAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAudioContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const audioCtx = Taro.createAudioContext('myAudio')
```

#### Taro.createInnerAudioContext()

使用方式同 [`wx.createInnerAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createInnerAudioContext.html)。

##### 参数

**InnerAudioContext**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| src | <code>string</code> |  | 音频资源的地址，用于直接播放。2.2.3 开始支持云文件ID |
| [startTime] | <code>number</code> | <code>0</code> | 开始播放的位置（单位：s），默认为 0 |
| [autoplay] | <code>boolean</code> | <code>false</code> | 是否自动开始播放，默认为 false |
| [loop] | <code>boolean</code> | <code>false</code> | 是否循环播放，默认为 false |
| [obeyMuteSwitch] | <code>boolean</code> | <code>true</code> | 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 wx.setInnerAudioOption 接口统一设置。 |
| [volume] | <code>number</code> | <code>1</code> | 音量。范围 0~1。默认为 1 |
| duration | <code>number</code> |  | 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读） |
| currentTime | <code>number</code> |  | 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读） |
| paused | <code>boolean</code> |  | 当前是是否暂停或停止状态（只读） |
| buffered | <code>number</code> |  | 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读） |
| play() | <code>function</code> |  | 播放 |
| pause() | <code>function</code> |  | 暂停。暂停后的音频再播放会从暂停处开始播放 |
| stop() | <code>function</code> |  | 停止。停止后的音频再播放会从头开始播放。 |
| seek(position: number) | <code>function</code> |  |  跳转到指定位置 |
| destroy() | <code>function</code> |  | 销毁当前实例 |
| offCanplay(CALLBACK: function) | <code>function</code> |  | 取消监听音频进入可以播放状态的事件 |
| offEnded(CALLBACK: function) | <code>function</code> |  | 取消监听音频自然播放至结束的事件 |
| offError(CALLBACK: function) | <code>function</code> |  | 取消监听音频播放错误事件 |
| offPause(CALLBACK: function) | <code>function</code> |  | 取消监听音频暂停事件 |
| offPlay(CALLBACK: function) | <code>function</code> |  | 取消监听音频播放事件 |
| offSeeked(CALLBACK: function) | <code>function</code> |  | 取消监听音频完成跳转操作的事件 |
| offSeeking(CALLBACK: function) | <code>function</code> |  | 取消监听音频进行跳转操作的事件 |
| offStop(CALLBACK: function) | <code>function</code> |  | 取消监听音频停止事件 |
| offTimeUpdate(CALLBACK: function) | <code>function</code> |  | 取消监听音频播放进度更新事件 |
| offWaiting(CALLBACK: function) | <code>function</code> |  | 取消监听音频加载中事件 |
| onCanplay(CALLBACK: function) | <code>function</code> |  | 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放 |
| onEnded(CALLBACK: function) | <code>function</code> |  | 监听音频自然播放至结束的事件 |
| onError(CALLBACK: function) | <code>function</code> |  | 监听音频播放错误事件 |
| onPause(CALLBACK: function) | <code>function</code> |  | 监听音频暂停事件 |
| onPlay(CALLBACK: function) | <code>function</code> |  | 监听音频播放事件 |
| onSeeked(CALLBACK: function) | <code>function</code> |  | 监听音频完成跳转操作的事件 |
| onSeeking(CALLBACK: function) | <code>function</code> |  | 监听音频进行跳转操作的事件 |
| onStop(CALLBACK: function) | <code>function</code> |  | 监听音频停止事件 |
| onTimeUpdate(CALLBACK: function) | <code>function</code> |  | 监听音频播放进度更新事件 |
| onWaiting(CALLBACK: function) | <code>function</code> |  | 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发 |


**position: 跳转的位置（单位 s）**

**CALLBACK: 回调函数**

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const innerAudioContext = Taro.createInnerAudioContext()
```

> API 支持度

| API | 微信小程序 | H5 | React Native | 支付宝小程序 | 百度小程序 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Taro.createAudioContext | ✔️ |  |  |  |  |
| Taro.createInnerAudioContext | ✔️ | ✔️ | ✔️ |  |  |

### 视频

#### Taro.chooseVideo(OBJECT)

使用方式同 [`wx.chooseVideo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseVideo.html)，支持 `Promise` 化使用。

注：RN端该API不支持 `compressed` 、`maxDuration`、`camera` 属性；不支持相册与相机同时选择，只会取 `sourceType` 数组里的第一个值。默认从相册选取视频。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseVideo(params).then(...)
```

#### Taro.saveVideoToPhotosAlbum(OBJECT)

使用方式同 [`wx.saveVideoToPhotosAlbum`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveVideoToPhotosAlbum.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.saveVideoToPhotosAlbum(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseVideo | ✔️ |  | ✔️ |
| Taro.saveVideoToPhotosAlbum | ✔️ | ✔️ | ✔️ |

### 视频组件控制

#### Taro.createVideoContext(videoId, this.$scope)

使用方式同 [`wx.createVideoContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createVideoContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const videoContext = Taro.createVideoContext('myVideo')
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createVideoContext | ✔️ |  | ✔️ |

### 相机组件控制

#### Taro.createCameraContext(this.$scope)

使用方式同 [`wx.createCameraContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createCameraContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const cameraContext = Taro.createCameraContext()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createCameraContext | ✔️ |  |  |

## 文件

#### Taro.saveFile(OBJECT)

使用方式同 [`wx.saveFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.saveFile(params).then(...)
```

#### Taro.getFileInfo(OBJECT)

使用方式同 [`wx.getFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getFileInfo(params).then(...)
```

#### Taro.getSavedFileList(OBJECT)

使用方式同 [`wx.getSavedFileList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSavedFileList(params).then(...)
```

#### Taro.getSavedFileInfo(OBJECT)

使用方式同 [`wx.getSavedFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSavedFileInfo(params).then(...)
```

#### Taro.removeSavedFile(OBJECT)

使用方式同 [`wx.removeSavedFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeSavedFile.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.removeSavedFile(params).then(...)
```

#### Taro.openDocument(OBJECT)

使用方式同 [`wx.openDocument`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openDocument.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openDocument(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.saveFile | ✔️ |  |  ✔️  |
| Taro.getFileInfo | ✔️ |  |  ✔️  |
| Taro.getSavedFileList | ✔️ |  | ✔️   |
| Taro.getSavedFileInfo | ✔️ |  |  ✔️  |
| Taro.removeSavedFile | ✔️ |  |  ✔️  |
| Taro.openDocument | ✔️ |  |  |

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

```jsx
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

```jsx
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

```jsx
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

```jsx
import Taro from '@tarojs/taro'

const data = Taro.getStorageSync('key')
```

#### Taro.getStorageInfo(OBJECT)

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

#### Taro.getStorageInfoSync()

同步获取当前 storage 的相关信息。

**示例代码：**

```jsx
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

```jsx
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

```jsx
import Taro from '@tarojs/taro'

Taro.removeStorageSync('key')
```

#### Taro.clearStorage()

清理本地数据缓存。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.clearStorage()
```

#### Taro.clearStorageSync()

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

## 位置

### 获取位置

#### Taro.getLocation(OBJECT)

使用方式同 [`wx.getLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getLocation.html)，h5端仅支持[微信公众号]h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getLocation(params).then(...)
```

#### Taro.chooseLocation(OBJECT)

使用方式同 [`wx.chooseLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseLocation.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getLocation | ✔️ | ✔️ | ✔️ |
| Taro.chooseLocation | ✔️ |  |  |

### 查看位置

#### Taro.openLocation(OBJECT)

使用方式同 [`wx.openLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openLocation.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.openLocation | ✔️ | ✔️ |  |

### 地图组件控制

#### Taro.createMapContext(mapId, this.$scope)

使用方式同 [`wx.createMapContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createMapContext.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const mapCtx = Taro.createMapContext('myMap')
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createMapContext | ✔️ |  |  |

## 设备

### 系统信息

#### Taro.getSystemInfo(OBJECT)

获取系统信息，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，详见返回参数说明 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSystemInfo({
  success: res => console.log(res)
})
  .then(res => console.log(res))
```

#### Taro.getSystemInfoSync()

获取系统信息同步接口。

**同步返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const res = Taro.getSystemInfoSync()
console.log(res.model)
console.log(res.pixelRatio)
console.log(res.windowWidth)
console.log(res.windowHeight)
console.log(res.language)
console.log(res.version)
console.log(res.platform)
```

#### Taro.canIUse(String)

使用方式同 [`wx.canIUse`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canIUse.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.canIUse('openBluetoothAdapter')
Taro.canIUse('getSystemInfoSync.return.screenWidth')
Taro.canIUse('getSystemInfo.success.screenWidth')
Taro.canIUse('showToast.object.image')
Taro.canIUse('onCompassChange.callback.direction')
Taro.canIUse('request.object.method.GET')
Taro.canIUse('live-player')
Taro.canIUse('text.selectable')
Taro.canIUse('button.open-type.contact')
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getSystemInfo | ✔️ | ✔️ | ✔️ |
| Taro.getSystemInfoSync | ✔️ | ✔️ | ✔️ |
| Taro.canIUse | ✔️ |  |  |

### 网络状态

#### Taro.getNetworkType(OBJECT)

获取网络类型，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，返回网络类型 networkType |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| networkType | 网络类型 |


**networkType 有效值：**

| 参数 | 说明 |
| :-- | :-- |
| wifi | wifi 网络 |
| 2g | 2g 网络 |
| 3g | 3g 网络 |
| 4g | 4g 网络 |
| none | 无网络 |
| unknow | Android 下不常见的网络类型 |

**注意：**

**H5** 下此 API 兼容性较差，详见 [Can I use](https://caniuse.com/#search=connection)。并且标准不一，对于三种规范分别支持的 networkType 有效值如下。

* 仅支持不符合规范的 navigator.connetion.type，[详情](https://www.davidbcalhoun.com/2010/using-navigator-connection-android/)。networkType 有效值为：'wifi'、'3g'、'2g'、'unknown'。
* 支持 navigator.connetion.type。networkType 有效值为：'cellular'、'wifi'、'none'。
* 支持 navigator.connetion.effectiveType。networkType 有效值为：'slow-2g'、'2g'、'3g'、'4g'。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getNetworkType({
  success: res => console.log(res.networkType)
})
  .then(res => console.log(res.networkType))
```

#### Taro.onNetworkStatusChange(CALLBACK)

监听网络状态变化。

**CALLBACK 返回参数：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| isConnected | Boolean | 当前是否有网络连接 |
| networkType | String | 网络类型 |

注意：**H5** 端兼容情况较差，只有当 navigator.connection 支持监听 onChange 事件时才会生效。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onNetworkStatusChange(res => {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

> API 支持度

| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.getNetworkType | ✔️ | ✔️ | ✔️ |
| Taro.onNetworkStatusChange | ✔️ | ✔️ | ✔️ |

### 加速度计

#### Taro.onAccelerometerChange(CALLBACK)

使用方式同 [`wx.onAccelerometerChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAccelerometerChange.html)。

##### 参数

| Param | Type | Description |
| --- | --- | --- |
| CALLBACK | <code>function</code> | 加速度数据事件的回调函数 |

**CALLBACK参数**

| Name | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | 参数 |
| object.x | <code>number</code> | X 轴 |
| object.y | <code>number</code> | Y 轴 |
| object.z | <code>number</code> | Z 轴 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

#### Taro.startAccelerometer(OBJECT)

使用方式同 [`wx.startAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startAccelerometer.html)。

##### 参数

**OBJECT**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [object] | <code>Object</code> |  | 参数 |
| [object.interval] | <code>&#x27;game&#x27;</code> 或 <code>&#x27;ui&#x27;</code> 或 <code>&#x27;normal&#x27;</code> | <code>normal</code> | 监听加速度数据回调函数的执行频率 game 适用于更新游戏的回调频率，在 20ms/次 左右 ui 适用于更新 UI 的回调频率，在 60ms/次 左右 normal 普通的回调频率，在 200ms/次 左右 |
| [object.success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [object.fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [object.complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startAccelerometer({ interval: 'game' })
```

#### Taro.stopAccelerometer(OBJECT)

使用方式同 [`wx.stopAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopAccelerometer.html)。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| [object] | <code>Object</code> | 参数 |
| [object.success] | <code>function</code> | 接口调用成功的回调函数 |
| [object.fail] | <code>function</code> | 接口调用失败的回调函数 |
| [object.complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopAccelerometer()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onAccelerometerChange | ✔️ |  | ✔️  |
| Taro.startAccelerometer | ✔️ |  | ✔️  |
| Taro.stopAccelerometer | ✔️ |  | ✔️  |

### 罗盘

#### Taro.onCompassChange(CALLBACK)

使用方式同 [`wx.onCompassChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onCompassChange.html)。

##### 参数

| Param | Type | Description |
| --- | --- | --- |
| CALLBACK | <code>function</code> | 罗盘数据变化事件的回调函数 |

**CALLBACK参数**

| Name | Type | Description |
| --- | --- | --- |
| direction | <code>number</code> | 面对的方向度数 |
| [accuracy] | <code>Accuracy</code> | 精度 |

由于平台差异，accuracy 在 iOS/Android 的值不同。
 * **iOS**：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
 * **Android**：accuracy 是一个 string 类型的枚举值。
 * **high**：高精度
 * **medium**：中等精度
 * **low**：低精度
 * **no-contact**：不可信，传感器失去连接
 * **unreliable**：不可信，原因未知
 * **unknow ${value}**：未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值
未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值 示指向南，依此类推。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onCompassChange(res => {
  console.log(res.direction)
})
```

#### Taro.startCompass(OBJECT)

使用方式同 [`wx.startCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startCompass.html)。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | 参数 |
| [object.success] | <code>function</code> | 接口调用成功的回调函数 |
| [object.fail] | <code>function</code> | 接口调用失败的回调函数 |
| [object.complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startCompass()
```

#### Taro.stopCompass(OBJECT)

使用方式同 [`wx.stopCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopCompass.html)。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | 参数 |
| [object.success] | <code>function</code> | 接口调用成功的回调函数 |
| [object.fail] | <code>function</code> | 接口调用失败的回调函数 |
| [object.complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopCompass()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onCompassChange | ✔️ | ✔️ |  |
| Taro.startCompass | ✔️ | ✔️ |  |
| Taro.stopCompass | ✔️ | ✔️ |  |

### 拨打电话

#### Taro.makePhoneCall(OBJECT)

使用方式同 [`wx.makePhoneCall`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.makePhoneCall.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.makePhoneCall(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.makePhoneCall | ✔️ | ✔️ | ✔️ |

### 扫码

#### Taro.scanCode(OBJECT)

使用方式同 [`wx.scanCode`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.scanCode.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.scanCode(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.scanCode | ✔️ | ✔️ |  |

### 剪贴板

#### Taro.setClipboardData(OBJECT)

使用方式同 [`wx.setClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setClipboardData(params).then(...)
```

#### Taro.getClipboardData(OBJECT)

使用方式同 [`wx.getClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getClipboardData(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setClipboardData | ✔️ | ✔️ | ✔️ |
| Taro.getClipboardData | ✔️ | ✔️ | ✔️ |

### 蓝牙

#### Taro.openBluetoothAdapter(OBJECT)

使用方式同 [`wx.openBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openBluetoothAdapter(params).then(...)
```

#### Taro.closeBluetoothAdapter(OBJECT)

使用方式同 [`wx.closeBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.closeBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.closeBluetoothAdapter(params).then(...)
```

#### Taro.getBluetoothAdapterState(OBJECT)

使用方式同 [`wx.getBluetoothAdapterState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothAdapterState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBluetoothAdapterState(params).then(...)
```

#### Taro.onBluetoothAdapterStateChange(CALLBACK)

使用方式同 [`wx.onBluetoothAdapterStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothAdapterStateChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothAdapterStateChange(res => {
  console.log(`adapterState changed, now is`, res)
})
```

#### Taro.startBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.startBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startBluetoothDevicesDiscovery(params).then(...)
```

#### Taro.stopBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.stopBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBluetoothDevicesDiscovery(params).then(...)
```

#### Taro.getBluetoothDevices(OBJECT)

使用方式同 [`wx.getBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBluetoothDevices(params).then(...)
```

#### Taro.getConnectedBluetoothDevices(OBJECT)

使用方式同 [`wx.getConnectedBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getConnectedBluetoothDevices(params).then(...)
```

#### Taro.onBluetoothDeviceFound(CALLBACK)

使用方式同 [`wx.onBluetoothDeviceFound `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothDeviceFound.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothDeviceFound(devices => {
  console.log(devices)
  console.log(devices[0].advertisData)
})
```

#### Taro.createBLEConnection(OBJECT)

使用方式同 [`wx.createBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.createBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.createBLEConnection(params).then(...)
```

#### Taro.closeBLEConnection(OBJECT)

使用方式同 [`wx.closeBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.closeBLEConnection(params).then(...)
```

#### Taro.getBLEDeviceServices(OBJECT)

使用方式同 [`wx.getBLEDeviceServices`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBLEDeviceServices.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBLEDeviceServices(params).then(...)
```

#### Taro.getBLEDeviceCharacteristics(OBJECT)

使用方式同 [`wx.getBLEDeviceCharacteristics`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBLEDeviceCharacteristics.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBLEDeviceCharacteristics(params).then(...)
```

#### Taro.readBLECharacteristicValue(OBJECT)

使用方式同 [`wx.readBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.readBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.readBLECharacteristicValue(params).then(...)
```

#### Taro.writeBLECharacteristicValue(OBJECT)

使用方式同 [`wx.writeBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.writeBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.writeBLECharacteristicValue(params).then(...)
```

#### Taro.notifyBLECharacteristicValueChange(OBJECT)

使用方式同 [`wx.notifyBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.notifyBLECharacteristicValueChange.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.notifyBLECharacteristicValueChange(params).then(...)
```

#### Taro.onBLEConnectionStateChange(CALLBACK)

使用方式同 [`wx.onBLEConnectionStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBLEConnectionStateChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBLEConnectionStateChange(res => {
  // 该方法回调中可以用于处理连接意外断开等异常情况
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

#### Taro.onBLECharacteristicValueChange(CALLBACK)

使用方式同 [`wx.onBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBLECharacteristicValueChange.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onBLECharacteristicValueChange(res => {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(res.value)
})
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.openBluetoothAdapter | ✔️ |  |  |
| Taro.closeBluetoothAdapter | ✔️ |  |  |
| Taro.getBluetoothAdapterState | ✔️ |  |  |
| Taro.onBluetoothAdapterStateChange | ✔️ |  |  |
| Taro.startBluetoothDevicesDiscovery | ✔️ |  |  |
| Taro.stopBluetoothDevicesDiscovery | ✔️ |  |  |
| Taro.getBluetoothDevices | ✔️ |  |  |
| Taro.getConnectedBluetoothDevices | ✔️ |  |  |
| Taro.onBluetoothDeviceFound | ✔️ |  |  |
| Taro.createBLEConnection | ✔️ |  |  |
| Taro.closeBLEConnection | ✔️ |  |  |
| Taro.getBLEDeviceServices | ✔️ |  |  |
| Taro.getBLEDeviceCharacteristics | ✔️ |  |  |
| Taro.readBLECharacteristicValue | ✔️ |  |  |
| Taro.writeBLECharacteristicValue | ✔️ |  |  |
| Taro.notifyBLECharacteristicValueChange | ✔️ |  |  |
| Taro.onBLEConnectionStateChange | ✔️ |  |  |
| Taro.onBLECharacteristicValueChange | ✔️ |  |  |

### iBeacon

#### Taro.startBeaconDiscovery(OBJECT)

使用方式同 [`wx.startBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startBeaconDiscovery(params).then(...)
```

#### Taro.stopBeaconDiscovery(OBJECT)

使用方式同 [`wx.stopBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopBeaconDiscovery(params).then(...)
```

#### Taro.getBeacons(OBJECT)

使用方式同 [`wx.getBeacons`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBeacons.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getBeacons(params).then(...)
```

#### Taro.onBeaconUpdate(CALLBACK)

使用方式同 [`wx.onBeaconUpdate`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconUpdate.html)。

#### Taro.onBeaconServiceChange(CALLBACK)

使用方式同 [`wx.onBeaconServiceChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconServiceChange.html)。

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startBeaconDiscovery | ✔️ |  |  |
| Taro.stopBeaconDiscovery | ✔️ |  |  |
| Taro.getBeacons | ✔️ |  |  |
| Taro.onBeaconUpdate | ✔️ |  |  |
| Taro.onBeaconServiceChange | ✔️ |  |  |

### 屏幕亮度

#### Taro.setScreenBrightness(OBJECT)

使用方式同 [`wx.setScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setScreenBrightness(params).then(...)
```

#### Taro.getScreenBrightness(OBJECT)

使用方式同 [`wx.getScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getScreenBrightness(params).then(...)
```

#### Taro.setKeepScreenOn(OBJECT)

使用方式同 [`wx.setKeepScreenOn`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setKeepScreenOn.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setKeepScreenOn(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setScreenBrightness | ✔️ |  | ✔️ |
| Taro.getScreenBrightness | ✔️ |  | ✔️ |
| Taro.setKeepScreenOn | ✔️ |  |  |

### 用户截屏事件

#### Taro.onUserCaptureScreen(CALLBACK)

监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.onUserCaptureScreen(() => {
    console.log('用户截屏了')
})
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.onUserCaptureScreen | ✔️ |  |  |

### 振动

#### Taro.vibrateLong(OBJECT)

使用方式同 [`wx.vibrateLong`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateLong.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**
| Name | Type | Description |
| --- | --- | --- |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.vibrateLong(params).then(...)
```

#### Taro.vibrateShort(OBJECT)

使用方式同 [`wx.vibrateShort`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateShort.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**
| Name | Type | Description |
| --- | --- | --- |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.vibrateShort(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.vibrateLong | ✔️ | ✔️ | ✔️ |
| Taro.vibrateShort | ✔️ | ✔️ | ✔️ |

### 手机联系人

#### Taro.addPhoneContact(OBJECT)

使用方式同 [`wx.addPhoneContact`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.addPhoneContact.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.addPhoneContact(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.addPhoneContact | ✔️ |  |  |

### NFC

#### Taro.getHCEState(OBJECT)

使用方式同 [`wx.getHCEState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getHCEState.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getHCEState(params).then(...)
```

#### Taro.startHCE(OBJECT)

使用方式同 [`wx.startHCE`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startHCE.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startHCE(params).then(...)
```

#### Taro.stopHCE(OBJECT)

使用方式同 [`wx.stopHCE`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopHCE.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopHCE(params).then(...)
```

#### Taro.onHCEMessage(CALLBACK)

使用方式同 [`wx.onHCEMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onHCEMessage.html)。

#### Taro.sendHCEMessage(OBJECT)

使用方式同 [`wx.sendHCEMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.sendHCEMessage.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.sendHCEMessage(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getHCEState | ✔️ |  |  |
| Taro.startHCE | ✔️ |  |  |
| Taro.stopHCE | ✔️ |  |  |
| Taro.onHCEMessage | ✔️ |  |  |
| Taro.sendHCEMessage | ✔️ |  |  |

### Wi-Fi

#### Taro.startWifi(OBJECT)

使用方式同 [`wx.startWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startWifi(params).then(...)
```

#### Taro.stopWifi(OBJECT)

使用方式同 [`wx.stopWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopWifi(params).then(...)
```

#### Taro.connectWifi(OBJECT)

使用方式同 [`wx.connectWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.connectWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.connectWifi(params).then(...)
```

#### Taro.getWifiList(OBJECT)

使用方式同 [`wx.getWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getWifiList(params).then(...)
```

#### Taro.onGetWifiList(CALLBACK)

使用方式同 [`wx.onGetWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onGetWifiList.html)。

#### Taro.setWifiList(OBJECT)

使用方式同 [`wx.setWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setWifiList(params).then(...)
```

#### Taro.onWifiConnected(CALLBACK)

使用方式同 [`wx.onWifiConnected`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onWifiConnected.html)。

#### Taro.getConnectedWifi(OBJECT)

使用方式同 [`wx.getConnectedWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getConnectedWifi(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startWifi | ✔️ |  |  |
| Taro.stopWifi | ✔️ |  |  |
| Taro.connectWifi | ✔️ |  |  |
| Taro.getWifiList | ✔️ |  |  |
| Taro.onGetWifiList | ✔️ |  |  |
| Taro.setWifiList | ✔️ |  |  |
| Taro.onWifiConnected | ✔️ |  |  |
| Taro.getConnectedWifi | ✔️ |  |  |

## 界面

### 交互反馈

#### Taro.showToast(OBJECT)

显示消息提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| icon | String | 否 | 图标，有效值 "success", "loading", "none" |
| image | String | 否 | 自定义图标的本地路径，image 的优先级高于 icon |
| duration | Number | 否 | 提示的延迟时间，单位毫秒，默认：1500 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**icon 有效值**

| 有效值 | 说明 |
| :-- | :-- |
| success | 显示成功图标 |
| loading | 显示加载图标 |
| none | 不显示图标 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
  .then(res => console.log(res))
```

#### Taro.showLoading(OBJECT)

显示 Loading 提示框, 需主动调用 Taro.hideLoading 才能关闭提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showLoading({
  title: 'loading'
})
  .then(res => console.log(res))
```

#### Taro.hideToast()

隐藏消息提示框

#### Taro.hideLoading()

隐藏 loading 提示框

#### Taro.showModal(OBJECT)

​显示模态弹窗，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的标题 |
| content | String | 是 | 提示的内容 |
| showCancel | Boolean | 否 | 是否显示取消按钮，默认为 true |
| cancelText | String | 否 | 取消按钮的文字，默认为"取消"，最多 4 个字符 |
| cancelColor | HexColor | 否 | 取消按钮的文字颜色，默认为"#000000" |
| confirmText | String | 否 | 确定按钮的文字，默认为"确定"，最多 4 个字符 |
| confirmColor | HexColor | 否 | 确定按钮的文字颜色，默认为"#3CC51F" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| confirm | Boolean | 为 true 时，表示用户点击了确定按钮 |
| cancel | Boolean | 为 true 时，表示用户点击了取消 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

// 注意：无论用户点击确定还是取消，Promise 都会 resolve。
Taro.showModal({
  title: 'xxx',
  content: 'hello world',
})
  .then(res => console.log(res.confirm, res.cancel))
```

#### Taro.showActionSheet(OBJECT)

显示操作菜单，支持 `Promise` 化使用。

​**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| itemList | String Array | 是 | 按钮的文字数组，数组长度最大为 6 个 |
| itemColor | HexColor | 否 | 按钮的文字颜色，默认为"#000000" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| tapIndex | Number | 用户点击的按钮，从上到下的顺序，从 0 开始 |

```jsx
import Taro from '@tarojs/taro'

// 注意：当用户点击选项时 Promise 会 resolve，而当用户点击取消或蒙层时，Promise 会 reject。
Taro.showActionSheet({
  itemList: ['a', 'b', 'c']
})
  .then(res => console.log(res.errMsg, res.tapIndex))
  .catch(err => console.log(res.errMsg))
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
| Taro.hideToast | ✔️ | ✔️ | ✔️ |
| Taro.hideLoading | ✔️ | ✔️ | ✔️ |
| Taro.showModal | ✔️ | ✔️ | ✔️ |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |

### 设置导航条

#### Taro.setNavigationBarTitle(OBJECT)

使用方式同 [`wx.setNavigationBarTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarTitle(params).then(...)
```

#### Taro.showNavigationBarLoading()

在当前页面显示导航条加载动画。

#### Taro.hideNavigationBarLoading()

隐藏导航条加载动画。

#### Taro.setNavigationBarColor(OBJECT)

使用方式同 [`wx.setNavigationBarColor`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarColor.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarColor(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setNavigationBarTitle | ✔️ |  |✔️  |
| Taro.showNavigationBarLoading | ✔️ |  | ✔️ |
| Taro.hideNavigationBarLoading | ✔️ |  | ✔️ |
| Taro.setNavigationBarColor | ✔️ |  | ✔️(不支持 animation 参数) |

### 设置 TabBar

#### Taro.setTabBarBadge(OBJECT)

使用方式同 [`wx.setTabBarBadge`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarBadge.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | tabBar 的哪一项，从左边算起 |
| text | <code>string</code> | 显示的文本，超过 4 个字符则显示成 ... |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setTabBarBadge(params).then(...)
```

#### Taro.removeTabBarBadge(OBJECT)

使用方式同 [`wx.removeTabBarBadge`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeTabBarBadge.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | tabBar 的哪一项，从左边算起 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.removeTabBarBadge(params).then(...)
```

#### Taro.showTabBarRedDot(OBJECT)

使用方式同 [`wx.showTabBarRedDot`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showTabBarRedDot.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | tabBar 的哪一项，从左边算起 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showTabBarRedDot(params).then(...)
```

#### Taro.hideTabBarRedDot(OBJECT)

使用方式同 [`wx.hideTabBarRedDot`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.hideTabBarRedDot.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | tabBar 的哪一项，从左边算起 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.hideTabBarRedDot(params).then(...)
```

#### Taro.setTabBarStyle(OBJECT)

使用方式同 [`wx.setTabBarStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarStyle.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | tab 上的文字默认颜色，HexColor |
| selectedColor | <code>string</code> | tab 上的文字选中时的颜色，HexColor |
| backgroundColor | <code>string</code> | tab 的背景色，HexColor |
| borderStyle | <code>&#x27;black&#x27;</code> 或 <code>&#x27;white&#x27;</code> | tabBar上边框的颜色， 仅支持 black/white |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setTabBarStyle(params).then(...)
```

#### Taro.setTabBarItem(OBJECT)

使用方式同 [`wx.setTabBarItem`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarItem.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | tabBar 的哪一项，从左边算起 |
| [text] | <code>string</code> | tab 上的按钮文字 |
| [iconPath] | <code>string</code> | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片 |
| [selectedIconPath] | <code>string</code> | 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setTabBarItem(params).then(...)
```

#### Taro.showTabBar(OBJECT)

使用方式同 [`wx.showTabBar`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showTabBar.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [animation] | <code>boolean</code> | <code>false</code> | 是否需要动画效果 |
| [success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showTabBar(params).then(...)
```

#### Taro.hideTabBar(OBJECT)

使用方式同 [`wx.hideTabBar`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.hideTabBar.html)，支持 `Promise` 化使用。

##### 参数

**OBJECT**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [animation] | <code>boolean</code> | <code>false</code> | 是否需要动画效果 |
| [success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.hideTabBar(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setTabBarBadge | ✔️ | ✔️ |  |
| Taro.removeTabBarBadge | ✔️ | ✔️ |  |
| Taro.showTabBarRedDot | ✔️ | ✔️ |  |
| Taro.hideTabBarRedDot | ✔️ | ✔️ |  |
| Taro.setTabBarStyle | ✔️ | ✔️ |  |
| Taro.setTabBarItem | ✔️ | ✔️ |  |
| Taro.showTabBar | ✔️ | ✔️ |  |
| Taro.hideTabBar | ✔️ | ✔️ |  |

### 设置置顶信息

#### Taro.setTopBarText(OBJECT)

使用方式同 [`wx.setTopBarText`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTopBarText.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.setTopBarText(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setTopBarText | ✔️ |  |  |

### 导航

#### Taro.navigateTo(OBJECT)

使用方式同 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateTo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateTo(params).then(...)
```

#### Taro.redirectTo(OBJECT)

使用方式同 [`wx.redirectTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.redirectTo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.redirectTo(params).then(...)
```

#### Taro.switchTab(OBJECT)

使用方式同 [`wx.switchTab`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.switchTab.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.switchTab(params).then(...)
```

#### Taro.navigateBack(OBJECT)

使用方式同 [`wx.navigateBack`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBack.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateBack({ delta: 2 })
```

#### Taro.reLaunch(OBJECT)

使用方式同 [`wx.reLaunch`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.reLaunch.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.reLaunch(params).then(...)
```

#### Taro.getCurrentPages(OBJECT)

使用方式同 [`getCurrentPages`](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html#getcurrentpages)， 获取当前的页面栈，决定需要返回几层。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getCurrentPages().length
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
| Taro.switchTab | ✔️ |  | ✔️ |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |
| Taro.reLaunch | ✔️ |  | ✔️ |      |
| Taro.getCurrentPages | ✔️ |   | ✔️|

### 动画

#### Taro.createAnimation(OBJECT)

使用方式同 [`wx.createAnimation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAnimation.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createAnimation | ✔️ | ✔️ |  |

### 位置

#### Taro.pageScrollTo(OBJECT)

使用方式同 [`wx.pageScrollTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.pageScrollTo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.pageScrollTo(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.pageScrollTo | ✔️ | ✔️ | ✔️ |

### 绘图

#### Taro.createCanvasContext(canvasId, this.$scope)

使用方式同 [`wx.createCanvasContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createCanvasContext.html)。

##### 参数

| Param | Type | Description |
| --- | --- | --- |
| canvasId | <code>string</code> | 要获取上下文的 `<canvas>` 组件 canvas-id 属性 |
| componentInstance | <code>object</code> | 在自定义组件下，当前组件实例的this，表示在这个自定义组件下查找拥有 canvas-id 的 `<canvas>` ，如果省略则不在任何自定义组件内查找 |

#### Taro.canvasGetImageData(object, this.$scope)

使用方式同 [`wx.canvasGetImageData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasGetImageData.html)。

##### 参数

**object**

| Name | Type | Description |
| --- | --- | --- |
| canvasId | <code>String</code> | 画布标识，传入 `<canvas>` 组件的 canvas-id 属性。 |
| x | <code>Number</code> | 将要被提取的图像数据矩形区域的左上角横坐标 |
| y | <code>Number</code> | 将要被提取的图像数据矩形区域的左上角纵坐标 |
| width | <code>Number</code> | 将要被提取的图像数据矩形区域的宽度 |
| height | <code>Number</code> | 将要被提取的图像数据矩形区域的高度 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### Taro.canvasPutImageData(object, this.$scope)

使用方式同 [`wx.canvasPutImageData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasPutImageData.html)。

##### 参数

**object**

| Name | Type | Description |
| --- | --- | --- |
| canvasId | <code>String</code> | 是 画布标识，传入 `<canvas>` 组件的 canvas-id 属性。 |
| data | <code>Uint8ClampedArray</code> | 是 图像像素点数据，一维数组，每四项表示一个像素点的 rgba |
| x | <code>Number</code> | 是 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量） |
| y | <code>Number</code> | 是 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量） |
| width | <code>Number</code> | 是 源图像数据矩形区域的宽度 |
| height | <code>Number</code> | 是 源图像数据矩形区域的高度 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### Taro.canvasToTempFilePath(object, this.$scope)

使用方式同 [`wx.canvasToTempFilePath`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasToTempFilePath.html)。

#### 参数

**object**

| Name | Type | Description |
| --- | --- | --- |
| [x] | <code>Number</code> | 指定的画布区域的左上角横坐标，默认值 0 |
| [y] | <code>Number</code> | 指定的画布区域的左上角纵坐标，默认值 0 |
| [width] | <code>Number</code> | 指定的画布区域的宽度，默认值 canvas宽度-x |
| [height] | <code>Number</code> | 指定的画布区域的高度，默认值 canvas宽度-y |
| [destWidth] | <code>Number</code> | 输出的图片的宽度，默认值 width*屏幕像素密度 |
| [destHeight] | <code>Number</code> | 输出的图片的高度，默认值 height*屏幕像素密度 |
| canvasId | <code>String</code> | 画布标识，传入 `<canvas>` 组件的 canvas-id |
| [fileType] | <code>String</code> | 目标文件的类型，默认值 png |
| quality | <code>Number</code> | 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### Taro.createContext(不推荐使用)

创建并返回绘图上下文。

#### Taro.drawCanvas(不推荐使用)

使用方式同 [`wx.drawCanvas`](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/draw-canvas.html)。

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.createCanvasContext | ✔️ |  |  |
| Taro.createContext | ✔️ |  |  |
| Taro.drawCanvas | ✔️ |  |  |

### 下拉刷新

#### Taro.startPullDownRefresh(OBJECT)

使用方式同 [`wx.startPullDownRefresh`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startPullDownRefresh.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startPullDownRefresh(params).then(...)
```

#### Taro.stopPullDownRefresh()

停止当前页面下拉刷新。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.stopPullDownRefresh()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startPullDownRefresh | ✔️ |  |  ✔️（无动画效果）  |
| Taro.stopPullDownRefresh | ✔️ |  |  ✔️  |

### WXML 节点信息

#### Taro.createSelectorQuery()

返回一个 SelectorQuery 对象实例。可以在这个实例上使用 select 等方法选择节点，并使用 boundingClientRect 等方法选择需要查询的信息。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const query = Taro.createSelectorQuery()
```

#### selectorQuery.in(component)

将选择器的选取范围更改为自定义组件 component 内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。）

注意：H5 端传 this 而不是传 this.$scope。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Component({
  ready () {
    if (process.env.TARO_ENV === 'h5') {
      const query = Taro.createSelectorQuery().in(this)
    } else {
      const query = Taro.createSelectorQuery().in(this.$scope)
    }
  }
})
```

#### selectorQuery.select(selector)

在当前页面下选择第一个匹配选择器 selector 的节点，返回一个 NodesRef 对象实例，可以用于获取节点信息。

* ID 选择器：`#the-id`
* class 选择器（可以连续指定多个）：`.a-class.another-class`
* 子元素选择器：`.the-parent > .the-child`
* 后代选择器：`.the-ancestor .the-descendant`
* 跨自定义组件的后代选择器：`.the-ancestor >>> .the-descendant`
* 多选择器的并集：`#a-node, .some-other-nodes`

#### selectorQuery.selectAll(selector)

在当前页面下选择匹配选择器 selector 的节点，返回一个 NodesRef 对象实例。 与 selectorQuery.selectNode(selector) 不同的是，它选择所有匹配选择器的节点。

#### selectorQuery.selectViewport()

选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息，返回一个 NodesRef 对象实例。

#### nodesRef.boundingClientRect([callback])

添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于 DOM 的 getBoundingClientRect。返回值是 nodesRef 对应的 selectorQuery。

返回的节点信息中，每个节点的位置用 left、right、top、bottom、width、height 字段描述。如果提供了 callback 回调函数，在执行 selectQuery 的 exec 方法后，节点信息会在 callback 中返回。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const query = Taro.createSelectorQuery()
query
  .select('#the-id')
  .boundingClientRect(rect => {
    rect.id      // 节点的 ID
    rect.dataset // 节点的 dataset
    rect.left    // 节点的左边界坐标
    rect.right   // 节点的右边界坐标
    rect.top     // 节点的上边界坐标
    rect.bottom  // 节点的下边界坐标
    rect.width   // 节点的宽度
    rect.height  // 节点的高度
  })
  .exec()
```

#### nodesRef.scrollOffset([callback])

添加节点的滚动位置查询请求，以像素为单位。节点必须是 scroll-view 或者 viewport。返回值是 nodesRef 对应的 selectorQuery。

返回的节点信息中，每个节点的滚动位置用 scrollLeft、scrollTop 字段描述。如果提供了 callback 回调函数，在执行 selectQuery 的 exec 方法后，节点信息会在 callback 中返回。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.createSelectorQuery()
  .selectViewport()
  .scrollOffset(rect => {
    rect.id      // 节点的 ID
    rect.dataset // 节点的 dataset
    res.scrollLeft // 节点的水平滚动位置
    res.scrollTop  // 节点的竖直滚动位置
  })
  .exec()
})
```

#### nodesRef.fields(fields, [callback])

获取节点的相关信息，需要获取的字段在 fields 中指定。返回值是 nodesRef 对应的 selectorQuery。可指定获取的字段包括：

| 字段名 | 默认值 | 说明 |
| :-: | :-: | :-: |
| id | 否 | 是否返回节点 `id` |
| dataset | 否 | 是否返回节点 `dataset` |
| rect | 否 | 是否返回节点布局位置（`left` `right` `top` `bottom`） |
| size | 否 | 是否返回节点尺寸（`width` `height`） |
| scrollOffset | 否 | 是否返回节点的 `scrollLeft` `scrollTop` ，节点必须是 `scroll-view` 或者 viewport |
| properties | [] | 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值， `id` `class` `style` 和事件绑定的属性值不可获取） |
| computedStyle | [] | 指定样式名列表，返回节点对应样式名的当前值 |

> 注意： computedStyle 的优先级高于 size，当同时在 computedStyle 里指定了 width/height 和传入了 size: true，则优先返回 computedStyle 获取到的 width/height。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.createSelectorQuery()
  .select('#the-id')
  .fields({
    dataset: true,
    size: true,
    scrollOffset: true,
    properties: ['scrollX', 'scrollY'],
    computedStyle: ['margin', 'backgroundColor']
  }, res => {
    res.dataset    // 节点的 dataset
    res.width      // 节点的宽度
    res.height     // 节点的高度
    res.scrollLeft // 节点的水平滚动位置
    res.scrollTop  // 节点的竖直滚动位置
    res.scrollX    // 节点 scroll-x 属性的当前值
    res.scrollY    // 节点 scroll-y 属性的当前值
    // 此处返回指定要返回的样式名
    res.margin
    res.backgroundColor
  })
  .exec()
```

#### selectorQuery.exec([callback])

执行所有的请求，请求结果按请求次序构成数组，在 callback 的第一个参数中返回。

> API 支持度

| API | 微信小程序 | H5 | React Native |
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

## 开放接口

### 设置

#### Taro.getSetting(OBJECT)

使用方式同 [`wx.getSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getSetting(params).then(...)
```

#### Taro.openSetting(OBJECT)

使用方式同 [`wx.openSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openSetting(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getSetting | ✔️ |  |  |
| Taro.openSetting | ✔️ |  |  |

### 收货地址

#### Taro.chooseAddress(OBJECT)

使用方式同 [`wx.chooseAddress`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseAddress.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseAddress(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseAddress | ✔️ |  |  |

### 授权

#### Taro.authorize(OBJECT)

使用方式同 [`wx.authorize`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.authorize.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.authorize(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.authorize | ✔️ |  |  |

### 卡券

#### Taro.addCard(OBJECT)

使用方式同 [`wx.addCard`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.addCard.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.addCard(params).then(...)
```

#### Taro.openCard(OBJECT)

使用方式同 [`wx.openCard`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openCard.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.openCard(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.addCard | ✔️ |  |  |
| Taro.openCard | ✔️ |  |  |

### 发票

#### Taro.chooseInvoice(OBJECT)

使用方式同 [`wx.chooseInvoice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseInvoice(params).then(...)
```

#### Taro.chooseInvoiceTitle(OBJECT)

使用方式同 [`wx.chooseInvoiceTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoiceTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.chooseInvoiceTitle(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.chooseInvoice | ✔️ |  |  |
| Taro.chooseInvoiceTitle | ✔️ |  |  |

### 支付

#### Taro.faceVerifyForPay(OBJECT)

使用方式同 [`wx.faceVerifyForPay`](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.faceVerifyForPay.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.faceVerifyForPay(params).then(...)
```

#### Taro.requestPayment(OBJECT)

使用方式同 [`wx.requestPayment`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.requestPayment.html)，h5端仅支持[微信公众号](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)（API以小程序为准），支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.requestPayment(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.faceVerifyForPay | ✔️ |  |  |
| Taro.requestPayment | ✔️ | ✔️ |  |

### 用户信息

#### Taro.getUserInfo(OBJECT)

使用方式同 [`wx.getUserInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUserInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getUserInfo(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getUserInfo | ✔️ |  |  |

### 微信运动

#### Taro.getWeRunData(OBJECT)

使用方式同 [`wx.getWeRunData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getWeRunData.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getWeRunData(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getWeRunData | ✔️ |  |  |

### 登录

#### Taro.login(OBJECT)

使用方式同 [`wx.login`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.login.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.login(params).then(...)
```

#### Taro.checkSession(OBJECT)

使用方式同 [`wx.checkSession`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkSession.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkSession(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.login | ✔️ |  |  |
| Taro.checkSession | ✔️ |  |  |

### 生物认证

#### Taro.checkIsSoterEnrolledInDevice(OBJECT)

使用方式同 [`wx.checkIsSoterEnrolledInDevice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkIsSoterEnrolledInDevice.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkIsSoterEnrolledInDevice(params).then(...)
```

#### Taro.checkIsSupportSoterAuthentication(OBJECT)

使用方式同 [`wx.checkIsSupportSoterAuthentication`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkIsSupportSoterAuthentication.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.checkIsSupportSoterAuthentication(params).then(...)
```

#### Taro.startSoterAuthentication(OBJECT)

使用方式同 [`wx.startSoterAuthentication`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startSoterAuthentication.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.startSoterAuthentication(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.checkIsSoterEnrolledInDevice | ✔️ |  |  |
| Taro.checkIsSupportSoterAuthentication | ✔️ |  |  |
| Taro.startSoterAuthentication | ✔️ |  |  |

### 小程序跳转

#### Taro.navigateBackMiniProgram(OBJECT)

使用方式同 [`wx.navigateBackMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBackMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateBackMiniProgram(params).then(...)
```

#### Taro.navigateToMiniProgram(OBJECT)

使用方式同 [`wx.navigateToMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.navigateToMiniProgram(params).then(...)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.navigateBackMiniProgram | ✔️ |  |  |
| Taro.navigateToMiniProgram | ✔️ |  |  |

## 更新

#### Taro.getUpdateManager()

使用方式同 [`wx.getUpdateManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUpdateManager.html)。

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.getUpdateManager()
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.getUpdateManager | ✔️ |  |  |

## 拓展接口

#### Taro.arrayBufferToBase64(arrayBuffer)

将 ArrayBuffer 数据转成 Base64 字符串。(小程序端基础库 1.1.0 开始支持，低版本需做兼容处理)

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const arrayBuffer = new Uint8Array([11, 22, 33])
const base64 = Taro.arrayBufferToBase64(arrayBuffer)
```

#### Taro.base64ToArrayBuffer(base64)

将 Base64 字符串转成 ArrayBuffer 数据。(小程序端基础库 1.1.0 开始支持，低版本需做兼容处理)

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

const base64 = 'CxYh'
const arrayBuffer = Taro.base64ToArrayBuffer(base64)
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.arrayBufferToBase64 | ✔️ | ✔️ |  |
| Taro.base64ToArrayBuffer | ✔️ | ✔️ |  |
