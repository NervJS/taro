# 快速开始

## 安装

安装 Taro 开发工具 `@tarojs/cli`

使用 npm 或者 yarn 全局安装，或者直接使用[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

```bash
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```

## 使用

使用命令创建模板项目

```bash
$ taro init myApp
```

npm 5.2+ 也可在不全局安装的情况下使用 npx 创建模板项目

```bash
$ npx @tarojs/cli init myApp
```

进入项目目录开始开发，可以选择小程序预览模式，或者h5预览模式，若使用微信小程序预览模式，则需要自行下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，选择预览项目根目录。

微信小程序编译预览模式

```bash
# npm script
$ npm run dev:weapp
# 仅限全局安装
$ taro build --type weapp --watch
# npx用户也可以使用
$ npx taro build --type weapp --watch
```

H5 编译预览模式
```bash
# npm script
$ npm run dev:h5
# 仅限全局安装
$ taro build --type h5 --watch
# npx用户也可以使用
$ npx taro build --type h5 --watch
```

RN 编译预览模式
```bash
# npm script
$ npm run dev:rn
# 仅限全局安装
$ taro build --type rn --watch
# npx用户也可以使用
$ npx taro build --type rn --watch
```

## 更新

Taro 提供了更新命令来更新 CLI 工具自身和项目中 Taro 相关的依赖

更新 Taro CLI 工具

```bash
# taro
$ taro update self
# npm 
npm i -g @tarojs/cli@latest 
# yarn 
yarn global add @tarojs/cli@latest 
```

更新项目中 Taro 相关的依赖

```bash
$ taro update project
```
