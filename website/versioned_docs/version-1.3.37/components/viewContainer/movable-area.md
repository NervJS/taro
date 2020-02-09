---
title: MovableArea
sidebar_label: MovableArea
id: version-1.3.37-movable-area
original_id: movable-area
---

movable-view 的可移动区域。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html)

## 类型

```tsx
ComponentType<MovableAreaProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <MovableArea style='height: 200px; width: 200px; background: red;'>
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
      </MovableArea>
    )
  }
}
```

## MovableAreaProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| scaleArea | `boolean` | `false` | 否 | 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableAreaProps.scaleArea | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableArea | ✔️ |  |  |
