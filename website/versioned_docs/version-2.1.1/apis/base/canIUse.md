---
title: Taro.canIUse(schema)
sidebar_label: canIUse
id: version-2.1.1-canIUse
original_id: canIUse
---

判断小程序的 API，回调，参数，组件等是否在当前版本可用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html)

## 类型

```tsx
(schema: string) => boolean
```

## 参数

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
      <td>schema</td>
      <td><code>string</code></td>
      <td>使用 <code>${API}.${method}.${param}.${option}</code> 或者 <code>${component}.${attribute}.${option}</code> 方式来调用<br /><br /><strong>参数说明</strong><br /><br />- <code>${API}</code> 代表 API 名字<br />- <code>${method}</code> 代表调用方式，有效值为return, success, object, callback<br />- <code>${param}</code> 代表参数或者返回值<br />- <code>${option}</code> 代表参数的可选值或者返回值的属性<br />- <code>${component}</code> 代表组件名字<br />- <code>${attribute}</code> 代表组件属性<br />- <code>${option}</code> 代表组件属性的可选值</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.canIUse('openBluetoothAdapter')
Taro.canIUse('getSystemInfoSync.return.screenWidth')
Taro.canIUse('getSystemInfo.success.screenWidth')
Taro.canIUse('showToast.object.image')
Taro.canIUse('onCompassChange.callback.direction')
Taro.canIUse('request.object.method.GET')
Taro.canIUse('live-player')
Taro.canIUse('text.selectable')
Taro.canIUse('button.open-type.contact')
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canIUse | ✔️ |  |  |
