---
title: FunctionalPageNavigator
sidebar_label: FunctionalPageNavigator
id: version-2.1.1-Functional-Page-Navigator
original_id: Functional-Page-Navigator
---

仅在插件中有效，用于跳转到插件功能页

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html)

## 类型

```tsx
ComponentType<FunctionalPageNavigatorProps>
```

## FunctionalPageNavigatorProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>version</td>
      <td><code>&quot;develop&quot; | &quot;trial&quot; | &quot;release&quot;</code></td>
      <td style="text-align:center"><code>&quot;release&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>&quot;loginAndGetUserInfo&quot; | &quot;requestPayment&quot; | &quot;chooseAddress&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>要跳转到的功能页</td>
    </tr>
    <tr>
      <td>args</td>
      <td><code>object</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>功能页参数，参数格式与具体功能页相关</td>
    </tr>
    <tr>
      <td>onSuccess</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>功能页返回，且操作成功时触发， detail 格式与具体功能页相关</td>
    </tr>
    <tr>
      <td>onFail</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>功能页返回，且操作失败时触发， detail 格式与具体功能页相关</td>
    </tr>
    <tr>
      <td>onCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>因用户操作从功能页返回时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigatorProps.version | ✔️ |  |  |
| FunctionalPageNavigatorProps.name | ✔️ |  |  |
| FunctionalPageNavigatorProps.args | ✔️ |  |  |
| FunctionalPageNavigatorProps.onSuccess | ✔️ |  |  |
| FunctionalPageNavigatorProps.onFail | ✔️ |  |  |
| FunctionalPageNavigatorProps.onCancel | ✔️ |  |  |

### version

version 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>develop</td>
      <td>开发版</td>
    </tr>
    <tr>
      <td>trial</td>
      <td>体验版</td>
    </tr>
    <tr>
      <td>release</td>
      <td>正式版</td>
    </tr>
  </tbody>
</table>

### name

name 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>loginAndGetUserInfo</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/user-info.html">用户信息功能页</a></td>
    </tr>
    <tr>
      <td>requestPayment</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/request-payment.html">支付功能页</a></td>
    </tr>
    <tr>
      <td>chooseAddress</td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/choose-address.html">收货地址功能页</a></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FunctionalPageNavigator | ✔️ |  |  |
