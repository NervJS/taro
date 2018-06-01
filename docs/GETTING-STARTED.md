# 快速开始

## 安装

安装 Taro 开发工具 `@tarojs/cli`

使用 npm或者yarn 全局安装

```bash
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```

## 使用

使用命令创建模板项目

```bash
$ taro init myApp
```

进入项目目录开始开发，可以选择小程序预览模式，或者h5预览模式，若使用微信小程序预览模式，则需要自行下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，选择预览项目根目录下 `dist` 目录。

```bash
# 微信小程序编译预览模式
$ taro build --type weapp --watch

# H5编译预览模式
$ taro build --type h5 --watch
```
