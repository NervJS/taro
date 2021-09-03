---
title: WebView
sidebar_label: WebView
---

Container that carries webpages. It automatically fills the entire Mini Program page.个人类型与海外类型的小程序暂不支持使用。

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

## Type

```tsx
ComponentType<WebViewProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
 {label: 'Vue', value: 'Vue'}
 ]}>
<TabItem value="React">

```tsx
class App extends Component {
  handleMessage () {}
  
  render () {
    return (
      <WebView src='https://mp.weixin.qq.com/' onMessage={this.handleMessage} />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <web-view src='https://mp.weixin.qq.com/' @message="handleMessage" />
</template>
```
  
</TabItem>
</Tabs>

## WebViewProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td>Yes</td>
      <td>wThe link from the webview to a webpage.可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。</td>
    </tr>
    <tr>
      <td>onMessage</td>
      <td><code>BaseEventOrigFunction&lt;onMessageEventDetail&gt;</code></td>
      <td>No</td>
      <td>Triggered when a webpage is loaded.e.detail = {`{ src }`}</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;onLoadEventDetail&gt;</code></td>
      <td>No</td>
      <td>Triggered when a webpage failed to be loaded.e.detail = {`{ src }`}</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td>No</td>
      <td>网页加载失败的时候触发此事件。e.detail = {`{ src }`}</td>
    </tr>
  </tbody>
</table>

### Property Support

|          API           | WeChat Mini-Program | H5 | React Native |
|:----------------------:|:-------------------:|:--:|:------------:|
|    WebViewProps.src    |         ✔️          | ✔️ |              |
| WebViewProps.onMessage |         ✔️          |    |              |
|  WebViewProps.onLoad   |         ✔️          | ✔️ |              |
|  WebViewProps.onError  |         ✔️          | ✔️ |              |

### onMessageEventDetail

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
      <td>data</td>
      <td><code>any[]</code></td>
      <td>The message data is an array of multiple postMessage parameters.</td>
    </tr>
  </tbody>
</table>

### onLoadEventDetail

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
      <td>src</td>
      <td><code>string</code></td>
      <td>Web Link Address</td>
    </tr>
  </tbody>
</table>

### onErrorEventDetail

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
      <td>src</td>
      <td><code>string</code></td>
      <td>Web Link Address</td>
    </tr>
  </tbody>
</table>

## API Support

|   API   | WeChat Mini-Program | H5 | React Native |
|:-------:|:-------------------:|:--:|:------------:|
| WebView |         ✔️          | ✔️ |      ✔️      |
