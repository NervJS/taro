---
title: Taro.navigateBackMiniProgram(option)
sidebar_label: navigateBackMiniProgram
---

Returns to the previous Mini Program. It can be called only when the current Mini Program is opened from another Mini Program.

**Note: This API is supported as of WeChat 6.5.9 for iOS and 6.5.10 for Android.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html)

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
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The data that needs to be returned to the previous Mini Program. The previous Mini Program can get this data from <code>App.onShow</code>.<a href="https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html">Details</a>。</td>
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
Taro.navigateBackMiniProgram({
  extraData: {
    foo: 'bar'
  },
  success: function (res) {
    // Successful call
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateBackMiniProgram | ✔️ |  |  |
