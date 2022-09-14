## Demo - 在原生小程序项目中使用 Taro 生成的页面

本示例展示了如何在原生小程序的主包和分包中使用 Taro 生成的页面。

[详细文档](https://taro-docs.jd.com/taro/docs/taro-in-miniapp)

### 开发环境

推荐在 Taro 项目中进行开发调试，在生产环境下再在原生小程序中进行预览。

#### 1. 编译运行

```bash
$ npm run dev
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-basic/taro-project`。

### 生产环境

#### 编译运行

```bash
$ npm run build
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-basic/miniapp`。

### 介绍

本示例包括了以下特性：

#### 原生项目在主包使用 Taro 页面

- Taro 页面使用原生项目里暴露的方法
- Taro 页面使用原生项目里的原生自定义组件

#### 原生项目在分包使用 Taro 页面

- 分包依赖细分
