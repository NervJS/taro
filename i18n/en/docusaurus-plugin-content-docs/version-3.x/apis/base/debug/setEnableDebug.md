---
title: Taro.setEnableDebug(res)
sidebar_label: setEnableDebug
---

Sets whether to enable/disable debugging switch that also takes effect in the official version.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/debug/wx.setEnableDebug.html)

## Type

```tsx
(res: Option) => Promise<Promised>
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
      <td>enableDebug</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Indicates whether to enable debugging</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### Promised

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
// Turn on debugging
Taro.setEnableDebug({
    enableDebug: true
})
// Turn off debugging
Taro.setEnableDebug({
    enableDebug: false
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setEnableDebug | ✔️ |  |  |
