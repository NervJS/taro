---
title: Taro.checkIsSoterEnrolledInDevice(option)
sidebar_label: checkIsSoterEnrolledInDevice
id: version-2.1.1-checkIsSoterEnrolledInDevice
original_id: checkIsSoterEnrolledInDevice
---

获取设备内是否录入如指纹等生物信息的接口

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSoterEnrolledInDevice.html)

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
      <td>checkAuthMode</td>
      <td><code>&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>认证方式</td>
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
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### requestAuthModes

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>fingerPrint</td>
      <td>指纹识别</td>
    </tr>
    <tr>
      <td>facial</td>
      <td>人脸识别</td>
    </tr>
    <tr>
      <td>speech</td>
      <td>声纹识别<br />API 支持度: 暂未支持</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| requestAuthModes.speech |  |  |  |

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>isEnrolled</td>
      <td><code>boolean</code></td>
      <td>是否已录入信息</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.checkIsSoterEnrolledInDevice({
  checkAuthMode: 'fingerPrint',
  success: function (res) {
    console.log(res.isEnrolled)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSoterEnrolledInDevice | ✔️ |  |  |
