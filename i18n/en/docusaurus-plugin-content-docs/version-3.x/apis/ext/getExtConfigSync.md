---
title: Taro.getExtConfigSync()
sidebar_label: getExtConfigSync
---

The synchronous version of `Taro.getExtConfig`.

**Tips**
- The compatibility of this API cannot be determined via `Taro.canIUse` currently. You need to figure out yourself whether `Taro.getExtConfigSync `exists and is compatible with the API.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ext/wx.getExtConfigSync.html)

## Type

```tsx
() => Record<string, any>
```

## Parameters

### ExtInfo

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
      <td>extConfig</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Data customized by the third-party platform</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}

console.log(extConfig)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getExtConfigSync | ✔️ |  |  |
