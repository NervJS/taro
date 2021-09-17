---
title: RadioGroup
sidebar_label: RadioGroup
---

A single-item picker consisting of multiple Radio components.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/radio-group.html)

## Type

```tsx
ComponentType<RadioGroupProps>
```

## RadioGroupProps

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
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A change event triggered when selected options in `checkbox-group` change. detail =  {`{value:[Array of values of the selected checkboxes]}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioGroupProps.onChange | ✔️ | ✔️ |  |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string[]</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioGroup | ✔️ | ✔️ | ✔️ |
