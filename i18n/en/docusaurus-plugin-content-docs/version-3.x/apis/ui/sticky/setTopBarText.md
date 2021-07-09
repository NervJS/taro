---
title: Taro.setTopBarText(option)
sidebar_label: setTopBarText
---

Dynamically sets the text in the top bar. The content takes effect only when the current Mini Program is sticky on top. Otherwise, the call can succeed but the settings will not take effect until the Mini Program is sticky on top.

**Note**
- When this API is successfully called, you must wait for at least 5 seconds to call it again. Otherwise, the callback will fail, and an errMsg of "setTopBarText: fail invoke too frequently" will appear.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/sticky/wx.setTopBarText.html)

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
      <td>text</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The text in the top bar</td>
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
Taro.setTopBarText({
  text: 'hello, world!'
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTopBarText | ✔️ |  |  |
