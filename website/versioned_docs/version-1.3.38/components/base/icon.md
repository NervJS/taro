---
title: Icon
sidebar_label: Icon
id: version-1.3.38-icon
original_id: icon
---

图标。组件属性的长度单位默认为 px

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/icon.html)

## 类型

```tsx
ComponentType<IconProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Icon size='60' type='success' />
        <Icon size='60' type='info' />
        <Icon size='60' type='warn' color='#ccc' />
        <Icon size='60' type='warn' />
        <Icon size='60' type='waiting' />
        <Icon size='20' type='success_no_circle' />
        <Icon size='20' type='warn' />
        <Icon size='20' type='success' />
        <Icon size='20' type='download' />
        <Icon size='20' type='clear' color='red' />
        <Icon size='20' type='search' />
      </View>
    )
  }
}
```

## IconProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| type | "success" or "success_no_circle" or "info" or "warn" or "waiting" or "cancel" or "download" or "search" or "clear" |  | 是 | icon 的类型 |
| size | `string` | `23` | 否 | icon 的大小，单位px |
| color | `string` |  | 否 | icon 的颜色，同 css 的 color |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IconProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.size | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### TIconType

icon 的类型

| 参数 | 说明 |
| --- | --- |
| success | 成功图标 |
| success_no_circle | 成功图标（不带外圈） |
| info | 信息图标 |
| warn | 警告图标 |
| waiting | 等待图标 |
| cancel | 取消图标 |
| download | 下载图标 |
| search | 搜索图标 |
| clear | 清楚图标 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Icon | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
