---
title: Taro.openCard(option)
sidebar_label: openCard
---

Views cards and offers in WeChat Cards & Offers. It can be used only in Mini Programs or cultural interaction Mini Games that complete [verification](https://developers.weixin.qq.com/miniprogram/product/renzheng.html). For more documents, see [API Documentation for WeChat Cards & Offers](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/card/wx.openCard.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardList</td>
      <td><code>RequestInfo[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The list of cards and offers to be opened</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### RequestInfo

object.cardList is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cardId</td>
      <td><code>string</code></td>
      <td>The ID of the card or offer</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string</code></td>
      <td>It is obtained after the encrypted code in the objects returned by <a href="https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/card/wx.addCard.html">Taro.addCard</a> is decrypted. For details, see <a href="https://developers.weixin.qq.com/doc/offiaccount/Cards_and_Offer/Coupons-Mini_Program_Start_Up.html">Code Decryption API</a></td>
    </tr>
  </tbody>
</table>

## Sample Code

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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openCard | ✔️ |  |  |
