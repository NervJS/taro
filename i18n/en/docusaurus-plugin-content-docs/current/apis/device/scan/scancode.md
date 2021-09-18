---
title: Taro.scanCode(option)
sidebar_label: scanCode
---

Opens the code scanning interface in the app to scan the code.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/scan/wx.scanCode.html)

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
      <td>onlyFromCamera</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to allow to scan code with camera only</td>
    </tr>
    <tr>
      <td>scanType</td>
      <td><code>(&quot;barCode&quot; | &quot;qrCode&quot; | &quot;datamatrix&quot; | &quot;pdf417&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Type of code to scan</td>
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
      <td>charSet</td>
      <td><code>string</code></td>
      <td>Character set of code to scan</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>If the scanned code is the QR code of the current Mini Program, this field is returned, and the content is the path carried by the QR code.</td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>Base64 encoded raw data</td>
    </tr>
    <tr>
      <td>result</td>
      <td><code>string</code></td>
      <td>Content of code to scan</td>
    </tr>
    <tr>
      <td>scanType</td>
      <td><code>&quot;QR_CODE&quot; | &quot;AZTEC&quot; | &quot;CODABAR&quot; | &quot;CODE_39&quot; | &quot;CODE_93&quot; | &quot;CODE_128&quot; | &quot;DATA_MATRIX&quot; | &quot;EAN_8&quot; | &quot;EAN_13&quot; | &quot;ITF&quot; | &quot;MAXICODE&quot; | &quot;PDF_417&quot; | &quot;RSS_14&quot; | &quot;RSS_EXPANDED&quot; | &quot;UPC_A&quot; | &quot;UPC_E&quot; | &quot;UPC_EAN_EXTENSION&quot; | &quot;WX_CODE&quot; | &quot;CODE_25&quot;</code></td>
      <td>Type of code to scan</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### ScanType

Valid values of object.scanType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>barCode</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>qrCode</td>
      <td>QR code</td>
    </tr>
    <tr>
      <td>datamatrix</td>
      <td>Data Matrix code</td>
    </tr>
    <tr>
      <td>pdf417</td>
      <td>PDF417 barcode</td>
    </tr>
  </tbody>
</table>

### QRType

Valid values of res.QRType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>QR_CODE</td>
      <td>QR code</td>
    </tr>
    <tr>
      <td>AZTEC</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>CODABAR</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>CODE_39</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>CODE_93</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>CODE_128</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>DATA_MATRIX</td>
      <td>QR code</td>
    </tr>
    <tr>
      <td>EAN_8</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>EAN_13</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>ITF</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>MAXICODE</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>PDF_417</td>
      <td>QR code</td>
    </tr>
    <tr>
      <td>RSS_14</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>RSS_EXPANDED</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>UPC_A</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>UPC_E</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>UPC_EAN_EXTENSION</td>
      <td>Barcode</td>
    </tr>
    <tr>
      <td>WX_CODE</td>
      <td>QR code</td>
    </tr>
    <tr>
      <td>CODE_25</td>
      <td>Barcode</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
// Allow to scan code with camera and select code from albums
Taro.scanCode({
  success: (res) => {
    console.log(res)
  }
})
// Only allow to scan code with camera
Taro.scanCode({
  onlyFromCamera: true,
  success: (res) => {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.scanCode | ✔️ | ✔️ | ✔️ |
