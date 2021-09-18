---
title: Textarea
sidebar_label: Textarea
---

Multi-line input box. This component is a Native Component. Note related limits before use.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/textarea.html)

## Type

```tsx
ComponentType<TextareaProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>Height-adaptive input area with no scroll bars</Text>
        <Textarea style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' autoHeight/>
        <Text>This is a textarea that can be autofocused</Text>
        <Textarea style='background:#fff;width:100%;height:80px;padding:0 30rpx;' autoFocus/>
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <text>Height-adaptive input area with no scroll bars</text>
    <textarea style="background:#efefef;width:100%;min-height:80px;padding:0 30rpx;" :auto-height="true" />
    <text>This is a textarea that can be autofocused</text>
    <textarea style="background:#efefef;width:100%;height:80px;padding:0 30rpx;" :auto-focusd="true" />
  </view>
</template>
```
  
</TabItem>
</Tabs>


## TextareaProps

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
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The content in the input box</td>
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
      <td>Specifies the style of the placeholder.</td>
    </tr>
    <tr>
      <td>placeholderClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;textarea-placeholder&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style class of the placeholder.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>maxlength</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>140</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum length. When it is set to "-1", the maximum length is not limited.</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Auto focus. The keyboard is automatically displayed.</td>
    </tr>
    <tr>
      <td>focus</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Gets focus</td>
    </tr>
    <tr>
      <td>autoHeight</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the height automatically increases. If this property is specified, style.height does not take effect.</td>
    </tr>
    <tr>
      <td>fixed</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>If the textarea is in an area of <code>position:fixed</code>, the value of the specified property should always be true.</td>
    </tr>
    <tr>
      <td>cursorSpacing</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the distance between the cursor and the keyboard. It is either the distance between textarea and the bottom of the screen or the distance specified via cursor-spacing, whichever is smaller.</td>
    </tr>
    <tr>
      <td>cursor</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>-1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the cursor position during focusing.</td>
    </tr>
    <tr>
      <td>showConfirmBar</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the bar containing the Done button above the keyboard</td>
    </tr>
    <tr>
      <td>selectionStart</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>-1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The start position of the cursor. It takes effect only during auto focusing, and needs to used with selectionEnd.</td>
    </tr>
    <tr>
      <td>selectionEnd</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>-1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The end position of the cursor. It takes effect only during auto focusing, and needs to used with selectionStart.</td>
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
      <td>disableDefaultPadding</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to remove the default inner margins under iOS</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;onFocusEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the input box is focused. event.detail = { `{value, height}` }, where height is the height of the keyboard.</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;onBlurEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the input box is unfocused.</td>
    </tr>
    <tr>
      <td>onLineChange</td>
      <td><code>BaseEventOrigFunction&lt;onLineChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Called when the number of lines in the input box changes, event.detail = {`{height: 0, heightRpx: 0, lineCount: 0}`}</td>
    </tr>
    <tr>
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;onInputEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An input event triggered when anything is input via the keyboard, event.detail = {`{value, cursor, keyCode}`}<br /><br /><strong>Return values of the bindinput processing function will not be reflected on textarea.</strong></td>
    </tr>
    <tr>
      <td>onConfirm</td>
      <td><code>BaseEventOrigFunction&lt;onConfirmEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A confirm event triggered when the <strong>Done</strong> button is tapped, event.detail = {`{value: value}`}</td>
    </tr>
    <tr>
      <td>onKeyboardHeightChange</td>
      <td><code>BaseEventOrigFunction&lt;onKeyboardHeightChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the height of the keyboard changes.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
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

### onBlurEventDetail

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
      <td>cursor</td>
      <td><code>number</code></td>
      <td>cursor position</td>
    </tr>
  </tbody>
</table>

### onLineChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
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
      <td>cursor</td>
      <td><code>number</code></td>
      <td>cursor position</td>
    </tr>
    <tr>
      <td>keyCode</td>
      <td><code>number</code></td>
      <td>key code</td>
    </tr>
  </tbody>
</table>

### onConfirmEventDetail

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
| Textarea | ✔️ | ✔️ | ✔️ |
