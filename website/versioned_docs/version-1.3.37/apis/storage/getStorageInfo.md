---
title: Taro.getStorageInfo(option)
sidebar_label: getStorageInfo
id: version-1.3.37-getStorageInfo
original_id: getStorageInfo
---

异步获取当前storage的相关信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfo.html)

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
| success | `(option: SuccessCallbackOption) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackOption

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| currentSize | `number` | 当前占用的空间大小, 单位 KB |
| keys | `string[]` | 当前 storage 中所有的 key |
| limitSize | `number` | 限制的空间大小，单位 KB |

## 示例代码

```tsx
Taro.getStorageInfo({
  success: function (res) {
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
  }
})
```

```tsx
try {
  const res = Taro.getStorageInfoSync()
  console.log(res.keys)
  console.log(res.currentSize)
  console.log(res.limitSize)
} catch (e) {
  // Do something when catch error
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageInfo | ✔️ | ✔️ | ✔️ |
