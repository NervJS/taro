---
title: Taro.createSelectorQuery()
sidebar_label: createSelectorQuery
---

Returns a SelectorQuery object instance. In a custom component or a page that contains a custom component, use `this.createSelectorQuery()` instead.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/wx.createSelectorQuery.html)

## Type

```tsx
() => SelectorQuery
```

## Parameters

## Sample Code

```tsx
const query = Taro.createSelectorQuery()
query.select('#the-id').boundingClientRect()
query.selectViewport().scrollOffset()
query.exec(function(res){
  res[0].top       // The upper boundary coordinate of the #the-id node
  res[1].scrollTop // The vertical scroll position of the display area
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createSelectorQuery | ✔️ | ✔️ |  |
