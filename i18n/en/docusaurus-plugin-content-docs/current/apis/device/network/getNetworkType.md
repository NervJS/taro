---
title: Taro.getNetworkType(option)
sidebar_label: getNetworkType
---

Gets the network type.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/network/wx.getNetworkType.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td>networkType</td>
      <td><code>&quot;wifi&quot; | &quot;2g&quot; | &quot;3g&quot; | &quot;4g&quot; | &quot;unknown&quot; | &quot;none&quot;</code></td>
      <td>Network type</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### networkType

Valid values of res.networkType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>wifi</td>
      <td>wifi network</td>
    </tr>
    <tr>
      <td>2g</td>
      <td>2g network</td>
    </tr>
    <tr>
      <td>3g</td>
      <td>3g network</td>
    </tr>
    <tr>
      <td>4g</td>
      <td>4g network</td>
    </tr>
    <tr>
      <td>unknown</td>
      <td>Uncommon network types for Android</td>
    </tr>
    <tr>
      <td>none</td>
      <td>No network</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getNetworkType({
  success: function (res)) {
    var networkType = res.networkType
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getNetworkType | ✔️ | ✔️ | ✔️ |
