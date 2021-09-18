---
title: Taro.showLoading(option)
sidebar_label: showLoading
---

Displays the loading prompt box. `Taro.hideLoading` must be called to close the prompt box.

**Note**

- Either `Taro.showLoading` or `Taro.showToast` can be displayed.
- `Taro.showLoading` should be paired with `Taro.hideLoading`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/interaction/wx.showLoading.html)

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
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Prompt content</td>
    </tr>
    <tr>
      <td>mask</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to display a transparent mask to prevent touch penetration</td>
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
Taro.showLoading({
  title: 'loading',
})
setTimeout(function () {
  Taro.hideLoading()
}, 2000)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
