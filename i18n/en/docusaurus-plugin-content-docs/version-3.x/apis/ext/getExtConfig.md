---
title: Taro.getExtConfig(option)
sidebar_label: getExtConfig
---

Gets the data field customized by the [third-party platform](https://developers.weixin.qq.com/miniprogram/en/dev/devtools/ext.html).

**Tips**
- The compatibility of this API cannot be determined via `Taro.canIUse` currently. You need to figure out yourself whether `Taro.getExtConfig` exists and is compatible with the API.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ext/wx.getExtConfig.html)

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
      <td>extConfig</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Data customized by the third-party platform</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
if(Taro.getExtConfig) {
  Taro.getExtConfig({
    success: function (res) {
      console.log(res.extConfig)
    }
  })
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getExtConfig | ✔️ |  |  |
