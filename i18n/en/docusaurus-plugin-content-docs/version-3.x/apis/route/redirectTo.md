---
title: Taro.redirectTo(option)
sidebar_label: redirectTo
---

Closes the current page and redirects to a page (except for the tabbar page) in the app.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/route/wx.redirectTo.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Path to a non-tabBar page to be navigated to in the app. Parameters can be appended after the path. You can use <code>?</code> to separate the path from parameters, <code>=</code> to connect a parameter key with a parameter value, and <code>&amp;</code> to separate different parameters. For example, 'path?key=value&key2=value2'.</td>
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

## Sample Code

```tsx
Taro.redirectTo({
  url: 'test?id=1'
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.redirectTo | ✔️ | ✔️ | ✔️ |
