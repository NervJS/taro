---
title: Taro.getSavedFileList(option)
sidebar_label: getSavedFileList
---

获取本地已保存的文件列表

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileList.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
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
      <td>fileList</td>
      <td><code>FileItem[]</code></td>
      <td>文件数组</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### FileItem

文件数组

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
      <td>createTime</td>
      <td><code>number</code></td>
      <td>文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数</td>
    </tr>
    <tr>
      <td>filePath</td>
      <td><code>string</code></td>
      <td>本地路径</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>number</code></td>
      <td>本地文件大小，以字节为单位</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getSavedFileList({
  success: function (res) {
    console.log(res.fileList)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSavedFileList | ✔️ |  |  |
