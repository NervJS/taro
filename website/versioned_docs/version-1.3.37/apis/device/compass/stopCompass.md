---
title: Taro.stopCompass(option)
sidebar_label: stopCompass
id: version-1.3.37-stopCompass
original_id: stopCompass
---

停止监听罗盘数据

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html)

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
Taro.stopCompass()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopCompass | ✔️ | ✔️ |  |
