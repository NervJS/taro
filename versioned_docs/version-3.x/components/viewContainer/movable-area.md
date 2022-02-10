---
title: MovableArea
sidebar_label: MovableArea
---

movable-view 的可移动区域

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html)

## 类型

```tsx
ComponentType<MovableAreaProps>
```

## 示例代码

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
  {
    "label": "React",
    "value": "React"
  },
  {
    "label": "Vue",
    "value": "Vue"
  }
]}>
<TabItem value="React">

```tsx
class App extends Components {
  render () {
    return (
      <MovableArea style='height: 200px; width: 200px; background: red;'>
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>旅行的意义</MovableView>
      </MovableArea>
    )
  }
}
```
</TabItem>
<TabItem value="Vue">

```html
  <movable-area style='height: 200px; width: 200px; background: red;'>
    <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>在路上</movable-view>
  </movable-area>
```
</TabItem>
</Tabs>

## MovableAreaProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| scaleArea | `boolean` | `false` | 否 | 当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableAreaProps.scaleArea | ✔️ |  |  |
