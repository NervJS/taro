---
title: EditorContext
sidebar_label: EditorContext
---

`EditorContext` 实例，可通过 `Taro.createSelectorQuery` 获取。
`EditorContext` 通过 `id` 跟一个 `editor` 组件绑定，操作对应的 `editor` 组件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.html)

## 方法

### blur

编辑器失焦，同时收起键盘。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.blur.html)

```tsx
(option?: BlurOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `BlurOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.blur | ✔️ |  |  |

### clear

清空编辑器内容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.clear.html)

```tsx
(option?: ClearOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `ClearOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.clear | ✔️ |  |  |

### format

修改样式

****

## 支持设置的样式列表
| name | value |
| ------| ------ |
| bold  |        |
| italic  |        |
| underline  |        |
| strike  |        |
| ins  |        |
| script  | sub / super |
| header  | H1 / H2 / h3 / H4 / h5 /  H6 |
| align  | left / center / right / justify |
| direction  | rtl  |
| indent | -1 / +1 |
| list | ordered / bullet / check |
| color | hex color |
| backgroundColor| hex color |
| margin/marginTop/marginBottom/marginLeft/marginRight  |  css style  |
| padding/paddingTop/paddingBottom/paddingLeft/paddingRight  | css style |
| font/fontSize/fontStyle/fontVariant/fontWeight/fontFamily  |  css style |
| lineHeight | css style |
| letterSpacing |  css style |
| textDecoration |  css style |
| textIndent    | css style |

对已经应用样式的选区设置会取消样式。css style 表示 css 中规定的允许值。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.format.html)

```tsx
(name: string, value?: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | `string` | 属性 |
| value | `string` | 值 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.format | ✔️ |  |  |

### getContents

获取编辑器内容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.getContents.html)

```tsx
(option?: GetContentsOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `GetContentsOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.getContents | ✔️ |  |  |

### insertDivider

插入分割线

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertDivider.html)

```tsx
(option?: InsertDividerOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `InsertDividerOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.insertDivider | ✔️ |  |  |

### insertImage

插入图片。

地址为临时文件时，获取的编辑器html格式内容中 <img> 标签增加属性 data-local，delta 格式内容中图片 attributes 属性增加 data-local 字段，该值为传入的临时文件地址。

开发者可选择在提交阶段上传图片到服务器，获取到网络地址后进行替换。替换时对于html内容应替换掉 <img> 的 src 值，对于 delta 内容应替换掉 `insert { image: abc }` 值。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertImage.html)

```tsx
(option: InsertImageOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `InsertImageOption` |

#### 示例代码

```tsx
this.editorCtx.insertImage({
  src: 'xx',
  width: '100px',
  height: '50px',
  extClass: className
})
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.insertImage | ✔️ |  |  |

### insertText

覆盖当前选区，设置一段文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.insertText.html)

```tsx
(option: InsertTextOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `InsertTextOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.insertText | ✔️ |  |  |

### redo

恢复

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.redo.html)

```tsx
(option?: RedoOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RedoOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.redo | ✔️ |  |  |

### removeFormat

清除当前选区的样式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.removeFormat.html)

```tsx
(option?: RemoveFormatOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `RemoveFormatOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.removeFormat | ✔️ |  |  |

### scrollIntoView

使得编辑器光标处滚动到窗口可视区域内。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.scrollIntoView.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.scrollIntoView | ✔️ |  |  |

### setContents

初始化编辑器内容，html和delta同时存在时仅delta生效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.setContents.html)

```tsx
(option: SetContentsOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `SetContentsOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.setContents | ✔️ |  |  |

### undo

撤销

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.undo.html)

```tsx
(option?: UndoOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `UndoOption` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.undo | ✔️ |  |  |

## 参数

### BlurOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### ClearOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### GetContentsOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### InsertDividerOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### InsertImageOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| src | `string` | 是 | 图片地址，仅支持 http(s)、base64、云图片(2.8.0)、临时文件(2.8.3)。 |
| alt | `string` | 否 | 图像无法显示时的替代文本 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| data | `Record<string, any>` | 否 | data 被序列化为 name=value;name1=value2 的格式挂在属性 data-custom 上 |
| extClass | `string` | 否 | 添加到图片 img 标签上的类名 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| height | `string` | 否 | 图片高度 (pixels/百分比) |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| width | `string` | 否 | 图片宽度（pixels/百分比) |

### InsertTextOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| text | `string` | 否 | 文本内容 |

### RedoOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### RemoveFormatOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SetContentsOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| delta | `Record<string, any>` | 否 | 表示内容的delta对象 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| html | `string` | 否 | 带标签的HTML内容 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### UndoOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EditorContext.blur | ✔️ |  |  |
| EditorContext.clear | ✔️ |  |  |
| EditorContext.format | ✔️ |  |  |
| EditorContext.getContents | ✔️ |  |  |
| EditorContext.insertDivider | ✔️ |  |  |
| EditorContext.insertImage | ✔️ |  |  |
| EditorContext.insertText | ✔️ |  |  |
| EditorContext.redo | ✔️ |  |  |
| EditorContext.removeFormat | ✔️ |  |  |
| EditorContext.scrollIntoView | ✔️ |  |  |
| EditorContext.setContents | ✔️ |  |  |
| EditorContext.undo | ✔️ |  |  |
