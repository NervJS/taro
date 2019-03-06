---
title: Taro 代码与小程序代码混写
---

Taro 项目 支持 Taro 的代码与小程序（微信/百度/支付宝/字节跳动）原生的页面、组件代码混合存在，只需要将原生的页面、组件代码放入 `src` 目录下，随后在 入口文件 `app.js` 中定义好 `pages` 配置指向对应的原生的页面即可，在原生页面的配置中，你可以通过 `usingComponents` 来定义需要引入的组件，这里可以指定 Taro 组件同时也可以指定小程序原生的组件。

`usingComponents` 指定的小程序原生组件名字需要以**小写**开头。

> 请参考示例项目：https://github.com/NervJS/taro-sample-weapp
