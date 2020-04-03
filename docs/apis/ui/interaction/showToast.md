---
title: Taro.showToast(option)
sidebar_label: showToast
---

显示消息提示框

**注意**
- Taro.showLoading 和 Taro.showToast 同时只能显示一个
- Taro.showToast 应与 Taro.hideToast 配对使用

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)

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
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>提示的内容</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>提示的延迟时间</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>icon</td>
      <td><code>&quot;success&quot; | &quot;loading&quot; | &quot;none&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>图标<br /><br />可选值：<br />- 'success': 显示成功图标，此时 title 文本最多显示 7 个汉字长度;<br />- 'loading': 显示加载图标，此时 title 文本最多显示 7 个汉字长度;<br />- 'none': 不显示图标，此时 title 文本最多可显示两行</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>自定义图标的本地路径，image 的优先级高于 icon</td>
    </tr>
    <tr>
      <td>mask</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示透明蒙层，防止触摸穿透</td>
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
Taro.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
