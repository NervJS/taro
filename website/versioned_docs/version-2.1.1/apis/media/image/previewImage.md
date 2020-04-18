---
title: Taro.previewImage(option)
sidebar_label: previewImage
id: version-2.1.1-previewImage
original_id: previewImage
---

在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>urls</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>需要预览的图片链接列表。</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>current</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>当前显示图片的链接</td>
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

## 示例代码

```tsx
Taro.previewImage({
  current: '', // 当前显示图片的http链接
  urls: [] // 需要预览的图片http链接列表
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.previewImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
