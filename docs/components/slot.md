---
title: Slot
sidebar_label: Slot
---

slot 插槽

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="QQ 小程序" src={require('@site/static/img/platform/qq.png').default} className="icon_platform" width="25px"/> <img title="京东小程序" src={require('@site/static/img/platform/jd.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

## 类型

```tsx
ComponentType<SlotProps>
```

## 示例代码

```tsx
import { Slot, View, Text } from '@tarojs/components'

export default class SlotView extends Component {
  render () {
    return (
      <View>
        <custom-component>
          <Slot name='title'>
           <Text>Hello, world!</Text>
          </Slot>
        </custom-component>
      </View>
    )
  }
}
```

## SlotProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| name | `string` | `none` | 否 | 指定插入的 slot 位置 |
| varName | `string` | `none` | 否 | scoped slot 传入数据源 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | 京东小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SlotProps.name | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| SlotProps.varName |  | ✔️ |  |  |  |  |  |  |
