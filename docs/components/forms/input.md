##### Input

> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | √ | value             | String      |        | 输入框的初始内容   |
| √ | √ | x (部分支持) | type              | String      | "text" | input 的类型    |
| √ | √ | √ | password          | Boolean       | false | 是否是密码类型 |
| √ | √ | √ | placeholder       | String      |        | 输入框为空时占位符    |
| √ |   | x | placeholderStyle | String      |        | 指定 placeholder 的样式    |
| √ |   | x | placeholderClass | String      | "input-placeholder" | 指定 placeholder 的样式类  |
| √ | √ | √ | disabled          | Boolean     |  false  | 是否禁用 |
| √ | √ | √ | maxlength         | Number      |  140  | 最大输入长度，设置为 -1 的时候不限制最大长度      |
| √ |   | x | cursorSpacing    | Number      |  0  | 指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离 |
| √ |   | x | autoFocus        | Boolean     | false | (即将废弃，请直接使用 focus )自动聚焦，拉起键盘 |
| √ |   | √ | focus             | Boolean     | false  | 获取焦点 |
| √ |   | √ | confirmType      | String      |  "done" | 设置键盘右下角按钮的文字   |
| √ |   | √ | cursor            | Number      |        | 指定 focus 时的光标位置  |
| √ |   | √ | selectionStart   | Number      |  -1 | 光标起始位置，自动聚集时有效，需与 selection-end 搭配使用   |
| √ |   | √ | selectionEnd     | Number      |  -1  | 光标结束位置，自动聚集时有效，需与 selection-start 搭配使用   |
| √ |   | x | adjustPosition   | Boolean     | true  | 键盘弹起时，是否自动上推页面  |
| √ | √ | √ | (onChange) onInput   | EventHandle | | 当键盘输入时，触发 input 事件，处理函数可以直接 return 一个字符串，将替换输入框的内容。  |
| √ | √ | √ | (onFocus)  onFocus | EventHandle |        | 输入框聚焦时触发，height 参数在基础库 1.9.90 起支持    |
| √ | √ | √ | (onBlur)   onBlur | EventHandle |        | 输入框失去焦点时触发  |
| √ |   | √ |  onConfirm       | EventHandle |        | 点击完成按钮时触发   |

###### 示例：
```jsx
<Text>可以自动聚焦的input</Text>
<Input type='text' placeholder='将会获取焦点' focus/>
<Text>控制最大输入长度的input</Text>
<Input type='text' placeholder='最大输入长度为10' maxlength="10"/>
<Text>实时获取输入值:{this.state.value}</Text>
<Input type='text' placeholder='输入同步到view中' value={this.state.value} onInput={this.onInput}/>
<Text>数字输入的input</Text>
<Input type='number' placeholder='这是一个数字输入框'/>
<Text>密码输入的input</Text>
<Input type='password' password placeholder='这是一个密码输入框'/>
<Text>带小数点的input</Text>
<Input type='digit' placeholder='带小数点的数字键盘'/>
<Text>身份证输入的input</Text>
<Input type='idcard' placeholder='身份证输入键盘'/>
<Text>控制占位符颜色的input</Text>
<Input type='text' placeholder='占位符字体是红色的' placeholderStyle="color:red"/>
```
