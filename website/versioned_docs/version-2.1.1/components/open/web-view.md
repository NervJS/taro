---
title: WebView
sidebar_label: WebView
id: version-2.1.1-web-view
original_id: web-view
---

web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)

## 类型

```tsx
ComponentType<WebViewProps>
```

## 示例代码

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

## WebViewProps

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
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。</td>
    </tr>
    <tr>
      <td>onMessage</td>
      <td><code>BaseEventOrigFunction&lt;onMessageEventDetail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;onLoadEventDetail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>网页加载成功时候触发此事件。e.detail = { src }</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>网页加载失败的时候触发此事件。e.detail = { src }</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WebViewProps.src | ✔️ |  |  |
| WebViewProps.onMessage | ✔️ |  |  |
| WebViewProps.onLoad | ✔️ |  |  |
| WebViewProps.onError | ✔️ |  |  |

### onMessageEventDetail

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
      <td>data</td>
      <td><code>any[]</code></td>
      <td>消息数据，是多次 postMessage 的参数组成的数组</td>
    </tr>
  </tbody>
</table>

### onLoadEventDetail

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
      <td>src</td>
      <td><code>string</code></td>
      <td>网页链接</td>
    </tr>
  </tbody>
</table>

### onErrorEventDetail

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
      <td>src</td>
      <td><code>string</code></td>
      <td>网页链接</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WebView | ✔️ |  | ✔️ |
