---
title: Taro.requestPayment(option)
sidebar_label: requestPayment
id: version-2.1.1-requestPayment
original_id: requestPayment
---

发起微信支付。了解更多信息，请查看[微信支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html)

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
      <td>nonceStr</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>随机字符串，长度为32个字符以下</td>
    </tr>
    <tr>
      <td>package</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***</td>
    </tr>
    <tr>
      <td>paySign</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>签名，具体签名方案参见 <a href="https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&amp;index=3">小程序支付接口文档</a></td>
    </tr>
    <tr>
      <td>timeStamp</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间</td>
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
      <td>signType</td>
      <td><code>&quot;MD5&quot; | &quot;HMAC-SHA256&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>签名算法</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### signType

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>MD5</td>
      <td>MD5</td>
    </tr>
    <tr>
      <td>HMAC-SHA256</td>
      <td>HMAC-SHA256</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
  success: function (res) { },
  fail: function (res) { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.requestPayment | ✔️ | ✔️ |  |
