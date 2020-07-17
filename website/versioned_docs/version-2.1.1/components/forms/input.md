---
title: Input
sidebar_label: Input
id: version-2.1.1-input
original_id: input
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
      <td style="text-align:center">否</td>
      <td>输入框的初始内容</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;number&quot; | &quot;text&quot; | &quot;idcard&quot; | &quot;digit&quot;</code></td>
      <td style="text-align:center"><code>&quot;text&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>input 的类型</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>是否是密码类型</td>
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
      <td style="text-align:center"><code>&quot;input-placeholder&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定 placeholder 的样式类</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>maxLength</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>140</code></td>
      <td style="text-align:center">否</td>
      <td>最大输入长度，设置为 -1 的时候不限制最大长度</td>
    </tr>
    <tr>
      <td>cursorSpacing</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>指定光标与键盘的距离，单位 px 。取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>(即将废弃，请直接使用 focus )自动聚焦，拉起键盘</td>
    </tr>
    <tr>
      <td>focus</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>获取焦点</td>
    </tr>
    <tr>
      <td>confirmType</td>
      <td><code>&quot;send&quot; | &quot;search&quot; | &quot;next&quot; | &quot;go&quot; | &quot;done&quot;</code></td>
      <td style="text-align:center"><code>done</code></td>
      <td style="text-align:center">否</td>
      <td>设置键盘右下角按钮的文字</td>
    </tr>
    <tr>
      <td>confirmHold</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>点击键盘右下角按钮时是否保持键盘不收起</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定focus时的光标位置</td>
    </tr>
    <tr>
      <td>selectionStart</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>-1</code></td>
      <td style="text-align:center">否</td>
      <td>光标起始位置，自动聚集时有效，需与selection-end搭配使用</td>
    </tr>
    <tr>
      <td>selectionEnd</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>-1</code></td>
      <td style="text-align:center">否</td>
      <td>光标结束位置，自动聚集时有效，需与selection-start搭配使用</td>
    </tr>
    <tr>
      <td>adjustPosition</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
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
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;inputEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当键盘输入时，触发input事件，event.detail = {value, cursor, keyCode}，处理函数可以直接 return 一个字符串，将替换输入框的内容。</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;inputForceEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;inputValueEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输入框失去焦点时触发<br /><br />event.detail = {value: value}</td>
    </tr>
    <tr>
      <td>onConfirm</td>
      <td><code>BaseEventOrigFunction&lt;inputValueEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击完成按钮时触发<br /><br />event.detail = {value: value}</td>
    </tr>
    <tr>
      <td>onKeyboardHeightChange</td>
      <td><code>BaseEventOrigFunction&lt;onKeyboardHeightChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>键盘高度发生变化的时候触发此事件<br /><br />event.detail = {height: height, duration: duration}</td>
    </tr>
  </tbody>
</table>

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

### inputForceEventDetail

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

### inputValueEventDetail

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
| Input | ✔️ | ✔️ | ✔️ |
