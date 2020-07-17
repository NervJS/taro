---
title: Taro.checkIsSupportSoterAuthentication(option)
sidebar_label: checkIsSupportSoterAuthentication
id: version-2.1.1-checkIsSupportSoterAuthentication
original_id: checkIsSupportSoterAuthentication
---

获取本机支持的 SOTER 生物认证方式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSupportSoterAuthentication.html)

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
      <td>supportMode</td>
      <td><code>(&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;)[]</code></td>
      <td>该设备支持的可被SOTER识别的生物识别方式</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用信息</td>
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

## 示例代码

```tsx
Taro.checkIsSupportSoterAuthentication({
  success: function (res) {
    // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
    // res.supportMode = ['fingerPrint'] 只支持指纹识别
    // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSupportSoterAuthentication | ✔️ |  |  |
