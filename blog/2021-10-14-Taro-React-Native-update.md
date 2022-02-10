---
slug: 2021-10-14-Taro-React-Native-update
title: Taro React Native 重大更新：帮助开发者高效开发APP
authors: zhiqingchen
tags: [v3]
description: '三个方向去优化开发流程，全面降低上手成本，让 Taro 开发 APP，变得无比轻松。'
---

Taro React Native 重大更新来了，全方位降低上手成本，提升开发体验。全流程自动化，让开发者摆脱原生环境配置，专注前端开发。

## 背景

Taro 3.2.0 正式版本发布至今，已过去半年。在此期间，有不少社区开发者已经使用上 Taro 来开发 APP 了。看到社区的使用量越来越多，开发团队也是收获满满。

同时我们也收到了很多来自开发者的反馈，主要集中于开发环境配置复杂、组件和 API 的完善度不够及使用上的 BUG 等。对于组件和 API 的完善度及使用上的 BUG，我们都是尽可能地及时地处理并发布新版本。然而，对于开发者反馈的开发环境配置的问题，却很难复现及解决。

首先 Android + iOS + React Native + Taro，4个技术的各种环境配置，会让很多开发者望而却步。其次开发者面对的环境问题千奇百怪，很多问题难以通过远程协助解决。不少开发者在调研阶段，因为无法顺利运行，便放弃了使用。对于一个跨平台框架来说，主要目的是提效，而非给开发者带来更多困难。开发环境配置问题的解决，显得尤为重要。

这次我们从以下三个方向去优化整个开发流程，全面降低上手成本，让 Taro 开发 APP，变得无比轻松。

1. 为 Taro 提供 react-native 模板，项目的初始化，只需要几个命令。
2. 与 GitHub Actions 进行集成，不再需要本地安装原生开发环境，打包及发布交给 CI 去做。
3. 提供 Taro Playground APP，可以通过应用商店或者 GitHub 下载安装，进行项目调试。

## react-native 开发模板

目前使用 Taro 开发 React Native APP 时，我们需要一个原生壳工程，在另外一个仓库[1]。对于新手来说，通常会造成一些困惑：

1. 没有接触过 React Native 开发的开发者首先需要理解 React Native 的开发流程，然后完成两个仓库的初始化。
2. 两个仓库都需要安装依赖，并且需要保持某些依赖版本的一致性。当有依赖更新时，需要在两个仓库中进行操作，非常容易遗漏。
3. 项目依赖原生的运行环境。开发者经常遇到安装过程报错，无法运行的场景。一些依赖包的下载需要切换源或依赖特定网络环境。

这些问题对新手入门很不友好，为此我们提供了一个初始化模板[2]。初始化项目使用 `taro init [project]` 选择 react-native 模板。

初始化完成后，便可使用进入开发。以下为一些常用命令：

```shell
# 更新相关依赖。在初始化完成后或 Taro 版本更新后执行，用于同步 peerDependencies。
$ yarn upgradePeerdeps

# 打包 js bundle 及静态资源。在初始化完成后执行，用于打包默认使用的 bundle。
$ yarn build:rn --platform ios

# 启动 bundle server
$ yarn start

# 启动 iOS
$ yarn ios

# 启动安卓
$ yarn android
```

具体操作可以查看录屏：

<video controls width="600" src="https://wos2.58cdn.com.cn/DeFazYxWvDti/frsupload/6820cfd5e0346eac050e7c3f0df78f65.mp4"></video>

通过模板方式进行初始化的项目，有几个优势：

1. Taro 仓库与壳工程仓库进行整合，不再需要管理双仓库。当然习惯双仓库模式的开发者，仍然可以正常使用。
2. 当 Taro 进行升级时，可以通过执行 `yarn upgradePeerdeps`进行依赖同步。这里我们将 Taro 依赖的 React Native 相关库写入了 peerDependencies 中，然后通过 install-peerdeps 去完成依赖的同步。
3. 集成了 GitHub Actions，可通过 workflow 完成 APP 的打包。

## GitHub Actions

要解决开发环境的各种问题，通常的做法就是提供一个稳定的环境用于打包发布，在企业里是各种 CI/CD 平台。但对于开源项目来讲，就需要一个公开的平台，每个人都能使用，当然最好是免费的。于是我们想到了 GitHub Actions。

GitHub Actions 是 GitHub 提供的持续集成服务，于 2018 年 10 月推出。功能非常强大，并且免费（每月有限额），同时私有仓库也能够使用，非常契合我们的需求。

