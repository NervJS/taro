---
title: Taro.startPullDownRefresh(option)
sidebar_label: startPullDownRefresh
---

Starts swipe-down-to-refresh. The swipe-down-to-refresh animation is triggered after the call, which performs consistently with swipe-down-to-refresh by users.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html)

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
Taro.startPullDownRefresh()
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startPullDownRefresh | ✔️ | ✔️ | ✔️(No animation effects) |
