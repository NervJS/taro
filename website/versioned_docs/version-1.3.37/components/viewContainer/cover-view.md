---
title: CoverView
sidebar_label: CoverView
id: version-1.3.37-cover-view
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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| scrollTop | `number` | 否 | 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CoverViewProps.scrollTop | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| CoverView | ✔️ | ✔️ | ✔️ |  |  |
