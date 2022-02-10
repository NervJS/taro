---
title: Taro.startHCE(option)
sidebar_label: startHCE
---

初始化 NFC 模块。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.NFCError>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| aid_list | `string[]` | 是 | 需要注册到系统的 AID 列表 |
| complete | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.NFCError) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.startHCE({
  aid_list: ['F222222222']
  success: function (res) {
    console.log(res.errMsg)
  }
})
```
