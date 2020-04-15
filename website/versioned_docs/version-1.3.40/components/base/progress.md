---
title: Progress
sidebar_label: Progress
id: version-1.3.40-progress
original_id: progress
---

进度条。组件属性的长度单位默认为 px

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/progress.html)

## 类型

```tsx
ComponentType<ProgressProps>
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
        <Progress percent={20} showInfo strokeWidth={2} />
        <Progress percent={40} strokeWidth={2} active />
        <Progress percent={60}  strokeWidth={2} active />
        <Progress percent={80}  strokeWidth={2} active activeColor='blue' />
      </View>
    )
  }
}
```

## ProgressProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| percent | `number` |  | 否 | 百分比 0~100 |
| showInfo | `boolean` | `false` | 否 | 在进度条右侧显示百分比 |
| borderRadius | string or number | `0` | 否 | 圆角大小 |
| fontSize | string or number | `16` | 否 | 右侧百分比字体大小 |
| strokeWidth | string or number | `6` | 否 | 进度条线的宽度 |
| color | `string` | `"#09BB07"` | 否 | 进度条颜色 (请使用 activeColor) |
| activeColor | `string` | `"#09BB07"` | 否 | 已选择的进度条的颜色 |
| backgroundColor | `string` | `"#EBEBEB"` | 否 | 未选择的进度条的颜色 |
| active | `boolean` | `false` | 否 | 进度条从左往右的动画 |
| activeMode | "backwards" or "forwards" | `backwards` | 否 | backwards: 动画从头播<br /><br />forwards: 动画从上次结束点接着播 |
| duration | `number` | `30` | 否 | 进度增加 1% 所需毫秒数 |
| onActiveEnd | `BaseEventOrigFunction<any>` |  | 否 | 动画完成事件 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ProgressProps.percent | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.showInfo | ✔️ | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ProgressProps.borderRadius | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.fontSize | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.strokeWidth | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| ProgressProps.activeColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.backgroundColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.active | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.activeMode | ✔️ | ✔️ |  | ✔️ | ✔️ | ✔️ |
| ProgressProps.duration | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.onActiveEnd | ✔️ |  |  |  | ✔️ |  |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Progress | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
