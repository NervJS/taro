---
title: Taro.saveFile(option)
sidebar_label: saveFile
id: version-2.1.1-saveFile
original_id: saveFile
---

保存文件到本地。**注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult | FailCallbackResult>
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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>临时存储文件路径</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(result: FailCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>要存储的文件路径</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### FailCallbackResult

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息<br /><br />可选值：<br />- 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;<br />- 'fail permission denied, open &quot;${filePath}&quot;': 指定的 filePath 路径没有写权限;<br />- 'fail no such file or directory &quot;${dirPath}&quot;': 上级目录不存在;<br />- 'fail the maximum size of the file storage limit is exceeded': 存储空间不足;</td>
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
      <td>savedFilePath</td>
      <td><code>number</code></td>
      <td>存储后的文件路径</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.chooseImage({
  success: function (res) {
    var tempFilePaths = res.tempFilePaths
    Taro.saveFile({
      tempFilePath: tempFilePaths[0],
      success: function (res) {
        var savedFilePath = res.savedFilePath
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.saveFile | ✔️ |  |  |
