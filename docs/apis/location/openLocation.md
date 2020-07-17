---
title: Taro.openLocation(option)
sidebar_label: openLocation
---

使用微信内置地图查看位置

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>latitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系</td>
    </tr>
    <tr>
      <td>address</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>地址的详细说明</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>位置名</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>缩放比例，范围5~18</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getLocation({
 type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
 success: function (res) {
   const latitude = res.latitude
   const longitude = res.longitude
   Taro.openLocation({
     latitude,
     longitude,
     scale: 18
   })
 }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openLocation | ✔️ | ✔️ |  |
