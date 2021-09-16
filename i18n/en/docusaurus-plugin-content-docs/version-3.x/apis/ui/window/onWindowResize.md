---
title: Taro.onWindowResize(callback)
sidebar_label: onWindowResize
---

Listens on the window size change event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/window/wx.onWindowResize.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the window size change event.

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>size</td>
      <td><code>Size</code></td>
    </tr>
  </tbody>
</table>

### Size

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
      <td>windowHeight</td>
      <td><code>number</code></td>
      <td>New window width (in px)</td>
    </tr>
    <tr>
      <td>windowWidth</td>
      <td><code>number</code></td>
      <td>New window height (in px)</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onWindowResize | ✔️ | ✔️ | ✔️ |
