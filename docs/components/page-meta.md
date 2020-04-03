---
title: PageMeta
sidebar_label: PageMeta
---

页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。可以配合 navigation-bar 组件一同使用。
通过这个节点可以获得类似于调用 Taro.setBackgroundTextStyle Taro.setBackgroundColor 等接口调用的效果。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html)

## 类型

```tsx
ComponentType<PageMetaProps>
```

## PageMetaProps

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
      <td>backgroundTextStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>下拉背景字体、loading 图的样式，仅支持 dark 和 light</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>窗口的背景色，必须为十六进制颜色值</td>
    </tr>
    <tr>
      <td>backgroundColorTop</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持</td>
    </tr>
    <tr>
      <td>backgroundColorBottom</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>滚动位置，可以使用 px 或者 rpx 为单位，在被设置时，页面会滚动到对应位置</td>
    </tr>
    <tr>
      <td>scrollDuration</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>300</code></td>
      <td style="text-align:center">否</td>
      <td>滚动动画时长</td>
    </tr>
    <tr>
      <td>pageStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>页面根节点样式，页面根节点是所有页面节点的祖先节点，相当于 HTML 中的 body 节点</td>
    </tr>
    <tr>
      <td>rootFontSize</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>页面的根字体大小，页面中的所有 rem 单位，将使用这个字体大小作为参考值，即 1rem 等于这个字体大小</td>
    </tr>
    <tr>
      <td>onResize</td>
      <td><code>BaseEventOrigFunction&lt;onResizeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>页面尺寸变化时会触发 resize 事件，event.detail = { size: { windowWidth, windowHeight } }</td>
    </tr>
    <tr>
      <td>onScroll</td>
      <td><code>BaseEventOrigFunction&lt;onScrollEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>页面滚动时会触发 scroll 事件，event.detail = { scrollTop }</td>
    </tr>
    <tr>
      <td>onScrollDone</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>如果通过改变 scroll-top 属性来使页面滚动，页面滚动结束后会触发 scrolldone 事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PageMetaProps.backgroundTextStyle | ✔️ |  |  |
| PageMetaProps.backgroundColor | ✔️ |  |  |
| PageMetaProps.backgroundColorTop | ✔️ |  |  |
| PageMetaProps.backgroundColorBottom | ✔️ |  |  |
| PageMetaProps.scrollTop | ✔️ |  |  |
| PageMetaProps.scrollDuration | ✔️ |  |  |
| PageMetaProps.pageStyle | ✔️ |  |  |
| PageMetaProps.rootFontSize | ✔️ |  |  |
| PageMetaProps.onResize | ✔️ |  |  |
| PageMetaProps.onScroll | ✔️ |  |  |
| PageMetaProps.onScrollDone | ✔️ |  |  |

### onResizeEventDetail

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
      <td>size</td>
      <td><code>resizeType</code></td>
      <td>窗口尺寸</td>
    </tr>
  </tbody>
</table>

### resizeType

窗口尺寸类型

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
      <td>windowWidth</td>
      <td><code>number</code></td>
      <td>窗口宽度</td>
    </tr>
    <tr>
      <td>windowHeight</td>
      <td><code>number</code></td>
      <td>窗口高度</td>
    </tr>
  </tbody>
</table>

### onScrollEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PageMeta | ✔️ |  |  |
