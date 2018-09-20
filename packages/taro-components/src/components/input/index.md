input

## API

|              | 属性              | 类型        | 默认值 | 说明                                                                                                            |
| ------------ | ----------------- | ----------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| √            | value             | String      |        | 输入框的初始内容                                                                                                |
| √            | type              | String      | 23     | input 的类型                                                                                                    |
| √            | password          | Boolean       |        | 是否是密码类型                                                                                                  |
| √            | placeholder       | String      |        | 输入框为空时占位符                                                                                              |
|              | placeholder-style | String      |        | 指定 placeholder 的样式                                                                                         |
|              | placeholder-class | String      |        | 指定 placeholder 的样式类                                                                                       |
| √            | disabled          | Boolean     |        | 是否禁用                                                                                                        |
| √            | maxLength         | Number      |        | 最大输入长度，设置为 -1 的时候不限制最大长度                                                                    |
|              | cursor-spacing    | Number      |        | 指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离 |
|              | auto-focus        | Boolean     |        | (即将废弃，请直接使用 focus )自动聚焦，拉起键盘                                                                 |
|              | focus             | Boolean     |        | 获取焦点                                                                                                        |
|     √           | confirm-type      | String      |        | 设置键盘右下角按钮的文字(目前仅支持search)                                                                                        |
|              | cursor            | Number      |        | 指定 focus 时的光标位置                                                                                         |
|              | selection-start   | Number      |        | 光标起始位置，自动聚集时有效，需与 selection-end 搭配使用                                                       |
|              | selection-end     | Number      |        | 光标结束位置，自动聚集时有效，需与 selection-start 搭配使用                                                     |
|              | adjust-position   | Boolean     |        | 键盘弹起时，是否自动上推页面                                                                                    |
| √ (onChange) | bindinput         | EventHandle |        | 当键盘输入时，触发 input 事件，处理函数可以直接 return 一个字符串，将替换输入框的内容。                         |
| √ (onFocus)  | bindfocus         | EventHandle |        | 输入框聚焦时触发，height 参数在基础库 1.9.90 起支持                                                             |
| √ (onBlur)   | bindblur          | EventHandle |        | 输入框失去焦点时触发                                                                                            |
|              | bindconfirm       | EventHandle |        | 点击完成按钮时触发                                                                                              |
