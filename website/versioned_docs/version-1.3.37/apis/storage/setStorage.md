---
title: Taro.setStorage(option)
sidebar_label: setStorage
id: version-1.3.37-setStorage
original_id: setStorage
---

将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | `any` | 是 | 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 |
| key | `string` | 是 | 本地缓存中指定的 key |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setStorage({
  key:"key",
  data:"value"
})
```
```tsx
try {
  Taro.setStorageSync('key', 'value')
} catch (e) { }
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setStorage | ✔️ | ✔️ | ✔️ |
