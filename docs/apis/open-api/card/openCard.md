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
      <td>需要打开的卡券列表</td>
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
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RequestInfo

需要打开的卡券列表

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
      <td>cardId</td>
      <td><code>string</code></td>
      <td>卡券 ID</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string</code></td>
      <td>由 Taro.addCard 的返回对象中的加密 code 通过解密后得到，解密请参照：<a href="https://mp.weixin.qq.com/wiki?t=resource/res_main&amp;id=mp1499332673_Unm7V">code 解码接口</a></td>
    </tr>
  </tbody>
</table>

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
