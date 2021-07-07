---
title: Image
sidebar_label: Image
---

Image. This component supports JPG, PNG, and SVG images. Cloud file IDs are supported from 2.3.0 and later.

**Note:** To implement the `mode` feature of the applet, a `div` container is used in the H5 component to corp the display area of the internal `img`, so please do not use the element selector to reset the style of the `img`! 

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/image.html)

## Type

```tsx
ComponentType<ImageProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Image
          style='width: 300px;height: 100px;background: #fff;'
          src='nerv_logo.png'
        />
        <Image
          style='width: 300px;height: 100px;background: #fff;'
          src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
        />
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <image
      style="width: 300px;height: 100px;background: #fff;"
      src="nerv_logo.png"
    />
    <image
      style="width: 300px;height: 100px;background: #fff;"
      src="https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67"
    />
  </view>
</template>
```
  
</TabItem>
</Tabs>



## ImageProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The image resource address</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;scaleToFill&quot; | &quot;aspectFit&quot; | &quot;aspectFill&quot; | &quot;widthFix&quot; | &quot;heightFix&quot; | &quot;top&quot; | &quot;bottom&quot; | &quot;center&quot; | &quot;left&quot; | &quot;right&quot; | &quot;top left&quot; | &quot;top right&quot; | &quot;bottom left&quot; | &quot;bottom right&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;scaleToFill&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the clipping mode or the scale mode of an image</td>
    </tr>
    <tr>
      <td>webp</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>WebP format is not parsed by default, only web resources are supported.</td>
    </tr>
    <tr>
      <td>lazyLoad</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables lazy loading of images. An image is not loaded until it enters a specific range (within three consecutive screens).</td>
    </tr>
    <tr>
      <td>showMenuByLongpress</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables the feature of displaying the Mini Program code menu when an image is tapped and held.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when an error occurs. event.detail = {`{errMsg}`}</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;onLoadEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when an image is completely loaded. event.detail = {`{height, width}`}</td>
    </tr>
    <tr>
      <td>imgProps</td>
      <td><code>ImgHTMLAttributes&lt;HTMLImageElement&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Additional attributes for `img` tags</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ImageProps.src | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.mode | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(Partial support scaleToFill, aspectFit, aspectFill, widthFix) |
| ImageProps.webp | ✔️ |  |  |  |  |  |
| ImageProps.lazyLoad | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| ImageProps.showMenuByLongpress | ✔️ |  |  |  |  |  |
| ImageProps.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.onLoad | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.imgProps |  |  |  |  | ✔️ |  |

### mode

Valid values of mode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scaleToFill</td>
      <td>A scale mode, where the image is scaled without maintaining the aspect ratio to fully stretch to fill the screen with elements of the image.</td>
    </tr>
    <tr>
      <td>aspectFit</td>
      <td>A scale mode, where the image is scaled with the aspect ratio unchanged to fully display its longer edge. In this case, the image can be completely displayed.</td>
    </tr>
    <tr>
      <td>aspectFill</td>
      <td>A scale mode, where the image is scaled with the aspect ratio unchanged to fully display its shorter edge. In this case, the image is completely displayed in the horizontal or vertical direction, and it is truncated in the other direction.</td>
    </tr>
    <tr>
      <td>widthFix</td>
      <td>A scale mode, where the width of the image remains unchanged with the height adjusted automatically, and the aspect ratio of the original image is maintained.</td>
    </tr>
    <tr>
      <td>heightFix</td>
      <td>A scale mode, where the height of the image remains unchanged with the width adjusted automatically, and the aspect ratio of the original image is maintained.</td>
    </tr>
    <tr>
      <td>top</td>
      <td>A clipping mode, where only the upper area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td>A clipping mode, where only the lower area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>center</td>
      <td>A clipping mode, where only the central area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>left</td>
      <td>A clipping mode, where only the left area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>right</td>
      <td>A clipping mode, where only the right area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>top left</td>
      <td>A clipping mode, where only the upper left area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>top right</td>
      <td>A clipping mode, where only the upper right area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>bottom left</td>
      <td>A clipping mode, where only the lower left area of the image is displayed without scaling.</td>
    </tr>
    <tr>
      <td>bottom right</td>
      <td>A clipping mode, where only the lower right area of the image is displayed without scaling.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Image | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
