---
title: Taro.getImageInfo(option)
sidebar_label: getImageInfo
id: version-2.1.1-getImageInfo
original_id: getImageInfo
---

获取图片信息。网络图片需先配置download域名才能生效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html)

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
      <td>图片的路径，可以是相对路径、临时文件路径、存储文件路径、网络图片路径</td>
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
      <th style="text-align:center">默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td>图片原始高度，单位px。不考虑旋转。</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;up&quot; | &quot;up-mirrored&quot; | &quot;down&quot; | &quot;down-mirrored&quot; | &quot;left-mirrored&quot; | &quot;right&quot; | &quot;right-mirrored&quot; | &quot;left&quot;</code></td>
      <td style="text-align:center"><code>&quot;up&quot;</code></td>
      <td><a href="http://sylvana.net/jpegcrop/exif_orientation.html">拍照时设备方向</a></td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td>图片的本地路径</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td>图片格式</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td>图片原始宽度，单位px。不考虑旋转。</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### orientation

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>up</td>
      <td>默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。</td>
    </tr>
    <tr>
      <td>up-mirrored</td>
      <td>同 up，但镜像翻转，对应 Exif 中的 2</td>
    </tr>
    <tr>
      <td>down</td>
      <td>旋转180度，对应 Exif 中的 3</td>
    </tr>
    <tr>
      <td>down-mirrored</td>
      <td>同 down，但镜像翻转，对应 Exif 中的 4</td>
    </tr>
    <tr>
      <td>left-mirrored</td>
      <td>同 left，但镜像翻转，对应 Exif 中的 5</td>
    </tr>
    <tr>
      <td>right</td>
      <td>顺时针旋转90度，对应 Exif 中的 6</td>
    </tr>
    <tr>
      <td>right-mirrored</td>
      <td>同 right，但镜像翻转，对应 Exif 中的 7</td>
    </tr>
    <tr>
      <td>left</td>
      <td>逆时针旋转90度，对应 Exif 中的 8</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getImageInfo({
  src: 'images/a.jpg',
  success: function (res) {
    console.log(res.width)
    console.log(res.height)
  }
})
Taro.chooseImage({
  success: function (res) {
    Taro.getImageInfo({
      src: res.tempFilePaths[0],
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getImageInfo | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
