---
title: Taro.onKeyboardHeightChange(callback)
sidebar_label: onKeyboardHeightChange
---

Listens on the keyboard height changes

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/keyboard/wx.onKeyboardHeightChange.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

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
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>keyboard height</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onKeyboardHeightChange(res => {
  console.log(res.height)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onKeyboardHeightChange | ✔️ |  | ✔️ |
