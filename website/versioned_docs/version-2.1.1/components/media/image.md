---
title: Image
sidebar_label: Image
id: version-2.1.1-image
original_id: image
---

图片。支持 JPG、PNG、SVG、WEBP、GIF 等格式以及云文件ID。

**Note:** 为实现小程序的 `mode` 特性，在 H5 组件中使用一个 `div` 容器来对内部的 `img` 进行展示区域的裁剪，因此请勿使用元素选择器来重置 `img` 的样式！

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)

## 类型

```tsx
ComponentType<ImageProps>
```

## 示例代码

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

## ImageProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>图片资源地址</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;scaleToFill&quot; | &quot;aspectFit&quot; | &quot;aspectFill&quot; | &quot;widthFix&quot; | &quot;top&quot; | &quot;bottom&quot; | &quot;center&quot; | &quot;left&quot; | &quot;right&quot; | &quot;top left&quot; | &quot;top right&quot; | &quot;bottom left&quot; | &quot;bottom right&quot;</code></td>
      <td style="text-align:center"><code>&quot;scaleToFill&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>图片裁剪、缩放的模式</td>
    </tr>
    <tr>
      <td>webp</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>默认不解析 webP 格式，只支持网络资源</td>
    </tr>
    <tr>
      <td>lazyLoad</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>图片懒加载。只针对 page 与 scroll-view 下的 image 有效</td>
    </tr>
    <tr>
      <td>showMenuByLongpress</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>开启长按图片显示识别小程序码菜单</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当错误发生时，发布到 AppService 的事件名，事件对象</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;onLoadEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当图片载入完毕时，发布到 AppService 的事件名，事件对象</td>
    </tr>
    <tr>
      <td>imgProps</td>
      <td><code>ImgHTMLAttributes&lt;HTMLImageElement&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>为 img 标签额外增加的属性</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ImageProps.src | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.mode | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(部分支持 scaleToFill, aspectFit, aspectFill, widthFix) |
| ImageProps.webp | ✔️ |  |  |  |  |  |
| ImageProps.lazyLoad | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| ImageProps.showMenuByLongpress | ✔️ |  |  |  |  |  |
| ImageProps.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.onLoad | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ImageProps.imgProps |  |  |  |  | ✔️ |  |

### mode

mode 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scaleToFill</td>
      <td>缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素</td>
    </tr>
    <tr>
      <td>aspectFit</td>
      <td>缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。</td>
    </tr>
    <tr>
      <td>aspectFill</td>
      <td>缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。</td>
    </tr>
    <tr>
      <td>widthFix</td>
      <td>缩放模式，宽度不变，高度自动变化，保持原图宽高比不变</td>
    </tr>
    <tr>
      <td>top</td>
      <td>裁剪模式，不缩放图片，只显示图片的顶部区域</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td>裁剪模式，不缩放图片，只显示图片的底部区域</td>
    </tr>
    <tr>
      <td>center</td>
      <td>裁剪模式，不缩放图片，只显示图片的中间区域</td>
    </tr>
    <tr>
      <td>left</td>
      <td>裁剪模式，不缩放图片，只显示图片的左边区域</td>
    </tr>
    <tr>
      <td>right</td>
      <td>裁剪模式，不缩放图片，只显示图片的右边区域</td>
    </tr>
    <tr>
      <td>top left</td>
      <td>裁剪模式，不缩放图片，只显示图片的左上边区域</td>
    </tr>
    <tr>
      <td>top right</td>
      <td>裁剪模式，不缩放图片，只显示图片的右上边区域</td>
    </tr>
    <tr>
      <td>bottom left</td>
      <td>裁剪模式，不缩放图片，只显示图片的左下边区域</td>
    </tr>
    <tr>
      <td>bottom right</td>
      <td>裁剪模式，不缩放图片，只显示图片的右下边区域</td>
    </tr>
  </tbody>
</table>

### onErrorEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

### onLoadEventDetail

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
      <td>height</td>
      <td><code>string | number</code></td>
      <td>图片高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>string | number</code></td>
      <td>图片宽度</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Image | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
