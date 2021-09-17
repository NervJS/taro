---
title: Taro.setClipboardData(option)
sidebar_label: setClipboardData
---

Sets the content on the system clipboard.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/clipboard/wx.setClipboardData.html)

## Type

```tsx
(option: Option) => Promise<Promised>
```

## Parameters

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
      <td>Call result</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string</code></td>
      <td>The clipboard content</td>
    </tr>
  </tbody>
</table>

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
      <td>data</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The clipboard content</td>
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

## Sample Code

```tsx
Taro.setClipboardData({
  data: 'data',
  success: function (res) {
    Taro.getClipboardData({
      success: function (res) {
        console.log(res.data) // data
      }
    })
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setClipboardData | ✔️ | ✔️ | ✔️ |
