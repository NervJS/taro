---
title: Taro.setEnableDebug(res)
sidebar_label: setEnableDebug
---

设置是否打开调试开关，此开关对正式版也能生效。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html)

## 类型

```tsx
(res: Option) => Promise<Promised>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| res | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| enableDebug | `boolean` | 是 | 是否打开调试 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### Promised

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
// 打开调试
Taro.setEnableDebug({
    enableDebug: true
})
// 关闭调试
Taro.setEnableDebug({
    enableDebug: false
})
```
