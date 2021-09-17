---
title: Taro.reportMonitor(name, value)
sidebar_label: reportMonitor
---

Reports monitoring results of custom service data.

**How to Use**

Before using this API, you need to create a monitor event on the Mini Program admin console by selecting **O&M Center > Performance Monitoring > Service Data Monitoring**, and configure monitoring description and alarm types. Each monitor event corresponds to a unique monitoring ID. A developer can create up to 128 monitor events.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/report/wx.reportMonitor.html)

## Type

```tsx
(name: string, value: number) => void
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
      <td>name</td>
      <td><code>string</code></td>
      <td>The monitoring ID, which is obtained after a data indicator is created on the Mini Program admin console.</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td>Reported value. After values are processed, the sum of reported values per minute is displayed on the Mini Program admin console.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.reportMonitor('1', 1)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.reportMonitor | ✔️ |  |  |
