---
title: MovableView
sidebar_label: MovableView
---

A movable view container. It can be dragged to move on a page. The movable-view component must be included in the movable-area component. It must be a direct child node. Otherwise, the component cannot move.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/movable-view.html)

## Type

```tsx
ComponentType<MovableViewProps>
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
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'>move me</MovableView>
      </MovableArea>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
  <movable-area style='height: 200px; width: 200px; background: red;'>
    <movable-view style='height: 50px; width: 50px; background: blue;' direction='all'>move me</movable-view>
  </movable-area>
```

</TabItem>
</Tabs>

## MovableViewProps

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
      <td>direction</td>
      <td><code>&quot;all&quot; | &quot;vertical&quot; | &quot;horizontal&quot; | &quot;none&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The moving direction of movable-view. Its values include "all", "vertical", "horizontal", and "none".</td>
    </tr>
    <tr>
      <td>inertia</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether movable-view has inertia.</td>
    </tr>
    <tr>
      <td>outOfBounds</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether movable-view can move after the view container is out of the movable area.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Specifies the offset in the x-axis direction. If the value of x is not within the movable range, the component will automatically move to the movable range. A change to the value of x will trigger an animation.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the offset in the y-axis direction. If the value of y is not within the movable range, the component will automatically move to the movable range. A change to the value of y will trigger an animation.</td>
    </tr>
    <tr>
      <td>damping</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>20</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The damping coefficient, which is used to control the animation triggered when the value of x or y changes and the animation that is pulled back when the component exceeds the range. The higher value leads to faster movement.</td>
    </tr>
    <tr>
      <td>friction</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>2</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The friction coefficient, which is used to control the animation that moves due to inertia. The higher value leads to higher friction and indicates that the movement stops earlier. It must be greater than 0. Otherwise it will be set to the default value.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to support two-finger scaling. The effective area for scaling gestures falls within the movable-view by default.</td>
    </tr>
    <tr>
      <td>scaleMin</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0.5</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The minimum value of the scaling level.</td>
    </tr>
    <tr>
      <td>scaleMax</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>10</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum value of the scaling level.</td>
    </tr>
    <tr>
      <td>scaleValue</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The scale level. Its values range from 0.5 to 10.</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to use animations.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered during dragging.</td>
    </tr>
    <tr>
      <td>onScale</td>
      <td><code>BaseEventOrigFunction&lt;onScaleEventDeatil&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered during scaling.</td>
    </tr>
    <tr>
      <td>onHTouchMove</td>
      <td><code>TouchEventFunction</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered when the component is first touched by a finger and then moved in the horizontal direction. If this event is caught, it indicates that the touchmove event is also caught.</td>
    </tr>
    <tr>
      <td>onVTouchMove</td>
      <td><code>TouchEventFunction</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered when the component is first touched by a finger and then moved in the vertical direction. If this event is caught, it indicates that the touchmove event is also caught.</td>
    </tr>
    <tr>
      <td>onDragStart</td>
      <td> </td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered at the start of dragging</td>
    </tr>
    <tr>
      <td>onDragEnd</td>
      <td> </td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered at the end of dragging</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MovableViewProps.direction | ✔️ |  | ✔️ |
| MovableViewProps.inertia | ✔️ |  |  |
| MovableViewProps.outOfBounds | ✔️ |  |  |
| MovableViewProps.x | ✔️ |  | ✔️ |
| MovableViewProps.y | ✔️ |  | ✔️ |
| MovableViewProps.damping | ✔️ |  |  |
| MovableViewProps.friction | ✔️ |  |  |
| MovableViewProps.disabled | ✔️ |  | ✔️ |
| MovableViewProps.scale | ✔️ |  |  |
| MovableViewProps.scaleMin | ✔️ |  |  |
| MovableViewProps.scaleMax | ✔️ |  |  |
| MovableViewProps.scaleValue | ✔️ |  |  |
| MovableViewProps.animation | ✔️ |  |  |
| MovableViewProps.onChange | ✔️ |  |  |
| MovableViewProps.onScale | ✔️ |  |  |
| MovableViewProps.onHTouchMove | ✔️ |  |  |
| MovableViewProps.onVTouchMove | ✔️ |  |  |
| MovableViewProps.onDragStart |  |  | ✔️ |
| MovableViewProps.onDragEnd |  |  | ✔️ |

### TChangeSource

Events triggered during dragging.

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>touch</td>
      <td>Dragging</td>
    </tr>
    <tr>
      <td>touch-out-of-bounds</td>
      <td>The movable range is exceeded.</td>
    </tr>
    <tr>
      <td>out-of-bounds</td>
      <td>Pullback after the movable range is exceeded.</td>
    </tr>
    <tr>
      <td>friction</td>
      <td>Inertia</td>
    </tr>
    <tr>
      <td></td>
      <td>setData</td>
    </tr>
  </tbody>
</table>

### onChangeEventDeatil

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>X coordinate</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y coordinate</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>&quot;&quot; | &quot;touch&quot; | &quot;touch-out-of-bounds&quot; | &quot;out-of-bounds&quot; | &quot;friction&quot;</code></td>
      <td>Trigger events</td>
    </tr>
  </tbody>
</table>

### onScaleEventDeatil

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>X coordinate</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y coordinate</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td>Scaling number</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MovableView | ✔️ | ✔️ | ✔️ |  | ✔️ |
