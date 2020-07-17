---
title: Taro.onWindowResize(callback)
sidebar_label: onWindowResize
id: version-2.1.1-onWindowResize
original_id: onWindowResize
---

监听窗口尺寸变化事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

窗口尺寸变化事件的回调函数

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>windowHeight</td>
      <td><code>number</code></td>
      <td>变化后的窗口高度，单位 px</td>
    </tr>
    <tr>
      <td>windowWidth</td>
      <td><code>number</code></td>
      <td>变化后的窗口宽度，单位 px</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onWindowResize | ✔️ | ✔️ |  |
