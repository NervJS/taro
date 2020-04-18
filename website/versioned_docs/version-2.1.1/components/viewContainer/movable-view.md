---
title: MovableView
sidebar_label: MovableView
id: version-2.1.1-movable-view
original_id: movable-view
---

可移动的视图容器，在页面中可以拖拽滑动。movable-view 必须在 movable-area 组件中，并且必须是直接子节点，否则不能移动。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)

## 类型

```tsx
ComponentType<MovableViewProps>
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

## MovableViewProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>direction</td>
      <td><code>&quot;all&quot; | &quot;vertical&quot; | &quot;horizontal&quot; | &quot;none&quot;</code></td>
      <td style="text-align:center"><code>none</code></td>
      <td style="text-align:center">否</td>
      <td>movable-view 的移动方向，属性值有<code>all</code>、<code>vertical</code>、<code>horizontal</code>、<code>none</code></td>
    </tr>
    <tr>
      <td>inertia</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>movable-view 是否带有惯性</td>
    </tr>
    <tr>
      <td>outOfBounds</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>超过可移动区域后，movable-view 是否还可以移动</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>string | number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>定义 x 轴方向的偏移，如果 x 的值不在可移动范围内，会自动移动到可移动范围；改变 x 的值会触发动画</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>string | number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>定义 y 轴方向的偏移，如果 y 的值不在可移动范围内，会自动移动到可移动范围；改变 y 的值会触发动画</td>
    </tr>
    <tr>
      <td>damping</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>20</code></td>
      <td style="text-align:center">否</td>
      <td>阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快</td>
    </tr>
    <tr>
      <td>friction</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>2</code></td>
      <td style="text-align:center">否</td>
      <td>摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于 0，否则会被设置成默认值</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否支持双指缩放，默认缩放手势生效区域是在 movable-view 内</td>
    </tr>
    <tr>
      <td>scaleMin</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0.5</code></td>
      <td style="text-align:center">否</td>
      <td>定义缩放倍数最小值</td>
    </tr>
    <tr>
      <td>scaleMax</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>10</code></td>
      <td style="text-align:center">否</td>
      <td>定义缩放倍数最大值</td>
    </tr>
    <tr>
      <td>scaleValue</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>定义缩放倍数，取值范围为 0.5 - 10</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否使用动画</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>拖动过程中触发的事件</td>
    </tr>
    <tr>
      <td>onScale</td>
      <td><code>BaseEventOrigFunction&lt;onScaleEventDeatil&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>缩放过程中触发的事件</td>
    </tr>
    <tr>
      <td>onHTouchMove</td>
      <td><code>TouchEventFunction</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>初次手指触摸后移动为横向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch</td>
    </tr>
    <tr>
      <td>onVTouchMove</td>
      <td><code>TouchEventFunction</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>初次手指触摸后移动为纵向的移动，如果 catch 此事件，则意味着 touchmove 事件也被 catch</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>touch</td>
      <td>拖动</td>
    </tr>
    <tr>
      <td>touch-out-of-bounds</td>
      <td>超出移动范围</td>
    </tr>
    <tr>
      <td>out-of-bounds</td>
      <td>超出移动范围后的回弹</td>
    </tr>
    <tr>
      <td>friction</td>
      <td>惯性</td>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>X 坐标</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y 坐标</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>&quot;&quot; | &quot;touch&quot; | &quot;touch-out-of-bounds&quot; | &quot;out-of-bounds&quot; | &quot;friction&quot;</code></td>
      <td>触发事件</td>
    </tr>
  </tbody>
</table>

### onScaleEventDeatil

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>X 坐标</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y 坐标</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td>缩放比例</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MovableView | ✔️ | ✔️ | ✔️ |  |  |
