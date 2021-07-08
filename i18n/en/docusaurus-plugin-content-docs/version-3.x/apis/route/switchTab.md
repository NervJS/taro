---
title: Taro.switchTab(option)
sidebar_label: switchTab
---

Redirects to the tabBar page and closes all non-tabBar pages.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/route/wx.switchTab.html)

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
      <td>Path to the tabBar page (a page to be defined in the <a href="https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabbar">tabBar</a> field of app.json) to be navigated to. Parameters cannot be appended after the path.</td>
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

```json
{
  "tabBar": {
    "list": [{
      "pagePath": "index",
      "text": "Home"
    },{
      "pagePath": "other",
      "text": "Other"
    }]
  }
}
```

```tsx
Taro.switchTab({
  url: '/index'
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.switchTab | ✔️ | ✔️ | ✔️ |
