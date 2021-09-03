---
title: OfficialAccount
sidebar_label: OfficialAccount
---

公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。

Tips 使用组件前，需前往小程序后台，在“设置”->“关注公众号”中设置要展示的公众号。注：设置的公众号需与小程序主体一致。

detail object

Valid values of status

The Mini Program is opened by scanning the Mini Program code (scene value 1047).

Each page can include only one Official Account following component.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html)

## Type

```tsx
ComponentType<OfficialAccountProps>
```

## OfficialAccountProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the component is loaded successfully.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the component fails to be loaded.</td>
    </tr>
  </tbody>
</table>

### Property Support

|             API              | WeChat Mini-Program | H5 | React Native |
|:----------------------------:|:-------------------:|:--:|:------------:|
| OfficialAccountProps.onLoad  |         ✔️          |    |              |
| OfficialAccountProps.onError |         ✔️          |    |              |

### detail

detail 对象

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>number</code></td>
      <td>Status code</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

### status

status 有效值

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-2</td>
      <td>Network error</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>Data parsing error</td>
    </tr>
    <tr>
      <td>0</td>
      <td>Loading succeeded</td>
    </tr>
    <tr>
      <td>1</td>
      <td>The Official Account following feature in the Mini Program is suspended</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Linked Official Account is suspended</td>
    </tr>
    <tr>
      <td>3</td>
      <td>The Official Account is unlinked or not selected</td>
    </tr>
    <tr>
      <td>4</td>
      <td>The Official Account following feature is disabled</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Scene value error</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Repeated creation</td>
    </tr>
  </tbody>
</table>

## API Support

|       API       | WeChat Mini-Program | H5 | React Native |
|:---------------:|:-------------------:|:--:|:------------:|
| OfficialAccount |         ✔️          |    |              |
