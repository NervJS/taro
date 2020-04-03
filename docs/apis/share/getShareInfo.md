---
title: Taro.getShareInfo(option)
sidebar_label: getShareInfo
---

获取转发详细信息

**Tips**
- 如需要展示群名称，可以使用[开放数据组件](https://developers.weixin.qq.com/miniprogram/dev/component/open-ability/open-data.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html)

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
      <td>shareTicket</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>shareTicket</td>
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
    <tr>
      <td>timeout</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>超时时间，单位 ms</td>
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
      <td>cloudID</td>
      <td><code>string</code></td>
      <td>敏感数据对应的云 ID，开通<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html">云开发</a>的小程序才会返回，可通过云调用直接获取开放数据，详细见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud">云调用直接获取开放数据</a></td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>包括敏感数据在内的完整转发信息的加密数据，详细见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html">加密数据解密算法</a></td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>加密算法的初始向量，详细见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html">加密数据解密算法</a></td>
    </tr>
  </tbody>
</table>

## 示例代码

敏感数据有两种获取方式，一是使用 [加密数据解密算法]((open-ability/signature#加密数据解密算法)) 。
获取得到的开放数据为以下 json 结构（其中 openGId 为当前群的唯一标识）：
```json
{
 "openGId": "OPENGID"
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getShareInfo | ✔️ |  |  |
