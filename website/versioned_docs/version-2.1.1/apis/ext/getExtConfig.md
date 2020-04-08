---
title: Taro.getExtConfig(option)
sidebar_label: getExtConfig
id: version-2.1.1-getExtConfig
original_id: getExtConfig
---

获取[第三方平台](https://developers.weixin.qq.com/miniprogram/dev/devtools/ext.html)自定义的数据字段。

**Tips**
1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfig 是否存在来兼容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfig.html)

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
      <td>extConfig</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>第三方平台自定义的数据</td>
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
if(Taro.getExtConfig) {
  Taro.getExtConfig({
    success: function (res) {
      console.log(res.extConfig)
    }
  })
}
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getExtConfig | ✔️ |  |  |
