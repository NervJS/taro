##### Progress
##### 进度条。

> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | |percent | Float   | 无 | 百分比 0~100 |
| √ | √ | | showInfo | Boolean | false | 在进度条右侧显示百分比 |
| √ | √ | | strokeWidth | Number  | 6 | 进度条线的宽度，单位 px |
| √ |  | | color | Color   | #09BB07 | 进度条颜色 （请使用 activeColor）|
| √ | √ | | activeColor | Color   | #09BB07 | 已选择的进度条的颜色 |
| √ | √ | |backgroundColor | Color   | #09BB07 | 未选择的进度条的颜色 |
| √ | √ | | active | Boolean | false     | 进度条从左往右的动画 |
| √ |  | |activeMode | String  | backwards | backwards: 动画从头播；forwards：动画从上次结束点接着播 |

###### 示例：
```jsx
<Progress percent={20} showInfo strokeWidth={2} />
<Progress percent={40} strokeWidth={2} active />
<Progress percent={60}  strokeWidth={2} active />
<Progress percent={80}  strokeWidth={2} active activeColor='blue' />
```
