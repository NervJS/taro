---
title: Taro.getNetworkType(option)
sidebar_label: getNetworkType
---

获取网络类型。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>否</td>
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
      <td>networkType</td>
      <td><code>&quot;wifi&quot; | &quot;2g&quot; | &quot;3g&quot; | &quot;4g&quot; | &quot;unknown&quot; | &quot;none&quot;</code></td>
      <td>网络类型</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### networkType

网络类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>wifi</td>
      <td>wifi 网络</td>
    </tr>
    <tr>
      <td>2g</td>
      <td>2g 网络</td>
    </tr>
    <tr>
      <td>3g</td>
      <td>3g 网络</td>
    </tr>
    <tr>
      <td>4g</td>
      <td>4g 网络</td>
    </tr>
    <tr>
      <td>unknown</td>
      <td>Android 下不常见的网络类型</td>
    </tr>
    <tr>
      <td>none</td>
      <td>无网络</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getNetworkType({
  success: function (res) {
    // 返回网络类型, 有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    var networkType = res.networkType
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getNetworkType | ✔️ | ✔️ | ✔️ |
