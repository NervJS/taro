---
title: Taro.navigateBackMiniProgram(option)
sidebar_label: navigateBackMiniProgram
id: version-1.3.37-navigateBackMiniProgram
original_id: navigateBackMiniProgram
---

返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功

注意：**微信客户端 iOS 6.5.9，Android 6.5.10 及以上版本支持**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| extraData | `Record<string, any>` | 否 | 需要返回给上一个小程序的数据，上一个小程序可在 `App.onShow` 中获取到这份数据。 [详情](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)。 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.navigateBackMiniProgram({
  extraData: {
    foo: 'bar'
  },
  success: function (res) {
    // 返回成功
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateBackMiniProgram | ✔️ |  |  |
