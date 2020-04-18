---
title: Taro.chooseAddress(option)
sidebar_label: chooseAddress
id: version-2.1.1-chooseAddress
original_id: chooseAddress
---

获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html)

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
      <td>cityName</td>
      <td><code>string</code></td>
      <td>国标收货地址第二级地址</td>
    </tr>
    <tr>
      <td>countyName</td>
      <td><code>string</code></td>
      <td>国标收货地址第三级地址</td>
    </tr>
    <tr>
      <td>detailInfo</td>
      <td><code>string</code></td>
      <td>详细收货地址信息</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>nationalCode</td>
      <td><code>string</code></td>
      <td>收货地址国家码</td>
    </tr>
    <tr>
      <td>postalCode</td>
      <td><code>string</code></td>
      <td>邮编</td>
    </tr>
    <tr>
      <td>provinceName</td>
      <td><code>string</code></td>
      <td>国标收货地址第一级地址</td>
    </tr>
    <tr>
      <td>telNumber</td>
      <td><code>string</code></td>
      <td>收货人手机号码</td>
    </tr>
    <tr>
      <td>userName</td>
      <td><code>string</code></td>
      <td>收货人姓名</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseAddress({
  success: function (res) {
    console.log(res.userName)
    console.log(res.postalCode)
    console.log(res.provinceName)
    console.log(res.cityName)
    console.log(res.countyName)
    console.log(res.detailInfo)
    console.log(res.nationalCode)
    console.log(res.telNumber)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseAddress | ✔️ |  |  |
