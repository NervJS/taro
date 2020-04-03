---
title: Taro.navigateBack(option)
sidebar_label: navigateBack
id: version-1.3.37-navigateBack
original_id: navigateBack
---

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| delta | `number` | 否 | 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
// 此处是A页面
Taro.navigateTo({
  url: 'B?id=1'
})
// 此处是B页面
Taro.navigateTo({
  url: 'C?id=1'
})
// 在C页面内 navigateBack，将返回A页面
Taro.navigateBack({
  delta: 2
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |
