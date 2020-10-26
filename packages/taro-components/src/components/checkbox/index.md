## API

##### checkbox

|     | 属性       | 类型        | 默认值 | 说明                                                                                    |
| --- | ---------- | ----------- | ------ | --------------------------------------------------------------------------------------- |
|     | value      | String      | false  | <checkbox/>标识，选中时触发<checkbox-group/>的 change 事件，并携带 <checkbox/> 的 value |
| √   | checked    | Boolean     | false  | 当前是否选中                                                                            |
| √   | disabled   | Boolean     | false  | 是否禁用                                                                                |
| √   | color      | Color       | false  | checkbox 的颜色，同 css 的 color                                                        |
| √   | bindchange | EventHandle |        | 选中项发生变化时触发 change 事件                                                        |

##### checkbox-group

|     | 属性       | 类型        | 默认值 | 说明                                                                                                  |
| --- | ---------- | ----------- | ------ | ----------------------------------------------------------------------------------------------------- |
| √   | bindchange | EventHandle |        | <checkbox-group/>中选中项发生改变是触发 change 事件，detail = value:[选中的 checkbox 的 value 的数组] |
