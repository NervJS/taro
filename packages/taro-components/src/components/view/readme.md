# taro-view-core

## API

|     | 属性                   | 类型    | 默认值 | 说明                                                         |
| --- | ---------------------- | ------- | ------ | ------------------------------------------------------------ |
| √   | hover-class            | String  | none   | 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果 |
| √   | hover-start-time       | Number  | 50     | 按住后多久出现点击态，单位毫秒                               |
| √   | hover-stay-time        | Number  | 400    | 手指松开后点击态保留时间，单位毫秒                           |
|     | hover-stop-propagation | Boolean | false  | 指定是否阻止本节点的祖先节点出现点击态                       |

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type     | Default     |
| ---------------- | ------------------ | ----------- | -------- | ----------- |
| `animation`      | `animation`        |             | `string` | `undefined` |
| `hoverClass`     | `hover-class`      |             | `string` | `undefined` |
| `hoverStartTime` | `hover-start-time` |             | `number` | `50`        |
| `hoverStayTime`  | `hover-stay-time`  |             | `number` | `400`       |


## Events

| Event       | Description | Type               |
| ----------- | ----------- | ------------------ |
| `longpress` |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
