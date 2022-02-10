---
title: Taro.getCurrentPages()
sidebar_label: getCurrentPages
---

获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
__注意：__
- __不要尝试修改页面栈，会导致路由以及页面状态错误。__
- 不要在 `App.onLaunch` 的时候调用 `getCurrentPages()`，此时 `page` 还没有生成。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html)

## 类型

```tsx
() => Page[]
```

## 示例代码

```tsx
Taro.getCurrentPages().length
```
