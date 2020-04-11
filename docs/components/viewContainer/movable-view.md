---
title: MovableView
sidebar_label: MovableView
---

可移动的视图容器，在页面中可以拖拽滑动。movable-view 必须在 movable-area 组件中，并且必须是直接子节点，否则不能移动。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)

## 类型

```tsx
ComponentType<MovableViewProps>
```

## 示例代码

```tsx
import Taro, { Component, } from '@tarojs/taro'

import {
  MovableView,
  MovableArea,
} from '@tarojs/components'

class App extends Component {
  render () {
    return (
      <MovableArea style='height: 200px; width: 200px; background: red;'>
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
      </MovableArea>
    )
  }
}
```

## MovableViewProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| direction | "all" or "vertical" or "horizontal" or "none" | `none` | 否 | movable-view 的移动方向，属性值有`all`、`vertical`、`horizontal`、`none` |
| inertia | `boolean` | `false` | 否 | movable-view 是否带有惯性 |
| outOfBounds | `boolean` | `false` | 否 | 超过可移动区域后，movable-view 是否还可以移动 |
| x | string or number |  | 否 | 定义 x 轴方向的偏移，如果 x 的值不在可移动范围内，会自动移动到可移动范围；改变 x 的值会触发动画 |
| y | string or number |  | 否 | 定义 y 轴方向的偏移，如果 y 的值不在可移动范围内，会自动移动到可移动范围；改变 y 的值会触发动画 |
| damping | `number` | `20` | 否 | 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快 |
| friction | `number` | `2` | 否 | 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于 0，否则会被设置成默认值 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| scale | `boolean` | `false` | 否 | 是否支持双指缩放，默认缩放手势生效区域是在 movable-view 内 |
| scaleMin | `number` | `0.5` | 否 | 定义缩放倍数最小值 |
| scaleMax | `number` | `10` | 否 | 定义缩放倍数最大值 |
| scaleValue | `number` | `1` | 否 | 定义缩放倍数，取值范围为 0.5 - 10 |
| animation | `boolean` | `true` | 否 | 是否使用动画 |
| onChange | `BaseEventOrigFunction<onChangeEventDeatil>` |  | 否 | 拖动过程中触发的事件 |
| onScale | `BaseEventOrigFunction<onScaleEventDeatil>` |  | 否 | 缩放过程中触发的事件 |
| onHTouchMove | `TouchEventFunction` |  | 否 | 初次手指触摸后移动为横向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch |
| onVTouchMove | `TouchEventFunction` |  | 否 | 初次手指触摸后移动为纵向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableViewProps.direction | ✔️ |  |  |
| MovableViewProps.inertia | ✔️ |  |  |
| MovableViewProps.outOfBounds | ✔️ |  |  |
| MovableViewProps.x | ✔️ |  |  |
| MovableViewProps.y | ✔️ |  |  |
| MovableViewProps.damping | ✔️ |  |  |
| MovableViewProps.friction | ✔️ |  |  |
| MovableViewProps.disabled | ✔️ |  |  |
| MovableViewProps.scale | ✔️ |  |  |
| MovableViewProps.scaleMin | ✔️ |  |  |
| MovableViewProps.scaleMax | ✔️ |  |  |
| MovableViewProps.scaleValue | ✔️ |  |  |
| MovableViewProps.animation | ✔️ |  |  |
| MovableViewProps.onChange | ✔️ |  |  |
| MovableViewProps.onScale | ✔️ |  |  |
| MovableViewProps.onHTouchMove | ✔️ |  |  |
| MovableViewProps.onVTouchMove | ✔️ |  |  |

### TChangeSource

拖动过程中触发的事件

| 参数 | 说明 |
| --- | --- |
| touch | 拖动 |
| touch-out-of-bounds | 超出移动范围 |
| out-of-bounds | 超出移动范围后的回弹 |
| friction | 惯性 |
|  | setData |

### onChangeEventDeatil

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | X 坐标 |
| y | `number` | Y 坐标 |
| source | "" or "touch" or "touch-out-of-bounds" or "out-of-bounds" or "friction" | 触发事件 |

### onScaleEventDeatil

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | X 坐标 |
| y | `number` | Y 坐标 |
| scale | `number` | 缩放比例 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MovableView | ✔️ | ✔️ | ✔️ |  |  |
