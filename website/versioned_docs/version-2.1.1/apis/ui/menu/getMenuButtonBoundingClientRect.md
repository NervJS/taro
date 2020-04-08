---
title: Taro.getMenuButtonBoundingClientRect()
sidebar_label: getMenuButtonBoundingClientRect
id: version-2.1.1-getMenuButtonBoundingClientRect
original_id: getMenuButtonBoundingClientRect
---

获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)

## 类型

```tsx
() => Rect
```

## 参数

### Rect

菜单按钮的布局位置信息

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>下边界坐标，单位：px</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>高度，单位：px</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>左边界坐标，单位：px</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>右边界坐标，单位：px</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>上边界坐标，单位：px</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>宽度，单位：px</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getMenuButtonBoundingClientRect | ✔️ |  |  |
