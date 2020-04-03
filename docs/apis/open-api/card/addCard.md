---
title: Taro.addCard(option)
sidebar_label: addCard
---

批量添加卡券。只有通过 [认证](https://developers.weixin.qq.com/miniprogram/product/renzheng.html) 的小程序或文化互动类目的小游戏才能使用。更多文档请参考 [微信卡券接口文档](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2)。

**cardExt 说明**
cardExt 是卡券的扩展参数，其值是一个 JSON 字符串。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardList</td>
      <td><code>RequestInfo[]</code></td>
      <td style="text-align:center">是</td>
      <td>需要添加的卡券列表</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RequestInfo

需要添加的卡券列表

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardExt</td>
      <td><code>string</code></td>
      <td>卡券的扩展参数。需将 CardExt 对象 JSON 序列化为<strong>字符串</strong>传入</td>
    </tr>
    <tr>
      <td>cardId</td>
      <td><code>string</code></td>
      <td>卡券 ID</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardList</td>
      <td><code>AddCardResponseInfo[]</code></td>
      <td>卡券添加结果列表</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### AddCardResponseInfo

卡券添加结果列表

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardExt</td>
      <td><code>string</code></td>
      <td>卡券的扩展参数，结构请参考下文</td>
    </tr>
    <tr>
      <td>cardId</td>
      <td><code>string</code></td>
      <td>用户领取到卡券的 ID</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string</code></td>
      <td>加密 code，为用户领取到卡券的code加密后的字符串，解密请参照：<a href="https://mp.weixin.qq.com/wiki?t=resource/res_main&amp;id=mp1499332673_Unm7V">code 解码接口</a></td>
    </tr>
    <tr>
      <td>isSuccess</td>
      <td><code>boolean</code></td>
      <td>是否成功</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.addCard({
  cardList: [
    {
      cardId: '',
      cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
    }, {
      cardId: '',
      cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
    }
  ],
  success: function (res) {
    console.log(res.cardList) // 卡券添加结果
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.addCard | ✔️ |  |  |
