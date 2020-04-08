---
title: Taro.getApp(opts)
sidebar_label: getApp
id: version-2.1.1-getApp
original_id: getApp
---

获取到小程序全局唯一的 App 实例。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html)

## 类型

```tsx
<T = Record<string, any>>(opts?: Option) => Instance<T>
```

## 参数

### Option

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
      <td>allowDefault</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>在 <code>App</code> 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于独立分包</td>
    </tr>
  </tbody>
</table>

### Instance

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | 京东小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getApp | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
