---
title: 项目组织
---

### 文件组织形式

> 以下文件组织规范为最佳实践的建议

所有项目源代码请放在项目根目录 `src` 目录下，项目所需最基本的文件包括 **入口文件** 以及 **页面文件**

* 入口文件为 `app.js`
* 页面文件建议放置在 `src/pages` 目录下

一个可靠的 Taro 项目可以按照如下方式进行组织

    ├── config                 配置目录
    |   ├── dev.js             开发时配置
    |   ├── index.js           默认配置
    |   └── prod.js            打包时配置
    ├── src                    源码目录
    |   ├── components         公共组件目录
    |   ├── pages              页面文件目录
    |   |   ├── index          index 页面目录
    |   |   |   ├── banner     页面 index 私有组件
    |   |   |   ├── index.js   index 页面逻辑
    |   |   |   └── index.css  index 页面样式
    |   ├── utils              公共方法库
    |   ├── app.css            项目总通用样式
    |   └── app.js             项目入口文件
    └── package.json

### 文件命名

Taro 中普通 JS/TS 文件以小写字母命名，多个单词以下划线连接，例如 `util.js`、`util_helper.js`

Taro 组件文件命名遵循 Pascal 命名法，例如 `ReservationCard.jsx`

### 文件后缀

Taro 中普通 JS/TS 文件以 `.js` 或者 `.ts` 作为文件后缀

Taro 组件则以 `.jsx` 或者 `.tsx`  作为文件后缀，当然这不是强制约束，只是作为一个实践的建议，组件文件依然可以以 `.js` 或者 `.ts` 作为文件后缀
