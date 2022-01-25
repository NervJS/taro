---
title: KeyboardAccessory
sidebar_label: KeyboardAccessory
---

设置 input / textarea 聚焦时键盘上方 cover-view / cover-image 工具栏视图

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/keyboard-accessory.html)

## 类型

```tsx
ComponentType<StandardProps>
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
