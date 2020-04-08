---
title: Taro.setClipboardData(option)
sidebar_label: setClipboardData
id: version-2.1.1-setClipboardData
original_id: setClipboardData
---

设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html)

## 类型

```tsx
(option: Option) => Promise<Promised>
```

## 参数

### Promised

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
      <td>调用信息</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>string</code></td>
      <td>剪贴板的内容</td>
    </tr>
  </tbody>
</table>

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
      <td>data</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>剪贴板的内容</td>
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

## 示例代码

```tsx
Taro.setClipboardData({
  data: 'data',
  success: function (res) {
    Taro.getClipboardData({
      success: function (res) {
        console.log(res.data) // data
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setClipboardData | ✔️ | ✔️(部分实现) | ✔️ |
