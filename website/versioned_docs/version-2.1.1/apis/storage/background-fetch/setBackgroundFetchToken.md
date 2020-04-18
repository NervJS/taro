---
title: Taro.setBackgroundFetchToken(option)
sidebar_label: setBackgroundFetchToken
id: version-2.1.1-setBackgroundFetchToken
original_id: setBackgroundFetchToken
---

设置自定义登录态，在周期性拉取数据时带上，便于第三方服务器验证请求合法性

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.setBackgroundFetchToken.html)

## 类型

```tsx
(option: Option) => void
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
      <td>token</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>自定义的登录态</td>
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
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundFetchToken | ✔️ |  |  |
