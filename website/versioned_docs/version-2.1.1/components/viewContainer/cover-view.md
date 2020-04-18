---
title: CoverView
sidebar_label: CoverView
id: version-2.1.1-cover-view
original_id: cover-view
---

覆盖在原生组件之上的文本视图。可覆盖的原生组件包括 map、video、canvas、camera、live-player、live-pusher 只支持嵌套 cover-view、cover-image，可在 cover-view 中使用 button。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html)

## 类型

```tsx
ComponentType<CoverViewProps>
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

## CoverViewProps

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
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverViewProps.scrollTop | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| CoverView | ✔️ | ✔️ | ✔️ |  |  |
