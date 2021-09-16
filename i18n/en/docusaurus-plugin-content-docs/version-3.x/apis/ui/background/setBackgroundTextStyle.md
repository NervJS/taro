---
title: Taro.setBackgroundTextStyle(option)
sidebar_label: setBackgroundTextStyle
---

Dynamically sets the style of the text and the loading image in the pull-down background.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/background/wx.setBackgroundTextStyle.html)

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
      <td>textStyle</td>
      <td><code>&quot;dark&quot; | &quot;light&quot;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The style of the text and the loading image in the pull-down background. <br /><br />Enum: <br />- 'dark': In dark style;<br />- 'light': In light style;</td>
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
Taro.setBackgroundTextStyle({
  textStyle: 'dark' // Yes | The style of the text and the loading image is dark. 
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundTextStyle | ✔️ |  | ✔️ (Only iOS) |
