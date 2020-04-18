---
title: Taro.scanCode(option)
sidebar_label: scanCode
id: version-2.1.1-scancode
original_id: scancode
---

调起客户端扫码界面，扫码成功后返回对应的结果

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html)

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
      <td>onlyFromCamera</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否只能从相机扫码，不允许从相册选择图片</td>
    </tr>
    <tr>
      <td>scanType</td>
      <td><code>(&quot;barCode&quot; | &quot;qrCode&quot; | &quot;datamatrix&quot; | &quot;pdf417&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>扫码类型</td>
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
      <td>charSet</td>
      <td><code>string</code></td>
      <td>所扫码的字符集</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path</td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>原始数据，base64编码</td>
    </tr>
    <tr>
      <td>result</td>
      <td><code>string</code></td>
      <td>所扫码的内容</td>
    </tr>
    <tr>
      <td>scanType</td>
      <td><code>&quot;QR_CODE&quot; | &quot;AZTEC&quot; | &quot;CODABAR&quot; | &quot;CODE_39&quot; | &quot;CODE_93&quot; | &quot;CODE_128&quot; | &quot;DATA_MATRIX&quot; | &quot;EAN_8&quot; | &quot;EAN_13&quot; | &quot;ITF&quot; | &quot;MAXICODE&quot; | &quot;PDF_417&quot; | &quot;RSS_14&quot; | &quot;RSS_EXPANDED&quot; | &quot;UPC_A&quot; | &quot;UPC_E&quot; | &quot;UPC_EAN_EXTENSION&quot; | &quot;WX_CODE&quot; | &quot;CODE_25&quot;</code></td>
      <td>所扫码的类型</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### ScanType

扫码类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>barCode</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>qrCode</td>
      <td>二维码</td>
    </tr>
    <tr>
      <td>datamatrix</td>
      <td>Data Matrix 码</td>
    </tr>
    <tr>
      <td>pdf417</td>
      <td>PDF417 条码</td>
    </tr>
  </tbody>
</table>

### QRType

所扫码的类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>QR_CODE</td>
      <td>二维码</td>
    </tr>
    <tr>
      <td>AZTEC</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>CODABAR</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>CODE_39</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>CODE_93</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>CODE_128</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>DATA_MATRIX</td>
      <td>二维码</td>
    </tr>
    <tr>
      <td>EAN_8</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>EAN_13</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>ITF</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>MAXICODE</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>PDF_417</td>
      <td>二维码</td>
    </tr>
    <tr>
      <td>RSS_14</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>RSS_EXPANDED</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>UPC_A</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>UPC_E</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>UPC_EAN_EXTENSION</td>
      <td>一维码</td>
    </tr>
    <tr>
      <td>WX_CODE</td>
      <td>二维码</td>
    </tr>
    <tr>
      <td>CODE_25</td>
      <td>一维码</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// 允许从相机和相册扫码
Taro.scanCode({
  success: (res) => {
    console.log(res)
  }
})
      // 只允许从相机扫码
Taro.scanCode({
  onlyFromCamera: true,
  success: (res) => {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.scanCode | ✔️ | ✔️ |  |
