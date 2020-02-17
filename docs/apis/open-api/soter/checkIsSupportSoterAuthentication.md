---
title: Taro.checkIsSupportSoterAuthentication(option)
sidebar_label: checkIsSupportSoterAuthentication
---

获取本机支持的 SOTER 生物认证方式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSupportSoterAuthentication.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| supportMode | ("fingerPrint" or "facial" or "speech")[] | 该设备支持的可被SOTER识别的生物识别方式 |
| errMsg | `string` | 调用信息 |

### requestAuthModes

| 参数 | 说明 |
| --- | --- |
| fingerPrint | 指纹识别 |
| facial | 人脸识别 |
| speech | 声纹识别<br />API 支持度: 暂未支持 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| requestAuthModes.speech |  |  |  |

## 示例代码

```tsx
Taro.checkIsSupportSoterAuthentication({
  success: function (res) {
    // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
    // res.supportMode = ['fingerPrint'] 只支持指纹识别
    // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSupportSoterAuthentication | ✔️ |  |  |
