---
title: Taro.startAccelerometer(res)
sidebar_label: startAccelerometer
id: version-2.1.1-startAccelerometer
original_id: startAccelerometer
---

开始监听加速度数据。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html)

## 类型

```tsx
(res?: Option) => Promise<CallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>interval</td>
      <td><code>&quot;game&quot; | &quot;ui&quot; | &quot;normal&quot;</code></td>
      <td style="text-align:center"><code>&quot;normal&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>监听加速度数据回调函数的执行频率</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### interval

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
      <td>game</td>
      <td><code>&quot;game&quot;</code></td>
      <td>适用于更新游戏的回调频率，在 20ms/次 左右</td>
    </tr>
    <tr>
      <td>ui</td>
      <td><code>&quot;ui&quot;</code></td>
      <td>适用于更新 UI 的回调频率，在 60ms/次 左右</td>
    </tr>
    <tr>
      <td>normal</td>
      <td><code>&quot;normal&quot;</code></td>
      <td>普通的回调频率，在 200ms/次 左右</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.startAccelerometer({ interval: 'game' })
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startAccelerometer | ✔️ | ✔️ | ✔️ |
