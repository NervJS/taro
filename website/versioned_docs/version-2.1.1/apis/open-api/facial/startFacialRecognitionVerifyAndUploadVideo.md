---
title: Taro.startFacialRecognitionVerifyAndUploadVideo(option)
sidebar_label: startFacialRecognitionVerifyAndUploadVideo
id: version-2.1.1-startFacialRecognitionVerifyAndUploadVideo
original_id: startFacialRecognitionVerifyAndUploadVideo
---

开始人脸识别认证并上传认证视频

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
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>身份证名称</td>
    </tr>
    <tr>
      <td>idCardNumber</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>身份证名称</td>
    </tr>
    <tr>
      <td>checkAliveType</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>交互方式</td>
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
      <td><code>(result: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
      <td>errCode</td>
      <td><code>number</code></td>
      <td>错误码</td>
    </tr>
    <tr>
      <td>verifyResult</td>
      <td><code>string</code></td>
      <td>认证结果</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startFacialRecognitionVerifyAndUploadVideo | ✔️ |  |  |
