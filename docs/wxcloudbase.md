---
title: 小程序云开发模板
---

> 自 `v1.2.20` 开始支持此功能，仅支持微信小程序

[云开发（CloudBase）](https://www.cloudbase.net?ADTAG=taro)是基于Serverless架构构建的一站式后端云服务，涵盖函数、数据库、存储、CDN等服务，免后端运维，支持小程序、Web和APP开发。
其中，小程序·云开发是微信和腾讯云联合推出的云端一体化解决方案，基于云开发可以免鉴权调用微信所有开放能力，在微信开发者工具中即可开通使用。

## 使用小程序云开发项目模板

在 1.2.20 版本中，新增了小程序云开发项目模板。如需使用，请将 CLI 更新至 `1.2.20` 以上版本。[更新](./GETTING-STARTED.md#更新)

## 模板目录结构

```
├── client                                  小程序端目录
│   ├── config                              配置目录
│   │   ├── dev.js                          开发时配置
│   │   ├── index.js                        默认配置
│   │   └── prod.js                         打包时配置
│   ├── dist                                编译结果目录
│   ├── package.json
│   ├── src                                 源码目录
│   │   ├── app.scss                        项目总通用样式
│   │   ├── app.js                          项目入口文件
│   │   ├── components                      组件文件目录
│   │   │   └── login                       login 组件目录
│   │   │       └── index.weapp.js          login 组件逻辑
│   │   └── pages                           页面文件目录
│   │       └── index                       index 页面目录
│   │           ├── index.scss              index 页面逻辑
│   │           └── index.js                index 页面样式
├── cloud                                   服务端目录
│   └── functions                           云函数目录
│       └── login                           login 云函数
│           ├── index.js                    login 函数逻辑
│           └── package.json
└── project.config.json                     小程序项目配置
```

### 使用要点

1. 开发时，进入 client 目录，在此目录下运行相关编译预览或打包命令
2. 使用微信开发者工具调试项目，请将项目 **整个文件夹** 作为运行目录。 注意： 不是 client 中生成的 dist 文件夹

