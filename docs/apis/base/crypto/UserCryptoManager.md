---
title: UserCryptoManager
sidebar_label: UserCryptoManager
---

用户加密模块

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.html)

## 方法

### getLatestUserKey

获取最新的用户加密密钥

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getLatestUserKey.html)

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

#### 示例代码

```tsx
const userCryptoManager = Taro.getUserCryptoManager()
userCryptoManager.getLatestUserKey({
  success: res => {
    const { encryptKey, iv, version, expireTime } = res
    console.log(encryptKey, iv, version, expireTime)
  }
})
```

### getRandomValues

获取密码学安全随机数

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getRandomValues.html)

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

#### 示例代码

```tsx
Taro.getRandomValues({
  length: 6 // 生成 6 个字节长度的随机数,
  success: res => {
    console.log(Taro.arrayBufferToBase64(res.randomValues)) // 转换为 base64 字符串后打印
  }
})
```

## 参数

### getLatestUserKey

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: SuccessCallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| encryptKey | `string` | 用户加密密钥 |
| iv | `string` | 密钥初始向量 |
| version | `number` | 密钥版本 |
| expireTime | `number` | 密钥过期时间 |

### getRandomValues

#### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| length | `number` | 是 | 整数，生成随机数的字节数，最大 1048576 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: SuccessCallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

#### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| randomValues | `ArrayBuffer` | 随机数内容，长度为传入的字节数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| UserCryptoManager | ✔️ |  |  |
| UserCryptoManager.getLatestUserKey | ✔️ |  |  |
| UserCryptoManager.getRandomValues | ✔️ |  |  |
