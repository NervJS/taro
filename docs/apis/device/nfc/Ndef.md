---
title: Ndef
sidebar_label: Ndef
---

Ndef 标签

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.html)

## 方法

### close

断开连接

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.close.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### connect

连接 NFC 标签

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.connect.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### isConnected

检查是否已连接

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.isConnected.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### offNdefMessage

取消监听 Ndef 消息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.offNdefMessage.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听 Ndef 消息回调函数 |

### onNdefMessage

监听 Ndef 消息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.onNdefMessage.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听 Ndef 消息回调函数 |

### setTimeout

设置超时时间

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.setTimeout.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### writeNdefMessage

重写 Ndef 标签内容

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/Ndef.writeNdefMessage.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

## 参数

### close

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

### connect

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

### isConnected

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

### onNdefMessage

#### Callback

监听 Ndef 消息回调函数

```tsx
(args: unknown[]) => void
```

| 参数 | 类型 |
| --- | --- |
| args | `unknown[]` |

### setTimeout

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| timeout | `number` | 是 | 设置超时时间 (ms) |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

### writeNdefMessage

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| uris | `string[]` | 是 | uri 数组 |
| texts | `string[]` | 是 | text 数组 |
| records | `record[]` | 是 | 二进制对象数组, 需要指明 id, type 以及 payload (均为 ArrayBuffer 类型) |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

#### record

| 参数 | 类型 |
| --- | --- |
| id | `ArrayBuffer` |
| type | `ArrayBuffer` |
| payload | `ArrayBuffer` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Ndef | ✔️ |  |  |
| Ndef.close | ✔️ |  |  |
| Ndef.connect | ✔️ |  |  |
| Ndef.isConnected | ✔️ |  |  |
| Ndef.offNdefMessage | ✔️ |  |  |
| Ndef.onNdefMessage | ✔️ |  |  |
| Ndef.setTimeout | ✔️ |  |  |
| Ndef.writeNdefMessage | ✔️ |  |  |
