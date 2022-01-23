---
title: AdCustom
sidebar_label: AdCustom
---

Banner 广告

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/ad.html)

## 类型

```tsx
ComponentType<AdCustomProps>
```

## 示例代码

```tsx
class App extends Component {
  render () {
    return (
      <AdCustom
        unitId=''
        adIntervals={60}
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    )
  }
}
```

## AdCustomProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| unitId | `string` | 是 | 广告单元id，可在[小程序管理后台](https://mp.weixin.qq.com/)的流量主模块新建 |
| adIntervals | `number` | 否 | 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新） |
| onLoad | `CommonEventFunction<any>` | 否 | 广告加载成功的回调 |
| onError | `CommonEventFunction<onErrorEventDetail>` | 否 | 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因，事件对象event.detail = {errCode: 1002} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AdCustomProps.unitId | ✔️ |  |  |
| AdCustomProps.adIntervals | ✔️ |  |  |
| AdCustomProps.onLoad | ✔️ |  |  |
| AdCustomProps.onError | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AdCustom | ✔️ |  |  |
