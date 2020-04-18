---
title: Taro.showModal(option)
sidebar_label: showModal
id: version-2.1.1-showModal
original_id: showModal
---

显示模态对话框
**注意**
- Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
- Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html)

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
      <td>cancelColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>取消按钮的文字颜色，必须是 16 进制格式的颜色字符串</td>
    </tr>
    <tr>
      <td>cancelText</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>取消按钮的文字，最多 4 个字符</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>confirmColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>确认按钮的文字颜色，必须是 16 进制格式的颜色字符串</td>
    </tr>
    <tr>
      <td>confirmText</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>确认按钮的文字，最多 4 个字符</td>
    </tr>
    <tr>
      <td>content</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>提示的内容</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>showCancel</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示取消按钮</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>提示的标题</td>
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
      <td>cancel</td>
      <td><code>boolean</code></td>
      <td>为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）</td>
    </tr>
    <tr>
      <td>confirm</td>
      <td><code>boolean</code></td>
      <td>为 true 时，表示用户点击了确定按钮</td>
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
Taro.showModal({
  title: '提示',
  content: '这是一个模态弹窗',
  success: function (res) {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showModal | ✔️ | ✔️ | ✔️ |
