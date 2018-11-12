---
title: 特殊问题的处理
---

- [Issue #46](https://github.com/NervJS/taro/issues/46)，`redux-saga` 的引入问题处理

- 在 H5 模式下，tabBar 可能会挡住页面 fixed 元素问题：这是因为与小程序的 tabBar 不同，在 H5 下 tabBar 是一个普通的组件，当页面中存在`fixed(bottom)`定位的元素时，其表现会与小程序中不一致。Taro 提供了一个适配的方法：

例如：

```css
.fixed {
  bottom: 0;
  /* 在 H5 模式下将会编译成 margin-bottom: 50px，在小程序模式下则会忽略*/
  margin-bottom: taro-tabbar-height;
}
```
