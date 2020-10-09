---
title: MovableArea
sidebar_label: MovableArea
---

movable-view 的可移动区域

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html)

## 类型

```tsx
ComponentType<MovableAreaProps>
```

## 示例代码

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>默认值</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scaleArea</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>当里面的 movable-view 设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个 movable-area</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableAreaProps.scaleArea | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableArea | ✔️ |  |  |
