---
title: Taro.showLoading(option)
sidebar_label: showLoading
---

显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框

**注意**
- Taro.showLoading 和 Taro.showToast 同时只能显示一个
- Taro.showLoading 应与 Taro.hideLoading 配对使用

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| title | `string` | 是 | 提示的内容 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| mask | `boolean` | 否 | 是否显示透明蒙层，防止触摸穿透 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.showLoading({
  title: '加载中',
})
setTimeout(function () {
  Taro.hideLoading()
}, 2000)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
