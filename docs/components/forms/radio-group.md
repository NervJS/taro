---
title: RadioGroup
sidebar_label: RadioGroup
---

单项选择器，内部由多个 Radio 组成。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/radio-group.html)

## 类型

```tsx
ComponentType<RadioGroupProps>
```

## RadioGroupProps

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| onChange | `CommonEventFunction` | 否 | RadioGroup 中选中项发生改变时触发 change 事件，detail = {value:[选中的radio的value的数组]} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioGroupProps.onChange | ✔️ | ✔️ |  |

### onChangeEventDetail

| 参数 | 类型 |
| --- | --- |
| value | `string[]` |