通过模板初始化的项目，可在 `.github/workflows` 目录中看到 4 个文件。分别为 iOS 和 Android 的 release 包和 debug 包的打包工作流。模板为了简化过程，设置为通过 `git push` 即可触发打包，可根据自身情况，配置合适自身业务场景的工作流。打包生成的产物可以在 Artifacts 中找到，也可以使用 `softprops/action-gh-release@v1` action，将产物发布到项目的 Release 中。

<img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://pic4.58cdn.com.cn/nowater/fangfe/n_v275b68e363e1d459ead128302fe0f8581.jpg" width="600px" />

这样一来新手便可以不需要关注原生环境以及 APP 打包的问题。开发时，可以安装 debug 包加载本地的 jsbundle，进行调试。发布时，交给 CI 进行打包，产物再提交到应用市场，整个过程完全不需要 AS 与 XCode。当然这里还有一些必要配置需要做，比如 APP 的签名等，将在后面的章节讲解。

GitHub Actions 功能非常强大，Taro 就用它来做打包发布等工作，可参考文档[3]或查看资料做进一步探索，做点有趣的事情。

## GitHub Actions 配置

在 Taro 项目模板里面我们提供了一个 CI 脚本模板，开发者仍然需要进行一些配置，才能够开始打包。下面是打包 Android APP 的基础配置说明，iOS 同理：

- 配置打包的环境变量

    ```yml
    env:
        APP_ID: com.taro.demo  # 应用 ID
        APP_NAME: Taro Demo  # 应用名称
        VERSION_NAME: 1.0.0 # 应用版本号
        VERSION_CODE: 10 # 用于应用市场、程序内部识别版本，判断新旧版本，一般递增处理
        KEYSTORE_FILE: debug.keystore # 签名文件
        KEYSTORE_PASSWORD: android # 密码
        KEYSTORE_KEY_ALIAS: androiddebugkey # 别名
        KEYSTORE_KEY_PASSWORD: android # 别名的密码
    ```
- 通过 github secrets 管理秘钥配置

    <img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://pic8.58cdn.com.cn/nowater/fangfe/n_v257e556d325fa4ee99a96e3a46a976f18.png" width="600px" />

    通常我们不应该把密钥等敏感信息直接写在配置文件中，而是置于加密信息中。在 GitHub Actions 中，可以使用加密机制进行处理[4]。如图，在 `setting` -> `secret` 配上 CI 需要的 secret。然后在 workflow 中通过相应变量进行使用，如 `${{secrets.DEBUG_KEYSTORE_PASSWORD}}`。

## 壳工程 GitHub Actions 方案

对于壳工程与项目工程分开的场景，利用 CI 命令将两个项目进行合并也可以实现打包自动化。具体流程如下：

1. 壳工程和业务项目合并

    因为 GitHub Actions 只能在当前项目下进行操作，所以需要将壳工程（taro-native-shell）合并到项目工程下。

2. 合并项目和壳工程的 package.json

    在有原生依赖的情况下，必须保证壳工程和业务项目的原生依赖版本一致，不然打包可能会报错。

3. 安装依赖

    在业务项目工程下安装合并后的 package.json 依赖。

4. 软链依赖

    将安装到业务项目下的依赖软链至壳工程项目 node_module 下。
    ```sh
    ln -s ./node_modules ./taro-native-shell/node_modules
    ```

5. 业务项目编译

    执行 `taro/cli build:rn` 编译命令，打包生成 jsbundle 与静态资源。

6. 将编译产物移动到原生壳工程
    
    ```js
    rn: {
      appName: 'taroDemo',
      output: {
        ios: './ios/main.jsbundle',
        iosAssetsDest: './ios',
        android: './android/app/src/main/assets/index.android.bundle',
        androidAssetsDest: './android/app/src/main/res',
        iosSourcemapOutput: './ios/main.map',
        androidSourcemapOutput: './android/app/src/main/assets/index.android.map',
      },
    }
    ```
    taro 编译 rn 输出静态资源，需要将资源移到原生项目中。

7. 编译原生 APP

    到 ios 和 android 目录里分别执行对应的打包命令。

