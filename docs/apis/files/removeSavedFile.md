---
title: Taro.removeSavedFile(option)
sidebar_label: removeSavedFile
---

删除该小程序下已保存的本地缓存文件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.removeSavedFile.html)

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
      <td>需要删除的文件路径</td>
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
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### RemoveSavedFileFailCallbackResult

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
      <td>错误信息<br /><br />可选值：<br />- 'fail file not exist': 指定的 tempFilePath 找不到文件;</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getSavedFileList({
  success: function (res) {
    if (res.fileList.length > 0){
      Taro.removeSavedFile({
        filePath: res.fileList[0].filePath,
        complete: function (res) {
          console.log(res)
        }
      })
    }
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.removeSavedFile | ✔️ |  |  |
