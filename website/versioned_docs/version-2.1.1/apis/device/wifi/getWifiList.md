---
title: Taro.getWifiList(option)
sidebar_label: getWifiList
id: version-2.1.1-getWifiList
original_id: getWifiList
---

请求获取 Wi-Fi 列表。在 `onGetWifiList` 注册的回调中返回 `wifiList` 数据。 **Android 调用前需要 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation。**

iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getWifiList.html)

## 类型

```tsx
(option?: Option) => Promise<WifiError>
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
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: WifiError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getWifiList | ✔️ |  |  |
