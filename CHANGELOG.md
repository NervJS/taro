<a name=""></a>
# [](https://github.com/NervJS/taro/compare/v1.2.26...v) (2019-04-15)



<a name="1.2.26"></a>
## [1.2.26](https://github.com/NervJS/taro/compare/v1.2.25...v1.2.26) (2019-04-15)


### Bug Fixes

* **h5:** 暂时移除chooseVideo ([769227e](https://github.com/NervJS/taro/commit/769227e))


### Features

* **taroize:**  支持 wxml catch 函数直接写 true ([d94032f](https://github.com/NervJS/taro/commit/d94032f))



<a name="1.2.25"></a>
## [1.2.25](https://github.com/NervJS/taro/compare/v1.2.24...v1.2.25) (2019-04-12)


### Bug Fixes

* **cli:** 修复h5修改tabbar配置需要重启才能生效的问题 ([277856c](https://github.com/NervJS/taro/commit/277856c))
* **cli:** 修复render函数中pullDownRefresh的处理错误 ([d131ab8](https://github.com/NervJS/taro/commit/d131ab8))
* **cli:** 修复云开发模板生成文件问题 ([3fc0ec0](https://github.com/NervJS/taro/commit/3fc0ec0))
* **cli:** 修复全局变量为对象时替换的 bug ([97067d5](https://github.com/NervJS/taro/commit/97067d5))
* **cli:** 修复支付宝小程序端 tabBar 文字颜色配置，close [#2739](https://github.com/NervJS/taro/issues/2739) ([27b1afa](https://github.com/NervJS/taro/commit/27b1afa))
* **cli:** 升级 [@typescript-eslint](https://github.com/typescript-eslint)/parser 的版本，close [#2742](https://github.com/NervJS/taro/issues/2742) ([19226c2](https://github.com/NervJS/taro/commit/19226c2))
* **cli:** 模版内 eslintrc 变量读读取错误导致初始化报错 ([09cdab1](https://github.com/NervJS/taro/commit/09cdab1))
* **taro-components:** 解决组件库缺少 loader 导致构建失败的问题 ([bcd379f](https://github.com/NervJS/taro/commit/bcd379f))
* **taro-redux:** connect 继承原组件时需要传入 isPage。#closed 2729 ([39e0e66](https://github.com/NervJS/taro/commit/39e0e66))
* **taroize:** 装饰器没有插入到类声明中, close [#2740](https://github.com/NervJS/taro/issues/2740) ([f6c15b8](https://github.com/NervJS/taro/commit/f6c15b8))
* **transformer:** 在循环中重复删除节点导致报错 ([7992502](https://github.com/NervJS/taro/commit/7992502))
* **transformer:** 循环的上级和内部都有 if-else 解析错误，close [#2732](https://github.com/NervJS/taro/issues/2732) ([c57e18a](https://github.com/NervJS/taro/commit/c57e18a))
* **transformer:** 超过三级 if-else 嵌套时解析失败 ([fe26a7e](https://github.com/NervJS/taro/commit/fe26a7e))
* **transformer-wx:** 当类中不存在 render 方法时补充一个空的 _createData 方法，close [#2733](https://github.com/NervJS/taro/issues/2733) ([c9df847](https://github.com/NervJS/taro/commit/c9df847))
* **webpack-runner:** 把mobx-h5加入默认esnextModules中 ([04f0580](https://github.com/NervJS/taro/commit/04f0580))


### Features

* **components:** video组件md更新 ([a5108c5](https://github.com/NervJS/taro/commit/a5108c5))
* **components:** 增加video组件 ([03b13a0](https://github.com/NervJS/taro/commit/03b13a0))
* **scss:** support global scss inject ([#2725](https://github.com/NervJS/taro/issues/2725)) ([1187e24](https://github.com/NervJS/taro/commit/1187e24))



<a name="1.2.24"></a>
## [1.2.24](https://github.com/NervJS/taro/compare/v1.2.23...v1.2.24) (2019-04-10)


### Bug Fixes

* **cli:** 云函数返回结果 ([#2687](https://github.com/NervJS/taro/issues/2687)) ([2bb0e5d](https://github.com/NervJS/taro/commit/2bb0e5d))
* **cli:** 修复 node_modules 中图片等静态资源文件路径编译错误问题，closes [#2540](https://github.com/NervJS/taro/issues/2540)，closes [#2208](https://github.com/NervJS/taro/issues/2208) ([58cd13b](https://github.com/NervJS/taro/commit/58cd13b))
* **cli:** 小程序编译时遇到样式错误直接中断编译 ([57eae11](https://github.com/NervJS/taro/commit/57eae11))
* **cli:** 调整插件编译类型判断 ([6b1581d](https://github.com/NervJS/taro/commit/6b1581d))
* **taro-alipay:** 修复支付宝 ref。fix [#2028](https://github.com/NervJS/taro/issues/2028) ([3ddc740](https://github.com/NervJS/taro/commit/3ddc740))
* **taro-cli:** 修复 taro init 插件模板 ([32004be](https://github.com/NervJS/taro/commit/32004be))
* **taro-cli:** 更新微信小程序插件模板 ([9f8884e](https://github.com/NervJS/taro/commit/9f8884e))
* **taro-swan:** 百度小程序增加循环 ref 处理 ([191a9e2](https://github.com/NervJS/taro/commit/191a9e2))
* **taro-tt:** 修复字节跳动小程序循环 ref ([9e286fa](https://github.com/NervJS/taro/commit/9e286fa))
* **taro-weapp:** 修改循环 ref 参数 ([9e0b614](https://github.com/NervJS/taro/commit/9e0b614))
* **taroize:** template 和 for 混用解析，失败，[#2695](https://github.com/NervJS/taro/issues/2695) ([5536600](https://github.com/NervJS/taro/commit/5536600))
* **taroize:** 微信小程序转换Taro生命周期丢失 ([#2688](https://github.com/NervJS/taro/issues/2688)) ([05b4917](https://github.com/NervJS/taro/commit/05b4917))
* **transformer:** 只有 props 为 key 时才进行 key 不得为 index 的警告 ([#2705](https://github.com/NervJS/taro/issues/2705)) ([bd3f142](https://github.com/NervJS/taro/commit/bd3f142))


### Features

* **components:** h5内置PullDownRefresh组件 ([5793260](https://github.com/NervJS/taro/commit/5793260))
* **components:** 完善 Input, Button, Textarea, WebView, Swiper 组件的类型定义 ([#2713](https://github.com/NervJS/taro/issues/2713)) ([6c4ef9c](https://github.com/NervJS/taro/commit/6c4ef9c))
* **h5:** h5支持PullDownRefresh系列api ([50a7e79](https://github.com/NervJS/taro/commit/50a7e79))
* **taro-cli:** 增加微信小程序插件编译功能 ([e3ca6ca](https://github.com/NervJS/taro/commit/e3ca6ca))
* **taro-cli:** 增加支付宝小程序插件编译功能 ([a4febc6](https://github.com/NervJS/taro/commit/a4febc6))
* **taro-components:** 更新 Video 组件的类型定义 ([63d7e13](https://github.com/NervJS/taro/commit/63d7e13))
* **taroize:** 支持在 wxml 使用复杂结构语法，close [#2695](https://github.com/NervJS/taro/issues/2695) ([b28ef49](https://github.com/NervJS/taro/commit/b28ef49))
* **transformer:** 支持 do expression，close [#2589](https://github.com/NervJS/taro/issues/2589) ([67e0e2d](https://github.com/NervJS/taro/commit/67e0e2d))
* **transformer:** 支持 export * from * 语法, close [#959](https://github.com/NervJS/taro/issues/959) ([c7f9f24](https://github.com/NervJS/taro/commit/c7f9f24))
* **typescript:** 类型声明文件增加类类型：ComponentClass ([#2720](https://github.com/NervJS/taro/issues/2720)) ([bf80451](https://github.com/NervJS/taro/commit/bf80451))



<a name="1.2.23"></a>
## [1.2.23](https://github.com/NervJS/taro/compare/v1.2.22...v1.2.23) (2019-04-04)


### Bug Fixes

* **components:** 修复在didMount中绘制的canvas会被清空的问题 ([9687312](https://github.com/NervJS/taro/commit/9687312))
* **components:** 多列选择器更新属性问题 ([db206b3](https://github.com/NervJS/taro/commit/db206b3))
* **components:** 缺少处理修饰器的 babel 插件 ([3d36851](https://github.com/NervJS/taro/commit/3d36851))
* **mobx-h5:** 修复mobx中import不到Component的问题, fix [#2561](https://github.com/NervJS/taro/issues/2561) ([0097df0](https://github.com/NervJS/taro/commit/0097df0))
* **rn:** 直接运行构建命令目录不存在的bug ([48a1e3c](https://github.com/NervJS/taro/commit/48a1e3c))
* **taroize:** 处理声明周期函数不是函数的情况 ([64be21d](https://github.com/NervJS/taro/commit/64be21d))
* **taroize:** 第一个 wxml 标签后有注释可能报错 ([ae59efd](https://github.com/NervJS/taro/commit/ae59efd))
* **transformer:** JSX props 的匿名函数变量不需要重命名 ([8056981](https://github.com/NervJS/taro/commit/8056981))
* **transformer:** 多层循环中的调用者如果是一个复杂表达式不需要改名 ([7f7cb7c](https://github.com/NervJS/taro/commit/7f7cb7c))
* **transformer-wx:** 修复tsx文件中读取不到config的问题,fix [#2592](https://github.com/NervJS/taro/issues/2592) ([61c600f](https://github.com/NervJS/taro/commit/61c600f))
* **webpack-runner:** 修复esnextModules中的斜杠干扰正则解析的问题 ([dc5be08](https://github.com/NervJS/taro/commit/dc5be08))


### Features

* **cli h5:** 支持onPageScroll和onReachBottom api ([2a8224e](https://github.com/NervJS/taro/commit/2a8224e))
* **components:** h5增加canvas组件 ([09d1396](https://github.com/NervJS/taro/commit/09d1396))
* **css modules:** generateScopedName 支持设为函数 ([#2058](https://github.com/NervJS/taro/issues/2058)) ([3e27853](https://github.com/NervJS/taro/commit/3e27853))
* **h5:** h5增加createCanvasContext api ([56e8843](https://github.com/NervJS/taro/commit/56e8843))
* **h5:** 增加canvasToTempFilePath api ([3764452](https://github.com/NervJS/taro/commit/3764452))
* **h5 component:** 支持canvasgetimagedata canvasputimage api ([17d804d](https://github.com/NervJS/taro/commit/17d804d))
* **plugin-sass:** 改用dart-sass ([0a2f8d8](https://github.com/NervJS/taro/commit/0a2f8d8))
* **rn:** 添加生成 JDReact 工程目录的功能 ([4047269](https://github.com/NervJS/taro/commit/4047269))
* **taro-cli:** 添加 process.env.TARO_ENV 的 TypeScript 定义 ([#2663](https://github.com/NervJS/taro/issues/2663)) ([ecd52ff](https://github.com/NervJS/taro/commit/ecd52ff))
* **taro-components:** 添加 PickerViewColumn 组件 ([#2606](https://github.com/NervJS/taro/issues/2606)) ([9fa119b](https://github.com/NervJS/taro/commit/9fa119b))
* **taro-swan:** 百度小程序增加 componentDidShow、componentDidHide。closed [#2605](https://github.com/NervJS/taro/issues/2605) ([91f5c4f](https://github.com/NervJS/taro/commit/91f5c4f))
* **taroize:** 构造函数支持传入变量 ([f104d05](https://github.com/NervJS/taro/commit/f104d05))
* **transformer:** 同一文件定义多个类在 cli 直接报错 ([eea66cf](https://github.com/NervJS/taro/commit/eea66cf))
* **webpack-runner:** 切换为dart-sass ([40533fc](https://github.com/NervJS/taro/commit/40533fc))



<a name="1.2.22"></a>
## [1.2.22](https://github.com/NervJS/taro/compare/v1.2.21...v1.2.22) (2019-03-26)


### Bug Fixes

* **components-rn:** Picker date 格式 yyyy-MM-dd ([62b632c](https://github.com/NervJS/taro/commit/62b632c))
* **components-rn:** 大小写无法覆盖导致了引用问题 ([1dd42f3](https://github.com/NervJS/taro/commit/1dd42f3))
* **mobx:** 修复h5下，componentDidShow不触发的问题 ([#2583](https://github.com/NervJS/taro/issues/2583)) ([7076881](https://github.com/NervJS/taro/commit/7076881))
* **rn:** RN 下 navigationBarTextStyle 无效 close [#2119](https://github.com/NervJS/taro/issues/2119) ([0539c8e](https://github.com/NervJS/taro/commit/0539c8e))
* **rn:** RN端编译时提示Warning: isMounted(...) is deprecated close [#642](https://github.com/NervJS/taro/issues/642) ([5a9b66a](https://github.com/NervJS/taro/commit/5a9b66a))
* **rn:** 修复 Android 端 navigation header title 不居中的问题 ([5fb6fab](https://github.com/NervJS/taro/commit/5fb6fab))
* **rn:** 生成的 index 入口的 entryFileName 带文件后缀导致 ts 模版启动异常 ([7791edb](https://github.com/NervJS/taro/commit/7791edb))
* **rn:** 编译成rn之后，navigateBack delta参数无效，reLaunch提示不支持 close [#2494](https://github.com/NervJS/taro/issues/2494) ([cdeed45](https://github.com/NervJS/taro/commit/cdeed45))
* **taro:** interceptors 没有正确处理异常 ([9743717](https://github.com/NervJS/taro/commit/9743717))
* **taro-components:** H5 & Weapp统一pagePath. ([#2575](https://github.com/NervJS/taro/issues/2575)) ([cdd1370](https://github.com/NervJS/taro/commit/cdd1370))
* **taro-redux:** close [#2595](https://github.com/NervJS/taro/issues/2595)，reopen [#1125](https://github.com/NervJS/taro/issues/1125) ([c93dbd5](https://github.com/NervJS/taro/commit/c93dbd5))
* **taro-swan:** 绕过百度小程序合并 setData 导致 properties observer 不触发的问题 ([d18c582](https://github.com/NervJS/taro/commit/d18c582))
* **taroize:** if 和 for 同在一个 tag 时报错，close [#2528](https://github.com/NervJS/taro/issues/2528) ([b366202](https://github.com/NervJS/taro/commit/b366202))
* **taroize:** template import 为兄弟关系时报错, close [#2535](https://github.com/NervJS/taro/issues/2535) ([65504ba](https://github.com/NervJS/taro/commit/65504ba))
* **taroize:** wxml 中包含单个花括号需要转换成 JSX 可以接受的格式 ([649800a](https://github.com/NervJS/taro/commit/649800a))
* **taroize:** 当 state/props 不是一个合法变量名时报错 ([e318812](https://github.com/NervJS/taro/commit/e318812)), closes [#2532](https://github.com/NervJS/taro/issues/2532)
* **transformer:** idea 系内置终端某些情况会乱码，close [#2530](https://github.com/NervJS/taro/issues/2530) ([2cb97b9](https://github.com/NervJS/taro/commit/2cb97b9))
* issue [#2534](https://github.com/NervJS/taro/issues/2534) ([418c6b2](https://github.com/NervJS/taro/commit/418c6b2))
* onError 对应的生命周期应是 componentDidCatchError ([#2571](https://github.com/NervJS/taro/issues/2571)) ([abbe73f](https://github.com/NervJS/taro/commit/abbe73f))
* **transformer:** 支持替换 jsx 中的属性名, close [#2077](https://github.com/NervJS/taro/issues/2077) ([443b1dc](https://github.com/NervJS/taro/commit/443b1dc))
* **webpack-runner:** 修复h5.imageUrlLoaderOption失效的问题 ([abbe23e](https://github.com/NervJS/taro/commit/abbe23e))
* **webpack-runner:** 升级webpack,fix [#2539](https://github.com/NervJS/taro/issues/2539) ([e013892](https://github.com/NervJS/taro/commit/e013892))


### Features

* **cli:** 去除页面默认标题 ([76344f0](https://github.com/NervJS/taro/commit/76344f0))
* **webpack-runner:** cssModules的module模式不再排除node_modules目录 ([c7f6a92](https://github.com/NervJS/taro/commit/c7f6a92))



<a name="1.2.21"></a>
## [1.2.21](https://github.com/NervJS/taro/compare/v1.2.20...v1.2.21) (2019-03-21)


### Bug Fixes

* **cli:** 修改云开发模板创建相关问题 ([8e234d8](https://github.com/NervJS/taro/commit/8e234d8))
* **h5:** 修复taro-h5 api列表不完整的问题 ([e496d2f](https://github.com/NervJS/taro/commit/e496d2f))
* **h5:** 修复了taro-h5的打包版本 ([275cdd6](https://github.com/NervJS/taro/commit/275cdd6))
* **rn:** RN 应用名称默认从 package.json 的 name 字段获取 ([e0b8394](https://github.com/NervJS/taro/commit/e0b8394))
* **taro-rn:** 修复安卓端 toast 弹窗无法显示图片的问题 ([aec990b](https://github.com/NervJS/taro/commit/aec990b))
* **transformer:** if-else 当中有些变量不会加入 usedState ([b266ead](https://github.com/NervJS/taro/commit/b266ead))
* **transformer:** 只有 map 内部有 if-else 延时赋值匿名变量, close [#2524](https://github.com/NervJS/taro/issues/2524), ([645cda9](https://github.com/NervJS/taro/commit/645cda9)), closes [#2523](https://github.com/NervJS/taro/issues/2523)
* **types:** types of chooseImage ([#2472](https://github.com/NervJS/taro/issues/2472)) ([7be617e](https://github.com/NervJS/taro/commit/7be617e))
* **weapp:** 修复云开发 api 初始化 ([3e26a96](https://github.com/NervJS/taro/commit/3e26a96))


### Features

* **cli:** 模板中增加了wba插件的注释 ([2f39b8c](https://github.com/NervJS/taro/commit/2f39b8c))
* **cli:** 跨平台开发方式支持目录判断 ([#2466](https://github.com/NervJS/taro/issues/2466)) ([84d0c3b](https://github.com/NervJS/taro/commit/84d0c3b))
* **cli router:** 支持在app.js的componentWillMount里使用this.$router ([3281851](https://github.com/NervJS/taro/commit/3281851))
* **cli router:** 现在支持在app.js里面调用navigateTo系列api了 ([20d026e](https://github.com/NervJS/taro/commit/20d026e))
* **components:** 增加了navigator组件 ([b7362c0](https://github.com/NervJS/taro/commit/b7362c0))
* **components-rn:** 引入 [@ant-design](https://github.com/ant-design)/react-native ([8397adf](https://github.com/NervJS/taro/commit/8397adf))
* **components-rn:** 暴露 lib/provider ([e922160](https://github.com/NervJS/taro/commit/e922160))
* **docs:** 新增微信小程序云开发模板说明 ([667c6d2](https://github.com/NervJS/taro/commit/667c6d2))
* **h5 router:** 对齐this.$router参数 ([564b684](https://github.com/NervJS/taro/commit/564b684))
* **rn:** RN 端添加编译时样式校验 close [#2251](https://github.com/NervJS/taro/issues/2251) ([0aadb7e](https://github.com/NervJS/taro/commit/0aadb7e))
* **rn:** 固定 react-native 版本 ([50a3ab3](https://github.com/NervJS/taro/commit/50a3ab3))
* **rn:** 根节点嵌入组件提供的 provider ([7f4183c](https://github.com/NervJS/taro/commit/7f4183c))
* **router:** 增加了未找到页面组件的错误提示 ([aecac84](https://github.com/NervJS/taro/commit/aecac84))
* **router:** 尝试支持reLaunch ([67a5e85](https://github.com/NervJS/taro/commit/67a5e85))
* **taro:** 新增云开发 api 相关 d.ts 文件 ([04657c1](https://github.com/NervJS/taro/commit/04657c1))
* **taro:** 补充 getMenuButtonBoundingClientRect API，close [#2520](https://github.com/NervJS/taro/issues/2520) ([7384cfb](https://github.com/NervJS/taro/commit/7384cfb))
* **taro-weapp:** 更新TabBar类型声明 ([#2465](https://github.com/NervJS/taro/issues/2465)) ([2672f89](https://github.com/NervJS/taro/commit/2672f89))
* **transformer:** 当循环中使用 key 作为键值时给予修改建议 ([1b8ddc7](https://github.com/NervJS/taro/commit/1b8ddc7)), closes [#2492](https://github.com/NervJS/taro/issues/2492)
* **webpack-runner:** 调整代码逻辑,增加了一些测试用例 ([f98c146](https://github.com/NervJS/taro/commit/f98c146))



<a name="1.2.20"></a>
## [1.2.20](https://github.com/NervJS/taro/compare/v1.2.19...v1.2.20) (2019-03-17)


### Bug Fixes

* **webpack-runner:** 修复esnextModules的判断错误 ([995010a](https://github.com/NervJS/taro/commit/995010a))
* **webpack-runner:** 移除singleton配置 ([eac53f5](https://github.com/NervJS/taro/commit/eac53f5))



<a name="1.2.19"></a>
## [1.2.19](https://github.com/NervJS/taro/compare/v1.2.18...v1.2.19) (2019-03-15)


### Bug Fixes

* **redux-h5:** package.json中补充缺失的文件 ([bd8ac45](https://github.com/NervJS/taro/commit/bd8ac45))
* **webpack-runner:** 修改了版本说明 ([c288a45](https://github.com/NervJS/taro/commit/c288a45))



<a name="1.2.18"></a>
## [1.2.18](https://github.com/NervJS/taro/compare/v1.2.17...v1.2.18) (2019-03-15)


### Bug Fixes

* **cli, h5:** 修复PureComponent中获取不到$router和$app的问题. fix [#1857](https://github.com/NervJS/taro/issues/1857) ([b8b81f6](https://github.com/NervJS/taro/commit/b8b81f6))
* **components:** 修复 ScrollView scrollTop 空字符串问题 ([c989470](https://github.com/NervJS/taro/commit/c989470))
* **components:** 修复 ScrollView 组件更新判断问题 ([5e70801](https://github.com/NervJS/taro/commit/5e70801))
* **components:** 修复某些情况下后退不显示tabbar的问题 ([b520dfb](https://github.com/NervJS/taro/commit/b520dfb))
* **components:** 回退 scrollView ([e91c2c5](https://github.com/NervJS/taro/commit/e91c2c5))
* **h5:** 修复modal在跳转后不隐藏的问题, fix [#2364](https://github.com/NervJS/taro/issues/2364) ([491aed8](https://github.com/NervJS/taro/commit/491aed8))
* **rn:** 兼容 PureComponent 的写法 ([2f12f2b](https://github.com/NervJS/taro/commit/2f12f2b))
* **rn:** 在页面中设置navigationBarTitleText，rn模式下无效 close [#2420](https://github.com/NervJS/taro/issues/2420) ([9b10f09](https://github.com/NervJS/taro/commit/9b10f09))
* **router:** 修复ios9下不执行render的问题 ([81cc636](https://github.com/NervJS/taro/commit/81cc636))
* **router:** 修复跳转第三方网站时多出一条历史记录的问题 ([2b65bc7](https://github.com/NervJS/taro/commit/2b65bc7))
* **taro-alipay:** 修复支付宝小程序 request 请求对低版本小程序运行时兼容性问题 ([8a9348c](https://github.com/NervJS/taro/commit/8a9348c))
* **taro-components:** fix scroll-view upper/lowerThreshold default value & get value issue ([a2ddb30](https://github.com/NervJS/taro/commit/a2ddb30))
* **taro-components-rn:** Form: child.type 可能不存在 ([49480f9](https://github.com/NervJS/taro/commit/49480f9))
* **taro-h5:** 修复了taro-h5的测试用例 ([90d2f44](https://github.com/NervJS/taro/commit/90d2f44))
* **transformer:** if-else 数量大于 2 时解析错误，close [#2415](https://github.com/NervJS/taro/issues/2415) ([abbfc34](https://github.com/NervJS/taro/commit/abbfc34))
* **webpack-runner:** 修复webpack-runner无法通过编译的问题 ([fd3f9d7](https://github.com/NervJS/taro/commit/fd3f9d7))
* **webpack-runner:** 尝试解决H5的FOUC问题, fix [#1680](https://github.com/NervJS/taro/issues/1680) ([3c1af2f](https://github.com/NervJS/taro/commit/3c1af2f))
* **webpack-runner:** 移除了webpack配置项,并补全文档 ([5a90559](https://github.com/NervJS/taro/commit/5a90559))
* **webpack-runner:** 解决esnextModules匹配不准确的问题 ([555e82d](https://github.com/NervJS/taro/commit/555e82d))
* **with-weapp:** 当 this.$router.params 没有值时赋一个空对象， close [#2234](https://github.com/NervJS/taro/issues/2234) ([43eb400](https://github.com/NervJS/taro/commit/43eb400))


### Features

* **api:** 新增小程序云开发api ([1e64b83](https://github.com/NervJS/taro/commit/1e64b83))
* **babel-plugin-transform-taroapi:** 加入taroapi转换插件 ([e90efdf](https://github.com/NervJS/taro/commit/e90efdf))
* **babel-plugin-transform-taroapi:** 防止多次运行时对Taro变量的错误处理 ([15bc392](https://github.com/NervJS/taro/commit/15bc392))
* **cli:** 新增小程序云开发模板 ([b319899](https://github.com/NervJS/taro/commit/b319899))
* **cli:** 新增模板选项 ([575d47c](https://github.com/NervJS/taro/commit/575d47c))
* **component h5 router:** 支持switchTab Api ([a1e4dee](https://github.com/NervJS/taro/commit/a1e4dee))
* **components:** 新增了更多tabbar api的支持 ([aea65dd](https://github.com/NervJS/taro/commit/aea65dd))
* **rn:** RN 端支持使用 stylelint 进行样式校验 ([fdaa408](https://github.com/NervJS/taro/commit/fdaa408))
* **rn:** 优化 RN 端跨平台开发方式 ([a1a74b9](https://github.com/NervJS/taro/commit/a1a74b9))
* **router:** 修改router的打包配置 ([8b1a743](https://github.com/NervJS/taro/commit/8b1a743))
* **taro-components:** 完善 CoverView 的类型定义 ([#2436](https://github.com/NervJS/taro/issues/2436)) ([4c4f0bd](https://github.com/NervJS/taro/commit/4c4f0bd))
* **taro-components:** 精简依赖,移除urijs ([531110b](https://github.com/NervJS/taro/commit/531110b))
* **taro-components-rn:** 移植 ant-design-mobile-rn 的 Picker Modal Portal 等 ([c523077](https://github.com/NervJS/taro/commit/c523077))
* **taro-h5:** taro-h5打包模式修改 ([c0e73b3](https://github.com/NervJS/taro/commit/c0e73b3))
* **webpack-runner:** 去除了buildDll流程,fix [#1800](https://github.com/NervJS/taro/issues/1800) ([a95f600](https://github.com/NervJS/taro/commit/a95f600))
* **webpack-runner:** 将taro-h5移出dll ([9efda3c](https://github.com/NervJS/taro/commit/9efda3c))
* **webpack-runner:** 支持taro-h5 treeshaking ([b54964b](https://github.com/NervJS/taro/commit/b54964b))



<a name="1.2.17"></a>
## [1.2.17](https://github.com/NervJS/taro/compare/v1.2.16...v1.2.17) (2019-03-11)


### Bug Fixes

* **cli:** 修复使用 require 读取 json 文件失败的问题 ([f549f53](https://github.com/NervJS/taro/commit/f549f53))
* **router:** 修复了redirect之后页面生命周期错误触发的问题, fix [#2388](https://github.com/NervJS/taro/issues/2388) ([1350b36](https://github.com/NervJS/taro/commit/1350b36))
* **taro-components-rn:** react natvie 引用 swiper 组件 报错 undefined is not an object (evaluating 'style.height'), fix [#2301](https://github.com/NervJS/taro/issues/2301) ([7175c03](https://github.com/NervJS/taro/commit/7175c03))
* **taroize:** 支持事件名有一个冒号 `:`的写法，close [#2389](https://github.com/NervJS/taro/issues/2389) ([a0806c5](https://github.com/NervJS/taro/commit/a0806c5))
* **with-weapp:** h5 无法触发 triggerEvent，使用 lerna 自动同步依赖, ([5ce8358](https://github.com/NervJS/taro/commit/5ce8358)), closes [#2383](https://github.com/NervJS/taro/issues/2383)


### Features

* **cli:** 优化跨平台开发方式 ([4ff9521](https://github.com/NervJS/taro/commit/4ff9521))
* **components:** 重构 ScrollView 组件。 ([23624e8](https://github.com/NervJS/taro/commit/23624e8))



<a name="1.2.16"></a>
## [1.2.16](https://github.com/NervJS/taro/compare/v1.2.15...v1.2.16) (2019-03-06)


### Bug Fixes

* onColumnChange event.detail.value 应该是下标 ([79eaf17](https://github.com/NervJS/taro/commit/79eaf17))
* **cli:** cannot find module 'fbjs/lib/keyMirror'  close [#2121](https://github.com/NervJS/taro/issues/2121) ([1c324b0](https://github.com/NervJS/taro/commit/1c324b0))
* taro info rn 卡住的 bug ([a3e5377](https://github.com/NervJS/taro/commit/a3e5377))
* **components:** 修复 picker 异步数据更新问题, 选中值状态问题。 close [#2343](https://github.com/NervJS/taro/issues/2343) , close [#2253](https://github.com/NervJS/taro/issues/2253) ([1b1bb32](https://github.com/NervJS/taro/commit/1b1bb32))
* **taro:** my.getStorageSync，预览和调试结果返回不一致 ([#2317](https://github.com/NervJS/taro/issues/2317)) ([074ecc0](https://github.com/NervJS/taro/commit/074ecc0))
* **taro-components:** 完善 PickerView 的类型定义 ([#2333](https://github.com/NervJS/taro/issues/2333)) ([3165682](https://github.com/NervJS/taro/commit/3165682))
* **taro-weapp/tt:** 数组 diff 逻辑更改 ([2f82f0c](https://github.com/NervJS/taro/commit/2f82f0c))
* **taroize:** class properies 函数不能使用 arguments，close [#2295](https://github.com/NervJS/taro/issues/2295) ([f62bb85](https://github.com/NervJS/taro/commit/f62bb85))
* **taroize:** 事件名需传入有效的 JavaScript 变量名，close [#2277](https://github.com/NervJS/taro/issues/2277) ([41d3fba](https://github.com/NervJS/taro/commit/41d3fba))
* **transformer:** 修复多重 if 嵌套的问题 ([5e0bf68](https://github.com/NervJS/taro/commit/5e0bf68))
* **transformer:** 单层 if 表达式被当成嵌套 if 表达式解析 ([d8a9cee](https://github.com/NervJS/taro/commit/d8a9cee))
* **transformer:** 循环中有 if-else 时生成匿名表达式位置错误，close [#2352](https://github.com/NervJS/taro/issues/2352) ([b200a70](https://github.com/NervJS/taro/commit/b200a70))


### Features

* **cli:** CLI 去除 expo，添加 react-native 的 packger server 启动 ([5150e59](https://github.com/NervJS/taro/commit/5150e59))
* **components-rn:** 去掉 components-rn 的 expo 依赖 ([f29bf88](https://github.com/NervJS/taro/commit/f29bf88))
* **eslint:** 内置组件名判断支持匿名类 ([9ed38a9](https://github.com/NervJS/taro/commit/9ed38a9))
* **taro-components-rn:** 增加 WebView, close [#2336](https://github.com/NervJS/taro/issues/2336) ([b9db564](https://github.com/NervJS/taro/commit/b9db564))
* **taro-rn:** 去除 RN 的 expo 依赖 ([eec6aa1](https://github.com/NervJS/taro/commit/eec6aa1))
* **taro-weapp/h5/alipay/swan/h5:** 为 Taro.request 添加拦截器，close [#1976](https://github.com/NervJS/taro/issues/1976) ([5181a41](https://github.com/NervJS/taro/commit/5181a41))



<a name="1.2.15"></a>
## [1.2.15](https://github.com/NervJS/taro/compare/v1.2.14...v1.2.15) (2019-02-27)


### Bug Fixes

* **cli:** 压缩js bugfix ([#2267](https://github.com/NervJS/taro/issues/2267)) ([fd83405](https://github.com/NervJS/taro/commit/fd83405))



<a name="1.2.14"></a>
## [1.2.14](https://github.com/NervJS/taro/compare/v1.2.13...v1.2.14) (2019-02-25)


### Bug Fixes

* **cli:** configDir引入前置导致config/index获取process.env.NODE_ENV为undefined.模板为例子,配置只输出production环境 ([#2211](https://github.com/NervJS/taro/issues/2211)) ([fe8c12e](https://github.com/NervJS/taro/commit/fe8c12e))
* **cli:** 低版本的 node 8 无法在 vm 中使用 ...spread 语法 ([9e0d352](https://github.com/NervJS/taro/commit/9e0d352))
* **cli:** 修复 watch 时对入口文件的判断 ([aa9e657](https://github.com/NervJS/taro/commit/aa9e657))
* **cli:** 修复将 node_modules 中的文件当成普通文件重复编译的问题 ([2323266](https://github.com/NervJS/taro/commit/2323266))
* **cli:** 修改 tsconfig.json 默认模版，完善 config-detail/alias 部分文档 ([#2219](https://github.com/NervJS/taro/issues/2219)) ([02cf7d3](https://github.com/NervJS/taro/commit/02cf7d3))
* **docs:** tutorial.md componentWillUnmount ([#2193](https://github.com/NervJS/taro/issues/2193)) ([2ecff34](https://github.com/NervJS/taro/commit/2ecff34))
* **taro-components-rn:** scrollview 横向 ([b1e610d](https://github.com/NervJS/taro/commit/b1e610d))
* **taro-components-rn:** view 绑定 clickable 时不再套一层 view 以避免样式拆分导致的样式错误，fix [#2205](https://github.com/NervJS/taro/issues/2205) ([01f069c](https://github.com/NervJS/taro/commit/01f069c))
* **taro-weapp:** didUpdate 后需要更新循环 ref ([06a5999](https://github.com/NervJS/taro/commit/06a5999))
* **taro-weapp:** 微信小程序循环 ref 在更新时逻辑优化 ([449bdf1](https://github.com/NervJS/taro/commit/449bdf1))
* **taroize:** 通过 this.onLoad 的形式调用生命周期也需要转换为对应的生命周期函数，close [#2183](https://github.com/NervJS/taro/issues/2183) ([4b75433](https://github.com/NervJS/taro/commit/4b75433))
* **transformer:** 当本地变量和循环变量冲突时警告，但仍然把本地变量加入 usedState 和 pendingState, [#2199](https://github.com/NervJS/taro/issues/2199) ([a637ca5](https://github.com/NervJS/taro/commit/a637ca5))
* **transformer:** 当用户没有指名循环的 index 时自动增加一个一个匿名的 index 作为变量名覆盖。fix [#2258](https://github.com/NervJS/taro/issues/2258) ([704a655](https://github.com/NervJS/taro/commit/704a655))
* **transformer:** 运行 loop ref 的参数默认值为 true ([8da65f9](https://github.com/NervJS/taro/commit/8da65f9))
* **transformer:** 限定运行循环 ref 的条件，[#2194](https://github.com/NervJS/taro/issues/2194) ([3b146c8](https://github.com/NervJS/taro/commit/3b146c8))
* **with-weapp:** 修复 taroize 转换后组件事件调用 this.triggerEvent 无法触发的问题 ([207bcdf](https://github.com/NervJS/taro/commit/207bcdf))


### Features

* **cli:** 新增项目配置文件可以放入sourceDir，兼容一项目多程序配置 ([#2023](https://github.com/NervJS/taro/issues/2023)) ([1c4cc6f](https://github.com/NervJS/taro/commit/1c4cc6f))
* **components:** 暂时增加空的 Canvas,  Navigator 组件，防止 H5 转换报错 ([035fd49](https://github.com/NervJS/taro/commit/035fd49))
* **transformer:** 支持在循环中使用 switch-case ([586700e](https://github.com/NervJS/taro/commit/586700e))
* **transformer:** 支持在循环中定义 JSX 变量并使用 if-else 赋值 ([495f7f5](https://github.com/NervJS/taro/commit/495f7f5))



<a name="1.2.13"></a>
## [1.2.13](https://github.com/NervJS/taro/compare/v1.2.12...v1.2.13) (2019-02-14)


### Bug Fixes

* **cli:** 修复 H5 编译 JSX 属性值为中文时转义问题 ([e718d5e](https://github.com/NervJS/taro/commit/e718d5e))
* **components:** input { text-align: inherit } ([#2101](https://github.com/NervJS/taro/issues/2101)) ([cd8c4e3](https://github.com/NervJS/taro/commit/cd8c4e3))
* **taro-cli:** fix taro cli default clean path ([#2130](https://github.com/NervJS/taro/issues/2130)) ([ddfb51c](https://github.com/NervJS/taro/commit/ddfb51c))
* **taro-cli:** 符号链接+Alias导致源代码文件被意外修改 ([#2176](https://github.com/NervJS/taro/issues/2176)) ([d88c7ed](https://github.com/NervJS/taro/commit/d88c7ed))
* **taro-components:** fix richText component ([#2131](https://github.com/NervJS/taro/issues/2131)) ([dd6c722](https://github.com/NervJS/taro/commit/dd6c722))
* **taro-rn:** pxTransform 计算错误 ([b80b0f9](https://github.com/NervJS/taro/commit/b80b0f9))
* **taro-router-rn:** navigateBack 增加默认参数 ([#2132](https://github.com/NervJS/taro/issues/2132)) ([7f52af0](https://github.com/NervJS/taro/commit/7f52af0))
* **taro-router-rn:** 页面根节点 height: 100% 无效 ([97433a5](https://github.com/NervJS/taro/commit/97433a5))
* **taroize:** 只有初次调用才需要清空已使用组件 ([b265628](https://github.com/NervJS/taro/commit/b265628))
* **transformer:** 直接写 JSX 循环在三元表达式循环中会生成匿名表达式 ([b5bee56](https://github.com/NervJS/taro/commit/b5bee56))
* **transformer-wx:** 修复 H5 编译环境变量错误的问题 ([9b8d3c6](https://github.com/NervJS/taro/commit/9b8d3c6))
* **with-weapp:** this.data 同样可以访问到 this.properties ([9f45ab3](https://github.com/NervJS/taro/commit/9f45ab3))
* **with-weapp:** triggerEvent 直接调用 super.$scope.triggerEvent ([bb56f91](https://github.com/NervJS/taro/commit/bb56f91))


### Features

* **components:** 增加一个空的 OpenData 组件，防止使用 taro-ui 打包报错 ([6e6cd8f](https://github.com/NervJS/taro/commit/6e6cd8f))
* **taro-components-rn:** 支持 Video 参数 initialTime 传字符串型数字，close [#1997](https://github.com/NervJS/taro/issues/1997) ([65f786c](https://github.com/NervJS/taro/commit/65f786c))



<a name="1.2.12"></a>
## [1.2.12](https://github.com/NervJS/taro/compare/v1.2.11...v1.2.12) (2019-01-30)


### Bug Fixes

* **cli:** 去掉一个多余的unescape行为 ([1f510a1](https://github.com/NervJS/taro/commit/1f510a1))
* **components:** 在sideEffects中标记样式文件 ([1bf341c](https://github.com/NervJS/taro/commit/1bf341c))
* **router:** 修复页面生命周期重复触发的问题 ([d6c7606](https://github.com/NervJS/taro/commit/d6c7606))



<a name="1.2.11"></a>
## [1.2.11](https://github.com/NervJS/taro/compare/v1.2.10...v1.2.11) (2019-01-29)


### Bug Fixes

* **cli:** 修改模板 babel 配置，默认开启 h5 tree shaking ([2282083](https://github.com/NervJS/taro/commit/2282083))
* **components:** 修复 Swiper 引入问题 ([e1adb3c](https://github.com/NervJS/taro/commit/e1adb3c))
* **taro-alipay:** 修复支付宝 ref ([59a7cf1](https://github.com/NervJS/taro/commit/59a7cf1))
* **transformer:** 应该先 prettify wxml 再替换小于号 ([cdf3cbd](https://github.com/NervJS/taro/commit/cdf3cbd))
* **webpack-runner:** taro内部模块的样式固定使用style-loader ([689ecc9](https://github.com/NervJS/taro/commit/689ecc9))
* **webpack-runner:** 配置包名兼容 windows ([a1feff1](https://github.com/NervJS/taro/commit/a1feff1))



<a name="1.2.10"></a>
## [1.2.10](https://github.com/NervJS/taro/compare/v1.2.9...v1.2.10) (2019-01-29)


### Bug Fixes

* **index:** 修复Swiper 失效问题 ([f9c6dfd](https://github.com/NervJS/taro/commit/f9c6dfd))
* **transformer:** 在 if block 中的循环匿名变量不需要加入全局变量 ([592d053](https://github.com/NervJS/taro/commit/592d053))
* **webpack-runner:** 补充file-loader ([65bd42d](https://github.com/NervJS/taro/commit/65bd42d))
* **webpack-runner:** 默认针对 [@tarojs](https://github.com/tarojs)/components 进行编译处理 ([68d7208](https://github.com/NervJS/taro/commit/68d7208))


### Features

* **index:** 新增 Swiper 兼容两端距离 ([eeae33f](https://github.com/NervJS/taro/commit/eeae33f))
* **taro:** api 调整 ([e8d73dd](https://github.com/NervJS/taro/commit/e8d73dd))
* **taro:** 增加 chooseMessageFile、compressImage APIs。fix [#2066](https://github.com/NervJS/taro/issues/2066) ([1edb0ba](https://github.com/NervJS/taro/commit/1edb0ba))
* **webpack-runner:** h5端支持main:h5 mainfield ([7e6cc94](https://github.com/NervJS/taro/commit/7e6cc94))



<a name="1.2.9"></a>
## [1.2.9](https://github.com/NervJS/taro/compare/v1.2.8...v1.2.9) (2019-01-28)


### Bug Fixes

* **cli:** copy 文件时，源文件与目标位置相同时报错 ([3a9cbe8](https://github.com/NervJS/taro/commit/3a9cbe8))
* **components:** Picker 为 mode = date 属性 start与end 配置无效 close [#2020](https://github.com/NervJS/taro/issues/2020) ([25b7d43](https://github.com/NervJS/taro/commit/25b7d43))
* **components:** 修复 Picker 组件返回值问题 ([d1d965b](https://github.com/NervJS/taro/commit/d1d965b))
* **components:** 修复 RichText className 属性问题 close [#2013](https://github.com/NervJS/taro/issues/2013) ([c2c28ea](https://github.com/NervJS/taro/commit/c2c28ea))
* **components webpack-runner:** components打包问题修复 ([d0f5732](https://github.com/NervJS/taro/commit/d0f5732))
* **mobx-common mobx-h5:** 增加编译代码 fix [#2017](https://github.com/NervJS/taro/issues/2017) ([82ffd4a](https://github.com/NervJS/taro/commit/82ffd4a))
* **router:** 修复redirect到相同path时不渲染的问题 ([7cfd45b](https://github.com/NervJS/taro/commit/7cfd45b))
* **taro:** componentWillUnmount 方法中无法获取navigateTo传入的参数，close [#2040](https://github.com/NervJS/taro/issues/2040) ([fe9fdca](https://github.com/NervJS/taro/commit/fe9fdca))
* **taro-components:** 修复 picker date，start end 无效 ([6c6b244](https://github.com/NervJS/taro/commit/6c6b244))
* **taro-h5:** API createAnimation 挂载到 Taro 对象上 ([ef2309b](https://github.com/NervJS/taro/commit/ef2309b))
* **taro-swan/taro-tt:** 百度和头条 properties 的 value 值设置成对应 defaultProps 的值，避免 null 值覆盖 initData 值 ([1c79db3](https://github.com/NervJS/taro/commit/1c79db3))
* **taro-tt:** 修复字节跳动小程序同步获取自定义组件实例的问题 ([#2029](https://github.com/NervJS/taro/issues/2029)) ([e168d2d](https://github.com/NervJS/taro/commit/e168d2d))
* **transformer:** 匿名函数 stopPropagation 无效 ([81455f5](https://github.com/NervJS/taro/commit/81455f5))
* **transformer:** 循环中自动的生成类型防御找不到值，fix [#2037](https://github.com/NervJS/taro/issues/2037) ([27234e1](https://github.com/NervJS/taro/commit/27234e1))
* **webpack-runner:** 优先从项目根目录寻找依赖 避免重复打包 ([e05b79f](https://github.com/NervJS/taro/commit/e05b79f))


### Features

* **cli:** compile exclude 可以排除文件夹, close [#1830](https://github.com/NervJS/taro/issues/1830) ([2b0e999](https://github.com/NervJS/taro/commit/2b0e999))
* **cli:** 支持自定义 tabbar，close [#2011](https://github.com/NervJS/taro/issues/2011) ([4d77930](https://github.com/NervJS/taro/commit/4d77930))
* **CLI:** 添加 taro info rn 的命令 ([c6c6d75](https://github.com/NervJS/taro/commit/c6c6d75))
* **components:** 新增 WebView 组件 close [#2018](https://github.com/NervJS/taro/issues/2018) ([fd57e13](https://github.com/NervJS/taro/commit/fd57e13))
* **components:** 调整了components的打包策略 ([c85f0f4](https://github.com/NervJS/taro/commit/c85f0f4))
* **eslint:** state/props 重名支持解析结构的情况 ([12b6715](https://github.com/NervJS/taro/commit/12b6715))
* **eslint:** 新规则：this.props 和 this.state 的键值不能重名，close [#1996](https://github.com/NervJS/taro/issues/1996) ([e8dc1cc](https://github.com/NervJS/taro/commit/e8dc1cc))
* **rn:** 新增deviceMotion，accelerometer两个API ([6bef8f0](https://github.com/NervJS/taro/commit/6bef8f0))
* **taro-h5:** createAnimation API 去除不必须信息 ([3a1a891](https://github.com/NervJS/taro/commit/3a1a891))
* **transformer:** 事件传参支持使用匿名函数 ([961b009](https://github.com/NervJS/taro/commit/961b009))
* **transformer:** 支持在循环中使用 if，close [#1331](https://github.com/NervJS/taro/issues/1331) ([09979cb](https://github.com/NervJS/taro/commit/09979cb))
* **webpack-runner:** 支持修改dll的文件名 ([438e1f3](https://github.com/NervJS/taro/commit/438e1f3))
* **webpack-runner:** 现在components可以具有treeshaking优化了 ([9af11fa](https://github.com/NervJS/taro/commit/9af11fa))
* **with-weapp:** 支持 triggerEvent，close [#1983](https://github.com/NervJS/taro/issues/1983) ([c4fc12d](https://github.com/NervJS/taro/commit/c4fc12d))



<a name="1.2.8"></a>
## [1.2.8](https://github.com/NervJS/taro/compare/v1.2.7...v1.2.8) (2019-01-21)


### Bug Fixes

* **cli:** mobx typescript 模板报错, fix [#1975](https://github.com/NervJS/taro/issues/1975) ([9d64e98](https://github.com/NervJS/taro/commit/9d64e98))
* **components:**  修复滑动到每一列第一项无法触发onColumnchange close[#1955](https://github.com/NervJS/taro/issues/1955) ([1e8cb56](https://github.com/NervJS/taro/commit/1e8cb56))
* **components:** 修复 Picker 默认字体问题 close [#1718](https://github.com/NervJS/taro/issues/1718) ([c64a97a](https://github.com/NervJS/taro/commit/c64a97a))
* **components:** 修复 Switch 不受控问题 clsoe [#1794](https://github.com/NervJS/taro/issues/1794) ([434daa5](https://github.com/NervJS/taro/commit/434daa5))
* **components:** 修复tabbar可能不展示的问题 ([14a5594](https://github.com/NervJS/taro/commit/14a5594))
* **mobx:** 1.2.7 mobx-h5 丢失文件 ([6a95553](https://github.com/NervJS/taro/commit/6a95553))
* **mobx:** 修复rn端文件丢失问题 ([#1949](https://github.com/NervJS/taro/issues/1949)) ([d12ce03](https://github.com/NervJS/taro/commit/d12ce03))
* **RN:** 路径别名配置字段错误 ([#1939](https://github.com/NervJS/taro/issues/1939)) ([25c9871](https://github.com/NervJS/taro/commit/25c9871))
* **router:** 去除了一些可能导致报错的es6+调用 ([bd53b6f](https://github.com/NervJS/taro/commit/bd53b6f))
* **taro-alipay:** setData 触发的 didUpdate 与 props 改变触发的 didUpdae 有可能会被小程序合并，所以判断条件需要更新 ([1b4e49e](https://github.com/NervJS/taro/commit/1b4e49e))
* **taro-alipay:** 支付宝 ref 逻辑修复 ([16904a4](https://github.com/NervJS/taro/commit/16904a4))
* **taro-alipay:** 支付宝 ref 逻辑更新 ([3bfb315](https://github.com/NervJS/taro/commit/3bfb315))
* **taro-components:** 修复 Picker 组件 Mode 为 date 时的选择区间问题 close [#1911](https://github.com/NervJS/taro/issues/1911) ([851a939](https://github.com/NervJS/taro/commit/851a939))
* **transformer:** 小于号多次使用或在 production 模式中没有被替换 ([2eedf6c](https://github.com/NervJS/taro/commit/2eedf6c))
* **transformer:** 循环的 callee 在 if 中不需要更名，fix [#1933](https://github.com/NervJS/taro/issues/1933) ([fddcec5](https://github.com/NervJS/taro/commit/fddcec5))
* **types:** 消息机制 Events 取消所有事件的函数声明 ([#1940](https://github.com/NervJS/taro/issues/1940)) ([c430165](https://github.com/NervJS/taro/commit/c430165))


### Features

* **cli:** 增加 weapp.compile.compressTemplate 来决定打包是否需要压缩 wxml ([15b3cd8](https://github.com/NervJS/taro/commit/15b3cd8))
* **router:** 增加了esm打包 ([8902132](https://github.com/NervJS/taro/commit/8902132))
* **taro-components:** picker date month 区间选择问题 ([70fe933](https://github.com/NervJS/taro/commit/70fe933))
* **taro-h5:** 添加createAnimation接口 ([466c16d](https://github.com/NervJS/taro/commit/466c16d))
* **transformer:** 支持枚举条件渲染, close [#1901](https://github.com/NervJS/taro/issues/1901) ([28ccca0](https://github.com/NervJS/taro/commit/28ccca0))



<a name="1.2.7"></a>
## [1.2.7](https://github.com/NervJS/taro/compare/v1.2.6...v1.2.7) (2019-01-15)


### Bug Fixes

* **cli:** 暂时去掉 cli 与框架版本检测，待后续调整设计 ([542db9e](https://github.com/NervJS/taro/commit/542db9e))
* **taro:** 修复事件 bind 传参，close [#1936](https://github.com/NervJS/taro/issues/1936) ([e638b50](https://github.com/NervJS/taro/commit/e638b50))
* **transformer:** options.env 无法应用到 babel 转换选项 ([fd3ab91](https://github.com/NervJS/taro/commit/fd3ab91))



<a name="1.2.6"></a>
## [1.2.6](https://github.com/NervJS/taro/compare/v1.2.5...v1.2.6) (2019-01-15)


### Features

* **cli:** project 更新增加 [@tarojs](https://github.com/tarojs)/taro-tt，close [#1931](https://github.com/NervJS/taro/issues/1931) ([4e38d8b](https://github.com/NervJS/taro/commit/4e38d8b))



<a name="1.2.5"></a>
## [1.2.5](https://github.com/NervJS/taro/compare/v1.2.4...v1.2.5) (2019-01-14)


### Bug Fixes

* **cli:** h5 端编译对于带有后缀的资源引用编译错误 ([a96c994](https://github.com/NervJS/taro/commit/a96c994))
* **cli:** 修复ts中对于带decorator的classDeclaration编译错误的问题 ([a03359a](https://github.com/NervJS/taro/commit/a03359a))
* **cli:** 修复第一次编译成功不显示 devUrl 的问题 ([#1864](https://github.com/NervJS/taro/issues/1864)) ([4ba22d8](https://github.com/NervJS/taro/commit/4ba22d8))
* **components:** nerv 无法支持 render 的结果是一个数组，close [#1804](https://github.com/NervJS/taro/issues/1804) ([8bd95c8](https://github.com/NervJS/taro/commit/8bd95c8))
* **components:** 修复 picker 组件 onColumnChange 参数 ([3b77193](https://github.com/NervJS/taro/commit/3b77193))
* **input:** 选择文件出错 ([28273d7](https://github.com/NervJS/taro/commit/28273d7))
* **mobx:** h5 & rn 环境下的 Provider 定义为 stateful（[#1850](https://github.com/NervJS/taro/issues/1850)） ([#1852](https://github.com/NervJS/taro/issues/1852)) ([2aaf6d7](https://github.com/NervJS/taro/commit/2aaf6d7))
* **RN:** taro 编译 rn 时分包路径有问题 close [#1610](https://github.com/NervJS/taro/issues/1610) ([2eaf122](https://github.com/NervJS/taro/commit/2eaf122))
* **RN:** yarn dev:rn 时 报错 TypeError: TypeError: undefined is not an object (evaluating 'this.$router.params') close [#1779](https://github.com/NervJS/taro/issues/1779) ([f10b764](https://github.com/NervJS/taro/commit/f10b764))
* **taro:** once can not destory ([#1885](https://github.com/NervJS/taro/issues/1885)) ([3418dd6](https://github.com/NervJS/taro/commit/3418dd6))
* **taro:** 小程序端事件处理事件名类似时参数绑定错误，close [#1866](https://github.com/NervJS/taro/issues/1866) ([9397304](https://github.com/NervJS/taro/commit/9397304))
* **taro-components:** ScrollView 对齐小程序样式，隐藏 scrollbar ([79a4ad1](https://github.com/NervJS/taro/commit/79a4ad1))
* **taro-components:** ScrollView 组件应同步其容器元素的 scrollLeft、scrollTop 值 ([17b6d76](https://github.com/NervJS/taro/commit/17b6d76))
* **taro-components:** textarea event handler miss pass detail value ([08221f6](https://github.com/NervJS/taro/commit/08221f6))
* **taro-components:** 修复 Input 组件类型为 number 或者 digit 时的错误，close [#1819](https://github.com/NervJS/taro/issues/1819) ([d512b3e](https://github.com/NervJS/taro/commit/d512b3e))
* **taro-components:** 修复 Input 组件默认值问题 close [#1790](https://github.com/NervJS/taro/issues/1790) ([7ccb4aa](https://github.com/NervJS/taro/commit/7ccb4aa))
* **taro-weapp:** 修复 weapp 下 this.$router.path 没有赋值的问题。fix [#1814](https://github.com/NervJS/taro/issues/1814) ([831db14](https://github.com/NervJS/taro/commit/831db14))
* **taroize:** slot name 有数字时无法正确处理，[#1876](https://github.com/NervJS/taro/issues/1876) ([1ca6fbd](https://github.com/NervJS/taro/commit/1ca6fbd))
* **taroize:** slot 中元素特殊 attr 没有被正确地处理，fix [#1880](https://github.com/NervJS/taro/issues/1880), fix [#1870](https://github.com/NervJS/taro/issues/1870) ([7a8c9a5](https://github.com/NervJS/taro/commit/7a8c9a5))
* **taroize:** 往 class 传入数组时给予警告并做一个简单 fallback，fix [#1878](https://github.com/NervJS/taro/issues/1878) ([6e80455](https://github.com/NervJS/taro/commit/6e80455))
* **taroize:** 无法解析没有 name 的 slot，close [#1835](https://github.com/NervJS/taro/issues/1835) ([81d615d](https://github.com/NervJS/taro/commit/81d615d))
* **transformer:** &nbsp; 和空格在下一个 children 不是 JSXText 时无效，fix [#1899](https://github.com/NervJS/taro/issues/1899) ([127a68b](https://github.com/NervJS/taro/commit/127a68b))
* **transformer:** JSX children 表达式中的小于号会被 html-prettier 强制换行，fix [#1802](https://github.com/NervJS/taro/issues/1802) ([21910f9](https://github.com/NervJS/taro/commit/21910f9))
* **transformer:** TypeScript 会把装饰器编译为延时赋值，fix [#1840](https://github.com/NervJS/taro/issues/1840) ([c1ee82f](https://github.com/NervJS/taro/commit/c1ee82f))
* **transformer:** 从 this 中结构 props 失败，close [#1813](https://github.com/NervJS/taro/issues/1813) ([1501cee](https://github.com/NervJS/taro/commit/1501cee))
* **transformer:** 多层嵌套 if-else 无法正确解析，fix [#1910](https://github.com/NervJS/taro/issues/1910) ([2188c92](https://github.com/NervJS/taro/commit/2188c92))
* transform scss file with hyphen(-) in the filename ([fa91278](https://github.com/NervJS/taro/commit/fa91278))
* **transformer:** 小程序会把 false 渲染出来，[#1812](https://github.com/NervJS/taro/issues/1812) ([4508763](https://github.com/NervJS/taro/commit/4508763))
* **transformer:** 开发模式 text 组件也不换行，close [#1831](https://github.com/NervJS/taro/issues/1831) ([5f2174a](https://github.com/NervJS/taro/commit/5f2174a))
* **transformer:** 当继承基类组件没有 render 函数时不报错， close [#1370](https://github.com/NervJS/taro/issues/1370) ([4b43f24](https://github.com/NervJS/taro/commit/4b43f24))


### Features

* **cli:** config配置 alias选项 暂不支持转换usingComponents [#1704](https://github.com/NervJS/taro/issues/1704) ([#1859](https://github.com/NervJS/taro/issues/1859)) ([e3a5548](https://github.com/NervJS/taro/commit/e3a5548))
* **cli:** CSS Modules 默认支持样式名中划线写法, close [#1862](https://github.com/NervJS/taro/issues/1862) ([6cfa200](https://github.com/NervJS/taro/commit/6cfa200))
* **cli router component webpack-runner:** h5支持自定义路由与basename配置 ([dc511c9](https://github.com/NervJS/taro/commit/dc511c9))
* **RN:** RN 端添加 openUrl API ([501dcd2](https://github.com/NervJS/taro/commit/501dcd2))
* **taro:** 要求传入小程序原生对象的 api ，可以通过传入 taro 实例来解决 ([7300861](https://github.com/NervJS/taro/commit/7300861))
* **transformer:** this.state 的变量和 render 的自定义变量重名时警告，close [#1385](https://github.com/NervJS/taro/issues/1385) ([2890c67](https://github.com/NervJS/taro/commit/2890c67))
* **transformer:** 允许 Image 组件嵌套，close [#1881](https://github.com/NervJS/taro/issues/1881) ([5214691](https://github.com/NervJS/taro/commit/5214691))
* **transformer:** 父类方法阻止事件冒泡，close [#1596](https://github.com/NervJS/taro/issues/1596) ([eb362a7](https://github.com/NervJS/taro/commit/eb362a7))
* **webpack-runner:** 在h5生产环境中移除部分调试代码 ([7969ebe](https://github.com/NervJS/taro/commit/7969ebe))



<a name="1.2.4"></a>
## [1.2.4](https://github.com/NervJS/taro/compare/v1.2.3...v1.2.4) (2019-01-03)


### Bug Fixes

* 修改 rollup.config.js name 字段的值 ([#1769](https://github.com/NervJS/taro/issues/1769)) ([b757207](https://github.com/NervJS/taro/commit/b757207))
* **input:** 修复 IOS 光标跳转问题 ([71f605f](https://github.com/NervJS/taro/commit/71f605f))
* **taro:** 修正 Taro.getEnv 对头条小程序的判断 ([8bc4293](https://github.com/NervJS/taro/commit/8bc4293))
* **taro-h5:** 补充 Nerv 引用 ([7f30b6f](https://github.com/NervJS/taro/commit/7f30b6f))
* **taro-swan:** 修正百度小程序 componentDidMount 调用 ([cabad00](https://github.com/NervJS/taro/commit/cabad00))
* **transformer:** 循环父级三元表达式的 alternative 没有三元表达式的防御，close [#1698](https://github.com/NervJS/taro/issues/1698) ([7f9ac60](https://github.com/NervJS/taro/commit/7f9ac60))
* **transformer:** 循环的 callee 是函数也需要执行上层的条件判断，close [#1725](https://github.com/NervJS/taro/issues/1725) ([7fab2c4](https://github.com/NervJS/taro/commit/7fab2c4))
* **transformer-wx:** 处理某些小程序组件属性与微信小程序不一致的情况，close [#1792](https://github.com/NervJS/taro/issues/1792) ([17b8689](https://github.com/NervJS/taro/commit/17b8689))
* **webpack-runner:** add esnextModules regex support the modules of cnpm installed ([#1796](https://github.com/NervJS/taro/issues/1796)) ([1bcb017](https://github.com/NervJS/taro/commit/1bcb017))


### Features

* **taro:** 增加一个 polyfill 文件 ([8588ddb](https://github.com/NervJS/taro/commit/8588ddb))
* **taro:** 补充新的音频 api ([854c0be](https://github.com/NervJS/taro/commit/854c0be))
* **taroize:** 支持 naming slot, close [#1765](https://github.com/NervJS/taro/issues/1765) ([fba22ea](https://github.com/NervJS/taro/commit/fba22ea))
* **transformer:** Taro API 的回调函数总是推荐使用箭头函数, close [#1693](https://github.com/NervJS/taro/issues/1693) ([cbec912](https://github.com/NervJS/taro/commit/cbec912))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/NervJS/taro/compare/v1.2.2...v1.2.3) (2018-12-29)


### Bug Fixes

* **eslint:** 解析非组件/页面 JSX 文件时编译器不启用 eslint 检查, close [#1703](https://github.com/NervJS/taro/issues/1703) ([d0a2bce](https://github.com/NervJS/taro/commit/d0a2bce))
* **input:** 修复 number 类型 maxLength 无效 ([8ae8194](https://github.com/NervJS/taro/commit/8ae8194))
* **RN:** 修复 Navigation 相关方法的事件绑定 ([bdff7f2](https://github.com/NervJS/taro/commit/bdff7f2))
* **RN:** 修复 Taro.navigateTo 返回问题  close[#1735](https://github.com/NervJS/taro/issues/1735) ([3d06b4b](https://github.com/NervJS/taro/commit/3d06b4b))
* **RN:** 修复页面返回不掉用 componentDidShow 和 componentDidHide 的 bug ([90901cc](https://github.com/NervJS/taro/commit/90901cc))
* **taro-cli:** build ui 当 TARO_BUILD_TYPE 为 script 时，直接 webpack 打包 ([bb88c7f](https://github.com/NervJS/taro/commit/bb88c7f))
* **taro-components:** 修复 Textarea 组件无法传递 detail 问题 ([58456e7](https://github.com/NervJS/taro/commit/58456e7)), closes [#1713](https://github.com/NervJS/taro/issues/1713)
* **taro-h5:** 改用 findDOMNode 优化 ([#1754](https://github.com/NervJS/taro/issues/1754)) ([e9eead9](https://github.com/NervJS/taro/commit/e9eead9))
* **textarea:** maxlength 对齐小程序 ([af4d57c](https://github.com/NervJS/taro/commit/af4d57c))
* **transformer:** 组件传参报错找不到代码，close [#1711](https://github.com/NervJS/taro/issues/1711) ([cef17c3](https://github.com/NervJS/taro/commit/cef17c3))
* fix type of animation in MovableViewProps ([#1747](https://github.com/NervJS/taro/issues/1747)) ([0ffaf9f](https://github.com/NervJS/taro/commit/0ffaf9f))
* 修复注释 ([9f22fc8](https://github.com/NervJS/taro/commit/9f22fc8))
* 原生组件 Switch 的 types 增加对 disabled 的类型定义 ([#1762](https://github.com/NervJS/taro/issues/1762)) ([9e28464](https://github.com/NervJS/taro/commit/9e28464))


### Features

* **taro:** add FileSystemManager api, [#1708](https://github.com/NervJS/taro/issues/1708) ([26c7c15](https://github.com/NervJS/taro/commit/26c7c15))
* **taro-cli:** 增加对 config.ui 配置项的处理 ([1b40313](https://github.com/NervJS/taro/commit/1b40313))
* **types:** BaseEvent添加两个常用事件处理的函数 ([#1739](https://github.com/NervJS/taro/issues/1739)) ([01afc26](https://github.com/NervJS/taro/commit/01afc26))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/NervJS/taro/compare/v1.2.1...v1.2.2) (2018-12-26)


### Bug Fixes

* **cli:** mobx 模板无法通过 TypeScript 类型检测 ([3873d73](https://github.com/NervJS/taro/commit/3873d73))
* **cli:** node_modules 中的文件拷贝不全，close [#1697](https://github.com/NervJS/taro/issues/1697) ([4745b44](https://github.com/NervJS/taro/commit/4745b44))
* **cli:** 优化 npm 安装包版本的查找 ([5395f43](https://github.com/NervJS/taro/commit/5395f43))
* **cli:** 样式中引用 npm 内资源解析时路径使用相对路径 ([487217d](https://github.com/NervJS/taro/commit/487217d))
* **h5:** Correct the path variable name in Location and modify the priority of fallbacks ([#1664](https://github.com/NervJS/taro/issues/1664)) ([603ed14](https://github.com/NervJS/taro/commit/603ed14))
* **taro-cli:** 1. build ui watch 时依赖分析出的样式另外处理。2. build ui watch 增加 try catch，报错不停止监听。 ([c327ebf](https://github.com/NervJS/taro/commit/c327ebf))
* **taro-components:** swiper 组件未初始化前被调用出现 undefined 错误 ([#1666](https://github.com/NervJS/taro/issues/1666)) ([c2cf9ef](https://github.com/NervJS/taro/commit/c2cf9ef))
* **taro-components:** 修复 swiper pagination 匹配错乱问题 ([c77348b](https://github.com/NervJS/taro/commit/c77348b))
* **taro-components:** 修复Input 组件事件问题 close [#1647](https://github.com/NervJS/taro/issues/1647) ([53c9337](https://github.com/NervJS/taro/commit/53c9337))
* **taro-components:** 修复Input 组件事件问题 close # 1647 ([7b702e7](https://github.com/NervJS/taro/commit/7b702e7))
* **transformer:** if block 中设置一个没有初始值的变量报错 ([213b29e](https://github.com/NervJS/taro/commit/213b29e))
* **transformer:** 循环中使用 ref 的 id 需要加上 `#` 号符，第一次运行需要做一次类型判断，close [#1589](https://github.com/NervJS/taro/issues/1589) ([117e5d3](https://github.com/NervJS/taro/commit/117e5d3))


### Features

* **cli:** 小程序端编译增加 cli 与本地依赖版本校验 ([495f6c0](https://github.com/NervJS/taro/commit/495f6c0))
* **cli:** 百度小程序编译时生成框架信息文件 ([2140017](https://github.com/NervJS/taro/commit/2140017))
* **taro-weapp/alipay/swan/tt:** 增加 this.$preload，close [#1570](https://github.com/NervJS/taro/issues/1570) ([ae4ad6d](https://github.com/NervJS/taro/commit/ae4ad6d))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/NervJS/taro/compare/v1.2.0...v1.2.1) (2018-12-21)


### Bug Fixes

* **cli:** alias 路径替换问题修复，close [#1598](https://github.com/NervJS/taro/issues/1598) ([f53ca81](https://github.com/NervJS/taro/commit/f53ca81))
* **cli:** h5 编译路径替换有误 ([117e69e](https://github.com/NervJS/taro/commit/117e69e))
* **cli:** mobx 模板无法通过 TypeScript 检测 ([b500de8](https://github.com/NervJS/taro/commit/b500de8))
* **cli:** ui 库编译 watch 增加文件分析 ([9674f24](https://github.com/NervJS/taro/commit/9674f24))
* **cli:** 生成代码中文等特殊字符会被转义为 unicode，[#1582](https://github.com/NervJS/taro/issues/1582), close [#1595](https://github.com/NervJS/taro/issues/1595) ([acdae99](https://github.com/NervJS/taro/commit/acdae99))
* **cli:** 真正支持 yarn workspaces, close [#1018](https://github.com/NervJS/taro/issues/1018) ([7f6bea2](https://github.com/NervJS/taro/commit/7f6bea2))
* **eslint:** JSX 参数可以传入循环 JSX 语句 ([a400ea6](https://github.com/NervJS/taro/commit/a400ea6))
* **eslint:** ref 可以使用匿名函数，[#1560](https://github.com/NervJS/taro/issues/1560) ([02f3fcc](https://github.com/NervJS/taro/commit/02f3fcc))
* **input:** 修复无法选择文件 fix [#1532](https://github.com/NervJS/taro/issues/1532) ([dc96118](https://github.com/NervJS/taro/commit/dc96118))
* **redux-h5:** 修复后台页面获取不到最新redux属性的问题 ([a68268c](https://github.com/NervJS/taro/commit/a68268c))
* **RN:** RN端navigationStyle 局部配置无法覆盖全局配置  close[#1627](https://github.com/NervJS/taro/issues/1627) ([cc5cba5](https://github.com/NervJS/taro/commit/cc5cba5))
* **router-h5:** 修复高阶组件的页面不更新页面标题的问题 ([1d15256](https://github.com/NervJS/taro/commit/1d15256))
* **taro:** d.ts 增加 hideKeyboard 的定义 close [#1607](https://github.com/NervJS/taro/issues/1607) ([8b50a07](https://github.com/NervJS/taro/commit/8b50a07))
* **taro-weapp/alipay/swan/tt/:** 小程序端支持在组件上绑定 bind 不同参数的同一回调函数 ([38ce066](https://github.com/NervJS/taro/commit/38ce066))
* **taroize:** template 的父组件是 if-else 时解析失败 ([1b2dbfc](https://github.com/NervJS/taro/commit/1b2dbfc))
* **taroize:** 处理形如 bind:click 这样有冒号的事件绑定 ([4b248d1](https://github.com/NervJS/taro/commit/4b248d1))
* **taroize:** 移除掉未知微信属性 ([063ff5c](https://github.com/NervJS/taro/commit/063ff5c))
* **taroize:** 统一处理 wxs module 的情况 ([26f0dbe](https://github.com/NervJS/taro/commit/26f0dbe))
* **taroize:** 自我引用的组件不用 import ([e5d9d5a](https://github.com/NervJS/taro/commit/e5d9d5a))
* **transformer:** 小程序的 key 属性用字符串包裹，而不是 JSX 表达式 ([49bfa70](https://github.com/NervJS/taro/commit/49bfa70))
* **transformer:** 循环中的 key 会自动从 item 中取值 ([f10c9a5](https://github.com/NervJS/taro/commit/f10c9a5))
* 解决taro init从命令行输入参数无效的问题 ([#1584](https://github.com/NervJS/taro/issues/1584)) ([066d0e4](https://github.com/NervJS/taro/commit/066d0e4))
* **transformer:** 第三方组件事件名有 `-` 需要特殊处理，close [#1559](https://github.com/NervJS/taro/issues/1559) ([6f90d14](https://github.com/NervJS/taro/commit/6f90d14))
* **transformer:** 遵循 JSX 语法，忽略 JSX Text 前后为换行/制表符的情况，close [#1609](https://github.com/NervJS/taro/issues/1609) ([9f873f6](https://github.com/NervJS/taro/commit/9f873f6))
* taro update project 添加 mobx 相关包 close [#1588](https://github.com/NervJS/taro/issues/1588) ([27bc2cb](https://github.com/NervJS/taro/commit/27bc2cb))


### Features

* **cli:** cli build ui 增加 watch 功能 ([12876fa](https://github.com/NervJS/taro/commit/12876fa))
* **cli:** ui 库编译增加 h5 端编译成单个文件的功能 ([fdb118a](https://github.com/NervJS/taro/commit/fdb118a))
* **doc:** 更新Api 文档 ([22a6c0d](https://github.com/NervJS/taro/commit/22a6c0d))
* **eslint:** 给编译器单独定制一个规则集合 ([11eecf6](https://github.com/NervJS/taro/commit/11eecf6))
* **RN:**  添加 RN 端 CSS Modules 的兼容处理 ([6ab2464](https://github.com/NervJS/taro/commit/6ab2464))
* **router:** h5 端使用 path 代替 pathname 标识当前页面路径 ([6967856](https://github.com/NervJS/taro/commit/6967856))
* **taro-components-rn:** 让 SwiperItem 支持 onClick, close [#1564](https://github.com/NervJS/taro/issues/1564) ([c289285](https://github.com/NervJS/taro/commit/c289285))
* **taro-rn:** 增加chooseImage Api ([08fe7f2](https://github.com/NervJS/taro/commit/08fe7f2))
* **taro-rn:** 新增downloadFile Api, [#1563](https://github.com/NervJS/taro/issues/1563) ([ace925b](https://github.com/NervJS/taro/commit/ace925b))
* **taroize:** 在 props observer 中使用对象函数简写 ([ee2e683](https://github.com/NervJS/taro/commit/ee2e683))
* **taroize:** 支持保留原有 wxml 注释 ([3b24f18](https://github.com/NervJS/taro/commit/3b24f18))
* **transformer:** wx:if/else 的间隔也可以写注释 ([74b6f90](https://github.com/NervJS/taro/commit/74b6f90))
* **weapp|tt|swan|alipay:** 小程序端增加 this.$router.path 标识当前页面路径 ([1f3c505](https://github.com/NervJS/taro/commit/1f3c505))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/NervJS/taro/compare/v1.2.0-beta.16...v1.2.0) (2018-12-17)


### Bug Fixes

* **router:** 修复一些问题： ([8c6363e](https://github.com/NervJS/taro/commit/8c6363e))
* **taro-components:**  H5 Swiper问题 close [#1528](https://github.com/NervJS/taro/issues/1528) ([0df6b30](https://github.com/NervJS/taro/commit/0df6b30))
* **transformer:** 在 JSX 中用到源于 `this.state` 的对象没有加入 usedState，close [#1492](https://github.com/NervJS/taro/issues/1492) ([9bec112](https://github.com/NervJS/taro/commit/9bec112))
* **transformer:** 当三元表达式的 tester 是复杂表达式时无法生成 JSX return 语句，close [#1459](https://github.com/NervJS/taro/issues/1459) ([30d0e80](https://github.com/NervJS/taro/commit/30d0e80))
* **transformer:** 某些自定义组件无法包含 children，close [#1551](https://github.com/NervJS/taro/issues/1551), close [#1540](https://github.com/NervJS/taro/issues/1540) ([10a27fc](https://github.com/NervJS/taro/commit/10a27fc))
* **types:**  修复类型检查 ([#1541](https://github.com/NervJS/taro/issues/1541)) ([26f0490](https://github.com/NervJS/taro/commit/26f0490)), closes [#1539](https://github.com/NervJS/taro/issues/1539)


### Features

* **cli:** css modules 处理样式文件规则与 `create-react-app` 保持一致 ([#1456](https://github.com/NervJS/taro/issues/1456)) ([a2ca3b9](https://github.com/NervJS/taro/commit/a2ca3b9))
* **transformer:** 转换器也会执行 eslint-plugin-taro 的规则 ([198f839](https://github.com/NervJS/taro/commit/198f839))
* **webpack-runner:** 适配新版cssModules配置 ([a7a6b23](https://github.com/NervJS/taro/commit/a7a6b23))


### BREAKING CHANGES

* **types:** n



<a name="1.2.0-beta.16"></a>
# [1.2.0-beta.16](https://github.com/NervJS/taro/compare/v1.2.0-beta.15...v1.2.0-beta.16) (2018-12-15)


### Bug Fixes

* **taro-components-rn:** View在ScrollView内且绑有点击事件，滑动时无法触发ScrollView的滚动，fix [#1520](https://github.com/NervJS/taro/issues/1520) ([7eed26c](https://github.com/NervJS/taro/commit/7eed26c))
* **taro-components-rn:** 让Icon的size可传字符串型数字，close [#1488](https://github.com/NervJS/taro/issues/1488) ([96271e4](https://github.com/NervJS/taro/commit/96271e4))
* **types:** input 有 name 属性，close [#1505](https://github.com/NervJS/taro/issues/1505) ([7a7fdb0](https://github.com/NervJS/taro/commit/7a7fdb0))
* **types:** MovableViewProps 中重复定义了 animation 属性, close [#1503](https://github.com/NervJS/taro/issues/1503) ([16a676a](https://github.com/NervJS/taro/commit/16a676a))
* **types:** 表单组件props属性完善 Picker组件属性完善 ([#1508](https://github.com/NervJS/taro/issues/1508)) ([a5ccded](https://github.com/NervJS/taro/commit/a5ccded))
* **webpack-runner:** 修复production模式不支持使用相对路径作为publicPath的问题 ([07fb964](https://github.com/NervJS/taro/commit/07fb964))


### Features

* **CLI:** 添加 taro info 命令，方便用户获取环境及 taro 相关依赖的信息 ([9e1864d](https://github.com/NervJS/taro/commit/9e1864d))
* **components:** tabbar代码逻辑优化 ([33169ae](https://github.com/NervJS/taro/commit/33169ae))



<a name="1.2.0-beta.15"></a>
# [1.2.0-beta.15](https://github.com/NervJS/taro/compare/v1.2.0-beta.14...v1.2.0-beta.15) (2018-12-13)


### Bug Fixes

* **components:** 修复h5 tabbar在'/'不展示的问题 ([8c92c90](https://github.com/NervJS/taro/commit/8c92c90))
* **router component:** 修复redirectTo tabbar暂时改用redirectTo ([b7c6b58](https://github.com/NervJS/taro/commit/b7c6b58))
* **taro-rn:** 修复非post方法时，对data的处理，close [#1457](https://github.com/NervJS/taro/issues/1457) ([6883a7e](https://github.com/NervJS/taro/commit/6883a7e))
* **taro-weapp:** 改正组件 componentDidHide 生命周期拼写错误 ([88d3ef2](https://github.com/NervJS/taro/commit/88d3ef2))
* **taroize:** babel template 无法生成纯字符串语句 ([7f34416](https://github.com/NervJS/taro/commit/7f34416))
* **taroize:** 当 import 的 wxml 有多个根节点时转换失败，[#1463](https://github.com/NervJS/taro/issues/1463) ([fcfc9a6](https://github.com/NervJS/taro/commit/fcfc9a6))
* **webpack-runner:** 修复dev模式下webpackChain配置失效的问题 ([b5afa70](https://github.com/NervJS/taro/commit/b5afa70))


### Features

* **cli:** 增加 import 组件的定义，close [#1481](https://github.com/NervJS/taro/issues/1481) ([9738e56](https://github.com/NervJS/taro/commit/9738e56))
* **taro-h5:** 增加 makePhoneCall API，close [#1426](https://github.com/NervJS/taro/issues/1426) ([93e23f0](https://github.com/NervJS/taro/commit/93e23f0))


### Reverts

* **cli:** 百度小程序的编译本地资源路径替换使用绝对路径 ([20fce83](https://github.com/NervJS/taro/commit/20fce83))



<a name="1.2.0-beta.14"></a>
# [1.2.0-beta.14](https://github.com/NervJS/taro/compare/v1.2.0-beta.13...v1.2.0-beta.14) (2018-12-11)


### Bug Fixes

* **cli:** ui 组件库引用路径替换错误 ([2a38eaa](https://github.com/NervJS/taro/commit/2a38eaa))
* **cli:** 修复convert转换死循环 ([#1465](https://github.com/NervJS/taro/issues/1465)) ([22b2005](https://github.com/NervJS/taro/commit/22b2005))
* **taro-components:** 修复 onInput的e.detail.value 获取不到值 close [#1439](https://github.com/NervJS/taro/issues/1439) ([9eeedf7](https://github.com/NervJS/taro/commit/9eeedf7))
* **taroize:** template 嵌套可能报错 ([2a93a0a](https://github.com/NervJS/taro/commit/2a93a0a))
* **transformer:** 自定义组件 else 需要加上 block 包裹住，close [#1468](https://github.com/NervJS/taro/issues/1468) ([7e3a0b0](https://github.com/NervJS/taro/commit/7e3a0b0))


### Features

* **cli h5 redux-h5 router:** h5路由的一些改动 ([57e6e5f](https://github.com/NervJS/taro/commit/57e6e5f))
* **router:** 支持页面滚动位置记录、复原 ([e939a65](https://github.com/NervJS/taro/commit/e939a65))



<a name="1.2.0-beta.13"></a>
# [1.2.0-beta.13](https://github.com/NervJS/taro/compare/v1.2.0-beta.12...v1.2.0-beta.13) (2018-12-11)


### Bug Fixes

* **taroize:** 循环参数只传入 `this` 可能导致爆栈， [#1430](https://github.com/NervJS/taro/issues/1430) ([7e48dbe](https://github.com/NervJS/taro/commit/7e48dbe))
* **transformer:** 循环中 ref 的组件不是根组件或自带 ID 无效，close [#1395](https://github.com/NervJS/taro/issues/1395) ([b1fa2b9](https://github.com/NervJS/taro/commit/b1fa2b9))
* **transformer:** 百度小程序用 = = 包裹的属性只有一个花括号，close [#1443](https://github.com/NervJS/taro/issues/1443) ([932eabb](https://github.com/NervJS/taro/commit/932eabb))
* **transformer:** 语句中 this 作用域对值出现两次或以上转换失败， close [#1423](https://github.com/NervJS/taro/issues/1423) ([49527e8](https://github.com/NervJS/taro/commit/49527e8))
* fix loading type in ButtonProps ([#1449](https://github.com/NervJS/taro/issues/1449)) ([65efa56](https://github.com/NervJS/taro/commit/65efa56))


### Features

* **cli:** 各端 alias 支持完善，close [#82](https://github.com/NervJS/taro/issues/82) ([91de6c6](https://github.com/NervJS/taro/commit/91de6c6))
* **cli:** 项目配置中支持添加 pathAlias 配置 import 路径自定义别名 ([#1401](https://github.com/NervJS/taro/issues/1401)) ([83bffe4](https://github.com/NervJS/taro/commit/83bffe4))



<a name="1.2.0-beta.12"></a>
# [1.2.0-beta.12](https://github.com/NervJS/taro/compare/v1.2.0-beta.11...v1.2.0-beta.12) (2018-12-10)


### Bug Fixes

* **cli:** 修复 node_modules 路径与工作目录不一致时，生成 outputNpmPath 异常的问题 ([#1412](https://github.com/NervJS/taro/issues/1412)) ([924ac12](https://github.com/NervJS/taro/commit/924ac12))
* **cli:** 修复引用 node_modules 中的组件路径错误 ([fe29c3b](https://github.com/NervJS/taro/commit/fe29c3b))
* **cli:** 修复组件引用路径解析错误 ([785a123](https://github.com/NervJS/taro/commit/785a123))
* **router:** 修复navigateBack的传参错误，添加错误提示 ([55f9aed](https://github.com/NervJS/taro/commit/55f9aed))
* **router:** 去除没有卵用的404 ([8350ab6](https://github.com/NervJS/taro/commit/8350ab6))
* **taro-swan、taro-aplipay:** props 为 null 时也使用 defaultProps ([015b079](https://github.com/NervJS/taro/commit/015b079))
* **taro-tt:** 头条小程序中 props 为 null 时也使用 defaultProps ([011e90a](https://github.com/NervJS/taro/commit/011e90a))
* **taroize:** 生成 template 组件自我引用时不需要 import 自己 ([7b092e8](https://github.com/NervJS/taro/commit/7b092e8))
* **transformer:** export 匿名类报错 ([9d12a0f](https://github.com/NervJS/taro/commit/9d12a0f))



<a name="1.2.0-beta.11"></a>
# [1.2.0-beta.11](https://github.com/NervJS/taro/compare/v1.2.0-beta.10...v1.2.0-beta.11) (2018-12-08)


### Bug Fixes

* **cli:** 优化h5的entry判断逻辑 ([d21fb6a](https://github.com/NervJS/taro/commit/d21fb6a))
* **cli:** 修复h5 cli中对于页面文件的误判 ([10c07c7](https://github.com/NervJS/taro/commit/10c07c7))
* **cli:** 修复Taro.Component获取不到$router问题 ([6776d57](https://github.com/NervJS/taro/commit/6776d57))
* **cli:** 修复没有routerMode默认值的问题 ([a474c6f](https://github.com/NervJS/taro/commit/a474c6f))
* **cli:** 普通文件如有需要自动引入 Taro ([8f6a3b8](https://github.com/NervJS/taro/commit/8f6a3b8))
* **router:** 为navigateBack添加了默认参数 ([1060514](https://github.com/NervJS/taro/commit/1060514))
* **router:** 修复Taro.redirectTo失效的问题 ([15dea8a](https://github.com/NervJS/taro/commit/15dea8a))
* **tarize:** 针对 template 增加 options 改为 static options ([fec71f5](https://github.com/NervJS/taro/commit/fec71f5))
* **taro-tt:** 兼容头条小程序事件处理 ([56ac2a2](https://github.com/NervJS/taro/commit/56ac2a2))
* **taroize:** ['externalClasses', 'relations', 'options'] 都需要编译成 static ([1862dd1](https://github.com/NervJS/taro/commit/1862dd1))
* **taroize:** 当 props key 已经存在就不需要加入 this.state ([ecd88c2](https://github.com/NervJS/taro/commit/ecd88c2))
* **transformer:** 事件的 properties 不需要加入到 used state ([a33290e](https://github.com/NervJS/taro/commit/a33290e))


### Features

* **cli:** convert 时普通 js 中的调用微信 api 的写法要转成 Taro 写法 ([3c3d57f](https://github.com/NervJS/taro/commit/3c3d57f))
* **taroize:** 当初始 data 和 properies 重复定义键值时报错 ([dda8d3e](https://github.com/NervJS/taro/commit/dda8d3e))
* **taroize:** 所有 template 都继承全局样式 ([6eb3cff](https://github.com/NervJS/taro/commit/6eb3cff))
* **transformer:** 支持 npm run build 时压缩 wxml, close [#1408](https://github.com/NervJS/taro/issues/1408) ([ea4e8a7](https://github.com/NervJS/taro/commit/ea4e8a7))
* **transformer:** 百度小程序某些属性需要用 `= =` 包裹住 ([32627dc](https://github.com/NervJS/taro/commit/32627dc))
* **webpack-runner:** 加入能作用于dll的webpackChain配置 ([352aa96](https://github.com/NervJS/taro/commit/352aa96))



<a name="1.2.0-beta.10"></a>
# [1.2.0-beta.10](https://github.com/NervJS/taro/compare/v1.2.0-beta.9...v1.2.0-beta.10) (2018-12-06)


### Bug Fixes

* **cli:** convert 优化图片处理方式 ([b1c4f3c](https://github.com/NervJS/taro/commit/b1c4f3c))
* **cli:** 支持 convert 组件引用自身 ([42f2a03](https://github.com/NervJS/taro/commit/42f2a03))
* **cli router:** 修复页面组件没有componentDidMount/componentDidShow时不更新页面标题的问题 ([5d079f7](https://github.com/NervJS/taro/commit/5d079f7))
* **mobx:** 修复页面跳转props undefined的问题 ([#1393](https://github.com/NervJS/taro/issues/1393)) ([944f2f4](https://github.com/NervJS/taro/commit/944f2f4))
* **router webpack-runner:** 修复一些问题 ([e83c423](https://github.com/NervJS/taro/commit/e83c423))
* **taro-h5:** 修复router2.0获取不到$router的问题 ([3fd6928](https://github.com/NervJS/taro/commit/3fd6928))
* **taro-rn:** 安卓下 Toast 报错 View nested under Text... ([9fca026](https://github.com/NervJS/taro/commit/9fca026)), closes [/github.com/magicismight/react-native-root-toast/blob/master/lib/ToastContainer.js#L256](https://github.com//github.com/magicismight/react-native-root-toast/blob/master/lib/ToastContainer.js/issues/L256)


### Features

* **cli:** h5端增加copy功能 ([a392ad9](https://github.com/NervJS/taro/commit/a392ad9))
* **cli:** 小程序端支持在 scss 文件中引用 node_modules 中的样式文件 ([aaecb79](https://github.com/NervJS/taro/commit/aaecb79))
* **cli webpack-runner:** 为页面文件添加了文件名 ([23c1628](https://github.com/NervJS/taro/commit/23c1628))
* **cli webpack-runner router components:** h5的一些更新 ([3fedd67](https://github.com/NervJS/taro/commit/3fedd67))
* **router:** h5 router功能初步重构完成 ([599b0cc](https://github.com/NervJS/taro/commit/599b0cc))
* **taroize:** 支持直接用 this.foo 表示 class 计算属性 `foo`, close [#1381](https://github.com/NervJS/taro/issues/1381) ([66424fd](https://github.com/NervJS/taro/commit/66424fd))


### Reverts

* **taro-h5:** h5 request 请求不设置默认 content-type ([ae5c42b](https://github.com/NervJS/taro/commit/ae5c42b))



<a name="1.2.0-beta.9"></a>
# [1.2.0-beta.9](https://github.com/NervJS/taro/compare/v1.2.0-beta.8...v1.2.0-beta.9) (2018-12-05)



<a name="1.2.0-beta.8"></a>
# [1.2.0-beta.8](https://github.com/NervJS/taro/compare/v1.2.0-beta.7...v1.2.0-beta.8) (2018-12-05)


### Bug Fixes

* **cli:** add "allowjs": true to tsconfig.json fix [#1332](https://github.com/NervJS/taro/issues/1332) ([#1340](https://github.com/NervJS/taro/issues/1340)) ([4bae06f](https://github.com/NervJS/taro/commit/4bae06f))
* **cli:** taroize 转换时 tabbar 图片处理 ([5c8ca3a](https://github.com/NervJS/taro/commit/5c8ca3a))
* **cli:** taroize 转换时转换目录保留 node_modules 目录 ([0c894bd](https://github.com/NervJS/taro/commit/0c894bd))
* **cli:** taroize 转换样式中依赖样式时，支持绝对路径 ([4312bf2](https://github.com/NervJS/taro/commit/4312bf2))
* **cli:** taroize 转换避免 copy 同样的图片文件 ([3b4fbe9](https://github.com/NervJS/taro/commit/3b4fbe9))
* **cli:** typescript 模式下显示 Taro 未被使用，close [#1332](https://github.com/NervJS/taro/issues/1332) ([c7a50a6](https://github.com/NervJS/taro/commit/c7a50a6))
* **cli:** 修复config.root为stringLiteral类型时的bug ([68b24f2](https://github.com/NervJS/taro/commit/68b24f2))
* **cli:** 组件依赖 node_modules 组件时依赖解析错误 ([c968e60](https://github.com/NervJS/taro/commit/c968e60))
* **mobx:** 修复小程序HOC中无法获取inject props的问题([#1313](https://github.com/NervJS/taro/issues/1313)) ([#1379](https://github.com/NervJS/taro/issues/1379)) ([e7eda61](https://github.com/NervJS/taro/commit/e7eda61))
* **taro-alipay:** setData 触发的 didUpdate 不需要更新组件 ([34e2c47](https://github.com/NervJS/taro/commit/34e2c47))
* **taro-components:** 修复 picker 组件更新问题 close [#731](https://github.com/NervJS/taro/issues/731) close [#1157](https://github.com/NervJS/taro/issues/1157) ([febc6ff](https://github.com/NervJS/taro/commit/febc6ff))
* **taro-components:** 修复RadioGroup返回给 onChange事件是undefined close [#985](https://github.com/NervJS/taro/issues/985) ([0823f59](https://github.com/NervJS/taro/commit/0823f59))
* **taro-components:** 修复Taro的Picker组件的输入输出行为和微信小程序的不一致 close [#1281](https://github.com/NervJS/taro/issues/1281) ([ac77c87](https://github.com/NervJS/taro/commit/ac77c87))
* **taroize:**  class 内部 wx. 开头的函数不会转换为 Taro.func() ([5d01b3c](https://github.com/NervJS/taro/commit/5d01b3c))
* **taroize:** export default 和装饰器混用导致 babel 解析失败 ([146e6c6](https://github.com/NervJS/taro/commit/146e6c6))
* **taroize:** 不转换 Component.methods 的方法 ([b745bfe](https://github.com/NervJS/taro/commit/b745bfe))
* **taroize:** 多个 wx:elif 嵌套无效 ([c6d6b93](https://github.com/NervJS/taro/commit/c6d6b93))
* **taroize:** 带空格的字符串经过 babel-template 处理会报错 ([eeb3f74](https://github.com/NervJS/taro/commit/eeb3f74))
* **taroize:** 循环的 item 和 index 不会加入 state ([183f8eb](https://github.com/NervJS/taro/commit/183f8eb))
* **taroize:** 支持所有 wxparse 式的对象 alias 写法 ([a1187f5](https://github.com/NervJS/taro/commit/a1187f5))
* **transformer:** 由 taroize 转出来的组件不需要 internal_style 函数 ([f5ded7a](https://github.com/NervJS/taro/commit/f5ded7a))
* **types:** 去除未使用的引用，close [#1326](https://github.com/NervJS/taro/issues/1326) ([1d0efe3](https://github.com/NervJS/taro/commit/1d0efe3))
* **webpack-runner:** windows 下处理 esnextModules 路径错误 ([207dec1](https://github.com/NervJS/taro/commit/207dec1))
* **with-weapp:** Page.onLoad 的第一个参数是路由器参数 ([ec80886](https://github.com/NervJS/taro/commit/ec80886))
* **with-weapp:** setData 更新数据同步，渲染异步 ([717f7b2](https://github.com/NervJS/taro/commit/717f7b2))


### Features

* **cli:** taroize 转换图片链接为网络图片时不做处理 ([5cf347b](https://github.com/NervJS/taro/commit/5cf347b))
* **cli:** taroize 转换时 jsx 中引用图片处理 ([d608d8c](https://github.com/NervJS/taro/commit/d608d8c))
* **cli:** taroize 转换时入口文件增加 H5 端的初始化，close [#1329](https://github.com/NervJS/taro/issues/1329) ([01e97e2](https://github.com/NervJS/taro/commit/01e97e2))
* **cli:** taroize 转换样式文件处理，尺寸单位转换 ([083ec58](https://github.com/NervJS/taro/commit/083ec58))
* **cli:** 支持编译 node_modules 中的包，close [#1358](https://github.com/NervJS/taro/issues/1358) ([8514833](https://github.com/NervJS/taro/commit/8514833))
* **taroize:** 使用 JavaScript 保留字循环报错 ([2a81b6d](https://github.com/NervJS/taro/commit/2a81b6d))
* **taroize:** 在类中调用 微信钩子函数转换为相应地 Taro 钩子函数 ([e4d9e67](https://github.com/NervJS/taro/commit/e4d9e67))
* **taroize:** 支持 wxParse 的 alias 写法 ([3f95b44](https://github.com/NervJS/taro/commit/3f95b44))
* **taroize:** 改进报错信息 ([93ec0d8](https://github.com/NervJS/taro/commit/93ec0d8))
* **taroize:** 转换 slot 为 this.props.children ([4a79cbd](https://github.com/NervJS/taro/commit/4a79cbd))



<a name="1.2.0-beta.7"></a>
# [1.2.0-beta.7](https://github.com/NervJS/taro/compare/v1.2.0-beta.6...v1.2.0-beta.7) (2018-12-02)


### Bug Fixes

* **cli:** 修复小程序以及RN下decorator在class property无效的问题 ([0dafcda](https://github.com/NervJS/taro/commit/0dafcda))
* **eslint:** JSX 事件名命名误报，close [#1295](https://github.com/NervJS/taro/issues/1295) ([3a6c822](https://github.com/NervJS/taro/commit/3a6c822))
* **taroize:** 处理 data 未被预先定义又在 wxml 使用的情况 ([ec6372d](https://github.com/NervJS/taro/commit/ec6372d))
* **taroize:** 当只有一个 wx:for-item 也可以触发遍历 ([d9dc968](https://github.com/NervJS/taro/commit/d9dc968))
* **transformer:** render props 嵌套解析失败，close [#1306](https://github.com/NervJS/taro/issues/1306) ([a2ef2bb](https://github.com/NervJS/taro/commit/a2ef2bb))
* **webpack-runner:** 修复部分配置覆盖错误的问题 ([08a70f3](https://github.com/NervJS/taro/commit/08a70f3))


### Features

* **cli:** Watch时也能支持压缩 ([#1219](https://github.com/NervJS/taro/issues/1219)) ([ccb05b1](https://github.com/NervJS/taro/commit/ccb05b1))
* **cli:** 优化 ui 库样式处理 ([1c7f615](https://github.com/NervJS/taro/commit/1c7f615))
* **cli:** 支持自定义输出文件类型 ([c56f9fc](https://github.com/NervJS/taro/commit/c56f9fc))
* **webpack-runner:** 增加了对esnextmodules内样式文件的处理 ([747f653](https://github.com/NervJS/taro/commit/747f653))



<a name="1.2.0-beta.6"></a>
# [1.2.0-beta.6](https://github.com/NervJS/taro/compare/v1.2.0-beta.5...v1.2.0-beta.6) (2018-11-30)


### Bug Fixes

* **cli:** 第三方包路径替换错误，close [#1308](https://github.com/NervJS/taro/issues/1308) ([2d4b8ea](https://github.com/NervJS/taro/commit/2d4b8ea))
* **taro-rn:** 修复打包独立应用启动报错：未注册 main, fix [#1225](https://github.com/NervJS/taro/issues/1225) ([636f355](https://github.com/NervJS/taro/commit/636f355))



<a name="1.2.0-beta.5"></a>
# [1.2.0-beta.5](https://github.com/NervJS/taro/compare/v1.2.0-beta.4...v1.2.0-beta.5) (2018-11-29)


### Bug Fixes

* **cli:** 编译到支付宝小程序 npm 依赖带 @ 的npm 包时路径没有替换，closes [#1234](https://github.com/NervJS/taro/issues/1234), closes [#1290](https://github.com/NervJS/taro/issues/1290) ([defa3ce](https://github.com/NervJS/taro/commit/defa3ce))
* **CLI:** installNpmPkg 方法中添加 Yarn 安装的方式 ([41a9b77](https://github.com/NervJS/taro/commit/41a9b77))
* **RN:**  [@tarojs](https://github.com/tarojs)/plugin-sass 包未安装时样式文件不生成的问题 ([21107dc](https://github.com/NervJS/taro/commit/21107dc))
* **taro-alipay:** 支付宝小程序网络请求设置默认 content-type, close [#1291](https://github.com/NervJS/taro/issues/1291) ([10d1a72](https://github.com/NervJS/taro/commit/10d1a72))
* **taro-compontents:** 修复 swiper 问题，发布新版 close [#1261](https://github.com/NervJS/taro/issues/1261) [#1204](https://github.com/NervJS/taro/issues/1204) [#1190](https://github.com/NervJS/taro/issues/1190) [#1071](https://github.com/NervJS/taro/issues/1071) ([afb2bc8](https://github.com/NervJS/taro/commit/afb2bc8))
* **taro-h5:** h5 网络请求设置默认 content-type, close [#1280](https://github.com/NervJS/taro/issues/1280) ([103f730](https://github.com/NervJS/taro/commit/103f730))
* **taroize:** 当 wx:for 的父级是 block 编译时失败, close [#1303](https://github.com/NervJS/taro/issues/1303) ([d2ffe31](https://github.com/NervJS/taro/commit/d2ffe31))
* **taroize:** 找不到小程序组件实例无法生成 wxml ([205f784](https://github.com/NervJS/taro/commit/205f784))
* **transformer:** 所有 ref 都被当成 loop ref 来处理 ([18cd99c](https://github.com/NervJS/taro/commit/18cd99c))


### Features

* simple ID generate for every swiper instance. ([b29db89](https://github.com/NervJS/taro/commit/b29db89))
* **cli:** ui 库打包优化 ([320f80c](https://github.com/NervJS/taro/commit/320f80c))
* **cli:** 监听非 源码目录 ([#1242](https://github.com/NervJS/taro/issues/1242)) ([8c8e871](https://github.com/NervJS/taro/commit/8c8e871))
* **mobx:** Mobx优化 ([#1276](https://github.com/NervJS/taro/issues/1276)) ([138c282](https://github.com/NervJS/taro/commit/138c282)), closes [#1262](https://github.com/NervJS/taro/issues/1262)
* **transformer:** 支持在 switch-case 中使用 JSX，close [#1275](https://github.com/NervJS/taro/issues/1275) ([82a6100](https://github.com/NervJS/taro/commit/82a6100))
* **webpack-runner:** h5支持esnextModules配置 ([2b759b5](https://github.com/NervJS/taro/commit/2b759b5))



<a name="1.2.0-beta.4"></a>
# [1.2.0-beta.4](https://github.com/NervJS/taro/compare/v1.2.0-beta.3...v1.2.0-beta.4) (2018-11-28)


### Bug Fixes

* **cli:** 当配置 npm 目录时路径替换可能不正确 ([3974aaf](https://github.com/NervJS/taro/commit/3974aaf))
* **cli:** 编译到支付宝时路径中的 @ 替换为 _ ([d09cc2d](https://github.com/NervJS/taro/commit/d09cc2d))
* **router:** 修复router打包后仍存在部分非法关键字的问题 ([3d6e5e8](https://github.com/NervJS/taro/commit/3d6e5e8))
* generateScopedName ([#1286](https://github.com/NervJS/taro/issues/1286)) ([00e288b](https://github.com/NervJS/taro/commit/00e288b))
* **router-h5:** iOS12里面返回Hash会丢问题 ([#1285](https://github.com/NervJS/taro/issues/1285)) ([1bceea3](https://github.com/NervJS/taro/commit/1bceea3))
* **taro-rn:** 更改taro-rn的导出方式,close[#1238](https://github.com/NervJS/taro/issues/1238) ([cac3010](https://github.com/NervJS/taro/commit/cac3010))
* **taro-weapp:** 增加 getElementById 函数供编译时在循环中获取 ref 节点使用 ([a52fdc4](https://github.com/NervJS/taro/commit/a52fdc4))


### Features

* **transformer:** 当自定义组件需要组织冒泡时加入 `data-e-stop` ([cee4462](https://github.com/NervJS/taro/commit/cee4462))
* **transformer:** 支持在循环中使用 ref ([292c945](https://github.com/NervJS/taro/commit/292c945))



<a name="1.2.0-beta.3"></a>
# [1.2.0-beta.3](https://github.com/NervJS/taro/compare/v1.2.0-beta.2...v1.2.0-beta.3) (2018-11-26)


### Bug Fixes

* **taro:** 修复多个小程序 request 请求 abort 的 露出方式 ([527d168](https://github.com/NervJS/taro/commit/527d168))
* **taro:** 百度/支付宝/头条小程序运行时框架同步微信小程序员运行时框架修改 && 部分 eslint 问题修复 ([528735f](https://github.com/NervJS/taro/commit/528735f))
* **taro-weapp:** 修复request abort的暴露方式 ([9eb0bf4](https://github.com/NervJS/taro/commit/9eb0bf4))
* **taro-weapp:** 修复request abort的暴露方式 ([43c23a9](https://github.com/NervJS/taro/commit/43c23a9))
* **taro-weapp:** 修复requestTask的调用方式 ([a0cb8d3](https://github.com/NervJS/taro/commit/a0cb8d3))
* **taro-weapp:** 修复requestTask的调用方式 ([a06f33c](https://github.com/NervJS/taro/commit/a06f33c))
* **taro-wepaa:** 修复request abort的暴露方式 ([b2c035c](https://github.com/NervJS/taro/commit/b2c035c))
* **transformer:** 如果多层循环的 callee 是函数编译错误，[#1223](https://github.com/NervJS/taro/issues/1223) ([46e70a8](https://github.com/NervJS/taro/commit/46e70a8))
* **transformer:** 字符串模板会被转换为 unicode，close [#1245](https://github.com/NervJS/taro/issues/1245) ([a783d36](https://github.com/NervJS/taro/commit/a783d36))
* **transformer:** 循环中定义的 JSX 无法正确处理 callee，close [#1223](https://github.com/NervJS/taro/issues/1223) ([ecb0584](https://github.com/NervJS/taro/commit/ecb0584))
* **transformer-wx:** 修复编译器适配类型 ([486e33a](https://github.com/NervJS/taro/commit/486e33a))


### Features

* **cli:** redux 模板加入 redux-devtools 配置，close [#1246](https://github.com/NervJS/taro/issues/1246) ([472ced8](https://github.com/NervJS/taro/commit/472ced8))
* **cli:** 头条小程序根据 project.tt.json 生成项目配置文件 ([731cf48](https://github.com/NervJS/taro/commit/731cf48))
* **cli:** 头条小程序编译适配 ([7991846](https://github.com/NervJS/taro/commit/7991846))
* **taro-h5:** 新增简化版chooseImage api ([e4724d0](https://github.com/NervJS/taro/commit/e4724d0))
* **taro-tt:** 增加头条小程序运行时适配框架 ([9296268](https://github.com/NervJS/taro/commit/9296268))



<a name="1.2.0-beta.2"></a>
# [1.2.0-beta.2](https://github.com/NervJS/taro/compare/v1.2.0-beta.1...v1.2.0-beta.2) (2018-11-23)


### Bug Fixes

* **taro-cli:** 解决组件循环依赖不断编译爆栈的问题 fix [#696](https://github.com/NervJS/taro/issues/696) ([e735cb3](https://github.com/NervJS/taro/commit/e735cb3))
* node-sass 编译有时候无输出的 bug ([e011610](https://github.com/NervJS/taro/commit/e011610))
* **showActionSheet:** fix未设置webkitTransform导致菜单不能弹出的bug ([#1217](https://github.com/NervJS/taro/issues/1217)) ([0f7678f](https://github.com/NervJS/taro/commit/0f7678f))
* **taro-alipay:** 修复 removeStorageSync fix [#1207](https://github.com/NervJS/taro/issues/1207) ([638c3fb](https://github.com/NervJS/taro/commit/638c3fb))
* **taro-alipay:** 修复支付宝小程序 query 对象没有 in 方法的问题 fix [#1224](https://github.com/NervJS/taro/issues/1224) ([ff2d6f0](https://github.com/NervJS/taro/commit/ff2d6f0))
* **taro-redux:** store 变化后被影响的 Component 立即做 setData 更新。防止子组件在 observe 更新的情况下重新计算 props ，从而覆盖掉 redux 修改的 props。fix [#1125](https://github.com/NervJS/taro/issues/1125) ([375ab1d](https://github.com/NervJS/taro/commit/375ab1d))
* **transformer:** 在同一文件中重复 import, close [#1208](https://github.com/NervJS/taro/issues/1208) ([3e0b82f](https://github.com/NervJS/taro/commit/3e0b82f))
* **transformer:** 当 if block 中有 JSX 定义而不是 return，不会重命名 ([341101a](https://github.com/NervJS/taro/commit/341101a)), closes [#1209](https://github.com/NervJS/taro/issues/1209)
* **transformer:** 生成匿名数组需要带上父组件的条件判断, close [#1228](https://github.com/NervJS/taro/issues/1228) ([4ebd214](https://github.com/NervJS/taro/commit/4ebd214))
* **webpack-runner:** H5 端 postcss 插件 bug 修复 ([6793ce2](https://github.com/NervJS/taro/commit/6793ce2))
* **webpack-runner:** 修复h5样式丢失的问题 ([64d8cc4](https://github.com/NervJS/taro/commit/64d8cc4))


### Features

* **taro:** add getAccountInfoSync API fix [#1222](https://github.com/NervJS/taro/issues/1222) ([1c0894d](https://github.com/NervJS/taro/commit/1c0894d))
* **taro-components:** 修改 Swiper 组件 ([a2e80ca](https://github.com/NervJS/taro/commit/a2e80ca))
* **taro-h5:** 新增 setNavigationBarTitle api ([f5523cc](https://github.com/NervJS/taro/commit/f5523cc))
* **transformer:** 加入头条小程序适配器 ([1a17207](https://github.com/NervJS/taro/commit/1a17207))
* **transformer:** 支持多层 if 语句嵌套, close [#1036](https://github.com/NervJS/taro/issues/1036) ([8931734](https://github.com/NervJS/taro/commit/8931734))



<a name="1.2.0-beta.1"></a>
# [1.2.0-beta.1](https://github.com/NervJS/taro/compare/v1.2.0-beta.0...v1.2.0-beta.1) (2018-11-22)



<a name="1.2.0-beta.0"></a>
# [1.2.0-beta.0](https://github.com/NervJS/taro/compare/v1.1.9...v1.2.0-beta.0) (2018-11-22)


### Bug Fixes

* **cli:** convertor js 重复拷贝文件 ([ee0122e](https://github.com/NervJS/taro/commit/ee0122e))
* **cli:** convertor 文件转换报错 ([c1b3c81](https://github.com/NervJS/taro/commit/c1b3c81))
* **cli:** taroize 转换依赖组件路径允许为项目下的绝对路径 ([4cbe987](https://github.com/NervJS/taro/commit/4cbe987))
* **cli:** taroize 转换组件依赖读取错误 ([93ef18a](https://github.com/NervJS/taro/commit/93ef18a))
* **eslint:** 允许对 this.props.children 使用逻辑/条件表达式，close [#1195](https://github.com/NervJS/taro/issues/1195) ([e80eaa6](https://github.com/NervJS/taro/commit/e80eaa6))
* **h5:** 修复selectorQuery.in 在H5平台上不支持的问题 ([#1188](https://github.com/NervJS/taro/issues/1188)) ([9cd8340](https://github.com/NervJS/taro/commit/9cd8340))
* **taro-components-rn:** Button组件可嵌套View组件 ([37fa493](https://github.com/NervJS/taro/commit/37fa493))
* **taro-components-rn:** 销毁组件前，从内存 unload 音频 ([ec6978f](https://github.com/NervJS/taro/commit/ec6978f))
* **taro-components-rn:** 音频5倍速，图片导致的性能问题 ([ad66af3](https://github.com/NervJS/taro/commit/ad66af3))
* **taro-components-rn:** 音频播放速率写死5了 ([b413f67](https://github.com/NervJS/taro/commit/b413f67))
* **taro-weapp:** 修复父组件 setState null 时，传到子组件时被过滤掉的问题 fix [#1151](https://github.com/NervJS/taro/issues/1151) ([0ec931d](https://github.com/NervJS/taro/commit/0ec931d))
* **taro-weapp:** 小程序 diff 在新对象缺失旧对象的某些属性时，不再递归 diff，而是直接赋值。fix [#1058](https://github.com/NervJS/taro/issues/1058) ([adbc78d](https://github.com/NervJS/taro/commit/adbc78d))
* **taro-weapp:** 小程序每次 setData 都独立生成一个 callback 数组，防止污染 fix [#1185](https://github.com/NervJS/taro/issues/1185) ([e7d1190](https://github.com/NervJS/taro/commit/e7d1190))
* **taro-weapp:** 给request api暴露abort方法([#1178](https://github.com/NervJS/taro/issues/1178)) ([84315ea](https://github.com/NervJS/taro/commit/84315ea))
* **taroize:**  当 children 有空格的情况 ([3f58c90](https://github.com/NervJS/taro/commit/3f58c90))
* **taroize:** if 嵌套报错 ([a841c88](https://github.com/NervJS/taro/commit/a841c88))
* **taroize:** npm 包文件缺失 ([030ee5c](https://github.com/NervJS/taro/commit/030ee5c))
* **taroize:** 不再忽略 async/await ([01c5f7c](https://github.com/NervJS/taro/commit/01c5f7c))
* **taroize:** 使用组件重复添加 ([1905fe7](https://github.com/NervJS/taro/commit/1905fe7))
* **taroize:** 取消 this.state 的缓存 ([bd25e53](https://github.com/NervJS/taro/commit/bd25e53))
* **taroize:** 正则无法匹配 ... 语法失败 ([2ccff88](https://github.com/NervJS/taro/commit/2ccff88))
* **taroize:** 没有 data 时报错 ([de2e1bd](https://github.com/NervJS/taro/commit/de2e1bd))
* **taroize:** 注释嵌套编译报错 ([149d819](https://github.com/NervJS/taro/commit/149d819))
* **taroize:** 注释或空的 text 节点导致编译错误 ([484f226](https://github.com/NervJS/taro/commit/484f226))
* **taroize:** 生命周期 typo ([1acf465](https://github.com/NervJS/taro/commit/1acf465))
* **taroize:** 生命周期是对象函数缩写时报错 ([ae22233](https://github.com/NervJS/taro/commit/ae22233))
* **taroize:** 生成文件没有import [@tarojs](https://github.com/tarojs)/with-weapp ([f028bfe](https://github.com/NervJS/taro/commit/f028bfe))
* **tarozie:** props 需要在 render 结构 ([46736d8](https://github.com/NervJS/taro/commit/46736d8))
* **transformer:**  globalData 无效的问题 ([167c386](https://github.com/NervJS/taro/commit/167c386))
* **transformer:** state ，props ，自定义变量组件名重复，close [#411](https://github.com/NervJS/taro/issues/411), close [#109](https://github.com/NervJS/taro/issues/109) ([0383991](https://github.com/NervJS/taro/commit/0383991))
* **transformer:** 循环嵌套报错 ([720c36d](https://github.com/NervJS/taro/commit/720c36d))
* **with-weapp:** 装饰器参数为`Component` ([495ca99](https://github.com/NervJS/taro/commit/495ca99))


### Features

* **cli:** support css module feature ([#1007](https://github.com/NervJS/taro/issues/1007)) ([9fb6747](https://github.com/NervJS/taro/commit/9fb6747))
* **cli:** 优化小程序端 css modules 处理 ([be844ed](https://github.com/NervJS/taro/commit/be844ed))
* **cli:** 增加 taro convert 命令 ([8d7fb7e](https://github.com/NervJS/taro/commit/8d7fb7e))
* **cli:** 处理 imports ([4438582](https://github.com/NervJS/taro/commit/4438582))
* **cli:** 小程序转 taro 代码 wxs 文件处理 ([519b0f5](https://github.com/NervJS/taro/commit/519b0f5))
* **cli:** 小程序转 taro 处理组件以及样式依赖 ([c56d546](https://github.com/NervJS/taro/commit/c56d546))
* **cli:** 小程序转 Taro 文件引用关系处理 ([1369688](https://github.com/NervJS/taro/commit/1369688))
* **cli:** 小程序转 taro 组件依赖转换为 taro 写法 ([3e74142](https://github.com/NervJS/taro/commit/3e74142))
* **cli:** 小程序转 taro 补充配置文件生成 ([02f92ef](https://github.com/NervJS/taro/commit/02f92ef))
* **mobx:** 加入mobx支持 ([#972](https://github.com/NervJS/taro/issues/972)) ([cfa2978](https://github.com/NervJS/taro/commit/cfa2978))
* **taro-components-rn:** 新增组件 Map ([0f0e97b](https://github.com/NervJS/taro/commit/0f0e97b))
* **taro-weapp:** 增加 this.$componentType 来判断当前 Taro.Component 是页面还是组件 fix [#1166](https://github.com/NervJS/taro/issues/1166) ([b35d1bd](https://github.com/NervJS/taro/commit/b35d1bd))
* **taroize:**  `properties` 可以转化为 `defaultProps` ([66d691b](https://github.com/NervJS/taro/commit/66d691b))
* **taroize:**  不再移除 JSX 的注释 ([86cec7a](https://github.com/NervJS/taro/commit/86cec7a))
* **taroize:** class 带上 withWeapp 装饰器 ([215b8c0](https://github.com/NervJS/taro/commit/215b8c0))
* **taroize:** json/script/wxml 均可传空值 ([902c697](https://github.com/NervJS/taro/commit/902c697))
* **taroize:** render 函数和 parseWxml 结合 ([de8f5ae](https://github.com/NervJS/taro/commit/de8f5ae))
* **taroize:** setData polyfill ([a656632](https://github.com/NervJS/taro/commit/a656632))
* **taroize:** 事件名需要加 this ([0dadefa](https://github.com/NervJS/taro/commit/0dadefa))
* **taroize:** 加入 index.js 导出项目 ([9a19b33](https://github.com/NervJS/taro/commit/9a19b33))
* **taroize:** 增加 taro convert 文件 ([fbcade2](https://github.com/NervJS/taro/commit/fbcade2))
* **taroize:** 处理端能力 API ([cd5b756](https://github.com/NervJS/taro/commit/cd5b756))
* **taroize:** 支持 App() 入口文件 ([47a7103](https://github.com/NervJS/taro/commit/47a7103))
* **taroize:** 支持 template::import ([f9db8e5](https://github.com/NervJS/taro/commit/f9db8e5))
* **taroize:** 支持 template::include ([fca9a88](https://github.com/NervJS/taro/commit/fca9a88))
* **taroize:** 支持 template::is 使用组件 ([5ac9bac](https://github.com/NervJS/taro/commit/5ac9bac))
* **taroize:** 支持 wxml 不传入标签 ([e9b1632](https://github.com/NervJS/taro/commit/e9b1632))
* **taroize:** 支持 wxs ([061311c](https://github.com/NervJS/taro/commit/061311c))
* **taroize:** 支持使用 template::name 声明组件 ([0167dd3](https://github.com/NervJS/taro/commit/0167dd3))
* **taroize:** 支持内联 wxs module, close [#1000](https://github.com/NervJS/taro/issues/1000) ([777b528](https://github.com/NervJS/taro/commit/777b528))
* **taroize:** 支持编译组件 ([8374d4e](https://github.com/NervJS/taro/commit/8374d4e))
* **taroize:** 支持解析 config.json ([efa50cc](https://github.com/NervJS/taro/commit/efa50cc))
* **taroize:** 支持解析多个根节点的 wxml ([074aaff](https://github.com/NervJS/taro/commit/074aaff))
* **transformer:** 支持 parse wxml 的 Text 类型和 Coment 类型 ([a3f81ca](https://github.com/NervJS/taro/commit/a3f81ca))
* **transformer:** 支持转换循环 ([86c1f70](https://github.com/NervJS/taro/commit/86c1f70))
* **webpack-runner:** h5支持cssModules ([e463300](https://github.com/NervJS/taro/commit/e463300))
* **webpack-runner:** h5支持自定义postcss插件 ([2c92757](https://github.com/NervJS/taro/commit/2c92757))
* **with-weapp:** 支持 globalData ([2a387bf](https://github.com/NervJS/taro/commit/2a387bf))
* **with-weapp:** 支持 properties::observer ([dad17ef](https://github.com/NervJS/taro/commit/dad17ef))
* **with-weapp:** 更新 rollup 配置 ([3ec46b4](https://github.com/NervJS/taro/commit/3ec46b4))
* **wx-to-taro:** 处理特殊键值 ([0a8475d](https://github.com/NervJS/taro/commit/0a8475d))
* **wx-to-taro:** 支持复杂的 if 的表达式 ([718663e](https://github.com/NervJS/taro/commit/718663e))
* **wx-to-taro:** 解析 attr ([5220f86](https://github.com/NervJS/taro/commit/5220f86))
* **wx-to-taro:** 解析 Page 页面 ([053e605](https://github.com/NervJS/taro/commit/053e605))



<a name="1.1.9"></a>
## [1.1.9](https://github.com/NervJS/taro/compare/v1.1.8...v1.1.9) (2018-11-19)


### Bug Fixes

* **cli:** 支付宝小程序上传时不支持文件名中带 @ 字符，close [#1031](https://github.com/NervJS/taro/issues/1031) ([b7b2330](https://github.com/NervJS/taro/commit/b7b2330))
* **transformer:** 二维数组在小程序也需要当成复杂表达式处理，close [#1145](https://github.com/NervJS/taro/issues/1145) ([5e1ab5c](https://github.com/NervJS/taro/commit/5e1ab5c))
* **types:** detail 可根据需要定义 ([#1158](https://github.com/NervJS/taro/issues/1158)) ([1428d18](https://github.com/NervJS/taro/commit/1428d18))
* **typing:** 表单系列组件没有 `name` 属性 ([#1168](https://github.com/NervJS/taro/issues/1168)) ([404c21f](https://github.com/NervJS/taro/commit/404c21f))


### Features

* **cli:** 支持百度小程序等端的项目配置文件 ([bfc1ae4](https://github.com/NervJS/taro/commit/bfc1ae4))



<a name="1.1.8"></a>
## [1.1.8](https://github.com/NervJS/taro/compare/v1.1.7...v1.1.8) (2018-11-15)


### Bug Fixes

* **cli:** 修复 H5 及 RN 环境变量替换 ([0f26bb8](https://github.com/NervJS/taro/commit/0f26bb8))
* **RN:** 修复 onPullDownRefresh 的 this 指向的问题 ([a21e201](https://github.com/NervJS/taro/commit/a21e201))
* **taro:** 补全showActionSheet类型参数 ([#1139](https://github.com/NervJS/taro/issues/1139)) ([1dc4751](https://github.com/NervJS/taro/commit/1dc4751))
* **taro-components:** 修复 Image组件的 onClick 事件在h5中点击事件没有反应 close [#794](https://github.com/NervJS/taro/issues/794) ([92bbcc1](https://github.com/NervJS/taro/commit/92bbcc1))
* **taro-components-rn:** Image width: 100% 与 widthFix 使得高度为0 ([5b1ed51](https://github.com/NervJS/taro/commit/5b1ed51))
* **taro-components-rn:** Image 空串导致的错误 ([69ab497](https://github.com/NervJS/taro/commit/69ab497))
* **taro-components-rn:** StyleSheet style reference 的含有样式应先flatten才能读取 ([766ba8b](https://github.com/NervJS/taro/commit/766ba8b))
* **taro-components-rn:** 修复widthFix时默认取了stretch，props.src 为状态变量时，图片无法刷出 ([9fec1d4](https://github.com/NervJS/taro/commit/9fec1d4))
* **taro-compontens:** 修复 Textarea onInput 问题，对齐maxLength 属性值 ([1d75d47](https://github.com/NervJS/taro/commit/1d75d47))
* **taro-rn:** 修复 toast 相关 API 引用的问题 ([872d9bd](https://github.com/NervJS/taro/commit/872d9bd))


### Features

* **eslint:** 新规则：render-props ([3d634d3](https://github.com/NervJS/taro/commit/3d634d3))
* **taro-components-rn:** 去掉安卓下 Input 的输入下划线 ([8f81013](https://github.com/NervJS/taro/commit/8f81013))
* **taro-components-rn:** 新增组件 Audio ([0abe985](https://github.com/NervJS/taro/commit/0abe985))
* **transformer:** 支持 render props ([2b87404](https://github.com/NervJS/taro/commit/2b87404))
* **weapp:**  支持 multipleSlots ([2e4e8a4](https://github.com/NervJS/taro/commit/2e4e8a4))



<a name="1.1.7"></a>
## [1.1.7](https://github.com/NervJS/taro/compare/v1.1.6...v1.1.7) (2018-11-14)


### Bug Fixes

* **cli:** 回退使用 babel-plugin-remove-dead-code 插件 ([02fc89a](https://github.com/NervJS/taro/commit/02fc89a))



<a name="1.1.6"></a>
## [1.1.6](https://github.com/NervJS/taro/compare/v1.1.5...v1.1.6) (2018-11-14)


### Bug Fixes

* **cli:** 配置参数少了一个逗号, close [#1114](https://github.com/NervJS/taro/issues/1114) ([3cad1fb](https://github.com/NervJS/taro/commit/3cad1fb))
* **taro:** fix Taro.uploadFile() ([#1115](https://github.com/NervJS/taro/issues/1115)) ([23e7c0b](https://github.com/NervJS/taro/commit/23e7c0b))
* **transformer:** 循环中 bind 成员表达式失败 ([cc4e471](https://github.com/NervJS/taro/commit/cc4e471))
* **transformer:** 自定义组件 bind 会生成匿名 state ([4be9fd1](https://github.com/NervJS/taro/commit/4be9fd1))


### Features

* **cli:** 支持根据条件 require 需要的文件 ([b0b6824](https://github.com/NervJS/taro/commit/b0b6824))
* **transformer:** 使用 fork 的 babel  remove dead  插件 ([f35c756](https://github.com/NervJS/taro/commit/f35c756))



<a name="1.1.5"></a>
## [1.1.5](https://github.com/NervJS/taro/compare/v1.1.4...v1.1.5) (2018-11-13)


### Bug Fixes

* **cli:** postcss 插件读取方式修改 ([4c1de79](https://github.com/NervJS/taro/commit/4c1de79))
* **cli:** UI 编译支持 import，close [#1030](https://github.com/NervJS/taro/issues/1030) ([b8452ce](https://github.com/NervJS/taro/commit/b8452ce))
* **cli:** 分包字段同时支持 subpackages && subPackages，close [#1042](https://github.com/NervJS/taro/issues/1042) ([3b7000b](https://github.com/NervJS/taro/commit/3b7000b))
* **eslint:** 允许 this.props.dispatch, close [#1006](https://github.com/NervJS/taro/issues/1006) ([8a82e18](https://github.com/NervJS/taro/commit/8a82e18))
* **h5:** 修复 Taro.request 不带参数时附加 ? 导致请求错误的 bug，close [#1070](https://github.com/NervJS/taro/issues/1070) ([f250eb3](https://github.com/NervJS/taro/commit/f250eb3))
* **scroll-view:** 修复动画bug ([49d4b64](https://github.com/NervJS/taro/commit/49d4b64))
* **taro:** 还原小程序的表单组件为非受控组件 ([a628d0c](https://github.com/NervJS/taro/commit/a628d0c))
* **taro-components:** Input组件在h5模式下ios自带输入法中文模式下的问题 close [#601](https://github.com/NervJS/taro/issues/601) ([e56321f](https://github.com/NervJS/taro/commit/e56321f))
* **taro-components:** Swiper组件动态传递current无法跳转到指定item，close [#639](https://github.com/NervJS/taro/issues/639) ([b317e3b](https://github.com/NervJS/taro/commit/b317e3b))
* **taro-components-rn:** 修复View的onClick无法触发问题 ([39410bf](https://github.com/NervJS/taro/commit/39410bf))
* **taro-compontens:** Input focus 属性 路由跳转后失效 close [#925](https://github.com/NervJS/taro/issues/925) ([e7c3409](https://github.com/NervJS/taro/commit/e7c3409))
* **taro-compontens:** Input组件onConfirm事件无效，close [#654](https://github.com/NervJS/taro/issues/654) ([00c79d9](https://github.com/NervJS/taro/commit/00c79d9))
* **taro-weapp:** fix [#1009](https://github.com/NervJS/taro/issues/1009) ([faea412](https://github.com/NervJS/taro/commit/faea412))
* **taro-weapp:** pageLifetimes 提供初始值 ([999d74f](https://github.com/NervJS/taro/commit/999d74f))
* **transformer:** bind 成员表达式不会加入加入到 usedState，close [#1051](https://github.com/NervJS/taro/issues/1051) ([a98f8ec](https://github.com/NervJS/taro/commit/a98f8ec))
* **transformer:** 某些情况会处理循环组件两次 ([2d3dbee](https://github.com/NervJS/taro/commit/2d3dbee))
* **transformer:** 空格强行换行，close [#992](https://github.com/NervJS/taro/issues/992) ([3a20233](https://github.com/NervJS/taro/commit/3a20233))
* **transformer:** 自定义组件 props 不支持任何表达式，close [#984](https://github.com/NervJS/taro/issues/984) ([804e6f2](https://github.com/NervJS/taro/commit/804e6f2))
* **webpack-runner:** 修复devServer open配置无效的问题 ([127839f](https://github.com/NervJS/taro/commit/127839f))
* **webpack-runner:** 修复了h5下csso配置失效的问题 ([57c48d7](https://github.com/NervJS/taro/commit/57c48d7))


### Features

* **eslint:** 不支持在 switch 语句中使用 JSX ([d008756](https://github.com/NervJS/taro/commit/d008756))
* 给Swiper传递样式中的height ([7d630e8](https://github.com/NervJS/taro/commit/7d630e8))
* **taro-components-rn:** Image resizeMode add ([fd74b35](https://github.com/NervJS/taro/commit/fd74b35))
* **taro-components-rn:** Image 支持 widthFix ([4d41a5d](https://github.com/NervJS/taro/commit/4d41a5d))
* **taro-components-rn:** 新组件 Video ([2a1db5b](https://github.com/NervJS/taro/commit/2a1db5b))
* **taro-components-rn:** 补充：支持 Image 对本地图片的 widthFix ([837b62c](https://github.com/NervJS/taro/commit/837b62c))
* **transformer:** 当在复杂循环中使用 this.state.xx.xx 给出修改建议, close [#886](https://github.com/NervJS/taro/issues/886) ([d6ee88f](https://github.com/NervJS/taro/commit/d6ee88f))
* **weapp:** 组件同样拥有 componentDidShow/componentDidHide 生命周期，close [#1048](https://github.com/NervJS/taro/issues/1048) ([4bb99cd](https://github.com/NervJS/taro/commit/4bb99cd))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/NervJS/taro/compare/v1.1.3...v1.1.4) (2018-11-08)


### Bug Fixes

* **alipay:** 支付宝小程序 api 不支持提示逻辑错误 ([84b05ae](https://github.com/NervJS/taro/commit/84b05ae))
* **eslint:** 允许 this.props.dispatch, close [#1006](https://github.com/NervJS/taro/issues/1006) ([7abcb2c](https://github.com/NervJS/taro/commit/7abcb2c))
* **swan:** 百度小程序报错 ([d1a4688](https://github.com/NervJS/taro/commit/d1a4688))


### Features

* **taro:** 补充 OfficialAccount 组件定义 && 组件全部补充 animation 属性，close [#1003](https://github.com/NervJS/taro/issues/1003) ([7c5e669](https://github.com/NervJS/taro/commit/7c5e669))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/NervJS/taro/compare/v1.1.2...v1.1.3) (2018-11-07)


### Bug Fixes

* **alipay:** 修复支付宝小程序编译空文件报错问题 ([ae222a0](https://github.com/NervJS/taro/commit/ae222a0))
* **alipay/swan:** 支付宝 && 百度小程序 api 不支持提示 ([286f0e3](https://github.com/NervJS/taro/commit/286f0e3))
* **cli:** 百度小程序全局对象使用 global ([078a5a8](https://github.com/NervJS/taro/commit/078a5a8))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/NervJS/taro/compare/v1.1.1...v1.1.2) (2018-11-07)


### Bug Fixes

* **alipay:** 支付宝小程序 api 适配问题修复 ([094f060](https://github.com/NervJS/taro/commit/094f060))
* **async-await:** 保证支付宝小程序下 async-await 代码不为空 ([75cdfa1](https://github.com/NervJS/taro/commit/75cdfa1))
* **cli:** 使用官方插件 babel-plugin-danger-remove-unused-import ，解决 Computed Property 支持问题，close [#1015](https://github.com/NervJS/taro/issues/1015) ([6162b63](https://github.com/NervJS/taro/commit/6162b63))
* **cli:** 修复 npm 安装依赖时依赖获取 ([9773500](https://github.com/NervJS/taro/commit/9773500))
* **cli:** 百度小程序全局对象使用 global ([842f870](https://github.com/NervJS/taro/commit/842f870))
* **cli:** 百度小程序静态资源路径必须为相对路径，close [#1020](https://github.com/NervJS/taro/issues/1020) ([31385e7](https://github.com/NervJS/taro/commit/31385e7))
* **h5:** 兼容contentType一些奇怪的写法 ([#1022](https://github.com/NervJS/taro/issues/1022)) ([06b6b42](https://github.com/NervJS/taro/commit/06b6b42))
* **weapp:** 微信小程序Taro.request的complete回调无参数 ([#1011](https://github.com/NervJS/taro/issues/1011)) ([d55dabf](https://github.com/NervJS/taro/commit/d55dabf))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/NervJS/taro/compare/v1.1.0...v1.1.1) (2018-11-05)


### Bug Fixes

* **async-await:** 修复新版本支付宝开发者工具不支持空文件的 bug ([8af35fa](https://github.com/NervJS/taro/commit/8af35fa))
* **component:** fixed types of SwiperItem ([#997](https://github.com/NervJS/taro/issues/997)) ([548d72f](https://github.com/NervJS/taro/commit/548d72f))
* **taro:** taro类型文件中加入navigateToMiniProgramAppIdList字段支持 ([#988](https://github.com/NervJS/taro/issues/988)) ([d250597](https://github.com/NervJS/taro/commit/d250597))


### Features

* **cli:** 替换 babel-plugin-danger-remove-unused-import 插件 ([3e5cdf1](https://github.com/NervJS/taro/commit/3e5cdf1))
* **redux:** 微信端 connect 的 mapDispatchToProps 参数支持传递对象 [#298](https://github.com/NervJS/taro/issues/298) ([#994](https://github.com/NervJS/taro/issues/994)) ([59c2bd4](https://github.com/NervJS/taro/commit/59c2bd4))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/NervJS/taro/compare/v1.1.0-beta.15...v1.1.0) (2018-11-02)


### Bug Fixes

* **cli:** fixed eslint rules failed in typescript ([#952](https://github.com/NervJS/taro/issues/952)) ([2c1d51e](https://github.com/NervJS/taro/commit/2c1d51e))
* **cli:** 支付宝小程序 config 转换遗漏，close [#970](https://github.com/NervJS/taro/issues/970) ([340aa24](https://github.com/NervJS/taro/commit/340aa24))
* **cli:** 模板创建项目出错 ([159c4bf](https://github.com/NervJS/taro/commit/159c4bf))
* **RN:** 修复 this.$router.params undefined 的问题 ([24e591d](https://github.com/NervJS/taro/commit/24e591d))
* **taro-alipay:** 将支付宝的 event 事件对象的字段，对齐微信小程序的 ([d014b03](https://github.com/NervJS/taro/commit/d014b03))


### Features

* **cli:** 支持 babel-plugin-transform-runtime ([45604f0](https://github.com/NervJS/taro/commit/45604f0))
* **RN:** 支持对页面配置项 disableScroll ([4dfeec3](https://github.com/NervJS/taro/commit/4dfeec3))



<a name="1.1.0-beta.15"></a>
# [1.1.0-beta.15](https://github.com/NervJS/taro/compare/v1.1.0-beta.14...v1.1.0-beta.15) (2018-10-31)


### Bug Fixes

* **cli:** 百度小程序编译找不到 scss 变量，close [#967](https://github.com/NervJS/taro/issues/967) ([9c4ff9c](https://github.com/NervJS/taro/commit/9c4ff9c))
* **taro-transformer-wx:** 支付宝小程序不用编译出 Component.properties ([c1c47b8](https://github.com/NervJS/taro/commit/c1c47b8))


### Features

* update RN docs ([6c1431d](https://github.com/NervJS/taro/commit/6c1431d))



<a name="1.1.0-beta.14"></a>
# [1.1.0-beta.14](https://github.com/NervJS/taro/compare/v1.1.0-beta.13...v1.1.0-beta.14) (2018-10-30)


### Bug Fixes

* **cli:** ui 库编译可以给小程序类端使用 ([4969021](https://github.com/NervJS/taro/commit/4969021))
* **cli:** ui 打包更新 ([5a56c2a](https://github.com/NervJS/taro/commit/5a56c2a))
* **taro:** inlineStyle 无法正确转换浏览器私有属性 ([67a90b8](https://github.com/NervJS/taro/commit/67a90b8))
* **taro-alipay:** 支付宝小程序事件处理优化 ([f3224d9](https://github.com/NervJS/taro/commit/f3224d9))
* **taro-alipay:** 支付宝小程序事件处理优化 ([38d6310](https://github.com/NervJS/taro/commit/38d6310))
* **taro-cli:** tabBar config跟进编译的不同小程序去取配置字段 ([31a0847](https://github.com/NervJS/taro/commit/31a0847))
* **taro-cli:** 支付宝小程序中 npm hack 时 global 赋值空对象 ([8cfe9a4](https://github.com/NervJS/taro/commit/8cfe9a4))


### Features

* update RN  docs ([aa0f98d](https://github.com/NervJS/taro/commit/aa0f98d))
* **cli:** usingComponents 支持写以 src 为根目录的绝对路径，close [#945](https://github.com/NervJS/taro/issues/945) ([2f20419](https://github.com/NervJS/taro/commit/2f20419))
* **cli:** 支持 NODE_ENV 自定义，close [#947](https://github.com/NervJS/taro/issues/947) ([8020dd1](https://github.com/NervJS/taro/commit/8020dd1))
* **RN:**  添加 RN 端 watch 代码按需编译。 ([573debc](https://github.com/NervJS/taro/commit/573debc))
* **taro:** 匿名函数转换后标记统一改为 funPrivate，close [#956](https://github.com/NervJS/taro/issues/956) ([86e01b9](https://github.com/NervJS/taro/commit/86e01b9))



<a name="1.1.0-beta.13"></a>
# [1.1.0-beta.13](https://github.com/NervJS/taro/compare/v1.1.0-beta.12...v1.1.0-beta.13) (2018-10-26)


### Bug Fixes

* **async-await:** 修正 async await 依赖的引入方式 ([5b2e858](https://github.com/NervJS/taro/commit/5b2e858))
* **cli:** H5 分包配置与小程序保持一致 ([f2a0084](https://github.com/NervJS/taro/commit/f2a0084))
* **cli:** H5 编译时清除 dist 目录，close [#936](https://github.com/NervJS/taro/issues/936) ([709a795](https://github.com/NervJS/taro/commit/709a795))
* **cli:** 不再主动清除组件引用，close [#870](https://github.com/NervJS/taro/issues/870) ([ae6db2f](https://github.com/NervJS/taro/commit/ae6db2f))
* **cli:** 解析 node_modules 文件时 TARO_ENV 不正确 ([50854c8](https://github.com/NervJS/taro/commit/50854c8))
* **RN:** 修复同一文件夹下多个JS文件样式引用错误 ([74380ec](https://github.com/NervJS/taro/commit/74380ec))
* **swan:** 修复 componentWillMount 中 setState 回调中获取 state 可能不正确 ([057bedb](https://github.com/NervJS/taro/commit/057bedb))
* **taro-cli:** 修复 weapp.js 编译出的页面和组件配置 json 文件中，usingComponent 的 npm 包路径错误 ([990df26](https://github.com/NervJS/taro/commit/990df26))
* **taro-weapp:** 修复 await Taro.connectSocket 获取不到 SocketTask 的错误 ([#930](https://github.com/NervJS/taro/issues/930)) ([771baba](https://github.com/NervJS/taro/commit/771baba))
* **transformer:** 修复事件的正则判断 ([a282331](https://github.com/NervJS/taro/commit/a282331))
* **transformer:** 多层循环内生成新的数组也要带上用户写的执行判断 ([067de85](https://github.com/NervJS/taro/commit/067de85))


### Features

* **eslint:** 检测来自于 this.props 的函数是否以 `on` 开头 ([9827866](https://github.com/NervJS/taro/commit/9827866))
* **transformer:** 支持在同一作用域对 JSX 赋值（不推荐），close [#550](https://github.com/NervJS/taro/issues/550) ([243b237](https://github.com/NervJS/taro/commit/243b237))



<a name="1.1.0-beta.12"></a>
# [1.1.0-beta.12](https://github.com/NervJS/taro/compare/v1.1.0-beta.11...v1.1.0-beta.12) (2018-10-24)


### Bug Fixes

* **cli:** 修复h5分包功能出现没有Root的pages的问题 ([d6f0971](https://github.com/NervJS/taro/commit/d6f0971))
* **cli:** 小程序类编译 TARO_ENV 设置有误 ([dc86832](https://github.com/NervJS/taro/commit/dc86832))
* **taro-alipay:** 匿名函数也不需要通过 __triggerPropsFn 调用 props 的函数 ([682b91d](https://github.com/NervJS/taro/commit/682b91d))
* **transformer:** Tagged template 不需要做优化处理，close [#926](https://github.com/NervJS/taro/issues/926) ([22be41c](https://github.com/NervJS/taro/commit/22be41c))
* **transformer:** 支付宝自定义组件不处理 onClick 事件 ([4dd9ba3](https://github.com/NervJS/taro/commit/4dd9ba3))


### Features

* **taro-h5:** 设置 H5 端 Taro.request 保留 jsonp-retry 的参数 ([0a2f975](https://github.com/NervJS/taro/commit/0a2f975))



<a name="1.1.0-beta.11"></a>
# [1.1.0-beta.11](https://github.com/NervJS/taro/compare/v1.1.0-beta.10...v1.1.0-beta.11) (2018-10-23)


### Bug Fixes

* **cli:** h5 分包路径识别错误 ([34d3d02](https://github.com/NervJS/taro/commit/34d3d02))
* **taro:** 小程序端 api 传参丢失参数，close [#420](https://github.com/NervJS/taro/issues/420) ([69ed1cb](https://github.com/NervJS/taro/commit/69ed1cb))
* **taro-components:** 修复 swiper 滑动问题，textarea 返回值问题，input focus 问题 ([3521334](https://github.com/NervJS/taro/commit/3521334))
* **taro-weapp:** componentDidUpdate 前一刻需要触发 ref 回调或更新 this.refs ([80e0c65](https://github.com/NervJS/taro/commit/80e0c65))
* **taro-weapp:** json diff 应对数组时，只有长度相等才做 diff，否则直接赋值。close [#882](https://github.com/NervJS/taro/issues/882) ([76c5ad2](https://github.com/NervJS/taro/commit/76c5ad2))
* **taro-weapp:** 初始化阶段不触发 componentDidUpdate ([7a2685c](https://github.com/NervJS/taro/commit/7a2685c))
* **taro-weapp:** 调用 forceUpdate 时应该不去触发 shouldComponentUpdate ([24cdfff](https://github.com/NervJS/taro/commit/24cdfff))
* **taro-weapp:** 调用 forceUpdate 时应该不去触发 shouldComponentUpdate ([2bf0838](https://github.com/NervJS/taro/commit/2bf0838))
* **transformer:**  babel-generator 把中文字符生成为 unicode ([9bbb399](https://github.com/NervJS/taro/commit/9bbb399))
* **transformer:** if block 中的 JSX 引用没有改变为 JSX 元素, close [#889](https://github.com/NervJS/taro/issues/889) ([1389096](https://github.com/NervJS/taro/commit/1389096))
* **transformer:** useState 加入 class props ([7f17771](https://github.com/NervJS/taro/commit/7f17771))
* **transformer:** 二进制表达式的左右值不会加入 state, close [#879](https://github.com/NervJS/taro/issues/879) ([edb92a6](https://github.com/NervJS/taro/commit/edb92a6))
* **transformer:** 使用挂载在 this 下的变量渲染可能会报错 ([9e66495](https://github.com/NervJS/taro/commit/9e66495))
* **transformer:** 在 key 中使用 `[].length` 的写法时报错 ([12d5252](https://github.com/NervJS/taro/commit/12d5252))
* **transformer:** 在循环中使用 bind 参数有复杂表达式, close [#770](https://github.com/NervJS/taro/issues/770) ([743d4b8](https://github.com/NervJS/taro/commit/743d4b8))
* **transformer:** 多层循环的 callee 如果是循环体内的变量不用变为成员表达式, [#912](https://github.com/NervJS/taro/issues/912) ([0656199](https://github.com/NervJS/taro/commit/0656199))


### Features

* **transformer:** JSX 属性 `taroKey` alias `key` ([c95c8b2](https://github.com/NervJS/taro/commit/c95c8b2))



<a name="1.1.0-beta.10"></a>
# [1.1.0-beta.10](https://github.com/NervJS/taro/compare/v1.1.0-beta.9...v1.1.0-beta.10) (2018-10-18)


### Bug Fixes

* **RN:** RN app.json 的 expo 配置改为可覆盖 ([24dc72b](https://github.com/NervJS/taro/commit/24dc72b))
* **taro-weapp:** 对应部分 react 的 ref 逻辑。 ([e6d0d28](https://github.com/NervJS/taro/commit/e6d0d28))
* **transformer:** 三元表达式其中有一个值为函数解析错误 ([fde2474](https://github.com/NervJS/taro/commit/fde2474))
* **transformer:** 三元表达式有一个结果为有值字符串解析错误 ([e256111](https://github.com/NervJS/taro/commit/e256111))


### Features

* **cli:** 将initPxTransform移动到import后面 ([505c379](https://github.com/NervJS/taro/commit/505c379))
* **cli:** 支持分包 ([8be9308](https://github.com/NervJS/taro/commit/8be9308))
* **RN:** RN 端支持 Taro.pxTransform ([688a9c9](https://github.com/NervJS/taro/commit/688a9c9))
* **taro-qapp:** 完成router的reLanch、getCurrentPages ([4d38db3](https://github.com/NervJS/taro/commit/4d38db3))
* **transformer:** 提升字符串模板的性能 ([ecc916a](https://github.com/NervJS/taro/commit/ecc916a))



<a name="1.1.0-beta.9"></a>
# [1.1.0-beta.9](https://github.com/NervJS/taro/compare/v1.1.0-beta.8...v1.1.0-beta.9) (2018-10-17)


### Bug Fixes

* **RN:** fix RN 端 .styl后缀未修改的问题，并添加对应的测试用例 close [#838](https://github.com/NervJS/taro/issues/838) ([7b5ce74](https://github.com/NervJS/taro/commit/7b5ce74))
* **RN:** fix RN 端 iconPath 和 selectedPath 的为同一个路径导致的重复引用的报错 close [#776](https://github.com/NervJS/taro/issues/776) ([4123514](https://github.com/NervJS/taro/commit/4123514))
* **taro-swan:** 修复 ref 获取 ([8fe5f18](https://github.com/NervJS/taro/commit/8fe5f18))
* **taro-swan:** 修复 ref 获取以及 onShow 生命周期调整 ([a333c3f](https://github.com/NervJS/taro/commit/a333c3f))
* **taro-weapp:**  preloadData 初始值改为 null ([3772b8c](https://github.com/NervJS/taro/commit/3772b8c))
* **transformer:** 从 this 解构出来出来的变量不得与 render 作用域定义的变量重复时报错 ([040d1ae](https://github.com/NervJS/taro/commit/040d1ae))


### Features

* **cli:** 保留 config 配置，可以在代码中访问到 ([0571fd0](https://github.com/NervJS/taro/commit/0571fd0))
* **cli:** 支持 js 中 export * from 的写法，closes [#861](https://github.com/NervJS/taro/issues/861)，closes [#496](https://github.com/NervJS/taro/issues/496) ([4653e0a](https://github.com/NervJS/taro/commit/4653e0a))
* **postcss-pxtransform:** 增加 1px 是否会被转换的设置 ([4085ad7](https://github.com/NervJS/taro/commit/4085ad7))
* **RN:** 在 config 中添加 rn 的 expo 配置 ([8920b3c](https://github.com/NervJS/taro/commit/8920b3c))
* **taro-weapp:** add wxapp trtriggerEvent key ([#852](https://github.com/NervJS/taro/issues/852)) ([0ddedda](https://github.com/NervJS/taro/commit/0ddedda))



<a name="1.1.0-beta.8"></a>
# [1.1.0-beta.8](https://github.com/NervJS/taro/compare/v1.1.0-beta.7...v1.1.0-beta.8) (2018-10-16)


### Bug Fixes

* **cli:** fix npm file hack ([629a06f](https://github.com/NervJS/taro/commit/629a06f))
* **cli:** 修复 require 引用 npm 不识别的问题 ([e90885a](https://github.com/NervJS/taro/commit/e90885a))
* **cli:** 文件压缩出错提示错误文件位置 ([e02402d](https://github.com/NervJS/taro/commit/e02402d))
* **cli:** 模板中更新 [@tarojs](https://github.com/tarojs)/async-await 包引入的方式 ([810324e](https://github.com/NervJS/taro/commit/810324e))
* **cli:** 组件循环依赖 bug ([86df1d9](https://github.com/NervJS/taro/commit/86df1d9))
* **router:** componentWillReceiveProps可以接收到新的router参数了 ([94e04bc](https://github.com/NervJS/taro/commit/94e04bc))
* **router-h5,redux-h5:** 修复后台页面依然执行生命周期的问题 ([cc0db54](https://github.com/NervJS/taro/commit/cc0db54))
* **taro-alipay:** fix 子组件 componentWillRecieveProps 不会触发 ([db236dd](https://github.com/NervJS/taro/commit/db236dd))
* **taro-redux:** connect types add IStore ([4207231](https://github.com/NervJS/taro/commit/4207231))
* **taro-swan:** 百度小程序不支持 props 带 _ ([dda7116](https://github.com/NervJS/taro/commit/dda7116))
* **taro-weapp:** 修复 setData 回调里再 setData 的 bug ，close [#825](https://github.com/NervJS/taro/issues/825) ([b311870](https://github.com/NervJS/taro/commit/b311870))
* **transformer:** 从 this 解构出来出来的变量重复 ([00269d4](https://github.com/NervJS/taro/commit/00269d4))
* **transformer:** 第三方组件事件首字母小写 ([60151d6](https://github.com/NervJS/taro/commit/60151d6))
* **transformer:** 自定义组件名为 Link 时无法正常渲染 `children`, close [#826](https://github.com/NervJS/taro/issues/826) ([aba4774](https://github.com/NervJS/taro/commit/aba4774))


### Features

* **taro:** 增加 SWAN/ALIPAY 分别表示百度/支付宝小程序 ([4e13bbf](https://github.com/NervJS/taro/commit/4e13bbf))
* **taro-swan:** 修复百度小程序生命周期执行 ([bdd6d51](https://github.com/NervJS/taro/commit/bdd6d51))
* **transformer:** 从 this 中解构出来的参数可以在 JSX 中使用，[#822](https://github.com/NervJS/taro/issues/822) ([3b34c2c](https://github.com/NervJS/taro/commit/3b34c2c))
* **transformer:** 支持在 JSX 使用 this.xxx 直接访问 this.xxx 的值 ([3814c31](https://github.com/NervJS/taro/commit/3814c31))



<a name="1.1.0-beta.7"></a>
# [1.1.0-beta.7](https://github.com/NervJS/taro/compare/v1.1.0-beta.6...v1.1.0-beta.7) (2018-10-12)


### Bug Fixes

* **transformer:** 不使用本地插件 remove dead code 插件, close [#824](https://github.com/NervJS/taro/issues/824) ([bc9e6e8](https://github.com/NervJS/taro/commit/bc9e6e8))



<a name="1.1.0-beta.6"></a>
# [1.1.0-beta.6](https://github.com/NervJS/taro/compare/v1.1.0-beta.5...v1.1.0-beta.6) (2018-10-12)


### Bug Fixes

* **transformer:** 重新加入 remove-dead-code 插件 ([53e4107](https://github.com/NervJS/taro/commit/53e4107))



<a name="1.1.0-beta.5"></a>
# [1.1.0-beta.5](https://github.com/NervJS/taro/compare/v1.1.0-beta.4...v1.1.0-beta.5) (2018-10-12)


### Bug Fixes

* **async-await:** 修正全局对象的获取 ([2c92df1](https://github.com/NervJS/taro/commit/2c92df1))
* **taro-compontens:** 修复 lowerThreshold， upperThreshold 参数问题，swiper 高度问题 ([c552dbb](https://github.com/NervJS/taro/commit/c552dbb))
* **taro-swan:** 百度小程序 api 适配 ([eb19924](https://github.com/NervJS/taro/commit/eb19924))
* **transformer:**  babel-plugin-remove-dead-code 插件会多生成一个 block 语句 ([d8bad5b](https://github.com/NervJS/taro/commit/d8bad5b))
* **transformer:** 去掉自动加 [@tarojs](https://github.com/tarojs)/async-await 逻辑 ([796070b](https://github.com/NervJS/taro/commit/796070b))
* **transformer:** 多个 if 表达式中循环前有三元表达式可能会不解析的情况 ([1cd0352](https://github.com/NervJS/taro/commit/1cd0352))


### Features

* **taro-alipay:** 支付宝小程序 api 适配 ([a6ff163](https://github.com/NervJS/taro/commit/a6ff163))
* **taro-qapp:** 添加 router的switchTab、navigateBack ([b622da4](https://github.com/NervJS/taro/commit/b622da4))
* **taro-weapp:** add componentWillPreload. close [#747](https://github.com/NervJS/taro/issues/747) ([1030210](https://github.com/NervJS/taro/commit/1030210))



<a name="1.1.0-beta.4"></a>
# [1.1.0-beta.4](https://github.com/NervJS/taro/compare/v1.1.0-beta.3...v1.1.0-beta.4) (2018-10-11)


### Bug Fixes

* **cli:** taro update 补充依赖包 ([0c769e0](https://github.com/NervJS/taro/commit/0c769e0))
* **cli:** 同一页面多次加载 npm 安装的组件失败 ([feece2d](https://github.com/NervJS/taro/commit/feece2d))
* **cli:** 增加主包或子包页面触发重新编译所有页面 ([4c1f482](https://github.com/NervJS/taro/commit/4c1f482))
* **taro-alipay:** API 作用域 ([b0b64a0](https://github.com/NervJS/taro/commit/b0b64a0))
* **taro-alipay:** 事件处理 ([1a4eeec](https://github.com/NervJS/taro/commit/1a4eeec))
* **taro-swan:** 百度小程序暂时不支持 setData 数据路径更新 ([c4fcb0b](https://github.com/NervJS/taro/commit/c4fcb0b))
* **taro-swan:** 百度小程序自定义事件参数在 event 对象下 ([21442ae](https://github.com/NervJS/taro/commit/21442ae))
* **transformer:** 处理支付宝小程序的组件差异 ([50eac86](https://github.com/NervJS/taro/commit/50eac86))
* **transformer:** 支付宝小程序事件名保持原样输出 ([305f104](https://github.com/NervJS/taro/commit/305f104))
* **transformer:** 支付宝小程序事件报错 ([5d3eb72](https://github.com/NervJS/taro/commit/5d3eb72))


### Features

* **components:** add a type definition for the block component ([3a4bd5a](https://github.com/NervJS/taro/commit/3a4bd5a))
* **RN:** RN  端支持 deviceRatio 自定义 ([654c423](https://github.com/NervJS/taro/commit/654c423))
* **taro-alipay:** 支付宝小程序适配改造 ([58c360d](https://github.com/NervJS/taro/commit/58c360d))
* **transformer:** 处理支付宝小程序事件差异 ([ef1cb30](https://github.com/NervJS/taro/commit/ef1cb30))



<a name="1.1.0-beta.3"></a>
# [1.1.0-beta.3](https://github.com/NervJS/taro/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2018-10-10)


### Bug Fixes

* **cli:** 支持组件循环引用，close [#691](https://github.com/NervJS/taro/issues/691) ([a064804](https://github.com/NervJS/taro/commit/a064804))
* **eslint:** 生命周期在 function-naming 中报错，[#799](https://github.com/NervJS/taro/issues/799) ([6fee18a](https://github.com/NervJS/taro/commit/6fee18a))
* **taro-weapp:** 修复 json diff ([4ed1d45](https://github.com/NervJS/taro/commit/4ed1d45))


### Features

* **cli:** 支持编译生成 worker 相关文件，close [#778](https://github.com/NervJS/taro/issues/778) ([54de51d](https://github.com/NervJS/taro/commit/54de51d))
* **cli:** 模板增加百度小程序运行时框架 ([6b64a85](https://github.com/NervJS/taro/commit/6b64a85))
* **taro:** 兼容 event 中不存在 target 的情况 ([37694da](https://github.com/NervJS/taro/commit/37694da))



<a name="1.1.0-beta.2"></a>
# [1.1.0-beta.2](https://github.com/NervJS/taro/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2018-10-08)


### Bug Fixes

* **cli:** 处理 lodash/fp 的小程序端兼容问题 ([fb10108](https://github.com/NervJS/taro/commit/fb10108))
* **cli:** 百度小程序以及 rn 的 TARO_ENV 不正确 ([337b2b1](https://github.com/NervJS/taro/commit/337b2b1))
* **components:** 修复不传className时类名为undefined的情况 ([103df23](https://github.com/NervJS/taro/commit/103df23))
* **transformer:** 多层循环的 JSX 引用会多编译一个数组 ([7cfef07](https://github.com/NervJS/taro/commit/7cfef07))
* **transformer:** 访问原始循环 item 减少一个 $ ([1f4e2d0](https://github.com/NervJS/taro/commit/1f4e2d0))
* **webpackChain:** 漏传第二个参数webpack ([1f9e9e2](https://github.com/NervJS/taro/commit/1f9e9e2))


### Features

* **cli:** 优化 npm 安装包资源分析，允许引入 npm 安装包自身依赖资源 close [#423](https://github.com/NervJS/taro/issues/423) ([14af040](https://github.com/NervJS/taro/commit/14af040))
* **cli:** 增加支付宝小程序编译类型 ([6619011](https://github.com/NervJS/taro/commit/6619011))
* **cli:** 处理支付宝小程序配置的差异 ([4633277](https://github.com/NervJS/taro/commit/4633277))
* **cli:** 支持编译样式文件中 import 的样式文件，closes [#746](https://github.com/NervJS/taro/issues/746)，closes [#758](https://github.com/NervJS/taro/issues/758) ([86cc770](https://github.com/NervJS/taro/commit/86cc770))
* **cli:** 文件中使用 import 引入的模板不再需要 copy ([9af132a](https://github.com/NervJS/taro/commit/9af132a))
* **taro-alipay:** 增加支付宝小程序运行时框架 ([2a558fe](https://github.com/NervJS/taro/commit/2a558fe))



<a name="1.1.0-beta.1"></a>
# [1.1.0-beta.1](https://github.com/NervJS/taro/compare/v1.1.0-beta.0...v1.1.0-beta.1) (2018-09-29)


### Bug Fixes

* **taro-swan:** 将 wx 作用域替换为 swan 作用域 ([a82440d](https://github.com/NervJS/taro/commit/a82440d))
* **taro-weapp:** 配合生成  properties 改动 ([d5c8a3d](https://github.com/NervJS/taro/commit/d5c8a3d))
* **transformer:** 修复 wx:for 替换 ([84dccb1](https://github.com/NervJS/taro/commit/84dccb1))
* **transformer:** 生成组件 properties 姿势改变 ([8175765](https://github.com/NervJS/taro/commit/8175765))



<a name="1.1.0-beta.0"></a>
# [1.1.0-beta.0](https://github.com/NervJS/taro/compare/v1.0.7...v1.1.0-beta.0) (2018-09-29)


### Bug Fixes

* **cli:** taro update self 不再使用 yarn 来更新，close [#724](https://github.com/NervJS/taro/issues/724) ([9be3d88](https://github.com/NervJS/taro/commit/9be3d88))


### Features

* **taro:** 新增百度小程序 api ([2b2d0e2](https://github.com/NervJS/taro/commit/2b2d0e2))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/NervJS/taro/compare/v1.0.6...v1.0.7) (2018-09-29)


### Bug Fixes

* **cli:** h5页面的require加了default ([80c532a](https://github.com/NervJS/taro/commit/80c532a))
* **cli:** 修复h5页面import的顺序问题 ([3042291](https://github.com/NervJS/taro/commit/3042291))
* **transformer:**  无法渲染 class 依赖计算属性（get）, close [#728](https://github.com/NervJS/taro/issues/728) ([20ed37e](https://github.com/NervJS/taro/commit/20ed37e))


### Features

* **cli:** 生成 swan 的项目配置文件 ([a49c65e](https://github.com/NervJS/taro/commit/a49c65e))



<a name="1.0.6"></a>
## [1.0.6](https://github.com/NervJS/taro/compare/v1.0.5...v1.0.6) (2018-09-29)


### Bug Fixes

* drawImage类型异常 ([52d9029](https://github.com/NervJS/taro/commit/52d9029))
* Duplicate identifier 'buffer'. ([8f4cdda](https://github.com/NervJS/taro/commit/8f4cdda))
* **cli:** unicode 编码处理,close [#701](https://github.com/NervJS/taro/issues/701), [#741](https://github.com/NervJS/taro/issues/741) ([d97d0dc](https://github.com/NervJS/taro/commit/d97d0dc))
* **taro-qapp:** showToast参数不正确 ([4922113](https://github.com/NervJS/taro/commit/4922113))
* **transformer:** 使用循环体内定义的变量来构造新循环报错 ([5ecb95b](https://github.com/NervJS/taro/commit/5ecb95b))
* **transformer:** 微信的 key 只支持变量读取，不支持计算 ([39ec985](https://github.com/NervJS/taro/commit/39ec985))
* **webpack-runner:** 修复csso配置的读取错误 ([fa4177d](https://github.com/NervJS/taro/commit/fa4177d))


### Features

* **cli:** cli 支持将 [@tarojs](https://github.com/tarojs)/taro 替换成多个端的运行时框架 ([268fa55](https://github.com/NervJS/taro/commit/268fa55))
* **cli:** cli 改造，支持生成百度小程序等其他小程序的文件 ([476a6c9](https://github.com/NervJS/taro/commit/476a6c9))
* **router:** router改用typescript ([3175efb](https://github.com/NervJS/taro/commit/3175efb))
* **router:** 暂时将page加载改为同步 ([a376b79](https://github.com/NervJS/taro/commit/a376b79))
* **router:** 补回了getCurrentPages函数 ([0388d1f](https://github.com/NervJS/taro/commit/0388d1f))
* **taro-qapp:** 添加 router的navigateTo、redirectTo ([508134a](https://github.com/NervJS/taro/commit/508134a))
* **taro-swan:** 添加百度小程序运行时 ([8ea98a0](https://github.com/NervJS/taro/commit/8ea98a0))
* **webpack-runner:** 修改UglifyOptions内部的传值 ([baf1bae](https://github.com/NervJS/taro/commit/baf1bae))



<a name="1.0.5"></a>
## [1.0.5](https://github.com/NervJS/taro/compare/v1.0.4...v1.0.5) (2018-09-27)


### Bug Fixes

* **cli:** rn 端常量替换以及无用 import 移除 ([fd0f78d](https://github.com/NervJS/taro/commit/fd0f78d))
* **cli:** 移除 ts 编译 && babel 编译增加 jsx 插件 ([915893a](https://github.com/NervJS/taro/commit/915893a))
* **h5:** 修复 PUT 、DELETE 等请求 body 为对象时无法发送 body 的问题 ([698be65](https://github.com/NervJS/taro/commit/698be65))
* **RN:** 修复样式警告 ([72b5406](https://github.com/NervJS/taro/commit/72b5406))
* **RN:** 兼容 config 未定义的情况 ([94d0f23](https://github.com/NervJS/taro/commit/94d0f23))
* **taro-weapp:** 回退允许设定为 null 的写法 ([39570a3](https://github.com/NervJS/taro/commit/39570a3))


### Features

* **taro-h5:** 增加 setTabBarStyle、setTabBarItem APIs ([f933805](https://github.com/NervJS/taro/commit/f933805))
* **taro-qapp:** 添加 showActionSheet、setNavigationBarTitle、setNavigationBarColor ([94cbd19](https://github.com/NervJS/taro/commit/94cbd19))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/NervJS/taro/compare/v1.0.3...v1.0.4) (2018-09-26)


### Bug Fixes

* **cli:** fix the order of merge external babel config before compile script ([c3ae67c](https://github.com/NervJS/taro/commit/c3ae67c))
* **cli:** 升级 process.env 的替换方式 ([345e640](https://github.com/NervJS/taro/commit/345e640))
* **cli:** 小程序端编译去掉无用的 import ([0c05a03](https://github.com/NervJS/taro/commit/0c05a03))
* **RN:** 修复页面 navigation 配置失效的 bug ([132a6a2](https://github.com/NervJS/taro/commit/132a6a2))
* **taro-rn:** 修复request api方法为get时的入参问题 ([6e62724](https://github.com/NervJS/taro/commit/6e62724))
* **transformer:** 循环体内引入外部数组变量会重复赋值，close [#666](https://github.com/NervJS/taro/issues/666) ([21d3302](https://github.com/NervJS/taro/commit/21d3302))
* **transformer:** 没有 import [@tarojs](https://github.com/tarojs)/taro 时强制添加 ([f07e068](https://github.com/NervJS/taro/commit/f07e068))
* **transformer:** 百度小程序特殊处理 getApp ([5b6a2fe](https://github.com/NervJS/taro/commit/5b6a2fe))
* **transformer:** 百度小程序的 for 值使用字符串包裹 ([f5470f3](https://github.com/NervJS/taro/commit/f5470f3))
* **weapp:** 小程序组件更新时允许 null 值覆盖，close [#695](https://github.com/NervJS/taro/issues/695) ([9c13b02](https://github.com/NervJS/taro/commit/9c13b02))
* **webpack-runner:** lib插入方式改为prepend ([fbf1644](https://github.com/NervJS/taro/commit/fbf1644))
* **webpack-runner:** webpack-runner支持uglify和css的enable配置了 ([cc9e29f](https://github.com/NervJS/taro/commit/cc9e29f))
* **webpack-runner:** 修复一些问题 ([fd4dc4a](https://github.com/NervJS/taro/commit/fd4dc4a))


### Features

* **cli:** 使用 babel-plugin-transform-define 来处理常量定义 ([88370ee](https://github.com/NervJS/taro/commit/88370ee))
* **cli:** 规范小程序端 weapp.module 的配置 ([13cab9b](https://github.com/NervJS/taro/commit/13cab9b))
* **RN:** 添加 config.window.navigationStyle 配置  close [#675](https://github.com/NervJS/taro/issues/675) ([fe94303](https://github.com/NervJS/taro/commit/fe94303))
* **RN:** 添加 showNavigationBarLoading 与hideNavigationBarLoading API，并更新对应文档 ([9648a60](https://github.com/NervJS/taro/commit/9648a60))
* **RN:** 添加 Taro.setNavigationBarTitle 和 Taro.setNavigationBarColor API , close [#669](https://github.com/NervJS/taro/issues/669) ([6cca77c](https://github.com/NervJS/taro/commit/6cca77c))
* **taro-h5:** 新增 arrayBufferToBase64 与 base64ToArrayBuffer API ([af4f438](https://github.com/NervJS/taro/commit/af4f438))
* **taro-qapp:** showToast支持promise ([0645870](https://github.com/NervJS/taro/commit/0645870))
* **taro-qapp:** 增加 interactive 的 showToast和showModal ([766c2aa](https://github.com/NervJS/taro/commit/766c2aa))
* **taro-qapp:** 添加showActionSheet ([795357d](https://github.com/NervJS/taro/commit/795357d))
* **taro-rn:** 新增arrayBufferToBase64和base64ToArrayBuffer api ([0b96edc](https://github.com/NervJS/taro/commit/0b96edc))
* **transformer:** 支持百度小程序 ([c899396](https://github.com/NervJS/taro/commit/c899396))
* **webpack-runner:** 整理webpack-runner的log函数 ([3928eb3](https://github.com/NervJS/taro/commit/3928eb3))
* **webpack-runner:** 添加dll编译支持 ([1b8b20d](https://github.com/NervJS/taro/commit/1b8b20d))
* **webpack-runner:** 简化重复的配置处理代码 ([cd13823](https://github.com/NervJS/taro/commit/cd13823))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/NervJS/taro/compare/v1.0.2...v1.0.3) (2018-09-20)


### Bug Fixes

* **cli:** 模板缺少文件，close [#660](https://github.com/NervJS/taro/issues/660) ([1dc3243](https://github.com/NervJS/taro/commit/1dc3243))
* **cli:** 组件引用支持写组件文件后缀 ([bbaa88b](https://github.com/NervJS/taro/commit/bbaa88b))
* **RN:** 修复项目初始化后 less 编译报错 [#650](https://github.com/NervJS/taro/issues/650) ([d05df59](https://github.com/NervJS/taro/commit/d05df59))
* **transformer:** 三元表达式有一个值为循环调用时生成两个相同循环 ([b85d04d](https://github.com/NervJS/taro/commit/b85d04d))
* **transformer:** 多层循环访问上层迭代值时没有加上 $$original ([b8d5168](https://github.com/NervJS/taro/commit/b8d5168))
* **weapp:** 梳理事件传递时绑定作用域的各种情形 ([c345770](https://github.com/NervJS/taro/commit/c345770))


### Features

* **taro-qapp:** 增加 storage 相关 api ([ca2ddb2](https://github.com/NervJS/taro/commit/ca2ddb2))
* **transformer:**  adapter 数据结构和操作 ([670cb3e](https://github.com/NervJS/taro/commit/670cb3e))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/NervJS/taro/compare/v1.0.1...v1.0.2) (2018-09-19)


### Bug Fixes

* **component:** 暂时规避Nerv diff数组的问题 ([e04df79](https://github.com/NervJS/taro/commit/e04df79))
* **transformer:** 在 if block 中定义的 JSX 变量无法在 JSX children 替换 ([3878e84](https://github.com/NervJS/taro/commit/3878e84))
* **transformer:** 在 if block 定义没有初始值的变量报错 ([fa5c6ec](https://github.com/NervJS/taro/commit/fa5c6ec))
* **transformer:** 直接 return 一个 JSX 引用失效 ([8772038](https://github.com/NervJS/taro/commit/8772038))


### Features

* **cli:** ts 模板声明图片和 css 为模块 ([555ee9b](https://github.com/NervJS/taro/commit/555ee9b))
* **cli:** 增加百度小程序类型 ([532876c](https://github.com/NervJS/taro/commit/532876c))
* **RN:** RN 端支持 typescript ([f999a2c](https://github.com/NervJS/taro/commit/f999a2c))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/NervJS/taro/compare/v1.0.0...v1.0.1) (2018-09-18)


### Bug Fixes

* **cli:** H5 编译时去掉无用的 import 代码 ([a406d9e](https://github.com/NervJS/taro/commit/a406d9e))
* **taro:** getEnv rn 端环境变量错误 ([6f02583](https://github.com/NervJS/taro/commit/6f02583))
* **transformer:** TARO_ENV 解析不正确 ([780cf9f](https://github.com/NervJS/taro/commit/780cf9f))


### Features

* **weapp:** 支持配置propTypes ([8ee93e9](https://github.com/NervJS/taro/commit/8ee93e9))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/NervJS/taro/compare/v1.0.0-beta.30...v1.0.0) (2018-09-18)


### Bug Fixes

* **taro-components:** input 组件 maxlength -> maxLength ([b79d7eb](https://github.com/NervJS/taro/commit/b79d7eb))
* **transformer:** 单独处理 maxLength 的大小写问题，close [#631](https://github.com/NervJS/taro/issues/631) ([cacd4a7](https://github.com/NervJS/taro/commit/cacd4a7))
* **weapp:** 去掉初始化时的深拷贝数据避免过大开销 ([d4ec619](https://github.com/NervJS/taro/commit/d4ec619))


### Features

* **cli:** rn 端编译增加环境变量 ([2975dff](https://github.com/NervJS/taro/commit/2975dff))
* **taro:** 同步微信 api ([f41e8f4](https://github.com/NervJS/taro/commit/f41e8f4))
* **taro-weapp:** 可以在页面里通过 this.$app.$router.params 拿到程序入口的参数 ([defc534](https://github.com/NervJS/taro/commit/defc534))
* **webapck-runner:** 调整enableSourceMap和enableExtract的默认行为 ([6cb861a](https://github.com/NervJS/taro/commit/6cb861a))



<a name="1.0.0-beta.30"></a>
# [1.0.0-beta.30](https://github.com/NervJS/taro/compare/v1.0.0-beta.29...v1.0.0-beta.30) (2018-09-17)


### Bug Fixes

* **taro-weapp:** 深度拷贝函数 bug 修复 ([b7ba318](https://github.com/NervJS/taro/commit/b7ba318))
* **transformer:** 编译器默认写死了 TARO_ENV 为 weapp ([f9bc84d](https://github.com/NervJS/taro/commit/f9bc84d))



<a name="1.0.0-beta.29"></a>
# [1.0.0-beta.29](https://github.com/NervJS/taro/compare/v1.0.0-beta.28...v1.0.0-beta.29) (2018-09-17)


### Bug Fixes

* **RN:** 将 taro-redux-rn 的peerDependencies react  改为 "^16.3.0" ([69f530c](https://github.com/NervJS/taro/commit/69f530c))
* **transformer:**  所有字符串模板都生成一个新的 state ([7408f94](https://github.com/NervJS/taro/commit/7408f94))


### Features

* **cli:** cli编译ui兼容新配置 ([1c28774](https://github.com/NervJS/taro/commit/1c28774))



<a name="1.0.0-beta.28"></a>
# [1.0.0-beta.28](https://github.com/NervJS/taro/compare/v1.0.0-beta.27...v1.0.0-beta.28) (2018-09-15)


### Bug Fixes

* **cli:** h5 编译路由初始化遗漏参数 ([e4dda98](https://github.com/NervJS/taro/commit/e4dda98))
* **cli:** 小程序编译 UI 库引用错误 ([3af257b](https://github.com/NervJS/taro/commit/3af257b))
* **webpack-runner:** 修复字体文件、图片文件打包失败的问题 ([d515aff](https://github.com/NervJS/taro/commit/d515aff))



<a name="1.0.0-beta.27"></a>
# [1.0.0-beta.27](https://github.com/NervJS/taro/compare/v1.0.0-beta.26...v1.0.0-beta.27) (2018-09-15)


### Bug Fixes

* **cli:** H5 端编译 app 配置编译错误 ([ac5fb35](https://github.com/NervJS/taro/commit/ac5fb35))
* **compile:** start compile error while clean folder under Window ([e528837](https://github.com/NervJS/taro/commit/e528837))
* **h5:** H5 request API 对 post 请求参数做序列化 ([fd9407b](https://github.com/NervJS/taro/commit/fd9407b))
* **h5:** H5 request API 对 post 请求参数做序列化 ([c003e02](https://github.com/NervJS/taro/commit/c003e02))
* **RN:** [#584](https://github.com/NervJS/taro/issues/584) 添加 taro-redux-rn 包，重构 taro-router-rn。 ([b8ab4d7](https://github.com/NervJS/taro/commit/b8ab4d7))
* **RN:** [#621](https://github.com/NervJS/taro/issues/621) 修复中文编译后变成转义字符的问题 ([76fb60d](https://github.com/NervJS/taro/commit/76fb60d))
* **RN:** this.screenRef 未取 current ([c86e9f4](https://github.com/NervJS/taro/commit/c86e9f4))
* **RN:** 修复 react-redux 的 connect 包裹导致下拉刷新功能失效的问题 ([5beeef4](https://github.com/NervJS/taro/commit/5beeef4))
* **RN:** 修复重构导致的路由bug ([cfc3f09](https://github.com/NervJS/taro/commit/cfc3f09))
* **taro-components:** 修复 rich-text 代码覆盖问题 ([4e8c620](https://github.com/NervJS/taro/commit/4e8c620))
* **taro-components:** 修复 RichText 解析问题 ([19c4451](https://github.com/NervJS/taro/commit/19c4451))
* **taro-components:** 删除导出文件 ([e4475b1](https://github.com/NervJS/taro/commit/e4475b1))
* **taro-conponents:** 删除 package.json 冗余问题 ([20548aa](https://github.com/NervJS/taro/commit/20548aa))
* **taro-h5:** 去掉无用的 api ([c7ec950](https://github.com/NervJS/taro/commit/c7ec950))
* **taro-rn:** 修复request入参的参数处理 ([3175b96](https://github.com/NervJS/taro/commit/3175b96))
* **taro-weapp:** 修复 connectSocket 拿不到 socketTask 的问题，fix [#619](https://github.com/NervJS/taro/issues/619) ([f5ad3e5](https://github.com/NervJS/taro/commit/f5ad3e5))
* **transformer:**  if 语句中循环体内的变量不需要变量提升 ([d2cf83b](https://github.com/NervJS/taro/commit/d2cf83b))
* **transformer:** 即便当前组件没有找到事件声明也需要给 JSX 元素补上 __fn_event ([b00154d](https://github.com/NervJS/taro/commit/b00154d))
* **transformer:** 在 if 块中某些情况无法生成循环 ([e2e2579](https://github.com/NervJS/taro/commit/e2e2579))
* **transformer:** 如果是第三方组件的事件需要保持原来的大小写命名, close [#551](https://github.com/NervJS/taro/issues/551) ([3eab15d](https://github.com/NervJS/taro/commit/3eab15d))
* **transformer:** 当循环类型为数组、基本类型时可能会改变源数据的数据结构 ([fd59a09](https://github.com/NervJS/taro/commit/fd59a09))
* **transformer:** 循环体内的所有非自动生成的 item 都要加上 item.$$original ([5592caf](https://github.com/NervJS/taro/commit/5592caf))
* **transformer:** 生成的匿名循环数组在原位置之后添加 ([51f22ce](https://github.com/NervJS/taro/commit/51f22ce))
* **transformer:** 识别文件后缀名错误，close [#600](https://github.com/NervJS/taro/issues/600) ([9843d9c](https://github.com/NervJS/taro/commit/9843d9c))
* **weapp:** 修复组件初始化数据会被修改问题 ([6509620](https://github.com/NervJS/taro/commit/6509620))
* **webpack-runner:** 修复配置的一些错误 ([9e1e36a](https://github.com/NervJS/taro/commit/9e1e36a))


### Features

* **cli:** 增加router chunk文件的webpackChunkName注释 ([ab992da](https://github.com/NervJS/taro/commit/ab992da))
* **cli:** 移除一个node v8.5的api ([de6964a](https://github.com/NervJS/taro/commit/de6964a))
* **components-rn:** 支持Input和Textarea通过属性prop主动变更输入内容 ([11be435](https://github.com/NervJS/taro/commit/11be435))
* **RN:** 添加 $app 的支持 ([b227ebd](https://github.com/NervJS/taro/commit/b227ebd))
* **taro:** 增加 canIUseWebp api ([19e29c1](https://github.com/NervJS/taro/commit/19e29c1))
* **taro:** 增加 createLivePlayerContext 和 createLivePusherContext ([d45711d](https://github.com/NervJS/taro/commit/d45711d))
* **taro-qapp:** 增加快应用端 API request ([07c4d20](https://github.com/NervJS/taro/commit/07c4d20))
* **tcr:** 让checkbox同时受属性checked的主动性影响 ([91de11b](https://github.com/NervJS/taro/commit/91de11b))
* **transformer:**  return null 可以提前中断 render 同时不会影响 props 传递 ([ecff4a6](https://github.com/NervJS/taro/commit/ecff4a6))
* **transformer:** render if-else 中可以 return undefined（不推荐） ([8be510a](https://github.com/NervJS/taro/commit/8be510a))
* **transformer:** 从父类继承 this.props ([06854a3](https://github.com/NervJS/taro/commit/06854a3))
* **transformer:** 在循环的父级有条件判断应该应用到循环之前 ([fc1ff2c](https://github.com/NervJS/taro/commit/fc1ff2c))
* **transformer:** 提前处理字符串模板，不再加入匿名 state ([75c5032](https://github.com/NervJS/taro/commit/75c5032))
* **transformer:** 根据 process.env.TARO_ENV 去除无用条件代码 ([eee9923](https://github.com/NervJS/taro/commit/eee9923))
* **webpack-plugin:** 添加html、define插件 ([a212b48](https://github.com/NervJS/taro/commit/a212b48))
* **webpack-runner:** h5配置项调整 ([b140ff5](https://github.com/NervJS/taro/commit/b140ff5))
* **webpack-runner:** 优化devServer配置 ([86da585](https://github.com/NervJS/taro/commit/86da585))
* **webpack-runner:** 优化编译信息展示 ([b65133b](https://github.com/NervJS/taro/commit/b65133b))
* **webpack-runner:** 修复import与extract插件的配置错误 ([bfae27a](https://github.com/NervJS/taro/commit/bfae27a))
* **webpack-runner:** 加入webpack-runner配置项的deprecate提示 ([8ceee13](https://github.com/NervJS/taro/commit/8ceee13))
* **webpack-runner:** 增加chunkFileName配置支持 ([c7c0d00](https://github.com/NervJS/taro/commit/c7c0d00))
* **webpack-runner:** 支持enableExtract配置 ([e2782cb](https://github.com/NervJS/taro/commit/e2782cb))
* **webpack-runner:** 支持h5.webpackChain参数 ([3c2eb8d](https://github.com/NervJS/taro/commit/3c2eb8d))



<a name="1.0.0-beta.26"></a>
# [1.0.0-beta.26](https://github.com/NervJS/taro/compare/v1.0.0-beta.25...v1.0.0-beta.26) (2018-09-10)


### Bug Fixes

* **RN:**  startWith  to startsWith ([20f82b8](https://github.com/NervJS/taro/commit/20f82b8))
* **taro-weapp:** 将 componentDidUpdate 放到 setData 回调中执行，close [#596](https://github.com/NervJS/taro/issues/596) ([ef51c81](https://github.com/NervJS/taro/commit/ef51c81))


### Features

* **cli:** 支持小程序分包 ([9bb3e98](https://github.com/NervJS/taro/commit/9bb3e98))



<a name="1.0.0-beta.25"></a>
# [1.0.0-beta.25](https://github.com/NervJS/taro/compare/v1.0.0-beta.24...v1.0.0-beta.25) (2018-09-06)


### Bug Fixes

* **cli:** 更换清空目录 API ，解决部分机器上编译报错问题 ([a22c385](https://github.com/NervJS/taro/commit/a22c385))
* **eslint:** 某些情况循环中使用 map 解析错误 ([b3ae01d](https://github.com/NervJS/taro/commit/b3ae01d))
* **RN:** 修复了 redux  模版未用 Text 组件包裹导致不显示的问题 ([4a260ca](https://github.com/NervJS/taro/commit/4a260ca))
* **RN:** 修复未引入样式的js也会生成对应的 style 文件的 bug ([0511580](https://github.com/NervJS/taro/commit/0511580))
* **RN:** 兼容小程序的路有跳转规范 ([1b2875d](https://github.com/NervJS/taro/commit/1b2875d))
* **router:** 修复某些情况获取不到$router问题 ([075ae2d](https://github.com/NervJS/taro/commit/075ae2d))
* **taro-compontents:**  修复 Block 返回问题 && 修复 form 文档问题 ([0c9a4cc](https://github.com/NervJS/taro/commit/0c9a4cc))
* **taro-redux:** connect时将redux而来的props从配置中剔除 ([42c8be6](https://github.com/NervJS/taro/commit/42c8be6))
* **taro-redux:** 兼容properties配置可能为空或mapState返回空的情况 ([f7a6c27](https://github.com/NervJS/taro/commit/f7a6c27))
* **tcr:** ScrollView在无外部元素的时候会全屏 ([2c7e981](https://github.com/NervJS/taro/commit/2c7e981))
* **tcr:** 给ScrollView加了样式height导致无法滚动，fix [#577](https://github.com/NervJS/taro/issues/577) ([1e1999d](https://github.com/NervJS/taro/commit/1e1999d))
* **transformer:**  增加 Block 组件 ([9635c1d](https://github.com/NervJS/taro/commit/9635c1d))
* **transformer:** 即便在类中没有找到方法也要加到 $events, close [#563](https://github.com/NervJS/taro/issues/563) ([33c8c38](https://github.com/NervJS/taro/commit/33c8c38))
* **transformer:** 多个 `this.props` 在 JSX children 中无法使用 ([5dd8f12](https://github.com/NervJS/taro/commit/5dd8f12))
* **transformer:** 解析图片地址错误 ([3e6eb3a](https://github.com/NervJS/taro/commit/3e6eb3a))


### Features

* 文档底部导航兼容移动端 ([1a49e2f](https://github.com/NervJS/taro/commit/1a49e2f))
* 更新.gitignore ([3fac0d9](https://github.com/NervJS/taro/commit/3fac0d9))
* 更新siteConfig.js ([bebe4c0](https://github.com/NervJS/taro/commit/bebe4c0))
* **cli:** 小程序支持插件引用 ([0d256fe](https://github.com/NervJS/taro/commit/0d256fe))
* **cli:** 模板增加 rn 编译 script ([a216ee8](https://github.com/NervJS/taro/commit/a216ee8))
* **taro:** 增加 Taro.requirePlugin 调用插件 JS 接口 ([f65c51f](https://github.com/NervJS/taro/commit/f65c51f))
* **transformer:** 在 render 中提前 return null 可以终止 render ([a093b8e](https://github.com/NervJS/taro/commit/a093b8e))



<a name="1.0.0-beta.24"></a>
# [1.0.0-beta.24](https://github.com/NervJS/taro/compare/v1.0.0-beta.23...v1.0.0-beta.24) (2018-09-05)


### Bug Fixes

* **cli:** h5 编译去掉 api 初始化 ([8d824cf](https://github.com/NervJS/taro/commit/8d824cf))
* **cli:** 模板去掉 cli 依赖 ([84f33b7](https://github.com/NervJS/taro/commit/84f33b7))
* **taro-h5:** api 初试化提前 ([b8b02fd](https://github.com/NervJS/taro/commit/b8b02fd))
* **transformer:** this.$router 无法加入 state ([e9eacb4](https://github.com/NervJS/taro/commit/e9eacb4))


### Features

* **taro-components:** 新增 block 组件 (内置组件，小程序转 Taro使用到) ([6cb1364](https://github.com/NervJS/taro/commit/6cb1364))
* **taro-components:** 新增 block 组件 (内置组件，小程序转 Taro使用到) ([b7096a9](https://github.com/NervJS/taro/commit/b7096a9))



<a name="1.0.0-beta.23"></a>
# [1.0.0-beta.23](https://github.com/NervJS/taro/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2018-09-03)


### Bug Fixes

* mapStateToProps 缺少第二个参数ownProps ([0236314](https://github.com/NervJS/taro/commit/0236314))
* **cli:** json 文件解析错误, close [#547](https://github.com/NervJS/taro/issues/547) ([176c117](https://github.com/NervJS/taro/commit/176c117))
* **RN:** 修复全局样式文件硬编码的问题 ([f5012a3](https://github.com/NervJS/taro/commit/f5012a3))
* **taro-components:** input 去除默认字体 && 删除样式 Swpier 样式分号问题 ([40e8828](https://github.com/NervJS/taro/commit/40e8828))
* **taro-weapp:** 补全完整的错误提示 ([bf1b89f](https://github.com/NervJS/taro/commit/bf1b89f))
* **transformer:** 第三方组件也应该正常处理事件 ([2920f33](https://github.com/NervJS/taro/commit/2920f33))
* **transformer-wx:** 增加默认基础组件，fix [#562](https://github.com/NervJS/taro/issues/562) ([e288fc4](https://github.com/NervJS/taro/commit/e288fc4))
* **weapp:** 修复props传递函数bind作用域被覆盖问题 ([5676b80](https://github.com/NervJS/taro/commit/5676b80))
* **weapp:** 修复在render中通过return来中断代码执行可能会造成state丢失的问题 ([5402dff](https://github.com/NervJS/taro/commit/5402dff))


### Features

* **taro:** 增加 Event.once 方法，close [#402](https://github.com/NervJS/taro/issues/402) ([06b9e7a](https://github.com/NervJS/taro/commit/06b9e7a))



<a name="1.0.0-beta.22"></a>
# [1.0.0-beta.22](https://github.com/NervJS/taro/compare/v1.0.0-beta.21...v1.0.0-beta.22) (2018-08-30)


### Bug Fixes

* **cli:** 优化组件判断 ([fb404f1](https://github.com/NervJS/taro/commit/fb404f1))
* **weapp:** 修复构造函数里的state覆盖的问题 ([38efaf1](https://github.com/NervJS/taro/commit/38efaf1))



<a name="1.0.0-beta.21"></a>
# [1.0.0-beta.21](https://github.com/NervJS/taro/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2018-08-30)


### Bug Fixes

* **cli:** 优化是否是 taro 组件的判断方式 ([d835113](https://github.com/NervJS/taro/commit/d835113))
* **cli:** 添加 babel-plugin-transform-jsx-to-stylesheet 到 update 命令的更新列表 ([8bd231a](https://github.com/NervJS/taro/commit/8bd231a))
* **weapp:** 修复setState时对象减少字段无法更新到的问题 ([05256c3](https://github.com/NervJS/taro/commit/05256c3))


### Features

* **cli:** ui 库编译引入静态资源中引入的文件 ([5aaa772](https://github.com/NervJS/taro/commit/5aaa772))
* **cli:** 编译增加错误信息暴露 ([2d76055](https://github.com/NervJS/taro/commit/2d76055))
* **RN:**  RN 的 temp 目录改为 .rn_temp ([0ba6069](https://github.com/NervJS/taro/commit/0ba6069))
* **RN:** 去掉多余的log ([883be60](https://github.com/NervJS/taro/commit/883be60))
* **weapp:** 对于非内部跳转的页面保持原有的处理的方式 ([48326f5](https://github.com/NervJS/taro/commit/48326f5))



<a name="1.0.0-beta.20"></a>
# [1.0.0-beta.20](https://github.com/NervJS/taro/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2018-08-29)


### Bug Fixes

* **taro-components:** 修复 Swiper onChange 事件 && Input type 值优化 ([077f634](https://github.com/NervJS/taro/commit/077f634))
* **transformer:** 在 JSX 中使用注释会导致 Windows 多出一个空行 ([1051b45](https://github.com/NervJS/taro/commit/1051b45))


### Features

* **weapp:** 生命周期与小程序靠齐,页面初始化时机提前至attached ([e9e089b](https://github.com/NervJS/taro/commit/e9e089b))



<a name="1.0.0-beta.19"></a>
# [1.0.0-beta.19](https://github.com/NervJS/taro/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2018-08-28)


### Bug Fixes

* **cli:** ui 库编译出错，路径处理错误 ([f39aaba](https://github.com/NervJS/taro/commit/f39aaba))
* **cli:** 添加  prop-types 到 cli 的 package.json 中 ([940cf8a](https://github.com/NervJS/taro/commit/940cf8a))
* **RN:** path.sep 生成的路径分隔符 \\  无法识别 ([1cdb475](https://github.com/NervJS/taro/commit/1cdb475))
* **RN:** 修复样式使用 classnames 报错问题 ([f94702d](https://github.com/NervJS/taro/commit/f94702d))
* **router:** 修复navigateBack不带参数时报错的问题 ([5ba0838](https://github.com/NervJS/taro/commit/5ba0838))
* **taro:** children 的类型定义使用 readonly any ([33dfa47](https://github.com/NervJS/taro/commit/33dfa47))
* **taro-conpontens:** 修复单列选择器 rangeKey 问题 && 默认值问题 ([1583acb](https://github.com/NervJS/taro/commit/1583acb))
* **taro-weapp:** 低版本 IOS 下部分属性不能直接访问 ([daab0d4](https://github.com/NervJS/taro/commit/daab0d4))
* **taro-weapp:** 修复 componentDidCatchError 和 componentDidNotFound 丢失参数的问题 ([243dc26](https://github.com/NervJS/taro/commit/243dc26))
* **tcr:** Input 回车没触发onKeyDown事件，使用onSubmitEditing来执行回调 ([1006343](https://github.com/NervJS/taro/commit/1006343))


### Features

* **cli:** ui 库编译解析样式文件之间的引用 ([1fb806b](https://github.com/NervJS/taro/commit/1fb806b))



<a name="1.0.0-beta.18"></a>
# [1.0.0-beta.18](https://github.com/NervJS/taro/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2018-08-27)


### Bug Fixes

* **cli:** ui 库打包，小程序端只有引用到的资源才打包进 dist 目录 ([2835615](https://github.com/NervJS/taro/commit/2835615))
* **taro:** 更新 this.props.children 为 never 类型 ([db70d12](https://github.com/NervJS/taro/commit/db70d12))
* **transformer:** className -> class 只作用于自定义组件 ([0b4d7ce](https://github.com/NervJS/taro/commit/0b4d7ce))
* **transformer:** 有 if return 时会继续执行后续语句 ([89d319f](https://github.com/NervJS/taro/commit/89d319f))
* **transformer:** 第三方组件不处理 key 和事件，close [#521](https://github.com/NervJS/taro/issues/521) ([4b72496](https://github.com/NervJS/taro/commit/4b72496))
* **weapp:** 过滤data时避免改变对象属性的顺序 ([66da471](https://github.com/NervJS/taro/commit/66da471))


### Features

* **RN:**  添加 babel-plugin-transform-jsx-to-stylesheet ([f038e65](https://github.com/NervJS/taro/commit/f038e65))
* **RN:** 支持全局样式 ([9e6b0f1](https://github.com/NervJS/taro/commit/9e6b0f1))



<a name="1.0.0-beta.17"></a>
# [1.0.0-beta.17](https://github.com/NervJS/taro/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2018-08-25)


### Bug Fixes

* **cli:** 组件中引用 node_modules 中组件问题修复 ([f3abbd9](https://github.com/NervJS/taro/commit/f3abbd9))
* **weapp:** nextTick 增加使用 wx.nextTick ([eff17cc](https://github.com/NervJS/taro/commit/eff17cc))
* **weapp:** 保留组件提前渲染的逻辑 ([60faca1](https://github.com/NervJS/taro/commit/60faca1))
* **weapp:** 修复页面组件detached造成动态组件渲染出错的问题 ([6cdd6a7](https://github.com/NervJS/taro/commit/6cdd6a7))


### Features

* **components:** 优化组件库打包 ([ea6be1f](https://github.com/NervJS/taro/commit/ea6be1f))
* **docs:** 添加 RN 端的文档 ([11d0066](https://github.com/NervJS/taro/commit/11d0066))
* **tcr:** 增加Input 和 Textarea的onKeyDown事件支持，并加上event.target ([ca25786](https://github.com/NervJS/taro/commit/ca25786))
* **tcr:** 所有Input和Textarea事件加上event.target ([2b4f1db](https://github.com/NervJS/taro/commit/2b4f1db))
* **weapp:** setData时保留undefined字段，小程序会有错误提示 ([d411891](https://github.com/NervJS/taro/commit/d411891))
* **weapp:** setState优化 ([e04cab3](https://github.com/NervJS/taro/commit/e04cab3))



<a name="1.0.0-beta.16"></a>
# [1.0.0-beta.16](https://github.com/NervJS/taro/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2018-08-23)


### Bug Fixes

* **eslint:** if-statement-in-map-loop 检查错误, fix [#510](https://github.com/NervJS/taro/issues/510) ([daa0031](https://github.com/NervJS/taro/commit/daa0031))
* **redux:** 修复 shallowEqual 判断问题 ([8265811](https://github.com/NervJS/taro/commit/8265811))
* **taro-components:** 修复 Input password 类型不生效问题 (对齐小程序) ([b2bfe8c](https://github.com/NervJS/taro/commit/b2bfe8c))
* **taro-components:** 修复swiper 滑动问题 ([79c3e25](https://github.com/NervJS/taro/commit/79c3e25))
* **transformer:** 事件传递有误 ([62b4337](https://github.com/NervJS/taro/commit/62b4337))
* **weapp:** 有多个页面时分别记录页面初始化的状态 ([643a8ff](https://github.com/NervJS/taro/commit/643a8ff))


### Features

* **postcss-pxtransform:** 支持样式重制类的代码在 RN 端编译时通过块注释剔除 ([3aa5ebf](https://github.com/NervJS/taro/commit/3aa5ebf))
* **RN:**  postcss-pxtransform 插件支持 RN 端，并更新相关文档 ([dac2912](https://github.com/NervJS/taro/commit/dac2912))



<a name="1.0.0-beta.15"></a>
# [1.0.0-beta.15](https://github.com/NervJS/taro/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2018-08-22)


### Bug Fixes

* **cli:** 修复ast转换后缺失nervjs的问题 ([01c4c58](https://github.com/NervJS/taro/commit/01c4c58))
* **cli:** 小程序端 npm 抽离文件没有补全文件完整路径 ([c08aba0](https://github.com/NervJS/taro/commit/c08aba0))
* **cli:** 小程序端自定义组件不再引用 app.wxss ([3b0431f](https://github.com/NervJS/taro/commit/3b0431f))
* **eslint:** 使用 ref 不报错 ([e5afc21](https://github.com/NervJS/taro/commit/e5afc21))


### Features

* **tcr:** 支持Text onClick事件 ([874002d](https://github.com/NervJS/taro/commit/874002d))
* **transformer:** 支持函数 ref ([86d396e](https://github.com/NervJS/taro/commit/86d396e))
* **transformer:** 支持字符串 ref ([8ea9366](https://github.com/NervJS/taro/commit/8ea9366))
* **weapp:** ref获取组件示例的时机提前 ([a03c203](https://github.com/NervJS/taro/commit/a03c203))
* **weapp:** 支持refs选择节点或组件 ([7f6403e](https://github.com/NervJS/taro/commit/7f6403e))
* **weapp:** 支持设置的static options ([c7edab4](https://github.com/NervJS/taro/commit/c7edab4))



<a name="1.0.0-beta.14"></a>
# [1.0.0-beta.14](https://github.com/NervJS/taro/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2018-08-22)


### Bug Fixes

* **cli:** 小程序端样式中带有 background 解析错误，fix [#507](https://github.com/NervJS/taro/issues/507) ([cf5475f](https://github.com/NervJS/taro/commit/cf5475f))
* **cli:** 小程序端组件样式引入 app.wxss 路径错误 ([87489bc](https://github.com/NervJS/taro/commit/87489bc))



<a name="1.0.0-beta.13"></a>
# [1.0.0-beta.13](https://github.com/NervJS/taro/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2018-08-21)


### Bug Fixes

* **transformer:** 修复在循环中定义 JSX 引用变量报错 ([1e05877](https://github.com/NervJS/taro/commit/1e05877))



<a name="1.0.0-beta.12"></a>
# [1.0.0-beta.12](https://github.com/NervJS/taro/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2018-08-21)


### Bug Fixes

* **cli:** process.env.TARO_ENV 判断兼容 ([6bc0de5](https://github.com/NervJS/taro/commit/6bc0de5))
* **cli:** 小程序端编译不能支持文件名中带 . 分割 ([b68b983](https://github.com/NervJS/taro/commit/b68b983))
* **cli:** 小程序端页面判断逻辑优化 ([44ba3cc](https://github.com/NervJS/taro/commit/44ba3cc))
* **cli:** 统一判断文件是否是页面的方式 ([a5fea58](https://github.com/NervJS/taro/commit/a5fea58))
* **cli:** 页面不能作为组件来引用，增加提醒 ([ae1a105](https://github.com/NervJS/taro/commit/ae1a105))
* **eslint:** canvas 可以在 taro 中使用 ([b460b45](https://github.com/NervJS/taro/commit/b460b45))
* **router, redux-h5:** 修复connect组件后退时重新构造的问题 ([370e91b](https://github.com/NervJS/taro/commit/370e91b))
* **taro-components:**  修复 image mode 为 widthFix 样式问题 ([7272f42](https://github.com/NervJS/taro/commit/7272f42))
* **taro-components:** 修复onScroll 事件 配合 scrollWithAnimation 属性触发死循环问题 ([8dcb1af](https://github.com/NervJS/taro/commit/8dcb1af))
* **taro-components:** 开放 Input 组件 type 类型 ([7105ef4](https://github.com/NervJS/taro/commit/7105ef4))
* **taro-compontens:** 修复 form 表单样式问题 ([6f5cf9e](https://github.com/NervJS/taro/commit/6f5cf9e))
* **taro-transformer-wx:** 集合中添加缺失的默认组件 ([2c455ce](https://github.com/NervJS/taro/commit/2c455ce)), closes [#478](https://github.com/NervJS/taro/issues/478)
* **transformer:**  if 下面所有非匿名变量被从 state 中清除 ([318755b](https://github.com/NervJS/taro/commit/318755b))
* **transformer:** 未使用引入包忽略：[@tarojs](https://github.com/tarojs)/taro, react, nerv ([187e5a8](https://github.com/NervJS/taro/commit/187e5a8))
* **transformer:** 某些时候不返回正确的相对路径 ([5401154](https://github.com/NervJS/taro/commit/5401154))
* **weapp:** 修复willMount可能会触发多次问题 ([f0d7b6a](https://github.com/NervJS/taro/commit/f0d7b6a))
* **webpack-runner:** 修复[@import](https://github.com/import)没有解析相对路径的问题 ([d4e2b46](https://github.com/NervJS/taro/commit/d4e2b46))


### Features

* **cli:** 优化 UI 库编译，增加 process.env.TARO_ENV 标记用来进行代码编译时判断 ([73e9c8a](https://github.com/NervJS/taro/commit/73e9c8a))
* **cli:** 小程序端 npm 文件抽取使用 ast 分析的方式 ([90ba499](https://github.com/NervJS/taro/commit/90ba499))
* **cli:** 小程序端编译组件样式中默认引用全局样式 ([2b0cfb0](https://github.com/NervJS/taro/commit/2b0cfb0))
* **RN:** 优化 package.json 的组织方式，redux 的 storeName 配置与 H5 统一 ([579b992](https://github.com/NervJS/taro/commit/579b992))
* 新增 taro h5 模式的动态加载 import() 功能 ([36cb172](https://github.com/NervJS/taro/commit/36cb172))
* **RN:** 添加装饰器写法的支持 ([31b6d21](https://github.com/NervJS/taro/commit/31b6d21))
* **taro:** 增加 taro-utils ([e5981ae](https://github.com/NervJS/taro/commit/e5981ae))
* **taro-components:**  Input 组件 H5 端新增 file 类型 ([f0cf015](https://github.com/NervJS/taro/commit/f0cf015))
* **taro-redux:** 修正 redux 包发布目录 ([da10a0a](https://github.com/NervJS/taro/commit/da10a0a))
* **taro-router-rn:** 优化滚动代码 ([14e2db6](https://github.com/NervJS/taro/commit/14e2db6))
* **weapp:** 将组件里的static方法同步到小程序实例上 ([0aec65f](https://github.com/NervJS/taro/commit/0aec65f))



<a name="1.0.0-beta.11"></a>
# [1.0.0-beta.11](https://github.com/NervJS/taro/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2018-08-16)


### Bug Fixes

* **cli:** H5 端编译增加插入 Taro.initPxTransform 初始化 ([f27552f](https://github.com/NervJS/taro/commit/f27552f))
* **cli:** 更正 UI 库编译提示 ([fb71d60](https://github.com/NervJS/taro/commit/fb71d60))
* **router:** 将typing文件移到type文件夹中 ([8553821](https://github.com/NervJS/taro/commit/8553821))
* **taro-components:** 修复  Input 组件 h5 端 事件返回值问题 ([96d4790](https://github.com/NervJS/taro/commit/96d4790))
* **taro-components:** 修复h5 点击态阴影问题 ([7592648](https://github.com/NervJS/taro/commit/7592648))
* **taro-components:** 去除 input 的 min-height 默认样式 ([5aaac3a](https://github.com/NervJS/taro/commit/5aaac3a))
* **transformer:** 属性名为 `bind` 或 catch 的情况 ([6a1670a](https://github.com/NervJS/taro/commit/6a1670a))
* **transformer:** 当 if 中有复杂表达式时生成匿名 state 错误 ([82d3774](https://github.com/NervJS/taro/commit/82d3774))
* **weapp:** 初始化的时候将render替换为_createData ([8ab9f4d](https://github.com/NervJS/taro/commit/8ab9f4d))


### Features

* Update common.d.ts ([3315e9a](https://github.com/NervJS/taro/commit/3315e9a))
* Update Picker.d.ts ([0e26b27](https://github.com/NervJS/taro/commit/0e26b27))
* **cli:** appOutput 配置下决定 app.wxss 是否生成 ([819a6cc](https://github.com/NervJS/taro/commit/819a6cc))
* **cli:** UI 库编译功能完善 + 小程序端引用 UI 库 ([a046b47](https://github.com/NervJS/taro/commit/a046b47))
* **cli:** 完善 UI 库 H5 端编译 ([af58bdb](https://github.com/NervJS/taro/commit/af58bdb))
* **RN:** 支持 RN 编译时终端提示不支持的样式 ([e3657bf](https://github.com/NervJS/taro/commit/e3657bf))
* **RN:** 编译时自动检测并安装 babel-plugin-transform-jsx-stylesheet 插件 ([835ad49](https://github.com/NervJS/taro/commit/835ad49))
* **weapp:** 补充forceUpdate ([32cc5aa](https://github.com/NervJS/taro/commit/32cc5aa))
* **webpack-runner:** 调整 webpack 插件配置顺序 ([377cffc](https://github.com/NervJS/taro/commit/377cffc))



<a name="1.0.0-beta.10"></a>
# [1.0.0-beta.10](https://github.com/NervJS/taro/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2018-08-14)


### Bug Fixes

* **cli:** export from 写法时组件文件查找错误 ([fb9f084](https://github.com/NervJS/taro/commit/fb9f084))
* **cli:** tsconfig 模板重复键值对 ([9b1dd3f](https://github.com/NervJS/taro/commit/9b1dd3f))
* **cli:** 修改redux模板, 增加Ts类型约束 ([b49fdf8](https://github.com/NervJS/taro/commit/b49fdf8))
* **cli:** 修改注释类型,防止vsc错误的类型提示 ([f689494](https://github.com/NervJS/taro/commit/f689494))
* **cli:** 组件 watch 时偶尔不重新编译 ([88079c0](https://github.com/NervJS/taro/commit/88079c0))
* **eslint:** 允许 module.exports ([ec12e4f](https://github.com/NervJS/taro/commit/ec12e4f))
* **eslint-plugin-taro:** Cannot read property type of null ([56b9b96](https://github.com/NervJS/taro/commit/56b9b96))
* **taro:** 增加登录接口的回调参数 ([ecd7043](https://github.com/NervJS/taro/commit/ecd7043))
* **taro:** 建议修改回类型约束, 防止单词拼错等情况 ([c618b5c](https://github.com/NervJS/taro/commit/c618b5c))
* **taro-weapp:** Taro warn 在微信内的兼容性问题 ([7b1e4cf](https://github.com/NervJS/taro/commit/7b1e4cf))
* **weapp:** 去掉页面里初始化时加上的onShareAppMessage 等配置空函数 ([0db000f](https://github.com/NervJS/taro/commit/0db000f))
* **weapp:** 小程序canvas touch事件无currentTarget事件 ([f049b90](https://github.com/NervJS/taro/commit/f049b90))
* 更新 PickView 示例 & 修复 ScrollView 滚动问题 ([553aea3](https://github.com/NervJS/taro/commit/553aea3))


### Features

* **cli:** 默认 ts 模板支持使用 require ([b35f952](https://github.com/NervJS/taro/commit/b35f952))
* add component SwiperItem ([2420af0](https://github.com/NervJS/taro/commit/2420af0))
* **cli:** h5版本处理tsx的时候不再保留tsx后缀名 ([441448b](https://github.com/NervJS/taro/commit/441448b))
* **cli:** h5版本移除引用脚本的后缀名 ([84052a4](https://github.com/NervJS/taro/commit/84052a4))
* **cli:** 修改ts 模板的 require 使用webpack-env的typing文件 ([8fe9a20](https://github.com/NervJS/taro/commit/8fe9a20))
* **cli:** 增加 UI 库编译功能 ([8c30ab1](https://github.com/NervJS/taro/commit/8c30ab1))
* **cli:** 小程序端支持组件 export ... from ... 写法 ([27ff33e](https://github.com/NervJS/taro/commit/27ff33e))
* **cli:** 小程序端支持自定义 env ([d0ba5ef](https://github.com/NervJS/taro/commit/d0ba5ef))
* **eslint:** 新的 eslint 规则：自定义组件关键字 ([b9d3173](https://github.com/NervJS/taro/commit/b9d3173))
* **RN:**  支持 Redux ，默认开启 Page 滚动 ([ae5ab78](https://github.com/NervJS/taro/commit/ae5ab78))
* **taro:** Component 加上 $router 的 typing ([604c0fa](https://github.com/NervJS/taro/commit/604c0fa))
* **taro:** 修复 config 的 typing，close [#447](https://github.com/NervJS/taro/issues/447) ([da65f27](https://github.com/NervJS/taro/commit/da65f27))
* **transformer:** 支持直接传入 this.$router 的参数 ([706f394](https://github.com/NervJS/taro/commit/706f394))
* **webpack-runner:** webpack-runner不再需要ts-loader ([89559de](https://github.com/NervJS/taro/commit/89559de))



<a name="1.0.0-beta.9"></a>
# [1.0.0-beta.9](https://github.com/NervJS/taro/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2018-08-09)


### Bug Fixes

* **cli:** redux 模板加入 react typing ([59fc5ef](https://github.com/NervJS/taro/commit/59fc5ef))
* **cli:** redux 模板没有生成 tsconfig ([d4d62e4](https://github.com/NervJS/taro/commit/d4d62e4))
* **cli:** 修复 tsconfig 设置 ([a6e45ab](https://github.com/NervJS/taro/commit/a6e45ab))
* **cli:** 允许处理 .wxss 文件 ([afbc906](https://github.com/NervJS/taro/commit/afbc906))
* **eslint:** 在 map 循环中使用 if 解析错误 ([902d637](https://github.com/NervJS/taro/commit/902d637))
* **taro-components:** 修复动画样式兼容问题，修复宽度 or 高度 溢出导致的滚动条，修复事件问题 ([5bcdd4b](https://github.com/NervJS/taro/commit/5bcdd4b))
* **taro-weapp:** 避免出现当属性名被重命名后属性计算错误的问题 ([ccd48de](https://github.com/NervJS/taro/commit/ccd48de))
* **transformer:**  把手动写入的第三方组件当做内置组件处理 ([0bcb405](https://github.com/NervJS/taro/commit/0bcb405))
* **transformer:** 修复使用 TS 编译在多个类属性函数丢失其中一个的情况 ([966edf9](https://github.com/NervJS/taro/commit/966edf9))
* **weapp:** 组件创建时减少一次多余的实例化 ([7169ee0](https://github.com/NervJS/taro/commit/7169ee0))


### Features

* **router:** 加入 taro-router 的 typing ([866c804](https://github.com/NervJS/taro/commit/866c804))
* **taro-cli:** 添加 babel-plugin-transform-jsx-stylesheet ，优化 RN 样式编译，className 支持表达式 ([7da1b36](https://github.com/NervJS/taro/commit/7da1b36))
* **taro-h5:** 增加 systemInfo、networkType 的相关 API，并为其补全测试用例及文档 ([9b84411](https://github.com/NervJS/taro/commit/9b84411))
* **taro-router-rn:** 全局配置 enablePullDownRefresh ([3b590f5](https://github.com/NervJS/taro/commit/3b590f5))
* **taro-router-rn:** 实现页面事件 onPageScroll ([99a91fb](https://github.com/NervJS/taro/commit/99a91fb))
* **taro-router-rn:** 添加 wx.startPullDownRefresh 及 wx.stopPullDownRefresh ([4694ded](https://github.com/NervJS/taro/commit/4694ded))
* **taro-weapp:** 将 initNativeApi 的执行时机提前，可以在任何地方放心使用 ([13cbc4d](https://github.com/NervJS/taro/commit/13cbc4d))
* **transformer:** 从 this.props 结构出来的函数可以在任意作用域调用 ([2c723c1](https://github.com/NervJS/taro/commit/2c723c1))
* **transformer:** 去除没有使用的 import ([0030246](https://github.com/NervJS/taro/commit/0030246))



<a name="1.0.0-beta.8"></a>
# [1.0.0-beta.8](https://github.com/NervJS/taro/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2018-08-07)


### Bug Fixes

* **cli:** json 文件解析有误 ([1d675aa](https://github.com/NervJS/taro/commit/1d675aa))
* **cli:** 小程序端 export default 基类继承 ([11cf47a](https://github.com/NervJS/taro/commit/11cf47a))
* **taro-router-rn:** react-navigator 报错 ([21ca1b4](https://github.com/NervJS/taro/commit/21ca1b4))
* **transformer:** 自定义组件不对 style 进行特殊处理 ([10a4183](https://github.com/NervJS/taro/commit/10a4183))


### Features

* **taro:** 加入小程序 config 的类型说明 ([9208deb](https://github.com/NervJS/taro/commit/9208deb))
* **taro:** 增加 Taro.pxTransform API 用于处理行内样式中单位转换，close [#388](https://github.com/NervJS/taro/issues/388) ([cae84f3](https://github.com/NervJS/taro/commit/cae84f3))
* **taro:** 更新 Taro typings ([c6b73cd](https://github.com/NervJS/taro/commit/c6b73cd))
* **weapp:** 支持小程序behaviors ([7b39644](https://github.com/NervJS/taro/commit/7b39644))



<a name="1.0.0-beta.7"></a>
# [1.0.0-beta.7](https://github.com/NervJS/taro/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2018-08-06)


### Bug Fixes

* **cli:** 修复h5中缺少一个变量定义的问题 ([1688e53](https://github.com/NervJS/taro/commit/1688e53))
* **transformer:** 处理 this.state.a.b[this.state.a.b.c] 这样的情况 ([ba458c9](https://github.com/NervJS/taro/commit/ba458c9))
* **transformer:** 某些情况成员表达式不会加入到 pendingState ([e4029bd](https://github.com/NervJS/taro/commit/e4029bd))
* 添加注释，去除 package-lock-json ([9d17a6a](https://github.com/NervJS/taro/commit/9d17a6a))


### Features

* RN 上拉下拉组件 ([87e0e5f](https://github.com/NervJS/taro/commit/87e0e5f))
* **cli:** 小程序端 npm 目录支持配置 ([9a816a5](https://github.com/NervJS/taro/commit/9a816a5))
* **cli:** 小程序端支持自定义组件基类继承的形式 ([0b2a5fd](https://github.com/NervJS/taro/commit/0b2a5fd))
* **cli:** 小程序端新增是否需要生成 app.js、app.json 文件的配置选项 ([23fd918](https://github.com/NervJS/taro/commit/23fd918))
* **taro-compontens:** 补全文档及示例代码 ([3368869](https://github.com/NervJS/taro/commit/3368869))
* **taro-router0rn:**  taro-router-rn 添加进 learna，使用 ejs 模版生成 RN 工程的 package.json ([47225aa](https://github.com/NervJS/taro/commit/47225aa))
* **transformer:** 支持在 if 中使用 bind 对象或使用字面量对象 ([e6b005a](https://github.com/NervJS/taro/commit/e6b005a))
* **transformer:** 支持继承自定义组件 ([1a339c7](https://github.com/NervJS/taro/commit/1a339c7))
* **weapp:** 组件提前计算好初始的state,并将初次setData执行时机提前到attached中 ([26ffa3a](https://github.com/NervJS/taro/commit/26ffa3a))



<a name="1.0.0-beta.6"></a>
# [1.0.0-beta.6](https://github.com/NervJS/taro/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2018-08-02)


### Bug Fixes

* **cli:** windows 下 watch 组件编译加个延时 ([94cc025](https://github.com/NervJS/taro/commit/94cc025))
* **cli:** 兼容 app 的 constructor 中使用 this.config= 来定义 config 的写法 ([9ce5580](https://github.com/NervJS/taro/commit/9ce5580))
* **taro:** 增加 style 传入 null 及 undefined 的容错 ([037ad37](https://github.com/NervJS/taro/commit/037ad37))
* **taro:** 当样式为 null 或 undefined 时返回空字符串 ([f50b27e](https://github.com/NervJS/taro/commit/f50b27e))
* **taro-cli:** RN 开启 watch 样式文件不重新编译 ([23fba9f](https://github.com/NervJS/taro/commit/23fba9f))
* **taro-h5:** Taro.request 处理 success / fail / complete，[#330](https://github.com/NervJS/taro/issues/330) ([d9d36f9](https://github.com/NervJS/taro/commit/d9d36f9))
* **taro-h5:** 修复交互反馈类 API 的样式兼容性，并提供了类名以便用户覆盖样式 ([b3d12cb](https://github.com/NervJS/taro/commit/b3d12cb))
* **taro-weapp:** setData 空对象过滤 ([79196f3](https://github.com/NervJS/taro/commit/79196f3))
* **transformer:** typescript 转换丢失 config ([d5e3850](https://github.com/NervJS/taro/commit/d5e3850))


### Features

* **transformer:** 使用 tslib 减少 ts 的编译文件大小 ([d01cfb2](https://github.com/NervJS/taro/commit/d01cfb2))
* **transformer:** 支持在 if 块作用域中生成匿名表达式，定义变量 ([565af24](https://github.com/NervJS/taro/commit/565af24))



<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/NervJS/taro/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2018-08-01)


### Bug Fixes

* **cli:** watch 时修改组件报错后，再次修改组件无法编译 ([48fca4d](https://github.com/NervJS/taro/commit/48fca4d))
* **eslint:** 生命周期函数不需要遵循方法命名规范 ([774f7ba](https://github.com/NervJS/taro/commit/774f7ba))
* **taro-weapp:** 修复setData 前移出掉数据中的函数时将null转换成空对象问题 ([3a914ca](https://github.com/NervJS/taro/commit/3a914ca))
* **taro-weapp:** 修复state里空数组会被移除的问题 ([3252241](https://github.com/NervJS/taro/commit/3252241))
* **taro-weapp:** 修复将page的数据初始化提前构造函数中的数据丢失问题 ([39b5401](https://github.com/NervJS/taro/commit/39b5401))


### Features

* 添加 getCurrentPages 方法，补充注释 ([6b73e53](https://github.com/NervJS/taro/commit/6b73e53))
* **eslint:** 新规则 class naming，自定义组件不得与原生组件重名 ([329ec3a](https://github.com/NervJS/taro/commit/329ec3a))
* **taro-rn:** 增加media的测试用例 ([935cd00](https://github.com/NervJS/taro/commit/935cd00))
* **transformer:** 使用 typescript 编译 .tsx 文件，may fix [#396](https://github.com/NervJS/taro/issues/396) [#392](https://github.com/NervJS/taro/issues/392) ([61d3e24](https://github.com/NervJS/taro/commit/61d3e24))
* **transformer:** 在构造器里声明类函数 ([f317934](https://github.com/NervJS/taro/commit/f317934))
* **weapp:** 小程序的 properties 从 defaultProps 当中找 ([96ae2d4](https://github.com/NervJS/taro/commit/96ae2d4))



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/NervJS/taro/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2018-08-01)


### Bug Fixes

* **taro-weapp:** setData前移除数据里的函数问题修复 ([3a3e143](https://github.com/NervJS/taro/commit/3a3e143))
* **taro-weapp:** 修复过滤data里的函数时将数组转成obj问题 ([364b27d](https://github.com/NervJS/taro/commit/364b27d))
* **taro-weapp:** 首次调用 _createData() 时加上 try catch ([6f13217](https://github.com/NervJS/taro/commit/6f13217))
* **transformer:** 部分生命周期不写参数报错 ([bf4abd6](https://github.com/NervJS/taro/commit/bf4abd6))



<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/NervJS/taro/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2018-07-31)


### Bug Fixes

* **taro:** 去掉重复的代码引用 ([cf324fb](https://github.com/NervJS/taro/commit/cf324fb))
* **taro-h5:** 将兼容性稍差的 String.includes 替换成 String.indexOf ([1ed4e16](https://github.com/NervJS/taro/commit/1ed4e16))
* **taro-weapp:** defaultProps 处理错误 ([8239556](https://github.com/NervJS/taro/commit/8239556))
* **taro-weapp:** setData 前移出掉数据中的函数 ([cca3ed6](https://github.com/NervJS/taro/commit/cca3ed6))
* **taro-weapp:** state 与 props 优先级 ([de7db67](https://github.com/NervJS/taro/commit/de7db67))
* **taro-weapp:** 修复小程序组件ready时不一定attached导致this.$component未定义报错 ([4799ca2](https://github.com/NervJS/taro/commit/4799ca2))
* **taro-weapp:** 修复页面onShow执行时机问题 ([7a2f790](https://github.com/NervJS/taro/commit/7a2f790))
* **taro-weapp:** 修正组件 onShareAppMessage 等生命周期方法调用 ([fdac132](https://github.com/NervJS/taro/commit/fdac132))
* **taro-weapp:** 在生命周期中插入构造函数副本，用于修复构造函数中获取不到完整props的问题 ([97d882f](https://github.com/NervJS/taro/commit/97d882f))
* **taro-weapp:** 暂时将页面的类初始化放到最开始的地方 ([c5a488b](https://github.com/NervJS/taro/commit/c5a488b))
* **taro-weapp:** 组件props默认值{} ([7489082](https://github.com/NervJS/taro/commit/7489082))
* **transformer:** 当只有 state 的名称是一个合法的变量名才加入到 pendingState ([8ca906d](https://github.com/NervJS/taro/commit/8ca906d))


### Features

* tabBar 配置与切换 ([9aaf5a7](https://github.com/NervJS/taro/commit/9aaf5a7))
* tabBar 默认样式及样式关联 ([289fd80](https://github.com/NervJS/taro/commit/289fd80))
* 添加默认头部样式 ([a920e98](https://github.com/NervJS/taro/commit/a920e98))
* **cli:** 小程序端编译支持 Taro 代码与原生小程序页面、组件代码混写 ([8d47c46](https://github.com/NervJS/taro/commit/8d47c46))
* **cli:** 小程序端编译支持引用第三方组件 ([66de1ca](https://github.com/NervJS/taro/commit/66de1ca))
* **taro-weapp:** weapp 增加 compile 配置用于配置编译时的一些操作 ([815f67c](https://github.com/NervJS/taro/commit/815f67c))
* **transformer:** 在生命周期使用 props.xx 也会注入到 static properties ([68d5817](https://github.com/NervJS/taro/commit/68d5817))
* **transformer:** 提升错误报告的健壮性 ([2b15281](https://github.com/NervJS/taro/commit/2b15281))
* **transformer|cli:** 类定义支持 ClassDeclaration 和 ClassExpression 两种模式 ([c34bd14](https://github.com/NervJS/taro/commit/c34bd14))



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/NervJS/taro/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2018-07-30)


### Bug Fixes

* **cli:** 在app.js中加入componentDidShow/componentDidHide的调用 ([e8376cf](https://github.com/NervJS/taro/commit/e8376cf))
* **cli:** 默认模版类型拓展为 .js、.jsx、.tsx ([90b2e0a](https://github.com/NervJS/taro/commit/90b2e0a))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([b7213f9](https://github.com/NervJS/taro/commit/b7213f9))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([54ca2a1](https://github.com/NervJS/taro/commit/54ca2a1))
* **taro-weapp:** 修复属性中函数作为条件判断的情况 ([a9a48f5](https://github.com/NervJS/taro/commit/a9a48f5))
* **taro-weapp:** 修正 defaultProps 获取 ([19b4f15](https://github.com/NervJS/taro/commit/19b4f15))
* **taro-weapp:** 修正 props 中 redux 函数传递 ([6841694](https://github.com/NervJS/taro/commit/6841694))
* **taro-weapp:** 函数类型属性处理错误 ([7d10b01](https://github.com/NervJS/taro/commit/7d10b01))
* **transformer:** slot 标签不需要加 _triggerObserer ([991d1c2](https://github.com/NervJS/taro/commit/991d1c2))
* **transformer:** 在 JSX 中使用数组对象会被识别为复杂表达式 ([c893c84](https://github.com/NervJS/taro/commit/c893c84))
* **transformer:** 当有多个匿名 state 且没有写 return 时循环组件生成匿名 state 异常 ([5328171](https://github.com/NervJS/taro/commit/5328171))
* **transformer:** 自定义组件调用从 this.props 的函数应该加入到 static properties ([45ac75f](https://github.com/NervJS/taro/commit/45ac75f))


### Features

* App 里 Header 相关配置的转换。 ([746ca09](https://github.com/NervJS/taro/commit/746ca09))
* **eslint:** 只有 Taro.Component 作用域下方法命名规范才起作用 ([0082e99](https://github.com/NervJS/taro/commit/0082e99))
* **eslint:** 新的函数命名规范 ([63cb96a](https://github.com/NervJS/taro/commit/63cb96a))
* **taro-h5:** 增加 request 的测试用例 ([bc8e2ab](https://github.com/NervJS/taro/commit/bc8e2ab))
* 去掉对 pages 配置字段的处理，直接作为 ScreenName ([8d1ff98](https://github.com/NervJS/taro/commit/8d1ff98))
* **taro-weapp:** 支持 externalClasses ([edeffc5](https://github.com/NervJS/taro/commit/edeffc5))
* **transformer:** 加入自定义组件是否传入组件的判断 ([a20e6b1](https://github.com/NervJS/taro/commit/a20e6b1))
* **transformer:** 当 if 表达式含有 JSX 元素和复杂表达式时生成匿名 state ([f1414ed](https://github.com/NervJS/taro/commit/f1414ed))
* **transformer:** 支持使用 || 逻辑表达式 ([3202b49](https://github.com/NervJS/taro/commit/3202b49))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/NervJS/taro/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-07-27)


### Bug Fixes

* **transformer-wx:** props 接受函数转换不正确影响到非函数调用的情况 ([4b394e8](https://github.com/NervJS/taro/commit/4b394e8))
* **weapp:** onPageScroll 等页面方法参数丢失 ([b1677cb](https://github.com/NervJS/taro/commit/b1677cb))
* **weapp:** 修复组件接受不到 props 的问题 && 修正组件生命周期执行 ([eebf6fe](https://github.com/NervJS/taro/commit/eebf6fe))


### Features

* **taro-rn:** 增加request的测试用例 ([37f40b4](https://github.com/NervJS/taro/commit/37f40b4))
* 创建中间层 Component，注入 $router ([9f0f79a](https://github.com/NervJS/taro/commit/9f0f79a))
* 实现页面跳转 ([9406669](https://github.com/NervJS/taro/commit/9406669))
* 转换页面 config 中头部相关的配置 ([9a685b1](https://github.com/NervJS/taro/commit/9a685b1))



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/NervJS/taro/compare/v0.0.73...v1.0.0-beta.0) (2018-07-26)


### Bug Fixes

* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([77c99d4](https://github.com/NervJS/taro/commit/77c99d4))
* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([8271c0f](https://github.com/NervJS/taro/commit/8271c0f))
* **redux-h5:** 修复redux-h5 componenetDidShow时丢失this的问题 ([6a8d887](https://github.com/NervJS/taro/commit/6a8d887))
* **taro-rn:** 修复Clipboard的测试用例 ([f9a35e5](https://github.com/NervJS/taro/commit/f9a35e5))
* **taro-weapp:** setData之前过滤掉undefined字段 ([969faf8](https://github.com/NervJS/taro/commit/969faf8))
* **taro-weapp:** setState不会触发当前组件receiveProps ([c8ec2f8](https://github.com/NervJS/taro/commit/c8ec2f8))
* **taro-weapp:** 修复异步循环组件不触发willMount生命周期问题 ([ead6ae6](https://github.com/NervJS/taro/commit/ead6ae6))
* **transformer-wx:** props 下函数名处理路径顺序错误 ([92e467d](https://github.com/NervJS/taro/commit/92e467d))
* **transformer-wx:** 生成匿名函数时不需要携带 scope 作为第一参数 ([7a596c7](https://github.com/NervJS/taro/commit/7a596c7))


### Features

* **taro-rn:** 增加rn api的测试用例 ([8f18dd9](https://github.com/NervJS/taro/commit/8f18dd9))
* 重构	createStackNavigator ，通过Taro.initRouter初始化路由 ([dfcd11f](https://github.com/NervJS/taro/commit/dfcd11f))
* **transformer:** 属于 this.props 的 JSX 事件引用自动填充完整路径 ([4b6ca63](https://github.com/NervJS/taro/commit/4b6ca63))
* **transformer:** 属于 this.props 的函数调用自动填充完整路径 ([3073da9](https://github.com/NervJS/taro/commit/3073da9))



<a name="0.0.73"></a>
## [0.0.73](https://github.com/NervJS/taro/compare/v0.0.72...v0.0.73) (2018-07-25)


### Bug Fixes

* **cli:** 将 tsConfig.json 移动至项目根目录下 ([da7f104](https://github.com/NervJS/taro/commit/da7f104))
* **taro:** render 方法 typing 错误 ([779157f](https://github.com/NervJS/taro/commit/779157f))
* **taro-weapp:** 事件触发兼容redux actions 链式调用 ([02bc67c](https://github.com/NervJS/taro/commit/02bc67c))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数 ([ff56ffa](https://github.com/NervJS/taro/commit/ff56ffa))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数丢失 ([b750aba](https://github.com/NervJS/taro/commit/b750aba))
* **taro-weapp:** 支持函数在传递的过程中通过fn.bind()来传参 ([0ed5043](https://github.com/NervJS/taro/commit/0ed5043))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数，同时支持方法名多级路径处理 ([cec9417](https://github.com/NervJS/taro/commit/cec9417))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数遗漏 ([27c1ee0](https://github.com/NervJS/taro/commit/27c1ee0))
* **transformer-wx:** 当自定义组件不包含属性时不会生成 __triggerObserer 属性 ([3fb2816](https://github.com/NervJS/taro/commit/3fb2816))
* **transformer-wx:** 生成匿名函数名中不能包含数字 ([c42c405](https://github.com/NervJS/taro/commit/c42c405))
* require 页面遗漏 default ([18dd571](https://github.com/NervJS/taro/commit/18dd571))


### Features

* 改变 app.js 里的 render return ([2fdb804](https://github.com/NervJS/taro/commit/2fdb804))
* **cli:** 将 cssUrl 配置移入 module.postcss 下 ([8efe600](https://github.com/NervJS/taro/commit/8efe600))
* **cli:** 小程序端编译增加 CSS 中引用本地资源替换成 base64 功能 ([db8e267](https://github.com/NervJS/taro/commit/db8e267))
* **cli:** 小程序编译增加 copy 功能 ([0132a0e](https://github.com/NervJS/taro/commit/0132a0e))
* **taro-rn:** 增加storage的测试用例 ([7b98274](https://github.com/NervJS/taro/commit/7b98274))
* **taro-router-rn:** 生成 RootStack ([014abe8](https://github.com/NervJS/taro/commit/014abe8))



<a name="0.0.72"></a>
## [0.0.72](https://github.com/NervJS/taro/compare/v0.0.71...v0.0.72) (2018-07-24)


### Bug Fixes

* **cli:** 修复入口文件classify时的错误 ([c8316e5](https://github.com/NervJS/taro/commit/c8316e5))
* **router:** 修复navigateBack不带参数时报错的问题 ([9d8078c](https://github.com/NervJS/taro/commit/9d8078c))
* **taro-weapp:** 修复生命周期componentWillMount执行时机 ([52c9a67](https://github.com/NervJS/taro/commit/52c9a67))
* **taro-weapp:** 自定义事件名转全小写 ([3666f8d](https://github.com/NervJS/taro/commit/3666f8d))
* **taro-weapp:** 补全小程序page的生命周期 ([77f6bba](https://github.com/NervJS/taro/commit/77f6bba))
* **taro-weapp:** 页面onload传入的参数 ([84c225e](https://github.com/NervJS/taro/commit/84c225e))
* **weapp:** 修复 this.$router 及组件生命周期触发 ([cc93e27](https://github.com/NervJS/taro/commit/cc93e27))


### Features

* **cli:** H5 支持 deviceRatio 自定义 ([5daa25d](https://github.com/NervJS/taro/commit/5daa25d))
* **cli:** 去掉依赖的组件样式文件引入 ([caf0ba0](https://github.com/NervJS/taro/commit/caf0ba0))
* **cli:** 去掉依赖组件的 js 引用 ([1334469](https://github.com/NervJS/taro/commit/1334469))
* **taro:** 补充对 checkSession 的支持 ([23588f4](https://github.com/NervJS/taro/commit/23588f4))
* **taro-rn:** package.json 模板提取出去 ([7689b22](https://github.com/NervJS/taro/commit/7689b22))
* **taro-router-rn:** config 配置信息读取，生成 RootStack ([b2a1c94](https://github.com/NervJS/taro/commit/b2a1c94))



<a name="0.0.71"></a>
## [0.0.71](https://github.com/NervJS/taro/compare/v0.0.70...v0.0.71) (2018-07-20)


### Bug Fixes

* **cli:** page 类型仍然需要 Page() 工厂函数初始化 ([1172b12](https://github.com/NervJS/taro/commit/1172b12))
* 事件调用的时候实例指向错误 ([928e0c3](https://github.com/NervJS/taro/commit/928e0c3))
* **cli:** 修复h5模式偶发找不到模块的错误 ([c2e2184](https://github.com/NervJS/taro/commit/c2e2184))
* **cli:** 导入组件 Component 重命名为 `BaseComponent` ([b2880b1](https://github.com/NervJS/taro/commit/b2880b1))
* **cli:** 页面是 Page 类型 createComponent 应该传参 true ([730f158](https://github.com/NervJS/taro/commit/730f158))
* **cli:** 默认模板不强制规定类型 ([0d3851e](https://github.com/NervJS/taro/commit/0d3851e))
* **taro-compontens:** 修复一些组件默认样式 ([a4b7541](https://github.com/NervJS/taro/commit/a4b7541))
* 小程序组件的事件函数需放到methods中，页面则不用 ([0449123](https://github.com/NervJS/taro/commit/0449123))
* **taro-redux:** 修复connect中preProps会被覆盖成最新props的问题 ([13e1448](https://github.com/NervJS/taro/commit/13e1448))
* **transformer:**  引入组件路径错误 ([b7341d3](https://github.com/NervJS/taro/commit/b7341d3))
* 漏写引号 ([8dbc00d](https://github.com/NervJS/taro/commit/8dbc00d))
* **transformer:** path resolve 使用 try..catch 包住 ([8e5ef9b](https://github.com/NervJS/taro/commit/8e5ef9b))
* if / for 例子书写错误 ([f98c2ad](https://github.com/NervJS/taro/commit/f98c2ad))
* observer第一次触发的时候，组件尚未初始化 ([30b8dd1](https://github.com/NervJS/taro/commit/30b8dd1))
* 判断是否空对象bug ([d864fea](https://github.com/NervJS/taro/commit/d864fea))
* 区分事件调用时的scope ([f717ccb](https://github.com/NervJS/taro/commit/f717ccb))
* 去掉事件参数里的scope ([b4c014d](https://github.com/NervJS/taro/commit/b4c014d))
* 模板中传参表示-event- -> -e- ([c33f84d](https://github.com/NervJS/taro/commit/c33f84d))
* **transformer:** 修复 props 为 string 的情况 ([8b0c9ce](https://github.com/NervJS/taro/commit/8b0c9ce))
* **transformer:** 支持多个组件调用同一 this.props 方法 ([6712d78](https://github.com/NervJS/taro/commit/6712d78))
* **transformer:** 生成匿名 state也需要带上条件表达式 ([2b428bd](https://github.com/NervJS/taro/commit/2b428bd))
* **transformer:** 生成匿名 state也需要带上条件表达式, fix [#351](https://github.com/NervJS/taro/issues/351) ([9906c0e](https://github.com/NervJS/taro/commit/9906c0e))


### Features

* 修改事件处理方式以支持props传函数的各种情形 ([2a3d836](https://github.com/NervJS/taro/commit/2a3d836))
* **taro-cli:** RN 编译添加 watch 功能 ([73f7cfd](https://github.com/NervJS/taro/commit/73f7cfd))
* 提供一个私有方法区分来自redux的props里的方法 ([cebb660](https://github.com/NervJS/taro/commit/cebb660))
* **taro-cli:** 添加 RN 的编译时间 log ([6efda66](https://github.com/NervJS/taro/commit/6efda66))
* **taro-router-rn:** 添加工程 ([8597f9b](https://github.com/NervJS/taro/commit/8597f9b))
* **transformer:** **支持自定义组件传入 children** ([8b79214](https://github.com/NervJS/taro/commit/8b79214))
* **transformer:** 在 Component 中使用过的 this.props 会加入到 `static properties` ([ac16eb0](https://github.com/NervJS/taro/commit/ac16eb0))



<a name="0.0.70"></a>
## [0.0.70](https://github.com/NervJS/taro/compare/v0.0.69...v0.0.70) (2018-07-17)


### Bug Fixes

* **cli:** [@tarojs](https://github.com/tarojs)/plugin-typescript依赖缺失, may fix [#233](https://github.com/NervJS/taro/issues/233) ([340df41](https://github.com/NervJS/taro/commit/340df41))
* **cli:** redux模版里typescript与[@tarojs](https://github.com/tarojs)/plugin-typescript依赖缺失, fix [#233](https://github.com/NervJS/taro/issues/233) ([ec31db5](https://github.com/NervJS/taro/commit/ec31db5))
* **plugin:** 修复 less 和 stylus 不支持 [@import](https://github.com/import), fix [#231](https://github.com/NervJS/taro/issues/231) ([9afddc1](https://github.com/NervJS/taro/commit/9afddc1))
* 配置开启https文档介绍 ([abcf1f8](https://github.com/NervJS/taro/commit/abcf1f8))
* **router:** 修复直接改地址栏时路由没反应的问题 ([9841f48](https://github.com/NervJS/taro/commit/9841f48))
* **tabbar:** iOS 下pannel容器增加弹性滚动，解决滑动卡顿的问题 ([b6c7628](https://github.com/NervJS/taro/commit/b6c7628))
* **transformer:** findImportedName 无法处理10个或以上自定义组件, fix [#324](https://github.com/NervJS/taro/issues/324) ([53a96fd](https://github.com/NervJS/taro/commit/53a96fd))
* **transformer:** if statement 不处理 jsx attr，fix [#317](https://github.com/NervJS/taro/issues/317) ([eea4c6f](https://github.com/NervJS/taro/commit/eea4c6f))
* **transformer:** 寻找 stateName 错误，close [#318](https://github.com/NervJS/taro/issues/318) ([05bc781](https://github.com/NervJS/taro/commit/05bc781))
* **transformer|eslint:** 不支持 MovableArea & MovableArea, close [#334](https://github.com/NervJS/taro/issues/334) ([73bc7f0](https://github.com/NervJS/taro/commit/73bc7f0))


### Features

* **core:** 加入  的类型检查, fix [#325](https://github.com/NervJS/taro/issues/325) ([27207a9](https://github.com/NervJS/taro/commit/27207a9))
* **transformer:** 清理无用代码，开始重构新组件化功能 ([71f8de8](https://github.com/NervJS/taro/commit/71f8de8))



<a name="0.0.69"></a>
## [0.0.69](https://github.com/NervJS/taro/compare/v0.0.69-beta.1...v0.0.69) (2018-07-11)


### Bug Fixes

* **@types/taro-components:** 修复 taro-component 的 key types ([6c7b164](https://github.com/NervJS/taro/commit/6c7b164))
* **redux:** 去掉页面 hide 就不更新的处理逻辑 ([bf2fb6a](https://github.com/NervJS/taro/commit/bf2fb6a))
* **redux-h5:** 修复redux组件didMount和didShow顺序相反的问题 ([266c8da](https://github.com/NervJS/taro/commit/266c8da))
* **taro-components:** 修复swiper 更新props时 衔接滑动出现的下标不对问题 ([ffe5e5d](https://github.com/NervJS/taro/commit/ffe5e5d))
* **taro-components:** 修复swiper 更新数据之后，容器宽高没有重置的问题，  issue[#296](https://github.com/NervJS/taro/issues/296)， ([9f42d61](https://github.com/NervJS/taro/commit/9f42d61))
* **transformer:** 循环自定义组件的 callee 可能是 this.props ([09e7f53](https://github.com/NervJS/taro/commit/09e7f53))
* **transformer:** 改善 windows 路径 的兼容性, close [#293](https://github.com/NervJS/taro/issues/293) ([2a9f938](https://github.com/NervJS/taro/commit/2a9f938))
* **weapp:** taro/weapp 也需要 export internal_inline_style 方法 ([d998153](https://github.com/NervJS/taro/commit/d998153))


### Features

* **taro-weapp:** app 补充 onError 和 onPageNotFound 两个生命周期 ([fc7528e](https://github.com/NervJS/taro/commit/fc7528e))



<a name="0.0.69-beta.1"></a>
## [0.0.69-beta.1](https://github.com/NervJS/taro/compare/v0.0.69-beta.0...v0.0.69-beta.1) (2018-07-09)


### Bug Fixes

* **eslint:** this.$rourer 触发 JSX 事件名 ([1af94f3](https://github.com/NervJS/taro/commit/1af94f3))
* **webpack-runner:** 修复Dynamic Import后报错的问题 ([57db5ad](https://github.com/NervJS/taro/commit/57db5ad))


### Features

* **cli:** 增加 [ 尺寸设计稿换算配置 ] 到 config 模板中 ([6fc36eb](https://github.com/NervJS/taro/commit/6fc36eb))
* **core:** style 支持写入对象 ([931ee57](https://github.com/NervJS/taro/commit/931ee57))
* **core:** 新的内部方法: internal_inline_style ([27c2cd2](https://github.com/NervJS/taro/commit/27c2cd2))
* **transformer:** 支持 style 传入对象 ([d0be191](https://github.com/NervJS/taro/commit/d0be191))



<a name="0.0.69-beta.0"></a>
## [0.0.69-beta.0](https://github.com/NervJS/taro/compare/v0.0.68...v0.0.69-beta.0) (2018-07-08)


### Bug Fixes

* **taro-weapp:** 页面退出清除缓存后，再次进入未能初始化 state ([08f63fd](https://github.com/NervJS/taro/commit/08f63fd))



<a name="0.0.68"></a>
## [0.0.68](https://github.com/NervJS/taro/compare/v0.0.68-beta.4...v0.0.68) (2018-07-07)


### Bug Fixes

* 修复swiper 初始化自动播放问题 ([7395fb0](https://github.com/NervJS/taro/commit/7395fb0))
* **cli:** 修复 tsconfig.json 设置，加入 typing 依赖. close [#284](https://github.com/NervJS/taro/issues/284) ([f985aee](https://github.com/NervJS/taro/commit/f985aee))



<a name="0.0.68-beta.4"></a>
## [0.0.68-beta.4](https://github.com/NervJS/taro/compare/v0.0.68-beta.3...v0.0.68-beta.4) (2018-07-06)


### Bug Fixes

* **cli:** h5模式 在.temp中保留原始文件名 ([7ae66d0](https://github.com/NervJS/taro/commit/7ae66d0))
* **cli:** 支持 js 文件写后缀 close [#276](https://github.com/NervJS/taro/issues/276) ([b2bbee0](https://github.com/NervJS/taro/commit/b2bbee0))
* **router:** 修复router navigateBack不刷新url的问题 ([42b2f29](https://github.com/NervJS/taro/commit/42b2f29))
* **taro-weapp:** 修正子组件生命周期执行顺序 ([eb3aed3](https://github.com/NervJS/taro/commit/eb3aed3))
* **taro-weapp:** 缩短因为 bind 传参导致的 wxml 属性过长 ([aa73799](https://github.com/NervJS/taro/commit/aa73799))
* **taro-weapp:** 页面退出时清空缓存 ([c420b21](https://github.com/NervJS/taro/commit/c420b21))
* **transformer:** 修复引用标识符加入全局 state 的条件 ([2b6eb80](https://github.com/NervJS/taro/commit/2b6eb80))
* **transformer:** 动态循环组件 return stateName 标识符 ([ab67b7b](https://github.com/NervJS/taro/commit/ab67b7b))
* **transformer:** 循环组件的 callee 为复杂表达式时加入全局 state ([abaf5a4](https://github.com/NervJS/taro/commit/abaf5a4))
* **transformer:** 自定义组件的 props 可以传入 this.prop.xx.xx 所声明的变量 ([57ee230](https://github.com/NervJS/taro/commit/57ee230))
* **webpach-runner:** 加回了ts-loader ([60df7f5](https://github.com/NervJS/taro/commit/60df7f5))
* **webpack-runner:** 去除多余依赖 ([1de9ca3](https://github.com/NervJS/taro/commit/1de9ca3))


### Features

* **cli:** 使用klaw扫描文件目录，移除vfs ([8cc1015](https://github.com/NervJS/taro/commit/8cc1015))
* **taro-h5:** 加入typings 防止ts报错 ([5230b93](https://github.com/NervJS/taro/commit/5230b93))
* **webpack-runner:** webpack-runner优化 ([490e7cb](https://github.com/NervJS/taro/commit/490e7cb))



<a name="0.0.68-beta.3"></a>
## [0.0.68-beta.3](https://github.com/NervJS/taro/compare/v0.0.68-beta.2...v0.0.68-beta.3) (2018-07-05)


### Bug Fixes

* **transformer:** 匿名 loop state/callee 不加入全局 state ([2e978f0](https://github.com/NervJS/taro/commit/2e978f0))


### Features

* **taro-cli | postcss-pxtransform:** 增加尺寸设计稿换算配置 ([2d9fe7a](https://github.com/NervJS/taro/commit/2d9fe7a))



<a name="0.0.68-beta.2"></a>
## [0.0.68-beta.2](https://github.com/NervJS/taro/compare/v0.0.68-beta.1...v0.0.68-beta.2) (2018-07-05)


### Bug Fixes

* **taro-weapp:** createData try catch 后暴露错误 ([d0fef0d](https://github.com/NervJS/taro/commit/d0fef0d))
* **transformer:** 路径解析不正确 ([9eca434](https://github.com/NervJS/taro/commit/9eca434))



<a name="0.0.68-beta.1"></a>
## [0.0.68-beta.1](https://github.com/NervJS/taro/compare/v0.0.68-beta.0...v0.0.68-beta.1) (2018-07-05)


### Bug Fixes

* **taro-cli:** 修复taro-cli新建typescript模块eslint报错 ([52dfe83](https://github.com/NervJS/taro/commit/52dfe83))
* **transfomer:** 修复动态组件作用域取值问题 ([4aab4e2](https://github.com/NervJS/taro/commit/4aab4e2))



<a name="0.0.68-beta.0"></a>
## [0.0.68-beta.0](https://github.com/NervJS/taro/compare/v0.0.67...v0.0.68-beta.0) (2018-07-05)


### Bug Fixes

* **taro-weapp:** 自定义组件 componentDidMount 不触发 ([351b858](https://github.com/NervJS/taro/commit/351b858))
* **taro-weapp:** 自定义组件无法接受来自 redux 等的外部 props ([76a397c](https://github.com/NervJS/taro/commit/76a397c))


### Features

* **cli:** 当 node 版本过低时报错 ([c35a91f](https://github.com/NervJS/taro/commit/c35a91f))



<a name="0.0.67"></a>
## [0.0.67](https://github.com/NervJS/taro/compare/v0.0.67-beta.3...v0.0.67) (2018-07-04)


### Bug Fixes

* **cli:** 调用转换器时参数变更 ([622fa57](https://github.com/NervJS/taro/commit/622fa57))
* **taro-weapp:** 第一次 createData 时 try catch 保证不报错 ([77bc685](https://github.com/NervJS/taro/commit/77bc685))
* **transformer:** 处理 import tsx, xml 路径解析错误的情况 ([57b810b](https://github.com/NervJS/taro/commit/57b810b))



<a name="0.0.67-beta.3"></a>
## [0.0.67-beta.3](https://github.com/NervJS/taro/compare/v0.0.67-beta.2...v0.0.67-beta.3) (2018-07-04)


### Bug Fixes

* **transformer:** 单独使用的自定义也加入 key ([a231a90](https://github.com/NervJS/taro/commit/a231a90))



<a name="0.0.67-beta.2"></a>
## [0.0.67-beta.2](https://github.com/NervJS/taro/compare/v0.0.67-beta.1...v0.0.67-beta.2) (2018-07-04)


### Bug Fixes

* **taro-weapp:** 组件状态被重置 ([fdf5ef2](https://github.com/NervJS/taro/commit/fdf5ef2))
* **transformer:** 所有设置 if 条件都加入 block ([a32661e](https://github.com/NervJS/taro/commit/a32661e))


### Features

* **tcr:** Picker 的 Dialog 模块重构，参考react-native-modal的思想 ([4562227](https://github.com/NervJS/taro/commit/4562227))
* 重构swiper 组件 ([d10a9df](https://github.com/NervJS/taro/commit/d10a9df))



<a name="0.0.67-beta.1"></a>
## [0.0.67-beta.1](https://github.com/NervJS/taro/compare/v0.0.67-beta.0...v0.0.67-beta.1) (2018-07-04)



<a name="0.0.67-beta.0"></a>
## [0.0.67-beta.0](https://github.com/NervJS/taro/compare/v0.0.66...v0.0.67-beta.0) (2018-07-04)


### Bug Fixes

* **taro-weapp:** 组件初始化放到页面 onLoad 里 ([5a8ede0](https://github.com/NervJS/taro/commit/5a8ede0))
* **transformer:** 循环自定义组件的 iterator 重命名 ([a9cf461](https://github.com/NervJS/taro/commit/a9cf461))



<a name="0.0.66"></a>
## [0.0.66](https://github.com/NervJS/taro/compare/v0.0.65...v0.0.66) (2018-07-04)


### Bug Fixes

* **cli:** redux 模板变更 ([8912f9c](https://github.com/NervJS/taro/commit/8912f9c))
* **taro-weapp:** 组件的 _createData() 不在 constructor 里调用 ([f759d52](https://github.com/NervJS/taro/commit/f759d52))
* **transformer:** $DC 表达式解析失败 ([72b45bc](https://github.com/NervJS/taro/commit/72b45bc))
* **transformer:** $dynamicComp 的 stateName 应该和 template data 的指向保持一致 ([e5140e4](https://github.com/NervJS/taro/commit/e5140e4))
* 默认参数‘this’会造成歧义，传false或不传即可 ([c241c4d](https://github.com/NervJS/taro/commit/c241c4d))
* **transformer:** 寻找 id 是属于 props 或 state ([5b5f42f](https://github.com/NervJS/taro/commit/5b5f42f))


### Features

* props函数执行时传参 ([49d5b4c](https://github.com/NervJS/taro/commit/49d5b4c))



<a name="0.0.65"></a>
## [0.0.65](https://github.com/NervJS/taro/compare/v0.0.64...v0.0.65) (2018-07-03)


### Bug Fixes

* 修复ScrollView 组件 scrollWithAnimation 问题，修复radio 外部样式问题，修复checkbox 样式错乱问题，修复 switch color 值无效问题 等 ([8995f1f](https://github.com/NervJS/taro/commit/8995f1f))
* 修复swiper 组件引用问题 ([a524b1c](https://github.com/NervJS/taro/commit/a524b1c))
* **taro-h5:** H5 端 request cache 参数丢失 ([2bb0a1a](https://github.com/NervJS/taro/commit/2bb0a1a))
* **taro-weapp:** 小程序组件化修正 ([f29d9e4](https://github.com/NervJS/taro/commit/f29d9e4))
* **taro-weapp:** 所有组件引用当成动态组件处理 ([318a850](https://github.com/NervJS/taro/commit/318a850))
* **transformer:** $usedState 不加入非标准 id ([e622500](https://github.com/NervJS/taro/commit/e622500))
* **transformer:** 单独使用的自定义组件也当做循环自定义组件处理 ([47bdc55](https://github.com/NervJS/taro/commit/47bdc55))
* **transformer:** 单独使用的自定义组件在 createData 加入索引 ([f2b8bdc](https://github.com/NervJS/taro/commit/f2b8bdc))
* **transformer:** 自定义组件 props 不写值则默认赋值 true ([a64632a](https://github.com/NervJS/taro/commit/a64632a))


### Features

* 1st cmt ([067e292](https://github.com/NervJS/taro/commit/067e292))
* **tcr:** Button 支持 hoverStyle ([96d0e4b](https://github.com/NervJS/taro/commit/96d0e4b))
* 调整componentDidMount的触发时机 ([ff17434](https://github.com/NervJS/taro/commit/ff17434))



<a name="0.0.64"></a>
## [0.0.64](https://github.com/NervJS/taro/compare/v0.0.63...v0.0.64) (2018-07-02)


### Bug Fixes

* **cli:** tsconfig.json 和 typescript 依赖缺失, may fix [#233](https://github.com/NervJS/taro/issues/233), [#241](https://github.com/NervJS/taro/issues/241) ([7e652ce](https://github.com/NervJS/taro/commit/7e652ce))
* **cli:** 无法解析键值为字符串的 config, close [#235](https://github.com/NervJS/taro/issues/235) ([5fc5f22](https://github.com/NervJS/taro/commit/5fc5f22))
* **eslint:** eslint 的 class method 也是 function, close [#238](https://github.com/NervJS/taro/issues/238) ([13ff0eb](https://github.com/NervJS/taro/commit/13ff0eb))
* **taro-weapp:** 循环组件数据处理 ([f5b36ff](https://github.com/NervJS/taro/commit/f5b36ff))
* **taro-weapp:** 支持引用 pages 目录下的内容 ([5124d0f](https://github.com/NervJS/taro/commit/5124d0f))
* **transformer:** bind 表达式解析错误 ([9b9e3d9](https://github.com/NervJS/taro/commit/9b9e3d9))
* **transformer:** 删除重复的测试用例 ([799c39c](https://github.com/NervJS/taro/commit/799c39c))
* **transformer:** 单独使用的自定义和循环自定义分开处理  $dynamicComponents ([4bb5092](https://github.com/NervJS/taro/commit/4bb5092))
* **transformer:** 处理只有循环自定义的情况 ([636c7a5](https://github.com/NervJS/taro/commit/636c7a5))
* **transformer:** 处理自定义组件不写 attr value 的情况 ([0c6c73e](https://github.com/NervJS/taro/commit/0c6c73e))


### Features

* **cli:** 生成 WXS 文件 ([4bd6ed2](https://github.com/NervJS/taro/commit/4bd6ed2))
* **taro-rn:** 一系列端能力实现 ([d91b0e8](https://github.com/NervJS/taro/commit/d91b0e8))
* **tcr:** 增强 Clickable ([7d99c3e](https://github.com/NervJS/taro/commit/7d99c3e))



<a name="0.0.63"></a>
## [0.0.63](https://github.com/NervJS/taro/compare/v0.0.62...v0.0.63) (2018-06-29)


### Bug Fixes

* **taro-h5:** request api 支持 GET 时使用 data 作为参数 && 修正返回结果的 header ([295061f](https://github.com/NervJS/taro/commit/295061f))
* **transformer:** $dynamicComponents 的 stateName 也需要重命名 ([ecf9a4d](https://github.com/NervJS/taro/commit/ecf9a4d))
* **transformer:** 动态组件 index 问题 & 动态组件 key ([2d5d82f](https://github.com/NervJS/taro/commit/2d5d82f))
* **webpack-runner:** 修复了h5模式下丢失prod配置的问题 ([bb2c98f](https://github.com/NervJS/taro/commit/bb2c98f))


### Features

* **taro:** 增加新 api 支持 ([c930c3f](https://github.com/NervJS/taro/commit/c930c3f))
* **taro:** 将 api 列表进行统一管理 ([ec79e95](https://github.com/NervJS/taro/commit/ec79e95))
* **tcr:** 手势事件的event参数的转化 ([1d52f96](https://github.com/NervJS/taro/commit/1d52f96))



<a name="0.0.62"></a>
## [0.0.62](https://github.com/NervJS/taro/compare/v0.0.61...v0.0.62) (2018-06-28)


### Bug Fixes

* **webpack-runner:** 丢失 ts-loader 依赖 ([8a0bf39](https://github.com/NervJS/taro/commit/8a0bf39))



<a name="0.0.61"></a>
## [0.0.61](https://github.com/NervJS/taro/compare/v0.0.60...v0.0.61) (2018-06-28)


### Bug Fixes

* **cli:** 小程序编译获取ast时传入源码路径 ([f8e43d9](https://github.com/NervJS/taro/commit/f8e43d9))
* **redux-h5:** 修正了package.json的scripts错误 ([31ce840](https://github.com/NervJS/taro/commit/31ce840))
* **router:** 去除了router残留的log.. ([f098882](https://github.com/NervJS/taro/commit/f098882))
* **taro:** 入参 ([ed632e9](https://github.com/NervJS/taro/commit/ed632e9))
* **taro-h5:** request api 增加 jsonpCache 参数，fix [#224](https://github.com/NervJS/taro/issues/224) ([a0d6674](https://github.com/NervJS/taro/commit/a0d6674))
* **taro-weapp:** 修复小程序端循环组件事件绑定错误 ([8ca2ce7](https://github.com/NervJS/taro/commit/8ca2ce7))
* **taro-weapp:** 修正小程序端子组件生命周期执行及子组件 componentWillReceiveProps 的入参 ([31531a5](https://github.com/NervJS/taro/commit/31531a5))
* **tcr:** ios icon 没显示 ([75db35c](https://github.com/NervJS/taro/commit/75db35c))
* **tcr:** Picker在IOS消失了，因为有多个Modal不能同时显示，安州没问题 ([aa399bc](https://github.com/NervJS/taro/commit/aa399bc))
* **tcr:** Radio 选中态图标跟border间有间隙 ([ed37199](https://github.com/NervJS/taro/commit/ed37199))
* **tcr:** 阻止在ios用weui时因为没有链接libART.a而报错 ([5881dd4](https://github.com/NervJS/taro/commit/5881dd4))
* **transformer:**  多个 ifStatement 渲染错误 ([32906c5](https://github.com/NervJS/taro/commit/32906c5))
* **transformer:** key 的位置在条件表达式的情况下不对, close [#199](https://github.com/NervJS/taro/issues/199) ([6e24fcc](https://github.com/NervJS/taro/commit/6e24fcc))
* **transformer:** 逻辑表达式的 wx:if 使用 block 包裹 ([e0f457d](https://github.com/NervJS/taro/commit/e0f457d))


### Features

* **cli:** cli的h5版本传参逻辑修改，并切换到[@tarojs](https://github.com/tarojs)/transformer-wx ([716fb17](https://github.com/NervJS/taro/commit/716fb17))
* **cli:** 增加 redux 模板 ([98f61d5](https://github.com/NervJS/taro/commit/98f61d5))
* **eslint:** 新规则 reserve-class-properties, close [#221](https://github.com/NervJS/taro/issues/221) ([5fe2c46](https://github.com/NervJS/taro/commit/5fe2c46))
* **tcr:** Icon 在 IOS 的颜色 ([ceeb158](https://github.com/NervJS/taro/commit/ceeb158))
* **tcr:** platform-specific code of icon ([751863d](https://github.com/NervJS/taro/commit/751863d))
* **webpack-runner:** webpack-runner支持自定义devServer ([5632e94](https://github.com/NervJS/taro/commit/5632e94))
* **webpack-runner:** 将webpack-runner切换到ts,并且支持了defineConsts, devServer，plugins配置 ([f1c0271](https://github.com/NervJS/taro/commit/f1c0271))
* **webpack-runner:** 调整了webpack-runner的types ([b6a9c0f](https://github.com/NervJS/taro/commit/b6a9c0f))



<a name="0.0.60"></a>
## [0.0.60](https://github.com/NervJS/taro/compare/v0.0.59...v0.0.60) (2018-06-27)


### Bug Fixes

* **cli:** h5 编译watch时中文处理的问题 ([62c1554](https://github.com/NervJS/taro/commit/62c1554))
* **eslint-plugin-taro:** 组件属性无法使用 this.props.* 形式赋值 ([0f7e746](https://github.com/NervJS/taro/commit/0f7e746))
* **transformer:** wxml import 路径使用 unix 风格，close [#212](https://github.com/NervJS/taro/issues/212) ([2782046](https://github.com/NervJS/taro/commit/2782046))
* **transformer:** 条件表达式编译 block 没有 children ([80925b7](https://github.com/NervJS/taro/commit/80925b7))


### Features

* **router:** router改用[@tarojs](https://github.com/tarojs)/taro-h5作为基类 ([503bdc8](https://github.com/NervJS/taro/commit/503bdc8))
* **taro-h5:** taro-h5注入$router ([e518482](https://github.com/NervJS/taro/commit/e518482))
* **taro-redux-h5:** 加入了定制版redux ([090ff9c](https://github.com/NervJS/taro/commit/090ff9c))
* **taro-rn:** 优化websocket API，增加测试用例 ([4beb2f2](https://github.com/NervJS/taro/commit/4beb2f2))
* **tcr:** add component Tabbar ([5e34a2c](https://github.com/NervJS/taro/commit/5e34a2c))
* **transformer:** state|props 可以作为 data 的 key ([7e78f31](https://github.com/NervJS/taro/commit/7e78f31))
* **transformer:** 事件 bind 可以直接写数字 ([3b6a799](https://github.com/NervJS/taro/commit/3b6a799))



<a name="0.0.59"></a>
## [0.0.59](https://github.com/NervJS/taro/compare/v0.0.58...v0.0.59) (2018-06-25)


### Bug Fixes

* **cli:** 兼容没有 project.config.json 的情况 ([a9c2b8b](https://github.com/NervJS/taro/commit/a9c2b8b))
* **redux:** 处理 mapStateToProps 和 mapDispatchToProps 中存在同名对象时更新错误 ([2ff5f3b](https://github.com/NervJS/taro/commit/2ff5f3b))
* **taro-weapp:** 页面循环输出组件生命周期处理 ([a968493](https://github.com/NervJS/taro/commit/a968493))
* **tcr:** Switch onChange 事件的参数错误 ([fdd5f4a](https://github.com/NervJS/taro/commit/fdd5f4a))
* **tcr:** 修复input组件在blur时娶不到值到问题 ([b3bfb43](https://github.com/NervJS/taro/commit/b3bfb43))
* **transformer:**  支持条件表达式的 consequent 为空 ([a05937a](https://github.com/NervJS/taro/commit/a05937a))
* **transformer:**  逻辑/条件表达式的 tester 可以使用复杂表达式 ([2c07688](https://github.com/NervJS/taro/commit/2c07688))
* **transformer:** createData 加入 this.props 的处理 ([aab2a76](https://github.com/NervJS/taro/commit/aab2a76))
* **transformer:** 循环组件不加入 $components ([e53abec](https://github.com/NervJS/taro/commit/e53abec))
* **transformer-wx:** 去除无用代码 ([6507857](https://github.com/NervJS/taro/commit/6507857))


### Features

* **taro-rn:** 增加storage api的单元测试 ([df1f794](https://github.com/NervJS/taro/commit/df1f794))
* **tcr:** add component Form ([56317c0](https://github.com/NervJS/taro/commit/56317c0))
* **tcr:** enhance clickable ([9fa8bc3](https://github.com/NervJS/taro/commit/9fa8bc3))



<a name="0.0.58"></a>
## [0.0.58](https://github.com/NervJS/taro/compare/v0.0.57...v0.0.58) (2018-06-24)


### Bug Fixes

* **transformer:** JSX attr expression 有多个 this.props. 成员表达式, close [#189](https://github.com/NervJS/taro/issues/189) ([9be4451](https://github.com/NervJS/taro/commit/9be4451))



<a name="0.0.57"></a>
## [0.0.57](https://github.com/NervJS/taro/compare/v0.0.56...v0.0.57) (2018-06-24)


### Bug Fixes

* **cli:** rn 编译样式处理错误 ([ddb7a5d](https://github.com/NervJS/taro/commit/ddb7a5d))
* **cli:** 包名有误 ([e31d66a](https://github.com/NervJS/taro/commit/e31d66a))
* **eslint:** jsx-handler-name  对 this.state 报错 ([6f400e7](https://github.com/NervJS/taro/commit/6f400e7))
* **eslint-plugin-taro:** 组件属性无法使用 this.state.* 形式赋值 ([827db83](https://github.com/NervJS/taro/commit/827db83)), closes [#145](https://github.com/NervJS/taro/issues/145)
* **redux:** redux 更新前设置组件的 prevProps ([c0d91fb](https://github.com/NervJS/taro/commit/c0d91fb))
* **tabbar:** 修复tabbar转h5后退隐藏问题 ([f39966b](https://github.com/NervJS/taro/commit/f39966b))
* **taro-weapp:** 小程序端 request 不支持传入 success/fail 参数的方式使用，fix [#172](https://github.com/NervJS/taro/issues/172) ([fffb6d8](https://github.com/NervJS/taro/commit/fffb6d8))
* **taro-weapp:** 页面执行完 componentWillReceiveProps 后需要更新下 state ([ad9c05e](https://github.com/NervJS/taro/commit/ad9c05e))
* **transformer:** 写 return  的循环可以使用复杂表达式 ([0ab50f6](https://github.com/NervJS/taro/commit/0ab50f6))
* **transformer:** 前置逻辑/条件表达式处理 ([f54c421](https://github.com/NervJS/taro/commit/f54c421))


### Features

* **cli:** added .npmignore ([2ad9d3e](https://github.com/NervJS/taro/commit/2ad9d3e))
* **taro-cli:** 为 dist/ 编译出 project.config.json，由此可把 dist/ 拖入开发者工具以避免无效编译，详见 [#190](https://github.com/NervJS/taro/issues/190) ([c6339fa](https://github.com/NervJS/taro/commit/c6339fa))



<a name="0.0.56"></a>
## [0.0.56](https://github.com/NervJS/taro/compare/v0.0.55...v0.0.56) (2018-06-22)


### Bug Fixes

* **cli:** cli 丢失 latest-version 依赖 ([62b60fc](https://github.com/NervJS/taro/commit/62b60fc))



<a name="0.0.55"></a>
## [0.0.55](https://github.com/NervJS/taro/compare/v0.0.54...v0.0.55) (2018-06-22)


### Bug Fixes

* **cli:** babylon 无法定位代码出错位置 ([fe944bd](https://github.com/NervJS/taro/commit/fe944bd))
* **cli:** merge 代码错误 ([c8f2abb](https://github.com/NervJS/taro/commit/c8f2abb))
* **cli:** 小程序组件内不支持 defineConstants 和 env 替换 ([8d5fcbc](https://github.com/NervJS/taro/commit/8d5fcbc))
* **cli:** 支持随意使用 require 引入静态资源 ([ced4d50](https://github.com/NervJS/taro/commit/ced4d50))
* **cli:** 部分文件不支持 ts 编译 ([6e2fcfc](https://github.com/NervJS/taro/commit/6e2fcfc))
* **redux:** redux 更新后不执行组件的 componentWillReceiveProps ([4b3a254](https://github.com/NervJS/taro/commit/4b3a254))
* **taro-cli:** taro 获取新包导致无网络环境下执行命令报错 ([e2caaf5](https://github.com/NervJS/taro/commit/e2caaf5))
* **taro-h5:** h5 api 修复 actionSheet 的 promise 问题 ([bac64ee](https://github.com/NervJS/taro/commit/bac64ee))
* **taro-h5:** H5 端 request 默认 GET 请求 ([54ff353](https://github.com/NervJS/taro/commit/54ff353))
* **taro-weapp:** 小程序端循环输出组件 bug ([501c84a](https://github.com/NervJS/taro/commit/501c84a))
* **taro-weapp:** 小程序端循环输出组件时递归遍历错误 ([2d435d9](https://github.com/NervJS/taro/commit/2d435d9))
* **taro-weapp:** 循环动态创建组件数据不更新 ([c12e139](https://github.com/NervJS/taro/commit/c12e139))
* **tcr:** Swiper 安卓下不能垂直滚动 ([401b2e3](https://github.com/NervJS/taro/commit/401b2e3))
* **tcr:** Textarea 安卓下输入闪烁问题 ([1258e7d](https://github.com/NervJS/taro/commit/1258e7d))
* **transformer:**  有逻辑表达式时无法处理循环组件 ([e6a98be](https://github.com/NervJS/taro/commit/e6a98be))
* **transformer:** bind 事件失效, close [#154](https://github.com/NervJS/taro/issues/154) ([b3e28bc](https://github.com/NervJS/taro/commit/b3e28bc))
* **transformer:** wx:else 不需要编译为 true ([574a23a](https://github.com/NervJS/taro/commit/574a23a))
* **transformer:** 修复 JSX children 也可能会加入 loop component ([db8398b](https://github.com/NervJS/taro/commit/db8398b))
* **transformer:** 加强对 JSX children 的判定 ([a2335f1](https://github.com/NervJS/taro/commit/a2335f1))
* **transformer:** 只有使用方括号的成员表达式才加入匿名表达式 ([419cf8e](https://github.com/NervJS/taro/commit/419cf8e))


### Features

* **cli:** 提示改用中文 ([992c936](https://github.com/NervJS/taro/commit/992c936))
* **taro-cli:**  干掉更新提示 ([098309f](https://github.com/NervJS/taro/commit/098309f))
* **taro-cli:** add taro update self and taro update project ([8d13e7f](https://github.com/NervJS/taro/commit/8d13e7f))
* **taro-cli:** 更新项目以来中所有 lerna 管理的包 ([914d8cc](https://github.com/NervJS/taro/commit/914d8cc))
* **taro-h5:** h5 api 增加 selectorQuery 的测试用例，并且新增了获取 computedStyled 的功能 ([00956d0](https://github.com/NervJS/taro/commit/00956d0))
* **taro-h5:** H5 端 request api 增加 fetch polyfill ([d458c3e](https://github.com/NervJS/taro/commit/d458c3e))
* **taro-h5:** taro-api hideToast 增加测试用例 ([d4f2076](https://github.com/NervJS/taro/commit/d4f2076))
* **taro-h5:** taro-api showActionSheet 增加测试用例，更新showActionSheet的文档 ([22cf69c](https://github.com/NervJS/taro/commit/22cf69c))
* **taro-h5:** taro-api showLoading 增加测试用例，同时修复了一些showLoading的问题 ([4498116](https://github.com/NervJS/taro/commit/4498116))
* **taro-h5:** taro-api showModal 增加测试用例，同时修复了一些showModal的问题 ([fbf8189](https://github.com/NervJS/taro/commit/fbf8189))
* **taro-h5:** taro-api 文档更新 ([c4991f8](https://github.com/NervJS/taro/commit/c4991f8))
* **tcr:** add component Label ([0f65eaf](https://github.com/NervJS/taro/commit/0f65eaf))
* **tcr:** Picker modal 硬件返回按钮关闭选择器 ([d00cff6](https://github.com/NervJS/taro/commit/d00cff6))
* **tcr:** 更改Picker出现的动效，overlay层拆分出来 ([f91cf24](https://github.com/NervJS/taro/commit/f91cf24))
* **transformer:** 加入 `isNormal` 参数，直接返回 ast ([7e81930](https://github.com/NervJS/taro/commit/7e81930))



<a name="0.0.54"></a>
## [0.0.54](https://github.com/NervJS/taro/compare/v0.0.53...v0.0.54) (2018-06-19)


### Bug Fixes

* 修复css预处理器提示语句错误 ([3336eb5](https://github.com/NervJS/taro/commit/3336eb5))
* **cli:** 根据模板创建项目给定默认 css 处理 ([17ee2d3](https://github.com/NervJS/taro/commit/17ee2d3))
* **eslint:** jsx-handler-names 无法正确处理成员表达式 ([fc13ee2](https://github.com/NervJS/taro/commit/fc13ee2))
* **taro-components:** 修复scroll-view 滑动问题，修复slider值大于最大值溢出问题 ([4cf885e](https://github.com/NervJS/taro/commit/4cf885e))
* **taro-components:** 修复swiper圆点位置 ([8554bbb](https://github.com/NervJS/taro/commit/8554bbb))
* **transformer:** props 不直接写真值报错 ([41c6398](https://github.com/NervJS/taro/commit/41c6398))
* **transformer:** 列表渲染自定义组件无法使用key属性，close [#126](https://github.com/NervJS/taro/issues/126) ([f73626b](https://github.com/NervJS/taro/commit/f73626b))
* **transformer:** 多层循环嵌套自定义组件无效 ([d93ba6a](https://github.com/NervJS/taro/commit/d93ba6a))


### Features

* **cli:** 内置了less&stylus支持 ([ac2e3df](https://github.com/NervJS/taro/commit/ac2e3df))
* **taro-cli:** 添加更新提示 ([196b21b](https://github.com/NervJS/taro/commit/196b21b))
* **taro-h5:** taro-api showToast 增加测试用例，同时修复了一些showToast的问题 ([93c82d6](https://github.com/NervJS/taro/commit/93c82d6))
* **transformer:** 内置组件 props 为 true 可以简写 ([06cf7d0](https://github.com/NervJS/taro/commit/06cf7d0))



<a name="0.0.53"></a>
## [0.0.53](https://github.com/NervJS/taro/compare/v0.0.52...v0.0.53) (2018-06-18)


### Bug Fixes

* **cli:** h5 编译入口文件查找错误 ([e00b08b](https://github.com/NervJS/taro/commit/e00b08b))



<a name="0.0.52"></a>
## [0.0.52](https://github.com/NervJS/taro/compare/v0.0.51...v0.0.52) (2018-06-18)


### Bug Fixes

* **cli:** 小程序编译 watch 时修改组件不更新 ([5e593f0](https://github.com/NervJS/taro/commit/5e593f0))
* **cli:** 支持根据文件后缀选择 css 预处理器 ([7d04c77](https://github.com/NervJS/taro/commit/7d04c77))
* **cli:** 根据模板创建文件的 bug ([696a56b](https://github.com/NervJS/taro/commit/696a56b))
* **eslint:** no-stateless 在 Array#map 方法中不报错, close [#131](https://github.com/NervJS/taro/issues/131) ([6f3c2f1](https://github.com/NervJS/taro/commit/6f3c2f1))
* **taro:** api typings ([06e7535](https://github.com/NervJS/taro/commit/06e7535))
* **transformer:** eslint 事件规则没有忽略 `key`, close [#129](https://github.com/NervJS/taro/issues/129) ([9b660df](https://github.com/NervJS/taro/commit/9b660df))
* **transformer:** 拿掉去除所有未引用的 babel 插件 ([671fe33](https://github.com/NervJS/taro/commit/671fe33))
* **transformer-wx:** 移除[@babel](https://github.com/babel)/plugin-transform-typescript ([31d5bac](https://github.com/NervJS/taro/commit/31d5bac))


### Features

* **cli:** add prepublish.js ([7a5e21a](https://github.com/NervJS/taro/commit/7a5e21a))
* **cli:** add yarn lockfile for template ([6a51b0e](https://github.com/NervJS/taro/commit/6a51b0e))
* **cli:** 增加 ts/tsx 文件编译支持 ([e13bbf2](https://github.com/NervJS/taro/commit/e13bbf2))
* **cli:** 增加更多 css 预处理器选择 ([3596172](https://github.com/NervJS/taro/commit/3596172))
* **cli:** 模板增加 typescript 配置 ([97a3db2](https://github.com/NervJS/taro/commit/97a3db2))
* **cli:** 生成ts相关文件 ([549af99](https://github.com/NervJS/taro/commit/549af99))
* **plugin-less:** 增加 less 处理插件 ([0e16b29](https://github.com/NervJS/taro/commit/0e16b29))
* **plugin-stylus:** 增加 stylus 处理插件 ([cf0ee58](https://github.com/NervJS/taro/commit/cf0ee58))
* **plugin-typescript:** 增加 ts 编译插件 ([d0b9b3c](https://github.com/NervJS/taro/commit/d0b9b3c))
* **taro-cli:** 添加 update 命令 ([842404c](https://github.com/NervJS/taro/commit/842404c))
* **transformer:** result 加入已使用图片路径数组 ([94ad281](https://github.com/NervJS/taro/commit/94ad281))



<a name="0.0.51"></a>
## [0.0.51](https://github.com/NervJS/taro/compare/v0.0.50...v0.0.51) (2018-06-15)



<a name="0.0.50"></a>
## [0.0.50](https://github.com/NervJS/taro/compare/v0.0.49...v0.0.50) (2018-06-15)


### Bug Fixes

* **cli:** windows 下 sass 重新编译延时延长 ([1c7f3f2](https://github.com/NervJS/taro/commit/1c7f3f2))
* **cli:** 小程序 watch 时新增组件样式文件不会被引入 ([bb9b0ca](https://github.com/NervJS/taro/commit/bb9b0ca))
* **cli:** 小程序 watch 时未被引用的 JS 文件不需要被编译 ([5521f60](https://github.com/NervJS/taro/commit/5521f60))
* **taro-components:** image添加默认样式，修复scroll-view事件问题 ([0222eec](https://github.com/NervJS/taro/commit/0222eec))
* **taro-components:** 修复picker默认值问题 ([79f3729](https://github.com/NervJS/taro/commit/79f3729))
* **taro-components:** 修复slider step计算问题，swiper组件默认样式问题 ([c6100e9](https://github.com/NervJS/taro/commit/c6100e9))
* **transformer:** loopState 不加入顶级 state &  循环内没有 block 也能使用复杂表达式 ([d5e620c](https://github.com/NervJS/taro/commit/d5e620c))


### Features

* **transformer:** 没有用到的 import 删除掉引用 ([78d1c71](https://github.com/NervJS/taro/commit/78d1c71))



<a name="0.0.49"></a>
## [0.0.49](https://github.com/NervJS/taro/compare/v0.0.48...v0.0.49) (2018-06-13)


### Bug Fixes

* **cli:** 避免出现引用当前页面的情况 ([6b69098](https://github.com/NervJS/taro/commit/6b69098))
* **taro-compoents:** 修复swiper自动轮播问题，修复switch返回值问题，修复slider touch事件问题 ([a95c33f](https://github.com/NervJS/taro/commit/a95c33f))
* **taro-components:** 修复audio video 没有事件传递的是会触发方法问题 ([f4e9313](https://github.com/NervJS/taro/commit/f4e9313))
* **transformer:** render 定义作用域有 `state` 并且使用过,  close [#107](https://github.com/NervJS/taro/issues/107) ([399eae9](https://github.com/NervJS/taro/commit/399eae9))


### Features

* **cli:**  将h5的webpack配置移动到h5下 ([f44ebdc](https://github.com/NervJS/taro/commit/f44ebdc))
* **cli:** h5模式下现在可以自由配置webpack的构建参数了 ([cf088cb](https://github.com/NervJS/taro/commit/cf088cb))
* **cli:** 增加生成微信开发工具配置文件 project.config.json ([e109418](https://github.com/NervJS/taro/commit/e109418))
* **taro-h5:** taro api 文档补上文件、位置、设备部分 ([33d014b](https://github.com/NervJS/taro/commit/33d014b))
* **taro-h5:** taro api 文档补上界面部分 ([7c0aeb4](https://github.com/NervJS/taro/commit/7c0aeb4))
* **taro-rn:** 更新rn-api文档 ([6c3f06b](https://github.com/NervJS/taro/commit/6c3f06b))



<a name="0.0.48"></a>
## [0.0.48](https://github.com/NervJS/taro/compare/v0.0.47...v0.0.48) (2018-06-13)


### Bug Fixes

* **eslint:** jsx-handler-names 判断条件写反了 ([918d604](https://github.com/NervJS/taro/commit/918d604))
* **transformer:** CoverImage 加入到默认组件 ([42370fb](https://github.com/NervJS/taro/commit/42370fb))
* **transformer:** 使用 [] 获取成员表达式出错 ([2df6309](https://github.com/NervJS/taro/commit/2df6309))
* **transformer:** 复杂表达式的加入到 state ([bdf8b45](https://github.com/NervJS/taro/commit/bdf8b45))


### Features

* **redux:** 支持深度merge ([9ab2aa8](https://github.com/NervJS/taro/commit/9ab2aa8))
* **taro-h5:** taro api 文档补上媒体部分 ([119c0b4](https://github.com/NervJS/taro/commit/119c0b4))



<a name="0.0.47"></a>
## [0.0.47](https://github.com/NervJS/taro/compare/v0.0.46...v0.0.47) (2018-06-12)


### Bug Fixes

* **async-await:** 引用第三方插件后Promise报错 ([e66177d](https://github.com/NervJS/taro/commit/e66177d))
* es入口未经编译，暂先去掉 ([5f807d5](https://github.com/NervJS/taro/commit/5f807d5))
* **components:** Image组件样式bug ([780f8b6](https://github.com/NervJS/taro/commit/780f8b6))
* **router:** 修复了router吞错误的问题 ([6bdea1f](https://github.com/NervJS/taro/commit/6bdea1f))
* **router:** 修复了路由后遗失params的问题 ([e27a015](https://github.com/NervJS/taro/commit/e27a015))
* **taro-components:** 修复radio 问题 ([2f5bae5](https://github.com/NervJS/taro/commit/2f5bae5))
* **taro-h5:** 移除puppeteer测试环境 ([e86673b](https://github.com/NervJS/taro/commit/e86673b))
* **taro-h5:** 调整 request API 的文档 ([6dab901](https://github.com/NervJS/taro/commit/6dab901))
* **tcr:** prevent adding customItem multiple times ([0d8218c](https://github.com/NervJS/taro/commit/0d8218c))
* **transformer:** 使用 object pattern 从 this 取 state. close [#84](https://github.com/NervJS/taro/issues/84) ([f304af3](https://github.com/NervJS/taro/commit/f304af3))


### Features

* **postcss-pxtransform:** fork postcss-pxtorem 进行定制，速度更快 ([98bc997](https://github.com/NervJS/taro/commit/98bc997))
* **postcss-pxtransform:** 不处理头部包含注释 /*postcss-pxtransform disable*/ 的样式文件 ([b6595c4](https://github.com/NervJS/taro/commit/b6595c4))
* **taro-h5:** Storage Api 编写好单元测试，修复若干问题，优化其文档 ([bdad8e5](https://github.com/NervJS/taro/commit/bdad8e5))
* **taro-h5:** WebSocket Api 编写好单元测试，修复若干问题，优化其文档 ([0a5dffa](https://github.com/NervJS/taro/commit/0a5dffa))
* **taro-rn:** 增加获取定位api ([08227d7](https://github.com/NervJS/taro/commit/08227d7))



<a name="0.0.46"></a>
## [0.0.46](https://github.com/NervJS/taro/compare/v0.0.45...v0.0.46) (2018-06-11)


### Bug Fixes

* **cli:**  babel unicode 问题, close [#58](https://github.com/NervJS/taro/issues/58) ([3b75aac](https://github.com/NervJS/taro/commit/3b75aac))
* **cli:** no-unused-vars ignore Taro ([4504fad](https://github.com/NervJS/taro/commit/4504fad))
* **cli:** redux包名有误 ([a416712](https://github.com/NervJS/taro/commit/a416712))
* **cli:** redux包名有误 ([09bdf44](https://github.com/NervJS/taro/commit/09bdf44))
* **cli:** typo, close [#66](https://github.com/NervJS/taro/issues/66) ([b43628f](https://github.com/NervJS/taro/commit/b43628f))
* **cli:** 从代码中获取Provider的storeName ([bcd1e5f](https://github.com/NervJS/taro/commit/bcd1e5f))
* **cli:** 小程序编译windows下本地资源引用路径错误 ([34adc7b](https://github.com/NervJS/taro/commit/34adc7b))
* **cli:** 小程序编译引用静态文件不存在时提示 ([31f3ddd](https://github.com/NervJS/taro/commit/31f3ddd))
* **components:** h5组件库button && input 增加默认样式 ([4da0bbb](https://github.com/NervJS/taro/commit/4da0bbb))
* **pxtransform:** set baseFontSize ([75c24d6](https://github.com/NervJS/taro/commit/75c24d6))
* 小程序下忽略常量的转换 ([1fb78fd](https://github.com/NervJS/taro/commit/1fb78fd))
* **pxtransform:** weapp - 单位转换插件读取config配置 ([d75b680](https://github.com/NervJS/taro/commit/d75b680))
* **tc:** button style ([484be23](https://github.com/NervJS/taro/commit/484be23))
* **tc:** checkboxGroup onChange返回值问题 ([0aaa1c4](https://github.com/NervJS/taro/commit/0aaa1c4))
* **transformer:** this.props 不会加入 usedState ([855a4d7](https://github.com/NervJS/taro/commit/855a4d7))
* **transformer:** 提前处理复杂表达式，close [#63](https://github.com/NervJS/taro/issues/63) ([d559125](https://github.com/NervJS/taro/commit/d559125))


### Features

* **cli:** 暂时把redux-h5替换为nerv-redux ([1a427b7](https://github.com/NervJS/taro/commit/1a427b7))
* **docs:** 更新native-api文档 ([5bff28c](https://github.com/NervJS/taro/commit/5bff28c))
* **redux-h5:** 添加了redux-h5 ([4aedcf7](https://github.com/NervJS/taro/commit/4aedcf7))
* **router:** 修复不同页面重叠的问题 ([bd77f2e](https://github.com/NervJS/taro/commit/bd77f2e))
* **tcr:** add component Picker ([d28e13b](https://github.com/NervJS/taro/commit/d28e13b))
* **tcr:** alter Icon to stateless component ([871b897](https://github.com/NervJS/taro/commit/871b897))
* **tcr:** alter Text to stateless component ([3975f35](https://github.com/NervJS/taro/commit/3975f35))
* **wp-runner:** postcss单位转换插件配置 ([1f14d20](https://github.com/NervJS/taro/commit/1f14d20))



<a name="0.0.45"></a>
## [0.0.45](https://github.com/NervJS/taro/compare/v0.0.44...v0.0.45) (2018-06-11)


### Bug Fixes

* **cli:** 更新模板 ([1ccada3](https://github.com/NervJS/taro/commit/1ccada3))
* **postcss-pxtransform:** 单位转换问题 ([56e46ef](https://github.com/NervJS/taro/commit/56e46ef))
* **tc:** button disabled状态触发事件问题 ([ed0e5f6](https://github.com/NervJS/taro/commit/ed0e5f6))
* **tc:** 修复Button 默认样式问题 ([de9f7fb](https://github.com/NervJS/taro/commit/de9f7fb))
* **tc:** 修复input password属性 文档问题 ([f967b98](https://github.com/NervJS/taro/commit/f967b98))
* **tc:** 删除button组件冗余代码 ([e74e87c](https://github.com/NervJS/taro/commit/e74e87c))


### Features

* **taro-h5:** add test env ([11f2d21](https://github.com/NervJS/taro/commit/11f2d21))
* **taro-rn:** 更新webSocket Api ([da8c17e](https://github.com/NervJS/taro/commit/da8c17e))
* **tc:** input 兼容type=password 写法 ([fdad135](https://github.com/NervJS/taro/commit/fdad135))
* **tc:** 兼容input password 写法 ([d248ee8](https://github.com/NervJS/taro/commit/d248ee8))
* map dispatch to props ([c1fce9f](https://github.com/NervJS/taro/commit/c1fce9f))



<a name="0.0.44"></a>
## [0.0.44](https://github.com/NervJS/taro/compare/v0.0.44-beta.4...v0.0.44) (2018-06-10)


### Bug Fixes

* **cli:** 小程序编译时对引用目录的错误提示 ([c6bd177](https://github.com/NervJS/taro/commit/c6bd177))
* **cli:** 小程序编译样式文件在windows下加个延时 ([03af054](https://github.com/NervJS/taro/commit/03af054))
* **eslint:** Provider 加入特殊的自定义组件 ([e5a900d](https://github.com/NervJS/taro/commit/e5a900d))



<a name="0.0.44-beta.4"></a>
## [0.0.44-beta.4](https://github.com/NervJS/taro/compare/v0.0.44-beta.3...v0.0.44-beta.4) (2018-06-10)


### Bug Fixes

* 暂时取消掉 flow ([af892f9](https://github.com/NervJS/taro/commit/af892f9))



<a name="0.0.44-beta.3"></a>
## [0.0.44-beta.3](https://github.com/NervJS/taro/compare/v0.0.44-beta.2...v0.0.44-beta.3) (2018-06-10)



<a name="0.0.44-beta.2"></a>
## [0.0.44-beta.2](https://github.com/NervJS/taro/compare/v0.0.44-beta.1...v0.0.44-beta.2) (2018-06-10)



<a name="0.0.44-beta.1"></a>
## [0.0.44-beta.1](https://github.com/NervJS/taro/compare/v0.0.44-beta.0...v0.0.44-beta.1) (2018-06-10)



<a name="0.0.44-beta.0"></a>
## [0.0.44-beta.0](https://github.com/NervJS/taro/compare/v0.0.43...v0.0.44-beta.0) (2018-06-10)


### Bug Fixes

* babel 插件冲突 ([b5b3793](https://github.com/NervJS/taro/commit/b5b3793))
* 小程序下单位转换designWidth配置失效 ([00a0895](https://github.com/NervJS/taro/commit/00a0895))


### Features

* 优化插件写法 ([f8a1f5b](https://github.com/NervJS/taro/commit/f8a1f5b))



<a name="0.0.43"></a>
## [0.0.43](https://github.com/NervJS/taro/compare/v0.0.42...v0.0.43) (2018-06-10)


### Bug Fixes

* **cli:** Taro 加入 eslint global ([6cc2a79](https://github.com/NervJS/taro/commit/6cc2a79))
* **cli:** 小程序编译单位转换插件没有传参 ([337a5c7](https://github.com/NervJS/taro/commit/337a5c7))


### Features

* **eslint:** jsx-handler-names 加入到 eslint-plugin-taro ([a8b7ead](https://github.com/NervJS/taro/commit/a8b7ead))



<a name="0.0.42"></a>
## [0.0.42](https://github.com/NervJS/taro/compare/v0.0.41...v0.0.42) (2018-06-09)


### Bug Fixes

* **cli:** windows 下require引用路径错误 ([0da960a](https://github.com/NervJS/taro/commit/0da960a))
* **cli:** windows下页面文件的写入路径错误 ([375f2dd](https://github.com/NervJS/taro/commit/375f2dd))
* **cli:** 小程序端编译抽取npm包文件bug修复 ([1ce8223](https://github.com/NervJS/taro/commit/1ce8223))
* **eslint:** 禁用掉 react/no-deprecated ([f586b85](https://github.com/NervJS/taro/commit/f586b85))
* **taro-h5:** 更新 h5 api 文档 ([bc05ce9](https://github.com/NervJS/taro/commit/bc05ce9))
* **taro-weapp:** 支持自定义组件循环输出自定义组件 ([a0af9d9](https://github.com/NervJS/taro/commit/a0af9d9))


### Features

* **cli:** add [@tarojs](https://github.com/tarojs)/cli as devDependency to template ([4723de7](https://github.com/NervJS/taro/commit/4723de7))
* **cli:** add npm scripts for deployment ([5a2dfbe](https://github.com/NervJS/taro/commit/5a2dfbe))
* **cli:** ignore .npmrc when using yarn ([c02f304](https://github.com/NervJS/taro/commit/c02f304))
* **taro-rn:** 更新media, vibrate相关API ([56dce1e](https://github.com/NervJS/taro/commit/56dce1e))
* **tc:** add swiper test ([94ee648](https://github.com/NervJS/taro/commit/94ee648))
* add packages postcss-pxtransform ([78e7cbc](https://github.com/NervJS/taro/commit/78e7cbc))
* 把转换器加入到主仓库 ([f96c251](https://github.com/NervJS/taro/commit/f96c251))



<a name="0.0.41"></a>
## [0.0.41](https://github.com/NervJS/taro/compare/v0.0.40...v0.0.41) (2018-06-08)


### Bug Fixes

* **cli:** require文件路径统一使用 / 分割 ([c3a1502](https://github.com/NervJS/taro/commit/c3a1502))
* **cli:** windows下路径检测错误 ([874c3b3](https://github.com/NervJS/taro/commit/874c3b3))


### Features

* **cli:** 更新下模板 ([c2b8797](https://github.com/NervJS/taro/commit/c2b8797))
* **cli:** 添加 npmrc 用于读取 taobao 镜像资源 ([3df76fe](https://github.com/NervJS/taro/commit/3df76fe))
* **taro-h5/api:** h5端增加socket api ([b2c3459](https://github.com/NervJS/taro/commit/b2c3459))
* **taro-h5/api:** socket api 文档修复 ([c1d0d99](https://github.com/NervJS/taro/commit/c1d0d99))
* **tc:** progress, radio test ([9f6754a](https://github.com/NervJS/taro/commit/9f6754a))



<a name="0.0.40"></a>
## [0.0.40](https://github.com/NervJS/taro/compare/v0.0.39...v0.0.40) (2018-06-07)


### Bug Fixes

* **taro-components:** tabBar逻辑同步小程序 ([341b2f8](https://github.com/NervJS/taro/commit/341b2f8))
* **taro-rn:** 去掉rn框架打包 ([9d247b7](https://github.com/NervJS/taro/commit/9d247b7))
* **webpack-runner:** 缺少postcss-plugin-constparse依赖，fixes [#14](https://github.com/NervJS/taro/issues/14) ([5a3bec7](https://github.com/NervJS/taro/commit/5a3bec7))


### Features

* **taro:** 更新typings ([f73d68d](https://github.com/NervJS/taro/commit/f73d68d))
* **taro-rn:** 更新clipboard相关API ([946afd1](https://github.com/NervJS/taro/commit/946afd1))
* **taro-rn:** 更新makePhoneCall ([7ca2710](https://github.com/NervJS/taro/commit/7ca2710))
* **taro-rn:** 更新system、network相关API ([260eddf](https://github.com/NervJS/taro/commit/260eddf))
* **tc:** 完善icon, input等测试用例。 修复audio问题 ([6827d4f](https://github.com/NervJS/taro/commit/6827d4f))



<a name="0.0.39"></a>
## [0.0.39](https://github.com/NervJS/taro/compare/v0.0.38...v0.0.39) (2018-06-07)


### Bug Fixes

* **cli:** tabBar配置中的图片路径处理（转H5） ([5f6f885](https://github.com/NervJS/taro/commit/5f6f885))
* **cli:** 排除不需要安装的包，暂时处理 ([61cf6c8](https://github.com/NervJS/taro/commit/61cf6c8))
* **taro-rn:** api引用方式更新 ([463bb53](https://github.com/NervJS/taro/commit/463bb53))
* **wp-runner:** postcss-loader排除node_modules目录 ([189b645](https://github.com/NervJS/taro/commit/189b645))


### Features

* **cli:** parse constants in css ([e62afbd](https://github.com/NervJS/taro/commit/e62afbd))
* **learn.json:** 新增的包添加到lerna配置 ([f3616c8](https://github.com/NervJS/taro/commit/f3616c8))
* **taro-rn:** 更新storageAPI ([a47cf71](https://github.com/NervJS/taro/commit/a47cf71))
* **taro-rn:** 更新暂定能实现的api列表和本周完成列表 ([21c6af8](https://github.com/NervJS/taro/commit/21c6af8))
* **tcr:** add component Input ([bb10fa8](https://github.com/NervJS/taro/commit/bb10fa8))
* **tcr:** add component Textarea ([99f4939](https://github.com/NervJS/taro/commit/99f4939))



<a name="0.0.38"></a>
## [0.0.38](https://github.com/NervJS/taro/compare/v0.0.37...v0.0.38) (2018-06-06)


### Bug Fixes

* **components:** 导出 typings ([0f8eb39](https://github.com/NervJS/taro/commit/0f8eb39))


### Features

* **component:** tyings for camera, canvas, opendata, video ([dbe84c5](https://github.com/NervJS/taro/commit/dbe84c5))
* **tcr:** add component RichText ([bb3eb0c](https://github.com/NervJS/taro/commit/bb3eb0c))
* **tcr:** uncomplete Input ([ef5b6cf](https://github.com/NervJS/taro/commit/ef5b6cf))



<a name="0.0.37"></a>
## [0.0.37](https://github.com/NervJS/taro/compare/v0.0.36...v0.0.37) (2018-06-05)


### Bug Fixes

* **cli:** 自动安装未安装的npm包 ([dde6aa7](https://github.com/NervJS/taro/commit/dde6aa7))


### Features

* **cli:** rn编译处理，写入必要文件 ([1253cf9](https://github.com/NervJS/taro/commit/1253cf9))
* **component:** typings for  Checkbox, CheckboxGroup, Form, Input ([bc96bcc](https://github.com/NervJS/taro/commit/bc96bcc))
* **components:** typings for CoverView, CoverImage ([316c818](https://github.com/NervJS/taro/commit/316c818))
* **components:** typings for Label, Picker, Radio ([3c484ef](https://github.com/NervJS/taro/commit/3c484ef))
* **components:** typings for MovableArea, MovableView ([9b38c64](https://github.com/NervJS/taro/commit/9b38c64))
* **components:** typings for Navigator, Image ([652ad4d](https://github.com/NervJS/taro/commit/652ad4d))
* **components:** typings for Progress, Button ([f621ec0](https://github.com/NervJS/taro/commit/f621ec0))
* **components:** typings for Slider, Switch, Textarea ([07ab171](https://github.com/NervJS/taro/commit/07ab171))
* **components:** typings for Text, RichText, Icon ([04ce7b8](https://github.com/NervJS/taro/commit/04ce7b8))
* **components:** 给 typings 加入注释 ([1b5746f](https://github.com/NervJS/taro/commit/1b5746f))
* **rn-runner:** rn打包工具优化 ([83d9e74](https://github.com/NervJS/taro/commit/83d9e74))
* **tc:** 补全View组件测试 ([a19a61f](https://github.com/NervJS/taro/commit/a19a61f))
* **tcr:** add component ScrollView ([6066bb5](https://github.com/NervJS/taro/commit/6066bb5))



<a name="0.0.36"></a>
## [0.0.36](https://github.com/NervJS/taro/compare/v0.0.35...v0.0.36) (2018-06-04)


### Bug Fixes

* **cli:** 替换node_modules里的包引用之前去掉注释 ([8d043d9](https://github.com/NervJS/taro/commit/8d043d9))
* **weapp:** 微信小程序框架文件打包错误 ([5c82785](https://github.com/NervJS/taro/commit/5c82785))



<a name="0.0.35"></a>
## [0.0.35](https://github.com/NervJS/taro/compare/v0.0.34...v0.0.35) (2018-06-04)


### Bug Fixes

* **tcr:** correct the style of switch and checkbox ([601a930](https://github.com/NervJS/taro/commit/601a930))


### Features

* **cli:** rn编译将组件库替换成rn组件库 ([ed229b1](https://github.com/NervJS/taro/commit/ed229b1))
* **rn:** rn打包 ([924e99f](https://github.com/NervJS/taro/commit/924e99f))
* **rn-runner:** rn打包工具 ([0d5d606](https://github.com/NervJS/taro/commit/0d5d606))
* **router:** 路由功能升级 去除了动画 兼容前进、后退 ([368eb28](https://github.com/NervJS/taro/commit/368eb28))
* **taro-h5:** h5 侧 nerv component 做了层中间层，注入$app ([805c9df](https://github.com/NervJS/taro/commit/805c9df))
* **taro-rn:** 增加rn本地能力API ([a653768](https://github.com/NervJS/taro/commit/a653768))
* **tc:** 新增view组件测试 ([90c8e2d](https://github.com/NervJS/taro/commit/90c8e2d))
* **tcr:** add component Button ([cb3aecf](https://github.com/NervJS/taro/commit/cb3aecf))
* **tcr:** add component Progress ([48370ba](https://github.com/NervJS/taro/commit/48370ba))
* **tcr:** add component Radio ([bf26b64](https://github.com/NervJS/taro/commit/bf26b64))
* **tcr:** add component Slider ([5c8a579](https://github.com/NervJS/taro/commit/5c8a579))
* **tcr:** add component Swiper ([fa12fbe](https://github.com/NervJS/taro/commit/fa12fbe))
* **tcr:** patch animation to loading button ([9d63e3b](https://github.com/NervJS/taro/commit/9d63e3b))
* 加入 View, ScrollView 的类型 ([0d8bff9](https://github.com/NervJS/taro/commit/0d8bff9))



<a name="0.0.34"></a>
## [0.0.34](https://github.com/NervJS/taro/compare/v0.0.33...v0.0.34) (2018-05-29)


### Bug Fixes

* **cli:** h5编译Component从[@tarojs](https://github.com/tarojs)/taro-h5中import ([053feaa](https://github.com/NervJS/taro/commit/053feaa))
* **cli:** rn编译功能 ([fa7c571](https://github.com/NervJS/taro/commit/fa7c571))
* **cli:** rn编译将组件的className与id属性改写成style ([3aef579](https://github.com/NervJS/taro/commit/3aef579))
* **cli:** 模板变更 ([8c0a298](https://github.com/NervJS/taro/commit/8c0a298))
* **taro-weapp:** 小程序端引入PropTypes错误 ([c590a89](https://github.com/NervJS/taro/commit/c590a89))
* **tc:** 修复radio,button,view组件相关问题，移除lodash ([bcf199a](https://github.com/NervJS/taro/commit/bcf199a))


### Features

* **taro-rn:** 增加rn框架 ([4ad36ac](https://github.com/NervJS/taro/commit/4ad36ac))
* **tcr:** add component checkbox ([2e2c8c6](https://github.com/NervJS/taro/commit/2e2c8c6))
* **tcr:** add component image ([107e5da](https://github.com/NervJS/taro/commit/107e5da))
* **tcr:** add component Text ([a2911a0](https://github.com/NervJS/taro/commit/a2911a0))
* **tcr:** return wrappedComponent when there is no onClick callback ([fb3b443](https://github.com/NervJS/taro/commit/fb3b443))



<a name="0.0.33"></a>
## [0.0.33](https://github.com/NervJS/taro/compare/v0.0.32...v0.0.33) (2018-05-29)


### Bug Fixes

* **components:** support object rest spread ([e474a53](https://github.com/NervJS/taro/commit/e474a53))
* **components:** tabbar ([6dfcf36](https://github.com/NervJS/taro/commit/6dfcf36))
* **components:** tabbar 布局 ([7f4a50b](https://github.com/NervJS/taro/commit/7f4a50b))
* **components:** 防止unmount后autoplay报错 ([de2afa9](https://github.com/NervJS/taro/commit/de2afa9))
* **eslint:** 不支持在类参数定义 JSX ([83fd7a0](https://github.com/NervJS/taro/commit/83fd7a0))
* form 去除冗余代码 ([66cd81e](https://github.com/NervJS/taro/commit/66cd81e))
* **eslint:** 空 JSX 元素应该自动闭合 ([50a1704](https://github.com/NervJS/taro/commit/50a1704))
* **eslint:** 规则格式设置不正确 ([acc78d5](https://github.com/NervJS/taro/commit/acc78d5))
* **eslint-config:** 文件配置错误 ([56a58d0](https://github.com/NervJS/taro/commit/56a58d0))
* **router:** h5路由回退传参问题 ([c3266d6](https://github.com/NervJS/taro/commit/c3266d6))
* **router:** h5路由方法执行顺序 ([1f445e0](https://github.com/NervJS/taro/commit/1f445e0))
* **swiper:** 允许垂直滚动 ([8590825](https://github.com/NervJS/taro/commit/8590825))
* **taro-components:** 添加e.detail内容 ([3bd15f1](https://github.com/NervJS/taro/commit/3bd15f1))
* **weapp:** 大小写问题 ([a55efb7](https://github.com/NervJS/taro/commit/a55efb7))
* label事件、样式等修复 ([e12cd67](https://github.com/NervJS/taro/commit/e12cd67))
* 修复radio-group 返回值问题 ([5dcb2be](https://github.com/NervJS/taro/commit/5dcb2be))
* 修复表单返回值问题 ([c42b6db](https://github.com/NervJS/taro/commit/c42b6db))


### Features

* **button:** add ([25232db](https://github.com/NervJS/taro/commit/25232db))
* **cli:** 修正模板 ([e1a7fb5](https://github.com/NervJS/taro/commit/e1a7fb5))
* **cli:** 默认模板加入 eslint ([ec2adb1](https://github.com/NervJS/taro/commit/ec2adb1))
* **components:** 添加组件测试 ([ab6e4af](https://github.com/NervJS/taro/commit/ab6e4af))
* **components:** 添加部分组件测试 ([08937ff](https://github.com/NervJS/taro/commit/08937ff))
* **detail:** ignore ([2d37c3c](https://github.com/NervJS/taro/commit/2d37c3c))
* **eslint:**  新规则：no-spread-in-props ([deb74a4](https://github.com/NervJS/taro/commit/deb74a4))
* **eslint:** eslint-config-taro ([37514b5](https://github.com/NervJS/taro/commit/37514b5))
* **eslint:** 新规则: custom-component-children ([1e0a9d5](https://github.com/NervJS/taro/commit/1e0a9d5))
* **eslint:** 新规则: manipulate-jsx-as-array ([fb50d16](https://github.com/NervJS/taro/commit/fb50d16))
* **eslint:** 新规则: no-anonymous-function-in-props ([e836e01](https://github.com/NervJS/taro/commit/e836e01))
* **eslint:** 新规则: no-jsx-in-class-method ([baf85b7](https://github.com/NervJS/taro/commit/baf85b7))
* **eslint:** 新规则: no-jsx-in-props ([28c38f4](https://github.com/NervJS/taro/commit/28c38f4))
* **eslint:** 新规则: no-ref ([b62dcc2](https://github.com/NervJS/taro/commit/b62dcc2))
* **eslint:** 新规则：if-statement-in-map-loop ([995aa1d](https://github.com/NervJS/taro/commit/995aa1d))
* **eslint:** 新规则：no-stateless-component ([cd05784](https://github.com/NervJS/taro/commit/cd05784))
* **eslint:** 设置变量定义规则 ([7dee64d](https://github.com/NervJS/taro/commit/7dee64d))
* **router:** 修复h5路由back功能 ([0e9e77c](https://github.com/NervJS/taro/commit/0e9e77c))
* **taro:** 加入 Component 类型 ([afed5f3](https://github.com/NervJS/taro/commit/afed5f3))
* **taro:** 加入 ENV 和 Events 类型 ([a87fc33](https://github.com/NervJS/taro/commit/a87fc33))
* **taro:** 加入 PureComponent typing ([af49f05](https://github.com/NervJS/taro/commit/af49f05))
* **taro:** 加入 taro tsd 入口 ([6fcc507](https://github.com/NervJS/taro/commit/6fcc507))
* **taro:** 加入微信端能力类型 ([42f8c09](https://github.com/NervJS/taro/commit/42f8c09))
* **taro-weapp:** 小程序端增加PureComponent支持 ([1e4a107](https://github.com/NervJS/taro/commit/1e4a107))
* **tcr:** add component checkbox ([6e57d1e](https://github.com/NervJS/taro/commit/6e57d1e))
* **tcr:** add component switch ([698aa88](https://github.com/NervJS/taro/commit/698aa88))
* **tcr:** add component view ([7947b65](https://github.com/NervJS/taro/commit/7947b65))
* **tcr:** change event name to on* ([81d10b9](https://github.com/NervJS/taro/commit/81d10b9))
* **tcr:** dismember styles ([e166b85](https://github.com/NervJS/taro/commit/e166b85))
* 新增测试用例 ([ccedb17](https://github.com/NervJS/taro/commit/ccedb17))
* 新增组件基本测试, 更改文件目录结构 ([3768785](https://github.com/NervJS/taro/commit/3768785))
* 新增组件库测试用例 ([680b4f5](https://github.com/NervJS/taro/commit/680b4f5))
* **tcr:** testing modified ([7e50324](https://github.com/NervJS/taro/commit/7e50324))
* **weapp:** 支持 PropTypes ([dd59b1d](https://github.com/NervJS/taro/commit/dd59b1d))



<a name="0.0.32"></a>
## [0.0.32](https://github.com/NervJS/taro/compare/v0.0.31...v0.0.32) (2018-05-21)


### Bug Fixes

* **cli:** h5 编译 app.js 中页面引用去掉 ([39c4695](https://github.com/NervJS/taro/commit/39c4695))
* **cli:** h5 编译增加相关内置方法名 ([ddf9be5](https://github.com/NervJS/taro/commit/ddf9be5))
* **components:** 组件错误 ([9e6e2ca](https://github.com/NervJS/taro/commit/9e6e2ca))
* **router:** H5 路由去掉动画 && 路由参数错误 ([a3771dd](https://github.com/NervJS/taro/commit/a3771dd))
* **taro-h5:** 读取本地缓存方法错误 ([c3537de](https://github.com/NervJS/taro/commit/c3537de))


### Features

* **cli:** 更新模板html ([2cabc21](https://github.com/NervJS/taro/commit/2cabc21))
* **cli:** 更新模板html ([adadd02](https://github.com/NervJS/taro/commit/adadd02))
* **taro:** 微信小程序 getCurrentPages 和 getApp挂载在 Taro 命名空间下 ([744dda7](https://github.com/NervJS/taro/commit/744dda7))
* **taro-h5:** h5端request支持jsonp ([743e9bd](https://github.com/NervJS/taro/commit/743e9bd))
* **taro-h5:** jsonp方法返回状态码 ([a4bb352](https://github.com/NervJS/taro/commit/a4bb352))



<a name="0.0.31"></a>
## [0.0.31](https://github.com/NervJS/taro/compare/v0.0.30...v0.0.31) (2018-05-14)


### Bug Fixes

* **redux:** 生命周期执行有误 ([4e0ed66](https://github.com/NervJS/taro/commit/4e0ed66))



<a name="0.0.30"></a>
## [0.0.30](https://github.com/NervJS/taro/compare/v0.0.29...v0.0.30) (2018-05-11)


### Bug Fixes

* **async-await:** const => var ([7b01013](https://github.com/NervJS/taro/commit/7b01013))
* **cli:** 模板html增加font-size设置 ([e16b534](https://github.com/NervJS/taro/commit/e16b534))
* **cli:** 遗漏inquirer ([c5969d7](https://github.com/NervJS/taro/commit/c5969d7))
* **redux:** 当页面onHide后，redux的dispatch不再触发页面更新 ([6dbe2af](https://github.com/NervJS/taro/commit/6dbe2af))
* **taro-h5/api:** selectorQuery api 去掉缓存dom节点的逻辑 ([6b618ab](https://github.com/NervJS/taro/commit/6b618ab))


### Features

* **cli:** 增加css压缩 && autoprefixer ([f0a39fe](https://github.com/NervJS/taro/commit/f0a39fe))
* **cli:** 增加taro-plugin-uglifyjs插件 ([9c49ff3](https://github.com/NervJS/taro/commit/9c49ff3))
* **cli:** 支持uglify是否开启 ([560ce14](https://github.com/NervJS/taro/commit/560ce14))
* **cli:** 更新模板 ([3ff5c5f](https://github.com/NervJS/taro/commit/3ff5c5f))
* **taro:** 优化——只将模板需要用到的数据写入页面的data中 ([89813be](https://github.com/NervJS/taro/commit/89813be))



<a name="0.0.29"></a>
## [0.0.29](https://github.com/NervJS/taro/compare/v0.0.28...v0.0.29) (2018-05-08)


### Features

* 支持Taro.render写法 ([6d154c3](https://github.com/NervJS/taro/commit/6d154c3))
* 粗略支持浏览器后退功能 并且加入了路由动画 ([2183ecc](https://github.com/NervJS/taro/commit/2183ecc))
* **cli:** 创建项目模板读取cli包的版本号 ([88362c0](https://github.com/NervJS/taro/commit/88362c0))
* **taro:** 动态组件重新初始化 ([c09f41a](https://github.com/NervJS/taro/commit/c09f41a))
* **taro-weapp:** 支持defaultProps ([d0a09b0](https://github.com/NervJS/taro/commit/d0a09b0))



<a name="0.0.28"></a>
## [0.0.28](https://github.com/NervJS/taro/compare/v0.0.27...v0.0.28) (2018-05-07)


### Bug Fixes

* **taro:** 动态组件更新传参有误 ([56824b5](https://github.com/NervJS/taro/commit/56824b5))
* **taro:** 编译日志输出 ([472e730](https://github.com/NervJS/taro/commit/472e730))


### Features

* **cli:** 升级模板依赖包 ([bf7440b](https://github.com/NervJS/taro/commit/bf7440b))



<a name="0.0.27"></a>
## [0.0.27](https://github.com/NervJS/taro/compare/v0.0.26...v0.0.27) (2018-05-06)


### Bug Fixes

* 修复h5模式watch功能的一个手抖 ([86fbebd](https://github.com/NervJS/taro/commit/86fbebd))
* 修复windows下无法build weapp的问题 ([6081999](https://github.com/NervJS/taro/commit/6081999))
* **cli:** 静态资源链接替换成绝对路径 ([55ac72b](https://github.com/NervJS/taro/commit/55ac72b))


### Features

* **taro:** 增加全局事件机制 ([4badc78](https://github.com/NervJS/taro/commit/4badc78))



<a name="0.0.26"></a>
## [0.0.26](https://github.com/NervJS/taro/compare/v0.0.25...v0.0.26) (2018-05-04)


### Bug Fixes

* **webpack-runner:** webpack-dev-server 版本回退到2.11.2 ([53e4d02](https://github.com/NervJS/taro/commit/53e4d02))



<a name="0.0.25"></a>
## [0.0.25](https://github.com/NervJS/taro/compare/v0.0.24...v0.0.25) (2018-05-04)


### Bug Fixes

* **webpack-runner:** 增加webpack-dev-server ([047e456](https://github.com/NervJS/taro/commit/047e456))



<a name="0.0.24"></a>
## [0.0.24](https://github.com/NervJS/taro/compare/v0.0.23...v0.0.24) (2018-05-04)


### Bug Fixes

* **taro:** 文件打包错误 ([e739236](https://github.com/NervJS/taro/commit/e739236))



<a name="0.0.23"></a>
## [0.0.23](https://github.com/NervJS/taro/compare/v0.0.22...v0.0.23) (2018-05-03)


### Bug Fixes

* **taro:** 动态组件更新传参 ([2fbf82b](https://github.com/NervJS/taro/commit/2fbf82b))
* **taro-h5:** 丢失文件 ([f21ef16](https://github.com/NervJS/taro/commit/f21ef16))
* **taro-h5:** 文件引用错误 ([38f695d](https://github.com/NervJS/taro/commit/38f695d))
* **taro-weapp:** 文件引用错误 ([e87ed92](https://github.com/NervJS/taro/commit/e87ed92))


### Features

* h5watch功能补上hot ([f579aa9](https://github.com/NervJS/taro/commit/f579aa9))
* nerv-to-mp版本更新 ([2621698](https://github.com/NervJS/taro/commit/2621698))
* **cli:** h5编译处理 [@tarojs](https://github.com/tarojs)/taro-h5 ([93ac1d3](https://github.com/NervJS/taro/commit/93ac1d3))
* **taro:** taro拆分 ([ce02eef](https://github.com/NervJS/taro/commit/ce02eef))
* **taro:** 更新export ([00bb319](https://github.com/NervJS/taro/commit/00bb319))
* **taro/api:** 完成界面/交互反馈API ([87c8e99](https://github.com/NervJS/taro/commit/87c8e99))



<a name="0.0.22"></a>
## [0.0.22](https://github.com/NervJS/taro/compare/v0.0.21...v0.0.22) (2018-05-03)


### Bug Fixes

* **router:** 修复h5路由组件的redux兼容 ([4364f66](https://github.com/NervJS/taro/commit/4364f66))
* **taro:** 名称错误 ([b4b8a6d](https://github.com/NervJS/taro/commit/b4b8a6d))
* **taro:** 运行时组件类注入方法 && 页面的componentWillUpdate中渲染一次页面 ([4221f5d](https://github.com/NervJS/taro/commit/4221f5d))
* 固定版本 ([d4b3727](https://github.com/NervJS/taro/commit/d4b3727))


### Features

* **cli:** 添加h5模式watch功能 ([f9444a8](https://github.com/NervJS/taro/commit/f9444a8))



<a name="0.0.21"></a>
## [0.0.21](https://github.com/NervJS/taro/compare/v0.0.20...v0.0.21) (2018-05-02)


### Bug Fixes

* **eslint:** array 没有 key 的时候 warning ([87f80a4](https://github.com/NervJS/taro/commit/87f80a4))
* **redux:** 允许mapDispatchToProps不存在 ([d1d84cd](https://github.com/NervJS/taro/commit/d1d84cd))
* **taro:** componentWillMount中强制渲染一次页面 ([e33ef3f](https://github.com/NervJS/taro/commit/e33ef3f))
* **taro:** setData前过滤undefined数据 ([c2f4e7c](https://github.com/NervJS/taro/commit/c2f4e7c))
* **taro:** 修正app中$app指向 ([cd63886](https://github.com/NervJS/taro/commit/cd63886))
* **taro:** 初始化组件$router ([f6d22a4](https://github.com/NervJS/taro/commit/f6d22a4))
* **taro:** 组件中也能访问到this.$router.params ([1d60ebd](https://github.com/NervJS/taro/commit/1d60ebd))


### Features

* **swiper:** 修复swiper ([822b96a](https://github.com/NervJS/taro/commit/822b96a))



<a name="0.0.20"></a>
## [0.0.20](https://github.com/NervJS/taro/compare/v0.0.19...v0.0.20) (2018-04-28)


### Bug Fixes

* **redux:** 保证每次取的数据都是新的 ([ad34b4a](https://github.com/NervJS/taro/commit/ad34b4a))
* **redux:** 循环输出组件调整 ([02fa5f4](https://github.com/NervJS/taro/commit/02fa5f4))
* **redux:** 组件props更新 ([6aa00a4](https://github.com/NervJS/taro/commit/6aa00a4))
* **taro:** 区分state ([d8f3e67](https://github.com/NervJS/taro/commit/d8f3e67))
* **taro:** 循环输出组件传参 ([f89b691](https://github.com/NervJS/taro/commit/f89b691))


### Features

* **taro:** 优化编译错误输出 ([177ca00](https://github.com/NervJS/taro/commit/177ca00))
* **taro:** 支持循环输出自定义组件 ([4dc86f2](https://github.com/NervJS/taro/commit/4dc86f2))



<a name="0.0.19"></a>
## [0.0.19](https://github.com/NervJS/taro/compare/v0.0.18...v0.0.19) (2018-04-25)


### Bug Fixes

* **redux:** 组件初始化传递props ([487d9a5](https://github.com/NervJS/taro/commit/487d9a5))
* **taro:** __data中$path丢失 ([e1a4f61](https://github.com/NervJS/taro/commit/e1a4f61))
* **taro:** 优化数据结构 ([8781395](https://github.com/NervJS/taro/commit/8781395))
* **taro:** 组件中循环事件绑定传参 ([b4db68f](https://github.com/NervJS/taro/commit/b4db68f))


### Features

* **cli:** 模板依赖版本升级 ([57689ab](https://github.com/NervJS/taro/commit/57689ab))



<a name="0.0.18"></a>
## [0.0.18](https://github.com/NervJS/taro/compare/v0.0.17...v0.0.18) (2018-04-23)


### Bug Fixes

* **taro:** api初始化 ([1e66925](https://github.com/NervJS/taro/commit/1e66925))
* **taro:** api方法执行错误 ([14bbbfe](https://github.com/NervJS/taro/commit/14bbbfe))
* **taro:** 执行完componentWillMount后需要把组件设置为可运行状态 ([d4d2519](https://github.com/NervJS/taro/commit/d4d2519))
* **taro:** 执行完componentWillMount后需要设置组件状态 ([b065e57](https://github.com/NervJS/taro/commit/b065e57))
* **taro:** 支持小程序page事件处理函数 ([e820e32](https://github.com/NervJS/taro/commit/e820e32))



<a name="0.0.17"></a>
## [0.0.17](https://github.com/NervJS/taro/compare/v0.0.16...v0.0.17) (2018-04-23)


### Bug Fixes

* **taro:** Taro.request 方法H5端返回错误 ([b53bdc5](https://github.com/NervJS/taro/commit/b53bdc5))
* **taro:** 编译后wxml自定义属性调整 ([8ca7b82](https://github.com/NervJS/taro/commit/8ca7b82))


### Features

* **taro:** add api.md ([cc58c3f](https://github.com/NervJS/taro/commit/cc58c3f))
* **taro:** 支持app及page的onShow/onHide方法 ([04e3ae9](https://github.com/NervJS/taro/commit/04e3ae9))



<a name="0.0.16"></a>
## [0.0.16](https://github.com/NervJS/taro/compare/v0.0.15...v0.0.16) (2018-04-22)


### Features

* **cli:** 处理入口文件中 config 的tabBar配置 ([e923fb2](https://github.com/NervJS/taro/commit/e923fb2))



<a name="0.0.15"></a>
## [0.0.15](https://github.com/NervJS/taro/compare/v0.0.14...v0.0.15) (2018-04-22)


### Bug Fixes

* **cli:** 避免重复编译文件 ([6632a90](https://github.com/NervJS/taro/commit/6632a90))
* **redux:** props传递 && 组件卸载时执行顺序 ([ec56a1e](https://github.com/NervJS/taro/commit/ec56a1e))
* **taro:** componentWillUnmount 生命周期方法错误 ([0a5b715](https://github.com/NervJS/taro/commit/0a5b715))
* **taro:** 修正request api返回结果 ([ae6e54c](https://github.com/NervJS/taro/commit/ae6e54c))


### Features

* **taro:** format by prettier ([163b7bb](https://github.com/NervJS/taro/commit/163b7bb))
* **taro:** h5支持tabbar配置 ([e1a96df](https://github.com/NervJS/taro/commit/e1a96df))
* **taro-components:** 增加tabbar组件 ([c0331ac](https://github.com/NervJS/taro/commit/c0331ac))



<a name="0.0.14"></a>
## [0.0.14](https://github.com/NervJS/taro/compare/v0.0.13...v0.0.14) (2018-04-20)


### Bug Fixes

* **taro:** storage API 增加环境判断 ([9d432e6](https://github.com/NervJS/taro/commit/9d432e6))
* **taro:** 组件更新时调用_createData ([b8508d5](https://github.com/NervJS/taro/commit/b8508d5))


### Features

* **eslint:** 加入 import 和 standard 规则 ([c6ae960](https://github.com/NervJS/taro/commit/c6ae960))
* **eslint:** 设置 jsx 语法 ([0715dbd](https://github.com/NervJS/taro/commit/0715dbd))
* **taro:** 暴露环境获取API ([02e7ad8](https://github.com/NervJS/taro/commit/02e7ad8))



<a name="0.0.13"></a>
## [0.0.13](https://github.com/NervJS/taro/compare/v0.0.12...v0.0.13) (2018-04-19)


### Bug Fixes

* **async-await:** 代码错误 ([faff50f](https://github.com/NervJS/taro/commit/faff50f))
* **redux:** 判断生命周期方法存不存在 ([565b38e](https://github.com/NervJS/taro/commit/565b38e))


### Features

* **taro:** 生命周期执行调整 && setState()支持回调 ([cd2b1b5](https://github.com/NervJS/taro/commit/cd2b1b5))



<a name="0.0.12"></a>
## [0.0.12](https://github.com/NervJS/taro/compare/v0.0.11...v0.0.12) (2018-04-19)


### Bug Fixes

* **cli:** watch时样式文件修改 ([771ee96](https://github.com/NervJS/taro/commit/771ee96))
* **redux:** 方法在props也能访问到 ([db40cba](https://github.com/NervJS/taro/commit/db40cba))



<a name="0.0.11"></a>
## [0.0.11](https://github.com/NervJS/taro/compare/v0.0.10...v0.0.11) (2018-04-19)


### Bug Fixes

* **cli:** weapp模式编译对export default的处理 ([ed5f6d7](https://github.com/NervJS/taro/commit/ed5f6d7))
* **tarojs:** method rename ([4290c43](https://github.com/NervJS/taro/commit/4290c43))
* **tarojs:** page生命周期调用 ([304fc13](https://github.com/NervJS/taro/commit/304fc13))
* **tarojs:** 组件生命周期触发 ([7385099](https://github.com/NervJS/taro/commit/7385099))


### Features

* **cli:** 更新模板 ([de507ab](https://github.com/NervJS/taro/commit/de507ab))
* **cli:** 某些npm文件运行时会出错，增加hack支持 ([8b20f9a](https://github.com/NervJS/taro/commit/8b20f9a))



<a name="0.0.10"></a>
## [0.0.10](https://github.com/NervJS/taro/compare/v0.0.9...v0.0.10) (2018-04-17)


### Bug Fixes

* **cli:** ast遍历书写优化 && 支持[@tarojs](https://github.com/tarojs)/redux调用 ([442da22](https://github.com/NervJS/taro/commit/442da22))
* **redux:** [@tarojs](https://github.com/tarojs)/redux 包名 ([bf329fc](https://github.com/NervJS/taro/commit/bf329fc))
* **taro:** 处理事件需要遍历原型链 && [@tarojs](https://github.com/tarojs)/redux引用错误 ([f4fc09c](https://github.com/NervJS/taro/commit/f4fc09c))


### Features

* add packages taro-components-rn ([1a7eb6c](https://github.com/NervJS/taro/commit/1a7eb6c))
* **taro-redux:** 加入redux支持 ([fb66c66](https://github.com/NervJS/taro/commit/fb66c66))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/NervJS/taro/compare/v0.0.8...v0.0.9) (2018-04-16)


### Bug Fixes

* 修改文件提示 ([8cb66f0](https://github.com/NervJS/taro/commit/8cb66f0))
* **cli:** 更新配置的使用 ([4388e00](https://github.com/NervJS/taro/commit/4388e00))
* **tarojs:** _createData重复执行 ([f55a9d1](https://github.com/NervJS/taro/commit/f55a9d1))


### Features

* 配置文件放到config目录 && 支持环境变量配置编译替换 ([a95ef83](https://github.com/NervJS/taro/commit/a95ef83))
* **cli:** 支持全局自定义变量配置 ([890ad3b](https://github.com/NervJS/taro/commit/890ad3b))
* **cli:** 更新模板 ([f9fd598](https://github.com/NervJS/taro/commit/f9fd598))
* **taro:** add storage api ([e013600](https://github.com/NervJS/taro/commit/e013600))
* **taro:** 导出编译期使用的内部方法 ([58e608e](https://github.com/NervJS/taro/commit/58e608e))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/NervJS/taro/compare/v0.0.7...v0.0.8) (2018-04-11)


### Bug Fixes

* **tarojs:** page独立、事件只绑定一次 ([c5a173d](https://github.com/NervJS/taro/commit/c5a173d))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/NervJS/taro/compare/v0.0.6...v0.0.7) (2018-04-09)


### Bug Fixes

* **cli:** watch 样式页面文件修改时路径处理 ([433e4ee](https://github.com/NervJS/taro/commit/433e4ee))
* **taro:** 防止state.__data被不断传递下去 ([abde772](https://github.com/NervJS/taro/commit/abde772))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/NervJS/taro/compare/v0.0.5...v0.0.6) (2018-04-09)


### Bug Fixes

* **cli:** watch 页面文件修改时路径处理 ([b60d9d1](https://github.com/NervJS/taro/commit/b60d9d1))
* **cli:** 调整initRouter的执行时序 调整initRouter的入参 ([7406942](https://github.com/NervJS/taro/commit/7406942))
* **router:** 添加部分'index.html'支持 ([3e13e3f](https://github.com/NervJS/taro/commit/3e13e3f))
* **taro:** 小程序api能力增加导航相关 ([9c89972](https://github.com/NervJS/taro/commit/9c89972))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/NervJS/taro/compare/v0.0.4...v0.0.5) (2018-04-09)


### Bug Fixes

* **taro:** package.json main ([eaafc5c](https://github.com/NervJS/taro/commit/eaafc5c))


### Features

*  form ([7e6f9cf](https://github.com/NervJS/taro/commit/7e6f9cf))
* 拆分router到taro-router ([a2afe27](https://github.com/NervJS/taro/commit/a2afe27))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/NervJS/taro/compare/v0.0.3...v0.0.4) (2018-04-08)


### Bug Fixes

* webpack-runner包名 ([47595bf](https://github.com/NervJS/taro/commit/47595bf))
* 页面配置配置到具体文件 ([ee93719](https://github.com/NervJS/taro/commit/ee93719))


### Features

* 模板依赖更新 ([4831e95](https://github.com/NervJS/taro/commit/4831e95))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/NervJS/taro/compare/v0.0.2...v0.0.3) (2018-04-08)


### Bug Fixes

* taro/rollup.config.js ([687f059](https://github.com/NervJS/taro/commit/687f059))


### Features

* 增加路由功能 ([909a219](https://github.com/NervJS/taro/commit/909a219))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/NervJS/taro/compare/v0.0.1...v0.0.2) (2018-04-08)



<a name="0.0.1"></a>
## 0.0.1 (2018-04-08)