8. 上传 APP
    
    将打包后的 APP 进行上传，提供下载链接。
    ```yml
    # iOS
    - name: Upload iOS Products
      uses: actions/upload-artifact@v2
      with:
        name: app-${{ env.BUILD_TYPE }}
        path: |
          ${{ github.workspace }}/ios/taroDemo.ipa
          ${{ github.workspace }}/ios/taroDemo.app.dSYM.zip
    ```
    ```yml
    # Android
    - name: Upload Android Products
      uses: actions/upload-artifact@v2
      with:
        name: app-${{ env.BUILD_TYPE }}
        path: ${{ github.workspace }}/android/app/build/outputs/apk/${{ env.BUILD_TYPE }}/app-${{ env.BUILD_TYPE }}.apk
    ```
    在 iOS 侧，release workflow 还集成了上传至 APP Store 命令：
    ```yml
    - name: Upload app to App Store Connect
      env:
        APP_STORE_CONNECT_USERNAME: ${{ env.APP_STORE_CONNECT_USERNAME }}
        APP_STORE_CONNECT_PASSWORD: ${{ env.APP_STORE_CONNECT_PASSWORD }}
      run: |
        cd ios
        xcrun altool --upload-app -t ios -f "taroDemo.ipa" -u "$APP_STORE_CONNECT_USERNAME" -p "$APP_STORE_CONNECT_PASSWORD"
    ```

上面整个流程对于开发者来说理解成本太高，配置过于繁琐，所以我们将前 6 个步骤封装成一个 GitHub action[5]，开发者只需要添加一些配置项就能完成上面的流程。

```yml
- name: taro-native-publish
  uses: shinken008/taro-native-publish@0.4.0
  with:
    REPO: ${{ env.SHELL_REPO }}
    REPO_REF: ${{ env.SHELL_REPO_REF }}
    REPO_PATH: taro-native-shell
    BUILD_CMD: yarn build:rn
    IOS_BUNDLE: ios/main.jsbundle
    IOS_ASSETS: ios
    ANDROID_BUNDLE: android/index.android.bundle
    ANDROID_ASSETS: android
    PLATFORM: android
```

对应的需要拉取的另一个仓库的配置：
```yml
env:
  # 壳工程
  SHELL_REPO: NervJS/taro-native-shell
  # 壳工程ref
  SHELL_REPO_REF: 0.63.2
  # 壳工程目录
  SHELL_REPO_PATH: taro-native-shell
```

配置介绍:
- REPO： 壳工程地址
- REPO_REF： 壳工程分支
- SHELL_REPO_PATH： 壳工程目录
- IOS_BUNDLE： 编译 iOS 后的 js bundle 地址
- IOS_ASSETS： 编译 iOS 后的其他静态文件（图片等）地址
- ANDROID_BUNDLE： 编译 Android 后的 js bundle 地址
- ANDROID_ASSETS： 编译 Android 后的其他静态文件（图片等）地址
- PLATFORM：编译的目标平台 ios/android

## 模板提供的 iOS 打包方案

iOS APP 的打包过程相对繁琐，这里我们直接使用了一个优秀的工具 fastlane[6]。fastlane 是一个为 iOS 和 Android 开发者提供的工具，可以自动执行繁琐的任务，如生成屏幕截图、处理配置文件和发布应用程序。

打包过程中的 info plist 文件修改、版本号修改、签名设置都可以交给 fastlane 去处理，经过 fastlane 的封装，开发者处理这些繁琐的任务，只需要添加几行配置即可。

但是要让 fastlane 在 GitHub Actions 使用，还需要几步操作。因为证书（Certificate）与描述文件（Provisioning Profiles）并不存储在项目仓库中，而每次工作流都是发生在随机的主机上的，这就需要我们在打包前，先将证书与描述文件导入到当前主机中。

Release 证书的导入过程如下：

1. 将证书的 `p12` 文件转成 `base64` 字符串。

    ```shell
    cat Certificates.p12 | base64 | pbcopy
    ```

2. 将第一步内容保存在项目的 `secret` 中，`key` 为 `RELEASE_SIGNING_CERTIFICATE_P12_DATA`
3. 将 `p12` 文件的密码保存在项目的 `secret` 中，`key` 为 `RELEASE_SIGNING_CERTIFICATE_PASSWORD`
4. 将 `secret` 内配置的相关信息导入到主机中。

    ```shell
    security import <(echo $SIGNING_CERTIFICATE_P12_DATA | base64 --decode) \
        -f pkcs12 \
        -k build.keychain \
        -P $SIGNING_CERTIFICATE_PASSWORD \
        -T /usr/bin/codesign
    ```

描述文件的导入过程，与证书的导入过程类似，均已封装在 workflow 中。

要将生成的 ipa 文件上传至 testflight 或者 APP Store 上，还需要提供用户名（APP_STORE_CONNECT_USERNAME）与密码（APP_STORE_CONNECT_PASSWORD），可参考文档进行生成[7]。

至于证书与描述文件的生成，可查阅 iOS 开发相关文章[8]，这里不再赘述。fastlane 配置的更多细节可查看 `ios/fastlane/Fastfile` 文件。

