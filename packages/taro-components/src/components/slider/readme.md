# taro-slider-core

## API

|     | 属性            | 类型        | 默认值  | 说明                                          |
| --- | --------------- | ----------- | ------- | --------------------------------------------- |
| √   | min             | Number      | 0       | 最小值                                        |
| √   | max             | Number      | 100     | 最大值                                        |
| √   | step            | Number      | 1       | 步长，取值必须大于 0，并且可被(max - min)整除 |
| √   | disabled        | Boolean     | false   | 是否禁用                                      |
| √   | value           | Number      | 0       | 当前取值                                      |
|     | color           | Color       | #e9e9e9 | 背景条的颜色（请使用 backgroundColor）        |
|     | selected-color  | Color       | #1aad19 | 已选择的颜色（请使用 activeColor）            |
| √   | activeColor     | Color       | #1aad19 | 已选择的颜色                                  |
| √   | backgroundColor | Color       | #e9e9e9 | 背景条的颜色                                  |
| √   | block-size      | Number      | 28      | 滑块的大小，取值范围为 12 - 28                |
| √   | block-color     | Color       | #ffffff | 滑块的颜色                                    |
| √   | show-value      | Boolean     | false   | 是否显示当前 value                            |
| √   | bindchange      | EventHandle |         | 完成一次拖动后触发的事件                      |
| √   | bindchanging    | EventHandle |         | 拖动过程中触发的事件                          |

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type      | Default     |
| ----------------- | ------------------ | ----------- | --------- | ----------- |
| `activeColor`     | `active-color`     |             | `string`  | `'#1aad19'` |
| `backgroundColor` | `background-color` |             | `string`  | `'#e9e9e9'` |
| `blockColor`      | `block-color`      |             | `string`  | `'#ffffff'` |
| `blockSize`       | `block-size`       |             | `number`  | `28`        |
| `disabled`        | `disabled`         |             | `boolean` | `false`     |
| `max`             | `max`              |             | `number`  | `100`       |
| `min`             | `min`              |             | `number`  | `0`         |
| `name`            | `name`             |             | `string`  | `''`        |
| `showValue`       | `show-value`       |             | `boolean` | `false`     |
| `step`            | `step`             |             | `number`  | `1`         |
| `value`           | `value`            |             | `number`  | `0`         |


## Events

| Event      | Description | Type               |
| ---------- | ----------- | ------------------ |
| `change`   |             | `CustomEvent<any>` |
| `changing` |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
