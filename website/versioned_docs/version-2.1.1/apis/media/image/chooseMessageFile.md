---
title: Taro.chooseMessageFile(option)
sidebar_label: chooseMessageFile
id: version-2.1.1-chooseMessageFile
original_id: chooseMessageFile
---

从客户端会话选择文件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseMessageFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>count</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>最多可以选择的文件个数，可以 0～100</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>extension</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;all&quot; | &quot;video&quot; | &quot;image&quot; | &quot;file&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>所选的文件的类型</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>tempFiles</td>
      <td><code>ChooseFile[]</code></td>
      <td>返回选择的文件的本地临时文件对象数组</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### ChooseFile

返回选择的文件的本地临时文件对象数组

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
      <td>name</td>
      <td><code>string</code></td>
      <td>选择的文件名称</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>本地临时文件路径</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>本地临时文件大小，单位 B</td>
    </tr>
    <tr>
      <td>time</td>
      <td><code>number</code></td>
      <td>选择的文件的会话发送时间，Unix时间戳，工具暂不支持此属性</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;video&quot; | &quot;image&quot; | &quot;file&quot;</code></td>
      <td>选择的文件类型</td>
    </tr>
  </tbody>
</table>

### selectType

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>all</td>
      <td>从所有文件选择</td>
    </tr>
    <tr>
      <td>video</td>
      <td>只能选择视频文件</td>
    </tr>
    <tr>
      <td>image</td>
      <td>只能选择图片文件</td>
    </tr>
    <tr>
      <td>file</td>
      <td>可以选择除了图片和视频之外的其它的文件</td>
    </tr>
  </tbody>
</table>

### selectedType

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>video</td>
      <td>选择了视频文件</td>
    </tr>
    <tr>
      <td>image</td>
      <td>选择了图片文件</td>
    </tr>
    <tr>
      <td>file</td>
      <td>选择了除图片和视频的文件</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseMessageFile({
  count: 10,
  type: 'image',
  success: function (res) {
    // tempFilePath可以作为img标签的src属性显示图片
    const tempFilePaths = res.tempFilePaths
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseMessageFile | ✔️ |  |  |
