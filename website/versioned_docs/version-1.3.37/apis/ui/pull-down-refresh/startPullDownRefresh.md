---
title: Taro.startPullDownRefresh(option)
sidebar_label: startPullDownRefresh
id: version-1.3.37-startPullDownRefresh
original_id: startPullDownRefresh
---

开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html)

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
Taro.startPullDownRefresh()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startPullDownRefresh | ✔️ | ✔️ | ✔️(无动画效果) |
