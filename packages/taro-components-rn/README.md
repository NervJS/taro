# Taro Components for React Native

Alo, alo! Bilibilibilibibili~

> IOS: 如果你要用到 `Icon`，请先把 `libART.a` 引进去，步骤如下：
> `open ios/AwesomeProject.xcodeproj` 在xcode中打开项目，拖拽 `node_modules/react-native/Libraries/ART/ART.xcodeproj` 到左侧栏的 `Libraries` 下；选中项目左侧栏中的根节点，然后在 `Build Phases` 中 `Link Binary with Libraries` 添加 `libART.a`

## Capture

![image](screenshots/capture.20180531.gif)

## Example

Please use official AwesomeProject.

```bash
# RNComponent dependencies
npm i react-native-swiper react-dom
# Move source to example directory
cp -rf src AwesomeProjectDir/src/tcr
# import components
# import { Icon } from './tcr'
```

## About code comments

- ✔ Support
- ✘ Not support
- \- Would not support

## Todo list

> FS = Fully Support
> PS = Partially Support
> MS = Minimum Support

- 视图容器
  - [x] view | MS
  - [x] scroll-view | PS
  - [x] swiper | PS
- 基础内容
  - [x] icon | FS
  - [x] text | PS
  - [x] rich-text | FS
  - [x] progress | FS
- 表单内容
  - [x] button | PS
  - [x] checkbox | FS
  - [ ] form
  - [x] input | PS
  - [ ] label
  - [x] picker | PS
  - [x] radio | FS
  - [x] slider | PS
  - [x] switch | FS
  - [x] textarea
- 导航
- 媒体组件
  - [ ] audio
  - [x] image | PS
  - [ ] video
  - [ ] camera
- 其他
  - [ ] tabbar

## pureDependencies

- react: ^16.2.0
- react-native: ^0.54.3

## D~

[flow type annotation for children react elements](https://stackoverflow.com/a/42887802)
