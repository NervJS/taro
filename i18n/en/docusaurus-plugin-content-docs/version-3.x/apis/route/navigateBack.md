---
title: Taro.navigateBack(option)
sidebar_label: navigateBack
---

Closes the current page and returns to the previous page or multi-level page. The current page stack can be obtained via `getCurrentPages` to determine the number of layers to be returned.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/route/wx.navigateBack.html)

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
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>delta</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Number of pages returned. The home page is navigated to if delta is greater than the current number of pages.</td>
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
// Note: When calling navigateTo, the page that calls this method is added to the stack, but the redirectTo method will not. See the sample code below.
// This is Page A
Taro.navigateTo({
  url: 'B?id=1'
})
// This is Page B
Taro.navigateTo({
  url: 'C?id=1'
})
// Calling navigateBack on Page C will return to Page A
Taro.navigateBack({
  delta: 2
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateBack | ✔️ | ✔️ | ✔️ |
