---
title: Taro.openDocument(option)
sidebar_label: openDocument
id: version-2.1.1-openDocument
original_id: openDocument
---

新开页面打开文档，支持格式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>文件路径，可通过 downloadFile 获得</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>fileType</td>
      <td><code>&quot;doc&quot; | &quot;docx&quot; | &quot;xls&quot; | &quot;xlsx&quot; | &quot;ppt&quot; | &quot;pptx&quot; | &quot;pdf&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>文件类型，指定文件类型打开文件</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### fileType

文件类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>doc</td>
      <td>doc 格式</td>
    </tr>
    <tr>
      <td>docx</td>
      <td>docx 格式</td>
    </tr>
    <tr>
      <td>xls</td>
      <td>xls 格式</td>
    </tr>
    <tr>
      <td>xlsx</td>
      <td>xlsx 格式</td>
    </tr>
    <tr>
      <td>ppt</td>
      <td>ppt 格式</td>
    </tr>
    <tr>
      <td>pptx</td>
      <td>pptx 格式</td>
    </tr>
    <tr>
      <td>pdf</td>
      <td>pdf 格式</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.downloadFile({
  url: 'http://example.com/somefile.pdf',
  success: function (res) {
    var filePath = res.tempFilePath
    Taro.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openDocument | ✔️ |  |  |
