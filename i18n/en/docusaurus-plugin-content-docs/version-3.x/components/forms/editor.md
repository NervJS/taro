---
title: Editor
sidebar_label: Editor
---

Rich text editor that allows you to edit images and text.

The editor can export plain text and html that contains tags, and store data in the form of delta files.

When the content is set via the setContents API, the html inserted during content parsing may cause a parsing error due to some invalid tags. We recommend that the html inserted into Mini Programs be delta-formatted.

Some basic styles are introduced to the rich text component to ensure that the content is correctly displayed. These basic styles can be overwritten during development. To export html via the rich text component from other components or environments, you need to additionally introduce This Section of Styles, and maintain the <ql-container><ql-editor></ql-editor></ql-container> structure.

Image controls take effect only during initialization.

*Some HTML tags and inline styles are supported within the editor, **class** and **id** are not supported*

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/editor.html)

## Type

```tsx
ComponentType<EditorProps>
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
class App extends Components {
  state = {
    placeholder: 'Please enter your nickname...'
  }

  editorReady = e => {
    Taro.createSelectorQuery().select('#editor').context((res) => {
      this.editorCtx = res.context
    }).exec()
  }

  undo = e => {
    this.editorCtx.undo()
  }

  render () {
    return (
      <View>
        <Editor id='editor' className='editor' placeholder={this.state.placeholder} onReady={this.editorReady}></Editor>
        <Button type='warn' onClick={this.undo}>Undo</Button>
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="container">
    <editor id="editor" class="editor" :placeholder="placeholder" @ready="editorReady"></editor>
    <button type="warn" @tap="undo">Undo</button>
  </view>
</template>

<script>
  import Taro from '@tarojs/taro'
  export default {
    data() {
      return {
        placeholder: 'Please enter your nickname...'
      }
    },
    methods: {
      editorReady() {
        Taro.createSelectorQuery().select('#editor').context((res) => {
          this.editorCtx = res.context
        }).exec()
      },
      undo() {
        this.editorCtx.undo()
      }
    }
  }
</script>
```
  
</TabItem>
</Tabs>

## EditorProps

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
      <td>readOnly</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets the editor to read-only</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Prompts information</td>
    </tr>
    <tr>
      <td>showImgSize</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays the image size control when the image is tapped</td>
    </tr>
    <tr>
      <td>showImgToolbar</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays the toolbar control when the image is tapped</td>
    </tr>
    <tr>
      <td>showImgResize</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays the size change control when the image is tapped</td>
    </tr>
    <tr>
      <td>onReady</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered after the editor is initialized</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the editor is focused.<br />event.detail = {`{ html, text, delta }`}</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the editor is unfocused.<br />detail = {`{ html, text, delta }`}</td>
    </tr>
    <tr>
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the editor content changes.<br />detail = {`{ html, text, delta }`}</td>
    </tr>
    <tr>
      <td>onStatuschange</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when styles in the editor are changed via Context. It returns the styles that are set for the selected area.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorProps.readOnly | ✔️ |  |  |
| EditorProps.placeholder | ✔️ |  |  |
| EditorProps.showImgSize | ✔️ |  |  |
| EditorProps.showImgToolbar | ✔️ |  |  |
| EditorProps.showImgResize | ✔️ |  |  |
| EditorProps.onReady | ✔️ |  |  |
| EditorProps.onFocus | ✔️ |  |  |
| EditorProps.onBlur | ✔️ |  |  |
| EditorProps.onInput | ✔️ |  |  |
| EditorProps.onStatuschange | ✔️ |  |  |

### editorEventDetail

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Editor | ✔️ |  |  |
