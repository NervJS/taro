---
title: RadioGroup
sidebar_label: RadioGroup
---

单项选择器，内部由多个 Radio 组成。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/radio-group.html)

## 类型

```tsx
ComponentType<RadioGroupProps>
```

## RadioGroupProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>RadioGroup 中选中项发生改变时触发 change 事件，detail = {value:[选中的radio的value的数组]}</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioGroupProps.onChange | ✔️ | ✔️ |  |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string[]</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioGroup | ✔️ | ✔️ | ✔️ |
