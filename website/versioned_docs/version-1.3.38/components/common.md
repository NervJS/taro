---
title: common
sidebar_label: common
id: version-1.3.38-common
original_id: common
---

## StandardProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| id | `string` | 否 | 组件的唯一标示, 保持整个页面唯一 |
| className | `string` | 否 | 同 `class`，在 React/Nerv 里一般使用 `className` 作为 `class` 的代称 |
| style | string or CSSProperties | 否 | 组件的内联样式, 可以动态设置的内联样式 |
| key | string or number | 否 | 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，<br />需要使用 `wx:key` 来指定列表中项目的唯一的标识符。 |
| hidden | `boolean` | 否 | 组件是否显示, 所有组件默认显示 |
| animation | `{ actions: object[]; }` | 否 | 动画属性 |
| ref | string or ((node: any) => any) | 否 | 引用 |

## FormItemProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| name | `string` | 否 | 表单数据标识 |

## EventProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| onTouchStart | `(event: ITouchEvent) => any` | 否 | 手指触摸动作开始 |
| onTouchMove | `(event: ITouchEvent) => any` | 否 | 手指触摸后移动 |
| onTouchCancel | `(event: ITouchEvent) => any` | 否 | 手指触摸动作被打断，如来电提醒，弹窗 |
| onTouchEnd | `(event: ITouchEvent) => any` | 否 | 手指触摸动作结束 |
| onClick | `(event: ITouchEvent) => any` | 否 | 手指触摸后马上离开 |
| onLongPress | `(event: CommonEvent) => any` | 否 | 手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发 |
| onLongClick | `(event: CommonEvent) => any` | 否 | 手指触摸后，超过350ms再离开（推荐使用longpress事件代替） |
| onTransitionEnd | `(event: CommonEvent) => any` | 否 | 会在 WXSS transition 或 Taro.createAnimation 动画结束后触发 |
| onAnimationStart | `(event: CommonEvent) => any` | 否 | 会在一个 WXSS animation 动画开始时触发 |
| onAnimationIteration | `(event: CommonEvent) => any` | 否 | 会在一个 WXSS animation 一次迭代结束时触发 |
| onAnimationEnd | `(event: CommonEvent) => any` | 否 | 会在一个 WXSS animation 动画完成时触发 |
| onTouchForceChange | `(event: CommonEvent) => any` | 否 | 在支持 3D Touch 的 iPhone 设备，重按时会触发 |

## CommonEvent

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| type | `string` | 事件类型 |
| timeStamp | `number` | 事件生成时的时间戳 |
| target | `Target` | 触发事件的组件的一些属性值集合 |
| currentTarget | `currentTarget` | 当前组件的一些属性值集合 |
| detail | `T` | 额外的信息 |
| preventDefault | `() => void` | 阻止元素发生默认的行为 |
| stopPropagation | `() => void` | 阻止事件冒泡到父元素,阻止任何父事件处理程序被执行 |

## BaseEventOrig

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| type | `string` | 事件类型 |
| timeStamp | `number` | 事件生成时的时间戳 |
| target | `Target` | 触发事件的组件的一些属性值集合 |
| currentTarget | `currentTarget` | 当前组件的一些属性值集合 |
| detail | `T` | 额外的信息 |
| preventDefault | `() => void` | 阻止元素发生默认的行为 |
| stopPropagation | `() => void` | 阻止事件冒泡到父元素,阻止任何父事件处理程序被执行 |

## ITouchEvent

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| touches | `ITouch[]` | 触摸事件，当前停留在屏幕中的触摸点信息的数组 |
| changedTouches | `CanvasTouch[]` | 触摸事件，当前变化的触摸点信息的数组 |

## CanvasTouch

| 参数 | 类型 |
| --- | --- |
| identifier | `number` |
| x | `number` |
| y | `number` |

## ITouch

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| identifier | `number` | 触摸点的标识符 |
| pageX | `number` | 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴 |
| pageY | `number` | 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴 |
| clientX | `number` | 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴 |
| clientY | `number` | 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴 |

## Target

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| id | `string` | 事件源组件的id |
| tagName | `string` | 当前组件的类型 |
| dataset | `{ [key: string]: any; }` | 事件源组件上由data-开头的自定义属性组成的集合 |

## netStatus

网络状态数据

| 参数 | 类型 | 必填 |
| --- | --- | :---: |
| videoBitrate | `number` | 否 |
| audioBitrate | `number` | 否 |
| videoFPS | string or number | 否 |
| videoGOP | `number` | 否 |
| netSpeed | `number` | 否 |
| netJitter | `number` | 否 |
| videoWidth | string or number | 否 |
| videoHeight | string or number | 否 |
