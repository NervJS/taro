# taro-movable-view-core



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description                                            | Type                                            | Default  |
| ------------- | --------------- | ------------------------------------------------------ | ----------------------------------------------- | -------- |
| `animation`   | `animation`     | 是否使用动画                                                 | `boolean`                                       | `true`   |
| `damping`     | `damping`       | 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快                     | `number`                                        | `20`     |
| `direction`   | `direction`     | 移动方向，属性值有all、vertical、horizontal、none                  | `"all" \| "horizontal" \| "none" \| "vertical"` | `"none"` |
| `disabled`    | `disabled`      | 是否禁用                                                   | `boolean`                                       | `false`  |
| `friction`    | `friction`      | 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值      | `number`                                        | `2`      |
| `inertia`     | `inertia`       | 是否带有惯性                                                 | `boolean`                                       | `false`  |
| `outOfBounds` | `out-of-bounds` | 超过可移动区域后，是否还可以移动                                       | `boolean`                                       | `false`  |
| `scale`       | `scale`         | 是否支持双指缩放，默认缩放手势生效区域是在movable-view内                     | `boolean`                                       | `false`  |
| `scaleMax`    | `scale-max`     | 定义缩放倍数最大值                                              | `number`                                        | `10`     |
| `scaleMin`    | `scale-min`     | 定义缩放倍数最小值                                              | `number`                                        | `.5`     |
| `scaleValue`  | `scale-value`   | 定义缩放倍数，取值范围为 0.5 - 10                                  | `number`                                        | `1`      |
| `x`           | `x`             | 定义x轴方向的偏移，如果x的值不在可移动范围内，会自动移动到可移动范围；改变x的值会触发动画；单位支持px； | `number \| string`                              | `0`      |
| `y`           | `y`             | 定义y轴方向的偏移，如果y的值不在可移动范围内，会自动移动到可移动范围；改变y的值会触发动画；单位支持px； | `number \| string`                              | `0`      |


## Events

| Event        | Description                                             | Type               |
| ------------ | ------------------------------------------------------- | ------------------ |
| `change`     | 拖动过程中触发的事件，event.detail = {x, y, source}                | `CustomEvent<any>` |
| `htouchmove` | 初次手指触摸后移动为横向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch    | `CustomEvent<any>` |
| `scale`      | 缩放过程中触发的事件，event.detail = {x, y, scale}，x和y字段在2.1.0之后支持 | `CustomEvent<any>` |
| `vtouchmove` | 初次手指触摸后移动为纵向的移动时触发，如果catch此事件，则意味着touchmove事件也被catch    | `CustomEvent<any>` |


## Methods

### `endScale() => Promise<void>`

结束缩放

#### Returns

Type: `Promise<void>`



### `setParent({ element, area }: { element: HTMLElement; area: { width: number; height: number; }; }) => Promise<void>`

设置父节点

#### Returns

Type: `Promise<void>`



### `setScale(scale: number) => Promise<void>`

更新缩放

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
