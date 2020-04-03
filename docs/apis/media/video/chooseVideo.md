---
title: Taro.chooseVideo(option)
sidebar_label: chooseVideo
---

拍摄视频或从手机相册中选视频。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html)

## 类型

```tsx
(option: Option) => Promise<void>
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
      <td>camera</td>
      <td><code>&quot;back&quot; | &quot;front&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>compressed</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否压缩所选择的视频文件</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>maxDuration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>拍摄视频最长拍摄时间，单位秒</td>
    </tr>
    <tr>
      <td>sourceType</td>
      <td><code>(&quot;album&quot; | &quot;camera&quot;)[]</code></td>
      <td style="text-align:center">否</td>
      <td>视频选择的来源</td>
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
      <td>duration</td>
      <td><code>number</code></td>
      <td>选定视频的时间长度</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>返回选定视频的高度</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>选定视频的数据量大小</td>
    </tr>
    <tr>
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>选定视频的临时文件路径</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>返回选定视频的宽度</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
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
      <td>默认拉起后置摄像头</td>
    </tr>
    <tr>
      <td>front</td>
      <td>默认拉起前置摄像头</td>
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
      <td>从相册选择视频</td>
    </tr>
    <tr>
      <td>camera</td>
      <td>使用相机拍摄视频</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseVideo({
  sourceType: ['album','camera'],
  maxDuration: 60,
  camera: 'back',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseVideo | ✔️ |  | ✔️ |
