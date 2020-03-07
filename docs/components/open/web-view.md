---
title: WebView
sidebar_label: WebView
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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| src | `string` | 是 | webview 指向网页的链接。可打开关联的公众号的文章，其它网页需登录小程序管理后台配置业务域名。 |
| onMessage | `BaseEventOrigFunction<onMessageEventDetail>` | 否 | 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data } |
| onLoad | `BaseEventOrigFunction<onLoadEventDetail>` | 否 | 网页加载成功时候触发此事件。e.detail = { src } |
| onError | `BaseEventOrigFunction<onErrorEventDetail>` | 否 | 网页加载失败的时候触发此事件。e.detail = { src } |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WebViewProps.src | ✔️ |  |  |
| WebViewProps.onMessage | ✔️ |  |  |
| WebViewProps.onLoad | ✔️ |  |  |
| WebViewProps.onError | ✔️ |  |  |

### onMessageEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| data | `any[]` | 消息数据，是多次 postMessage 的参数组成的数组 |

### onLoadEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| src | `string` | 网页链接 |

### onErrorEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| src | `string` | 网页链接 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WebView | ✔️ |  | ✔️ |
