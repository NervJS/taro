---
title: 特殊问题的处理
---

- [Issue #46](https://github.com/NervJS/taro/issues/46)，`redux-saga` 的引入问题处理

- 在H5模式下，tabBar可能会挡住页面fixed元素问题：这是因为与小程序的taBbar不同，在H5下tabBar是一个普通的组件，当页面中存在`fixed(bottom)`定位的元素时，其表现会与小程序中不一致。Taro提供了一个适配的方法：

例如：
```css
  .fixed {
    bottom: 0;
    /* 在H5模式下将会编译成 margin-bottom: 50px，在小程序模式下则会忽略*/
    margin-bottom: taro-tabbar-height;
  }
```
