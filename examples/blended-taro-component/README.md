## Demo - 把 Taro 项目编译为原生自定义组件

[详细文档](https://docs.taro.zone/docs/taro-in-miniapp#%E6%8A%8A-taro-%E7%BB%84%E4%BB%B6%E7%BC%96%E8%AF%91%E4%B8%BA%E5%8E%9F%E7%94%9F%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6)

### 开发环境

推荐在 Taro 项目中进行开发调试，在生产环境下再在原生小程序中进行预览。

#### 1. 编译运行

```bash
$ npm run dev
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-taro-component/taro-project`。

### 生产环境

#### 编译运行

```bash
$ npm run build
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-taro-component/miniapp`。

### 测试编译原生组件在 H5 中的应用
#### 1. 编译原生组件

```bash
$ cd taro-project
$ npm run build:h5
```

#### 2. 编译 H5 项目

```bash
$ cd h5
$ yarn dev:h5
```

#### 3. 编译 H5-HTML 项目
```bash
$ yarn global add http-server
$ cd h5-html
$ http-server -c-1
```

### 介绍

本示例包括了以下特性：

- 基本使用方法
- 给组件传递 props
- 为组件添加自定义组件的配置，如：`virtualHost`

并分别展示了在 H5 import、H5 全局引用以及微信小程序上使用编译后组件的具体例子
