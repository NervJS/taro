---
title: Taro.showToast(option)
sidebar_label: showToast
---

Displays the message prompt box.

**Note**
- Either `Taro.showLoading` or `Taro.showToast` can be displayed.
- `Taro.showToast` should be paired with `Taro.hideToast`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/interaction/wx.showToast.html)

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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The delay time for a prompt</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>icon</td>
      <td><code>&quot;success&quot; | &quot;loading&quot; | &quot;none&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Icon</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The local path of the custom icon. image has priority over icon.</td>
    </tr>
    <tr>
      <td>mask</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to display a transparent mask to prevent touch penetration</td>
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
Taro.showToast({
  title: 'Success',
  icon: 'success',
  duration: 2000
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
