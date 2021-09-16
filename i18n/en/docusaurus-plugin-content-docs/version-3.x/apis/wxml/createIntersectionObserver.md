---
title: Taro.createIntersectionObserver(component, options)
sidebar_label: createIntersectionObserver
---

Creates and returns an IntersectionObserver object instance. In a custom component or a page that contains a custom component, use `this.createIntersectionObserver([options])` instead.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/wx.createIntersectionObserver.html)

## Type

```tsx
(component: Record<string, any>, options?: Option) => IntersectionObserver
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
      <td>initialRatio</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The initial intersection ratio. If the intersection ratio detected at the time of the call is not equal to this value and reaches the threshold, the callback function of the listener is triggered.</td>
    </tr>
    <tr>
      <td>observeAll</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to observe more than one target node simultaneously. If the value is set to "true", the targetSelector of observe will select multiple nodes. (Note: selecting too many nodes at the same time will affect rendering performance.)</td>
    </tr>
    <tr>
      <td>thresholds</td>
      <td><code>number[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An array of values, which​contains all thresholds.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createIntersectionObserver | ✔️ |  |  |
