---
title: Taro.clearStorage(option)
sidebar_label: clearStorage
id: version-1.3.37-clearStorage
original_id: clearStorage
---

清理本地数据缓存

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.clearStorage()
```

```tsx
try {
  Taro.clearStorageSync()
} catch(e) {
  // Do something when catch error
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.clearStorage | ✔️ | ✔️ | ✔️ |
