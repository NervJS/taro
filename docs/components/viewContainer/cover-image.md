---
title: CoverImage
sidebar_label: CoverImage
---

覆盖在原生组件之上的图片视图。可覆盖的原生组件同cover-view，支持嵌套在cover-view里。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html)

## 类型

```tsx
ComponentType<CoverImageProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <Video id='myVideo' src='src'>
        <CoverView class='controls'>
          <CoverView class='play' onClick='play'>
            <CoverImage class='img' src='src' />
          </CoverView>
        </CoverView>
      </Video>
    )
  }
}
```

## CoverImageProps

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
      <td>图标路径，支持临时路径、网络地址、云文件ID。暂不支持base64格式。</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>图片加载成功时触发</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>图片加载失败时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverImageProps.src | ✔️ |  |  |
| CoverImageProps.onLoad | ✔️ |  |  |
| CoverImageProps.onError | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| CoverImage | ✔️ | ✔️ | ✔️ |  |  |
