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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| unitId | `string` | 是 | 广告单元id，可在[小程序管理后台](https://mp.weixin.qq.com/)的流量主模块新建 |
| adIntervals | `number` | 否 | 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新） |
| onLoad | `BaseEventOrigFunction<any>` | 否 | 广告加载成功的回调 |
| onError | `BaseEventOrigFunction<onErrorEventDetail>` | 否 | 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象event.detail = {errCode: 1002} |
| onClose | `BaseEventOrigFunction<any>` | 否 | 广告关闭的回调 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AdProps.unitId | ✔️ |  |  |
| AdProps.adIntervals | ✔️ |  |  |
| AdProps.onLoad | ✔️ |  |  |
| AdProps.onError | ✔️ |  |  |
| AdProps.onClose | ✔️ |  |  |

### onErrorEventDetail

| 参数 | 类型 |
| --- | --- |
| errCode | 1000 or 1001 or 1002 or 1003 or 1004 or 1005 or 1006 or 1007 or 1008 |

### AdErrCode

广告错误码

错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。

| 参数 | 异常情况 | 理由 | 解决方案 |
| --- | :---: | :---: | :---: |
| 1000 | `后端错误调用失败` | `该项错误不是开发者的异常情况` | `一般情况下忽略一段时间即可恢复。` |
| 1001 | `参数错误` | `使用方法错误` | `可以前往 developers.weixin.qq.com 确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。` |
| 1002 | `广告单元无效` | `可能是拼写错误、或者误用了其他APP的广告ID` | `请重新前往 mp.weixin.qq.com 确认广告位ID。` |
| 1003 | `内部错误` | `该项错误不是开发者的异常情况` | `一般情况下忽略一段时间即可恢复。` |
| 1004 | `无合适的广告` | `广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告` | `属于正常情况，且开发者需要针对这种情况做形态上的兼容。` |
| 1005 | `广告组件审核中` | `你的广告正在被审核，无法展现广告` | `请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。` |
| 1006 | `广告组件被驳回` | `你的广告审核失败，无法展现广告` | `请前往 mp.weixin.qq.com 确认审核状态，且开发者需要针对这种情况做形态上的兼容。` |
| 1007 | `广告组件被封禁` | `你的广告能力已经被封禁，封禁期间无法展现广告` | `请前往 mp.weixin.qq.com 确认小程序广告封禁状态。` |
| 1008 | `广告单元已关闭` | `该广告位的广告能力已经被关闭` | `请前往 mp.weixin.qq.com 重新打开对应广告位的展现。` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Ad | ✔️ |  |  |
