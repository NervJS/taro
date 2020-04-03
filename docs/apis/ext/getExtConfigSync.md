---
title: Taro.getExtConfigSync()
sidebar_label: getExtConfigSync
---

Taro.getExtConfig 的同步版本。

**Tips**
1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfigSync 是否存在来兼容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html)

## 类型

```tsx
() => Record<string, any>
```

## 参数

### ExtInfo

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
      <td>extConfig</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>第三方平台自定义的数据</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}

console.log(extConfig)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getExtConfigSync | ✔️ |  |  |
