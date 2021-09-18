---
title: Taro.getMenuButtonBoundingClientRect()
sidebar_label: getMenuButtonBoundingClientRect
---

Gets the location of the menu button (the Mini Program control button in the upper right corner). The top left corner of the screen is the origin.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)

## Type

```tsx
() => Rect
```

## Parameters

### Rect

The location of the menu button

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
      <td>width</td>
      <td><code>number</code></td>
      <td>Width (in px)</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Height (in px)</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>The coordinate of the upper boundary (in px)</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>The coordinate of the right boundary (in px)</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>The coordinate of the left boundary (in px)</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>The coordinate of the bottom boundary (in px)</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getMenuButtonBoundingClientRect | ✔️ |  |  |
