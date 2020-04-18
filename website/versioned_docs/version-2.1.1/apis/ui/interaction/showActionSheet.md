---
title: Taro.showActionSheet(option)
sidebar_label: showActionSheet
id: version-2.1.1-showActionSheet
original_id: showActionSheet
---

显示操作菜单

**注意**
- Android 6.7.2 以下版本，点击取消或蒙层时，回调 fail, errMsg 为 "fail cancel"；
- Android 6.7.2 及以上版本 和 iOS 点击蒙层不会关闭模态弹窗，所以尽量避免使用「取消」分支中实现业务逻辑

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showActionSheet.html)

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
      <td>itemList</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>按钮的文字数组，数组长度最大为 6</td>
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
      <td>itemColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>按钮的文字颜色</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: CallbackResult) =&gt; void</code></td>
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
      <td>tapIndex</td>
      <td><code>number</code></td>
      <td>用户点击的按钮序号，从上到下的顺序，从0开始</td>
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
Taro.showActionSheet({
  itemList: ['A', 'B', 'C'],
  success: function (res) {
    console.log(res.tapIndex)
  },
  fail: function (res) {
    console.log(res.errMsg)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |
