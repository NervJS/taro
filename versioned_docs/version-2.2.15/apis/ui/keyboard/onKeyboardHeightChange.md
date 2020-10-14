---
title: Taro.onKeyboardHeightChange(callback)
sidebar_label: onKeyboardHeightChange
---

监听键盘高度变化

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.onKeyboardHeightChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

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
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>键盘高度</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onKeyboardHeightChange(res => {
  console.log(res.height)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onKeyboardHeightChange | ✔️ |  |  |
