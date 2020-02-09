---
title: Taro.getCurrentPages()
sidebar_label: getCurrentPages
id: version-1.3.37-getCurrentPages
original_id: getCurrentPages
---

获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
__注意：__
- __不要尝试修改页面栈，会导致路由以及页面状态错误。__
- 不要在 `App.onLaunch` 的时候调用 `getCurrentPages()`，此时 `page` 还没有生成。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html)

## 类型

```tsx
() => Page[]
```

## 参数

## 示例代码

```tsx
Taro.getCurrentPages().length
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getCurrentPages | ✔️ | ✔️ |  |
