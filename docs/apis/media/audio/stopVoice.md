---
title: Taro.stopVoice(option)
sidebar_label: stopVoice
---

结束播放语音。
**注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](./createInnerAudioContext) 接口**

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

### 示例 1

```tsx
Taro.startRecord({
  success: function (res) {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  }
})
```

### 示例 2

```tsx
Taro.startRecord(params).then(res => {
  const filePath = res.tempFilePath
  Taro.playVoice({ filePath })

  setTimeout(Taro.stopVoice, 5000)
})
```
