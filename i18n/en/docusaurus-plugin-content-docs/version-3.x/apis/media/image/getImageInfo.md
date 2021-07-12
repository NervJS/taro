---
title: Taro.getImageInfo(option)
sidebar_label: getImageInfo
---

Obtains image information. For network images, it only takes effect when the download domain name is configured.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/image/wx.getImageInfo.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The path to the image. It can be a relative path, a temporary file path, a file storage path, or a path to a network image.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>The original height of the image (in px). Rotation is not considered.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>The original width of the image (in px). Rotation is not considered.</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;up&quot; | &quot;up-mirrored&quot; | &quot;down&quot; | &quot;down-mirrored&quot; | &quot;left-mirrored&quot; | &quot;right&quot; | &quot;right-mirrored&quot; | &quot;left&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;up&quot;</code></td>
      <td><a href="http://sylvana.net/jpegcrop/exif_orientation.html">Device orientation when taking photos</a></td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>The local path to the image</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>Image format</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### orientation

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>up</td>
      <td>Default orientation (landscape). It is 1 in Exif. Or it indicates no orientation information.</td>
    </tr>
    <tr>
      <td>up-mirrored</td>
      <td>Mirrored orientation of up. It is 2 in Exif.</td>
    </tr>
    <tr>
      <td>down</td>
      <td>Rotates the device 180 degrees. It is 3 in Exif.</td>
    </tr>
    <tr>
      <td>down-mirrored</td>
      <td>Mirrored orientation of down. It is 4 in Exif.</td>
    </tr>
    <tr>
      <td>left-mirrored</td>
      <td>Mirrored orientation of left. It is 5 in Exif.</td>
    </tr>
    <tr>
      <td>right</td>
      <td>Rotates the device 90 degrees clockwise. It is 6 in Exif.</td>
    </tr>
    <tr>
      <td>right-mirrored</td>
      <td>Mirrored orientation of right. It is 7 in Exif.</td>
    </tr>
    <tr>
      <td>left</td>
      <td>Rotates the device 90 degrees counterclockwise. It is 8 in Exif.</td>
    </tr>
  </tbody>
</table>

## Sample Code

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

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getImageInfo | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
