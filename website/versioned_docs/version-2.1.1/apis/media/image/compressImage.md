---
title: Taro.compressImage(option)
sidebar_label: compressImage
id: version-2.1.1-compressImage
original_id: compressImage
---

压缩图片接口，可选压缩质量

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.compressImage.html)

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
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径</td>
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
      <td>quality</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）。</td>
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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>压缩后图片的临时文件路径</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.compressImage({
  src: '', // 图片路径
  quality: 80 // 压缩质量
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.compressImage | ✔️ |  |  |
