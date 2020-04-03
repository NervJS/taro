---
title: Taro.openBluetoothAdapter(option)
sidebar_label: openBluetoothAdapter
---

初始化蓝牙模块

**注意**
- 其他蓝牙相关 API 必须在 Taro.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
- 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 Taro.openBluetoothAdapter 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
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
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: BluetoothError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### state

object.fail 回调函数返回的 state 参数（仅 iOS）

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>未知</td>
    </tr>
    <tr>
      <td>1</td>
      <td>重置中</td>
    </tr>
    <tr>
      <td>2</td>
      <td>不支持</td>
    </tr>
    <tr>
      <td>3</td>
      <td>未授权</td>
    </tr>
    <tr>
      <td>4</td>
      <td>未开启</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.openBluetoothAdapter({
  success: function (res) {
    console.log(res)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openBluetoothAdapter | ✔️ |  |  |
