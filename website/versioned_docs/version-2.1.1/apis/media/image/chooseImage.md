---
title: Taro.chooseImage(option)
sidebar_label: chooseImage
id: version-2.1.1-chooseImage
original_id: chooseImage
---

从本地相册选择图片或使用相机拍照。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html)

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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>count</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>最多可以选择的图片张数</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>sizeType</td>
      <td><code>(&quot;original&quot; | &quot;compressed&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>所选的图片的尺寸</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot; | &quot;user&quot; | &quot;environment&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>选择图片的来源</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### sizeType

图片的尺寸

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>original</td>
      <td>原图</td>
    </tr>
    <tr>
      <td>compressed</td>
      <td>compressed</td>
    </tr>
  </tbody>
</table>

### sourceType

图片的来源

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>album</td>
      <td>从相册选图</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>使用相机</td>
    </tr>
    <tr>
      <td>user</td>
      <td>使用前置摄像头(仅H5纯浏览器使用)</td>
    </tr>
    <tr>
      <td>environment</td>
      <td>使用后置摄像头(仅H5纯浏览器)</td>
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
      <td>tempFilePaths</td>
      <td><code>string[]</code></td>
      <td>图片的本地临时文件路径列表</td>
    </tr>
    <tr>
      <td>tempFiles</td>
      <td><code>ImageFile[]</code></td>
      <td>图片的本地临时文件列表</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### ImageFile

图片的本地临时文件列表

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
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>本地临时文件路径</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>本地临时文件大小，单位 B</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>文件的 MIME 类型<br />API 支持度: h5</td>
    </tr>
    <tr>
      <td>originalFileObj</td>
      <td><code>File</code></td>
      <td style="text-align:center">否</td>
      <td>原始的浏览器 File 对象<br />API 支持度: h5</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| ImageFile.type |  | ✔️ |  |
| ImageFile.originalFileObj |  | ✔️ |  |

## 示例代码

```tsx
Taro.chooseImage({
  count: 1, // 默认9
  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
  success: function (res) {
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths
  }
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
