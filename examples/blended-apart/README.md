## Demo - 把 Taro 项目作为原生项目中的一个分包单独使用

[详细文档](https://taro-docs.jd.com/taro/docs/taro-in-miniapp#%E6%8A%8A-taro-%E9%A1%B9%E7%9B%AE%E4%BD%9C%E4%B8%BA%E4%B8%80%E4%B8%AA%E5%AE%8C%E6%95%B4%E5%88%86%E5%8C%85)

### 开发环境

推荐在 Taro 项目中进行开发调试，在生产环境下再在原生小程序中进行预览。

#### 1. 编译运行

```bash
$ npm run dev
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-apart/taro-project`。

### 生产环境

#### 编译运行

```bash
$ npm run build
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `blended-apart/miniapp`。
