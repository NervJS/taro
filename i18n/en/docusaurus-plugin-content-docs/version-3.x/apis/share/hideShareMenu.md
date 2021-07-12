---
title: Taro.hideShareMenu(option)
sidebar_label: hideShareMenu
---

Hides the Forward button.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/share/wx.hideShareMenu.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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

## Sample Code

```tsx
Taro.hideShareMenu()
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.hideShareMenu | ✔️ |  |  |
