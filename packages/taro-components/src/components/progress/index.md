progress

## API

|     | 属性            | 类型    | 默认值    | 说明                                                    |
| --- | --------------- | ------- | --------- | ------------------------------------------------------- |
| √   | percent         | Float   |           | 百分比 0~100                                            |
| √   | show-info       | Boolean | false     | 在进度条右侧显示百分比                                  |
| √   | stroke-width    | Number  | 6         | 进度条线的宽度，单位 px                                 |
|     | color           | Color   | #09BB07   | 进度条颜色 （请使用 activeColor）                       |
| √   | activeColor     | Color   | 6         | 已选择的进度条的颜色                                    |
| √   | backgroundColor | Color   | 6         | 未选择的进度条的颜色                                    |
| √   | active          | Boolean | false     | 进度条从左往右的动画                                    |
|     | active-mode     | String  | backwards | backwards: 动画从头播；forwards：动画从上次结束点接着播 |
|     | borderRadius    | Number  | 0         | 圆角大小, 单位 px                                      |
