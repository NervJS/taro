# Taro Components for React Native

Alo, alo! Bilibilibilibibili~

<details>
  <summary>关于 Icon 的使用</summary>

  > <del>IOS: 如果你要用到 `Icon`，请先把 `libART.a` 引进去，步骤如下：</del>
  
  > <del>`open ios/AwesomeProject.xcodeproj` 在xcode中打开项目，拖拽 `node_modules/react-native/Libraries/ART/ART.xcodeproj` 到左侧栏的 `Libraries` 下；选中项目左侧栏中的根节点，然后在 `Build Phases` 中 `Link Binary with Libraries` 添加 `libART.a`</del>

  > 为了尽可能地减少用户需要的操作，斟酌再三，目前方案改成：IOS使用图片来实现 Icon。
</details>

## Example

[组件演示（视频480p）](http://storage.jd.com/temporary/%E7%BB%84%E4%BB%B6%E6%BC%94%E7%A4%BA480p.mov)

> 由于在开发环境中用到 `create-react-native-app` 的模式，所以**务必**以 `dependencies` 的方式安装 `react-native` 和 `expo`，查看例子期间，务必保证它们待在 `dependencies` 下哦。
> 
> 设置 package.json 中的 `main` 为 `./node_modules/react-native-scripts/build/bin/crna-entry.js`

- [Expo版本清单](https://expo.io/--/api/v2/versions)，这里可以看到每个版本Expo对应的版本关系，**这很重要**

```bash
npm start

npm run ios

emulator @YOUR_AVD_NAME
npm run android
```

可能遇到的问题：

- IOS：在启动模拟器时挂起时，请先下载 `Expo版本清单` 中的 `iosUrl`，把下载解压后的文件夹添加 `.app` 后缀放进 `~/.expo/ios-simulator-app-cache`。
- IOS：遇到 `Error: Process exited with non-zero code: 60` 时，擦除内容和设置再重新运行。
- IOS：遇到 `React Native Version Mismatch` 时，说明 ReactNative 的版本跟 expoSDK 的版本不匹配，装一个匹配的版本就好了。
- Android：遇到 `Error running adb: No Android device found.` 时，请先下载 `Expo版本清单` 中的 `androidUrl` 放到 `~/.expo/android-apk-cache` 下。

最后，当然你觉得麻烦的话：：

你完全可以用 `react-native-cli` 初始化一个项目，然后把 `src` 目录整个复制到这个项目下来引用查看例子。

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
  - [x] form | PS(without RESET)
  - [x] input | PS
  - [x] label | PS(without FOR)
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

## 开发者日志

- 2018-06-14：`sdkmanager "system-images;android-28;default;x86_64" --proxy_host=mirrors.zzu.edu.cn --proxy_port=80 --proxy=http --no_https` 即将开始安卓的测试。
- 2018-06-13：换了新 MAC，测试用的 react-native-app 创建的 AwesomeProject 竟然跑不起来，这段时间应该有更新了，折腾半天，发现 package.json 有个 eject 命令，而且相比在原来的文件少了 ios 和 android 等目录，取而代之的是一个 .expo 文件夹，果然执行 eject 命令后，就可以正常跑起来了。
- 2018-04: [flow type annotation for children react elements](https://stackoverflow.com/a/42887802)
