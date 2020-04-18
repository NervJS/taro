---
title: Taro.chooseInvoiceTitle(option)
sidebar_label: chooseInvoiceTitle
---

选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了[微信认证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1496554031_RD4xe)的，才能调用 chooseInvoiceTitle。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td>bankAccount</td>
      <td><code>string</code></td>
      <td>银行账号</td>
    </tr>
    <tr>
      <td>bankName</td>
      <td><code>string</code></td>
      <td>银行名称</td>
    </tr>
    <tr>
      <td>companyAddress</td>
      <td><code>string</code></td>
      <td>单位地址</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>taxNumber</td>
      <td><code>string</code></td>
      <td>抬头税号</td>
    </tr>
    <tr>
      <td>telephone</td>
      <td><code>string</code></td>
      <td>手机号码</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td>抬头名称</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>0 | 1</code></td>
      <td>抬头类型</td>
    </tr>
  </tbody>
</table>

### invoice_type

抬头类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td><code>&quot;单位&quot;</code></td>
    </tr>
    <tr>
      <td>1</td>
      <td><code>&quot;个人&quot;</code></td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseInvoiceTitle({
  success: function(res) {}
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseInvoiceTitle | ✔️ |  |  |
