---
title: KeyboardAccessory
sidebar_label: KeyboardAccessory
---

设置 input / textarea 聚焦时键盘上方 cover-view / cover-image 工具栏视图

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/keyboard-accessory.html)

## 类型

```tsx
ComponentType<KeyboardAccessoryProps>
```

## 示例代码

```tsx
class App extends Component {
  render () {
    return (
        <Textarea holdKeyboard="{{true}}">
          <KeyboardAccessory className="container" style={{ height: 50 }} >
            <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'green' }}>1</CoverView>
            <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'red' }}>2</CoverView>
          </KeyboardAccessory>
        </Textarea>
    )
  }
}
```

## KeyboardAccessoryProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| id | `string` | 否 | 组件的唯一标示, 保持整个页面唯一 |
| className | `string` | 否 | 同 `class`，在 React/Nerv 里一般使用 `className` 作为 `class` 的代称 |
| style | `any` | 否 | 组件的内联样式, 可以动态设置的内联样式 |
| key | string or number | 否 | 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，<br />需要使用 `wx:key` 来指定列表中项目的唯一的标识符。 |
| hidden | `boolean` | 否 | 组件是否显示, 所有组件默认显示 |
| animation | `{ actions: TaroGeneral.IAnyObject[]; }` | 否 | 动画属性 |
| ref | `LegacyRef<T>` | 否 | 引用 |
| dangerouslySetInnerHTML | `{ __html: string; }` | 否 | 渲染 HTML<br />[参考地址](https://taro-docs.jd.com/taro/docs/html) |
