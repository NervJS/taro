---
title: Taro.chooseLocation(option)
sidebar_label: chooseLocation
id: version-2.1.1-chooseLocation
original_id: chooseLocation
---

打开地图选择位置。

`chooseLocation` api功能是依赖于腾讯位置服务，所以需要使用 api 密钥。如果您没有，可以前往腾讯位置服务[开发者控制台](https://lbs.qq.com/console/mykey.html?console=mykey)进行申请。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>latitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>目标地纬度</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>目标地经度</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>address</td>
      <td><code>string</code></td>
      <td>详细地址</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>string</code></td>
      <td>纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>string</code></td>
      <td>经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>位置名称</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
// config/index.js

// 获得 api 密钥后，您需要将它填入项目的常量配置`defineConstants.LOCATION_APIKEY`中：
const config = {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX')
  },
  // ...
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseLocation | ✔️ | ✔️ |  |
