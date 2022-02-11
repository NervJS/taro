---
title: NFCAdapter
sidebar_label: NFCAdapter
---

NFC 实例

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.html)

## 方法

### getIsoDep

获取IsoDep实例，实例支持ISO-DEP (ISO 14443-4)标准的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getIsoDep.html)

```tsx
() => IsoDep
```

### getMifareClassic

获取MifareClassic实例，实例支持MIFARE Classic标签的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getMifareClassic.html)

```tsx
() => MifareClassic
```

### getMifareUltralight

获取MifareUltralight实例，实例支持MIFARE Ultralight标签的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getMifareUltralight.html)

```tsx
() => MifareUltralight
```

### getNdef

获取Ndef实例，实例支持对NDEF格式的NFC标签上的NDEF数据的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNdef.html)

```tsx
() => Ndef
```

### getNfcA

获取NfcA实例，实例支持NFC-A (ISO 14443-3A)标准的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcA.html)

```tsx
() => NfcA
```

### getNfcB

获取NfcB实例，实例支持NFC-B (ISO 14443-3B)标准的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcB.html)

```tsx
() => NfcB
```

### getNfcF

获取NfcF实例，实例支持NFC-F (JIS 6319-4)标准的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcF.html)

```tsx
() => NfcB
```

### getNfcV

获取NfcV实例，实例支持NFC-V (ISO 15693)标准的读写

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.getNfcV.html)

```tsx
() => NfcV
```

### offDiscovered

取消监听 NFC Tag

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.offDiscovered.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听 NFC Tag的回调函数 |

### onDiscovered

监听 NFC Tag

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.onDiscovered.html)

```tsx
(callback: Callback) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `Callback` | 监听 NFC Tag的回调函数 |

### startDiscovery

开始扫描NFC标签

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.startDiscovery.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### stopDiscovery

关闭NFC标签扫描

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/NFCAdapter.stopDiscovery.html)

```tsx
(option?: Option) => Promise<TaroGeneral.NFCError>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

## 参数

### onDiscovered

#### Callback

监听 NFC Tag的回调函数

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

#### CallbackResult

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| techs | `string[]` | 是 | tech 数组，用于匹配NFC卡片具体可以使用什么标准（NfcA等实例）处理 |
| messages | `NdefMessage[]` | 是 | NdefMessage 数组，消息格式为 {id: ArrayBuffer, type: ArrayBuffer, payload: ArrayBuffer} |
| uid | `ArrayBuffer` | 否 | NFC标签的UID<br />API 支持度: tt |

#### NdefMessage

| 参数 | 类型 |
| --- | --- |
| id | `ArrayBuffer` |
| type | `ArrayBuffer` |
| payload | `ArrayBuffer` |

### startDiscovery

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

### stopDiscovery

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| NFCAdapter | ✔️ |  |  |  |
| NFCAdapter.getIsoDep | ✔️ |  |  |  |
| NFCAdapter.getMifareClassic | ✔️ | ✔️ |  |  |
| NFCAdapter.getMifareUltralight | ✔️ |  |  |  |
| NFCAdapter.getNdef | ✔️ |  |  |  |
| NFCAdapter.getNfcA | ✔️ | ✔️ |  |  |
| NFCAdapter.getNfcB | ✔️ |  |  |  |
| NFCAdapter.getNfcF | ✔️ |  |  |  |
| NFCAdapter.getNfcV | ✔️ |  |  |  |
| NFCAdapter.offDiscovered | ✔️ | ✔️ |  |  |
| NFCAdapter.onDiscovered | ✔️ | ✔️ |  |  |
| NFCAdapter.startDiscovery | ✔️ | ✔️ |  |  |
| NFCAdapter.stopDiscovery | ✔️ | ✔️ |  |  |