## 模板提供的 Android 打包方案

Android 的打包过程相对简单，直接调用 `gradlew` 命令即可。除了配置 APP 的基础信息，还需要为应用进行签名。可参考 Android 应用签名相关文档[9]，生成签名文件，置于 `android/app` 目录中。

签名文件也可通过命令行工具生成：
```shell
keytool -genkey -alias android -keyalg RSA -validity 99999 -keystore release.keystore
```

打包相关参数，通过 `gradlew` 的 `-P, --project-prop` 参数进行传入，如 `./gradlew assembledebug -Papp_id=${{ env.APP_ID }}`，其默认值在 `android/gradle.properties` 文件中定义。

## Taro Playground APP

基于 GitHub Actions 与 Taro 模板，我们完成了项目初始化与打包过程的自动化。但对于想要体验 Taro 开发 APP 的开发者来说，仍然太过繁琐。为此，我们开发了 Taro Playground APP，并完全开源[10]。一方面可以展示组件和 API 的使用示例，另一方面提供了动态加载 jsbundle 的功能，便于开发人员进行本地代码的调试。

### 本地调试

开发者可以在 Taro Playground 仓库的 Releases 页面进行安装包下载[11]，也可扫描以下二维码安装 APP。

| Android | iOS |
| - | - |
| ![](https://pic3.58cdn.com.cn/nowater/fangfe/n_v295dd481b6b2f446592350e3187716d03.png) | ![](https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_d3137b5937U5d1XdWcU735Xd7b5a5a37.png) |

Taro 工程中通过 `yarn dev:rn --qr` 启动 bundler server，打印包含 IP 及端口信息的二维码。通过 Taro Playground APP 扫描该二维码，即可加载 jsbundle 进行调试，需要保证手机与电脑处于同一个局域网中。

具体操作可以查看录屏：

<video controls width="600" src="https://wos2.58cdn.com.cn/DeFazYxWvDti/frsupload/03e7ae6c0a8de6be1f665e23404aaa38.mp4"></video>

### 示列代码

Taro Playground 项目提供了较全面的示例代码，开发者可以参考，避免一些可能遇到的坑，如有问题，欢迎 pr。

<img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://pic4.58cdn.com.cn/nowater/fangfe/n_v28c80c04fd8124114b58268d187f50a21.png" width="300px" />
<img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://pic4.58cdn.com.cn/nowater/fangfe/n_v28658913ed1aa419da53a4c36da5dc526.png" width="300px" />

## 总结

通过上述多方面的优化，极大地降低了使用 Taro 开发 APP 的成本。大部分场景下，只需要掌握 Taro 和 React Native，再加上一些配置，即可完成 APP 的开发与发布。

使用过程中，如遇任何问题，可添加 "58技术小秘书" 或 "Taro 小助手" 为好友，备注 "Taro RN"，加入官方交流群寻求帮助。

<img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_13XUU513XUVaU5U7U5Wc3559U75aXUVa.jpg" width="300px" />
<img  referrerPolicy="no-referrer"   referrerPolicy="no-referrer"   referrerPolicy="no-referrer"  src="https://pic8.58cdn.com.cn/nowater/fangfe/n_v282625210493c4a3fac202d6cf372458e.png" width="300px" />

后续，我们还将带来支持 React Native 的 Taro UI 以及包含详细教程的技术小册，尽请期待。

同时我们也在征集社区优秀使用案例，欢迎开发者提交案例到案例仓库中[12]。

## 相关链接

[1] 壳工程地址：https://github.com/NervJS/taro-native-shell

[2] 模板源码地址：https://github.com/NervJS/taro-project-templates/tree/v3.1/react-native

[3] GitHub Action 文档：https://docs.github.com/cn/actions

[4] GitHub Action 加密机制：https://docs.github.com/cn/actions/reference/encrypted-secrets

[5] Taro React Native Publish Action：https://github.com/shinken008/taro-native-publish

[6] fastlane官网：https://docs.fastlane.tools

[7] AppleID 密码生成：https://support.apple.com/en-us/HT204397

[8] 使用 GitHub Action 发布 iOS 应用：https://betterprogramming.pub/deploy-an-ios-app-to-testflight-or-the-app-store-using-github-actions-c4d7082b1430

[9] 安卓签名文件生成：https://developer.android.com/studio/publish/app-signing#generate-key

[10] Taro Playground 源码：https://github.com/wuba/taro-playground

[11] Taro Playground APP 下载：https://github.com/wuba/taro-playground/releases

[12] Taro 案例提交：https://github.com/NervJS/taro-user-cases
