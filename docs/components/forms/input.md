---
title: Input
sidebar_label: Input
---

输入框。该组件是原生组件，使用时请注意相关限制

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)

## 类型

```tsx
ComponentType<InputProps>
```

## 示例代码

```tsx
class App extends Component {

  render () {
    return (
        <View className='example-body'>
          <Text>可以自动聚焦的 input</Text>
            <Input type='text' placeholder='将会获取焦点' focus/>
            <Text>控制最大输入长度的 input</Text>
            <Input type='text' placeholder='最大输入长度为 10' maxLength='10'/>
            <Text>数字输入的 input</Text>
            <Input type='number' placeholder='这是一个数字输入框'/>
            <Text>密码输入的 input</Text>
            <Input type='password' password placeholder='这是一个密码输入框'/>
            <Text>带小数点的 input</Text>
            <Input type='digit' placeholder='带小数点的数字键盘'/>
            <Text>身份证输入的 input</Text>
            <Input type='idcard' placeholder='身份证输入键盘'/>
            <Text>控制占位符颜色的 input</Text>
            <Input type='text' placeholder='占位符字体是红色的' placeholderStyle='color:red'/>
        </View>
    )
  }
}
```

## InputProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| value | `string` |  | 否 | 输入框的初始内容 |
| type | "number" or "text" or "idcard" or "digit" | `"text"` | 否 | input 的类型 |
| password | `boolean` |  | 否 | 是否是密码类型 |
| placeholder | `string` |  | 否 | 输入框为空时占位符 |
| placeholderStyle | `string` |  | 否 | 指定 placeholder 的样式 |
| placeholderClass | `string` | `"input-placeholder"` | 否 | 指定 placeholder 的样式类 |
| disabled | `boolean` |  | 否 | 是否禁用 |
| maxLength | `number` | `140` | 否 | 最大输入长度，设置为 -1 的时候不限制最大长度 |
| cursorSpacing | `number` | `0` | 否 | 指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离 |
| autoFocus | `boolean` | `false` | 否 | (即将废弃，请直接使用 focus )自动聚焦，拉起键盘 |
| focus | `boolean` |  | 否 | 获取焦点 |
| confirmType | "send" or "search" or "next" or "go" or "done" | `done` | 否 | 设置键盘右下角按钮的文字 |
| confirmHold | `boolean` | `false` | 否 | 点击键盘右下角按钮时是否保持键盘不收起 |
| cursor | `number` |  | 否 | 指定focus时的光标位置 |
| selectionStart | `number` | `-1` | 否 | 光标起始位置，自动聚集时有效，需与selection-end搭配使用 |
| selectionEnd | `number` | `-1` | 否 | 光标结束位置，自动聚集时有效，需与selection-start搭配使用 |
| adjustPosition | `boolean` | `false` | 否 | 键盘弹起时，是否自动上推页面 |
| holdKeyboard | `boolean` | `false` | 否 | focus 时，点击页面的时候不收起键盘 |
| onInput | `BaseEventOrigFunction<inputEventDetail>` |  | 否 | 当键盘输入时，触发input事件，event.detail = {value, cursor, keyCode}，处理函数可以直接 return 一个字符串，将替换输入框的内容。 |
| onFocus | `BaseEventOrigFunction<inputForceEventDetail>` |  | 否 | 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度 |
| onBlur | `BaseEventOrigFunction<inputValueEventDetail>` |  | 否 | 输入框失去焦点时触发<br /><br />event.detail = {value: value} |
| onConfirm | `BaseEventOrigFunction<inputValueEventDetail>` |  | 否 | 点击完成按钮时触发<br /><br />event.detail = {value: value} |
| onKeyboardHeightChange | `BaseEventOrigFunction<onKeyboardHeightChangeEventDetail>` |  | 否 | 键盘高度发生变化的时候触发此事件<br /><br />event.detail = {height: height, duration: duration} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InputProps.value | ✔️ | ✔️ | ✔️ |
| InputProps.type | ✔️ | ✔️ | ✔️(部分支持) |
| InputProps.password | ✔️ | ✔️ | ✔️ |
| InputProps.placeholder | ✔️ | ✔️ | ✔️ |
| InputProps.placeholderStyle | ✔️ |  |  |
| InputProps.placeholderClass | ✔️ |  |  |
| InputProps.disabled | ✔️ | ✔️ | ✔️ |
| InputProps.maxLength | ✔️ | ✔️ | ✔️ |
| InputProps.cursorSpacing | ✔️ |  |  |
| InputProps.autoFocus | ✔️ |  |  |
| InputProps.focus | ✔️ | ✔️ | ✔️ |
| InputProps.confirmType | ✔️ |  | ✔️ |
| InputProps.confirmHold | ✔️ |  |  |
| InputProps.cursor | ✔️ |  | ✔️ |
| InputProps.selectionStart | ✔️ |  | ✔️ |
| InputProps.selectionEnd | ✔️ |  | ✔️ |
| InputProps.adjustPosition | ✔️ |  |  |
| InputProps.holdKeyboard | ✔️ |  |  |
| InputProps.onInput | ✔️ | ✔️ | ✔️ |
| InputProps.onFocus | ✔️ | ✔️ | ✔️ |
| InputProps.onBlur | ✔️ | ✔️ | ✔️ |
| InputProps.onConfirm | ✔️ | (借用[Form 组件](form.html)的`onSubmit`事件来替代) | ✔️ |
| InputProps.onKeyboardHeightChange | ✔️ |  |  |

### inputEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |
| cursor | `number` | 光标位置 |
| keyCode | `number` | 键值 |

### inputForceEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |
| height | `number` | 键盘高度 |

### inputValueEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |

### onKeyboardHeightChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| height | `number` | 键盘高度 |
| duration | `number` | 持续时间 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Input | ✔️ | ✔️ | ✔️ |
