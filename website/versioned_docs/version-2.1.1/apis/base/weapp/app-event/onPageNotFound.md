---
title: Taro.onPageNotFound(callback)
sidebar_label: onPageNotFound
id: version-2.1.1-onPageNotFound
original_id: onPageNotFound
---

监听小程序要打开的页面不存在事件。该事件与 [`App.onPageNotFound`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onpagenotfoundobject-object) 的回调时机一致。

**注意**
- 开发者可以在回调中进行页面重定向，但必须在回调中**同步**处理，异步处理（例如 `setTimeout` 异步执行）无效。
- 若开发者没有调用 [Taro.onPageNotFound](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html) 绑定监听，也没有声明 `App.onPageNotFound`，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面。
- 如果回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再第二次回调。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Result

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
      <td>isEntryPage</td>
      <td><code>boolean</code></td>
      <td>是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）</td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>不存在页面的路径</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>打开不存在页面的 query 参数</td>
    </tr>
  </tbody>
</table>

### Callback

小程序要打开的页面不存在事件的回调函数

```tsx
(res: Result) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>Result</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onPageNotFound | ✔️ |  |  |
