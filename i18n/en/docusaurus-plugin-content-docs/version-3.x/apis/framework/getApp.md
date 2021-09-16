---
title: Taro.getApp(opts)
sidebar_label: getApp
---

Gets the globally unique App instance of the Mini Program.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/getApp.html)

## Type

```tsx
<T = Record<string, any>>(opts?: Option) => Instance<T>
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
      <td>allowDefault</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>When <code>App</code> is undefined, the default implementation is returned. When App is called, the properties defined in the default implementation are overridden and merged into App. Generally, this is used for Independent Subpackage.</td>
    </tr>
  </tbody>
</table>

### Instance

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | Jingdong Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getApp | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
