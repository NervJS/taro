---
title: Ad
sidebar_label: Ad
---

Banner 广告

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/ad.html)

## 类型

```tsx
ComponentType<AdProps>
```

## 示例代码

```tsx
class App extends Component {
  render () {
    return (
      <Ad
        unit-id=''
        ad-intervals={60}
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    )
  }
}
```

## AdProps

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
      <td>unitId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>广告单元id，可在<a href="https://mp.weixin.qq.com/">小程序管理后台</a>的流量主模块新建</td>
    </tr>
    <tr>
      <td>adIntervals</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新）</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>广告加载成功的回调</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象event.detail = {errCode: 1002}</td>
    </tr>
    <tr>
      <td>onClose</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>广告关闭的回调</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AdProps.unitId | ✔️ |  |  |
| AdProps.adIntervals | ✔️ |  |  |
| AdProps.onLoad | ✔️ |  |  |
| AdProps.onError | ✔️ |  |  |
| AdProps.onClose | ✔️ |  |  |

### onErrorEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errCode</td>
      <td><code>1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008</code></td>
    </tr>
  </tbody>
</table>

### AdErrCode

广告错误码

错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th style="text-align:center">异常情况</th>
      <th style="text-align:center">理由</th>
      <th style="text-align:center">解决方案</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1000</td>
      <td style="text-align:center"><code>后端错误调用失败</code></td>
      <td style="text-align:center"><code>该项错误不是开发者的异常情况</code></td>
      <td style="text-align:center"><code>一般情况下忽略一段时间即可恢复。</code></td>
    </tr>
    <tr>
      <td>1001</td>
      <td style="text-align:center"><code>参数错误</code></td>
      <td style="text-align:center"><code>使用方法错误</code></td>
      <td style="text-align:center"><code>可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。</code></td>
    </tr>
    <tr>
      <td>1002</td>
      <td style="text-align:center"><code>广告单元无效</code></td>
      <td style="text-align:center"><code>可能是拼写错误、或者误用了其他APP的广告ID</code></td>
      <td style="text-align:center"><code>请重新前往 mp.weixin.qq.com 确认广告位ID。</code></td>
    </tr>
    <tr>
      <td>1003</td>
      <td style="text-align:center"><code>内部错误</code></td>
      <td style="text-align:center"><code>该项错误不是开发者的异常情况</code></td>
      <td style="text-align:center"><code>一般情况下忽略一段时间即可恢复。</code></td>
    </tr>
    <tr>
      <td>1004</td>
      <td style="text-align:center"><code>无合适的广告</code></td>
      <td style="text-align:center"><code>广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告</code></td>
      <td style="text-align:center"><code>属于正常情况，且开发者需要针对这种情况做形态上的兼容。</code></td>
    </tr>
    <tr>
      <td>1005</td>
      <td style="text-align:center"><code>广告组件审核中</code></td>
      <td style="text-align:center"><code>你的广告正在被审核，无法展现广告</code></td>
      <td style="text-align:center"><code>请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。</code></td>
    </tr>
    <tr>
      <td>1006</td>
      <td style="text-align:center"><code>广告组件被驳回</code></td>
      <td style="text-align:center"><code>你的广告审核失败，无法展现广告</code></td>
      <td style="text-align:center"><code>请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。</code></td>
    </tr>
    <tr>
      <td>1007</td>
      <td style="text-align:center"><code>广告组件被封禁</code></td>
      <td style="text-align:center"><code>你的广告能力已经被封禁，封禁期间无法展现广告</code></td>
      <td style="text-align:center"><code>请前往 mp.weixin.qq.com 确认小程序广告封禁状态。</code></td>
    </tr>
    <tr>
      <td>1008</td>
      <td style="text-align:center"><code>广告单元已关闭</code></td>
      <td style="text-align:center"><code>该广告位的广告能力已经被关闭</code></td>
      <td style="text-align:center"><code>请前往 mp.weixin.qq.com 重新打开对应广告位的展现。</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Ad | ✔️ |  |  |
