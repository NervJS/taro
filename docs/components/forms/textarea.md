---
title: Textarea
sidebar_label: Textarea
---

多行输入框。该组件是原生组件，使用时请注意相关限制

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html)

## 类型

```tsx
ComponentType<TextareaProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>输入区域高度自适应，不会出现滚动条</Text>
        <Textarea style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' autoHeight/>
        <Text>这是一个可以自动聚焦的 textarea</Text>
        <Textarea style='background:#fff;width:100%;height:80px;padding:0 30rpx;' autoFocus/>
      </View>
    )
  }
}
```

## TextareaProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| value | `string` |  | 是 | 输入框的内容 |
| placeholder | `string` |  | 否 | 输入框为空时占位符 |
| placeholderStyle | `string` |  | 否 | 指定 placeholder 的样式 |
| placeholderClass | `string` | `"textarea-placeholder"` | 否 | 指定 placeholder 的样式类 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| maxlength | `number` | `140` | 否 | 最大输入长度，设置为 -1 的时候不限制最大长度 |
| autoFocus | `boolean` | `false` | 否 | 自动聚焦，拉起键盘 |
| focus | `boolean` | `false` | 否 | 获取焦点 |
| autoHeight | `boolean` | `false` | 否 | 是否自动增高，设置 autoHeight 时，style.height不生效 |
| fixed | `boolean` | `false` | 否 | 如果 Textarea 是在一个 `position:fixed` 的区域，需要显示指定属性 fixed 为 true |
| cursorSpacing | `number` | `0` | 否 | 指定光标与键盘的距离，单位 px 。取 Textarea 距离底部的距离和 cursorSpacing 指定的距离的最小值作为光标与键盘的距离 |
| cursor | `number` | `-1` | 否 | 指定 focus 时的光标位置 |
| showConfirmBar | `boolean` | `true` | 否 | 是否显示键盘上方带有”完成“按钮那一栏 |
| selectionStart | `number` | `-1` | 否 | 光标起始位置，自动聚集时有效，需与 selectionEnd 搭配使用 |
| selectionEnd | `number` | `-1` | 否 | 光标结束位置，自动聚集时有效，需与 selectionStart 搭配使用 |
| adjustPosition | `boolean` | `true` | 否 | 键盘弹起时，是否自动上推页面 |
| holdKeyboard | `boolean` | `false` | 否 | focus 时，点击页面的时候不收起键盘 |
| disableDefaultPadding | `boolean` | `false` | 否 | 是否去掉 iOS 下的默认内边距 |
| onFocus | `BaseEventOrigFunction<onFocusEventDetail>` |  | 否 | 输入框聚焦时触发 |
| onBlur | `BaseEventOrigFunction<onBlurEventDetail>` |  | 否 | 输入框失去焦点时触发 |
| onLineChange | `BaseEventOrigFunction<onLineChangeEventDetail>` |  | 否 | 输入框行数变化时调用，event.detail = {height: 0, heightRpx: 0, lineCount: 0} |
| onInput | `BaseEventOrigFunction<onInputEventDetail>` |  | 否 | 当键盘输入时，触发 input 事件，event.detail = {value, cursor, keyCode}<br /><br />**onInput 处理函数的返回值并不会反映到 textarea 上** |
| onConfirm | `BaseEventOrigFunction<onConfirmEventDetail>` |  | 否 | 点击完成时， 触发 confirm 事件，event.detail = {value: value} |
| onKeyboardHeightChange | `BaseEventOrigFunction<onKeyboardHeightChangeEventDetail>` |  | 否 | 键盘高度发生变化的时候触发此事件 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| TextareaProps.value | ✔️ | ✔️ | ✔️ |
| TextareaProps.placeholder | ✔️ | ✔️ | ✔️ |
| TextareaProps.placeholderStyle | ✔️ |  |  |
| TextareaProps.placeholderClass | ✔️ |  |  |
| TextareaProps.disabled | ✔️ | ✔️ | ✔️ |
| TextareaProps.maxlength | ✔️ | ✔️ | ✔️ |
| TextareaProps.autoFocus | ✔️ | ✔️ |  |
| TextareaProps.focus | ✔️ |  | ✔️ |
| TextareaProps.autoHeight | ✔️ |  | ✔️ |
| TextareaProps.fixed | ✔️ |  |  |
| TextareaProps.cursorSpacing | ✔️ |  |  |
| TextareaProps.cursor | ✔️ |  |  |
| TextareaProps.showConfirmBar | ✔️ |  |  |
| TextareaProps.selectionStart | ✔️ |  | ✔️ |
| TextareaProps.selectionEnd | ✔️ |  | ✔️ |
| TextareaProps.adjustPosition | ✔️ |  |  |
| TextareaProps.holdKeyboard | ✔️ |  |  |
| TextareaProps.disableDefaultPadding | ✔️ |  |  |
| TextareaProps.onFocus | ✔️ | ✔️ | ✔️ |
| TextareaProps.onBlur | ✔️ | ✔️ | ✔️ |
| TextareaProps.onLineChange | ✔️ |  | ✔️ |
| TextareaProps.onInput | ✔️ | ✔️ | ✔️ |
| TextareaProps.onConfirm | ✔️ |  | ✔️ |
| TextareaProps.onKeyboardHeightChange | ✔️ |  |  |

### onFocusEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |
| height | `number` | 键盘高度 |

### onBlurEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |
| cursor | `number` | 光标位置 |

### onLineChangeEventDetail

| 参数 | 类型 |
| --- | --- |
| height | `number` |
| heightRpx | `number` |
| lineCount | `number` |

### onInputEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 输入值 |
| cursor | `number` | 光标位置 |
| keyCode | `number` | 键值 |

### onConfirmEventDetail

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
| Textarea | ✔️ | ✔️ | ✔️ |
