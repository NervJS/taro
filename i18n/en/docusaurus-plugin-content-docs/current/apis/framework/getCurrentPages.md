---
title: Taro.getCurrentPages()
sidebar_label: getCurrentPages
---

Gets the current page stack. In the array, the first element is the homepage and the last element is the current page.

__Note:__
- __Do not modify the page stack as this will lead to routing and page status errors.__
- Do not call `getCurrentPages()` when `App.onLaunch` is called since `page` is not generated.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/getCurrentPages.html)

## Type

```tsx
() => Page[]
```

## Parameters

## Sample Code

```tsx
Taro.getCurrentPages().length
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getCurrentPages | ✔️ | ✔️ | ✔️ |
