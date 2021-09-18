---
title: Taro.showShareMenu(option)
sidebar_label: showShareMenu
---

Displays the Forward button on the current page.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/share/wx.showShareMenu.html)

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
      <td>withShareTicket</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to forward with shareTicket.<a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share.html">Detail</a></td>
    </tr>
    <tr>
      <td>showShareItems</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>(Only for QQ) QQ Mini-Program sharing function, support sharing to QQ, Qzone, WeChat friends, WeChat friends circle.<br />- ['qq', 'qzone', 'wechatFriends', 'wechatMoment']</td>
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

#### API Support

| API | WeChat Mini-Program | QQ Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Option.showShareItems |  | ✔️ |  |  |

## Sample Code

```tsx
Taro.showShareMenu({
  withShareTicket: true
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showShareMenu | ✔️ |  |  |
