---
title: Editor
sidebar_label: Editor
id: version-2.1.1-editor
original_id: editor
---

富文本编辑器，可以对图片、文字进行编辑。

编辑器导出内容支持带标签的 html和纯文本的 text，编辑器内部采用 delta 格式进行存储。

通过 setContents 接口设置内容时，解析插入的 html 可能会由于一些非法标签导致解析错误，建议开发者在小程序内使用时通过 delta 进行插入。

富文本组件内部引入了一些基本的样式使得内容可以正确的展示，开发时可以进行覆盖。需要注意的是，在其它组件或环境中使用富文本组件导出的 html 时，需要额外引入 这段样式，并维护 `<ql-container><ql-editor></ql-editor></ql-container>` 的结构。

图片控件仅初始化时设置有效。

*编辑器内支持部分 HTML 标签和内联样式，不支持 **class** 和 **id***

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/editor.html)

## 类型

```tsx
ComponentType<EditorProps>
```

## EditorProps

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
      <td>readOnly</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置编辑器为只读</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>提示信息</td>
    </tr>
    <tr>
      <td>showImgSize</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>点击图片时显示图片大小控件</td>
    </tr>
    <tr>
      <td>showImgToolbar</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>点击图片时显示工具栏控件</td>
    </tr>
    <tr>
      <td>showImgResize</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>点击图片时显示修改尺寸控件</td>
    </tr>
    <tr>
      <td>onReady</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>编辑器初始化完成时触发</td>
    </tr>
    <tr>
      <td>onFocus</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>编辑器聚焦时触发<br />event.detail = { html, text, delta }</td>
    </tr>
    <tr>
      <td>onBlur</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>编辑器失去焦点时触发<br />detail = { html, text, delta }</td>
    </tr>
    <tr>
      <td>onInput</td>
      <td><code>BaseEventOrigFunction&lt;editorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>编辑器内容改变时触发<br />detail = { html, text, delta }</td>
    </tr>
    <tr>
      <td>onStatuschange</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Editor | ✔️ |  |  |
