---
title: Taro.navigateTo(option)
sidebar_label: navigateTo
---

Keeps the current page open and redirects to a page (except for the tabbar page) in the app. You can return to the original page using `Taro.navigateBack`. The page stack in the WeChat Mini-Program is limited to ten layers.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/route/wx.navigateTo.html)

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
      <td>
      Path to a non-tabBar page to be navigated to in the app. Parameters can be appended after the path. You can use <code>?</code> to separate the path from parameters, <code>=</code> to connect a parameter key with a parameter value, and <code>&amp;</code> to separate different parameters. For example, 'path?key=value&amp;key2=value2'.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>events</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Inter-page communication interface for listening to data sent to the current page by the opened page.</td>
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
Taro.navigateTo({
  url: 'test?id=1',
  events: {
    acceptDataFromOpenedPage: function(data) {
      console.log(data)
    },
    someEvent: function(data) {
      console.log(data)
    }
    ...
  },
  success: function (res) {
    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
