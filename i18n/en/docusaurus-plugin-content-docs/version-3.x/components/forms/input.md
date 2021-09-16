---
title: Input
sidebar_label: Input
---

Input box. This component is a Native Component. Note related limits before use.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/input.html)

## Type

```tsx
ComponentType<InputProps>
```

## Examples

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
class App extends Component {

  render () {
    return (
        <View className='example-body'>
          <Text>Auto-focusable</Text>
          <Input type='text' placeholder='focus will be acquired' focus/>
          <Text>Controls the maximum input length</Text>
          <Input type='text' placeholder='maximum input length is 10' maxlength='10'/>
          <Text>Input box for numeric type</Text>
          <Input type='number' placeholder='This is a numeric input box'/>
          <Text>Input box for password type</Text>
          <Input type='password' password placeholder='This is a password input box'/>
          <Text>Input boxes for numeric types that allow decimals</Text>
          <Input type='digit' placeholder='Numeric keypad with decimal point'/>
          <Text>Input box for ID type</Text>
          <Input type='idcard' placeholder='Keyboard support for entering ID cards'/>
          <Text>Input box with placeholder color control</Text>
          <Input type='text' placeholder='Placeholder font is red' placeholderStyle='color:red'/>
        </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="example-body">
    <text>Auto-focusable</text>
    <input type="text" placeholder="focus will be acquired" :focus="true" />
    <text>Controls the maximum input length</text>
    <input type="text" placeholder="maximum input length is 10" maxlength="10"/>
    <text>Input box for numeric type</text>
    <input type="number" placeholder="This is a numeric input box"/>
    <text>Input box for password type</text>
    <input type="password" :password="true" placeholder="This is a password input box"/>
    <text>Input boxes for numeric types that allow decimals</text>
    <input type="digit" placeholder="Numeric keypad with decimal point"/>
    <text>Input box for ID type</text>
    <input type="idcard" placeholder="Keyboard support for entering ID cards"/>
    <text>Input box with placeholder color control</text>
    <input type="text" placeholder="Placeholder font is red" placeholder-style="color:red;"/>
  </view>
</template>
```
  
</TabItem>
</Tabs>

## InputProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The initial content in the input box</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;number&quot; | &quot;text&quot; | &quot;idcard&quot; | &quot;digit&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;text&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The type of input</td>
    </tr>
    <tr>
      <td>password</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the input is password-type content</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The placeholder used when the input box is empty</td>
    </tr>
    <tr>
      <td>placeholderStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style of the placeholder</td>
    </tr>
    <tr>
      <td>placeholderClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;input-placeholder&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style class of the placeholder</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component</td>
    </tr>
    <tr>
      <td>maxlength</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>140</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum length. When it is set to "-1", the maximum length is not limited.</td>
    </tr>
    <tr>
      <td>cursorSpacing</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the distance between the cursor and the keyboard. It is either the distance between the input box and the bottom of the screen or the distance specified via cursor-spacing, whichever is smaller.</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>(Will be discarded soon. Use the focus instead.) Auto focus. The keyboard is automatically displayed.</td>
    </tr>
    <tr>
      <td>focus</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Gets focus</td>
    </tr>
    <tr>
      <td>confirmType</td>
      <td><code>&quot;send&quot; | &quot;search&quot; | &quot;next&quot; | &quot;go&quot; | &quot;done&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>done</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets the text on the lower-right button on the keyboard. It takes effect only when type='text'.</td>
    </tr>
    <tr>
      <td>confirmHold</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the keyboard is not hidden when the lower-right button on the keyboard is tapped</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the cursor position during focusing</td>
    </tr>
    <tr>
      <td>selectionStart</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>-1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The start position of the cursor. It takes effect only during auto focusing, and needs to used with selection-end.</td>
    </tr>
    <tr>
      <td>selectionEnd</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>-1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The end position of the cursor. It takes effect only during auto focusing, and needs to used with selection-start.</td>
    </tr>
    <tr>
      <td>adjustPosition</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to automatically push up the page when the keyboard is displayed</td>
    </tr>
    <tr>
      <td>holdKeyboard</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to hide the keyboard when the page is clicked when focused</td>
    </tr>
    <tr>
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;inputEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the user taps the keyboard. event.detail = {`{value, cursor, keyCode}`}, where keyCode is the key value. The processing function can directly return a string to replace the content in the input box.</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;inputForceEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the input box is focused. event.detail = {`{ value, height }`}, where height is the height of the keyboard.</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;inputValueEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the input box is unfocused. event.detail = {`{value}`}</td>
    </tr>
    <tr>
      <td>onConfirm</td>
      <td><code>BaseEventOrigFunction&lt;inputValueEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the Done button is tapped.</td>
    </tr>
    <tr>
      <td>onKeyboardHeightChange</td>
      <td><code>BaseEventOrigFunction&lt;onKeyboardHeightChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the height of the keyboard changes.<br /><br />event.detail = {`{height: height, duration: duration}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InputProps.value | ✔️ | ✔️ | ✔️ |
| InputProps.type | ✔️ | ✔️ | ✔️(partial support) |
| InputProps.password | ✔️ | ✔️ | ✔️ |
| InputProps.placeholder | ✔️ | ✔️ | ✔️ |
| InputProps.placeholderStyle | ✔️ |  |  |
| InputProps.placeholderClass | ✔️ |  |  |
| InputProps.disabled | ✔️ | ✔️ | ✔️ |
| InputProps.maxlength | ✔️ | ✔️ | ✔️ |
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
| InputProps.onConfirm | ✔️ | (Borrow the[Form component's](form.md) `onSubmit` event instead) | ✔️ |
| InputProps.onKeyboardHeightChange | ✔️ |  |  |

### inputEventDetail

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>input value</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td>cursor position</td>
    </tr>
    <tr>
      <td>keyCode</td>
      <td><code>number</code></td>
      <td>Key Value</td>
    </tr>
  </tbody>
</table>


> Note: React-Native side `inputEventDetail` only has parameter `value`，if you need to get the cursor position in real time, you can do it by [`onSelectionChange`](https://reactnative.dev/docs/textinput#onselectionchange).

### inputForceEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>input value</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Keyboard height</td>
    </tr>
  </tbody>
</table>

### inputValueEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>input value</td>
    </tr>
  </tbody>
</table>

### onKeyboardHeightChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Keyboard height</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>Duration</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Input | ✔️ | ✔️ | ✔️ |
