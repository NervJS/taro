radio

## API

##### radio

|     | 属性       | 类型        | 默认值 | 说明                                                                                    |
| --- | ---------- | ----------- | ------ | --------------------------------------------------------------------------------------- |
|     | value      | String      | false  | <radio/> 标识。当该<radio/> 选中时，<radio-group/> 的 change 事件会携带<radio/>的 value |
| √   | checked    | Boolean     | false  | 当前是否选中                                                                            |
| √   | disabled   | Boolean     | false  | 是否禁用                                                                                |
|     | color      | Color       | false  | radio 的颜色，同 css 的 color                                                           |
| √   | bindchange | EventHandle |        | 选中项发生变化时触发 change 事件                                                        |

##### radio-group

|     | 属性       | 类型        | 默认值 | 说明                                                                                            |
| --- | ---------- | ----------- | ------ | ----------------------------------------------------------------------------------------------- |
| √   | bindchange | EventHandle |        | <radio-group/>中选中项发生改变是触发 change 事件，detail = value:[选中的 radio 的 value 的数组] |
