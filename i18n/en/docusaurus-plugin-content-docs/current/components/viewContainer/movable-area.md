---
title: MovableArea
sidebar_label: MovableArea
---

A movable area of the movable-view component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/movable-area.html)

## Type

```tsx
ComponentType<MovableAreaProps>
```

## Examples

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
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>The meaning of travel</MovableView>
      </MovableArea>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
  <movable-area style='height: 200px; width: 200px; background: red;'>
    <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>On the road</movable-view>
  </movable-area>
```

</TabItem>
</Tabs>

## MovableAreaProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scaleArea</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>When the movable-view inside is set to support two-finger zoom, setting this value modifies the area where the zoom gesture takes effect to the entire movable-area.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableAreaProps.scaleArea | ✔️ |  |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableArea | ✔️ |  | ✔️ |
