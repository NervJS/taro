---
title: Taro.startSoterAuthentication(option)
sidebar_label: startSoterAuthentication
---

开始 SOTER 生物认证。验证流程请参考[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/bio-auth.html)。

**resultJSON 说明**
此数据为设备TEE中，将传入的challenge和TEE内其他安全信息组成的数据进行组装而来的JSON，对下述字段的解释如下表。例子如下：
| 字段名 | 说明 |
|---|----|
| raw | 调用者传入的challenge |
| fid | （仅Android支持）本次生物识别认证的生物信息编号（如指纹识别则是指纹信息在本设备内部编号） |
| counter | 防重放特征参数 |
| tee_n | TEE名称（如高通或者trustonic等） |
| tee_v | TEE版本号 |
| fp_n | 指纹以及相关逻辑模块提供商（如FPC等） |
| fp_v | 指纹以及相关模块版本号 |
| cpu_id | 机器唯一识别ID |
| uid | 概念同Android系统定义uid，即应用程序编号 |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.startSoterAuthentication.html)

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
      <td>challenge</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>挑战因子。挑战因子为调用者为此次生物鉴权准备的用于签名的字符串关键识别信息，将作为 <code>resultJSON</code> 的一部分，供调用者识别本次请求。例如：如果场景为请求用户对某订单进行授权确认，则可以将订单号填入此参数。</td>
    </tr>
    <tr>
      <td>requestAuthModes</td>
      <td><code>(&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;)[]</code></td>
      <td style="text-align:center">是</td>
      <td>请求使用的可接受的生物认证方式</td>
    </tr>
    <tr>
      <td>authContent</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>验证描述，即识别过程中显示在界面上的对话框提示内容</td>
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
      <td>authMode</td>
      <td><code>string</code></td>
      <td>生物认证方式</td>
    </tr>
    <tr>
      <td>errCode</td>
      <td><code>number</code></td>
      <td>错误码</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>resultJSON</td>
      <td><code>string</code></td>
      <td>在设备安全区域（TEE）内获得的本机安全信息（如TEE名称版本号等以及防重放参数）以及本次认证信息（仅Android支持，本次认证的指纹ID）。具体说明见下文</td>
    </tr>
    <tr>
      <td>resultJSONSignature</td>
      <td><code>string</code></td>
      <td>用SOTER安全密钥对 <code>resultJSON</code> 的签名(SHA256 with RSA/PSS, saltlen=20)</td>
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
Taro.startSoterAuthentication({
   requestAuthModes: ['fingerPrint'],
   challenge: '123456',
   authContent: '请用指纹解锁',
   success: function (res) { }
})
```

```json
{
  "raw":"msg",
  "fid":"2",
  "counter":123,
  "tee_n":"TEE Name",
  "tee_v":"TEE Version",
  "fp_n":"Fingerprint Sensor Name",
  "fp_v":"Fingerprint Sensor Version",
  "cpu_id":"CPU Id",
  "uid":"21"
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startSoterAuthentication | ✔️ |  |  |
