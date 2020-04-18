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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>输入框的内容</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框为空时占位符</td>
    </tr>
    <tr>
      <td>placeholderStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定 placeholder 的样式</td>
    </tr>
    <tr>
      <td>placeholderClass</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;textarea-placeholder&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定 placeholder 的样式类</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>maxlength</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>140</code></td>
      <td style="text-align:center">否</td>
      <td>最大输入长度，设置为 -1 的时候不限制最大长度</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>自动聚焦，拉起键盘</td>
    </tr>
    <tr>
      <td>focus</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>获取焦点</td>
    </tr>
    <tr>
      <td>autoHeight</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否自动增高，设置 autoHeight 时，style.height不生效</td>
    </tr>
    <tr>
      <td>fixed</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>如果 Textarea 是在一个 <code>position:fixed</code> 的区域，需要显示指定属性 fixed 为 true</td>
    </tr>
    <tr>
      <td>cursorSpacing</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>指定光标与键盘的距离，单位 px 。取 Textarea 距离底部的距离和 cursorSpacing 指定的距离的最小值作为光标与键盘的距离</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>-1</code></td>
      <td style="text-align:center">否</td>
      <td>指定 focus 时的光标位置</td>
    </tr>
    <tr>
      <td>showConfirmBar</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示键盘上方带有”完成“按钮那一栏</td>
    </tr>
    <tr>
      <td>selectionStart</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>-1</code></td>
      <td style="text-align:center">否</td>
      <td>光标起始位置，自动聚集时有效，需与 selectionEnd 搭配使用</td>
    </tr>
    <tr>
      <td>selectionEnd</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>-1</code></td>
      <td style="text-align:center">否</td>
      <td>光标结束位置，自动聚集时有效，需与 selectionStart 搭配使用</td>
    </tr>
    <tr>
      <td>adjustPosition</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>键盘弹起时，是否自动上推页面</td>
    </tr>
    <tr>
      <td>holdKeyboard</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>focus 时，点击页面的时候不收起键盘</td>
    </tr>
    <tr>
      <td>disableDefaultPadding</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否去掉 iOS 下的默认内边距</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;onFocusEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框聚焦时触发</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;onBlurEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框失去焦点时触发</td>
    </tr>
    <tr>
      <td>onLineChange</td>
      <td><code>BaseEventOrigFunction&lt;onLineChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框行数变化时调用，event.detail = {height: 0, heightRpx: 0, lineCount: 0}</td>
    </tr>
    <tr>
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;onInputEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当键盘输入时，触发 input 事件，event.detail = {value, cursor, keyCode}<br /><br /><strong>onInput 处理函数的返回值并不会反映到 textarea 上</strong></td>
    </tr>
    <tr>
      <td>onConfirm</td>
      <td><code>BaseEventOrigFunction&lt;onConfirmEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击完成时， 触发 confirm 事件，event.detail = {value: value}</td>
    </tr>
    <tr>
      <td>onKeyboardHeightChange</td>
      <td><code>BaseEventOrigFunction&lt;onKeyboardHeightChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>键盘高度发生变化的时候触发此事件</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>输入值</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>键盘高度</td>
    </tr>
  </tbody>
</table>

### onBlurEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>输入值</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td>光标位置</td>
    </tr>
  </tbody>
</table>

### onLineChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
    </tr>
    <tr>
      <td>heightRpx</td>
      <td><code>number</code></td>
    </tr>
    <tr>
      <td>lineCount</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

### onInputEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>输入值</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td>光标位置</td>
    </tr>
    <tr>
      <td>keyCode</td>
      <td><code>number</code></td>
      <td>键值</td>
    </tr>
  </tbody>
</table>

### onConfirmEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>输入值</td>
    </tr>
  </tbody>
</table>

### onKeyboardHeightChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>键盘高度</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>持续时间</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Textarea | ✔️ | ✔️ | ✔️ |
