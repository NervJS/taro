---
title: Taro.showTabBarRedDot(option)
sidebar_label: showTabBarRedDot
---

Displays the red dot in the upper right corner of a tabBar item.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/tab-bar/wx.showTabBarRedDot.html)

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
      <td>index</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Specifies which item of tabBar, starting from the left</td>
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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showTabBarRedDot | ✔️ | ✔️ | ✔️ |
