---
title: Taro.startHCE(option)
sidebar_label: startHCE
id: version-2.1.1-startHCE
original_id: startHCE
---

初始化 NFC 模块。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html)

## 类型

```tsx
(option: Option) => Promise<NFCError>
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
      <td>aid_list</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>需要注册到系统的 AID 列表</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: NFCError) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.startHCE({
  aid_list: ['F222222222']
  success: function (res) {
    console.log(res.errMsg)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startHCE | ✔️ |  |  |
