---
title: Taro.chooseMedia(option)
sidebar_label: chooseMedia
id: version-2.1.1-chooseMedia
original_id: chooseMedia
---

拍摄或从手机相册中选择图片或视频。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html)

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
      <td>count</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>最多可以选择的文件个数</td>
    </tr>
    <tr>
      <td>mediaType</td>
      <td><code>(&quot;video&quot; | &quot;image&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>文件类型</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>图片和视频选择的来源</td>
    </tr>
    <tr>
      <td>maxDuration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间</td>
    </tr>
    <tr>
      <td>sizeType</td>
      <td><code>(&quot;original&quot; | &quot;compressed&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>仅对 mediaType 为 image 时有效，是否压缩所选文件</td>
    </tr>
    <tr>
      <td>camera</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>仅在 sourceType 为 camera 时生效，使用前置或后置摄像头</td>
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
      <td>tempFiles</td>
      <td><code>ChooseMedia[]</code></td>
      <td>本地临时文件列表</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>文件类型，有效值有 image 、video</td>
    </tr>
  </tbody>
</table>

### ChooseMedia

本地临时文件列表

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
      <td>本地临时文件路径 (本地路径)</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>本地临时文件大小，单位 B</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>视频的时间长度</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>视频的高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>视频的宽度</td>
    </tr>
    <tr>
      <td>thumbTempFilePath</td>
      <td><code>string</code></td>
      <td>视频缩略图临时文件路径</td>
    </tr>
  </tbody>
</table>

### mediaType

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>video</td>
      <td>只能拍摄视频或从相册选择视频</td>
    </tr>
    <tr>
      <td>image</td>
      <td>只能拍摄图片或从相册选择图片</td>
    </tr>
  </tbody>
</table>

### sourceType

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
      <td>从相册选择</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>使用相机拍摄</td>
    </tr>
  </tbody>
</table>

### camera

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>back</td>
      <td>使用后置摄像头</td>
    </tr>
    <tr>
      <td>front</td>
      <td>使用前置摄像头</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseMedia({
  count: 9,
  mediaType: ['image','video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  camera: 'back',
  success: (res) => {
    console.log(res.tempFiles)
    console.log(res.type)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseMedia | ✔️ |  | ✔️ |
