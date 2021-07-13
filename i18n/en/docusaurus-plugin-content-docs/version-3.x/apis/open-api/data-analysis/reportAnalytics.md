---
title: Taro.reportAnalytics(eventName, data)
sidebar_label: reportAnalytics
---

Reports custom analysis data. Before using this API, you need to create an event in **Custom Analysis** on the Mini Program admin console, and configure the event name and fields.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/data-analysis/wx.reportAnalytics.html)

## Type

```tsx
(eventName: string, data: Record<string, any>) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>eventName</td>
      <td><code>string</code></td>
      <td>The event name.</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The reported custom analysis data.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.reportAnalytics('purchase', {
  price: 120,
  color: 'red'
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.reportAnalytics | ✔️ |  |  |
