---
title: Taro.getPerformance()
sidebar_label: getPerformance
---

小程序测速上报。使用前，需要在小程序管理后台配置。 详情参见[小程序测速](https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/index.html)指南。

**注意**
- 目前，当开启代码 [按需注入](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/lazyload.html) `时，evaluateScript` 将仅包含公有部分代码，页面和组件的代码注入的时间会包含在 `firstRender` 中（因为页面和组件的代码注入过程成为了首次渲染过程的一部分）。因此开启按需注入后，脚本耗时降低，渲染时间提高属于正常现象，优化效果可以关注整体启动耗时（`appLaunch`）来评估。
- `firstPaint` 和 `firstContentfulPaint` 指标在开启 `vconsole` 的情况下，由于绘制 `vconsoel` 的面板，会导致数据提前。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.getPerformance.html)

## 类型

```tsx
() => Performance
```

## 示例代码

```tsx
const performance = Taro.getPerformance()
const observer = performance.createObserver((entryList) => {
  console.log(entryList.getEntries())
})
observer.observe({ entryTypes: ['render', 'script', 'navigation'] })
```
