---
title: Taro.openCard(option)
sidebar_label: openCard
---

查看微信卡包中的卡券。只有通过 [认证](https://developers.weixin.qq.com/miniprogram/product/renzheng.html) 的小程序或文化互动类目的小游戏才能使用。更多文档请参考 [微信卡券接口文档](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2)。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.openCard.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| cardList | `RequestInfo[]` | 是 | 需要打开的卡券列表 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RequestInfo

需要打开的卡券列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| cardId | `string` | 卡券 ID |
| code | `string` | 由 Taro.addCard 的返回对象中的加密 code 通过解密后得到，解密请参照：[code 解码接口](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1499332673_Unm7V) |

## 示例代码

```tsx
Taro.openCard({
  cardList: [{
    cardId: '',
    code: ''
  }, {
    cardId: '',
    code: ''
  }],
  success: function (res) { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openCard | ✔️ |  |  |
