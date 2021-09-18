---
title: Taro.addCard(option)
sidebar_label: addCard
---

Adds cards and offers in batch. It can be used only in Mini Programs or cultural interaction Mini Games that complete [verification](https://developers.weixin.qq.com/miniprogram/product/renzheng.html). For more documents, see [API Documentation for WeChat Cards & Offers](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2).

**cardExt Description**
The extended parameter of the card or offer. It must be passed as a JSON-serialized string.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/card/wx.addCard.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>The list of cards and offers to be added</td>
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
      <td>cardExt</td>
      <td><code>string</code></td>
      <td>The extended parameter of the card or offer. It must be passed as a JSON-serialized <strong>string</strong>.</td>
    </tr>
    <tr>
      <td>cardId</td>
      <td><code>string</code></td>
      <td>The ID of the card or offer</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>cardList</td>
      <td><code>AddCardResponseInfo[]</code></td>
      <td>The list of cards and offers to be added</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### AddCardResponseInfo

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
      <td>cardExt</td>
      <td><code>string</code></td>
      <td>The extended parameter of the card or offer. See description above for the composition of this parameter.</td>
    </tr>
    <tr>
      <td>cardId</td>
      <td><code>string</code></td>
      <td>The ID of the card or offer claimed by the user</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string</code></td>
      <td>Encrypted code. It is a string obtained after the code of the card or offer claimed by the user is encrypted. To decrypt the code, see <a href="https://developers.weixin.qq.com/doc/offiaccount/Cards_and_Offer/Coupons-Mini_Program_Start_Up.html">Code Decryption API</a>.</td>
    </tr>
    <tr>
      <td>isSuccess</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the card or offer is successfully claimed</td>
    </tr>
  </tbody>
</table>

## Sample Code

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
    console.log(res.cardList) // The results of card and offer addition
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.addCard | ✔️ |  |  |
