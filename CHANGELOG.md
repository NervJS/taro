<a name=""></a>
# [](https://github.com/NervJS/taro/compare/v2.1.5...v) (2020-04-16)



<a name="2.1.5"></a>
## [2.1.5](https://github.com/NervJS/taro/compare/v2.1.4...v2.1.5) (2020-04-16)


### Bug Fixes

* 恢复源码 ([0d90fe8](https://github.com/NervJS/taro/commit/0d90fe8))
* **docs:** 修复配置 webpackChain 的 example 小错误 ([#5787](https://github.com/NervJS/taro/issues/5787)) ([511a9ce](https://github.com/NervJS/taro/commit/511a9ce))
* **jd:** 修复京东小程序转 taro 报错 ([e3f6306](https://github.com/NervJS/taro/commit/e3f6306))
* **mini-runner:** 修复 build 后文件不引入公共样式的问题，close [#5965](https://github.com/NervJS/taro/issues/5965) ([cefe198](https://github.com/NervJS/taro/commit/cefe198))
* **mini-runner:** 修复对小程序直播组件的支持，close [#5936](https://github.com/NervJS/taro/issues/5936) ([eaa2fa9](https://github.com/NervJS/taro/commit/eaa2fa9))
* **router:** h5 tabbar pop router fix [#6000](https://github.com/NervJS/taro/issues/6000) ([30f1d98](https://github.com/NervJS/taro/commit/30f1d98))
* **router:** redirectTo not update $router [#5943](https://github.com/NervJS/taro/issues/5943) ([5d7b04b](https://github.com/NervJS/taro/commit/5d7b04b))
* **taro-router:** 修复页面拦截成功后，url参数丢失的问题 ([8b6eeba](https://github.com/NervJS/taro/commit/8b6eeba))



<a name="2.1.4"></a>
## [2.1.4](https://github.com/NervJS/taro/compare/v2.1.1...v2.1.4) (2020-04-13)


### Bug Fixes

* **h5:** Taro.downloadFile携带cookie ([#5941](https://github.com/NervJS/taro/issues/5941)) ([bf3ae7e](https://github.com/NervJS/taro/commit/bf3ae7e))
* for tabbar current-pages ([95c0562](https://github.com/NervJS/taro/commit/95c0562))
* **h5:** useRouter ([3deb16b](https://github.com/NervJS/taro/commit/3deb16b))
* **router:** 去除了router constructor内的setState ([5e99055](https://github.com/NervJS/taro/commit/5e99055))
* **router:** 避免setState后又forceUpdate ([f918ab9](https://github.com/NervJS/taro/commit/f918ab9))
* can not redirectTo a tabbar page remove ([65cac9c](https://github.com/NervJS/taro/commit/65cac9c))
* complete msg defect ([f877409](https://github.com/NervJS/taro/commit/f877409))
* init location for $router ([5e9caa1](https://github.com/NervJS/taro/commit/5e9caa1))
* previewImage点击返回键导致页面返回等问题 ([3058b9f](https://github.com/NervJS/taro/commit/3058b9f))
* previewImage点击返回键导致页面返回等问题 ([442e1a8](https://github.com/NervJS/taro/commit/442e1a8))
* router test error ([6add42f](https://github.com/NervJS/taro/commit/6add42f))
* **cli:** 使用 babelMerge 替换 mergeWith ([318d101](https://github.com/NervJS/taro/commit/318d101))
* **cli:** 回退 babel 合并操作 ([a7cc412](https://github.com/NervJS/taro/commit/a7cc412))
* **components:** images upload fix [#5921](https://github.com/NervJS/taro/issues/5921) ([9d2ce9f](https://github.com/NervJS/taro/commit/9d2ce9f))
* **docs:** rebuild ([c9c8188](https://github.com/NervJS/taro/commit/c9c8188))
* **docs:** router params ([910c753](https://github.com/NervJS/taro/commit/910c753))
* **h5:** 修复uploadFile上传的是个blob对象的问题 ([2cd230c](https://github.com/NervJS/taro/commit/2cd230c))
* **mini-runner:** 依赖读取顺序调整，close [#5914](https://github.com/NervJS/taro/issues/5914) ([8f2faae](https://github.com/NervJS/taro/commit/8f2faae))
* **mini-runner:** 修复全局变量解析与 H5 不一致的问题，close [#5917](https://github.com/NervJS/taro/issues/5917) ([fbb74fd](https://github.com/NervJS/taro/commit/fbb74fd))
* **mini-runner:** 支持百度小程序引入动态库，close [#5884](https://github.com/NervJS/taro/issues/5884) ([0899be7](https://github.com/NervJS/taro/commit/0899be7))
* **mini-runner:** 样式正则遗漏了京东小程序样式 ([e49ebe8](https://github.com/NervJS/taro/commit/e49ebe8))
* **rn-runner:**  无效的 npm script ([3d1226b](https://github.com/NervJS/taro/commit/3d1226b))
* **rn-runner:** ts error ([9ab3e26](https://github.com/NervJS/taro/commit/9ab3e26))
* **rn-runner:** 删除 components 的检测和编译 ([e0384a7](https://github.com/NervJS/taro/commit/e0384a7))
* **router:** h5 getCurrentPages method fix [#5323](https://github.com/NervJS/taro/issues/5323) ([e81e37d](https://github.com/NervJS/taro/commit/e81e37d))
* **taro-cli:** rn 端 ui 库编译 ([ae2f20f](https://github.com/NervJS/taro/commit/ae2f20f))
* docs deploy output log ([4381b4f](https://github.com/NervJS/taro/commit/4381b4f))
* docusaurus version ([a1c5266](https://github.com/NervJS/taro/commit/a1c5266))
* qq 样式文件后缀遗漏 ([31e5ade](https://github.com/NervJS/taro/commit/31e5ade))
* upload i18n ([726e08c](https://github.com/NervJS/taro/commit/726e08c))
* 样式命名 ([149e138](https://github.com/NervJS/taro/commit/149e138))
* 遗漏 TARO_ENV ([7bbc3d4](https://github.com/NervJS/taro/commit/7bbc3d4))


### Features

* 禁用navigateTo、redirectTo跳转tabbar「与小程序保持一致」 ([12f6e87](https://github.com/NervJS/taro/commit/12f6e87))
* **h5:** previewImage:fail msg ([efe2fb6](https://github.com/NervJS/taro/commit/efe2fb6))
* **rn-runner:** 利用 splitChunks 优化打包大小 ([c1f815d](https://github.com/NervJS/taro/commit/c1f815d))
* ts loader 解耦 trandformer-wx ([779d1c0](https://github.com/NervJS/taro/commit/779d1c0))
* **rn-runner:** 默认开启 CSS Module，且兼容 CSS Moduels 的写法 ([b805553](https://github.com/NervJS/taro/commit/b805553))


### Reverts

* **rn-runner:** 关闭 splitChunks ([ac40ad3](https://github.com/NervJS/taro/commit/ac40ad3))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/NervJS/taro/compare/v2.0.7...v2.1.1) (2020-04-07)


### Bug Fixes

* **mini-runner:** 传参错误 ([ade60e1](https://github.com/NervJS/taro/commit/ade60e1))
* **taro-router:** 修复函数式组件中leave hook的问题 ([#5888](https://github.com/NervJS/taro/issues/5888)) ([f7315a3](https://github.com/NervJS/taro/commit/f7315a3))
* Taro.uploadFile携带cookie ([#5896](https://github.com/NervJS/taro/issues/5896)) ([e191ec0](https://github.com/NervJS/taro/commit/e191ec0))
* **alipay:** processEvent 对 this.$component 加空值判断 ([8be3750](https://github.com/NervJS/taro/commit/8be3750))
* **cli:** 更新 taro doctor 检测项目配置，close [#5868](https://github.com/NervJS/taro/issues/5868) ([dcf4a6a](https://github.com/NervJS/taro/commit/dcf4a6a))
* **components:** for swiper fix [#3578](https://github.com/NervJS/taro/issues/3578) ([a4d2af1](https://github.com/NervJS/taro/commit/a4d2af1))
* **components:** rich-text 属性为可选 ([35e193b](https://github.com/NervJS/taro/commit/35e193b))
* **docs:** upload docusaurus ([2348b70](https://github.com/NervJS/taro/commit/2348b70))
* **mini-runner:** 修复 webpack `resolve.modules` 设置绝对路径导致的依赖引用错误 ([#5876](https://github.com/NervJS/taro/issues/5876)) ([a92e1ad](https://github.com/NervJS/taro/commit/a92e1ad))
* **mini-runner:** 修复多端组件出错问题，close [#5863](https://github.com/NervJS/taro/issues/5863) ([775eac8](https://github.com/NervJS/taro/commit/775eac8))
* **mini-runner:** 只有引用到公共样式的组件或页面里才会引入 common 公共样式 ([1eda618](https://github.com/NervJS/taro/commit/1eda618))
* **postcss-pxtransform:** 快应用不需要经过尺寸转换 ([4ebd187](https://github.com/NervJS/taro/commit/4ebd187))
* **rn-runner:** copy config/*.json to dist ([cf3dab6](https://github.com/NervJS/taro/commit/cf3dab6))
* **router:** for pop router ([604e670](https://github.com/NervJS/taro/commit/604e670))
* **taro-router:** 修复函数式组件中leave hook的问题 ([#5888](https://github.com/NervJS/taro/issues/5888)) ([7ea1b33](https://github.com/NervJS/taro/commit/7ea1b33))
* **type:** 修复 mapcontext 的返回类型 ([#5902](https://github.com/NervJS/taro/issues/5902)) ([2a53634](https://github.com/NervJS/taro/commit/2a53634))
* **types:** 修复 chooseMessageFile 返回类型错误 ([df60196](https://github.com/NervJS/taro/commit/df60196))
* [#5655](https://github.com/NervJS/taro/issues/5655) 2.x中无法在config中使用defineConstants定义的全局变量 ([c7bbcc8](https://github.com/NervJS/taro/commit/c7bbcc8))
* audio types onError ([b05e241](https://github.com/NervJS/taro/commit/b05e241))
* ci error ([d24e53f](https://github.com/NervJS/taro/commit/d24e53f))
* class关键字在华为ide报错 ([bcbe9de](https://github.com/NervJS/taro/commit/bcbe9de))
* code format ([320c411](https://github.com/NervJS/taro/commit/320c411))
* code format ([2551339](https://github.com/NervJS/taro/commit/2551339))
* component typing with scripts ([0120346](https://github.com/NervJS/taro/commit/0120346))
* float mult-slides for swiper fix [#4595](https://github.com/NervJS/taro/issues/4595) ([624480b](https://github.com/NervJS/taro/commit/624480b))
* ignore babel-eslint for d.ts ([31c34ac](https://github.com/NervJS/taro/commit/31c34ac))
* issue [#5682](https://github.com/NervJS/taro/issues/5682) ,修复ios 10.x系统中，由于不支持document.body.style = bodyInlineStyle写法导致js被中断的问题 ([f282170](https://github.com/NervJS/taro/commit/f282170))
* js空格格式修改与taro一致 ([badf6fa](https://github.com/NervJS/taro/commit/badf6fa))
* postcss-pxtransform enable quickapp ([5cb38b5](https://github.com/NervJS/taro/commit/5cb38b5))
* realIndex uncatch ([3bf56bd](https://github.com/NervJS/taro/commit/3bf56bd))
* redundant type fix [#5771](https://github.com/NervJS/taro/issues/5771) ([21ba48a](https://github.com/NervJS/taro/commit/21ba48a))
* scroll-view init scroll into view fix [#5025](https://github.com/NervJS/taro/issues/5025) ([690fcc8](https://github.com/NervJS/taro/commit/690fcc8))
* swiper autoplay stuck with taro_page ([e14ada6](https://github.com/NervJS/taro/commit/e14ada6))
* swiper callback init pattern fix [#4959](https://github.com/NervJS/taro/issues/4959) ([1bd58e1](https://github.com/NervJS/taro/commit/1bd58e1))
* swiper horizontal upload fix [#5704](https://github.com/NervJS/taro/issues/5704) ([6e7114f](https://github.com/NervJS/taro/commit/6e7114f))
* swiper incorrect setting ([b4bb27c](https://github.com/NervJS/taro/commit/b4bb27c))
* swiper loop suspend ([1599795](https://github.com/NervJS/taro/commit/1599795))
* swiper width resize correct unexpected stop ([5c4a46e](https://github.com/NervJS/taro/commit/5c4a46e))
* SwiperItem with restProps fix [#3230](https://github.com/NervJS/taro/issues/3230) ([5f955da](https://github.com/NervJS/taro/commit/5f955da))
* swipper auto play ([a40814d](https://github.com/NervJS/taro/commit/a40814d))
* test typing error ([44927b3](https://github.com/NervJS/taro/commit/44927b3))
* tt 样式文件后缀遗漏 ([#5866](https://github.com/NervJS/taro/issues/5866)) ([8f7f77a](https://github.com/NervJS/taro/commit/8f7f77a))
* 同步RN与微信的网络请求参数 ([1a9b7f0](https://github.com/NervJS/taro/commit/1a9b7f0))
* 样式文件中跨平台支持, 除微信外的小程序不符合文档要求 ([d70c825](https://github.com/NervJS/taro/commit/d70c825))
* **components:** 函数名错误 ([#5739](https://github.com/NervJS/taro/issues/5739)) ([6d00f13](https://github.com/NervJS/taro/commit/6d00f13))
* **mini-runner:** 支持导出微信插件入口文件 ([#5832](https://github.com/NervJS/taro/issues/5832)) ([1f6f625](https://github.com/NervJS/taro/commit/1f6f625))
* **quickapp:** 快应用支持 Block 标签，2.x版本遗漏 ([feddc80](https://github.com/NervJS/taro/commit/feddc80))
* **redux:** 快速dispatch redux actions情况下无法正确记录prevProps ([#5829](https://github.com/NervJS/taro/issues/5829)) ([e0166b5](https://github.com/NervJS/taro/commit/e0166b5))
* **typing:** picker type with docs fix [#5877](https://github.com/NervJS/taro/issues/5877) ([47dbf0a](https://github.com/NervJS/taro/commit/47dbf0a))
* **weapp\qq\tt\swan\jd:** processEvent 加空值判断 ([0adc23c](https://github.com/NervJS/taro/commit/0adc23c))
* this.container null in scroll-view ([200c1dc](https://github.com/NervJS/taro/commit/200c1dc))
* 修复bug ([6a6ad9f](https://github.com/NervJS/taro/commit/6a6ad9f))
* 修复初始页面参数问题 [#2055](https://github.com/NervJS/taro/issues/2055) ([32d08c2](https://github.com/NervJS/taro/commit/32d08c2))
* 初始化时data增加属性priTaroCompReady=false ([ba1c158](https://github.com/NervJS/taro/commit/ba1c158))
* 初始化链接调整 ([085369d](https://github.com/NervJS/taro/commit/085369d))
* 华为快应用事件冒泡到根节点会修改currentTarget, 导致报错 ([568712f](https://github.com/NervJS/taro/commit/568712f))
* 头条,qq,阿里小程序报错 p.setIsUsingDiff is not a function ([7d7161c](https://github.com/NervJS/taro/commit/7d7161c))
* **h5:** Audio onError 无法捕获错误 [#4378](https://github.com/NervJS/taro/issues/4378) ([#5763](https://github.com/NervJS/taro/issues/5763)) ([acf5720](https://github.com/NervJS/taro/commit/acf5720))
* **jd:** 修复京东小程序跳转参数、预加载 ([98c9c2a](https://github.com/NervJS/taro/commit/98c9c2a))
* **mini-runner:** `app.[env].tsx` 支持多端配置文件编译成 `app.json` ([#5714](https://github.com/NervJS/taro/issues/5714)) ([28ba210](https://github.com/NervJS/taro/commit/28ba210))
* **rn-runner:** const import error ([629d906](https://github.com/NervJS/taro/commit/629d906))


### Features

* **docs:** upload ([61cabce](https://github.com/NervJS/taro/commit/61cabce))
* upload docs-script for tabel parsed ([04647ba](https://github.com/NervJS/taro/commit/04647ba))
* **cli:** 增加 taro-ui 的版本检测和非项目目录提示 ([905c8a3](https://github.com/NervJS/taro/commit/905c8a3))
* **docs:** upload ([b43ed3f](https://github.com/NervJS/taro/commit/b43ed3f))
* **h5:** router for tabbar [#942](https://github.com/NervJS/taro/issues/942) ([92e32f9](https://github.com/NervJS/taro/commit/92e32f9))
* **rn:** build rn_bundle ([d88948f](https://github.com/NervJS/taro/commit/d88948f))
* **rn:** rn 端基于 webpack 编译重构 ([2b440b8](https://github.com/NervJS/taro/commit/2b440b8))
* **rn:** RN 端支持setKeepScreenOn & setScreenBrightness & getScreenBrightness ([a5348b4](https://github.com/NervJS/taro/commit/a5348b4))
* **rn:** 优化启动文案提示 ([8883d2d](https://github.com/NervJS/taro/commit/8883d2d))
* **taro:** 增加对 chooseMedia API 的支持 ([524c760](https://github.com/NervJS/taro/commit/524c760))
* add progress attribute for h5 fix [#4502](https://github.com/NervJS/taro/issues/4502) ([4cf4ec7](https://github.com/NervJS/taro/commit/4cf4ec7))
* checkbox-group for muti-dom onChange ([7f1e280](https://github.com/NervJS/taro/commit/7f1e280))
* default pxtransform for mini-program ([f568255](https://github.com/NervJS/taro/commit/f568255))
* swiper support 「pre/next」margin fix [#1392](https://github.com/NervJS/taro/issues/1392) ([9bd9e03](https://github.com/NervJS/taro/commit/9bd9e03))
* **transformer:** 添加环境变量支持ts编译配置emitDecoratorMetadata ([#5830](https://github.com/NervJS/taro/issues/5830)) ([2076b37](https://github.com/NervJS/taro/commit/2076b37)), closes [#3132](https://github.com/NervJS/taro/issues/3132)
* 增加RN中的Taro.addInterceptor ([730aaa6](https://github.com/NervJS/taro/commit/730aaa6))



<a name="2.0.7"></a>
## [2.0.7](https://github.com/NervJS/taro/compare/v2.0.6...v2.0.7) (2020-03-16)


### Bug Fixes

* **mini-runner:** 修复多端文件编译时 js 丢失的问题，close [#5687](https://github.com/NervJS/taro/issues/5687) ([e5236d8](https://github.com/NervJS/taro/commit/e5236d8))
* **mini-runner:** 解决使用 addChunkPages 时子包组件插入公共引用的问题 ([0cbce17](https://github.com/NervJS/taro/commit/0cbce17))
* **swan:** 修复百度小程序component shouldComponentUpdate不生效 ([9167bb8](https://github.com/NervJS/taro/commit/9167bb8))
* **tt:** 修复头条真机调试报错，fix [#5688](https://github.com/NervJS/taro/issues/5688) ([d2b4dde](https://github.com/NervJS/taro/commit/d2b4dde))
* **types:** 修复 CanvasContext 的部分属性类型。 ([#5647](https://github.com/NervJS/taro/issues/5647)) ([4af1ca1](https://github.com/NervJS/taro/commit/4af1ca1))
* **types:** 修复 getExtConfigSync 的部分属性类型。 ([#5695](https://github.com/NervJS/taro/issues/5695)) ([cef8b46](https://github.com/NervJS/taro/commit/cef8b46))



<a name="2.0.6"></a>
## [2.0.6](https://github.com/NervJS/taro/compare/v2.0.5...v2.0.6) (2020-03-09)


### Bug Fixes

* **taro component:** 1.3.9版本误删,导致无法衔接滚动 ([7425462](https://github.com/NervJS/taro/commit/7425462))
* get app for h5 fix [#4763](https://github.com/NervJS/taro/issues/4763) ([529f4dc](https://github.com/NervJS/taro/commit/529f4dc))
* rem in h5 component fix [#5309](https://github.com/NervJS/taro/issues/5309) ([458bb21](https://github.com/NervJS/taro/commit/458bb21))
* **components:** 修复canvas可能取不到props的问题 ([c5697cb](https://github.com/NervJS/taro/commit/c5697cb))
* **components:** 修复navigator、controls、video组件可能取不到props的问题 ([10762b0](https://github.com/NervJS/taro/commit/10762b0))
* **components:** 去除canvas、tabbar内一些比较hacky的写法 ([d7fb5a9](https://github.com/NervJS/taro/commit/d7fb5a9))
* **mini-runner:** 使用 addChunkPages 时，页面引入的组件也需要引用抽离的 chunks，close [#5580](https://github.com/NervJS/taro/issues/5580) ([fcaefce](https://github.com/NervJS/taro/commit/fcaefce))
* **mini-runner:** 修复 watch 时文件过多爆栈的问题 && 修改 app.js 时出错的问题，closes [#5630](https://github.com/NervJS/taro/issues/5630)，closes [#5433](https://github.com/NervJS/taro/issues/5433) ([7480ff7](https://github.com/NervJS/taro/commit/7480ff7))
* **mini-runner:** 修复图片等静态资源编译路径，close [#5605](https://github.com/NervJS/taro/issues/5605) ([edb84ba](https://github.com/NervJS/taro/commit/edb84ba))
* **mini-runner:** 缺少 addChunkPages 不存在判断 ([c2d4c3c](https://github.com/NervJS/taro/commit/c2d4c3c))
* **swan:** 修复百度小程序 ref ([e4ec6a2](https://github.com/NervJS/taro/commit/e4ec6a2))
* **taro-cli:** 修复基于taro第三方ui 组件循环依赖时打包失败， close [#5620](https://github.com/NervJS/taro/issues/5620) ([#5623](https://github.com/NervJS/taro/issues/5623)) ([77e11cd](https://github.com/NervJS/taro/commit/77e11cd))
* **taro-components:** 修复 scroll-view 内不太严谨的写法 ([11b0026](https://github.com/NervJS/taro/commit/11b0026))
* **taro-components-rn:** 修复Input组件 ([54b2a78](https://github.com/NervJS/taro/commit/54b2a78))
* fix unexpected comma ([3c1f507](https://github.com/NervJS/taro/commit/3c1f507))
* **taro-components:** 修复定时器在组件更新时未取消问题 ([291feae](https://github.com/NervJS/taro/commit/291feae))
* **taro-h5:** 修复chooseVideo生成的blob对象缺少类型的问题 ([f8d1929](https://github.com/NervJS/taro/commit/f8d1929))
* **types:** LivePlayerProps ([#5559](https://github.com/NervJS/taro/issues/5559)) ([58a9a2d](https://github.com/NervJS/taro/commit/58a9a2d))
* ignore spec-files under sourceRoot fix [#3307](https://github.com/NervJS/taro/issues/3307) ([a5e8a1b](https://github.com/NervJS/taro/commit/a5e8a1b))


### Features

* **taro-h5:** add capture attribute support for chooseImage api when… ([#5608](https://github.com/NervJS/taro/issues/5608)) ([2da3c2b](https://github.com/NervJS/taro/commit/2da3c2b))
* complete navig、form、media typing with docs ([eab3a52](https://github.com/NervJS/taro/commit/eab3a52))
* complete Open typing with docs ([0acb787](https://github.com/NervJS/taro/commit/0acb787))
* upload all components types with docs ([1af2607](https://github.com/NervJS/taro/commit/1af2607))



<a name="2.0.5"></a>
## [2.0.5](https://github.com/NervJS/taro/compare/v2.0.4...v2.0.5) (2020-02-27)


### Bug Fixes

* **cli:** 旧项目升级未自动更新RN版本 ([cd224a4](https://github.com/NervJS/taro/commit/cd224a4))
* **cli:** 模板引用错误导致模板生成失败，进而必然导致转换失败 ([#5554](https://github.com/NervJS/taro/issues/5554)) ([9404423](https://github.com/NervJS/taro/commit/9404423))
* **components:** 修复：当Checkbox想要条件渲染时，并且Checkbox占位符为null时引发的异常 ([#5507](https://github.com/NervJS/taro/issues/5507)) ([049d0ae](https://github.com/NervJS/taro/commit/049d0ae))
* **mini-runner:** 与原生小程序混写时支持解析样式 ([8de0f55](https://github.com/NervJS/taro/commit/8de0f55))
* **mini-runner:** 与原生小程序混写时支持解析模板 ([2494fff](https://github.com/NervJS/taro/commit/2494fff))
* **mini-runner:** 修复快应用引入自定义组件时路径问题，close [#5555](https://github.com/NervJS/taro/issues/5555) ([894ca13](https://github.com/NervJS/taro/commit/894ca13))
* **mini-runner:** 尝试修复监听报错的问题 ([b64192b](https://github.com/NervJS/taro/commit/b64192b))
* **taro:** append QQ,JD ENV_TYPEs for ts type definition ([#5515](https://github.com/NervJS/taro/issues/5515)) ([c376cfd](https://github.com/NervJS/taro/commit/c376cfd))


### Features

* **mini-runner:** 增加 addChunkPages 配置，允许为分包单独配置自己公共文件，close [#5511](https://github.com/NervJS/taro/issues/5511) ([06f23b5](https://github.com/NervJS/taro/commit/06f23b5))
* **taro-router:** 新增路由拦截功能beforeRouteLeave ([b492d3d](https://github.com/NervJS/taro/commit/b492d3d))



<a name="2.0.4"></a>
## [2.0.4](https://github.com/NervJS/taro/compare/v2.0.3...v2.0.4) (2020-02-18)


### Bug Fixes

* docusaurus wrong parse ([04c914f](https://github.com/NervJS/taro/commit/04c914f))
* **cli:** 完善 taro dotor 对 config 的检测 ([67140d9](https://github.com/NervJS/taro/commit/67140d9))
* **mini-runner:** webpackChain 暴露 PARSE_AST_TYPE 参数 ([8f6617f](https://github.com/NervJS/taro/commit/8f6617f))
* **mini-runner:** 修复 watch 时修改 js 文件报错后不再编译的问题，close [#5486](https://github.com/NervJS/taro/issues/5486) ([fe5a46a](https://github.com/NervJS/taro/commit/fe5a46a))
* **mini-runner:** 修复压缩报错 ([259254b](https://github.com/NervJS/taro/commit/259254b))
* **mini-runner:** 修复对 lodash 的支持 ([16a3532](https://github.com/NervJS/taro/commit/16a3532))
* **mini-runner:** 增加抽离业务公共代码 common ([986eb76](https://github.com/NervJS/taro/commit/986eb76))
* **taro-mini-runner:** 修复引入lodash.xxx时候报错的问题 ([#5457](https://github.com/NervJS/taro/issues/5457)) ([99e9a9a](https://github.com/NervJS/taro/commit/99e9a9a))
* **transformer-wx:** 修复 npm 中组件编译时 componentPath 不正确的问题 ([a5d519e](https://github.com/NervJS/taro/commit/a5d519e))


### Features

* input typing with docs upload ([d2f4aea](https://github.com/NervJS/taro/commit/d2f4aea))
* **mini-runner:** mini.commonChunks 配置支持通过函数形式进行配置 ([66222ad](https://github.com/NervJS/taro/commit/66222ad))
* **mini-runner:** 优化公共文件抽离 ([e4132e0](https://github.com/NervJS/taro/commit/e4132e0))
* **network:** upload typing ([3a52b22](https://github.com/NervJS/taro/commit/3a52b22))
* **types:** upload components typing with docs ([b7f9fdf](https://github.com/NervJS/taro/commit/b7f9fdf))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/NervJS/taro/compare/v2.0.2...v2.0.3) (2020-02-09)


### Bug Fixes

* **alipay:** 去掉hasPageInited判断，fix [#5424](https://github.com/NervJS/taro/issues/5424) ([a35380f](https://github.com/NervJS/taro/commit/a35380f))
* **cli:** 修复云开发模板创建时 package.json 文件生成不正确的问题 ([dca1890](https://github.com/NervJS/taro/commit/dca1890))
* **components:** code optimization ([cd69014](https://github.com/NervJS/taro/commit/cd69014))
* **components:** radio click method lack error ([03269ac](https://github.com/NervJS/taro/commit/03269ac))
* **components:** ScrollView event fix [#3484](https://github.com/NervJS/taro/issues/3484) ([0024f47](https://github.com/NervJS/taro/commit/0024f47))
* **components:** 修复跳转时视频继续播放的问题, fix [#5412](https://github.com/NervJS/taro/issues/5412) ([e8937aa](https://github.com/NervJS/taro/commit/e8937aa))
* **components:** 暂时去除了h5中input的focus能力, fix [#5393](https://github.com/NervJS/taro/issues/5393) [#4991](https://github.com/NervJS/taro/issues/4991) ([c2f8402](https://github.com/NervJS/taro/commit/c2f8402))
* **mini-runner:** 优化 npm 文件加载顺序 ([b22c0fa](https://github.com/NervJS/taro/commit/b22c0fa))
* **mini-runner:** 修复编译成插件时，miniprogram 中生成多余文件的问题，[#5411](https://github.com/NervJS/taro/issues/5411) ([04c5616](https://github.com/NervJS/taro/commit/04c5616))
* **mini-runner:** 加入 node_modules 代码 hack，解决某些包不能直接在小程序中使用的问题，close [#5421](https://github.com/NervJS/taro/issues/5421) ([c3703d3](https://github.com/NervJS/taro/commit/c3703d3))
* **n:** pages 编译生成相对路径错误 ([42c5688](https://github.com/NervJS/taro/commit/42c5688))
* **rn:** react-redux 升级导致的 ref 错误 ([4bcdc8a](https://github.com/NervJS/taro/commit/4bcdc8a))
* **taro-components-qa:** 修复快应用scrollview组件事件无法触发问题 ([#5414](https://github.com/NervJS/taro/issues/5414)) ([215b703](https://github.com/NervJS/taro/commit/215b703))
* **taro-weapp:** 补上 uploadTask.headersReveived task ([ce7289a](https://github.com/NervJS/taro/commit/ce7289a))
* add offAccelerometerChange api close [#5394](https://github.com/NervJS/taro/issues/5394) ([f0c1e39](https://github.com/NervJS/taro/commit/f0c1e39))
* docs redirect ([7a6002b](https://github.com/NervJS/taro/commit/7a6002b))
* radio with radio-group onCange prop fix [#4750](https://github.com/NervJS/taro/issues/4750) ([efd3ff8](https://github.com/NervJS/taro/commit/efd3ff8))
* react native路由多端入口文件读取不到 close [#5169](https://github.com/NervJS/taro/issues/5169) ([6dbc48b](https://github.com/NervJS/taro/commit/6dbc48b))
* scrollview 在火狐浏览器滚动中报错，导致onScroll不执行 fix [#5254](https://github.com/NervJS/taro/issues/5254) ([138ce5d](https://github.com/NervJS/taro/commit/138ce5d))
* 补全组件文档脚本生成 fix [#4908](https://github.com/NervJS/taro/issues/4908) ([b2d40da](https://github.com/NervJS/taro/commit/b2d40da))
* **rn:** -port 参数对于RN调试失效 close [#5413](https://github.com/NervJS/taro/issues/5413) ([cb53302](https://github.com/NervJS/taro/commit/cb53302))
* **transformer:** 函数式组件不支持函数表达式，close [#5415](https://github.com/NervJS/taro/issues/5415) ([1f403bd](https://github.com/NervJS/taro/commit/1f403bd))
* **weapp:** 添加微信小程序 loadFontFace 参数定义 ([#5429](https://github.com/NervJS/taro/issues/5429)) ([f0284f9](https://github.com/NervJS/taro/commit/f0284f9))
* uploadFile 增加 timeout 选项 close [#5406](https://github.com/NervJS/taro/issues/5406) ([cde6912](https://github.com/NervJS/taro/commit/cde6912))
* **types:** add refresher to ScrollViewProps close [#5400](https://github.com/NervJS/taro/issues/5400) ([#5399](https://github.com/NervJS/taro/issues/5399))  ([9a975f1](https://github.com/NervJS/taro/commit/9a975f1))


### Features

* **component:** upload components types ([7bf12de](https://github.com/NervJS/taro/commit/7bf12de))
* **components:** 修复按钮 hoverClass 属性 fix [#4088](https://github.com/NervJS/taro/issues/4088) ([3218656](https://github.com/NervJS/taro/commit/3218656))
* **docs:** 文档更新 ([c57212f](https://github.com/NervJS/taro/commit/c57212f))
* **docs:** 暂时屏蔽没有添加的API文档 ([6df2e5c](https://github.com/NervJS/taro/commit/6df2e5c))
* **docs:** 添加文档脚本识别参数=>京东小程序 ([bfe75ee](https://github.com/NervJS/taro/commit/bfe75ee))
* **taro-weapp:** 增加 uploadTask.headersReveived，fix [#5407](https://github.com/NervJS/taro/issues/5407) ([d4cc378](https://github.com/NervJS/taro/commit/d4cc378))
* add types docs absence ([22fd987](https://github.com/NervJS/taro/commit/22fd987))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/NervJS/taro/compare/v2.0.1...v2.0.2) (2020-01-21)


### Bug Fixes

* **cli:** 修复 Node 13 创建项目时的问题, close [#5285](https://github.com/NervJS/taro/issues/5285) ([efc394c](https://github.com/NervJS/taro/commit/efc394c))
* **h5:** 修复Video组件设置了poster后controlers失效的问题 ([03a3229](https://github.com/NervJS/taro/commit/03a3229))
* **mini-runner:** 修复小程序 watch 时支持压缩的问题 close [#5322](https://github.com/NervJS/taro/issues/5322) ([#5355](https://github.com/NervJS/taro/issues/5355)) ([11375dc](https://github.com/NervJS/taro/commit/11375dc))
* **rn:** react native react-redux 版本太低 close [#5335](https://github.com/NervJS/taro/issues/5335) ([e92c019](https://github.com/NervJS/taro/commit/e92c019))
* 修复编译微信小程序插件时 miniprogramRoot 被更改的问题 close [#5338](https://github.com/NervJS/taro/issues/5338) ([21a0b73](https://github.com/NervJS/taro/commit/21a0b73))


### Features

* **swan:** 百度也加上绕开 diff 的后门 ([efaefd4](https://github.com/NervJS/taro/commit/efaefd4)), closes [#5277](https://github.com/NervJS/taro/issues/5277)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/NervJS/taro/compare/v2.0.0...v2.0.1) (2020-01-14)


### Bug Fixes

* **mini-runner:** 修复使用 cnpm 等安装器安装依赖时引用 taro-ui 报错的问题，[#5278](https://github.com/NervJS/taro/issues/5278) ([9480496](https://github.com/NervJS/taro/commit/9480496))
* **mini-runner:** 修复页面文件 watch 时修改的问题，close [#5293](https://github.com/NervJS/taro/issues/5293) ([309f066](https://github.com/NervJS/taro/commit/309f066))
* **mini-runner:** 添加 mini.compile 配置 ([949fd37](https://github.com/NervJS/taro/commit/949fd37))
* **weapp/qq:** 微信、qq小程序 request 并发数改为 10，fix [#5291](https://github.com/NervJS/taro/issues/5291) ([474c7aa](https://github.com/NervJS/taro/commit/474c7aa))


### Reverts

* 去除版本运行提示 ([3b50289](https://github.com/NervJS/taro/commit/3b50289))
* 恢复运行时的版本提示 ([b006895](https://github.com/NervJS/taro/commit/b006895))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/NervJS/taro/compare/v2.0.0-beta.14...v2.0.0) (2020-01-08)


### Bug Fixes

* **alipay:** 支付宝小程序分包下 compid 应该挂全局 ([30fd22c](https://github.com/NervJS/taro/commit/30fd22c))
* **mini:** 修复 requset API 不触发 success 和 fail 的问题，close [#5271](https://github.com/NervJS/taro/issues/5271) ([258cd78](https://github.com/NervJS/taro/commit/258cd78))
* **weapp:** 修复 Taro.cloud 部分函数返回错误的类型定义 ([#5270](https://github.com/NervJS/taro/issues/5270)) ([de04d79](https://github.com/NervJS/taro/commit/de04d79))
* **weapp:** 导出 wx.env 对象，增加 Taro.env.USER_DATA_PATH 类型定义 close [#3710](https://github.com/NervJS/taro/issues/3710) ([a9c0c09](https://github.com/NervJS/taro/commit/a9c0c09))
* **weapp:** 添加微信小程序 webp 属性和修复函数式组件缺少的 externalClasses 类型 ([#5273](https://github.com/NervJS/taro/issues/5273)) ([2dd00dc](https://github.com/NervJS/taro/commit/2dd00dc))



<a name="2.0.0-beta.14"></a>
# [2.0.0-beta.14](https://github.com/NervJS/taro/compare/v1.3.34...v2.0.0-beta.14) (2020-01-08)


### Bug Fixes

* **cli:** 2.0.0-beta.8. 编译RN报错 'babel' of undefined close [#5093](https://github.com/NervJS/taro/issues/5093) ([89a5ab7](https://github.com/NervJS/taro/commit/89a5ab7))
* **cli:** 修正快应用依赖项安装命令在windows不兼容问题 ([#4954](https://github.com/NervJS/taro/issues/4954)) ([df097ef](https://github.com/NervJS/taro/commit/df097ef))
* **cli:** 切换默认模板请求源 ([84f75b8](https://github.com/NervJS/taro/commit/84f75b8))
* **cli:** 增加运行提示 ([34a75a8](https://github.com/NervJS/taro/commit/34a75a8))
* **cli:** 插件编译失败，close [#5149](https://github.com/NervJS/taro/issues/5149) ([fb60772](https://github.com/NervJS/taro/commit/fb60772))
* **cli:** 更新默认模板 ([cb50115](https://github.com/NervJS/taro/commit/cb50115))
* **cli:** 解决 cli 编译时缺少 [@types](https://github.com/types)/react 依赖问题 ([#4997](https://github.com/NervJS/taro/issues/4997)) ([7ea6a44](https://github.com/NervJS/taro/commit/7ea6a44))
* **components-qa:** 改进 button 动画效果展示，引入 css 属性描述文件 ([#4898](https://github.com/NervJS/taro/issues/4898)) ([f868bf5](https://github.com/NervJS/taro/commit/f868bf5))
* **mini-runner:** 优化 watch 时文件编译速度 ([376138b](https://github.com/NervJS/taro/commit/376138b))
* **mini-runner:** 修复 defineConstants 小程序表现与 H5 不一致问题 close [#5078](https://github.com/NervJS/taro/issues/5078) ([6cd3fbe](https://github.com/NervJS/taro/commit/6cd3fbe))
* **mini-runner:** 修复 sass 变量失效的问题，close [#4893](https://github.com/NervJS/taro/issues/4893) ([60e522a](https://github.com/NervJS/taro/commit/60e522a))
* **mini-runner:** 修复 watch 时修改报错的问题 ([605e68a](https://github.com/NervJS/taro/commit/605e68a))
* **mini-runner:** 修复 watch 时修改页面导致组件无法及时更新的问题 ([a2332f8](https://github.com/NervJS/taro/commit/a2332f8))
* **mini-runner:** 修复 watch 时增加组件文件的 bug，close [#5140](https://github.com/NervJS/taro/issues/5140) ([c889d55](https://github.com/NervJS/taro/commit/c889d55))
* **mini-runner:** 修复 watch 时文件报错导致无法重新编译的问题，fix [#4949](https://github.com/NervJS/taro/issues/4949) ([57f049d](https://github.com/NervJS/taro/commit/57f049d))
* **mini-runner:** 修复 windows 下编译后 taro 引用错误的问题 ([ef7431d](https://github.com/NervJS/taro/commit/ef7431d))
* **mini-runner:** 修复 yarn workspace 模式下引入 npm 中组件出错的问题 ([a5114c4](https://github.com/NervJS/taro/commit/a5114c4))
* **mini-runner:** 修复使用 preval 报错的问题 ([1c68f6c](https://github.com/NervJS/taro/commit/1c68f6c))
* **mini-runner:** 修复分包页面丢失的问题 ([fbdbb70](https://github.com/NervJS/taro/commit/fbdbb70))
* **mini-runner:** 修复包未安装不报错的问题 ([5552fa2](https://github.com/NervJS/taro/commit/5552fa2))
* **mini-runner:** 修复多端文件引用的问题，close [#5175](https://github.com/NervJS/taro/issues/5175) ([0c243ac](https://github.com/NervJS/taro/commit/0c243ac))
* **mini-runner:** 修复对 alias 的支持 ([3786d6b](https://github.com/NervJS/taro/commit/3786d6b))
* **mini-runner:** 修复小程序编译时样式中引用静态资源转换为 base64 ([c871702](https://github.com/NervJS/taro/commit/c871702))
* **mini-runner:** 修复引用原生组件报错的问题 ([0632783](https://github.com/NervJS/taro/commit/0632783))
* **mini-runner:** 修复引用原生组件编译后样式文件缺失的问题 ([cd0f55a](https://github.com/NervJS/taro/commit/cd0f55a))
* **mini-runner:** 修复生产打包时公共样式无法插入的问题 ([63d22d2](https://github.com/NervJS/taro/commit/63d22d2))
* **mini-runner:** 修复组件 watch 时改动不生效的问题 ([51a0cf1](https://github.com/NervJS/taro/commit/51a0cf1))
* **mini-runner:** 修复静态资源引用的 bug ([07e8c66](https://github.com/NervJS/taro/commit/07e8c66))
* **mini-runner:** 修复页面 hooks config 失效问题 ([545f327](https://github.com/NervJS/taro/commit/545f327))
* **mini-runner:** 修正快应用pages中ux文件未正确生成问题 ([#4969](https://github.com/NervJS/taro/issues/4969)) ([e1e1c79](https://github.com/NervJS/taro/commit/e1e1c79))
* **mini-runner:** 加入 preval 支持 ([5b771ff](https://github.com/NervJS/taro/commit/5b771ff))
* **mini-runner:** 增加快应用公共属性的自动更新，优化button动画直接调用 ([#5044](https://github.com/NervJS/taro/issues/5044)) ([ab3279a](https://github.com/NervJS/taro/commit/ab3279a))
* **mini-runner:** 快应用页面路径编译错误 ([024615a](https://github.com/NervJS/taro/commit/024615a))
* **mini-runner:** 支持自定义 tabBar ([44e218f](https://github.com/NervJS/taro/commit/44e218f))
* **mini-runner:** 暴露 commonChunks 配置以供自定义公共 chunks 生成 ([8f6bdee](https://github.com/NervJS/taro/commit/8f6bdee))
* **mini-runner:** 更新编译时提示 ([3bc039a](https://github.com/NervJS/taro/commit/3bc039a))
* **mini-runner:** 移除无用代码 ([6b22c21](https://github.com/NervJS/taro/commit/6b22c21))
* **mini-runner:** 组件中 $componentPath 路径生成不对 ([978cef0](https://github.com/NervJS/taro/commit/978cef0))
* **mini-runner:** 组件引入支持统一从一个入口文件中引入 ([1dd5443](https://github.com/NervJS/taro/commit/1dd5443))
* **mini-runner:** 组件引用支持 import as 语法 ([0f0d834](https://github.com/NervJS/taro/commit/0f0d834))
* **mini-runner:** 编译时移除组件文件引用，遗漏了 npm 包中组件，close [#5139](https://github.com/NervJS/taro/issues/5139) ([ea7023b](https://github.com/NervJS/taro/commit/ea7023b))
* **mini-runner:** 编译时需要移除对组件文件的引用 ([acdf816](https://github.com/NervJS/taro/commit/acdf816))
* **mini-runner:** 降低 babel-plugin-preval 版本以保证使用 async await 时不报错 ([a423810](https://github.com/NervJS/taro/commit/a423810))
* **taro:** update getStorage return typings ([#5170](https://github.com/NervJS/taro/issues/5170)) ([05438db](https://github.com/NervJS/taro/commit/05438db))
* **taro:** 增加递归查找中止条件，修正拼写错误 ([#5045](https://github.com/NervJS/taro/issues/5045)) ([a097a37](https://github.com/NervJS/taro/commit/a097a37))
* **taro-alipay:** 兼容支付宝和微信 request 回调函数 ([d59d792](https://github.com/NervJS/taro/commit/d59d792))
* **taro-cli:** update package list 新增 [@tarojs](https://github.com/tarojs)/mini-runner，对列表排序 ([d4c6801](https://github.com/NervJS/taro/commit/d4c6801))
* **taro-runner-utils:** 优化代码，修复找不到类型定义的问题 ([7c46d85](https://github.com/NervJS/taro/commit/7c46d85))
* **types:** add enableFlex to ScrollViewProps ([#5142](https://github.com/NervJS/taro/issues/5142)) ([e2c262c](https://github.com/NervJS/taro/commit/e2c262c))
* for video objectFit ([500654e](https://github.com/NervJS/taro/commit/500654e))
* use rimraf instead of rm to fixed Windows build error ([5afba17](https://github.com/NervJS/taro/commit/5afba17))
* **taro-webpack-runner:** 修复 sassLoaderOption 未定义的问题 ([32979c1](https://github.com/NervJS/taro/commit/32979c1))
* **template:** 更新 Taro 2.0 的模版和下载地址 [#4837](https://github.com/NervJS/taro/issues/4837) ([69151e3](https://github.com/NervJS/taro/commit/69151e3))
* somethings no need ([2f81593](https://github.com/NervJS/taro/commit/2f81593))
* **alipay:** 支付宝分包时 Current 应该挂 my 上，fix [#5204](https://github.com/NervJS/taro/issues/5204) ([4106d5c](https://github.com/NervJS/taro/commit/4106d5c))
* **cli:** lerna 加入 taro-mini-runner && 接入 webpack 生成小程序文件 ([8c80418](https://github.com/NervJS/taro/commit/8c80418))
* **cli:** windows下配置 weapp.compile.exclude 为 npm 包时路径问题 ([#5227](https://github.com/NervJS/taro/issues/5227)) ([a946f86](https://github.com/NervJS/taro/commit/a946f86))
* **cli:** 修复 doctor 对 config 的检测 ([7b097b7](https://github.com/NervJS/taro/commit/7b097b7))
* **cli:** 修复 watch 时文件修改不对的问题 ([1620d9d](https://github.com/NervJS/taro/commit/1620d9d))
* **cli:** 修复代码合并的问题 ([8125a37](https://github.com/NervJS/taro/commit/8125a37))
* **cli:** 修复目录创建 ([10eef8c](https://github.com/NervJS/taro/commit/10eef8c))
* **cli:** 修复配置文件中读取不到 process.env.TARO_ENV 的问题 ([e245932](https://github.com/NervJS/taro/commit/e245932))
* **cli:** 支持引用 node_modules 中组件 ([2ecfc68](https://github.com/NervJS/taro/commit/2ecfc68))
* **cli:** 普通文件经过编译器编译必须传入 isNormal ([687cd65](https://github.com/NervJS/taro/commit/687cd65))
* **cli:** 更新默认模板 ([bb025b8](https://github.com/NervJS/taro/commit/bb025b8))
* **cli:** 清理代码 ([bd31812](https://github.com/NervJS/taro/commit/bd31812))
* **cli:** 编译器参数调整 ([9d239d7](https://github.com/NervJS/taro/commit/9d239d7))
* **components:** h5 image 删除无关代码 ([#4998](https://github.com/NervJS/taro/issues/4998)) ([d45da9c](https://github.com/NervJS/taro/commit/d45da9c))
* **components:** 修复 Image 组件在 react 环境下报错的问题 ([e7ad2b8](https://github.com/NervJS/taro/commit/e7ad2b8))
* **components-qa:** 修复页面 onReachBottom 事件不触发的问题 ([7209a7a](https://github.com/NervJS/taro/commit/7209a7a))
* **jd:** 修复合并代码导致的京东小程序的编译问题 ([890ae14](https://github.com/NervJS/taro/commit/890ae14))
* **mini-runner:** npm 中文件不会经过 taro 包替换操作 ([95af513](https://github.com/NervJS/taro/commit/95af513))
* **mini-runner:** 优化 webpack 编译时样式处理 ([6b8e540](https://github.com/NervJS/taro/commit/6b8e540))
* **mini-runner:** 修复 builder 的 hooks 调用 ([1585b5b](https://github.com/NervJS/taro/commit/1585b5b))
* **mini-runner:** 修复 tabbar 编译及组件 watch 的问题 ([4f7e02b](https://github.com/NervJS/taro/commit/4f7e02b))
* **mini-runner:** 修复 watch bug ([c4ec619](https://github.com/NervJS/taro/commit/c4ec619))
* **mini-runner:** 修复对 css modules 的支持 ([993ef03](https://github.com/NervJS/taro/commit/993ef03))
* **mini-runner:** 修复小程序编译报错 ([56dd736](https://github.com/NervJS/taro/commit/56dd736))
* **mini-runner:** 修复引用 npm 中组件间存在依赖时依赖路径解析错误的问题 ([c4df170](https://github.com/NervJS/taro/commit/c4df170))
* **mini-runner:** 修复快应用打包报错的问题 ([ae35458](https://github.com/NervJS/taro/commit/ae35458))
* **quickapp:** pull-down-refresh page-scroll ([63779bd](https://github.com/NervJS/taro/commit/63779bd))
* position linter for quickapp 1060+ ([37fd917](https://github.com/NervJS/taro/commit/37fd917))
* quickapp api upload from docs ([f7e9666](https://github.com/NervJS/taro/commit/f7e9666))
* **mini-runner:** 修复快应用编译后页面标题展示不正确的问题 ([e845092](https://github.com/NervJS/taro/commit/e845092))
* **mini-runner:** 修复普通小程序编译的问题 ([df34585](https://github.com/NervJS/taro/commit/df34585))
* **mini-runner:** 加上文件编译提示 ([1203737](https://github.com/NervJS/taro/commit/1203737))
* **mini-runner:** 只有 taro 的包不能经过依赖包名替换 ([477e831](https://github.com/NervJS/taro/commit/477e831))
* **mini-runner:** 打包优化，引用自 npm 包中的组件不抽离至 vendors 中 ([4ecdb24](https://github.com/NervJS/taro/commit/4ecdb24))
* **mini-runner:** 提前解析快应用页面 ([7d5caa2](https://github.com/NervJS/taro/commit/7d5caa2))
* **mini-runner:** 支持快应用编译后模板与样式的检测 ([7727c85](https://github.com/NervJS/taro/commit/7727c85))
* **taro:** 修复快应用下拉刷新问题 ([a3c0fed](https://github.com/NervJS/taro/commit/a3c0fed))
* **taro:** 小程序 webpack 编译静态文件路径 ([2adeaaf](https://github.com/NervJS/taro/commit/2adeaaf))
* **taro-quickapp:** 修复快应用事件绑定异常问题 ([cccf7ee](https://github.com/NervJS/taro/commit/cccf7ee))
* pxtransform disable on quick-app ([c50e0ff](https://github.com/NervJS/taro/commit/c50e0ff))
* **transformer:** 修复测试用例 ([5b2f988](https://github.com/NervJS/taro/commit/5b2f988))
* **transformer:** 修复错误类型 ([85ed48f](https://github.com/NervJS/taro/commit/85ed48f))
* **transformer:** 支持直接 import  default ([080e3f6](https://github.com/NervJS/taro/commit/080e3f6))
* **types:** 补充 chooseImage 在 H5 下的类型 ([c2a02ed](https://github.com/NervJS/taro/commit/c2a02ed))
* **weapp:** allow Taro.getUserInfo to take no param ([#5248](https://github.com/NervJS/taro/issues/5248)) ([60e5691](https://github.com/NervJS/taro/commit/60e5691))
* **weapp:** incorrect Taro.canvasToTempFilePath typing ([#5250](https://github.com/NervJS/taro/issues/5250)) ([317604c](https://github.com/NervJS/taro/commit/317604c))
* **weapp:** 修复小程序 request 并发没有限制的问题，close [#5213](https://github.com/NervJS/taro/issues/5213) ([a4e8a38](https://github.com/NervJS/taro/commit/a4e8a38))
* **weapp/qq/tt/alipay:** 预加载不支持 switchTab，close [#5185](https://github.com/NervJS/taro/issues/5185) ([1ce8c48](https://github.com/NervJS/taro/commit/1ce8c48))
* **webpack:** 修复文件压缩的问题 ([a1ab5eb](https://github.com/NervJS/taro/commit/a1ab5eb))
* 修复h5独有属性类型 ([2d3a3a0](https://github.com/NervJS/taro/commit/2d3a3a0))


### Features

* **rn:** taro React Native 依赖由 0.55.4 升级到 0.59.9 ([bf98078](https://github.com/NervJS/taro/commit/bf98078))
* **taro-runner-utils:** 添加单元测试和优化注释 ([0f65793](https://github.com/NervJS/taro/commit/0f65793))
* webpack-runner 和 mini-runner 代码优化 ([991588d](https://github.com/NervJS/taro/commit/991588d))
* **cli:** cli 支持事件 && 小程序编译配置向 H5 看齐 ([4d74ae4](https://github.com/NervJS/taro/commit/4d74ae4))
* **cli:** 借助 tapable 改造 ([9e4dd18](https://github.com/NervJS/taro/commit/9e4dd18))
* **cli:** 增加 tapable 包 ([aed9a00](https://github.com/NervJS/taro/commit/aed9a00))
* **cli:** 将 app/页面/组件 添加到入口文件进行编译 ([bc78f1d](https://github.com/NervJS/taro/commit/bc78f1d))
* **cli:** 尝试接入 webpack 来编译各端小程序 ([f273db6](https://github.com/NervJS/taro/commit/f273db6))
* **cli:** 拆分逻辑到 loader ([8d9e080](https://github.com/NervJS/taro/commit/8d9e080))
* **cli:** 调整文件编译 ([f192fc2](https://github.com/NervJS/taro/commit/f192fc2))
* **components-qa:** 增强快应用button组件，增加属性判断及点击变色等 ([#4882](https://github.com/NervJS/taro/issues/4882)) ([06b7cdf](https://github.com/NervJS/taro/commit/06b7cdf))
* **docs:** 更新 2.0 版本使用 async-await 的文档 [#4837](https://github.com/NervJS/taro/issues/4837) ([116805e](https://github.com/NervJS/taro/commit/116805e))
* **h5:** chooseImage回调中加入了originalFileObj属性 ([fe346ef](https://github.com/NervJS/taro/commit/fe346ef))
* **mini-runner:** 优化 watch ([4c60cd6](https://github.com/NervJS/taro/commit/4c60cd6))
* **mini-runner:** 保证快应用文件生成正确 ([0b2e882](https://github.com/NervJS/taro/commit/0b2e882))
* **mini-runner:** 加入 watch ([39ef6a9](https://github.com/NervJS/taro/commit/39ef6a9))
* **mini-runner:** 增加 Taro 模块专有处理插件 ([5be50b0](https://github.com/NervJS/taro/commit/5be50b0))
* **mini-runner:** 支持与原生小程序代码混写 ([f949253](https://github.com/NervJS/taro/commit/f949253))
* **mini-runner:** 支持分包 ([6240933](https://github.com/NervJS/taro/commit/6240933))
* **taro:** cli 配合 mini-runner 重构 && 支持使用 mini-runner 编译插件 ([3d3f620](https://github.com/NervJS/taro/commit/3d3f620))
* **taro-cli:** 配置文件分开存放，优化 taro config 输出 ([a641649](https://github.com/NervJS/taro/commit/a641649))
* **taro-runner-utils:** 添加 [@tarojs](https://github.com/tarojs)/runner-utils 包 ([12e1a24](https://github.com/NervJS/taro/commit/12e1a24))
* audio context ([f1f27c3](https://github.com/NervJS/taro/commit/f1f27c3))
* mock for quickapp ([2117035](https://github.com/NervJS/taro/commit/2117035))
* stop trans asset for quickapp ([63087de](https://github.com/NervJS/taro/commit/63087de))
* **mini-runner:** 支持编译 tabBar 上引用的资源编译 ([c19ec85](https://github.com/NervJS/taro/commit/c19ec85))
* **mini-runner:** 生成快应用页面及组件 ([5e33381](https://github.com/NervJS/taro/commit/5e33381))
* **taro:** 加入快应用编译支持 ([58d61c4](https://github.com/NervJS/taro/commit/58d61c4))
* **taro:** 调整小程序和 H5 的编译配置 ([e7134e6](https://github.com/NervJS/taro/commit/e7134e6))
* **taro-cli:** 调整 rn 编译配置 ([8d6f9b3](https://github.com/NervJS/taro/commit/8d6f9b3))
* **taro-mini-runner:** 优化文件生成 ([cbf44a5](https://github.com/NervJS/taro/commit/cbf44a5))
* **taro-mini-runner:** 如果是组件需要补充 component:true 配置 ([77cbbc6](https://github.com/NervJS/taro/commit/77cbbc6))
* **taro-mini-runner:** 引入拆分的公共 chunks ([d46139f](https://github.com/NervJS/taro/commit/d46139f))
* **taro-mini-runner:** 拆分文件编译成为 plugin ([5280c05](https://github.com/NervJS/taro/commit/5280c05))
* **taro-mini-runner:** 生成多端类型文件 ([cdbe7a9](https://github.com/NervJS/taro/commit/cdbe7a9))
* **taro-mini-runner:** 生成页面以及组件的 usingComponents 配置 ([028f22c](https://github.com/NervJS/taro/commit/028f22c))
* checkout from auto-docs ([c9a5eaa](https://github.com/NervJS/taro/commit/c9a5eaa))
* **taro-weapp/taro-with-weapp:** 增加 isUsingDiff 开关 ([e0af665](https://github.com/NervJS/taro/commit/e0af665))
* upload for auto-api for components ([c8855ba](https://github.com/NervJS/taro/commit/c8855ba))



<a name="1.3.34"></a>
## [1.3.34](https://github.com/NervJS/taro/compare/v1.3.33...v1.3.34) (2019-12-31)


### Bug Fixes

* **template:** 临时解决 ESLint 分析器认为 Config 未使用的问题 [#5207](https://github.com/NervJS/taro/issues/5207) ([ed6f261](https://github.com/NervJS/taro/commit/ed6f261))
* **template:** 添加 [@typescript-eslint](https://github.com/typescript-eslint)/eslint-plugin 并更新模版配置 [#5207](https://github.com/NervJS/taro/issues/5207) ([899dacf](https://github.com/NervJS/taro/commit/899dacf))
* cloud 对象方法未能导出, fixed [#5195](https://github.com/NervJS/taro/issues/5195) ([73a2ddc](https://github.com/NervJS/taro/commit/73a2ddc))
* error var name ([c6c9c02](https://github.com/NervJS/taro/commit/c6c9c02))
* **cli:** 当前主版本无稳定版本导致更新报错的问题，并添加文档 ([7852967](https://github.com/NervJS/taro/commit/7852967))
* **cli:** 获取到确切的 latest vertion ([d7f2ca5](https://github.com/NervJS/taro/commit/d7f2ca5))
* **h5:** h5环境previewImage左右滑动时触发浏览器前进、后退 ([c3c9929](https://github.com/NervJS/taro/commit/c3c9929))
* **router:** H5下 ReLaunch 没办法跳到指定的页面 ([484d3b0](https://github.com/NervJS/taro/commit/484d3b0))
* **taro-h5:** fix scroll issue in iOS when using showToast/showModal/showActionSheet ([#5092](https://github.com/NervJS/taro/issues/5092)) ([698c057](https://github.com/NervJS/taro/commit/698c057))
* **tt:** 修复头条基础库1.38.2后引起的 slot 问题 ([fffa784](https://github.com/NervJS/taro/commit/fffa784))


### Features

* **cli:**  添加了 version 校验 ([325e6d2](https://github.com/NervJS/taro/commit/325e6d2))
* **h5:** 为h5的uploadFile添加了额外的文件名参数 ([46fdce6](https://github.com/NervJS/taro/commit/46fdce6))


### Reverts

* 临时解决 ESLint 分析器认为 Config 未使用的问题 [#5207](https://github.com/NervJS/taro/issues/5207) ([863a5a5](https://github.com/NervJS/taro/commit/863a5a5))



<a name="1.3.33"></a>
## [1.3.33](https://github.com/NervJS/taro/compare/v1.3.32...v1.3.33) (2019-12-25)


### Bug Fixes

* **transform-wx:** 修复微信开发者工具key警告(使用常量key判断) ([#5181](https://github.com/NervJS/taro/issues/5181)) ([c2044dd](https://github.com/NervJS/taro/commit/c2044dd))
* **transformer:** 修复循环 ref 测试用例 ([b3a7874](https://github.com/NervJS/taro/commit/b3a7874))
* **transformer:** 替换掉 key 中包含 LOOP_ORIGINAL 的字符串 ([1c99523](https://github.com/NervJS/taro/commit/1c99523))



<a name="1.3.32"></a>
## [1.3.32](https://github.com/NervJS/taro/compare/v1.3.31...v1.3.32) (2019-12-24)


### Bug Fixes

* **cli:** update 命令获取 taro 版本时兼容 beta 为 lastest 的情况 ([d854a3e](https://github.com/NervJS/taro/commit/d854a3e))
* **components:** componentWillUnmount lifecycle ([#5135](https://github.com/NervJS/taro/issues/5135)) ([297eefa](https://github.com/NervJS/taro/commit/297eefa))
* remove js extension ([073e704](https://github.com/NervJS/taro/commit/073e704))


### Features

* **cli:** taro update 到指定版本或者更新到 major 的 latest 版本 ([ae0bf9b](https://github.com/NervJS/taro/commit/ae0bf9b))
* checkout from auto-docs ([67a945a](https://github.com/NervJS/taro/commit/67a945a))



<a name="1.3.31"></a>
## [1.3.31](https://github.com/NervJS/taro/compare/v1.3.30...v1.3.31) (2019-12-20)


### Bug Fixes

* **cli:** add taro-rn package in template to pass cli version validate ([5b8bf19](https://github.com/NervJS/taro/commit/5b8bf19))
* **components:** h5 image 删除无关代码 ([#4998](https://github.com/NervJS/taro/issues/4998)) ([b37483e](https://github.com/NervJS/taro/commit/b37483e))
* **components:** 修复 Image 组件在 react 环境下报错的问题 ([2d7ccee](https://github.com/NervJS/taro/commit/2d7ccee))
* **miniprogram:** 修复循环 ref 问题，fix [#5052](https://github.com/NervJS/taro/issues/5052) ([af9d81c](https://github.com/NervJS/taro/commit/af9d81c))
* **miniprogram:** 修复循环内使用 ref 的问题，fix [#5050](https://github.com/NervJS/taro/issues/5050) ([4e718a2](https://github.com/NervJS/taro/commit/4e718a2))
* **taro:** 增加 getRealtimeLogManager api, close [#5072](https://github.com/NervJS/taro/issues/5072) ([36fd185](https://github.com/NervJS/taro/commit/36fd185))
* **taro:** 增加 nextTick api ([23a754e](https://github.com/NervJS/taro/commit/23a754e))
* **typescript types:** 修复 Taro.getExtConfigSync 返回值类型。 ([#5114](https://github.com/NervJS/taro/issues/5114)) ([d67dfc2](https://github.com/NervJS/taro/commit/d67dfc2))
* **weapp:** 生命周期调用不严谨 ([19fcf2c](https://github.com/NervJS/taro/commit/19fcf2c))
* **with-weapp:** props 无法监听 & data 有循环数据报错 ([aa0e3dd](https://github.com/NervJS/taro/commit/aa0e3dd))
* video component ([f2e0dad](https://github.com/NervJS/taro/commit/f2e0dad))


### Features

* **weapp:** taro config add style typing ([#5090](https://github.com/NervJS/taro/issues/5090)) ([4e2b7f0](https://github.com/NervJS/taro/commit/4e2b7f0))
* add style for video ([6e3a65f](https://github.com/NervJS/taro/commit/6e3a65f))
* checkout from auto-docs ([9d753fc](https://github.com/NervJS/taro/commit/9d753fc))
* **weapp:** add missing type for image component ([#5071](https://github.com/NervJS/taro/issues/5071)) ([f07e6b5](https://github.com/NervJS/taro/commit/f07e6b5))



<a name="1.3.30"></a>
## [1.3.30](https://github.com/NervJS/taro/compare/v1.3.29...v1.3.30) (2019-12-18)


### Bug Fixes

* **transformer:** 修复微信开发者控制台 key 报警 ([e6910db](https://github.com/NervJS/taro/commit/e6910db))


### Features

* **with-weapp:** 支持 observers ([3affac6](https://github.com/NervJS/taro/commit/3affac6))



<a name="1.3.29"></a>
## [1.3.29](https://github.com/NervJS/taro/compare/v1.3.28...v1.3.29) (2019-12-11)


### Bug Fixes

* **jd:** 京东小程序暂不支持插件 ([553ff83](https://github.com/NervJS/taro/commit/553ff83))
* **weapp/tt/swan/qq/jd:** 取消“从 prevProps 改为使用 nextProps”的改动 ([48b8271](https://github.com/NervJS/taro/commit/48b8271))


### Reverts

* **weapp:** 取消“从 prevProps 改为使用 nextProps”的改动 ([8694e8f](https://github.com/NervJS/taro/commit/8694e8f))



<a name="1.3.28"></a>
## [1.3.28](https://github.com/NervJS/taro/compare/v1.3.27...v1.3.28) (2019-12-11)


### Bug Fixes

* **cli:** 删掉模板中空的 copy 配置 ([7274ce2](https://github.com/NervJS/taro/commit/7274ce2))
* **weapp:** setData 前需要深拷贝衍生自 state 的 data, fix [#5012](https://github.com/NervJS/taro/issues/5012) ([0892241](https://github.com/NervJS/taro/commit/0892241))
* 修复 API 类型重构导致的编译失败问题 ([fd96d81](https://github.com/NervJS/taro/commit/fd96d81))


### Features

* checkout scripts from auto-docs ([dba5426](https://github.com/NervJS/taro/commit/dba5426))
* checkout types from auto-docs branch ([70ec501](https://github.com/NervJS/taro/commit/70ec501))
* createSelectorQuery Method`scrollOffset` fix ([e8af0a8](https://github.com/NervJS/taro/commit/e8af0a8))



<a name="1.3.27"></a>
## [1.3.27](https://github.com/NervJS/taro/compare/v1.3.26...v1.3.27) (2019-12-03)


### Bug Fixes

* **cli:** 修复编译 ui 库及 plugin 时报错的问题，close [#4965](https://github.com/NervJS/taro/issues/4965) ([36ef638](https://github.com/NervJS/taro/commit/36ef638))
* **components:** h5 image在unmount时取消IntersectionObserver监听 ([#4975](https://github.com/NervJS/taro/issues/4975)) ([a42bc6e](https://github.com/NervJS/taro/commit/a42bc6e))
* **qq:** import nextTick & updateComponent ([59ecaad](https://github.com/NervJS/taro/commit/59ecaad))
* **taro:** modify live-pusher props are not required ([#4952](https://github.com/NervJS/taro/issues/4952)) ([c10feed](https://github.com/NervJS/taro/commit/c10feed))
* **taro:** 修复页面 config 参数缺失 pageOrientation 的类型定义 ([#4961](https://github.com/NervJS/taro/issues/4961)) ([6277ea3](https://github.com/NervJS/taro/commit/6277ea3))
* **taro:** 修正 lineCap 的类型 ([#4992](https://github.com/NervJS/taro/issues/4992)) ([3bbd955](https://github.com/NervJS/taro/commit/3bbd955))
* **taro.component:** 修改类组件构造器定义，保持向后兼容 ([e8eb71e](https://github.com/NervJS/taro/commit/e8eb71e))
* **taro.components:** fix Taro.FC typings and others, close [#4987](https://github.com/NervJS/taro/issues/4987) ([57c3346](https://github.com/NervJS/taro/commit/57c3346))
* **transformer-wx:** enhancing the eslint checker ([#4995](https://github.com/NervJS/taro/issues/4995)) ([27d9905](https://github.com/NervJS/taro/commit/27d9905))
* set transform method ([f681da1](https://github.com/NervJS/taro/commit/f681da1))
* **template:** default 模版补充 rn 和 quickapp 的依赖 ([7ea8892](https://github.com/NervJS/taro/commit/7ea8892))
* **tt:** 修复头条小程序报nextTick is undefined ([f75ee9b](https://github.com/NervJS/taro/commit/f75ee9b))


### Reverts

* **template:** 从默认模版中移除 RN 依赖 ([9dcdc61](https://github.com/NervJS/taro/commit/9dcdc61))



<a name="1.3.26"></a>
## [1.3.26](https://github.com/NervJS/taro/compare/v1.3.25...v1.3.26) (2019-11-27)


### Bug Fixes

* ref在字节跳动中不能使用的BUG ([b0ca0a3](https://github.com/NervJS/taro/commit/b0ca0a3))
* 修改代码格式问题 ([838766b](https://github.com/NervJS/taro/commit/838766b))
* **alipay:** 函数 Page 组件没有触发effect cleanup ([deaebb7](https://github.com/NervJS/taro/commit/deaebb7)), closes [#4068](https://github.com/NervJS/taro/issues/4068)
* **cli:** Bug css url loader ([#4780](https://github.com/NervJS/taro/issues/4780)) ([de11450](https://github.com/NervJS/taro/commit/de11450))
* 修正previewImage点透问题 ([#4802](https://github.com/NervJS/taro/issues/4802)) ([36e19b5](https://github.com/NervJS/taro/commit/36e19b5))
* **cli:** ui 库编译支持 css modules，[#4445](https://github.com/NervJS/taro/issues/4445) ([a9993c5](https://github.com/NervJS/taro/commit/a9993c5))
* **cli:** ui 库编译时从 npm 包中引入的样式不做处理 ([75f8d11](https://github.com/NervJS/taro/commit/75f8d11))
* **cli:** 修复插件 watch 时在 windows 上的路径问题 ([b8196fd](https://github.com/NervJS/taro/commit/b8196fd))
* **cli:** 修复插件 watch 时在 windows 上的路径问题，fix [#4811](https://github.com/NervJS/taro/issues/4811) ([8acfae8](https://github.com/NervJS/taro/commit/8acfae8))
* **cli:** 修正qq轻应用配置文件读取 ([#4865](https://github.com/NervJS/taro/issues/4865)) ([ae6f268](https://github.com/NervJS/taro/commit/ae6f268))
* **cli:** 组件引用支持 import as 语法 ([642ce25](https://github.com/NervJS/taro/commit/642ce25))
* **components:** h5下Image的aspectFill与小程序不一致([#4620](https://github.com/NervJS/taro/issues/4620)) ([#4897](https://github.com/NervJS/taro/issues/4897)) ([989a3ce](https://github.com/NervJS/taro/commit/989a3ce))
* **components:** 修复联想词无法触发 onInput (close [#4677](https://github.com/NervJS/taro/issues/4677)) ([a39a4ee](https://github.com/NervJS/taro/commit/a39a4ee))
* **docs:** 修复和优化 readme 描述错误 ([#4864](https://github.com/NervJS/taro/issues/4864)) ([1cfbf13](https://github.com/NervJS/taro/commit/1cfbf13))
* **hooks:** 钩子 useState，设置新 state 和当前 state 全等时跳过渲染。 ([aec705e](https://github.com/NervJS/taro/commit/aec705e))
* **taro-cli:** 小程序组件打包时，将打包参数传递到依赖文件的打包中 ([#4924](https://github.com/NervJS/taro/issues/4924)) ([c2e7e04](https://github.com/NervJS/taro/commit/c2e7e04))
* **taro-router:** 修复路由参数 `path` ([#4921](https://github.com/NervJS/taro/issues/4921)) ([bef8531](https://github.com/NervJS/taro/commit/bef8531))
* 修复 commom.d.ts 的 animation 类型错误 ([#4920](https://github.com/NervJS/taro/issues/4920)) ([91660c2](https://github.com/NervJS/taro/commit/91660c2))
* **weapp:** 修复插件通过 extraProps 不能传函数的问题，fix [#4658](https://github.com/NervJS/taro/issues/4658) ([f240cff](https://github.com/NervJS/taro/commit/f240cff))
* **weapp:** 添加微信小程序 getLocation 参数定义 ([#4916](https://github.com/NervJS/taro/issues/4916)) ([267c15d](https://github.com/NervJS/taro/commit/267c15d))
* **weapp:** 调整 wx.pageScrollTo 类型签名 ([#4856](https://github.com/NervJS/taro/issues/4856)) ([28fb2e9](https://github.com/NervJS/taro/commit/28fb2e9))
* **weapp/jd/qq/swan/tt:** 循环中 pm.observers 应该在 observer 里绑定。fix [#4839](https://github.com/NervJS/taro/issues/4839) ([64f1ea4](https://github.com/NervJS/taro/commit/64f1ea4))


### Features

* **cli:** 引入第三方原生组件支持 ([#4526](https://github.com/NervJS/taro/issues/4526)) ([adf8864](https://github.com/NervJS/taro/commit/adf8864))
* **taro:** 添加Wi-Fi新API(offWifiConnected & offGetWifiList)及更新文档 ([#4927](https://github.com/NervJS/taro/issues/4927)) ([cae2997](https://github.com/NervJS/taro/commit/cae2997))
* **webpack-runner:** h5环境支持自定义source-map格式 ([#4722](https://github.com/NervJS/taro/issues/4722)) ([472324d](https://github.com/NervJS/taro/commit/472324d))
*  rn 环境下CoverView 与 CoverImage 向下兼容为 View 与Image ([0cd0741](https://github.com/NervJS/taro/commit/0cd0741))
*  rn 配置添加onlyTaroToRn字段,支持项目构建只编译不打包 ([c766251](https://github.com/NervJS/taro/commit/c766251))
*  rn 配置添加onlyTaroToRn字段,支持项目构建只编译不打包 ([2188030](https://github.com/NervJS/taro/commit/2188030))
*  在rn环境下,window属性支持配置backgroundColor ([2bea8b7](https://github.com/NervJS/taro/commit/2bea8b7))
* docs with general types ([716e826](https://github.com/NervJS/taro/commit/716e826))
* multi-supported ([079e95a](https://github.com/NervJS/taro/commit/079e95a))
* upload types ([4e9d19f](https://github.com/NervJS/taro/commit/4e9d19f))
* **button:** 优化 Button 部分事件的参数类型 ([d2d156b](https://github.com/NervJS/taro/commit/d2d156b))



<a name="1.3.25"></a>
## [1.3.25](https://github.com/NervJS/taro/compare/v1.3.24...v1.3.25) (2019-11-14)



<a name="1.3.24"></a>
## [1.3.24](https://github.com/NervJS/taro/compare/v1.3.23...v1.3.24) (2019-11-13)


### Bug Fixes

* **rn:** Taro.previewImage 报错 ([8fa7045](https://github.com/NervJS/taro/commit/8fa7045))
* **ui:** 修复 ui 库编译的入口文件生成 ([0994338](https://github.com/NervJS/taro/commit/0994338))
* **ui:** 移除 ui 库编译后 h5 入口文件中的冗余代码 ([445f243](https://github.com/NervJS/taro/commit/445f243))
* **weapp:** 修复微信小程序遗留代码：nextProps 初始化，引起的冲突 ([00cf71c](https://github.com/NervJS/taro/commit/00cf71c))



<a name="1.3.23"></a>
## [1.3.23](https://github.com/NervJS/taro/compare/v1.3.21...v1.3.23) (2019-11-12)


### Bug Fixes

* **transformer:** 调整 $$refs 相关代码以通过 ref 测试用例 ([f4cb414](https://github.com/NervJS/taro/commit/f4cb414))
* docs output ([5e8c828](https://github.com/NervJS/taro/commit/5e8c828))
* **alipay:** 对自组件 didmount 中拿不到最新 this.props 的问题做兜底，fix [#4769](https://github.com/NervJS/taro/issues/4769) ([a68c67c](https://github.com/NervJS/taro/commit/a68c67c))
* **alipay/jd/qq/swan/tt:** 小程序暴露 RefsArray 给编译时 ([a442efd](https://github.com/NervJS/taro/commit/a442efd))
* **chore:** dependabot couldn't reach registry.m.jd.com as it timed out close [#4684](https://github.com/NervJS/taro/issues/4684) ([258ea17](https://github.com/NervJS/taro/commit/258ea17))
* **cli:** rn 端添加 babel-plugin-transform-decorators-legacy 插件 close [#4764](https://github.com/NervJS/taro/issues/4764) ([a504a44](https://github.com/NervJS/taro/commit/a504a44))
* **cli:** ui 库打包将 ts 编译成 js，close [#4672](https://github.com/NervJS/taro/issues/4672) ([a51ee6a](https://github.com/NervJS/taro/commit/a51ee6a))
* **cli:** ui 库打包时会 copy .d.ts 结尾的 interface 文件 && 移除 H5 打包时入口的多余代码，[#4672](https://github.com/NervJS/taro/issues/4672) ([3f16e4d](https://github.com/NervJS/taro/commit/3f16e4d))
* **cli:** 修复 cli 编译 ui 库的若干问题 ([62452cd](https://github.com/NervJS/taro/commit/62452cd))
* **cli:** 修复解析 node_modules 中组件路径的问题 ([013a1c3](https://github.com/NervJS/taro/commit/013a1c3))
* **cli:** 快应用支持从 node_modules 中解析组件 ([523caa5](https://github.com/NervJS/taro/commit/523caa5))
* **cli:** 编译微信插件时需要对 plugin.json 指定的入口文件的后缀进行处理，close [#4773](https://github.com/NervJS/taro/issues/4773) ([f5b689d](https://github.com/NervJS/taro/commit/f5b689d))
* **cli:** 编译的 node_modules 中文件类型处理错误 ([f7a03fb](https://github.com/NervJS/taro/commit/f7a03fb))
* **cli:** 避免h5运行时无限安装[@tarojs](https://github.com/tarojs)/taro-h5 ([9201503](https://github.com/NervJS/taro/commit/9201503))
* **components:** components props type checking ([948a940](https://github.com/NervJS/taro/commit/948a940))
* **components:** 修复一个typo ([ba9e614](https://github.com/NervJS/taro/commit/ba9e614))
* **components-rn:** 修正 rn build 脚本对于 windows 兼容问题 [#4792](https://github.com/NervJS/taro/issues/4792) ([d8eeb32](https://github.com/NervJS/taro/commit/d8eeb32))
* **components-rn:** 让编译器忽略类型检查 ([5ba6aee](https://github.com/NervJS/taro/commit/5ba6aee))
* **mobx:** 修复 H5 & RN 端在生命周期函数中无法获得 store 信息的问题（[#4637](https://github.com/NervJS/taro/issues/4637)） ([87af6ee](https://github.com/NervJS/taro/commit/87af6ee))
* **taro:** 修复编译器找不到 d.ts 文件的问题 ([463102c](https://github.com/NervJS/taro/commit/463102c))
* move scripts docs in [@tarojs](https://github.com/tarojs)/taro ([ac3705b](https://github.com/NervJS/taro/commit/ac3705b))
* types path ([e430863](https://github.com/NervJS/taro/commit/e430863))
* types reference ([f4ea65c](https://github.com/NervJS/taro/commit/f4ea65c))
* types use param-case nomenclature ([f88eacb](https://github.com/NervJS/taro/commit/f88eacb))
* **jd:** 京东小程序 getSystemInfoSync 兜底 ([df6c6fd](https://github.com/NervJS/taro/commit/df6c6fd))
* **rn:** react native中input实现有问题，close [#4613](https://github.com/NervJS/taro/issues/4613) ([16257d0](https://github.com/NervJS/taro/commit/16257d0))
* **rn:** 接入项目的 babel config 配置导致的 constructor 编译错误 ([ba853b8](https://github.com/NervJS/taro/commit/ba853b8))
* **taro:** 修复 setClipboardData 错误的返回类型 ([bea4b44](https://github.com/NervJS/taro/commit/bea4b44))
* **taro:** 修复小程序生命周期 hook 在 rerender 后只触发最后一个 ([#4642](https://github.com/NervJS/taro/issues/4642)) ([5ca1e6c](https://github.com/NervJS/taro/commit/5ca1e6c))
* **taro-h5:** 修复 H5 下 iOS 设备 Taro.setClipboardData 无效 [#4611](https://github.com/NervJS/taro/issues/4611) ([a94897d](https://github.com/NervJS/taro/commit/a94897d))
* **taro-plugin-sass:** 修复 plugins.sass 只配置了 resource 时编译出错的问题 ([92b53d7](https://github.com/NervJS/taro/commit/92b53d7))
* **taro-router:** 修复 min-height 误写成 height ([0a98fd1](https://github.com/NervJS/taro/commit/0a98fd1))
* **taro/transformer:** 修复 useRef 拿不到实例的问题，fix [#4466](https://github.com/NervJS/taro/issues/4466) ([fe6b13c](https://github.com/NervJS/taro/commit/fe6b13c))
* **transformer-wx:** 快应用暂时不处理 ref ([a7b6b20](https://github.com/NervJS/taro/commit/a7b6b20))
* **transformer-wx:** 编译器不读取用户的 babel 配置 ([fce3eb5](https://github.com/NervJS/taro/commit/fce3eb5))
* **types:** alipay ([da6840b](https://github.com/NervJS/taro/commit/da6840b))
* **types:** types 索引签名参数类型不能为联合类型问题修改 [#4776](https://github.com/NervJS/taro/issues/4776) ([0131e95](https://github.com/NervJS/taro/commit/0131e95))
* 开发第三方多端 UI 库默认只编译小程序和 H5 ，并添加 platforms 配置 ([7d49b64](https://github.com/NervJS/taro/commit/7d49b64))


### Features

* **weapp:** 从prevProps改为使用nextProps，避免props的提前赋值 ([b2bdb6e](https://github.com/NervJS/taro/commit/b2bdb6e))
* abstract auto-doc format method ([7ee5bdc](https://github.com/NervJS/taro/commit/7ee5bdc))
* add auto docs decs ([02674b7](https://github.com/NervJS/taro/commit/02674b7))
* add mult-example ([913da30](https://github.com/NervJS/taro/commit/913da30))
* auto docs ([7713e52](https://github.com/NervJS/taro/commit/7713e52))
* get types from ts ([e0e1852](https://github.com/NervJS/taro/commit/e0e1852))
* upload types-docs programme ([808aba1](https://github.com/NervJS/taro/commit/808aba1))
* **cli:** RN 编译使用 babel 配置 ([a3df953](https://github.com/NervJS/taro/commit/a3df953))
* **rn:** 添加 RN 端 ui build 的 watch ([811e895](https://github.com/NervJS/taro/commit/811e895))
* **taro:** 分享参数增加动态消息相关字段 [#4618](https://github.com/NervJS/taro/issues/4618) ([d95f3cc](https://github.com/NervJS/taro/commit/d95f3cc))
* **taro:** 新增 getSelectedTextRange 和 hideHomeButton API ([82037c9](https://github.com/NervJS/taro/commit/82037c9))
* **taro:** 添加 getSelectedTextRange 的类型定义 close [#4654](https://github.com/NervJS/taro/issues/4654) ([d4eccf8](https://github.com/NervJS/taro/commit/d4eccf8))
* **taro:** 添加 hideHomeButton 的类型定义 close [#4629](https://github.com/NervJS/taro/issues/4629) ([a552264](https://github.com/NervJS/taro/commit/a552264))
* **taro-webpack-runner:** 使 H5 支持修改后的 plugin.sass 配置 ([f76467f](https://github.com/NervJS/taro/commit/f76467f))
* **ui:**  实现 基于 Taro 开发第三方多端 UI 库 的RN 端 ([ecc1557](https://github.com/NervJS/taro/commit/ecc1557))
* **weapp:** requestSubscribeMessage 补充 [#4687](https://github.com/NervJS/taro/issues/4687) close [#4686](https://github.com/NervJS/taro/issues/4686) ([798a5d2](https://github.com/NervJS/taro/commit/798a5d2))
* **webpack-runner:** dev-server配置host为0.0.0.0时, 默认以本地ip打开 ([#4699](https://github.com/NervJS/taro/issues/4699)) ([6bd7884](https://github.com/NervJS/taro/commit/6bd7884))


### Reverts

* 修改 types 目录结构，部分调整已适应自动化文档生成 ([4645773](https://github.com/NervJS/taro/commit/4645773))



<a name="1.3.21"></a>
## [1.3.21](https://github.com/NervJS/taro/compare/v1.3.20...v1.3.21) (2019-10-21)


### Bug Fixes

* **jd:** props 系统优化 ([18813a8](https://github.com/NervJS/taro/commit/18813a8))
* **mobx:** mobx 监听器 dispose 之前先判断监听器是否存在([#4617](https://github.com/NervJS/taro/issues/4617)) ([0ab6b27](https://github.com/NervJS/taro/commit/0ab6b27))
* **rn:** rn上的Textarea在disableScroll为true时候的问题  close [#4476](https://github.com/NervJS/taro/issues/4476) ([f190dc1](https://github.com/NervJS/taro/commit/f190dc1))
* **taro:** 修复 h5 Fragment 支持方式 ([5e20e75](https://github.com/NervJS/taro/commit/5e20e75))
* **taro-h5:** 修复h5环境下setClipboardData在ios无效, 在android滚动到页面最后的问题 ([#4622](https://github.com/NervJS/taro/issues/4622)) ([351c0ac](https://github.com/NervJS/taro/commit/351c0ac))
* **taro-h5:** 响应体无数据时抛错进入reject ([#4599](https://github.com/NervJS/taro/issues/4599)) ([84ce3ef](https://github.com/NervJS/taro/commit/84ce3ef))
* **taro-h5:** 支持fetch abort ([#4596](https://github.com/NervJS/taro/issues/4596)) ([7fdb3fc](https://github.com/NervJS/taro/commit/7fdb3fc))
* **transformer:** babel-remove-dead-code 求值不正确 ([bfaaa09](https://github.com/NervJS/taro/commit/bfaaa09))
* **transformer-wx:** 解决babel插件path.hub 中无法获取文件名 ([#4495](https://github.com/NervJS/taro/issues/4495)) ([7453b8d](https://github.com/NervJS/taro/commit/7453b8d))
* quickapp text lines fix [#4607](https://github.com/NervJS/taro/issues/4607) ([751cbd9](https://github.com/NervJS/taro/commit/751cbd9))
* 快应用编译导致 lines 属性丢失 ([46aeaee](https://github.com/NervJS/taro/commit/46aeaee))


### Features

* **rn:** add Taro.reLaunch close  [#4615](https://github.com/NervJS/taro/issues/4615) ([9664c45](https://github.com/NervJS/taro/commit/9664c45))
* **rn:** 添加 tabbar borderStyle 支持 ([ab46b5a](https://github.com/NervJS/taro/commit/ab46b5a))
* **router:** H5 实现 componentDidNotFound 方法 ([eb3f0e3](https://github.com/NervJS/taro/commit/eb3f0e3))
* **taro:** 增加 requestSubscribeMessage 的类型定义 [#4630](https://github.com/NervJS/taro/issues/4630) ([0165a4d](https://github.com/NervJS/taro/commit/0165a4d))



<a name="1.3.20"></a>
## [1.3.20](https://github.com/NervJS/taro/compare/v1.3.19...v1.3.20) (2019-10-14)


### Bug Fixes

* **cli:** h5 编译时读取 symbolic link 需要处理相对路径情况，[#4538](https://github.com/NervJS/taro/issues/4538) ([425d7b6](https://github.com/NervJS/taro/commit/425d7b6))
* **cli:** h5 页面 hooks 支持设置页面配置，close [#4592](https://github.com/NervJS/taro/issues/4592) ([d67490a](https://github.com/NervJS/taro/commit/d67490a))
* **cli:** taro convert 支持处理 app.json 中 sitemapLocation 属性，close [#4534](https://github.com/NervJS/taro/issues/4534) ([79e647e](https://github.com/NervJS/taro/commit/79e647e))
* **cli:** 修正快应用依赖环境安装时，因系统不同造成的命令执行问题 ([#4520](https://github.com/NervJS/taro/issues/4520)) ([f2274ef](https://github.com/NervJS/taro/commit/f2274ef))
* **cli:** 小程序编译更好地支持 yarn workspaces ([f6da123](https://github.com/NervJS/taro/commit/f6da123))
* **cli:** 编译报错的组件标记为已编译 ([1dc346c](https://github.com/NervJS/taro/commit/1dc346c))
* **components:** iOS8需要添加webkit前缀 ([#4519](https://github.com/NervJS/taro/issues/4519)) ([08d0a3c](https://github.com/NervJS/taro/commit/08d0a3c))
* **components:** 修复 Image lazy 监听问题 ([6ebcbea](https://github.com/NervJS/taro/commit/6ebcbea))
* **components:** 修复 Input 组件属性覆盖问题, fix [#4553](https://github.com/NervJS/taro/issues/4553) ([38bd6ec](https://github.com/NervJS/taro/commit/38bd6ec))
* **mobx:** 修复 H5 及 RN 端使用 inject 装饰且具有继承关系中父类 constructor 不被调用的问题([#4507](https://github.com/NervJS/taro/issues/4507)) ([2d06388](https://github.com/NervJS/taro/commit/2d06388))
* **router:** 修复hash模式下tabbar不展示的问题 ([61dc79a](https://github.com/NervJS/taro/commit/61dc79a))
* **taro:** 新增支付宝小程序 WindowConfig 属性 ([#4548](https://github.com/NervJS/taro/issues/4548)) ([242e4f7](https://github.com/NervJS/taro/commit/242e4f7))
* **transformer:** 方法 findJSXAttrByName 需要考虑 JSXSpreadAttribute，fix [#4527](https://github.com/NervJS/taro/issues/4527) ([f9d3f87](https://github.com/NervJS/taro/commit/f9d3f87))
* **transformer:** 替换属性名前需要先判断，fix [#4511](https://github.com/NervJS/taro/issues/4511) ([642015f](https://github.com/NervJS/taro/commit/642015f))
* **transformer:** 高阶组件在 h5 被错误处理，close [#4345](https://github.com/NervJS/taro/issues/4345) ([6b4eed7](https://github.com/NervJS/taro/commit/6b4eed7))
* **types:** upload map components types fix [#4328](https://github.com/NervJS/taro/issues/4328) ([7064a10](https://github.com/NervJS/taro/commit/7064a10))
* **weapp/qq/alipay/swan/tt/quickapp:** props 系统优化 ([0481893](https://github.com/NervJS/taro/commit/0481893)), closes [#4497](https://github.com/NervJS/taro/issues/4497)


### Features

* **cli:** 增加控制h5页面lazyload的参数h5.router.lazyload ([074a841](https://github.com/NervJS/taro/commit/074a841))
* **h5:**  browser forward / back hide map [#4255](https://github.com/NervJS/taro/issues/4255) ([9c4ad12](https://github.com/NervJS/taro/commit/9c4ad12))
* **taro:** h5 和小程序端支持 Fragment ([76d278f](https://github.com/NervJS/taro/commit/76d278f))
* **taro:** 增加 useScope hook 以访问小程序原生作用域，close [#4600](https://github.com/NervJS/taro/issues/4600) ([67dfbf7](https://github.com/NervJS/taro/commit/67dfbf7))
* **taro:** 按照微信小程序文档的分类方式拆分 index.d.ts 为 87 个文件 ([#4557](https://github.com/NervJS/taro/issues/4557)) ([9882bed](https://github.com/NervJS/taro/commit/9882bed))



<a name="1.3.19"></a>
## [1.3.19](https://github.com/NervJS/taro/compare/v1.3.18...v1.3.19) (2019-09-23)


### Bug Fixes

* **chore:** dependabot couldn't reach registry.m.jd.com  close [#4432](https://github.com/NervJS/taro/issues/4432) ([385ca6a](https://github.com/NervJS/taro/commit/385ca6a))
* **cli:** h5 编译时支持读取 symbolic link，close [#4431](https://github.com/NervJS/taro/issues/4431) ([dfbe42c](https://github.com/NervJS/taro/commit/dfbe42c))
* **cli:** taro doctor 增加 weapp.compile.include 规则 ([b8a3c45](https://github.com/NervJS/taro/commit/b8a3c45))
* **cli:** taro doctor 检测时优先使用本地的 eslint 配置 ([9e8359e](https://github.com/NervJS/taro/commit/9e8359e))
* **cli:** ui 库编译支持文件循环引用，close [#4427](https://github.com/NervJS/taro/issues/4427) ([5e7fa88](https://github.com/NervJS/taro/commit/5e7fa88))
* **cli:** 修复h5环境下plugins-sass配置不生效的问题 ([#4474](https://github.com/NervJS/taro/issues/4474)) ([5237995](https://github.com/NervJS/taro/commit/5237995))
* **cli:** 支付宝构建时需要处理安装的 UI 库中的文件路径，将 @ 替换为 _，close [#4490](https://github.com/NervJS/taro/issues/4490) ([304c4af](https://github.com/NervJS/taro/commit/304c4af))
* **components:** swiper 从尾到头指定下标时的表现形式问题 ([c46d71c](https://github.com/NervJS/taro/commit/c46d71c))
* **components:** 修复 swiper 指示点颜色问题 ([b6818a3](https://github.com/NervJS/taro/commit/b6818a3))
* **mobx:** 生命周期 getDerivedStateFromProps 不被触发问题修复 ([492c1fb](https://github.com/NervJS/taro/commit/492c1fb))
* **taro:** 修复 Taro.request 每次调用都会 push taroInterceptor, fix [#4441](https://github.com/NervJS/taro/issues/4441) ([f030a4e](https://github.com/NervJS/taro/commit/f030a4e))
* **taro:** 内置拦截器向上暴露 abort, fix [#4386](https://github.com/NervJS/taro/issues/4386) ([ddbbcef](https://github.com/NervJS/taro/commit/ddbbcef))
* **taro:** 增加 RefsArray 用于存放 $$refs ([4a59930](https://github.com/NervJS/taro/commit/4a59930))
* **taro:** 支付宝、百度、快应用、字节跳动中调用 forceUpdate 时，不应执行 shouldComponentUpdate ([bb223a1](https://github.com/NervJS/taro/commit/bb223a1))
* **taro-alipay:** 修复 app 中声明 onShareAppMessage 不生效的问题，fix [#4477](https://github.com/NervJS/taro/issues/4477) ([9a17867](https://github.com/NervJS/taro/commit/9a17867))
* **taro-alipay:** 修复支付宝小程序 onTabItemTap 事件不触发的问题，close [#4517](https://github.com/NervJS/taro/issues/4517) ([3cd7e7a](https://github.com/NervJS/taro/commit/3cd7e7a))
* **taro-cli:** 修复插件 prod 模式下编译问题，fix [#4231](https://github.com/NervJS/taro/issues/4231) ([4564acd](https://github.com/NervJS/taro/commit/4564acd))
* **types:** canvas drawImage方法类型检查错误 ([#4481](https://github.com/NervJS/taro/issues/4481)) ([5e79fde](https://github.com/NervJS/taro/commit/5e79fde))
* **video:** this.progressBallRef is undefined ([#4407](https://github.com/NervJS/taro/issues/4407)) ([0a7fc45](https://github.com/NervJS/taro/commit/0a7fc45))
* **with-weapp:** setData 保持数据修改同步 ([68d5801](https://github.com/NervJS/taro/commit/68d5801))


### Features

* **apis:** 增加位置 API，close [#4448](https://github.com/NervJS/taro/issues/4448) ([cf283ac](https://github.com/NervJS/taro/commit/cf283ac))
* **cli:** ui 编译支持指定入口文件，[#4445](https://github.com/NervJS/taro/issues/4445) ([a639390](https://github.com/NervJS/taro/commit/a639390))
* **cli:** 增加快应用子组件定制规则，减少快应用端的预览错误 ([#4436](https://github.com/NervJS/taro/issues/4436)) ([708ceb9](https://github.com/NervJS/taro/commit/708ceb9))
* **jd:** 适配京东小程序 ([512d4ce](https://github.com/NervJS/taro/commit/512d4ce))



<a name="1.3.18"></a>
## [1.3.18](https://github.com/NervJS/taro/compare/v1.3.16...v1.3.18) (2019-09-07)


### Bug Fixes

* **cli:** 增加快应用支持的样式 ([90116c2](https://github.com/NervJS/taro/commit/90116c2))
* **cli:** 小程序 debug 与快应用 logLevel 不挂钩 ([65af0ee](https://github.com/NervJS/taro/commit/65af0ee))
* 添加QQ小程序分享功能缺失的参数属性showShareItems ([#4421](https://github.com/NervJS/taro/issues/4421)) ([a923335](https://github.com/NervJS/taro/commit/a923335))
* **cli:** 修复快应用编译时样式处理细节问题 ([76d8ff7](https://github.com/NervJS/taro/commit/76d8ff7))
* **cli:** 去掉快应用编译时没必要的尺寸转换 ([2150e7b](https://github.com/NervJS/taro/commit/2150e7b))
* **cli:** 快应用编译时错误注释掉了支持的样式 ([4a829f6](https://github.com/NervJS/taro/commit/4a829f6))
* **cli:** 调整 taro-page 插入逻辑，close [#4357](https://github.com/NervJS/taro/issues/4357) ([d03d23c](https://github.com/NervJS/taro/commit/d03d23c))
* **components:** 修复快应用事件重复触发问题 ([742ac61](https://github.com/NervJS/taro/commit/742ac61))
* **docs:** react native 端的 moduleName ([7150a66](https://github.com/NervJS/taro/commit/7150a66))
* **docs:** 修复原生组件传 props 给自定义组件的用法文档 ([5e72332](https://github.com/NervJS/taro/commit/5e72332))
* **router:** h5 page min-height 失效 [#4092](https://github.com/NervJS/taro/issues/4092) ([cbf2edf](https://github.com/NervJS/taro/commit/cbf2edf))
* **transformer:**  循环中使用自定义组件失效, close [#4359](https://github.com/NervJS/taro/issues/4359) ([e290a7c](https://github.com/NervJS/taro/commit/e290a7c))
* **transformer:** 任何情况下快应用 view 都解析为 div ([#4410](https://github.com/NervJS/taro/issues/4410)) ([958a617](https://github.com/NervJS/taro/commit/958a617))
* **weapp/qq:** 修复新 props 系统在微信小程序下循环渲染时的问题。fix [#4350](https://github.com/NervJS/taro/issues/4350) ([ae66b35](https://github.com/NervJS/taro/commit/ae66b35))
* lint ([6e7a7d1](https://github.com/NervJS/taro/commit/6e7a7d1))
* **transformer:** 只有 render 开头的函数才是 render props ([e1cf11c](https://github.com/NervJS/taro/commit/e1cf11c)), closes [#4180](https://github.com/NervJS/taro/issues/4180)


### Features

* **cli:** taro-init ([6a32f4c](https://github.com/NervJS/taro/commit/6a32f4c))
* **cli:** taro-init新增clone选项 ([#4400](https://github.com/NervJS/taro/issues/4400)) ([c157b71](https://github.com/NervJS/taro/commit/c157b71))
* **cli:** 增加了一些功能: ([a910b03](https://github.com/NervJS/taro/commit/a910b03))
* **cli:** 小程序支持单独编译单个组件和页面 ([c40e0ab](https://github.com/NervJS/taro/commit/c40e0ab))
* **cli component:** tabbar支持多页面模式 ([26184de](https://github.com/NervJS/taro/commit/26184de))
* **router:** 支持在多页面模式中使用api跳转 ([6134d28](https://github.com/NervJS/taro/commit/6134d28))
* **webpack-runner:** h5端支持编译到多个html文件 ([a8cfb54](https://github.com/NervJS/taro/commit/a8cfb54))
* **webpack-runner:** webpack-runner支持直接打开多页模式的首页 ([0220071](https://github.com/NervJS/taro/commit/0220071))
* **webpack-runner:** 加入预览端口自动切换的功能 ([6480a21](https://github.com/NervJS/taro/commit/6480a21))



<a name="1.3.16"></a>
## [1.3.16](https://github.com/NervJS/taro/compare/v1.3.14...v1.3.16) (2019-09-01)


### Bug Fixes

* **cli:** 修复h5的页面文件不支持named export的问题, close [#4290](https://github.com/NervJS/taro/issues/4290) ([7fee56b](https://github.com/NervJS/taro/commit/7fee56b))
* **cli:** 加入了templates里dot开头的文件 ([159e4d6](https://github.com/NervJS/taro/commit/159e4d6))
* **cli:** 去除拼接图片的错误提示 ([#4236](https://github.com/NervJS/taro/issues/4236)) ([afde06f](https://github.com/NervJS/taro/commit/afde06f))
* **cli:** 快应用 manifest 的 versioncode和minPlatformVersion必须是整型 ([#4318](https://github.com/NervJS/taro/issues/4318)) ([0a7bd5e](https://github.com/NervJS/taro/commit/0a7bd5e))
* **cli:** 插件编译 watch 时，plugin 内的 json 文件也需要修改 npm 路径 ([1c060a0](https://github.com/NervJS/taro/commit/1c060a0))
* **cli:** 插件编译把 fs.moveSync 改 fs.move 避免一些问题。fix [#4231](https://github.com/NervJS/taro/issues/4231) ([720f0f7](https://github.com/NervJS/taro/commit/720f0f7))
* **cli:** 插件编译时，plugin 内的 json 文件也需要修改 npm 路径，fix [#3794](https://github.com/NervJS/taro/issues/3794) ([346778c](https://github.com/NervJS/taro/commit/346778c))
* **cli:** 重命名templates里dot开头的文件 ([e612d11](https://github.com/NervJS/taro/commit/e612d11))
* **components:** 修复快应用 style 属性问题，修复 H5 image 问题 (close # 4116) ([40c47a0](https://github.com/NervJS/taro/commit/40c47a0))
* **components:** 修改快应用组件接受属性 ([4e18c5d](https://github.com/NervJS/taro/commit/4e18c5d))
* **components-qa:** canvas不能有子组件 ([#4339](https://github.com/NervJS/taro/issues/4339)) ([3cb94b0](https://github.com/NervJS/taro/commit/3cb94b0))
* **components-qa:** labelerror 修复拼写错误 ([#4286](https://github.com/NervJS/taro/issues/4286)) ([8cdb40d](https://github.com/NervJS/taro/commit/8cdb40d))
* **h5:** 修复measureText返回undefined的问题, close [#4254](https://github.com/NervJS/taro/issues/4254) ([bca1733](https://github.com/NervJS/taro/commit/bca1733))
* **taro:** 修复小程序下 usePageScoll/useReachBottom 等 hook 中 state/props 不更新的问题 ([10e72fb](https://github.com/NervJS/taro/commit/10e72fb))
* **taro-h5:** 修复 H5 中 usePageScoll/useReachBottom hooks 不生效问题 ([4829b43](https://github.com/NervJS/taro/commit/4829b43))
* **taro-hooks:** 组件方法 hooks 如 useShareAppMessage 需要暴露返回值，fix [#4256](https://github.com/NervJS/taro/issues/4256) ([daf5fed](https://github.com/NervJS/taro/commit/daf5fed))
* **taroize:** include不存在的模板会导致整个模板返回 null ([4e6c97a](https://github.com/NervJS/taro/commit/4e6c97a)), closes [#4265](https://github.com/NervJS/taro/issues/4265)
* **taroize:** wx:if后面有空格的问题，另外wxs标签不需要进行format操作,否则会报错 ([#4218](https://github.com/NervJS/taro/issues/4218)) ([0c9d3bb](https://github.com/NervJS/taro/commit/0c9d3bb))
* **taroize:** wxs import 需要保持原有命名 ([98556a3](https://github.com/NervJS/taro/commit/98556a3))
* **taroize:** 内联 wxs 每次都要生成的文件 ([51a2415](https://github.com/NervJS/taro/commit/51a2415))
* **taroize:** 给app.js添加withWeapp ([064ec7e](https://github.com/NervJS/taro/commit/064ec7e))
* **taroize:** 统一格式化为一行，否则会有unterminate line end的错误 ([#4244](https://github.com/NervJS/taro/issues/4244)) ([1af6e3a](https://github.com/NervJS/taro/commit/1af6e3a))
* **taroize:** 通过 this.triggerEvent 调用的参数需要用对象包裹 ([b661745](https://github.com/NervJS/taro/commit/b661745))
* **transformer:** children 与组合支持有限的条件表达式 ([80642bc](https://github.com/NervJS/taro/commit/80642bc)), closes [#4293](https://github.com/NervJS/taro/issues/4293)
* **transformer:** props 更新不会更改 state 的键值 ([181a878](https://github.com/NervJS/taro/commit/181a878))
* **transformer:** render props 参数判定出错 ([b94ca6f](https://github.com/NervJS/taro/commit/b94ca6f)), closes [#4237](https://github.com/NervJS/taro/issues/4237) [#4180](https://github.com/NervJS/taro/issues/4180)
* **transformer-wx:** 修复transformer内eslint依赖版本不一致的问题 ([5e42777](https://github.com/NervJS/taro/commit/5e42777))
* **transformer-wx:** 快应用内置组件不需要走心 props 系统 ([bcde899](https://github.com/NervJS/taro/commit/bcde899))
* **transformer-wx:** 快应用内置组件的 className 替换为 class ([9ad94f4](https://github.com/NervJS/taro/commit/9ad94f4))
* **transformer-wx:** 快应用内置组件的属性不需要经过新 props 系统处理 ([7187b9a](https://github.com/NervJS/taro/commit/7187b9a))
* **typings:** 增加设备方向 apis typings，fix [#4213](https://github.com/NervJS/taro/issues/4213) ([29c4dc6](https://github.com/NervJS/taro/commit/29c4dc6))
* **with-weapp:** 修复 taroize 转换后 setData 方法无回调的问题 ([58f8038](https://github.com/NervJS/taro/commit/58f8038))
* **with-weapp:** 有三个选项需要设置为 static ([f1b37e3](https://github.com/NervJS/taro/commit/f1b37e3))
* **with-weapp:** 给onShow传递options ([9d94380](https://github.com/NervJS/taro/commit/9d94380))


### Features

* **cli:** 快应用编译支持引入原生快应用组件 ([ada2290](https://github.com/NervJS/taro/commit/ada2290))
* **taro:** 增加设备方向 api ([54baf98](https://github.com/NervJS/taro/commit/54baf98))
* **taro-quickapp:** 快应用支持 Taro.getApp API，close [#4246](https://github.com/NervJS/taro/issues/4246) ([3b8c9a1](https://github.com/NervJS/taro/commit/3b8c9a1))
* **taroize:** 解析 wxml 加入缓存机制 ([af71480](https://github.com/NervJS/taro/commit/af71480)), closes [#4203](https://github.com/NervJS/taro/issues/4203)
* **transformer:** 快应用循环中判断内置组件条件遗漏 ([21c70ef](https://github.com/NervJS/taro/commit/21c70ef))
* **with-weapp:** 加入测试 ([11d964b](https://github.com/NervJS/taro/commit/11d964b))
* h5端增加preval支持, close [#4219](https://github.com/NervJS/taro/issues/4219) ([5472900](https://github.com/NervJS/taro/commit/5472900))



<a name="1.3.14"></a>
## [1.3.14](https://github.com/NervJS/taro/compare/v1.3.13...v1.3.14) (2019-08-19)


### Bug Fixes

* **cli:** prepublish 创建测试模板时不纠正 _gitignore 等文件。fix [#4081](https://github.com/NervJS/taro/issues/4081) ([38b84dd](https://github.com/NervJS/taro/commit/38b84dd))
* **cli:** taro doctor 使用 typescript-eslint/parser ([093133a](https://github.com/NervJS/taro/commit/093133a)), closes [#3598](https://github.com/NervJS/taro/issues/3598) [#4161](https://github.com/NervJS/taro/issues/4161)
* **cli:** taroize 参数传递错误 ([#4168](https://github.com/NervJS/taro/issues/4168)) ([04c4d0a](https://github.com/NervJS/taro/commit/04c4d0a))
* **cli:** 修复 windows 创建模板时路径问题，fix [#4196](https://github.com/NervJS/taro/issues/4196) ([ba32828](https://github.com/NervJS/taro/commit/ba32828))
* **cli:** 创建页面时模板不存在则先拉取模板，fix [#4106](https://github.com/NervJS/taro/issues/4106) ([c79ef23](https://github.com/NervJS/taro/commit/c79ef23))
* **cli:** 快应用支持 copy sign 文件，close [#4079](https://github.com/NervJS/taro/issues/4079) ([c363559](https://github.com/NervJS/taro/commit/c363559))
* **cli:** 路径替换 extname 使用更严谨的正则去 replace。fix [#4148](https://github.com/NervJS/taro/issues/4148) ([58f9829](https://github.com/NervJS/taro/commit/58f9829))
* **mobx:** 修改 observer typing ([489001e](https://github.com/NervJS/taro/commit/489001e))
* **taro:** 增加 Map polyfill ([985eadf](https://github.com/NervJS/taro/commit/985eadf))
* **taro:** 缺少 Hooks 函数导出 ([a8211d3](https://github.com/NervJS/taro/commit/a8211d3))
* **taro:** 避免直接调用 pxTransform 函数报错 ([309627d](https://github.com/NervJS/taro/commit/309627d))
* **taro-cli:** 小程序解析 npm 中的 json 引用需直接替换为 json 值，close [#4164](https://github.com/NervJS/taro/issues/4164) ([4443ee0](https://github.com/NervJS/taro/commit/4443ee0))
* **taro-quickapp:** 变量使用错误 ([5bb14fb](https://github.com/NervJS/taro/commit/5bb14fb))
* **taro-quickapp:** 快应用支持 useDidShow/useDidHide/useRouter 等 Hook API ([2254b8b](https://github.com/NervJS/taro/commit/2254b8b))
* **taro-weapp/qq/tt/alipay:** 修复 $componentType 错误，fix [#4123](https://github.com/NervJS/taro/issues/4123) ([a6e31b5](https://github.com/NervJS/taro/commit/a6e31b5))
* **transformer:** &emsp;/&ensp 解析为空格 ([8280ec1](https://github.com/NervJS/taro/commit/8280ec1))
* **transformer:** context 传入 null 无法解构，close [#3910](https://github.com/NervJS/taro/issues/3910) ([d795d45](https://github.com/NervJS/taro/commit/d795d45))
* **transformer:** h5 不需要调用 render props 编译 ([0de5870](https://github.com/NervJS/taro/commit/0de5870)), closes [#4180](https://github.com/NervJS/taro/issues/4180) [#4021](https://github.com/NervJS/taro/issues/4021)
* **transformer:** hooks里return null会被解析成 jsx ([15c6e6a](https://github.com/NervJS/taro/commit/15c6e6a)), closes [#4073](https://github.com/NervJS/taro/issues/4073)
* **transformer:** typescript 无法使用类属性函数，close [#4159](https://github.com/NervJS/taro/issues/4159) ([f26ec37](https://github.com/NervJS/taro/commit/f26ec37))
* **transformer:** 函数式组件使用 render props 问题 ([cea3579](https://github.com/NervJS/taro/commit/cea3579)), closes [#4180](https://github.com/NervJS/taro/issues/4180)
* **transformer:** 小程序 slot 统一用 view 包裹，close [#4162](https://github.com/NervJS/taro/issues/4162) ([fb9c769](https://github.com/NervJS/taro/commit/fb9c769))
* **transformer:** 当 iterators 为赋值表达式也需要用 $original 替换 ([95303e9](https://github.com/NervJS/taro/commit/95303e9)), closes [#4174](https://github.com/NervJS/taro/issues/4174)
* **transformer:** 枚举条件渲染编译错误，close [#4062](https://github.com/NervJS/taro/issues/4062) ([af495de](https://github.com/NervJS/taro/commit/af495de))
* **transformer:** 转换所有名为 wx 的引用型标识符，close [#3953](https://github.com/NervJS/taro/issues/3953) ([8157ed9](https://github.com/NervJS/taro/commit/8157ed9))
* **transformer-wx:** 快应用的组件最外层容器不能有 if 判断，需要包一层 ([4ffec26](https://github.com/NervJS/taro/commit/4ffec26))
* **utils:** shallow equal 先判断是否为对象 ([7f67151](https://github.com/NervJS/taro/commit/7f67151))
* **with-weapp:** observer 在组件载入时需要执行一次 ([2235c54](https://github.com/NervJS/taro/commit/2235c54)), closes [#4054](https://github.com/NervJS/taro/issues/4054)


### Features

* **cli:** cli的api支持创建项目后不安装依赖 ([07553ed](https://github.com/NervJS/taro/commit/07553ed))
* **cli:** 快应用支持新 props 系统 ([152da05](https://github.com/NervJS/taro/commit/152da05))
* **taro:** 增加 useDidShow/useDidHide hooks ([3f47153](https://github.com/NervJS/taro/commit/3f47153))
* **taro:** 增加 usePullDownRefresh/useReachBottom/usePageScroll/useResize/useShareAppMessage/useTabItemTap/useRouter hooks ([ba91cb9](https://github.com/NervJS/taro/commit/ba91cb9))
* **taro-alipay:** 补全Button组件的类型定义 ([#4187](https://github.com/NervJS/taro/issues/4187)) ([ebd12b8](https://github.com/NervJS/taro/commit/ebd12b8))
* **taro-h5:** H5 端支持 useDidShow/useDidHide/usePullDownRefresh 等 Hooks API ([45db749](https://github.com/NervJS/taro/commit/45db749))
* **taro-quickapp:** 快应用支持 componentWillPreload 和 this.$preload ([698bf6d](https://github.com/NervJS/taro/commit/698bf6d))
* **taro-quickapp:** 快应用支持 hooks ([c8d565f](https://github.com/NervJS/taro/commit/c8d565f))
* **taro-quickapp:** 快应用新 props 系统支持改造 ([78a4228](https://github.com/NervJS/taro/commit/78a4228))
* **taroize:** 插件保留原组件名 ([eb0910d](https://github.com/NervJS/taro/commit/eb0910d))
* **transformer:** 快应用加入新 props 系统 ([9d23d64](https://github.com/NervJS/taro/commit/9d23d64))
* **transformer:** 支持 useRef 和 createRef 创建的 ref ([d862e1e](https://github.com/NervJS/taro/commit/d862e1e)), closes [#3945](https://github.com/NervJS/taro/issues/3945)



<a name="1.3.13"></a>
## [1.3.13](https://github.com/NervJS/taro/compare/v1.3.12...v1.3.13) (2019-08-12)


### Bug Fixes

* **alipay:** 添加获取会员信息api ([#4145](https://github.com/NervJS/taro/issues/4145)) ([c8563cd](https://github.com/NervJS/taro/commit/c8563cd))
* **babel-plugin-transform-taroapi:** 修复h5 Component未定义的问题 ([2e25f97](https://github.com/NervJS/taro/commit/2e25f97))
* **babel-plugin-transform-taroapi:** 修复了页面中存在重命名api时编译报错的问题, fix [#4024](https://github.com/NervJS/taro/issues/4024) ([6e7f2ab](https://github.com/NervJS/taro/commit/6e7f2ab))
* **cli:** taro create 命令用法提示修改 ([77baeac](https://github.com/NervJS/taro/commit/77baeac))
* **cli:** 修复因缺少 eslint-plugin-react-hooks 包导致 taro doctor 报错的问题，close [#4083](https://github.com/NervJS/taro/issues/4083) ([b1db5fd](https://github.com/NervJS/taro/commit/b1db5fd))
* **cli:** 快应用不支持navigationStyle，close [#4077](https://github.com/NervJS/taro/issues/4077) ([715fd3c](https://github.com/NervJS/taro/commit/715fd3c))
* **components:** 修复快应用 Image 组件问题 (close [#4067](https://github.com/NervJS/taro/issues/4067)) ([6b9a1ef](https://github.com/NervJS/taro/commit/6b9a1ef))
* **components:** 修复快应用组件属性报错问题 ([c071797](https://github.com/NervJS/taro/commit/c071797))
* **h5:** request的get请求数据为复杂结构不能正确发送的问题 ([1f51650](https://github.com/NervJS/taro/commit/1f51650))
* **h5:** 修复h5下onPullToRefresh缺少loading动画 ([c967b81](https://github.com/NervJS/taro/commit/c967b81))
* **redux:** 修复小程序 redux 没有取消注册 stateListener 的问题 ([5e0cb12](https://github.com/NervJS/taro/commit/5e0cb12))
* **rn:**  使用 require 写法引入样式不编译 ([39334c6](https://github.com/NervJS/taro/commit/39334c6))
* **rn:** [RN]Taro.uploadFile返回的不是Promise close [#4090](https://github.com/NervJS/taro/issues/4090) ([203eafd](https://github.com/NervJS/taro/commit/203eafd))
* **rn:** React-Native工程启动报错 close [#4082](https://github.com/NervJS/taro/issues/4082) ([941a3c2](https://github.com/NervJS/taro/commit/941a3c2))
* **router:** router内对localstorage的操作加上了try..catch ([a68c5d9](https://github.com/NervJS/taro/commit/a68c5d9))
* **taro-alipay:** Taro.getScreenBrightness 在支付宝小程序下有差异修复，close [#4146](https://github.com/NervJS/taro/issues/4146) ([8862684](https://github.com/NervJS/taro/commit/8862684))
* **taro-components:** 修复circular为true却不会循环播放的问题 ([6db21b7](https://github.com/NervJS/taro/commit/6db21b7))
* **taro-h5:** vibrate异常修复 ([#4113](https://github.com/NervJS/taro/issues/4113)) ([e234b36](https://github.com/NervJS/taro/commit/e234b36))
* **taro-h5:** 修复chooseImage生成的blob对象缺少类型的问题 ([b31fdc0](https://github.com/NervJS/taro/commit/b31fdc0))
* **taro-quickapp:** 页面需暴露 onRefresh 函数，close [#4078](https://github.com/NervJS/taro/issues/4078) ([8943efa](https://github.com/NervJS/taro/commit/8943efa))
* **taro-tt:** ref绑定报错 ([#4120](https://github.com/NervJS/taro/issues/4120)) ([283f448](https://github.com/NervJS/taro/commit/283f448))
* **taroize:** 修复插件usingComonent路径 plugin:// 开头转换报错 ([bc200e1](https://github.com/NervJS/taro/commit/bc200e1))
* **transformer:** 函数式组件找不到第三方组件声明，close [#4055](https://github.com/NervJS/taro/issues/4055) ([284e59d](https://github.com/NervJS/taro/commit/284e59d))


### Features

* **taro-components:** camera 组件增加 onInitDone 回调，close [#4139](https://github.com/NervJS/taro/issues/4139) ([8007465](https://github.com/NervJS/taro/commit/8007465))
* 支持canvas组件 ([d98012c](https://github.com/NervJS/taro/commit/d98012c))
* **h5:** 使scroll-view组件在h5中支持scrollIntoView属性 ([a1b1698](https://github.com/NervJS/taro/commit/a1b1698))
* **rn:** 优化插入 React Import 代码的判断逻辑 ([e2cb224](https://github.com/NervJS/taro/commit/e2cb224))
* **taro:** 补全CameraContext的类型定义 ([#4080](https://github.com/NervJS/taro/issues/4080)) ([1268cb1](https://github.com/NervJS/taro/commit/1268cb1))
* **taro-components:** 为CanvasProps新增属性定义type, 支持微信小程序使用webgl的额外props ([#4044](https://github.com/NervJS/taro/issues/4044)) ([80b8afb](https://github.com/NervJS/taro/commit/80b8afb))



<a name="1.3.12"></a>
## [1.3.12](https://github.com/NervJS/taro/compare/v1.3.11...v1.3.12) (2019-08-05)


### Bug Fixes

* **cli:** default 模板把'.'开头文件改为'_'开头，close [#3944](https://github.com/NervJS/taro/issues/3944) ([91e696c](https://github.com/NervJS/taro/commit/91e696c))
* **cli:** doctor 增加 h5.esnextModules 字段检测，close [#4029](https://github.com/NervJS/taro/issues/4029) ([95a22d4](https://github.com/NervJS/taro/commit/95a22d4))
* **cli:** 修正快应用编译时组件路径计算 ([b8a9582](https://github.com/NervJS/taro/commit/b8a9582))
* **cli:** 编译 RN 未等待编译完成就执行之后的操作 ([#4060](https://github.com/NervJS/taro/issues/4060)) ([c106408](https://github.com/NervJS/taro/commit/c106408))
* **hooks:** 修复 Taro.memo 会阻止组件内部 state 发生变化的更新的问题 ([8a99dd4](https://github.com/NervJS/taro/commit/8a99dd4))
* **taro:** fix typings, close [#3908](https://github.com/NervJS/taro/issues/3908) ([f73ecc2](https://github.com/NervJS/taro/commit/f73ecc2))
* **taro:** showModal中的title参数不是必须 ([#4035](https://github.com/NervJS/taro/issues/4035)) ([4216bae](https://github.com/NervJS/taro/commit/4216bae))
* **taro:** Taro.memo 使用 shallowEqual 判断新旧 props ([d5d3733](https://github.com/NervJS/taro/commit/d5d3733))
* **taro:** 直接引用 shallow-equal 路径进行编译 ([2ef7947](https://github.com/NervJS/taro/commit/2ef7947))
* **taro-redux:** redux 兼容 getDerivedStateFromProps，close [#3929](https://github.com/NervJS/taro/issues/3929) ([4d950d0](https://github.com/NervJS/taro/commit/4d950d0))
* **transformer:** 不以 render 开头的 JSX 函数没有重命名 ([2fc083b](https://github.com/NervJS/taro/commit/2fc083b)), closes [#4036](https://github.com/NervJS/taro/issues/4036)
* **transformer:** 多层循环不写 index 会生成相同的匿名 index ([13585cf](https://github.com/NervJS/taro/commit/13585cf)), closes [#4011](https://github.com/NervJS/taro/issues/4011)
* **transformer:** 如果 if 表达式得 tester 是复杂表达式需要生成匿名变量 ([071ce65](https://github.com/NervJS/taro/commit/071ce65)), closes [#4017](https://github.com/NervJS/taro/issues/4017)
* **tt:** ref绑定时态不正确的问题 ([29fdc3c](https://github.com/NervJS/taro/commit/29fdc3c))
* **tt:** 头条小程序  componentDidMount 触发时机调整 ([ea31a2a](https://github.com/NervJS/taro/commit/ea31a2a))


### Features

* 补全FC类型定义，新增类型定义SFC，setPageInfo ([#4031](https://github.com/NervJS/taro/issues/4031)) ([eaa0eae](https://github.com/NervJS/taro/commit/eaa0eae))
* **eslint:** 加入 hooks eslint 规则, close [#3598](https://github.com/NervJS/taro/issues/3598) ([bbe91e5](https://github.com/NervJS/taro/commit/bbe91e5))



<a name="1.3.11"></a>
## [1.3.11](https://github.com/NervJS/taro/compare/v1.3.10...v1.3.11) (2019-07-30)


### Bug Fixes

* **cli:** 修复部分场景 wx 不能替换成 Taro 的问题，close [#3941](https://github.com/NervJS/taro/issues/3941) ([8153221](https://github.com/NervJS/taro/commit/8153221))
* **cli:** 修正对快应用包名的判断，close [#4005](https://github.com/NervJS/taro/issues/4005) ([49ab3e0](https://github.com/NervJS/taro/commit/49ab3e0))
* **component-qa:** 调整快应用组件入参 ([a58f2ec](https://github.com/NervJS/taro/commit/a58f2ec))
* **components-rn:** Swiper index 无法动态更新 fix [#2922](https://github.com/NervJS/taro/issues/2922) ([d46c2d7](https://github.com/NervJS/taro/commit/d46c2d7))
* **eslint:** 修复render props传入单个JSX元素或箭头函数报错的问题 ([#3906](https://github.com/NervJS/taro/issues/3906)) ([2d3bd05](https://github.com/NervJS/taro/commit/2d3bd05))
* **eslint:** 组件方法按最佳实践推荐的顺序书写，close [#3914](https://github.com/NervJS/taro/issues/3914) ([66000eb](https://github.com/NervJS/taro/commit/66000eb))
* **h5:** 修复taro-h5 main字段的错误 ([d5db7f4](https://github.com/NervJS/taro/commit/d5db7f4))
* **rn:** [RN]Taro.showActionSheet返回不是一个promise close [#3113](https://github.com/NervJS/taro/issues/3113) ([a26420b](https://github.com/NervJS/taro/commit/a26420b))
* **rn:** [RN]Taro.showModal返回的不是个Promise  close [#3203](https://github.com/NervJS/taro/issues/3203) ([e078572](https://github.com/NervJS/taro/commit/e078572))
* **rn:** 添加 pxTransform 的响应式适配 ([7098dc0](https://github.com/NervJS/taro/commit/7098dc0))
* **router-rn:** taro-router-rn 构建失败 ([99f78c5](https://github.com/NervJS/taro/commit/99f78c5))
* **taro:** 编译成快应用时支持自定义titleBar ([a25f81f](https://github.com/NervJS/taro/commit/a25f81f))
* **taro-weapp:** 修复state上空对象变为有数据时，子组件不会去setData ([6a3e69a](https://github.com/NervJS/taro/commit/6a3e69a))
* **taroize:** 在 string props  直接写双引号报错，close [#3913](https://github.com/NervJS/taro/issues/3913) ([a1913f5](https://github.com/NervJS/taro/commit/a1913f5))
* **transformer:**  事件处理传入普通成员表达式处理错误，close [#3923](https://github.com/NervJS/taro/issues/3923) ([affe845](https://github.com/NervJS/taro/commit/affe845))
* **transformer:** objectExpression property key'type ([#3932](https://github.com/NervJS/taro/issues/3932)) ([c6f587c](https://github.com/NervJS/taro/commit/c6f587c))
* **transformer:** propsManager 不再生成变量，close [#3914](https://github.com/NervJS/taro/issues/3914) ([98c2f86](https://github.com/NervJS/taro/commit/98c2f86))
* **transformer:** render 函数顺序靠前导致找不到当前类其它的 JSX 函数 ([cd84e67](https://github.com/NervJS/taro/commit/cd84e67)), closes [#3966](https://github.com/NervJS/taro/issues/3966)
* **transformer:** 某些情况循环中使用 stopPropagation 报错 ([5b02527](https://github.com/NervJS/taro/commit/5b02527)), closes [#3946](https://github.com/NervJS/taro/issues/3946)
* **transformer:** 解析 wx:else 内部的条件表达式错误，close [#3964](https://github.com/NervJS/taro/issues/3964) ([2be5032](https://github.com/NervJS/taro/commit/2be5032))


### Features

* **cli:** h5编译时自动修改[@tarojs](https://github.com/tarojs)/taro-h5 ([babbf54](https://github.com/NervJS/taro/commit/babbf54))
* **h5:** 提供index.cjs.js供require使用 ([98fd51a](https://github.com/NervJS/taro/commit/98fd51a))
* **rn:** add RN API  TabBarRedDot and TabBarBadge ([cf798bf](https://github.com/NervJS/taro/commit/cf798bf))
* **rn:** app 前后台切换时调用 componentDidShow 和 componentDidHide ([2bbccbc](https://github.com/NervJS/taro/commit/2bbccbc))
* **rn:** 从 Taro 中暴露一些列 react api ([112d32b](https://github.com/NervJS/taro/commit/112d32b))
* **taro:** 增加 onAudioInterruptionEnd api，close [#3961](https://github.com/NervJS/taro/issues/3961) ([7615639](https://github.com/NervJS/taro/commit/7615639))
* add babel plugin preval ([#3867](https://github.com/NervJS/taro/issues/3867)) ([4c6a668](https://github.com/NervJS/taro/commit/4c6a668))
* **rn:** add RN API setTabBarItem ([fb9c37a](https://github.com/NervJS/taro/commit/fb9c37a))
* 校验华为原子化服务配置文件ability.xml中的intent和parameter合法性 ([#3938](https://github.com/NervJS/taro/issues/3938)) ([95ef669](https://github.com/NervJS/taro/commit/95ef669))



<a name="1.3.10"></a>
## [1.3.10](https://github.com/NervJS/taro/compare/v1.3.9...v1.3.10) (2019-07-19)


### Bug Fixes

* **cli:** cli 创建页面如果没有指定 pageName 则报错 & 完善模板文档 ([9a9be57](https://github.com/NervJS/taro/commit/9a9be57))
* **cli:** cli 模板修复问题、调优及补充文档 ([a4ac538](https://github.com/NervJS/taro/commit/a4ac538))
* **cli:** 修复 cli 包发布文件不全的问题 ([ef65a09](https://github.com/NervJS/taro/commit/ef65a09))
* **cli:** 修复 css modules bug ([b4fcd8e](https://github.com/NervJS/taro/commit/b4fcd8e))
* **cli:** 修复 taro convert 转换报错 ([99a8c4d](https://github.com/NervJS/taro/commit/99a8c4d))
* **cli:** 修正src硬编码的问题 ([caf64da](https://github.com/NervJS/taro/commit/caf64da))
* **cli:** 延后了alias的处理 ([929b100](https://github.com/NervJS/taro/commit/929b100))
* **cli:** 排除不需要替换 Taro 基础框架引用的包，close [#3773](https://github.com/NervJS/taro/issues/3773) ([da3a3ce](https://github.com/NervJS/taro/commit/da3a3ce))
* **cli:** 确保创建项目健壮性 ([a2f684d](https://github.com/NervJS/taro/commit/a2f684d))
* **eslint:** render props 可以在 props 中传入函数 ([af2bf64](https://github.com/NervJS/taro/commit/af2bf64)), closes [#3798](https://github.com/NervJS/taro/issues/3798)
* **index.d.ts:** 修正 FunctionComponent 的类型定义 ([#3847](https://github.com/NervJS/taro/issues/3847)) ([7e328c7](https://github.com/NervJS/taro/commit/7e328c7))
* **mobx:** 修复注入 mobx 后，原有 props 属性无法获取的问题 ([#3877](https://github.com/NervJS/taro/issues/3877)) ([f5e7996](https://github.com/NervJS/taro/commit/f5e7996))
* **router:** 修复router跳转后不恢复滚动位置的问题 ([2d17268](https://github.com/NervJS/taro/commit/2d17268))
* **taro:** memo 只需要判断 props ([9818c7d](https://github.com/NervJS/taro/commit/9818c7d))
* **taro:** useState/Reducer 的 setState 可以无视 SCU 更新 ([584510f](https://github.com/NervJS/taro/commit/584510f))
* **taro-cli:** 添加 taro update 更新项目时遗漏的两个 stylelint 包 ([#3806](https://github.com/NervJS/taro/issues/3806)) ([b5cc6df](https://github.com/NervJS/taro/commit/b5cc6df))
* **taro-components-rn:** 修复Input组件不支持onChange事件，没有保持端一致性 ([b0f1c3a](https://github.com/NervJS/taro/commit/b0f1c3a))
* **transformer:** propsManager.set 不再设置对象字面量 ([40535ee](https://github.com/NervJS/taro/commit/40535ee)), closes [#3721](https://github.com/NervJS/taro/issues/3721)
* **transformer:** slot 内的 wx:key 没有呗替换为 key ([409da2c](https://github.com/NervJS/taro/commit/409da2c)), closes [#3738](https://github.com/NervJS/taro/issues/3738)
* **transformer:** wx:else 不能和 wx:for 同时存在一个标签 ([0e32548](https://github.com/NervJS/taro/commit/0e32548)), closes [#3813](https://github.com/NervJS/taro/issues/3813)
* **transformer:** 第三方组件绑定事件可以用 bind，close [#3859](https://github.com/NervJS/taro/issues/3859) ([896832d](https://github.com/NervJS/taro/commit/896832d))
* **transformer:** 类函数式组件返回的 state 应该从 this.state取值 ([5ec9679](https://github.com/NervJS/taro/commit/5ec9679)), closes [#3813](https://github.com/NervJS/taro/issues/3813)
* **transformer:** 误删 JSX 声明，close [#3825](https://github.com/NervJS/taro/issues/3825) ([120d754](https://github.com/NervJS/taro/commit/120d754))
* **types:** 新增FunctionComponent的options属性 ([#3874](https://github.com/NervJS/taro/issues/3874)) ([58a0e2f](https://github.com/NervJS/taro/commit/58a0e2f))


### Features

* **rn:** add RN API file demo ([98f6a86](https://github.com/NervJS/taro/commit/98f6a86))
* **rn:** add rn map component ([ba836e8](https://github.com/NervJS/taro/commit/ba836e8))
* update screen demo ([a5afed6](https://github.com/NervJS/taro/commit/a5afed6))
* **typings:** SocketTask 中字段的类型错误，另外缺少两个字段。 ([#3781](https://github.com/NervJS/taro/issues/3781)) ([7b637a7](https://github.com/NervJS/taro/commit/7b637a7))
* 补全taro-cli中与quickapp/qq相关的命令和依赖 ([#3786](https://github.com/NervJS/taro/issues/3786)) ([60115d5](https://github.com/NervJS/taro/commit/60115d5))



<a name="1.3.9"></a>
## [1.3.9](https://github.com/NervJS/taro/compare/v1.3.8...v1.3.9) (2019-07-12)


### Bug Fixes

* **cli:** h5端的alias处理支持跨平台组件, fix [#3791](https://github.com/NervJS/taro/issues/3791) ([34136df](https://github.com/NervJS/taro/commit/34136df))
* **cli:** 快应用页面支持增加自定义配置 ([5f18760](https://github.com/NervJS/taro/commit/5f18760))
* **components-qa:** 修复快应用 ScrollView  组件报错，close [#3757](https://github.com/NervJS/taro/issues/3757) ([297841e](https://github.com/NervJS/taro/commit/297841e))
* **components-qa:** 修复快应用ScrollView组件事件分发错误 ([4391370](https://github.com/NervJS/taro/commit/4391370))
* **rn:** [RN]Taro.getCurrentPages方法不存在 close [#3224](https://github.com/NervJS/taro/issues/3224) ([3021729](https://github.com/NervJS/taro/commit/3021729))
* **rn:** media export ([fedad06](https://github.com/NervJS/taro/commit/fedad06))
* **rn:** typescript type error ([710ece1](https://github.com/NervJS/taro/commit/710ece1))
* **rn:** 完善 RN 录音的 API，使其兼容低版本 RN ([7e6d90a](https://github.com/NervJS/taro/commit/7e6d90a))
* **taro-cli:** 不重复设置 buildData。fix [#3605](https://github.com/NervJS/taro/issues/3605) ([e2ccfa3](https://github.com/NervJS/taro/commit/e2ccfa3))
* **taro-cli:** 修复模板下载问题。 ([3de1270](https://github.com/NervJS/taro/commit/3de1270))
* **taro-quickapp:** 修复 windows 下编译路由传参问题 ([1a4f375](https://github.com/NervJS/taro/commit/1a4f375))
* **taro-quickapp:** 兼容各种事件绑定传参情况 ([6cda94c](https://github.com/NervJS/taro/commit/6cda94c))
* **taro-quickapp:** 让页面路由传参获取更具兼容性 ([730e88b](https://github.com/NervJS/taro/commit/730e88b))
* **taroize:** 生命周期函数使用普通类函数，close [#3793](https://github.com/NervJS/taro/issues/3793) ([eb7931c](https://github.com/NervJS/taro/commit/eb7931c))
* **transformer:** render props 多次编译报错，close [#3798](https://github.com/NervJS/taro/issues/3798) ([525d278](https://github.com/NervJS/taro/commit/525d278))
* **transformer:** 快应用循环 index 和 item 的位置错乱 ([064c507](https://github.com/NervJS/taro/commit/064c507))
* **transformer:** 每次都还原调用方传过来的参数， close [#3760](https://github.com/NervJS/taro/issues/3760) ([65483aa](https://github.com/NervJS/taro/commit/65483aa))
* **with-weapp:** 当第二个参数没有传入时无法监听 props 变化 ([61ac83c](https://github.com/NervJS/taro/commit/61ac83c)), closes [#3793](https://github.com/NervJS/taro/issues/3793)


### Features

* **cli:** cli 增加 taro config 相关命令 ([c806c58](https://github.com/NervJS/taro/commit/c806c58))
* **cli:** taro 项目模板抽离到远程获取 ([ac347f7](https://github.com/NervJS/taro/commit/ac347f7))
* **rn:**  add api downloadFile ([0dbf3b6](https://github.com/NervJS/taro/commit/0dbf3b6))
* **rn:** add API Video ([c74bf26](https://github.com/NervJS/taro/commit/c74bf26))
* **rn:** add DeviceMotion 相关的 api ([cddab98](https://github.com/NervJS/taro/commit/cddab98))
* **rn:** add record ([dd036ef](https://github.com/NervJS/taro/commit/dd036ef))
* **rn:** add RN API ([4ba3baf](https://github.com/NervJS/taro/commit/4ba3baf))
* **rn:** add RN api  getLocation ([882fd0d](https://github.com/NervJS/taro/commit/882fd0d))
* **rn:** add serval RN API ([56882a7](https://github.com/NervJS/taro/commit/56882a7))
* **rn:** add uploadFile ([ccc6a89](https://github.com/NervJS/taro/commit/ccc6a89))
* **rn:** update RN API Vedio demo ([3bcd301](https://github.com/NervJS/taro/commit/3bcd301))
* **rn:** 添加 getLocation ([2d5f470](https://github.com/NervJS/taro/commit/2d5f470))
* **taro-cli:** creator 的 sourceRoot 可以从外部传入 ([ceab89d](https://github.com/NervJS/taro/commit/ceab89d))
* update RN API Audio Demo ([0cd5636](https://github.com/NervJS/taro/commit/0cd5636))
* **taro-cli:** 模板支持按 url 下载 ([61b9af1](https://github.com/NervJS/taro/commit/61b9af1))



<a name="1.3.8"></a>
## [1.3.8](https://github.com/NervJS/taro/compare/v1.3.7...v1.3.8) (2019-07-10)


### Bug Fixes

* **cli:** 修复 windows 下判断 Taro 包路径，close [#3755](https://github.com/NervJS/taro/issues/3755) ([5c1d7ad](https://github.com/NervJS/taro/commit/5c1d7ad))
* **cli:** 修正对是否是 Taro 组件的判断，close [#3751](https://github.com/NervJS/taro/issues/3751) ([0db4742](https://github.com/NervJS/taro/commit/0db4742))
* **cli:** 改进 Taro 组件判断方式 ([ccaad35](https://github.com/NervJS/taro/commit/ccaad35))
* **h5:** 修复 chooseImage 无法两次选择相同图片 fix [#3747](https://github.com/NervJS/taro/issues/3747) ([#3748](https://github.com/NervJS/taro/issues/3748)) ([b7a327b](https://github.com/NervJS/taro/commit/b7a327b))
* **rn:** RN: Android 下 Taro.navigateTo 某个页面后，标题没有居中 close [#3678](https://github.com/NervJS/taro/issues/3678) ([81d90ac](https://github.com/NervJS/taro/commit/81d90ac))



<a name="1.3.7"></a>
## [1.3.7](https://github.com/NervJS/taro/compare/v1.3.6...v1.3.7) (2019-07-10)


### Bug Fixes

* **cli:** h5端支持alias到src下的目录了, fix [#2866](https://github.com/NervJS/taro/issues/2866) ([3e4e89c](https://github.com/NervJS/taro/commit/3e4e89c))
* **components:** 修复快应用 WebView 问题。 close [#3451](https://github.com/NervJS/taro/issues/3451), [#3724](https://github.com/NervJS/taro/issues/3724) ([397b017](https://github.com/NervJS/taro/commit/397b017))
* **taro:** 为 Taro.request 类型定义添加 abort 方法，完善注释 [#3654](https://github.com/NervJS/taro/issues/3654) ([#3715](https://github.com/NervJS/taro/issues/3715)) ([b007a49](https://github.com/NervJS/taro/commit/b007a49))
* **taro-alipay:** 修复支付宝分包问题。close [#3445](https://github.com/NervJS/taro/issues/3445) ([d904a79](https://github.com/NervJS/taro/commit/d904a79))
* **taro-alipay:** 修复支付宝分包问题。close [#3703](https://github.com/NervJS/taro/issues/3703) ([2b8f024](https://github.com/NervJS/taro/commit/2b8f024))
* **taro-quickapp:** 快应用获取页面参数时增加容错 ([12c9998](https://github.com/NervJS/taro/commit/12c9998))
* **taro-rn:** 修复showLoading没有使用title属性 ([8d0b1df](https://github.com/NervJS/taro/commit/8d0b1df))
* **taro-router-rn:** 修复RN端触发不了下拉刷新事件 ([dbfabf2](https://github.com/NervJS/taro/commit/dbfabf2))
* **taro-utils:** 优化 Object.is 判断 ([49bef9e](https://github.com/NervJS/taro/commit/49bef9e))
* **transformer:** opt.isNormal 不需要走自定义 babel 插件 ([0945248](https://github.com/NervJS/taro/commit/0945248)), closes [#3731](https://github.com/NervJS/taro/issues/3731)
* **transformer:** 修复 0945248e2faf2a2d0f7fcf5f0e52473c85c5d073 重复添加插件 ([2b8180b](https://github.com/NervJS/taro/commit/2b8180b))


### Features

* **cli:** transformer 增加参数 alias ([2890b8c](https://github.com/NervJS/taro/commit/2890b8c))
* **cli:** 优化对快应用系统包的判断与提醒 ([c9ae6b1](https://github.com/NervJS/taro/commit/c9ae6b1))
* **cli:** 支持对 npm 包中文件进行转换 ([49a97e9](https://github.com/NervJS/taro/commit/49a97e9))



<a name="1.3.6"></a>
## [1.3.6](https://github.com/NervJS/taro/compare/v1.3.5...v1.3.6) (2019-07-08)


### Bug Fixes

* **cli:** 快应用支持多端组件，close [#3685](https://github.com/NervJS/taro/issues/3685) ([adf68af](https://github.com/NervJS/taro/commit/adf68af))
* **component:** 修复 Swiper 组件指示标初始为 false ，更新不显示问题, close [#3676](https://github.com/NervJS/taro/issues/3676) ([0ecb399](https://github.com/NervJS/taro/commit/0ecb399))
* **components:**  H5 不支持 camera 组件，修改文档 ([697c74b](https://github.com/NervJS/taro/commit/697c74b))
* **h5:** Page组件增加$component对象，与微信小程序统一 ([cd54061](https://github.com/NervJS/taro/commit/cd54061))
* **quickapp:** 快应用支持 Block 标签，close [#3686](https://github.com/NervJS/taro/issues/3686) ([2dfeafe](https://github.com/NervJS/taro/commit/2dfeafe))
* **router:** 解决getCurrentPages有时候只能获取长度但没有内容的问题 ([#3669](https://github.com/NervJS/taro/issues/3669)) ([a88225e](https://github.com/NervJS/taro/commit/a88225e))
* **taro:** interceptor 暴露 request 返回的 requestTask。close [#3654](https://github.com/NervJS/taro/issues/3654) ([2ada5a2](https://github.com/NervJS/taro/commit/2ada5a2))
* **taro:** 修复 this.$router 类型错误 close [#3650](https://github.com/NervJS/taro/issues/3650) ([#3653](https://github.com/NervJS/taro/issues/3653)) ([557938e](https://github.com/NervJS/taro/commit/557938e))
* **taro-cli:** 添加 json 文件缺失的逗号 ([#3707](https://github.com/NervJS/taro/issues/3707)) ([b6c3be9](https://github.com/NervJS/taro/commit/b6c3be9))
* **taro-quickapp:** 修复快应用 tabBar 图标显示问题 ([81cbdf7](https://github.com/NervJS/taro/commit/81cbdf7))
* **taroize:** 加强对对象扩展运算符的支持，close [#3632](https://github.com/NervJS/taro/issues/3632) ([e3c638e](https://github.com/NervJS/taro/commit/e3c638e))
* **transformer:** 使用 spread/rest 语法生成匿名函数 ([75fc37a](https://github.com/NervJS/taro/commit/75fc37a)), closes [#3577](https://github.com/NervJS/taro/issues/3577)
* **transformer:** 修复 11964f8 对 JSX 属性判断错误，close [#3697](https://github.com/NervJS/taro/issues/3697) ([24e717f](https://github.com/NervJS/taro/commit/24e717f))
* **transformer:** 修复 46604f5 导致 indexKey 没有加入循环中 ([61c54c6](https://github.com/NervJS/taro/commit/61c54c6)), closes [#3665](https://github.com/NervJS/taro/issues/3665)
* **transformer:** 匿名变量生成位置错误 ([c3086ae](https://github.com/NervJS/taro/commit/c3086ae))
* **transformer:** 如果循环在三元表达式中没有被 JSX 包裹住解析出错 ([f879bf6](https://github.com/NervJS/taro/commit/f879bf6)), closes [#3646](https://github.com/NervJS/taro/issues/3646)


### Features

* **mobx:** 提供 Mobx Hooks API ([#3599](https://github.com/NervJS/taro/issues/3599)) ([3a3bbdb](https://github.com/NervJS/taro/commit/3a3bbdb))
* **quickapp:** 新增快应用的一些 api 及组件 ([ddf279b](https://github.com/NervJS/taro/commit/ddf279b))
* **taroize:** 生命周期函数支持 async/await, close [#3477](https://github.com/NervJS/taro/issues/3477) ([c7b76ab](https://github.com/NervJS/taro/commit/c7b76ab))
* **transformer:** 支持普通函数表达式定义组件，close [#3682](https://github.com/NervJS/taro/issues/3682) ([e16e671](https://github.com/NervJS/taro/commit/e16e671))



<a name="1.3.5"></a>
## [1.3.5](https://github.com/NervJS/taro/compare/v1.3.4...v1.3.5) (2019-07-03)


### Bug Fixes

* **cli:** 修复项目目录带'src'时编译报错的问题, fix [#3431](https://github.com/NervJS/taro/issues/3431) ([14b135a](https://github.com/NervJS/taro/commit/14b135a))
* **cli:** 小程序用到的静态资源走CDN 和 防止node_modules/xxxx包被taro再次编译的bug ([#3508](https://github.com/NervJS/taro/issues/3508)) ([cdd9c81](https://github.com/NervJS/taro/commit/cdd9c81))
* **cli:** 当页面或组件没有引用样式时生成模板不需要生成插入样式代码 ([3220f5d](https://github.com/NervJS/taro/commit/3220f5d))
* **cli:** 更新快应用 manifest ([b09c4d6](https://github.com/NervJS/taro/commit/b09c4d6))
* **cli:** 更新快应用原生包识别逻辑 ([3cda7bb](https://github.com/NervJS/taro/commit/3cda7bb))
* **cli:** 组件文件不需要插入 taro-page 组件引用 ([c3b6bbe](https://github.com/NervJS/taro/commit/c3b6bbe))
* **components:** 修复 Video 组件 poster 失效问题 close [#3526](https://github.com/NervJS/taro/issues/3526) ([b69232d](https://github.com/NervJS/taro/commit/b69232d))
* **components-qa:** 快应用 tabBar 图片需占位 ([7e7c07e](https://github.com/NervJS/taro/commit/7e7c07e))
* **docs:** 案例中的taro-redux引用路径错误 ([#3522](https://github.com/NervJS/taro/issues/3522)) ([8ae96c2](https://github.com/NervJS/taro/commit/8ae96c2))
* **h5:** h5的chooseImage在count设置为1时取消了multiple属性, fix [#3401](https://github.com/NervJS/taro/issues/3401) ([08aa12d](https://github.com/NervJS/taro/commit/08aa12d))
* **h5:** 修复build模式下h5 api的样式被treeshake掉的问题, fix [#3497](https://github.com/NervJS/taro/issues/3497) ([775c953](https://github.com/NervJS/taro/commit/775c953))
* **h5:** 修复h5 setClipboardData api调用出错的问题, fix [#3539](https://github.com/NervJS/taro/issues/3539) ([e6fe90f](https://github.com/NervJS/taro/commit/e6fe90f))
* **h5:** 修复previewImage的点透问题, fix [#3071](https://github.com/NervJS/taro/issues/3071) ([11a8fd2](https://github.com/NervJS/taro/commit/11a8fd2))
* **movableview.d.ts:** 修正 关于 y 轴和 onVTouchMove 事件注释错误的问题 ([#2924](https://github.com/NervJS/taro/issues/2924)) ([c5fc256](https://github.com/NervJS/taro/commit/c5fc256))
* **rn:** 导出 hooks 相关接口，以解决 RN 端接口未定义问题 ([#3579](https://github.com/NervJS/taro/issues/3579)) ([7ea3f37](https://github.com/NervJS/taro/commit/7ea3f37))
* **router:** 修复设置alias到'/'时出现页面重叠的问题, fix [#3597](https://github.com/NervJS/taro/issues/3597) ([2660b9b](https://github.com/NervJS/taro/commit/2660b9b))
* **taro:** 在memo中增加对state的浅判断 ([#3563](https://github.com/NervJS/taro/issues/3563)) ([19eef47](https://github.com/NervJS/taro/commit/19eef47)), closes [#3527](https://github.com/NervJS/taro/issues/3527)
* **taro-cli:** 尽早设置watch下的NODE_ENV为development ([#3583](https://github.com/NervJS/taro/issues/3583)) ([d9d9f68](https://github.com/NervJS/taro/commit/d9d9f68))
* **taro-quickapp:** 修复事件传参绑定 ([4af3659](https://github.com/NervJS/taro/commit/4af3659))
* **taro-quickapp:** 修复路由传参的问题，close [#3620](https://github.com/NervJS/taro/issues/3620) ([c0c5cb2](https://github.com/NervJS/taro/commit/c0c5cb2))
* **transformer:** 只有在快应用时再删除多余的 $usedState ([fa7c227](https://github.com/NervJS/taro/commit/fa7c227))
* **transformer:** 某些情况解析 ...props 错误，close [#3647](https://github.com/NervJS/taro/issues/3647) ([11964f8](https://github.com/NervJS/taro/commit/11964f8))
* memo对state的判断应该用逻辑或 ([#3600](https://github.com/NervJS/taro/issues/3600)) ([552e868](https://github.com/NervJS/taro/commit/552e868))
* **taro-cli:** 修复小程序端非生产模式下不应用 csso 配置问题 close [#3622](https://github.com/NervJS/taro/issues/3622) ([#3623](https://github.com/NervJS/taro/issues/3623)) ([40cba83](https://github.com/NervJS/taro/commit/40cba83))
* **taro-quickapp:** 快应用属性处理 ([dbc9b6b](https://github.com/NervJS/taro/commit/dbc9b6b))
* **taro-weapp/qq/tt/swan/alipay:** 循环 ref 问题。close [#3455](https://github.com/NervJS/taro/issues/3455) ([975084f](https://github.com/NervJS/taro/commit/975084f))
* **taroize:** catch 事件填空字符串报错 ([dad3ae4](https://github.com/NervJS/taro/commit/dad3ae4))
* **taroize:** 字母集从a-j调整为b-k ([#3569](https://github.com/NervJS/taro/issues/3569)) ([b826b11](https://github.com/NervJS/taro/commit/b826b11))
* **transformer:** children 从 this.props 解构会删除赋值语句 ([260360f](https://github.com/NervJS/taro/commit/260360f))
* **transformer:** 函数式组件支持 bind，close [#3534](https://github.com/NervJS/taro/issues/3534) ([ed361db](https://github.com/NervJS/taro/commit/ed361db))
* **transformer:** 循环中使用对象展开符报错，close [#3547](https://github.com/NervJS/taro/issues/3547) ([527ae89](https://github.com/NervJS/taro/commit/527ae89))
* **transformer:** 循环没有写 return 生成匿名函数错误，close [#3536](https://github.com/NervJS/taro/issues/3536) ([46604f5](https://github.com/NervJS/taro/commit/46604f5))
* **weapp:** 初始 ref 获取改到 didmount 阶段 ([0d2bb53](https://github.com/NervJS/taro/commit/0d2bb53))


### Features

* **cli:** 修复weapp转换项目后Nerv未定义的问题 ([9632436](https://github.com/NervJS/taro/commit/9632436))
* **cli:** 增加对华为原子服务定义文件的规范检查 ([#3571](https://github.com/NervJS/taro/issues/3571)) ([d78ee16](https://github.com/NervJS/taro/commit/d78ee16))
* **cli:** 新版本快应用编译器模块内容调整 ([a51bf63](https://github.com/NervJS/taro/commit/a51bf63))
* **taro-components:** 完善 Form 组件的类型定义 ([#2951](https://github.com/NervJS/taro/issues/2951)) ([16b2613](https://github.com/NervJS/taro/commit/16b2613))
* **taro-quickapp:** 快应用支持设置 tabBar ([0e673ad](https://github.com/NervJS/taro/commit/0e673ad))
* **transformer:** 使用类函数式组件不再要求以 render 开头命名 ([ea1e43e](https://github.com/NervJS/taro/commit/ea1e43e))
* **transformer:** 支持 children 与其它变量同时从 props 中解构 ([b6d1d45](https://github.com/NervJS/taro/commit/b6d1d45)), closes [#3530](https://github.com/NervJS/taro/issues/3530)
* **transformer:** 支持 render props ([eda6750](https://github.com/NervJS/taro/commit/eda6750))
* **typings:** add the type definition of FunctionComponent and Taro.memo ([#3517](https://github.com/NervJS/taro/issues/3517)) ([7c8edd2](https://github.com/NervJS/taro/commit/7c8edd2))
* **weapp:** 把 `shallowEqual` 导出到各程序端 API ([279becb](https://github.com/NervJS/taro/commit/279becb))
* **webpack-runner:** mainFields补上了browser字段, close [#3415](https://github.com/NervJS/taro/issues/3415) ([3ef3d5b](https://github.com/NervJS/taro/commit/3ef3d5b))


### Performance Improvements

* **transformer:** 组件卸载时清理事件订阅 ([7284946](https://github.com/NervJS/taro/commit/7284946))



<a name="1.3.4"></a>
## [1.3.4](https://github.com/NervJS/taro/compare/v1.3.3...v1.3.4) (2019-06-25)


### Bug Fixes

* **transformer:** 在 hooks 会把 return 替换，close [#3469](https://github.com/NervJS/taro/issues/3469) ([beb21f0](https://github.com/NervJS/taro/commit/beb21f0))
* **transformer:** 嵌套循环判断使用上级变量编译错误，close [#3462](https://github.com/NervJS/taro/issues/3462) ([6b525c2](https://github.com/NervJS/taro/commit/6b525c2))
* **transformer:** 自定义组件支持外部类，close [#3080](https://github.com/NervJS/taro/issues/3080) ([96573c1](https://github.com/NervJS/taro/commit/96573c1))
* **weapp:** 修复 extraProps 判断 bug。 ([3288436](https://github.com/NervJS/taro/commit/3288436))
* **weapp:** 修复 mobx 下 extraProps 判断 bug。close [#3513](https://github.com/NervJS/taro/issues/3513) ([3deb1a7](https://github.com/NervJS/taro/commit/3deb1a7))


### Features

* **components-rn:** ScrollView, 支持 FlatList 来代替 ScrollView ([6714e24](https://github.com/NervJS/taro/commit/6714e24))
* **transformer:**  支持在快应用循环中使用匿名函数，[#3495](https://github.com/NervJS/taro/issues/3495) ([0a66dbd](https://github.com/NervJS/taro/commit/0a66dbd))
* **transformer:** 循环中可以直接 return JSX 引用，close [#3504](https://github.com/NervJS/taro/issues/3504) ([38a38ce](https://github.com/NervJS/taro/commit/38a38ce))



<a name="1.3.3"></a>
## [1.3.3](https://github.com/NervJS/taro/compare/v1.3.2...v1.3.3) (2019-06-24)


### Bug Fixes

* **alipay:** 修复在支付宝分包中状态管理工具不可用的问题，fix [#3445](https://github.com/NervJS/taro/issues/3445) ([a6f4c0a](https://github.com/NervJS/taro/commit/a6f4c0a))
* **cli:** 修复快应用编译报错，快应用依赖安装问题 ([15bed06](https://github.com/NervJS/taro/commit/15bed06))
* **cli:** 引入json包含null的问题，close [#3505](https://github.com/NervJS/taro/issues/3505) ([849999d](https://github.com/NervJS/taro/commit/849999d))
* **router:** 修复偶尔页面隐藏失败的情况 ([b9f708a](https://github.com/NervJS/taro/commit/b9f708a))
* **taro:** 增加 Taro.getAccountInfoSync 类型定义 ([#3433](https://github.com/NervJS/taro/issues/3433)) ([2f33f56](https://github.com/NervJS/taro/commit/2f33f56))
* **taro-weapp:** 微信小程序能通过 extraProps 接收外部 props ([506ca02](https://github.com/NervJS/taro/commit/506ca02))
* **taro-weapp/tt/swan/qq/alipay:** 拦截器添加 cleanInterceptors 方法 ([22edff9](https://github.com/NervJS/taro/commit/22edff9))
* 优化h5 下 ScrollView 标签，提供 onTouchMove 方法 ([44b730a](https://github.com/NervJS/taro/commit/44b730a))


### Features

* **taro-components:** add borderRadius for Progress Component ([4484546](https://github.com/NervJS/taro/commit/4484546))



<a name="1.3.2"></a>
## [1.3.2](https://github.com/NervJS/taro/compare/v1.3.1...v1.3.2) (2019-06-17)


### Bug Fixes

* **components-rn:** Clickable android, 绑定 onClick 的组件让 ScrollView 无法滑动了 ([16cf886](https://github.com/NervJS/taro/commit/16cf886))
* **components-rn:** react-native-swiper 修复并更新相关代码样式 ([7494c41](https://github.com/NervJS/taro/commit/7494c41))
* **transformer:** mobx 不需要 import ReduxContext, close [#3453](https://github.com/NervJS/taro/issues/3453) ([8d99a2b](https://github.com/NervJS/taro/commit/8d99a2b))
* **transformer:** 使用 spread props 导致报错，close [#3439](https://github.com/NervJS/taro/issues/3439) ([bf85def](https://github.com/NervJS/taro/commit/bf85def))
* **transformer:** 使用异步订阅 redux 更新 ([1ab6123](https://github.com/NervJS/taro/commit/1ab6123)), closes [#3456](https://github.com/NervJS/taro/issues/3456)
* **transformer:** 误报解构警告，close [#3450](https://github.com/NervJS/taro/issues/3450) ([f38e13b](https://github.com/NervJS/taro/commit/f38e13b))


### Features

* **components:** 组件  Image 新增 lazyLoad 属性 ([6d03f64](https://github.com/NervJS/taro/commit/6d03f64))
* **components-rn:** Swiper, 可以直接从样式传入 width, height 和 margin*,之前需要套 View, margin* 作用在内层导致样式有误 ([3646ec8](https://github.com/NervJS/taro/commit/3646ec8))
* **components-rn:** 将 react-native-swiper 内嵌到项目中 ([91a27e0](https://github.com/NervJS/taro/commit/91a27e0))
* **taro:** 新增 defineProperties polyfill ([6666f40](https://github.com/NervJS/taro/commit/6666f40))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/NervJS/taro/compare/v1.3.0...v1.3.1) (2019-06-16)


### Bug Fixes

* **cli:** 修正页面创建时页面命名等问题 ([247b0c0](https://github.com/NervJS/taro/commit/247b0c0))
* **mobx-h5:** 修复inject组件的componentDidShow内获取不到组件this的问题, fix [#3333](https://github.com/NervJS/taro/issues/3333) ([322f258](https://github.com/NervJS/taro/commit/322f258))
* **rn:** [RN]Taro.getCurrentPages方法不存在 close [#3224](https://github.com/NervJS/taro/issues/3224) ([a9b8fa7](https://github.com/NervJS/taro/commit/a9b8fa7))
* **rn:** this.$router增加path属性，与形式小程序同步 ([af0236e](https://github.com/NervJS/taro/commit/af0236e))
* **rn:** this.$router增加path属性，与形式小程序同步 ([0175da5](https://github.com/NervJS/taro/commit/0175da5))
* **taro-tt:** 修复头条小程序事件不带 type 参数的问题，fix [#3382](https://github.com/NervJS/taro/issues/3382) ([1977062](https://github.com/NervJS/taro/commit/1977062))
* **transformer:** &nbsp; 在第一个直接时会被无视, close [#3406](https://github.com/NervJS/taro/issues/3406) ([4d14dd7](https://github.com/NervJS/taro/commit/4d14dd7))
* **transformer:** 在类函数的 JSX循环无法使用 this.state 来循环 ([0401fd0](https://github.com/NervJS/taro/commit/0401fd0))
* **transformer:** 多个 if block 有同名变量编译错误，close [#3388](https://github.com/NervJS/taro/issues/3388) ([6df5d8d](https://github.com/NervJS/taro/commit/6df5d8d))
* **transformer:** 循环中的 wx:else 也需要用 block 包裹 ([b2ba05d](https://github.com/NervJS/taro/commit/b2ba05d)), closes [#3410](https://github.com/NervJS/taro/issues/3410)


### Features

* **components-rn:** [@ant-design](https://github.com/ant-design)/react-native 按需引入 ([d24b5f6](https://github.com/NervJS/taro/commit/d24b5f6))
* **components-rn:** ScrollView 允许传入部分 RN 自己的参数 ([4116344](https://github.com/NervJS/taro/commit/4116344))
* **redux:** useSelector, useStore, useDispatch typing ([dd18aa9](https://github.com/NervJS/taro/commit/dd18aa9))
* **redux:** 支持 useSelector, useDispatch, useStore ([bc6bc47](https://github.com/NervJS/taro/commit/bc6bc47))
* **rn:** rn 的 router 和 API 添加构建，API 改造TS ([93388cc](https://github.com/NervJS/taro/commit/93388cc))
* **taro:** 增加 createRef 的 typings ([e9b74ef](https://github.com/NervJS/taro/commit/e9b74ef))
* **transformer:** 可以找到普通函数是否阻止冒泡, close [#3379](https://github.com/NervJS/taro/issues/3379) ([dfcf62b](https://github.com/NervJS/taro/commit/dfcf62b))
* **transformer:** 支持导出匿名函数声明组件 ([caf66df](https://github.com/NervJS/taro/commit/caf66df))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/NervJS/taro/compare/v1.3.0-beta.8...v1.3.0) (2019-06-11)


### Bug Fixes

* **cli:** rn cli path resolve error ([c409856](https://github.com/NervJS/taro/commit/c409856))
* **cli:** 修复 taro convert 报错问题 ([d9b3d0c](https://github.com/NervJS/taro/commit/d9b3d0c))
* **h5:** 修复showLoading显示上一个showToast内容的问题, fix [#3367](https://github.com/NervJS/taro/issues/3367) ([897c2eb](https://github.com/NervJS/taro/commit/897c2eb))
* **mobx:** close [#3218](https://github.com/NervJS/taro/issues/3218) ([c2e08c4](https://github.com/NervJS/taro/commit/c2e08c4))
* **taro:** 添加百度 setPageInfo api, close [#3206](https://github.com/NervJS/taro/issues/3206) ([2ef11ff](https://github.com/NervJS/taro/commit/2ef11ff))
* **taro-h5:** 去掉 es6 方法调用 ([3282707](https://github.com/NervJS/taro/commit/3282707))


### Features

* **plugin-sass:** 支持通过设置 plugin.sass.data 配置来设置全局 sass 变量，close [#3314](https://github.com/NervJS/taro/issues/3314) ([4bf27b2](https://github.com/NervJS/taro/commit/4bf27b2))
* **rn:** 去掉 .rn_temp 下面的 node_modules ([38a55fa](https://github.com/NervJS/taro/commit/38a55fa))
* **taro:** 补充 Taro.createOffscreenCanvas API，close [#3281](https://github.com/NervJS/taro/issues/3281) ([cb8b4ee](https://github.com/NervJS/taro/commit/cb8b4ee))
* **transformer:** 支持 Editor 组件, close [#3373](https://github.com/NervJS/taro/issues/3373) ([104b021](https://github.com/NervJS/taro/commit/104b021))



<a name="1.3.0-beta.8"></a>
# [1.3.0-beta.8](https://github.com/NervJS/taro/compare/v1.3.0-beta.7...v1.3.0-beta.8) (2019-06-09)


### Bug Fixes

* **components:** 修复 h5 Input onChange/onInput 再输入过程中只会触发一次的问题 ([970980c](https://github.com/NervJS/taro/commit/970980c))



<a name="1.3.0-beta.7"></a>
# [1.3.0-beta.7](https://github.com/NervJS/taro/compare/v1.3.0-beta.6...v1.3.0-beta.7) (2019-06-09)


### Bug Fixes

* **cli:** 修复api调用时的路径处理错误 ([750d0c3](https://github.com/NervJS/taro/commit/750d0c3))
* **cli:** 修复h5端未使用[@tarojs](https://github.com/tarojs)/components时使用onPullDownrefresh的报错 ([5b18d63](https://github.com/NervJS/taro/commit/5b18d63))
* **cli:** 修复某些情况下多次触发onPullDownRefresh的问题, fix [#3014](https://github.com/NervJS/taro/issues/3014) ([7e48537](https://github.com/NervJS/taro/commit/7e48537))
* **components:** 修复 h5 Input 组件输入中文时不触发 onChange/onInput 的 bug，close [#3351](https://github.com/NervJS/taro/issues/3351) ([d163be7](https://github.com/NervJS/taro/commit/d163be7))
* **components:** 修复 input 类型判断问题 ([10f9465](https://github.com/NervJS/taro/commit/10f9465))
* **rn:**  toast API 错误回调 ([43ce8f9](https://github.com/NervJS/taro/commit/43ce8f9))
* **rn:** RN在1.3.0Beta2执行Taro.getCurrentPages()报错 close [#3082](https://github.com/NervJS/taro/issues/3082) ([926fdc1](https://github.com/NervJS/taro/commit/926fdc1))
* **rn:** 忽略 scalePx2d 导致的 Invalid prop `fontSize` of type `string` 的警告 ([bebacd9](https://github.com/NervJS/taro/commit/bebacd9))
* **rn:** 过滤 scalePx2dp 导致的样式校验警告 ([2acf57c](https://github.com/NervJS/taro/commit/2acf57c))
* **taro:** 修复微信文档链接，添加几个 API 返回值的 cloudID ([#3296](https://github.com/NervJS/taro/issues/3296)) ([25b4f73](https://github.com/NervJS/taro/commit/25b4f73))
* **taro:** 增加 getLogManager 类型定义 ([#3275](https://github.com/NervJS/taro/issues/3275)) ([4739713](https://github.com/NervJS/taro/commit/4739713))
* **taro-alipay:** 修复支付宝二维码启动页面获取不到参数的问题，close [#3313](https://github.com/NervJS/taro/issues/3313) ([2102a85](https://github.com/NervJS/taro/commit/2102a85))
* **taro-components:** 修复低版本系统下 swiper 滑动的 bug，[#3299](https://github.com/NervJS/taro/issues/3299) ([62a24e2](https://github.com/NervJS/taro/commit/62a24e2))
* **transformer:** props 生成多了 $taroCompReady 属性 ([37e7a46](https://github.com/NervJS/taro/commit/37e7a46))
* **transformer:** SFC 模式不阻止 state 参与 state assign ([1de5935](https://github.com/NervJS/taro/commit/1de5935)), closes [#3316](https://github.com/NervJS/taro/issues/3316)
* **transformer:** 修复多次生成匿名表达式报错，close [#3344](https://github.com/NervJS/taro/issues/3344) ([f9d08e5](https://github.com/NervJS/taro/commit/f9d08e5))
* **transformer:** 同一作用域有多个自定义组件无法正确生成 props ([29225c6](https://github.com/NervJS/taro/commit/29225c6))
* **transformer:** 在 if block 中的 props 生成位置错误 ([9a69c3d](https://github.com/NervJS/taro/commit/9a69c3d)), closes [#3290](https://github.com/NervJS/taro/issues/3290)
* **transformer:** 百度小程序生成 template data 需要用三个{}包裹 ([b3e66ae](https://github.com/NervJS/taro/commit/b3e66ae)), closes [#3244](https://github.com/NervJS/taro/issues/3244)
* **weapp:**  当组件不具名时 propsType 检测报错 ([434591f](https://github.com/NervJS/taro/commit/434591f))
* 🐛 修复RN中，页面开启enablePullDownRefresh后，页面下拉刷新失效 ([cfec368](https://github.com/NervJS/taro/commit/cfec368))
* 修复urlQuery为空时，返回错误的params (alipay、qq、tt) ([eae701a](https://github.com/NervJS/taro/commit/eae701a))
* **weapp:** 优化代码 ([9df0984](https://github.com/NervJS/taro/commit/9df0984))
* **weapp:** 修复urlQuery为空时，生成错误的params ([7f1c961](https://github.com/NervJS/taro/commit/7f1c961))
* 解决过滤 丢弃import的问题.. ([e04dcdf](https://github.com/NervJS/taro/commit/e04dcdf))


### Features

* **cli:** 调整项目创建，增加创建页面功能 ([d3964aa](https://github.com/NervJS/taro/commit/d3964aa))
* **components-rn:** clickable View with PanResponder ([2c1d78e](https://github.com/NervJS/taro/commit/2c1d78e))
* **taro:**  各小程序端同步新生命周期 ([307d2c7](https://github.com/NervJS/taro/commit/307d2c7))
* **taro:** 增加两个新生命周期的 typings ([95f9a6f](https://github.com/NervJS/taro/commit/95f9a6f))
* **taro:** 导出 API: Taro.memo ([6d18692](https://github.com/NervJS/taro/commit/6d18692))
* **transformer:** renderXX 方法可以继承，close [#3319](https://github.com/NervJS/taro/issues/3319) ([99c2d84](https://github.com/NervJS/taro/commit/99c2d84))
* **transformer:** 没有找到返回 JSX 元素提示是否缺少 return, [#3334](https://github.com/NervJS/taro/issues/3334) ([8d2f989](https://github.com/NervJS/taro/commit/8d2f989))
* **tt:** 支持 contextType, close [#3301](https://github.com/NervJS/taro/issues/3301) ([9691e02](https://github.com/NervJS/taro/commit/9691e02))
* **weapp:** 实现两个 React 16 的生命周期 ([323409e](https://github.com/NervJS/taro/commit/323409e))
* **webpack-runner:** babel插件默认不受额外的配置文件影响 ([e9e6c0e](https://github.com/NervJS/taro/commit/e9e6c0e))



<a name="1.3.0-beta.6"></a>
# [1.3.0-beta.6](https://github.com/NervJS/taro/compare/v1.3.0-beta.5...v1.3.0-beta.6) (2019-05-31)


### Bug Fixes

* **babel-plugin-transform-taroapi:** 保留[@tarojs](https://github.com/tarojs)/taro-h5的default import ([769bb08](https://github.com/NervJS/taro/commit/769bb08))
* **babel-plugin-transform-taroapi:** 修复对'Taro'使用赋值语句时转换错误的问题 ([be02324](https://github.com/NervJS/taro/commit/be02324))
* **cli:**  Cannot find module 'tslint/lib/error' ([a4358f7](https://github.com/NervJS/taro/commit/a4358f7))
* **cli:** 修复组件重复编译导致的 bug，close [#3251](https://github.com/NervJS/taro/issues/3251) ([0407620](https://github.com/NervJS/taro/commit/0407620))
* **cli:** 升级模板的 nervjs 版本 ([8a66b20](https://github.com/NervJS/taro/commit/8a66b20))
* **cli:** 项目创建出错 ([4e22cc5](https://github.com/NervJS/taro/commit/4e22cc5))
* **component:** ios 10 中文键盘输入内容重复([#2778](https://github.com/NervJS/taro/issues/2778)) ([437ebb9](https://github.com/NervJS/taro/commit/437ebb9))
* **components:** 修复 OfficialAccount 事件 types ([#3250](https://github.com/NervJS/taro/issues/3250)) ([ebc5278](https://github.com/NervJS/taro/commit/ebc5278))
* **components:** 修复components的build版本 ([c3adbf5](https://github.com/NervJS/taro/commit/c3adbf5))
* **components-rn:** Input 支持类型 number 的 value 直接传数字 ([32f0ecf](https://github.com/NervJS/taro/commit/32f0ecf))
* **components-rn:** TouchableOpacity 换回 TouchableWithoutFeedback ([cd763b9](https://github.com/NervJS/taro/commit/cd763b9))
* **components-rn:** 移除 webview 自带的白色背景以及容器的margin和padding, fix [#3202](https://github.com/NervJS/taro/issues/3202) ([23acaa7](https://github.com/NervJS/taro/commit/23acaa7))
* **h5:** h5 不再导出未支持的 createContext API ([8da557b](https://github.com/NervJS/taro/commit/8da557b)), closes [#3215](https://github.com/NervJS/taro/issues/3215)
* **h5:** 为H5的View组件添加长按时间onLongPress支持，fix [#2857](https://github.com/NervJS/taro/issues/2857) ([bd8f426](https://github.com/NervJS/taro/commit/bd8f426))
* **h5:** 为H5的View组件添加长按时间onLongPress支持，fix [#2857](https://github.com/NervJS/taro/issues/2857) ([460fd70](https://github.com/NervJS/taro/commit/460fd70))
* **h5:** 修复H5 View 组件无法相应onTouchMove事件的bug ([4b80e95](https://github.com/NervJS/taro/commit/4b80e95))
* **rn:** 修改 uiWidthPx 为 375 ([2d855da](https://github.com/NervJS/taro/commit/2d855da))
* **rn:** 编译后的样式 scalePx2dp 小数和负数没去掉引号 ([7bf3d51](https://github.com/NervJS/taro/commit/7bf3d51))
* **taro:** disableSwipeBack 将在 7.0.5 版本失效 ([194c1b0](https://github.com/NervJS/taro/commit/194c1b0))
* **taro:** 增加 getLaunchOptionsSync 类型声明 ([b4f2281](https://github.com/NervJS/taro/commit/b4f2281))
* **taro:** 增加 Taro.reportMonitor ([#3252](https://github.com/NervJS/taro/issues/3252)) ([477090c](https://github.com/NervJS/taro/commit/477090c))
* **taro-alipay:** 修复支付宝小程序 componentWillUnmount 报错的问题，close [#3167](https://github.com/NervJS/taro/issues/3167) ([ea1764e](https://github.com/NervJS/taro/commit/ea1764e))
* **taroize:** import src 填入无法解析的路径时提醒填入相对路径 ([79a5bea](https://github.com/NervJS/taro/commit/79a5bea)), closes [#3120](https://github.com/NervJS/taro/issues/3120)
* **transformer:** 从 this.props 而来的 children 标识符被误判为 slot ([f167edd](https://github.com/NervJS/taro/commit/f167edd))
* **transformer:** 在 if 内部生成的变量作为 props 取值错误 ([01515c6](https://github.com/NervJS/taro/commit/01515c6)), closes [#3195](https://github.com/NervJS/taro/issues/3195)
* **transformer:** 当 else 有循环 jsx 时插入语句未知错误 ([2609f7a](https://github.com/NervJS/taro/commit/2609f7a)), closes [#3182](https://github.com/NervJS/taro/issues/3182)
* **transformer:** 当 JSX 表达式直接返回 false 时移除表达式 ([2acbbf3](https://github.com/NervJS/taro/commit/2acbbf3)), closes [#2798](https://github.com/NervJS/taro/issues/2798)
* **transformer:** 循环生成 comp_id 可能会造成键值重复 ([230a347](https://github.com/NervJS/taro/commit/230a347)), closes [#3220](https://github.com/NervJS/taro/issues/3220)
* **transformer:** 百度小程序生成 template data 需要用三个{}包裹 ([6ef43b1](https://github.com/NervJS/taro/commit/6ef43b1)), closes [#3244](https://github.com/NervJS/taro/issues/3244)
* 🐛 修复RN下获取statusBarHeight不准确的问题 ([ec64291](https://github.com/NervJS/taro/commit/ec64291)), closes [#3036](https://github.com/NervJS/taro/issues/3036)
* beautify log when developers init ([#3197](https://github.com/NervJS/taro/issues/3197)) ([10c9021](https://github.com/NervJS/taro/commit/10c9021))
* 中文字符 ([c3b4014](https://github.com/NervJS/taro/commit/c3b4014))


### Features

* **alipay:** 导出createContext 和 useContext API ([ca8402f](https://github.com/NervJS/taro/commit/ca8402f)), closes [#3208](https://github.com/NervJS/taro/issues/3208)
* **cli:** hooks 支持设置 config ([08cf9b3](https://github.com/NervJS/taro/commit/08cf9b3))
* **cli:** 在cli中将appPath传递给webpack-runner ([cff7916](https://github.com/NervJS/taro/commit/cff7916))
* **plugin-stylus:** 添加对 config.paths 的兼容,允许从指定目录[@import](https://github.com/import) ([#3234](https://github.com/NervJS/taro/issues/3234)) ([db08b5a](https://github.com/NervJS/taro/commit/db08b5a))
* **rn:** 编译后样式的单位采用 scalePx2dp 函数包裹以处理响应式 ([8ffbc31](https://github.com/NervJS/taro/commit/8ffbc31))
* **taro-h5:** 补充了一批nervjs api的导出 ([a34a045](https://github.com/NervJS/taro/commit/a34a045))
* **taro-redux:** props 对比改为全等，close [#3165](https://github.com/NervJS/taro/issues/3165) ([856fb63](https://github.com/NervJS/taro/commit/856fb63))
* **weapp:** 添加云开发 cloud.CloudID 字段( close [#3212](https://github.com/NervJS/taro/issues/3212)) ([1f715f2](https://github.com/NervJS/taro/commit/1f715f2))
* **webpack-runner:** webpack-runner不再从process.cwd获取项目路径 ([c2ff527](https://github.com/NervJS/taro/commit/c2ff527))



<a name="1.3.0-beta.5"></a>
# [1.3.0-beta.5](https://github.com/NervJS/taro/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2019-05-24)


### Bug Fixes

* **cli:** 修复插件编译报错的问题，close [#3118](https://github.com/NervJS/taro/issues/3118) ([a086760](https://github.com/NervJS/taro/commit/a086760))
* **cli:** 小程序编译 node_modules 中静态文件需要 copy，close [#3135](https://github.com/NervJS/taro/issues/3135) ([3f847bb](https://github.com/NervJS/taro/commit/3f847bb))
* 删除重复的MovableView ([#3166](https://github.com/NervJS/taro/issues/3166)) ([248b296](https://github.com/NervJS/taro/commit/248b296))
* **cli:** 多端编译不再主动输出代码到对应平台目录 ([b9b749f](https://github.com/NervJS/taro/commit/b9b749f))
* **component:** 修复一处typo ([b486391](https://github.com/NervJS/taro/commit/b486391))
* **plugin-sass:** 切换回 node-sass ([e425b57](https://github.com/NervJS/taro/commit/e425b57))
* **types:** fix dataset type in Event Target, fix [#3151](https://github.com/NervJS/taro/issues/3151) ([#3160](https://github.com/NervJS/taro/issues/3160)) ([b21545f](https://github.com/NervJS/taro/commit/b21545f))


### Features

* **cli:** 增加更新的 taro 依赖包 ([df68b0c](https://github.com/NervJS/taro/commit/df68b0c))
* **taro:** 增加 createContext 和 useContext 的 typing ([76d832c](https://github.com/NervJS/taro/commit/76d832c))
* **taro:** 导出 API: createContext, useContext ([56b4074](https://github.com/NervJS/taro/commit/56b4074))
* **transformer:** 支持 Context.Provider JSX 成员表达式 ([d5085ea](https://github.com/NervJS/taro/commit/d5085ea))
* **weapp:** 支持 contextType ([6c7737d](https://github.com/NervJS/taro/commit/6c7737d))



<a name="1.3.0-beta.4"></a>
# [1.3.0-beta.4](https://github.com/NervJS/taro/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2019-05-23)


### Bug Fixes

* **cli:** H5 编译时若 jsx 文件没有引入 Taro 则引入 ([ed8fcfb](https://github.com/NervJS/taro/commit/ed8fcfb))
* **cli:** 修复部分文件打包时不压缩的问题 ([4699d02](https://github.com/NervJS/taro/commit/4699d02))
* **cli:** 小程序引用 ts 文件后缀未重写为 .js ([d8474ab](https://github.com/NervJS/taro/commit/d8474ab))
* **components-rn:** Clickable TouchableWithoutFeedback 导致的样式问题 ([4d12ad9](https://github.com/NervJS/taro/commit/4d12ad9))
* **components-rn:** 修复 onLoad 取不到图片尺寸问题, fix [#3093](https://github.com/NervJS/taro/issues/3093) ([a867082](https://github.com/NervJS/taro/commit/a867082))
* **eslint:** 类没有命名时报错，[#3092](https://github.com/NervJS/taro/issues/3092) ([d89e93a](https://github.com/NervJS/taro/commit/d89e93a))
* **h5:** 为chooseImage新增imageId ([#3109](https://github.com/NervJS/taro/issues/3109)) ([e8cf6ae](https://github.com/NervJS/taro/commit/e8cf6ae))
* **h5:** 为chooseImage新增imageId ([#3110](https://github.com/NervJS/taro/issues/3110)) ([7e1129d](https://github.com/NervJS/taro/commit/7e1129d))
* **h5 components:** 去除findIndex的调用 ([964237e](https://github.com/NervJS/taro/commit/964237e))
* **transformer:** 函数式组件去掉 props  前缀，close [#3117](https://github.com/NervJS/taro/issues/3117) ([15b33d1](https://github.com/NervJS/taro/commit/15b33d1))
* **transformer:** 在 if 语句中生成 props.manger 语句错误 ([1caf405](https://github.com/NervJS/taro/commit/1caf405))
* showToast API 参数 icon 为 none 时仍显示图片 ([7638047](https://github.com/NervJS/taro/commit/7638047))


### Features

* **cli:** 可以通过cli获取项目的页面列表了 ([400bb7a](https://github.com/NervJS/taro/commit/400bb7a))
* **components-rn:** Input & Textarea 开放 RN 参数, close [#3125](https://github.com/NervJS/taro/issues/3125) ([02d4e3b](https://github.com/NervJS/taro/commit/02d4e3b))
* **eslint:** 增加 eslint 规则的描述说明, close [#3096](https://github.com/NervJS/taro/issues/3096) ([2d455e8](https://github.com/NervJS/taro/commit/2d455e8))
* **rn:** rn 端输出编译后的代码到配置的目录 ([def3cab](https://github.com/NervJS/taro/commit/def3cab))
* **transformer:** 支持直接 export 匿名函数式组件，close [#3092](https://github.com/NervJS/taro/issues/3092) ([c916a4f](https://github.com/NervJS/taro/commit/c916a4f))



<a name="1.3.0-beta.3"></a>
# [1.3.0-beta.3](https://github.com/NervJS/taro/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2019-05-17)


### Bug Fixes

* **cli:** doctor 补充 alias、jsxAttributeNameReplace 检测 ([9ae0f0f](https://github.com/NervJS/taro/commit/9ae0f0f))
* **components:** 修复 input 组件在低版本 ios 报错，close [#3079](https://github.com/NervJS/taro/issues/3079) ([fb66b7c](https://github.com/NervJS/taro/commit/fb66b7c))
* 修复ci问题 ([58695c3](https://github.com/NervJS/taro/commit/58695c3))
* **cli:** rn 编译 watch 报错 ([da805d9](https://github.com/NervJS/taro/commit/da805d9))
* **cli:** 修复app.js中没有componentWillMount导致报错的问题, fix [#3001](https://github.com/NervJS/taro/issues/3001) ([ced1e6e](https://github.com/NervJS/taro/commit/ced1e6e))
* **cli:** 修复对默认 manifest 文件的引用 ([fb7d077](https://github.com/NervJS/taro/commit/fb7d077))
* **components:** swiper 轮播下标更新问题 ([3bbcf56](https://github.com/NervJS/taro/commit/3bbcf56))
* **components:** 修复 swiper 下标指向问题 ([dc73a46](https://github.com/NervJS/taro/commit/dc73a46))
* **components-rn:** 编译报错,回退版本设置 ([0ca3ab4](https://github.com/NervJS/taro/commit/0ca3ab4))
* **rn:** navigationStyle 配置失效的bug ([aae8bfc](https://github.com/NervJS/taro/commit/aae8bfc))
* **router:** 修复ci ([046a24c](https://github.com/NervJS/taro/commit/046a24c))
* **router:** 去除了router中的Array.prorotype.find, fix [#3044](https://github.com/NervJS/taro/issues/3044) ([9ea0ed0](https://github.com/NervJS/taro/commit/9ea0ed0))
* **taro:** 补充缺失的窗口表现配置项，修正仅在页面可用的项目出现在全局的问题 ([#3038](https://github.com/NervJS/taro/issues/3038)) ([b00fefd](https://github.com/NervJS/taro/commit/b00fefd))
* **taro-h5:** H5 端加入 hooks 相关 api 导出， close [#3009](https://github.com/NervJS/taro/issues/3009) ([#3025](https://github.com/NervJS/taro/issues/3025)) ([4b30beb](https://github.com/NervJS/taro/commit/4b30beb))
* **transformer:** 多层 props 传递异常，close [#3052](https://github.com/NervJS/taro/issues/3052) ([1745ea5](https://github.com/NervJS/taro/commit/1745ea5))
* **transformer:** 生产模式小于号没有被转义替换，close [#3074](https://github.com/NervJS/taro/issues/3074) ([1aeb47a](https://github.com/NervJS/taro/commit/1aeb47a))
* **transformer:** 百度小程序 for 和 if 指令不能并列close [#3022](https://github.com/NervJS/taro/issues/3022) ([5f3988b](https://github.com/NervJS/taro/commit/5f3988b))


### Features

* **cli:** cli 的 rn build 改造 ([2edd20b](https://github.com/NervJS/taro/commit/2edd20b))
* **cli:** doctor不再从process.cwd获取项目路径 ([6c2ec44](https://github.com/NervJS/taro/commit/6c2ec44))
* **cli:** 现在创建项目会在projectDir目录下创建了 ([1c68c06](https://github.com/NervJS/taro/commit/1c68c06))
* **postcss-pxtransform:** 添加样式的条件编译及测试用例 ([7688728](https://github.com/NervJS/taro/commit/7688728))
* **rn:** RN 端添加 API Taro.pageScrollTo ([459d25d](https://github.com/NervJS/taro/commit/459d25d))
* **rn:** 添加样式文件的条件文件编译 ([9a585bf](https://github.com/NervJS/taro/commit/9a585bf))
* **transformer:** 函数式组件支持使用 children 和组合 ([8e35788](https://github.com/NervJS/taro/commit/8e35788)), closes [#3047](https://github.com/NervJS/taro/issues/3047)



<a name="1.3.0-beta.2"></a>
# [1.3.0-beta.2](https://github.com/NervJS/taro/compare/v1.3.0-beta.1...v1.3.0-beta.2) (2019-05-13)


### Bug Fixes

* **cli:** postcss-url 增加 basePath 配置，close [#2334](https://github.com/NervJS/taro/issues/2334) ([37f6cf3](https://github.com/NervJS/taro/commit/37f6cf3))
* **cli:** usingComponents 下的内容不通过 CONFIG_MAP 处理，close [#2817](https://github.com/NervJS/taro/issues/2817) ([529a80e](https://github.com/NervJS/taro/commit/529a80e))
* **cli:** 修复 alias 路径替换的问题 ([b57ed0a](https://github.com/NervJS/taro/commit/b57ed0a))
* **cli:** 修复 ui 库编译 bug ([4ddbeca](https://github.com/NervJS/taro/commit/4ddbeca))
* **cli:** 创建项目时遗漏是否选择 typescript 的选项 ([ee7abc9](https://github.com/NervJS/taro/commit/ee7abc9))
* **cli:** 快应用编译时若没有默认引入 Taro 则自动补充 ([81d8c5d](https://github.com/NervJS/taro/commit/81d8c5d))
* **eslint:** 发布文件缺少 constant 文件夹 ([6eec837](https://github.com/NervJS/taro/commit/6eec837))
* **rn:** RN编译时报错 invariant_1.default is not a function close [#2984](https://github.com/NervJS/taro/issues/2984) ([8a88948](https://github.com/NervJS/taro/commit/8a88948))
* **rn:** toast 或 loading 不对称情况下防止泄漏 ([d9c52f9](https://github.com/NervJS/taro/commit/d9c52f9))
* **rn:** 路由 API promise 化 ([dd5ee2b](https://github.com/NervJS/taro/commit/dd5ee2b))
* **taro:** hooks deps 改变没有处理空数组的情况，[#2995](https://github.com/NervJS/taro/issues/2995) ([c96975d](https://github.com/NervJS/taro/commit/c96975d))
* **taro-swan:** 百度小程序加上 diff ([d130369](https://github.com/NervJS/taro/commit/d130369))
* **transformer:** 当 ast 没有 import Taro 时补一个 ([866aca1](https://github.com/NervJS/taro/commit/866aca1)), closes [#2995](https://github.com/NervJS/taro/issues/2995)
* **transformer:** 循环中使用匿名函数编译错误, close [#2990](https://github.com/NervJS/taro/issues/2990) ([e29ebcc](https://github.com/NervJS/taro/commit/e29ebcc))


### Features

* **components-rn:** ScrollView, 只在 onScroll 时判断 onScrollToUpper 和 onScrollToLower ([7cd8bea](https://github.com/NervJS/taro/commit/7cd8bea))
* **taro-alipay:** 支付宝小程序 props 系统改造 ([dfb6e30](https://github.com/NervJS/taro/commit/dfb6e30))
* **transformer:** 支持闭包函数组件 ([a67f2f9](https://github.com/NervJS/taro/commit/a67f2f9))
* **webpack-runner:** h5端使用copy-webpack-plugin实现copy功能 ([8e329bb](https://github.com/NervJS/taro/commit/8e329bb))



<a name="1.3.0-beta.1"></a>
# [1.3.0-beta.1](https://github.com/NervJS/taro/compare/v1.3.0-beta.0...v1.3.0-beta.1) (2019-05-07)


### Bug Fixes

* **cli:** RN编译报错：Unknown error from PostCSS plugin. close [#2934](https://github.com/NervJS/taro/issues/2934) ([aa09cd4](https://github.com/NervJS/taro/commit/aa09cd4))
* **cli:** 修复 taro info 命令报错 ([f124574](https://github.com/NervJS/taro/commit/f124574))
* **cli:** 修复h5端入口文件的生命周期处理错误 ([caf5269](https://github.com/NervJS/taro/commit/caf5269))
* **cli:** 修复h5端生成文件路径错误的问题 ([81fa286](https://github.com/NervJS/taro/commit/81fa286))
* **cli:** 小程序使用 npm 中静态资源编译报错 ([afd7fb1](https://github.com/NervJS/taro/commit/afd7fb1))
* **cli:** 小程序使用 npm 包中样式时路径编译错误 ([8f6bd02](https://github.com/NervJS/taro/commit/8f6bd02))
* **cli:** 项目预览时 css 报错不会中断项目，close [#2945](https://github.com/NervJS/taro/issues/2945) ([987b8cd](https://github.com/NervJS/taro/commit/987b8cd))
* **components-rn:** build es5 ([8cdcfd3](https://github.com/NervJS/taro/commit/8cdcfd3))
* **eslint:** 使用 commonjs 模块化 ([a2de977](https://github.com/NervJS/taro/commit/a2de977))
* **h5:** 修复interactive系列api错误地缓存了调用参数的问题, fix [#2675](https://github.com/NervJS/taro/issues/2675) ([8ef960a](https://github.com/NervJS/taro/commit/8ef960a))
* **rn:** cli 添加 css-to-react-native 依赖 ([cd7be00](https://github.com/NervJS/taro/commit/cd7be00))
* **rn:** getApp 在rn中报错 close [#2897](https://github.com/NervJS/taro/issues/2897) ([09cd796](https://github.com/NervJS/taro/commit/09cd796))
* **rn:** react-native中使用hideLoading无法关闭loading  close [#2887](https://github.com/NervJS/taro/issues/2887) ([a7a7699](https://github.com/NervJS/taro/commit/a7a7699))
* **rn:** 为 app.js 添加 componentDidShow 和 componentDidHide 方法 ([f9ec00b](https://github.com/NervJS/taro/commit/f9ec00b))
* **taro:** 修复 api getMenuButtonBoundingClientRect，close [#2939](https://github.com/NervJS/taro/issues/2939) ([90540cd](https://github.com/NervJS/taro/commit/90540cd))
* **taro-weapp/alipay/swan/tt/qq:** 更新 diff 逻辑 ([923579b](https://github.com/NervJS/taro/commit/923579b))
* **taro-weapp/alipay/swan/tt/qq:** 更新 diff 逻辑 ([b0deb91](https://github.com/NervJS/taro/commit/b0deb91))
* **webpack-runner:** 如果h5端的编译失败了,现在会exit(1)了, fix [#2682](https://github.com/NervJS/taro/issues/2682) ([badc630](https://github.com/NervJS/taro/commit/badc630))


### Features

* **cli:** 将h5端的生成文件放置到./h5目录 ([85cc143](https://github.com/NervJS/taro/commit/85cc143))
* **components-rn:** ScrollView, 只拆分两个样式到 contentContainerStyle ([c827fbf](https://github.com/NervJS/taro/commit/c827fbf))
* **h5:** 使用touchmove模拟scroll事件的触发 ([44b4e29](https://github.com/NervJS/taro/commit/44b4e29))
* **rn:** fork css-to-react-native 包，方便修改 ([33cf18f](https://github.com/NervJS/taro/commit/33cf18f))
* **rn:** 支持  PureComponent ([0a34498](https://github.com/NervJS/taro/commit/0a34498))
* **taro:** SubPackage 增加 name 和 independent 属性 ([#2981](https://github.com/NervJS/taro/issues/2981)) ([6f57907](https://github.com/NervJS/taro/commit/6f57907))
* **taro:** 加入 hooks 的 typings ([7db8111](https://github.com/NervJS/taro/commit/7db8111))
* **transformer:** 事件现在可以传入任何函数 ([25ab86e](https://github.com/NervJS/taro/commit/25ab86e))
* **webpack-runner:** 现在babel处理不再排除node_modules目录了 ([311ffa5](https://github.com/NervJS/taro/commit/311ffa5))



<a name="1.3.0-beta.0"></a>
# [1.3.0-beta.0](https://github.com/NervJS/taro/compare/v1.2.27-beta.0...v1.3.0-beta.0) (2019-04-30)


### Bug Fixes

* **cli:** npm 包中引用了其他 npm 包时也需要经过 npmCodeHack 处理 ([fb37b2a](https://github.com/NervJS/taro/commit/fb37b2a))
* **cli:** 修复 convert 引用 ([6f0f21a](https://github.com/NervJS/taro/commit/6f0f21a))
* **cli:** 修复 export default 的 bug ([11aba24](https://github.com/NervJS/taro/commit/11aba24))
* **cli:** 修复 node_modules 中 ui 引用错误，close [#2357](https://github.com/NervJS/taro/issues/2357) ([2b42629](https://github.com/NervJS/taro/commit/2b42629))
* **cli:** 修复 prettier 参数类型定义 ([cd835e9](https://github.com/NervJS/taro/commit/cd835e9))
* **cli:** 修复 tabbar 图片 copy 问题 ([64a5bdc](https://github.com/NervJS/taro/commit/64a5bdc))
* **cli:** 修复 watch 时文件监听 ([677e034](https://github.com/NervJS/taro/commit/677e034))
* **cli:** 修复cli一处变量未定义的错误 ([284c9be](https://github.com/NervJS/taro/commit/284c9be))
* **cli:** 修复引用 ([7d6b8c7](https://github.com/NervJS/taro/commit/7d6b8c7))
* **cli:** 修复快应用打包时依赖安装的 bug ([b28aa2a](https://github.com/NervJS/taro/commit/b28aa2a))
* **cli:** 修复快应用组件文件 copy 报错 ([c9106e7](https://github.com/NervJS/taro/commit/c9106e7))
* **cli:** 修复组件编译不完全问题 ([dae61af](https://github.com/NervJS/taro/commit/dae61af))
* **cli:** 修正页面文件判断 ([3ce1312](https://github.com/NervJS/taro/commit/3ce1312))
* **cli:** 小程序 && 快应用编译文件调整 ([e96da96](https://github.com/NervJS/taro/commit/e96da96))
* **cli:** 快应用开发增加 watch 功能 ([e4d6a7b](https://github.com/NervJS/taro/commit/e4d6a7b))
* **cli:** 快应用打包时代码不压缩 ([1b5454b](https://github.com/NervJS/taro/commit/1b5454b))
* **cli:** 快应用特殊组件不再被当成自定义组件 ([6ef5d74](https://github.com/NervJS/taro/commit/6ef5d74))
* **cli:** 快应用编译时自定义组件没有生成 import 引入 ([96b72b9](https://github.com/NervJS/taro/commit/96b72b9))
* **cli:** 快应用静态资源 copy 目录错误 ([334d440](https://github.com/NervJS/taro/commit/334d440))
* **cli:** 编译时提前加入环境变量 ([c7bf06d](https://github.com/NervJS/taro/commit/c7bf06d))
* **cli taro:** cli的build脚本现在可以通过了 ([32e6f96](https://github.com/NervJS/taro/commit/32e6f96))
* **component:** canvas组件现在可以通过style调整大小, 也可以接受额外的属性了,fix [#2880](https://github.com/NervJS/taro/issues/2880) ([a148c6d](https://github.com/NervJS/taro/commit/a148c6d))
* **components:** canvas组件去除width、height属性 ([3e9a99c](https://github.com/NervJS/taro/commit/3e9a99c))
* **components:** 修复 input 属性问题。 close [#2840](https://github.com/NervJS/taro/issues/2840) ([bdd1070](https://github.com/NervJS/taro/commit/bdd1070))
* **components:** 修复 Picker 组件未设置默认 mode 属性的 bug ([#2900](https://github.com/NervJS/taro/issues/2900)) ([5833972](https://github.com/NervJS/taro/commit/5833972))
* **components:** 修复ci问题 ([f668d3c](https://github.com/NervJS/taro/commit/f668d3c))
* **components:** 去掉了tabbar中的Array.prototype.find ([c2820c5](https://github.com/NervJS/taro/commit/c2820c5))
* **components-qa:** 修复 button 组件问题 ([d039523](https://github.com/NervJS/taro/commit/d039523))
* **components-qa:** 修复页面容器组件属性初始化 ([c9a102f](https://github.com/NervJS/taro/commit/c9a102f))
* **components-qa:** 快应用组件库样式修复 ([cd47958](https://github.com/NervJS/taro/commit/cd47958))
* **doctor:** 修复改为 typescript 后出现的问题 ([36fb9fe](https://github.com/NervJS/taro/commit/36fb9fe))
* **doctor:** 修复改为 typescript 后出现的问题 ([950b49d](https://github.com/NervJS/taro/commit/950b49d))
* **h5:** chooseLocation的组件不再直接挂在body上 ([e225d84](https://github.com/NervJS/taro/commit/e225d84))
* **h5:** h5将intercepters暴露出来, fix [#2807](https://github.com/NervJS/taro/issues/2807) ([f782c9f](https://github.com/NervJS/taro/commit/f782c9f))
* **h5:** h5类型增加_$router,防止router build报错 ([d89a08d](https://github.com/NervJS/taro/commit/d89a08d))
* **h5:** 一批eslint问题修复 ([69ad2a2](https://github.com/NervJS/taro/commit/69ad2a2))
* **h5:** 修复ci的错误 ([bf7a2a8](https://github.com/NervJS/taro/commit/bf7a2a8))
* **h5:** 修复createAnimation单位判定/translateX缺少括号bug/添加测试 ([54b2404](https://github.com/NervJS/taro/commit/54b2404)), closes [#2749](https://github.com/NervJS/taro/issues/2749)
* **h5:** 修复setNavigationBarColor重复定义的问题 ([ced8b11](https://github.com/NervJS/taro/commit/ced8b11))
* **h5:** 修改uploadFile.js文件名 ([99c59f6](https://github.com/NervJS/taro/commit/99c59f6))
* **h5:** 修正interceptors的typo ([0745dc9](https://github.com/NervJS/taro/commit/0745dc9))
* **h5:** 暂时不实现'在触发距离内滑动期间，本事件只会被触发一次'的功能,保证移动端体验 ([a6af8f5](https://github.com/NervJS/taro/commit/a6af8f5))
* **h5:** 补上PureComponents的导出 ([8f8bbd2](https://github.com/NervJS/taro/commit/8f8bbd2))
* **h5 taro:** canvasContext的api typings对齐官方,fix [#2886](https://github.com/NervJS/taro/issues/2886) ([eb8ed9f](https://github.com/NervJS/taro/commit/eb8ed9f))
* **index.d.ts:** 修正 RequestParams 的类型定义 ([#2834](https://github.com/NervJS/taro/issues/2834)) ([d96dae9](https://github.com/NervJS/taro/commit/d96dae9))
* **quickapp:** 修复快应用事件 bind 传参 ([a0ee392](https://github.com/NervJS/taro/commit/a0ee392))
* **quickapp:** 修复快应用路由相关 API url 处理错误的问题 ([9aba95c](https://github.com/NervJS/taro/commit/9aba95c))
* **quickapp:** 快应用属性传递最后小写 ([fabca5a](https://github.com/NervJS/taro/commit/fabca5a))
* **redux:** 快应用属于多页应用，数据改成挂载全局下进行共享 ([1ffc6cd](https://github.com/NervJS/taro/commit/1ffc6cd))
* **rn:** react native .rn.tsx 独立组件样式文件编译引入出错 close [#2846](https://github.com/NervJS/taro/issues/2846) ([bb14ff0](https://github.com/NervJS/taro/commit/bb14ff0))
* **rn:** TS 改造导致的  build  错误 ([924fe75](https://github.com/NervJS/taro/commit/924fe75))
* **taro-cli:** 修复插件 npm 路径编译。 ([220d017](https://github.com/NervJS/taro/commit/220d017))
* **taro-cli:** 修复插件 npm 路径编译。close [#2830](https://github.com/NervJS/taro/issues/2830) ([988ac93](https://github.com/NervJS/taro/commit/988ac93))
* **taro-cli:** 修复插件静态资源引用路径。close [#2829](https://github.com/NervJS/taro/issues/2829) ([1bad473](https://github.com/NervJS/taro/commit/1bad473))
* **taro-qq:** 修复 qq 没有给组件实例加 prefix 的问题 ([e63e744](https://github.com/NervJS/taro/commit/e63e744))
* **taro-qq:** 修复 qq 轻应用 hooks 依赖路径 ([c67bace](https://github.com/NervJS/taro/commit/c67bace))
* **taro-qq/swan/tt:** hooks 抽离到 [@tarojs](https://github.com/tarojs)/taro ([dcf0757](https://github.com/NervJS/taro/commit/dcf0757))
* **taro-qucikapp:** 修复事件处理 ([4faab0e](https://github.com/NervJS/taro/commit/4faab0e))
* **taro-quickapp:** 修复事件传参 ([02ff644](https://github.com/NervJS/taro/commit/02ff644))
* **taro-weapp/qq/swan/tt:** 修复小程序新 props 系统不触发 componentWillReceive 的问题 ([a34687d](https://github.com/NervJS/taro/commit/a34687d))
* **taro-weapp/swan/tt/qq/:** 修复 props 系统问题 ([a4ed9e8](https://github.com/NervJS/taro/commit/a4ed9e8))
* **taro-weapp/tt/swan:** props 系统 compid 存取逻辑优化 ([9a9b1c7](https://github.com/NervJS/taro/commit/9a9b1c7))
* **taroize:** onLoad 的第一个参数可以传入 this.$router.params ([a386d93](https://github.com/NervJS/taro/commit/a386d93)), closes [#2792](https://github.com/NervJS/taro/issues/2792)
* **taroize:** wxs 变量不需要从 state 中取值 ([226efc2](https://github.com/NervJS/taro/commit/226efc2))
* **taroize:** 解析 wxs 内联模块错误 ([5203d4f](https://github.com/NervJS/taro/commit/5203d4f))
* **transformer:**  无法生成函数式组件 ([22bab7a](https://github.com/NervJS/taro/commit/22bab7a))
* **transformer:** JSX 表达式前有空格会被删除，close [#2261](https://github.com/NervJS/taro/issues/2261) ([34dc701](https://github.com/NervJS/taro/commit/34dc701))
* **transformer:** 从 this.props 结构而来的 bind 函数生成匿名函数 ([37a8d8c](https://github.com/NervJS/taro/commit/37a8d8c))
* **transformer:** 以 render 开头又不返回 JSX 给提示 ([309ff17](https://github.com/NervJS/taro/commit/309ff17))
* **transformer:** 修复 props 系统和 render 外 JSX 的兼容 ([301ee12](https://github.com/NervJS/taro/commit/301ee12))
* **transformer:** 修复支付宝事件名编译错误 ([4ee0f6c](https://github.com/NervJS/taro/commit/4ee0f6c))
* **transformer:** 修复条件渲染与 render props 共存的问题 ([13def73](https://github.com/NervJS/taro/commit/13def73)), closes [#2890](https://github.com/NervJS/taro/issues/2890)
* **transformer:** 函数式组件插入 props 结构语句位置错误 ([312edd3](https://github.com/NervJS/taro/commit/312edd3))
* **transformer:** 匿名 index 不需要检查变量冲突 ([af7d7ab](https://github.com/NervJS/taro/commit/af7d7ab))
* **transformer:** 在循环中使用类函数式组件不会创建新数组 ([f47bd49](https://github.com/NervJS/taro/commit/f47bd49))
* **transformer:** 多级循环作用域处理有误，close [#2814](https://github.com/NervJS/taro/issues/2814) ([5620df1](https://github.com/NervJS/taro/commit/5620df1))
* **transformer:** 循环中匿名函数生成的 key 不应该放在 state 里 ([9c1cae6](https://github.com/NervJS/taro/commit/9c1cae6))
* **transformer:** 循环中只有类函数式组件的时候不会生成匿名 index ([c17b497](https://github.com/NervJS/taro/commit/c17b497))
* **transformer:** 快应用特殊组件不需要加入最终返回的 components ([8be21ee](https://github.com/NervJS/taro/commit/8be21ee))
* **transformer:** 快应用生成函数匿名 state 也不能以 _$ 开头 ([b159cf2](https://github.com/NervJS/taro/commit/b159cf2))
* **transformer:** 快应用还需要 properites 参数 ([1d1bcd0](https://github.com/NervJS/taro/commit/1d1bcd0))
* **transformer:** 特殊快应用组件需要当成自定义组件处理 ([577f925](https://github.com/NervJS/taro/commit/577f925))
* **transformer:** 类函数式组件不入 $taroCompReady 的 if 条件 ([49eb70d](https://github.com/NervJS/taro/commit/49eb70d))
* **transformer:** 自定义组件 ID 未生成 ([f29bc9d](https://github.com/NervJS/taro/commit/f29bc9d))
* **transformer:** 重复调用 transformer 函数出错 ([b5b80c0](https://github.com/NervJS/taro/commit/b5b80c0))


### Features

* **alipay|swan|tt:** 入口文件导出 hooks API ([47b77a0](https://github.com/NervJS/taro/commit/47b77a0))
* **baidu|alipay|tt:** 支持 hooks ([6932173](https://github.com/NervJS/taro/commit/6932173))
* **cli:** cli 支持 node api 调用 ([c7c8dcd](https://github.com/NervJS/taro/commit/c7c8dcd))
* **cli:** h5 ast逻辑优化 去除any ([0907cdf](https://github.com/NervJS/taro/commit/0907cdf))
* **cli:** h5编译支持node api调用 ([b82ae66](https://github.com/NervJS/taro/commit/b82ae66))
* **cli:** npm 编译处理改造 ([9d89921](https://github.com/NervJS/taro/commit/9d89921))
* **cli:** 使用 typescript 重构 cli 代码 ([aa002be](https://github.com/NervJS/taro/commit/aa002be))
* **cli:** 使用 typescript 重构 cli 代码 ([4827549](https://github.com/NervJS/taro/commit/4827549))
* **cli:** 增加快应用 manifest 的类型文件 ([89596b2](https://github.com/NervJS/taro/commit/89596b2))
* **cli:** 增加快应用编译类型 ([f071494](https://github.com/NervJS/taro/commit/f071494))
* **cli:** 快应用增加打包与发布命令 ([db939e7](https://github.com/NervJS/taro/commit/db939e7))
* **cli:** 快应用样式尺寸处理 ([ad8cd9a](https://github.com/NervJS/taro/commit/ad8cd9a))
* **cli:** 快应用编译时需要传入根节点需要的参数 ([acd3ec8](https://github.com/NervJS/taro/commit/acd3ec8))
* **cli:** 快应用编译环境准备，一键启动快应用编译 ([eeaaf65](https://github.com/NervJS/taro/commit/eeaaf65))
* **cli:** 快应用编译页面时补充 pagePath 参数 ([99c4df3](https://github.com/NervJS/taro/commit/99c4df3))
* **cli:** 编译时注入快应用顶部导航相关调用代码以配合运行时实现 ([5e90cbc](https://github.com/NervJS/taro/commit/5e90cbc))
* **cli|quickapp:** 快应用样式尺寸处理 ([73761fe](https://github.com/NervJS/taro/commit/73761fe))
* **component:** 新增快应用 button, checkbox ([3f1b25f](https://github.com/NervJS/taro/commit/3f1b25f))
* **components-qa:** 修复快应用 text 组件文字不显示的 bug ([e49600c](https://github.com/NervJS/taro/commit/e49600c))
* **components-qa:** 增加页面容器组件 ([064bd06](https://github.com/NervJS/taro/commit/064bd06))
* **doctor:** 增加 doctor 子命令 ([be02201](https://github.com/NervJS/taro/commit/be02201))
* **doctor:** 增加 doctor 子命令 ([9510a7e](https://github.com/NervJS/taro/commit/9510a7e))
* **h5:** h5增加api chooseLocation ([43ccd53](https://github.com/NervJS/taro/commit/43ccd53))
* **h5:** h5增加api on/offWindowResize nextTick ([8e8fa80](https://github.com/NervJS/taro/commit/8e8fa80))
* **h5:** h5增加api previewImage ([88540f4](https://github.com/NervJS/taro/commit/88540f4))
* **h5:** h5增加api start/stopAccelerometer onAccelerometerChange ([d3eea4c](https://github.com/NervJS/taro/commit/d3eea4c))
* **h5:** h5增加api start/stopCompass onCompassChange ([9cc3b43](https://github.com/NervJS/taro/commit/9cc3b43))
* **h5:** h5增加api start/stopDeviceMotionListening onDeviceMotionChange ([3aadaee](https://github.com/NervJS/taro/commit/3aadaee))
* **h5:** h5增加api upload/downloadFile ([032eafa](https://github.com/NervJS/taro/commit/032eafa))
* **h5:** h5增加api vibrateShort/Long ([a7fbcd3](https://github.com/NervJS/taro/commit/a7fbcd3))
* **h5:** h5添加api getImageInfo ([2a17e0f](https://github.com/NervJS/taro/commit/2a17e0f))
* **h5:** 为tabbar相关api增加了测试用例 ([b90064d](https://github.com/NervJS/taro/commit/b90064d))
* **h5:** 增加页面某些异常路由状态的报错 ([611d49b](https://github.com/NervJS/taro/commit/611d49b))
* **quickapp:** 修复事件支持 && 增加 setState 实现及相关生命周期 ([efc0d74](https://github.com/NervJS/taro/commit/efc0d74))
* **quickapp:** 快应用事件处理 ([debe086](https://github.com/NervJS/taro/commit/debe086))
* **quickapp:** 快应用运行时框架 ([e1754b6](https://github.com/NervJS/taro/commit/e1754b6))
* **rn:** add API chooseImage ([090b6ce](https://github.com/NervJS/taro/commit/090b6ce))
* **taro:** tabbar 增加 custom 定义 ([45f6e6f](https://github.com/NervJS/taro/commit/45f6e6f))
* **taro:** taro 增加广告 API。close [#2893](https://github.com/NervJS/taro/issues/2893) ([3ddd99a](https://github.com/NervJS/taro/commit/3ddd99a))
* **taro:** 增加 hooks 的 typings ([aed4f80](https://github.com/NervJS/taro/commit/aed4f80))
* **taro:** 增加 port 命令参数作为快应用和 H5 的启动端口设置 ([8ad4bf4](https://github.com/NervJS/taro/commit/8ad4bf4))
* **taro:** 快应用对齐 onPullDownRefresh/onReachBottom/onPageScroll 等钩子 ([01b75e8](https://github.com/NervJS/taro/commit/01b75e8))
* **taro-qq:** qq 小程序支持 createRef ([7576032](https://github.com/NervJS/taro/commit/7576032))
* **taro-qq:** qq 轻应用 props 改造 ([7e46194](https://github.com/NervJS/taro/commit/7e46194))
* **taro-qq:** 增加 QQ 轻应用端适配 ([2e81854](https://github.com/NervJS/taro/commit/2e81854))
* **taro-qucikapp:** 增加扫码 api ([93eeba5](https://github.com/NervJS/taro/commit/93eeba5))
* **taro-quickapp:** 增加分享/通知/部分设备相关 api ([2731263](https://github.com/NervJS/taro/commit/2731263))
* **taro-quickapp:** 增加顶部导航相关 API ([b228c1f](https://github.com/NervJS/taro/commit/b228c1f))
* **taro-weapp/alipay/swan/tt:** 小程序端支持 createRef ([40ed9cb](https://github.com/NervJS/taro/commit/40ed9cb))
* **transformer:** 函数式组件 props.children 替换为 slot ([1b4ed2a](https://github.com/NervJS/taro/commit/1b4ed2a))
* **transformer:** 增加快应用适配器 ([13cfa70](https://github.com/NervJS/taro/commit/13cfa70))
* **transformer:** 快应用新增参数: rootProps ([247a03e](https://github.com/NervJS/taro/commit/247a03e))
* **transformer:** 支持类函数式组件 ([ad8ce20](https://github.com/NervJS/taro/commit/ad8ce20))
* **weapp:** 实现 react hooks ([e0f6fbc](https://github.com/NervJS/taro/commit/e0f6fbc))
* 为了避免快应用基础组件与原生组件名冲突，部分组件增加 taro 前缀 ([73fb96d](https://github.com/NervJS/taro/commit/73fb96d))
* 完善快应用入口文件及页面编译 ([0be90c0](https://github.com/NervJS/taro/commit/0be90c0))
* 快应用编译及快应用框架 ([50067da](https://github.com/NervJS/taro/commit/50067da))
* 快应用编译调整 ([7a08f0c](https://github.com/NervJS/taro/commit/7a08f0c))
* 编译快应用依赖组件 ([8f3a3c2](https://github.com/NervJS/taro/commit/8f3a3c2))
* 编译快应用页面时 copy 页面依赖的 taro 内置组件 ([2a6493d](https://github.com/NervJS/taro/commit/2a6493d))
* **taro-components-qa:** 快应用相关组件添加 ([e8e4216](https://github.com/NervJS/taro/commit/e8e4216))
* **transformer:** JSX 字符串和 JSX 表达式在快应用都需要用 Text 包裹起来 ([f1907b6](https://github.com/NervJS/taro/commit/f1907b6))
* **transformer:** 支持函数式组件 ([7ab7e38](https://github.com/NervJS/taro/commit/7ab7e38))
* **transformer:** 支持用函数表达式定义函数式组件 ([a6cd62d](https://github.com/NervJS/taro/commit/a6cd62d))
* **transformer:** 支持类函数式组件 ([b58df6f](https://github.com/NervJS/taro/commit/b58df6f))
* **transformer:** 改变快应用的循环模式 ([9a9e9b4](https://github.com/NervJS/taro/commit/9a9e9b4))


### Performance Improvements

* **transformer:** 优化创建 props 的方式 ([ddf4cd7](https://github.com/NervJS/taro/commit/ddf4cd7))



<a name="1.2.27-beta.0"></a>
## [1.2.27-beta.0](https://github.com/NervJS/taro/compare/v1.2.26...v1.2.27-beta.0) (2019-04-18)


### Bug Fixes

* css modules doesn't update ([#2712](https://github.com/NervJS/taro/issues/2712)) ([c599918](https://github.com/NervJS/taro/commit/c599918)), closes [#1388](https://github.com/NervJS/taro/issues/1388)
* **cli:** h5端增加了reachBottom等函数的容错处理 ([1e7670c](https://github.com/NervJS/taro/commit/1e7670c))
* **cli:** mobx 模版依赖问题修复 ([4368557](https://github.com/NervJS/taro/commit/4368557))
* **component:**  hoverable 异常逻辑 ([b21093f](https://github.com/NervJS/taro/commit/b21093f))
* **components:** picker 单列选择更新下标问题 (close [#2797](https://github.com/NervJS/taro/issues/2797)) ([36d3b0f](https://github.com/NervJS/taro/commit/36d3b0f))
* **components:** 修复某些时候swiper.destroy报错的问题 ([b479992](https://github.com/NervJS/taro/commit/b479992))
* **components-rn:** Picker time 格式 hh:mm ([a52ebc5](https://github.com/NervJS/taro/commit/a52ebc5))
* **components-rn:** Picker time 格式 hh:mm ([a7524ad](https://github.com/NervJS/taro/commit/a7524ad))
* **h5:** 修复父类的componentDidShow等函数被覆盖的问题 ([ba88faa](https://github.com/NervJS/taro/commit/ba88faa))
* **h5:** 去除promise.finally ([1ed6d0d](https://github.com/NervJS/taro/commit/1ed6d0d))
* **index.d.ts:** 修正 Canvas 的类型定义 ([#2768](https://github.com/NervJS/taro/issues/2768)) ([5318903](https://github.com/NervJS/taro/commit/5318903))
* **mobx:** rn 端问题修复 ([fde899d](https://github.com/NervJS/taro/commit/fde899d))
* **mobx:** 支付宝小程序 onTaroCollectChilds 未定义问题修复 ([556c31f](https://github.com/NervJS/taro/commit/556c31f))
* **taro-rn:**  RN 端 Toast 相关 API Promise 化 close [#2715](https://github.com/NervJS/taro/issues/2715) ([00bac39](https://github.com/NervJS/taro/commit/00bac39))
* **taro-transformer-wx:** props 改造，优化组件属性过滤判断 ([43c3dac](https://github.com/NervJS/taro/commit/43c3dac))
* **taro-transformer-wx:** 自动 import 的 taro 工具包补齐 ([bf1da1e](https://github.com/NervJS/taro/commit/bf1da1e))
* **taro-weapp:** 不再根据 Component.properties 来计算 next props ([2ede173](https://github.com/NervJS/taro/commit/2ede173))
* **taro-weapp:** 不去过滤所有第三方与原生组件的 propreties ([5fdc5fa](https://github.com/NervJS/taro/commit/5fdc5fa))
* **taro-weapp:** 优化微信小程序 props 改造方案 ([c2d5749](https://github.com/NervJS/taro/commit/c2d5749))
* **taro-weapp:** 修复没有 props 的自定义组件不初始化的问题。 ([29162b8](https://github.com/NervJS/taro/commit/29162b8))
* **taro-weapp:** 微信小程序 props 改造，compid 改为运行时动态打上 ([972255e](https://github.com/NervJS/taro/commit/972255e))
* **taro-weapp:** 微信小程序 redux props 不能被覆盖 ([684bcce](https://github.com/NervJS/taro/commit/684bcce))
* **taro-weapp:** 微信小程序收集自定义组件 props 过滤时过滤掉 render 开头的组件 ([55b7031](https://github.com/NervJS/taro/commit/55b7031))
* **taro-weapp/tt/swan/alipay:** 修复 ref ([d4e3ef5](https://github.com/NervJS/taro/commit/d4e3ef5))
* **transformer:** 最后加入到 render 函数的一刻才处理 propsManager.set 的先验条件 ([2a933c3](https://github.com/NervJS/taro/commit/2a933c3))
* **transformer:** 增加 isEmptyProps 对 JSXSpreadAttribute 的判断 ([9dbc512](https://github.com/NervJS/taro/commit/9dbc512))
* **transformer:** 多层循环中使用箭头函数给事件传参错误，close [#2551](https://github.com/NervJS/taro/issues/2551) ([f880c82](https://github.com/NervJS/taro/commit/f880c82)), closes [#2514](https://github.com/NervJS/taro/issues/2514) [#2112](https://github.com/NervJS/taro/issues/2112)
* **transformer:** 循环中传匿名函数 props 需要返回值 ([f65c6a5](https://github.com/NervJS/taro/commit/f65c6a5))
* **transformer:** 第三方组件事件处理错误 ([011dd77](https://github.com/NervJS/taro/commit/011dd77))
* **transformer:** 通过 props 传递生成的匿名函数需要直接 return ([60122df](https://github.com/NervJS/taro/commit/60122df))


### Features

* **component-rn:** 添加 Block 组件 ([714c770](https://github.com/NervJS/taro/commit/714c770))
* **components-rn:** add ClickableSimplified ([cccb502](https://github.com/NervJS/taro/commit/cccb502))
* **components-rn:** ts 改写 WebView 组件 ([73517c4](https://github.com/NervJS/taro/commit/73517c4))
* **components-rn:** ts 改写 WebView 组件 ([2a0b21d](https://github.com/NervJS/taro/commit/2a0b21d))
* **components-rn:** 脱离expo, example 移至 react-native init 的项目下 ([1fdf035](https://github.com/NervJS/taro/commit/1fdf035))
* **components-rn:** 脱离expo, example 移至 react-native init 的项目下 ([7becd8e](https://github.com/NervJS/taro/commit/7becd8e))
* **h5:** canvas系列api不再使用Proxy ([ee708c5](https://github.com/NervJS/taro/commit/ee708c5))
* **h5:** canvas系列api现在不强制传this了 ([4cbaab3](https://github.com/NervJS/taro/commit/4cbaab3))
* **h5:** h5增加api createInnerAudioContext ([52703ac](https://github.com/NervJS/taro/commit/52703ac))
* **h5:** h5增加api get/setClipboardData ([e41bb2e](https://github.com/NervJS/taro/commit/e41bb2e))
* **h5:** h5端姑且支持setNavigationBarColor ([776aaea](https://github.com/NervJS/taro/commit/776aaea))
* **h5:** innerAudioContext的一些优化: ([8a4b6c7](https://github.com/NervJS/taro/commit/8a4b6c7))
* **h5:** open api 功能更新 [#2771](https://github.com/NervJS/taro/issues/2771) ([11e89f1](https://github.com/NervJS/taro/commit/11e89f1))
* **h5:** 增加createVideoContext api ([d8a3b0e](https://github.com/NervJS/taro/commit/d8a3b0e))
* **h5:** 增加了chooseVideo api, videoContext api补齐 ([7fb605d](https://github.com/NervJS/taro/commit/7fb605d))
* **ht:** h5增加api pageScrollTo ([b1c5252](https://github.com/NervJS/taro/commit/b1c5252))
* **taro-router-rn:** 添加 showTabBar 和 hideTabBar  的 API ([18298c6](https://github.com/NervJS/taro/commit/18298c6))
* **taro-swan:** 百度小程序重构 props 系统 ([1a6d244](https://github.com/NervJS/taro/commit/1a6d244))
* **taro-tt:** 字节跳动小程序 props 改造 ([0af1d46](https://github.com/NervJS/taro/commit/0af1d46))
* **taro-weapp:** 微信小程序 props 改造 ([e5fa03b](https://github.com/NervJS/taro/commit/e5fa03b))
* **transformer:** 如果用户没有写在循环中写 index，就生成一个匿名 index ([b60f5f1](https://github.com/NervJS/taro/commit/b60f5f1))



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
* **taro-alipay:** 修复支付宝 ref ([59a7cf1](https://github.com/NervJS/taro/commit/59a7cf1))
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
* **taro:** interceptors 没有正确处理异常 ([9743717](https://github.com/NervJS/taro/commit/9743717))
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
* **taro-components:** H5 & Weapp统一pagePath. ([#2575](https://github.com/NervJS/taro/issues/2575)) ([cdd1370](https://github.com/NervJS/taro/commit/cdd1370))
* **taro-redux:** close [#2595](https://github.com/NervJS/taro/issues/2595)，reopen [#1125](https://github.com/NervJS/taro/issues/1125) ([c93dbd5](https://github.com/NervJS/taro/commit/c93dbd5))
* **taro-swan:** 绕过百度小程序合并 setData 导致 properties observer 不触发的问题 ([d18c582](https://github.com/NervJS/taro/commit/d18c582))
* **taroize:** if 和 for 同在一个 tag 时报错，close [#2528](https://github.com/NervJS/taro/issues/2528) ([b366202](https://github.com/NervJS/taro/commit/b366202))
* **taroize:** template import 为兄弟关系时报错, close [#2535](https://github.com/NervJS/taro/issues/2535) ([65504ba](https://github.com/NervJS/taro/commit/65504ba))
* **taroize:** wxml 中包含单个花括号需要转换成 JSX 可以接受的格式 ([649800a](https://github.com/NervJS/taro/commit/649800a))
* **taroize:** 当 state/props 不是一个合法变量名时报错 ([e318812](https://github.com/NervJS/taro/commit/e318812)), closes [#2532](https://github.com/NervJS/taro/issues/2532)
* **transformer:** idea 系内置终端某些情况会乱码，close [#2530](https://github.com/NervJS/taro/issues/2530) ([2cb97b9](https://github.com/NervJS/taro/commit/2cb97b9))
* **transformer:** 支持替换 jsx 中的属性名, close [#2077](https://github.com/NervJS/taro/issues/2077) ([443b1dc](https://github.com/NervJS/taro/commit/443b1dc))
* **webpack-runner:** 修复h5.imageUrlLoaderOption失效的问题 ([abbe23e](https://github.com/NervJS/taro/commit/abbe23e))
* **webpack-runner:** 升级webpack,fix [#2539](https://github.com/NervJS/taro/issues/2539) ([e013892](https://github.com/NervJS/taro/commit/e013892))
* issue [#2534](https://github.com/NervJS/taro/issues/2534) ([418c6b2](https://github.com/NervJS/taro/commit/418c6b2))
* onError 对应的生命周期应是 componentDidCatchError ([#2571](https://github.com/NervJS/taro/issues/2571)) ([abbe73f](https://github.com/NervJS/taro/commit/abbe73f))


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
* **taro-components-rn:** Form: child.type 可能不存在 ([49480f9](https://github.com/NervJS/taro/commit/49480f9))
* **taro-rn:** 修复安卓端 toast 弹窗无法显示图片的问题 ([aec990b](https://github.com/NervJS/taro/commit/aec990b))
* **transformer:** if-else 当中有些变量不会加入 usedState ([b266ead](https://github.com/NervJS/taro/commit/b266ead))
* **transformer:** 只有 map 内部有 if-else 延时赋值匿名变量, close [#2524](https://github.com/NervJS/taro/issues/2524), ([645cda9](https://github.com/NervJS/taro/commit/645cda9)), closes [#2523](https://github.com/NervJS/taro/issues/2523)
* **types:** types of chooseImage ([#2472](https://github.com/NervJS/taro/issues/2472)) ([7be617e](https://github.com/NervJS/taro/commit/7be617e))
* **weapp:** 修复云开发 api 初始化 ([3e26a96](https://github.com/NervJS/taro/commit/3e26a96))


### Features

* **cli:** CLI 去除 expo，添加 react-native 的 packger server 启动 ([5150e59](https://github.com/NervJS/taro/commit/5150e59))
* **cli:** 模板中增加了wba插件的注释 ([2f39b8c](https://github.com/NervJS/taro/commit/2f39b8c))
* **cli:** 跨平台开发方式支持目录判断 ([#2466](https://github.com/NervJS/taro/issues/2466)) ([84d0c3b](https://github.com/NervJS/taro/commit/84d0c3b))
* **cli router:** 支持在app.js的componentWillMount里使用this.$router ([3281851](https://github.com/NervJS/taro/commit/3281851))
* **cli router:** 现在支持在app.js里面调用navigateTo系列api了 ([20d026e](https://github.com/NervJS/taro/commit/20d026e))
* **components:** 增加了navigator组件 ([b7362c0](https://github.com/NervJS/taro/commit/b7362c0))
* **components-rn:** 去掉 components-rn 的 expo 依赖 ([f29bf88](https://github.com/NervJS/taro/commit/f29bf88))
* **components-rn:** 引入 [@ant-design](https://github.com/ant-design)/react-native ([8397adf](https://github.com/NervJS/taro/commit/8397adf))
* **components-rn:** 暴露 lib/provider ([e922160](https://github.com/NervJS/taro/commit/e922160))
* **docs:** 新增微信小程序云开发模板说明 ([667c6d2](https://github.com/NervJS/taro/commit/667c6d2))
* **h5 router:** 对齐this.$router参数 ([564b684](https://github.com/NervJS/taro/commit/564b684))
* **rn:** RN 端支持使用 stylelint 进行样式校验 ([fdaa408](https://github.com/NervJS/taro/commit/fdaa408))
* **rn:** RN 端添加编译时样式校验 close [#2251](https://github.com/NervJS/taro/issues/2251) ([0aadb7e](https://github.com/NervJS/taro/commit/0aadb7e))
* **rn:** 固定 react-native 版本 ([50a3ab3](https://github.com/NervJS/taro/commit/50a3ab3))
* **rn:** 根节点嵌入组件提供的 provider ([7f4183c](https://github.com/NervJS/taro/commit/7f4183c))
* **router:** 增加了未找到页面组件的错误提示 ([aecac84](https://github.com/NervJS/taro/commit/aecac84))
* **router:** 尝试支持reLaunch ([67a5e85](https://github.com/NervJS/taro/commit/67a5e85))
* **taro:** 新增云开发 api 相关 d.ts 文件 ([04657c1](https://github.com/NervJS/taro/commit/04657c1))
* **taro:** 补充 getMenuButtonBoundingClientRect API，close [#2520](https://github.com/NervJS/taro/issues/2520) ([7384cfb](https://github.com/NervJS/taro/commit/7384cfb))
* **taro-components-rn:** 移植 ant-design-mobile-rn 的 Picker Modal Portal 等 ([c523077](https://github.com/NervJS/taro/commit/c523077))
* **taro-rn:** 去除 RN 的 expo 依赖 ([eec6aa1](https://github.com/NervJS/taro/commit/eec6aa1))
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
* **rn:** 优化 RN 端跨平台开发方式 ([a1a74b9](https://github.com/NervJS/taro/commit/a1a74b9))
* **router:** 修改router的打包配置 ([8b1a743](https://github.com/NervJS/taro/commit/8b1a743))
* **taro-components:** 完善 CoverView 的类型定义 ([#2436](https://github.com/NervJS/taro/issues/2436)) ([4c4f0bd](https://github.com/NervJS/taro/commit/4c4f0bd))
* **taro-components:** 精简依赖,移除urijs ([531110b](https://github.com/NervJS/taro/commit/531110b))
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

* **cli:** cannot find module 'fbjs/lib/keyMirror'  close [#2121](https://github.com/NervJS/taro/issues/2121) ([1c324b0](https://github.com/NervJS/taro/commit/1c324b0))
* **components:** 修复 picker 异步数据更新问题, 选中值状态问题。 close [#2343](https://github.com/NervJS/taro/issues/2343) , close [#2253](https://github.com/NervJS/taro/issues/2253) ([1b1bb32](https://github.com/NervJS/taro/commit/1b1bb32))
* **taro:** my.getStorageSync，预览和调试结果返回不一致 ([#2317](https://github.com/NervJS/taro/issues/2317)) ([074ecc0](https://github.com/NervJS/taro/commit/074ecc0))
* **taro-components:** 完善 PickerView 的类型定义 ([#2333](https://github.com/NervJS/taro/issues/2333)) ([3165682](https://github.com/NervJS/taro/commit/3165682))
* **taro-weapp/tt:** 数组 diff 逻辑更改 ([2f82f0c](https://github.com/NervJS/taro/commit/2f82f0c))
* **taroize:** class properies 函数不能使用 arguments，close [#2295](https://github.com/NervJS/taro/issues/2295) ([f62bb85](https://github.com/NervJS/taro/commit/f62bb85))
* **taroize:** 事件名需传入有效的 JavaScript 变量名，close [#2277](https://github.com/NervJS/taro/issues/2277) ([41d3fba](https://github.com/NervJS/taro/commit/41d3fba))
* **transformer:** 修复多重 if 嵌套的问题 ([5e0bf68](https://github.com/NervJS/taro/commit/5e0bf68))
* **transformer:** 单层 if 表达式被当成嵌套 if 表达式解析 ([d8a9cee](https://github.com/NervJS/taro/commit/d8a9cee))
* **transformer:** 循环中有 if-else 时生成匿名表达式位置错误，close [#2352](https://github.com/NervJS/taro/issues/2352) ([b200a70](https://github.com/NervJS/taro/commit/b200a70))
* onColumnChange event.detail.value 应该是下标 ([79eaf17](https://github.com/NervJS/taro/commit/79eaf17))
* taro info rn 卡住的 bug ([a3e5377](https://github.com/NervJS/taro/commit/a3e5377))


### Features

* **eslint:** 内置组件名判断支持匿名类 ([9ed38a9](https://github.com/NervJS/taro/commit/9ed38a9))
* **taro-components-rn:** 增加 WebView, close [#2336](https://github.com/NervJS/taro/issues/2336) ([b9db564](https://github.com/NervJS/taro/commit/b9db564))
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
* **taro-h5:** 添加createAnimation接口 ([466c16d](https://github.com/NervJS/taro/commit/466c16d))
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
* **taro-components:** 修复 Textarea 组件无法传递 detail 问题 ([58456e7](https://github.com/NervJS/taro/commit/58456e7)), closes [#1713](https://github.com/NervJS/taro/issues/1713)
* **taro-weapp:** 修复 weapp 下 this.$router.path 没有赋值的问题。fix [#1814](https://github.com/NervJS/taro/issues/1814) ([831db14](https://github.com/NervJS/taro/commit/831db14))
* **taroize:** slot name 有数字时无法正确处理，[#1876](https://github.com/NervJS/taro/issues/1876) ([1ca6fbd](https://github.com/NervJS/taro/commit/1ca6fbd))
* **taroize:** slot 中元素特殊 attr 没有被正确地处理，fix [#1880](https://github.com/NervJS/taro/issues/1880), fix [#1870](https://github.com/NervJS/taro/issues/1870) ([7a8c9a5](https://github.com/NervJS/taro/commit/7a8c9a5))
* **taroize:** 往 class 传入数组时给予警告并做一个简单 fallback，fix [#1878](https://github.com/NervJS/taro/issues/1878) ([6e80455](https://github.com/NervJS/taro/commit/6e80455))
* **taroize:** 无法解析没有 name 的 slot，close [#1835](https://github.com/NervJS/taro/issues/1835) ([81d615d](https://github.com/NervJS/taro/commit/81d615d))
* **transformer:** &nbsp; 和空格在下一个 children 不是 JSXText 时无效，fix [#1899](https://github.com/NervJS/taro/issues/1899) ([127a68b](https://github.com/NervJS/taro/commit/127a68b))
* **transformer:** JSX children 表达式中的小于号会被 html-prettier 强制换行，fix [#1802](https://github.com/NervJS/taro/issues/1802) ([21910f9](https://github.com/NervJS/taro/commit/21910f9))
* **transformer:** 从 this 中结构 props 失败，close [#1813](https://github.com/NervJS/taro/issues/1813) ([1501cee](https://github.com/NervJS/taro/commit/1501cee))
* **transformer:** 多层嵌套 if-else 无法正确解析，fix [#1910](https://github.com/NervJS/taro/issues/1910) ([2188c92](https://github.com/NervJS/taro/commit/2188c92))
* **transformer:** 开发模式 text 组件也不换行，close [#1831](https://github.com/NervJS/taro/issues/1831) ([5f2174a](https://github.com/NervJS/taro/commit/5f2174a))
* transform scss file with hyphen(-) in the filename ([fa91278](https://github.com/NervJS/taro/commit/fa91278))
* **transformer:** TypeScript 会把装饰器编译为延时赋值，fix [#1840](https://github.com/NervJS/taro/issues/1840) ([c1ee82f](https://github.com/NervJS/taro/commit/c1ee82f))
* **transformer:** 小程序会把 false 渲染出来，[#1812](https://github.com/NervJS/taro/issues/1812) ([4508763](https://github.com/NervJS/taro/commit/4508763))
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

* **input:** 修复 IOS 光标跳转问题 ([71f605f](https://github.com/NervJS/taro/commit/71f605f))
* **taro:** 修正 Taro.getEnv 对头条小程序的判断 ([8bc4293](https://github.com/NervJS/taro/commit/8bc4293))
* **taro-h5:** 补充 Nerv 引用 ([7f30b6f](https://github.com/NervJS/taro/commit/7f30b6f))
* **taro-swan:** 修正百度小程序 componentDidMount 调用 ([cabad00](https://github.com/NervJS/taro/commit/cabad00))
* **transformer:** 循环父级三元表达式的 alternative 没有三元表达式的防御，close [#1698](https://github.com/NervJS/taro/issues/1698) ([7f9ac60](https://github.com/NervJS/taro/commit/7f9ac60))
* **transformer:** 循环的 callee 是函数也需要执行上层的条件判断，close [#1725](https://github.com/NervJS/taro/issues/1725) ([7fab2c4](https://github.com/NervJS/taro/commit/7fab2c4))
* **transformer-wx:** 处理某些小程序组件属性与微信小程序不一致的情况，close [#1792](https://github.com/NervJS/taro/issues/1792) ([17b8689](https://github.com/NervJS/taro/commit/17b8689))
* **webpack-runner:** add esnextModules regex support the modules of cnpm installed ([#1796](https://github.com/NervJS/taro/issues/1796)) ([1bcb017](https://github.com/NervJS/taro/commit/1bcb017))
* 修改 rollup.config.js name 字段的值 ([#1769](https://github.com/NervJS/taro/issues/1769)) ([b757207](https://github.com/NervJS/taro/commit/b757207))


### Features

* **taro:** 增加一个 polyfill 文件 ([8588ddb](https://github.com/NervJS/taro/commit/8588ddb))
* **taro:** 补充新的音频 api ([854c0be](https://github.com/NervJS/taro/commit/854c0be))
* **taroize:** 支持 naming slot, close [#1765](https://github.com/NervJS/taro/issues/1765) ([fba22ea](https://github.com/NervJS/taro/commit/fba22ea))
* **transformer:** Taro API 的回调函数总是推荐使用箭头函数, close [#1693](https://github.com/NervJS/taro/issues/1693) ([cbec912](https://github.com/NervJS/taro/commit/cbec912))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/NervJS/taro/compare/v1.2.2...v1.2.3) (2018-12-29)


### Bug Fixes

* 原生组件 Switch 的 types 增加对 disabled 的类型定义 ([#1762](https://github.com/NervJS/taro/issues/1762)) ([9e28464](https://github.com/NervJS/taro/commit/9e28464))
* **eslint:** 解析非组件/页面 JSX 文件时编译器不启用 eslint 检查, close [#1703](https://github.com/NervJS/taro/issues/1703) ([d0a2bce](https://github.com/NervJS/taro/commit/d0a2bce))
* **input:** 修复 number 类型 maxLength 无效 ([8ae8194](https://github.com/NervJS/taro/commit/8ae8194))
* **RN:** 修复 Navigation 相关方法的事件绑定 ([bdff7f2](https://github.com/NervJS/taro/commit/bdff7f2))
* **RN:** 修复 Taro.navigateTo 返回问题  close[#1735](https://github.com/NervJS/taro/issues/1735) ([3d06b4b](https://github.com/NervJS/taro/commit/3d06b4b))
* **RN:** 修复页面返回不掉用 componentDidShow 和 componentDidHide 的 bug ([90901cc](https://github.com/NervJS/taro/commit/90901cc))
* **taro-components:** 修复Input 组件事件问题 close # 1647 ([7b702e7](https://github.com/NervJS/taro/commit/7b702e7))
* **taro-h5:** 改用 findDOMNode 优化 ([#1754](https://github.com/NervJS/taro/issues/1754)) ([e9eead9](https://github.com/NervJS/taro/commit/e9eead9))
* **textarea:** maxlength 对齐小程序 ([af4d57c](https://github.com/NervJS/taro/commit/af4d57c))
* fix type of animation in MovableViewProps ([#1747](https://github.com/NervJS/taro/issues/1747)) ([0ffaf9f](https://github.com/NervJS/taro/commit/0ffaf9f))
* 修复注释 ([9f22fc8](https://github.com/NervJS/taro/commit/9f22fc8))
* **taro-cli:** build ui 当 TARO_BUILD_TYPE 为 script 时，直接 webpack 打包 ([bb88c7f](https://github.com/NervJS/taro/commit/bb88c7f))
* **transformer:** 组件传参报错找不到代码，close [#1711](https://github.com/NervJS/taro/issues/1711) ([cef17c3](https://github.com/NervJS/taro/commit/cef17c3))


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
* **transformer:** 循环中的 key 会自动从 item 中取值 ([f10c9a5](https://github.com/NervJS/taro/commit/f10c9a5))
* **transformer:** 遵循 JSX 语法，忽略 JSX Text 前后为换行/制表符的情况，close [#1609](https://github.com/NervJS/taro/issues/1609) ([9f873f6](https://github.com/NervJS/taro/commit/9f873f6))
* taro update project 添加 mobx 相关包 close [#1588](https://github.com/NervJS/taro/issues/1588) ([27bc2cb](https://github.com/NervJS/taro/commit/27bc2cb))
* 解决taro init从命令行输入参数无效的问题 ([#1584](https://github.com/NervJS/taro/issues/1584)) ([066d0e4](https://github.com/NervJS/taro/commit/066d0e4))
* **transformer:** 小程序的 key 属性用字符串包裹，而不是 JSX 表达式 ([49bfa70](https://github.com/NervJS/taro/commit/49bfa70))
* **transformer:** 第三方组件事件名有 `-` 需要特殊处理，close [#1559](https://github.com/NervJS/taro/issues/1559) ([6f90d14](https://github.com/NervJS/taro/commit/6f90d14))


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

* fix loading type in ButtonProps ([#1449](https://github.com/NervJS/taro/issues/1449)) ([65efa56](https://github.com/NervJS/taro/commit/65efa56))
* **taroize:** 循环参数只传入 `this` 可能导致爆栈， [#1430](https://github.com/NervJS/taro/issues/1430) ([7e48dbe](https://github.com/NervJS/taro/commit/7e48dbe))
* **transformer:** 循环中 ref 的组件不是根组件或自带 ID 无效，close [#1395](https://github.com/NervJS/taro/issues/1395) ([b1fa2b9](https://github.com/NervJS/taro/commit/b1fa2b9))
* **transformer:** 百度小程序用 = = 包裹的属性只有一个花括号，close [#1443](https://github.com/NervJS/taro/issues/1443) ([932eabb](https://github.com/NervJS/taro/commit/932eabb))
* **transformer:** 语句中 this 作用域对值出现两次或以上转换失败， close [#1423](https://github.com/NervJS/taro/issues/1423) ([49527e8](https://github.com/NervJS/taro/commit/49527e8))


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

* **cli:** ui 库打包优化 ([320f80c](https://github.com/NervJS/taro/commit/320f80c))
* **cli:** 监听非 源码目录 ([#1242](https://github.com/NervJS/taro/issues/1242)) ([8c8e871](https://github.com/NervJS/taro/commit/8c8e871))
* **mobx:** Mobx优化 ([#1276](https://github.com/NervJS/taro/issues/1276)) ([138c282](https://github.com/NervJS/taro/commit/138c282)), closes [#1262](https://github.com/NervJS/taro/issues/1262)
* **transformer:** 支持在 switch-case 中使用 JSX，close [#1275](https://github.com/NervJS/taro/issues/1275) ([82a6100](https://github.com/NervJS/taro/commit/82a6100))
* **webpack-runner:** h5支持esnextModules配置 ([2b759b5](https://github.com/NervJS/taro/commit/2b759b5))
* simple ID generate for every swiper instance. ([b29db89](https://github.com/NervJS/taro/commit/b29db89))



<a name="1.2.0-beta.4"></a>
# [1.2.0-beta.4](https://github.com/NervJS/taro/compare/v1.2.0-beta.3...v1.2.0-beta.4) (2018-11-28)


### Bug Fixes

* **router-h5:** iOS12里面返回Hash会丢问题 ([#1285](https://github.com/NervJS/taro/issues/1285)) ([1bceea3](https://github.com/NervJS/taro/commit/1bceea3))
* generateScopedName ([#1286](https://github.com/NervJS/taro/issues/1286)) ([00e288b](https://github.com/NervJS/taro/commit/00e288b))
* **cli:** 当配置 npm 目录时路径替换可能不正确 ([3974aaf](https://github.com/NervJS/taro/commit/3974aaf))
* **cli:** 编译到支付宝时路径中的 @ 替换为 _ ([d09cc2d](https://github.com/NervJS/taro/commit/d09cc2d))
* **router:** 修复router打包后仍存在部分非法关键字的问题 ([3d6e5e8](https://github.com/NervJS/taro/commit/3d6e5e8))
* **taro-rn:** 更改taro-rn的导出方式,close[#1238](https://github.com/NervJS/taro/issues/1238) ([cac3010](https://github.com/NervJS/taro/commit/cac3010))
* **taro-weapp:** 修复request abort的暴露方式 ([43c23a9](https://github.com/NervJS/taro/commit/43c23a9))
* **taro-weapp:** 修复requestTask的调用方式 ([a06f33c](https://github.com/NervJS/taro/commit/a06f33c))
* **taro-weapp:** 增加 getElementById 函数供编译时在循环中获取 ref 节点使用 ([a52fdc4](https://github.com/NervJS/taro/commit/a52fdc4))
* **taro-wepaa:** 修复request abort的暴露方式 ([b2c035c](https://github.com/NervJS/taro/commit/b2c035c))


### Features

* **transformer:** 当自定义组件需要组织冒泡时加入 `data-e-stop` ([cee4462](https://github.com/NervJS/taro/commit/cee4462))
* **transformer:** 支持在循环中使用 ref ([292c945](https://github.com/NervJS/taro/commit/292c945))



<a name="1.2.0-beta.3"></a>
# [1.2.0-beta.3](https://github.com/NervJS/taro/compare/v1.2.0-beta.2...v1.2.0-beta.3) (2018-11-26)


### Bug Fixes

* **taro:** 修复多个小程序 request 请求 abort 的 露出方式 ([527d168](https://github.com/NervJS/taro/commit/527d168))
* **taro:** 百度/支付宝/头条小程序运行时框架同步微信小程序员运行时框架修改 && 部分 eslint 问题修复 ([528735f](https://github.com/NervJS/taro/commit/528735f))
* **taro-weapp:** 修复request abort的暴露方式 ([9eb0bf4](https://github.com/NervJS/taro/commit/9eb0bf4))
* **taro-weapp:** 修复requestTask的调用方式 ([a0cb8d3](https://github.com/NervJS/taro/commit/a0cb8d3))
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

* **showActionSheet:** fix未设置webkitTransform导致菜单不能弹出的bug ([#1217](https://github.com/NervJS/taro/issues/1217)) ([0f7678f](https://github.com/NervJS/taro/commit/0f7678f))
* **taro-alipay:** 修复 removeStorageSync fix [#1207](https://github.com/NervJS/taro/issues/1207) ([638c3fb](https://github.com/NervJS/taro/commit/638c3fb))
* **taro-alipay:** 修复支付宝小程序 query 对象没有 in 方法的问题 fix [#1224](https://github.com/NervJS/taro/issues/1224) ([ff2d6f0](https://github.com/NervJS/taro/commit/ff2d6f0))
* **taro-cli:** 解决组件循环依赖不断编译爆栈的问题 fix [#696](https://github.com/NervJS/taro/issues/696) ([e735cb3](https://github.com/NervJS/taro/commit/e735cb3))
* **taro-redux:** store 变化后被影响的 Component 立即做 setData 更新。防止子组件在 observe 更新的情况下重新计算 props ，从而覆盖掉 redux 修改的 props。fix [#1125](https://github.com/NervJS/taro/issues/1125) ([375ab1d](https://github.com/NervJS/taro/commit/375ab1d))
* **transformer:** 在同一文件中重复 import, close [#1208](https://github.com/NervJS/taro/issues/1208) ([3e0b82f](https://github.com/NervJS/taro/commit/3e0b82f))
* **transformer:** 当 if block 中有 JSX 定义而不是 return，不会重命名 ([341101a](https://github.com/NervJS/taro/commit/341101a)), closes [#1209](https://github.com/NervJS/taro/issues/1209)
* **transformer:** 生成匿名数组需要带上父组件的条件判断, close [#1228](https://github.com/NervJS/taro/issues/1228) ([4ebd214](https://github.com/NervJS/taro/commit/4ebd214))
* **webpack-runner:** H5 端 postcss 插件 bug 修复 ([6793ce2](https://github.com/NervJS/taro/commit/6793ce2))
* **webpack-runner:** 修复h5样式丢失的问题 ([64d8cc4](https://github.com/NervJS/taro/commit/64d8cc4))
* node-sass 编译有时候无输出的 bug ([e011610](https://github.com/NervJS/taro/commit/e011610))


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
* **taro-components-rn:** Image resizeMode add ([fd74b35](https://github.com/NervJS/taro/commit/fd74b35))
* **taro-components-rn:** Image 支持 widthFix ([4d41a5d](https://github.com/NervJS/taro/commit/4d41a5d))
* **taro-components-rn:** 新组件 Video ([2a1db5b](https://github.com/NervJS/taro/commit/2a1db5b))
* **taro-components-rn:** 补充：支持 Image 对本地图片的 widthFix ([837b62c](https://github.com/NervJS/taro/commit/837b62c))
* **transformer:** 当在复杂循环中使用 this.state.xx.xx 给出修改建议, close [#886](https://github.com/NervJS/taro/issues/886) ([d6ee88f](https://github.com/NervJS/taro/commit/d6ee88f))
* **weapp:** 组件同样拥有 componentDidShow/componentDidHide 生命周期，close [#1048](https://github.com/NervJS/taro/issues/1048) ([4bb99cd](https://github.com/NervJS/taro/commit/4bb99cd))
* 给Swiper传递样式中的height ([7d630e8](https://github.com/NervJS/taro/commit/7d630e8))



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

* **cli:** usingComponents 支持写以 src 为根目录的绝对路径，close [#945](https://github.com/NervJS/taro/issues/945) ([2f20419](https://github.com/NervJS/taro/commit/2f20419))
* **cli:** 支持 NODE_ENV 自定义，close [#947](https://github.com/NervJS/taro/issues/947) ([8020dd1](https://github.com/NervJS/taro/commit/8020dd1))
* **RN:**  添加 RN 端 watch 代码按需编译。 ([573debc](https://github.com/NervJS/taro/commit/573debc))
* **taro:** 匿名函数转换后标记统一改为 funPrivate，close [#956](https://github.com/NervJS/taro/issues/956) ([86e01b9](https://github.com/NervJS/taro/commit/86e01b9))
* update RN  docs ([aa0f98d](https://github.com/NervJS/taro/commit/aa0f98d))



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
* **eslint:** 生命周期在 function-naming 中报错，[#799](https://github.com/NervJS/taro/issues/799) ([6fee18a](https://github.com/NervJS/taro/commit/6fee18a))
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
* **taro-weapp:** 修复 json diff ([4ed1d45](https://github.com/NervJS/taro/commit/4ed1d45))
* **webpackChain:** 漏传第二个参数webpack ([1f9e9e2](https://github.com/NervJS/taro/commit/1f9e9e2))


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
* **transformer:** 百度小程序特殊处理 getApp ([5b6a2fe](https://github.com/NervJS/taro/commit/5b6a2fe))
* **transformer:** 百度小程序的 for 值使用字符串包裹 ([f5470f3](https://github.com/NervJS/taro/commit/f5470f3))


### Features

* **cli:** cli 支持将 [@tarojs](https://github.com/tarojs)/taro 替换成多个端的运行时框架 ([268fa55](https://github.com/NervJS/taro/commit/268fa55))
* **cli:** cli 改造，支持生成百度小程序等其他小程序的文件 ([476a6c9](https://github.com/NervJS/taro/commit/476a6c9))
* **cli:** 增加百度小程序类型 ([532876c](https://github.com/NervJS/taro/commit/532876c))
* **cli:** 生成 swan 的项目配置文件 ([a49c65e](https://github.com/NervJS/taro/commit/a49c65e))
* **taro:** 新增百度小程序 api ([2b2d0e2](https://github.com/NervJS/taro/commit/2b2d0e2))
* **taro-swan:** 添加百度小程序运行时 ([8ea98a0](https://github.com/NervJS/taro/commit/8ea98a0))
* **transformer:** 支持百度小程序 ([c899396](https://github.com/NervJS/taro/commit/c899396))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/NervJS/taro/compare/v1.0.6...v1.0.7) (2018-09-29)


### Bug Fixes

* **cli:** h5页面的require加了default ([80c532a](https://github.com/NervJS/taro/commit/80c532a))
* **cli:** 修复h5页面import的顺序问题 ([3042291](https://github.com/NervJS/taro/commit/3042291))
* **transformer:**  无法渲染 class 依赖计算属性（get）, close [#728](https://github.com/NervJS/taro/issues/728) ([20ed37e](https://github.com/NervJS/taro/commit/20ed37e))



<a name="1.0.6"></a>
## [1.0.6](https://github.com/NervJS/taro/compare/v1.0.5...v1.0.6) (2018-09-29)


### Bug Fixes

* **cli:** unicode 编码处理,close [#701](https://github.com/NervJS/taro/issues/701), [#741](https://github.com/NervJS/taro/issues/741) ([d97d0dc](https://github.com/NervJS/taro/commit/d97d0dc))
* **taro-qapp:** showToast参数不正确 ([4922113](https://github.com/NervJS/taro/commit/4922113))
* **transformer:** 使用循环体内定义的变量来构造新循环报错 ([5ecb95b](https://github.com/NervJS/taro/commit/5ecb95b))
* **transformer:** 微信的 key 只支持变量读取，不支持计算 ([39ec985](https://github.com/NervJS/taro/commit/39ec985))
* drawImage类型异常 ([52d9029](https://github.com/NervJS/taro/commit/52d9029))
* **webpack-runner:** 修复csso配置的读取错误 ([fa4177d](https://github.com/NervJS/taro/commit/fa4177d))
* Duplicate identifier 'buffer'. ([8f4cdda](https://github.com/NervJS/taro/commit/8f4cdda))


### Features

* **router:** router改用typescript ([3175efb](https://github.com/NervJS/taro/commit/3175efb))
* **router:** 暂时将page加载改为同步 ([a376b79](https://github.com/NervJS/taro/commit/a376b79))
* **router:** 补回了getCurrentPages函数 ([0388d1f](https://github.com/NervJS/taro/commit/0388d1f))
* **taro-qapp:** 添加 router的navigateTo、redirectTo ([508134a](https://github.com/NervJS/taro/commit/508134a))
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
* **cli:** 组件引用支持写组件文件后缀 ([bbaa88b](https://github.com/NervJS/taro/commit/bbaa88b))
* **RN:** 修复页面 navigation 配置失效的 bug ([132a6a2](https://github.com/NervJS/taro/commit/132a6a2))
* **taro-rn:** 修复request api方法为get时的入参问题 ([6e62724](https://github.com/NervJS/taro/commit/6e62724))
* **transformer:** 循环体内引入外部数组变量会重复赋值，close [#666](https://github.com/NervJS/taro/issues/666) ([21d3302](https://github.com/NervJS/taro/commit/21d3302))
* **transformer:** 没有 import [@tarojs](https://github.com/tarojs)/taro 时强制添加 ([f07e068](https://github.com/NervJS/taro/commit/f07e068))
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
* **webpack-runner:** 整理webpack-runner的log函数 ([3928eb3](https://github.com/NervJS/taro/commit/3928eb3))
* **webpack-runner:** 添加dll编译支持 ([1b8b20d](https://github.com/NervJS/taro/commit/1b8b20d))
* **webpack-runner:** 简化重复的配置处理代码 ([cd13823](https://github.com/NervJS/taro/commit/cd13823))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/NervJS/taro/compare/v1.0.2...v1.0.3) (2018-09-20)


### Bug Fixes

* **cli:** 模板缺少文件，close [#660](https://github.com/NervJS/taro/issues/660) ([1dc3243](https://github.com/NervJS/taro/commit/1dc3243))
* **RN:** 修复项目初始化后 less 编译报错 [#650](https://github.com/NervJS/taro/issues/650) ([d05df59](https://github.com/NervJS/taro/commit/d05df59))
* **transformer:** 三元表达式有一个值为循环调用时生成两个相同循环 ([b85d04d](https://github.com/NervJS/taro/commit/b85d04d))
* **transformer:** 多层循环访问上层迭代值时没有加上 $$original ([b8d5168](https://github.com/NervJS/taro/commit/b8d5168))
* **weapp:** 梳理事件传递时绑定作用域的各种情形 ([c345770](https://github.com/NervJS/taro/commit/c345770))


### Features

* **taro-qapp:** 增加 storage 相关 api ([ca2ddb2](https://github.com/NervJS/taro/commit/ca2ddb2))
* **transformer:**  adapter 数据结构和操作 ([670cb3e](https://github.com/NervJS/taro/commit/670cb3e))
* **weapp:** 支持配置propTypes ([8ee93e9](https://github.com/NervJS/taro/commit/8ee93e9))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/NervJS/taro/compare/v1.0.1...v1.0.2) (2018-09-19)


### Bug Fixes

* **component:** 暂时规避Nerv diff数组的问题 ([e04df79](https://github.com/NervJS/taro/commit/e04df79))
* **transformer:** 在 if block 中定义的 JSX 变量无法在 JSX children 替换 ([3878e84](https://github.com/NervJS/taro/commit/3878e84))
* **transformer:** 在 if block 定义没有初始值的变量报错 ([fa5c6ec](https://github.com/NervJS/taro/commit/fa5c6ec))
* **transformer:** 直接 return 一个 JSX 引用失效 ([8772038](https://github.com/NervJS/taro/commit/8772038))


### Features

* **cli:** ts 模板声明图片和 css 为模块 ([555ee9b](https://github.com/NervJS/taro/commit/555ee9b))
* **RN:** RN 端支持 typescript ([f999a2c](https://github.com/NervJS/taro/commit/f999a2c))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/NervJS/taro/compare/v1.0.0...v1.0.1) (2018-09-18)


### Bug Fixes

* **cli:** H5 编译时去掉无用的 import 代码 ([a406d9e](https://github.com/NervJS/taro/commit/a406d9e))
* **taro:** getEnv rn 端环境变量错误 ([6f02583](https://github.com/NervJS/taro/commit/6f02583))
* **transformer:** TARO_ENV 解析不正确 ([780cf9f](https://github.com/NervJS/taro/commit/780cf9f))



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

* **cli:** 小程序支持插件引用 ([0d256fe](https://github.com/NervJS/taro/commit/0d256fe))
* **cli:** 模板增加 rn 编译 script ([a216ee8](https://github.com/NervJS/taro/commit/a216ee8))
* **taro:** 增加 Taro.requirePlugin 调用插件 JS 接口 ([f65c51f](https://github.com/NervJS/taro/commit/f65c51f))
* **transformer:** 在 render 中提前 return null 可以终止 render ([a093b8e](https://github.com/NervJS/taro/commit/a093b8e))
* 文档底部导航兼容移动端 ([1a49e2f](https://github.com/NervJS/taro/commit/1a49e2f))
* 更新.gitignore ([3fac0d9](https://github.com/NervJS/taro/commit/3fac0d9))
* 更新siteConfig.js ([bebe4c0](https://github.com/NervJS/taro/commit/bebe4c0))



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

* **cli:** json 文件解析错误, close [#547](https://github.com/NervJS/taro/issues/547) ([176c117](https://github.com/NervJS/taro/commit/176c117))
* **RN:** 修复全局样式文件硬编码的问题 ([f5012a3](https://github.com/NervJS/taro/commit/f5012a3))
* **taro-components:** input 去除默认字体 && 删除样式 Swpier 样式分号问题 ([40e8828](https://github.com/NervJS/taro/commit/40e8828))
* **taro-weapp:** 补全完整的错误提示 ([bf1b89f](https://github.com/NervJS/taro/commit/bf1b89f))
* **transformer:** 第三方组件也应该正常处理事件 ([2920f33](https://github.com/NervJS/taro/commit/2920f33))
* **transformer-wx:** 增加默认基础组件，fix [#562](https://github.com/NervJS/taro/issues/562) ([e288fc4](https://github.com/NervJS/taro/commit/e288fc4))
* **weapp:** 修复props传递函数bind作用域被覆盖问题 ([5676b80](https://github.com/NervJS/taro/commit/5676b80))
* **weapp:** 修复在render中通过return来中断代码执行可能会造成state丢失的问题 ([5402dff](https://github.com/NervJS/taro/commit/5402dff))
* mapStateToProps 缺少第二个参数ownProps ([0236314](https://github.com/NervJS/taro/commit/0236314))


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
* **weapp:** 生命周期与小程序靠齐,页面初始化时机提前至attached ([e9e089b](https://github.com/NervJS/taro/commit/e9e089b))



<a name="1.0.0-beta.20"></a>
# [1.0.0-beta.20](https://github.com/NervJS/taro/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2018-08-29)


### Bug Fixes

* **taro-components:** 修复 Swiper onChange 事件 && Input type 值优化 ([077f634](https://github.com/NervJS/taro/commit/077f634))
* **transformer:** 在 JSX 中使用注释会导致 Windows 多出一个空行 ([1051b45](https://github.com/NervJS/taro/commit/1051b45))



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
* **taro-components:** 修复  Input 组件 h5 端 事件返回值问题 ([96d4790](https://github.com/NervJS/taro/commit/96d4790))
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
* **taro:** 增加 taro-utils ([e5981ae](https://github.com/NervJS/taro/commit/e5981ae))
* **taro-redux:** 修正 redux 包发布目录 ([da10a0a](https://github.com/NervJS/taro/commit/da10a0a))
* 新增 taro h5 模式的动态加载 import() 功能 ([36cb172](https://github.com/NervJS/taro/commit/36cb172))
* **RN:** 添加装饰器写法的支持 ([31b6d21](https://github.com/NervJS/taro/commit/31b6d21))
* **taro-components:**  Input 组件 H5 端新增 file 类型 ([f0cf015](https://github.com/NervJS/taro/commit/f0cf015))
* **taro-router-rn:** 优化滚动代码 ([14e2db6](https://github.com/NervJS/taro/commit/14e2db6))
* **weapp:** 将组件里的static方法同步到小程序实例上 ([0aec65f](https://github.com/NervJS/taro/commit/0aec65f))



<a name="1.0.0-beta.11"></a>
# [1.0.0-beta.11](https://github.com/NervJS/taro/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2018-08-16)


### Bug Fixes

* **cli:** H5 端编译增加插入 Taro.initPxTransform 初始化 ([f27552f](https://github.com/NervJS/taro/commit/f27552f))
* **cli:** 更正 UI 库编译提示 ([fb71d60](https://github.com/NervJS/taro/commit/fb71d60))
* **router:** 将typing文件移到type文件夹中 ([8553821](https://github.com/NervJS/taro/commit/8553821))
* **taro-components:** 修复h5 点击态阴影问题 ([7592648](https://github.com/NervJS/taro/commit/7592648))
* **taro-components:** 去除 input 的 min-height 默认样式 ([5aaac3a](https://github.com/NervJS/taro/commit/5aaac3a))
* **transformer:** 属性名为 `bind` 或 catch 的情况 ([6a1670a](https://github.com/NervJS/taro/commit/6a1670a))
* **transformer:** 当 if 中有复杂表达式时生成匿名 state 错误 ([82d3774](https://github.com/NervJS/taro/commit/82d3774))
* **weapp:** 初始化的时候将render替换为_createData ([8ab9f4d](https://github.com/NervJS/taro/commit/8ab9f4d))


### Features

* **cli:** appOutput 配置下决定 app.wxss 是否生成 ([819a6cc](https://github.com/NervJS/taro/commit/819a6cc))
* **cli:** 完善 UI 库 H5 端编译 ([af58bdb](https://github.com/NervJS/taro/commit/af58bdb))
* Update common.d.ts ([3315e9a](https://github.com/NervJS/taro/commit/3315e9a))
* Update Picker.d.ts ([0e26b27](https://github.com/NervJS/taro/commit/0e26b27))
* **cli:** UI 库编译功能完善 + 小程序端引用 UI 库 ([a046b47](https://github.com/NervJS/taro/commit/a046b47))
* **RN:** 支持 RN 编译时终端提示不支持的样式 ([e3657bf](https://github.com/NervJS/taro/commit/e3657bf))
* **RN:** 编译时自动检测并安装 babel-plugin-transform-jsx-stylesheet 插件 ([835ad49](https://github.com/NervJS/taro/commit/835ad49))
* **weapp:** 补充forceUpdate ([32cc5aa](https://github.com/NervJS/taro/commit/32cc5aa))
* **webpack-runner:** 调整 webpack 插件配置顺序 ([377cffc](https://github.com/NervJS/taro/commit/377cffc))



<a name="1.0.0-beta.10"></a>
# [1.0.0-beta.10](https://github.com/NervJS/taro/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2018-08-14)


### Bug Fixes

* **weapp:** 小程序canvas touch事件无currentTarget事件 ([f049b90](https://github.com/NervJS/taro/commit/f049b90))
* 更新 PickView 示例 & 修复 ScrollView 滚动问题 ([553aea3](https://github.com/NervJS/taro/commit/553aea3))
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


### Features

* **cli:** h5版本处理tsx的时候不再保留tsx后缀名 ([441448b](https://github.com/NervJS/taro/commit/441448b))
* **cli:** h5版本移除引用脚本的后缀名 ([84052a4](https://github.com/NervJS/taro/commit/84052a4))
* **cli:** 修改ts 模板的 require 使用webpack-env的typing文件 ([8fe9a20](https://github.com/NervJS/taro/commit/8fe9a20))
* **cli:** 增加 UI 库编译功能 ([8c30ab1](https://github.com/NervJS/taro/commit/8c30ab1))
* **cli:** 小程序端支持组件 export ... from ... 写法 ([27ff33e](https://github.com/NervJS/taro/commit/27ff33e))
* **cli:** 小程序端支持自定义 env ([d0ba5ef](https://github.com/NervJS/taro/commit/d0ba5ef))
* **cli:** 默认 ts 模板支持使用 require ([b35f952](https://github.com/NervJS/taro/commit/b35f952))
* **eslint:** 新的 eslint 规则：自定义组件关键字 ([b9d3173](https://github.com/NervJS/taro/commit/b9d3173))
* **RN:**  支持 Redux ，默认开启 Page 滚动 ([ae5ab78](https://github.com/NervJS/taro/commit/ae5ab78))
* **taro:** Component 加上 $router 的 typing ([604c0fa](https://github.com/NervJS/taro/commit/604c0fa))
* **taro:** 修复 config 的 typing，close [#447](https://github.com/NervJS/taro/issues/447) ([da65f27](https://github.com/NervJS/taro/commit/da65f27))
* **transformer:** 支持直接传入 this.$router 的参数 ([706f394](https://github.com/NervJS/taro/commit/706f394))
* **webpack-runner:** webpack-runner不再需要ts-loader ([89559de](https://github.com/NervJS/taro/commit/89559de))
* add component SwiperItem ([2420af0](https://github.com/NervJS/taro/commit/2420af0))



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

* 添加注释，去除 package-lock-json ([9d17a6a](https://github.com/NervJS/taro/commit/9d17a6a))
* **cli:** 修复h5中缺少一个变量定义的问题 ([1688e53](https://github.com/NervJS/taro/commit/1688e53))
* **taro-cli:** RN 开启 watch 样式文件不重新编译 ([23fba9f](https://github.com/NervJS/taro/commit/23fba9f))
* **transformer:** 处理 this.state.a.b[this.state.a.b.c] 这样的情况 ([ba458c9](https://github.com/NervJS/taro/commit/ba458c9))
* **transformer:** 某些情况成员表达式不会加入到 pendingState ([e4029bd](https://github.com/NervJS/taro/commit/e4029bd))


### Features

* **cli:** 小程序端 npm 目录支持配置 ([9a816a5](https://github.com/NervJS/taro/commit/9a816a5))
* **cli:** 小程序端支持自定义组件基类继承的形式 ([0b2a5fd](https://github.com/NervJS/taro/commit/0b2a5fd))
* **cli:** 小程序端新增是否需要生成 app.js、app.json 文件的配置选项 ([23fd918](https://github.com/NervJS/taro/commit/23fd918))
* **taro-compontens:** 补全文档及示例代码 ([3368869](https://github.com/NervJS/taro/commit/3368869))
* **taro-router0rn:**  taro-router-rn 添加进 learna，使用 ejs 模版生成 RN 工程的 package.json ([47225aa](https://github.com/NervJS/taro/commit/47225aa))
* **transformer:** 支持在 if 中使用 bind 对象或使用字面量对象 ([e6b005a](https://github.com/NervJS/taro/commit/e6b005a))
* **transformer:** 支持继承自定义组件 ([1a339c7](https://github.com/NervJS/taro/commit/1a339c7))
* **weapp:** 组件提前计算好初始的state,并将初次setData执行时机提前到attached中 ([26ffa3a](https://github.com/NervJS/taro/commit/26ffa3a))
* RN 上拉下拉组件 ([87e0e5f](https://github.com/NervJS/taro/commit/87e0e5f))



<a name="1.0.0-beta.6"></a>
# [1.0.0-beta.6](https://github.com/NervJS/taro/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2018-08-02)


### Bug Fixes

* **cli:** windows 下 watch 组件编译加个延时 ([94cc025](https://github.com/NervJS/taro/commit/94cc025))
* **cli:** 兼容 app 的 constructor 中使用 this.config= 来定义 config 的写法 ([9ce5580](https://github.com/NervJS/taro/commit/9ce5580))
* **taro:** 增加 style 传入 null 及 undefined 的容错 ([037ad37](https://github.com/NervJS/taro/commit/037ad37))
* **taro:** 当样式为 null 或 undefined 时返回空字符串 ([f50b27e](https://github.com/NervJS/taro/commit/f50b27e))
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
* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([8271c0f](https://github.com/NervJS/taro/commit/8271c0f))
* **taro-weapp:** 修复setData 前移出掉数据中的函数时将null转换成空对象问题 ([3a914ca](https://github.com/NervJS/taro/commit/3a914ca))
* **taro-weapp:** 修复state里空数组会被移除的问题 ([3252241](https://github.com/NervJS/taro/commit/3252241))
* **taro-weapp:** 修复将page的数据初始化提前构造函数中的数据丢失问题 ([39b5401](https://github.com/NervJS/taro/commit/39b5401))
* require 页面遗漏 default ([18dd571](https://github.com/NervJS/taro/commit/18dd571))


### Features

* **eslint:** 新规则 class naming，自定义组件不得与原生组件重名 ([329ec3a](https://github.com/NervJS/taro/commit/329ec3a))
* **taro-rn:** 增加media的测试用例 ([935cd00](https://github.com/NervJS/taro/commit/935cd00))
* **transformer:** 使用 typescript 编译 .tsx 文件，may fix [#396](https://github.com/NervJS/taro/issues/396) [#392](https://github.com/NervJS/taro/issues/392) ([61d3e24](https://github.com/NervJS/taro/commit/61d3e24))
* **weapp:** 小程序的 properties 从 defaultProps 当中找 ([96ae2d4](https://github.com/NervJS/taro/commit/96ae2d4))
* App 里 Header 相关配置的转换。 ([746ca09](https://github.com/NervJS/taro/commit/746ca09))
* tabBar 配置与切换 ([9aaf5a7](https://github.com/NervJS/taro/commit/9aaf5a7))
* 创建中间层 Component，注入 $router ([9f0f79a](https://github.com/NervJS/taro/commit/9f0f79a))
* 改变 app.js 里的 render return ([2fdb804](https://github.com/NervJS/taro/commit/2fdb804))
* 添加 getCurrentPages 方法，补充注释 ([6b73e53](https://github.com/NervJS/taro/commit/6b73e53))
* **taro-cli:** RN 编译添加 watch 功能 ([73f7cfd](https://github.com/NervJS/taro/commit/73f7cfd))
* **taro-cli:** 添加 RN 的编译时间 log ([6efda66](https://github.com/NervJS/taro/commit/6efda66))
* **taro-rn:** package.json 模板提取出去 ([7689b22](https://github.com/NervJS/taro/commit/7689b22))
* **transformer:** 在构造器里声明类函数 ([f317934](https://github.com/NervJS/taro/commit/f317934))
* tabBar 默认样式及样式关联 ([289fd80](https://github.com/NervJS/taro/commit/289fd80))
* 去掉对 pages 配置字段的处理，直接作为 ScreenName ([8d1ff98](https://github.com/NervJS/taro/commit/8d1ff98))
* 实现页面跳转 ([9406669](https://github.com/NervJS/taro/commit/9406669))
* 添加默认头部样式 ([a920e98](https://github.com/NervJS/taro/commit/a920e98))
* 转换页面 config 中头部相关的配置 ([9a685b1](https://github.com/NervJS/taro/commit/9a685b1))
* 重构	createStackNavigator ，通过Taro.initRouter初始化路由 ([dfcd11f](https://github.com/NervJS/taro/commit/dfcd11f))
* **taro-router-rn:** config 配置信息读取，生成 RootStack ([b2a1c94](https://github.com/NervJS/taro/commit/b2a1c94))
* **taro-router-rn:** 添加工程 ([8597f9b](https://github.com/NervJS/taro/commit/8597f9b))
* **taro-router-rn:** 生成 RootStack ([014abe8](https://github.com/NervJS/taro/commit/014abe8))



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

* **cli:** 小程序端编译支持 Taro 代码与原生小程序页面、组件代码混写 ([8d47c46](https://github.com/NervJS/taro/commit/8d47c46))
* **cli:** 小程序端编译支持引用第三方组件 ([66de1ca](https://github.com/NervJS/taro/commit/66de1ca))
* **core:** 新的内部方法: internal_inline_style ([27c2cd2](https://github.com/NervJS/taro/commit/27c2cd2))
* **taro-weapp:** weapp 增加 compile 配置用于配置编译时的一些操作 ([815f67c](https://github.com/NervJS/taro/commit/815f67c))
* **transformer:** 在生命周期使用 props.xx 也会注入到 static properties ([68d5817](https://github.com/NervJS/taro/commit/68d5817))
* **transformer:** 提升错误报告的健壮性 ([2b15281](https://github.com/NervJS/taro/commit/2b15281))
* **transformer|cli:** 类定义支持 ClassDeclaration 和 ClassExpression 两种模式 ([c34bd14](https://github.com/NervJS/taro/commit/c34bd14))



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/NervJS/taro/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2018-07-30)


### Bug Fixes

* **cli:** 在app.js中加入componentDidShow/componentDidHide的调用 ([e8376cf](https://github.com/NervJS/taro/commit/e8376cf))
* **cli:** 默认模版类型拓展为 .js、.jsx、.tsx ([90b2e0a](https://github.com/NervJS/taro/commit/90b2e0a))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([54ca2a1](https://github.com/NervJS/taro/commit/54ca2a1))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([b7213f9](https://github.com/NervJS/taro/commit/b7213f9))
* **taro-weapp:** 修复属性中函数作为条件判断的情况 ([a9a48f5](https://github.com/NervJS/taro/commit/a9a48f5))
* **taro-weapp:** 修正 defaultProps 获取 ([19b4f15](https://github.com/NervJS/taro/commit/19b4f15))
* **taro-weapp:** 修正 props 中 redux 函数传递 ([6841694](https://github.com/NervJS/taro/commit/6841694))
* **taro-weapp:** 函数类型属性处理错误 ([7d10b01](https://github.com/NervJS/taro/commit/7d10b01))
* **transformer:** slot 标签不需要加 _triggerObserer ([991d1c2](https://github.com/NervJS/taro/commit/991d1c2))
* **transformer:** 在 JSX 中使用数组对象会被识别为复杂表达式 ([c893c84](https://github.com/NervJS/taro/commit/c893c84))
* **transformer:** 当有多个匿名 state 且没有写 return 时循环组件生成匿名 state 异常 ([5328171](https://github.com/NervJS/taro/commit/5328171))
* **transformer:** 自定义组件调用从 this.props 的函数应该加入到 static properties ([45ac75f](https://github.com/NervJS/taro/commit/45ac75f))


### Features

* **eslint:** 只有 Taro.Component 作用域下方法命名规范才起作用 ([0082e99](https://github.com/NervJS/taro/commit/0082e99))
* **eslint:** 新的函数命名规范 ([63cb96a](https://github.com/NervJS/taro/commit/63cb96a))
* **taro-h5:** 增加 request 的测试用例 ([bc8e2ab](https://github.com/NervJS/taro/commit/bc8e2ab))
* **taro-rn:** 增加request的测试用例 ([37f40b4](https://github.com/NervJS/taro/commit/37f40b4))
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



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/NervJS/taro/compare/v0.0.73...v1.0.0-beta.0) (2018-07-26)


### Bug Fixes

* **cli:** page 类型仍然需要 Page() 工厂函数初始化 ([1172b12](https://github.com/NervJS/taro/commit/1172b12))
* **cli:** 导入组件 Component 重命名为 `BaseComponent` ([b2880b1](https://github.com/NervJS/taro/commit/b2880b1))
* **cli:** 页面是 Page 类型 createComponent 应该传参 true ([730f158](https://github.com/NervJS/taro/commit/730f158))
* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([77c99d4](https://github.com/NervJS/taro/commit/77c99d4))
* **redux-h5:** 修复redux-h5 componenetDidShow时丢失this的问题 ([6a8d887](https://github.com/NervJS/taro/commit/6a8d887))
* **taro-rn:** 修复Clipboard的测试用例 ([f9a35e5](https://github.com/NervJS/taro/commit/f9a35e5))
* **taro-weapp:** setData之前过滤掉undefined字段 ([969faf8](https://github.com/NervJS/taro/commit/969faf8))
* **taro-weapp:** setState不会触发当前组件receiveProps ([c8ec2f8](https://github.com/NervJS/taro/commit/c8ec2f8))
* **taro-weapp:** 事件触发兼容redux actions 链式调用 ([02bc67c](https://github.com/NervJS/taro/commit/02bc67c))
* **taro-weapp:** 修复异步循环组件不触发willMount生命周期问题 ([ead6ae6](https://github.com/NervJS/taro/commit/ead6ae6))
* **taro-weapp:** 修复生命周期componentWillMount执行时机 ([52c9a67](https://github.com/NervJS/taro/commit/52c9a67))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数 ([ff56ffa](https://github.com/NervJS/taro/commit/ff56ffa))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数丢失 ([b750aba](https://github.com/NervJS/taro/commit/b750aba))
* **taro-weapp:** 支持函数在传递的过程中通过fn.bind()来传参 ([0ed5043](https://github.com/NervJS/taro/commit/0ed5043))
* **taro-weapp:** 自定义事件名转全小写 ([3666f8d](https://github.com/NervJS/taro/commit/3666f8d))
* **taro-weapp:** 补全小程序page的生命周期 ([77f6bba](https://github.com/NervJS/taro/commit/77f6bba))
* **taro-weapp:** 页面onload传入的参数 ([84c225e](https://github.com/NervJS/taro/commit/84c225e))
* **transformer:**  引入组件路径错误 ([b7341d3](https://github.com/NervJS/taro/commit/b7341d3))
* **transformer:** path resolve 使用 try..catch 包住 ([8e5ef9b](https://github.com/NervJS/taro/commit/8e5ef9b))
* **transformer:** 修复 props 为 string 的情况 ([8b0c9ce](https://github.com/NervJS/taro/commit/8b0c9ce))
* **transformer:** 支持多个组件调用同一 this.props 方法 ([6712d78](https://github.com/NervJS/taro/commit/6712d78))
* **transformer-wx:** props 下函数名处理路径顺序错误 ([92e467d](https://github.com/NervJS/taro/commit/92e467d))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数，同时支持方法名多级路径处理 ([cec9417](https://github.com/NervJS/taro/commit/cec9417))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数遗漏 ([27c1ee0](https://github.com/NervJS/taro/commit/27c1ee0))
* **transformer-wx:** 当自定义组件不包含属性时不会生成 __triggerObserer 属性 ([3fb2816](https://github.com/NervJS/taro/commit/3fb2816))
* **transformer-wx:** 生成匿名函数名中不能包含数字 ([c42c405](https://github.com/NervJS/taro/commit/c42c405))
* **transformer-wx:** 生成匿名函数时不需要携带 scope 作为第一参数 ([7a596c7](https://github.com/NervJS/taro/commit/7a596c7))
* **weapp:** 修复 this.$router 及组件生命周期触发 ([cc93e27](https://github.com/NervJS/taro/commit/cc93e27))
* observer第一次触发的时候，组件尚未初始化 ([30b8dd1](https://github.com/NervJS/taro/commit/30b8dd1))
* 事件调用的时候实例指向错误 ([928e0c3](https://github.com/NervJS/taro/commit/928e0c3))
* 判断是否空对象bug ([d864fea](https://github.com/NervJS/taro/commit/d864fea))
* 区分事件调用时的scope ([f717ccb](https://github.com/NervJS/taro/commit/f717ccb))
* 去掉事件参数里的scope ([b4c014d](https://github.com/NervJS/taro/commit/b4c014d))
* 小程序组件的事件函数需放到methods中，页面则不用 ([0449123](https://github.com/NervJS/taro/commit/0449123))
* 模板中传参表示-event- -> -e- ([c33f84d](https://github.com/NervJS/taro/commit/c33f84d))
* 漏写引号 ([8dbc00d](https://github.com/NervJS/taro/commit/8dbc00d))
* 默认参数‘this’会造成歧义，传false或不传即可 ([c241c4d](https://github.com/NervJS/taro/commit/c241c4d))


### Features

* **cli:** 去掉依赖的组件样式文件引入 ([caf0ba0](https://github.com/NervJS/taro/commit/caf0ba0))
* **cli:** 去掉依赖组件的 js 引用 ([1334469](https://github.com/NervJS/taro/commit/1334469))
* **taro-rn:** 增加rn api的测试用例 ([8f18dd9](https://github.com/NervJS/taro/commit/8f18dd9))
* **transformer:** **支持自定义组件传入 children** ([8b79214](https://github.com/NervJS/taro/commit/8b79214))
* **transformer:** 在 Component 中使用过的 this.props 会加入到 `static properties` ([ac16eb0](https://github.com/NervJS/taro/commit/ac16eb0))
* **transformer:** 属于 this.props 的 JSX 事件引用自动填充完整路径 ([4b6ca63](https://github.com/NervJS/taro/commit/4b6ca63))
* **transformer:** 属于 this.props 的函数调用自动填充完整路径 ([3073da9](https://github.com/NervJS/taro/commit/3073da9))
* 1st cmt ([067e292](https://github.com/NervJS/taro/commit/067e292))
* props函数执行时传参 ([49d5b4c](https://github.com/NervJS/taro/commit/49d5b4c))
* 修改事件处理方式以支持props传函数的各种情形 ([2a3d836](https://github.com/NervJS/taro/commit/2a3d836))
* 提供一个私有方法区分来自redux的props里的方法 ([cebb660](https://github.com/NervJS/taro/commit/cebb660))
* **transformer:** 清理无用代码，开始重构新组件化功能 ([71f8de8](https://github.com/NervJS/taro/commit/71f8de8))
* 调整componentDidMount的触发时机 ([ff17434](https://github.com/NervJS/taro/commit/ff17434))



<a name="0.0.73"></a>
## [0.0.73](https://github.com/NervJS/taro/compare/v0.0.72...v0.0.73) (2018-07-25)


### Bug Fixes

* **cli:** 将 tsConfig.json 移动至项目根目录下 ([da7f104](https://github.com/NervJS/taro/commit/da7f104))
* **taro:** render 方法 typing 错误 ([779157f](https://github.com/NervJS/taro/commit/779157f))


### Features

* **cli:** 将 cssUrl 配置移入 module.postcss 下 ([8efe600](https://github.com/NervJS/taro/commit/8efe600))
* **cli:** 小程序端编译增加 CSS 中引用本地资源替换成 base64 功能 ([db8e267](https://github.com/NervJS/taro/commit/db8e267))
* **cli:** 小程序编译增加 copy 功能 ([0132a0e](https://github.com/NervJS/taro/commit/0132a0e))
* **taro-rn:** 增加storage的测试用例 ([7b98274](https://github.com/NervJS/taro/commit/7b98274))



<a name="0.0.72"></a>
## [0.0.72](https://github.com/NervJS/taro/compare/v0.0.71...v0.0.72) (2018-07-24)


### Bug Fixes

* **cli:** 修复入口文件classify时的错误 ([c8316e5](https://github.com/NervJS/taro/commit/c8316e5))
* **router:** 修复navigateBack不带参数时报错的问题 ([9d8078c](https://github.com/NervJS/taro/commit/9d8078c))
* **taro-redux:** 修复connect中preProps会被覆盖成最新props的问题 ([13e1448](https://github.com/NervJS/taro/commit/13e1448))
* 配置开启https文档介绍 ([abcf1f8](https://github.com/NervJS/taro/commit/abcf1f8))


### Features

* **cli:** H5 支持 deviceRatio 自定义 ([5daa25d](https://github.com/NervJS/taro/commit/5daa25d))
* **cli:** 增加 [ 尺寸设计稿换算配置 ] 到 config 模板中 ([6fc36eb](https://github.com/NervJS/taro/commit/6fc36eb))
* **taro:** 补充对 checkSession 的支持 ([23588f4](https://github.com/NervJS/taro/commit/23588f4))
* **taro-cli | postcss-pxtransform:** 增加尺寸设计稿换算配置 ([2d9fe7a](https://github.com/NervJS/taro/commit/2d9fe7a))



<a name="0.0.71"></a>
## [0.0.71](https://github.com/NervJS/taro/compare/v0.0.70...v0.0.71) (2018-07-20)


### Bug Fixes

* **cli:** [@tarojs](https://github.com/tarojs)/plugin-typescript依赖缺失, may fix [#233](https://github.com/NervJS/taro/issues/233) ([340df41](https://github.com/NervJS/taro/commit/340df41))
* **cli:** redux模版里typescript与[@tarojs](https://github.com/tarojs)/plugin-typescript依赖缺失, fix [#233](https://github.com/NervJS/taro/issues/233) ([ec31db5](https://github.com/NervJS/taro/commit/ec31db5))
* **cli:** 修复h5模式偶发找不到模块的错误 ([c2e2184](https://github.com/NervJS/taro/commit/c2e2184))
* **cli:** 默认模板不强制规定类型 ([0d3851e](https://github.com/NervJS/taro/commit/0d3851e))
* **taro-compontens:** 修复一些组件默认样式 ([a4b7541](https://github.com/NervJS/taro/commit/a4b7541))
* **transformer:** 生成匿名 state也需要带上条件表达式 ([2b428bd](https://github.com/NervJS/taro/commit/2b428bd))
* **transformer:** 生成匿名 state也需要带上条件表达式, fix [#351](https://github.com/NervJS/taro/issues/351) ([9906c0e](https://github.com/NervJS/taro/commit/9906c0e))
* if / for 例子书写错误 ([f98c2ad](https://github.com/NervJS/taro/commit/f98c2ad))



<a name="0.0.70"></a>
## [0.0.70](https://github.com/NervJS/taro/compare/v0.0.69...v0.0.70) (2018-07-17)


### Bug Fixes

* **plugin:** 修复 less 和 stylus 不支持 [@import](https://github.com/import), fix [#231](https://github.com/NervJS/taro/issues/231) ([9afddc1](https://github.com/NervJS/taro/commit/9afddc1))
* **router:** 修复直接改地址栏时路由没反应的问题 ([9841f48](https://github.com/NervJS/taro/commit/9841f48))
* **tabbar:** iOS 下pannel容器增加弹性滚动，解决滑动卡顿的问题 ([b6c7628](https://github.com/NervJS/taro/commit/b6c7628))
* **transformer:** findImportedName 无法处理10个或以上自定义组件, fix [#324](https://github.com/NervJS/taro/issues/324) ([53a96fd](https://github.com/NervJS/taro/commit/53a96fd))
* **transformer:** if statement 不处理 jsx attr，fix [#317](https://github.com/NervJS/taro/issues/317) ([eea4c6f](https://github.com/NervJS/taro/commit/eea4c6f))
* **transformer:** 寻找 stateName 错误，close [#318](https://github.com/NervJS/taro/issues/318) ([05bc781](https://github.com/NervJS/taro/commit/05bc781))
* **transformer|eslint:** 不支持 MovableArea & MovableArea, close [#334](https://github.com/NervJS/taro/issues/334) ([73bc7f0](https://github.com/NervJS/taro/commit/73bc7f0))


### Features

* **core:** 加入  的类型检查, fix [#325](https://github.com/NervJS/taro/issues/325) ([27207a9](https://github.com/NervJS/taro/commit/27207a9))



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

* **core:** style 支持写入对象 ([931ee57](https://github.com/NervJS/taro/commit/931ee57))
* **taro-weapp:** app 补充 onError 和 onPageNotFound 两个生命周期 ([fc7528e](https://github.com/NervJS/taro/commit/fc7528e))



<a name="0.0.69-beta.1"></a>
## [0.0.69-beta.1](https://github.com/NervJS/taro/compare/v0.0.69-beta.0...v0.0.69-beta.1) (2018-07-09)


### Bug Fixes

* **eslint:** this.$rourer 触发 JSX 事件名 ([1af94f3](https://github.com/NervJS/taro/commit/1af94f3))
* **webpack-runner:** 修复Dynamic Import后报错的问题 ([57db5ad](https://github.com/NervJS/taro/commit/57db5ad))


### Features

* **transformer:** 支持 style 传入对象 ([d0be191](https://github.com/NervJS/taro/commit/d0be191))



<a name="0.0.69-beta.0"></a>
## [0.0.69-beta.0](https://github.com/NervJS/taro/compare/v0.0.68...v0.0.69-beta.0) (2018-07-08)


### Bug Fixes

* **taro-weapp:** 页面退出清除缓存后，再次进入未能初始化 state ([08f63fd](https://github.com/NervJS/taro/commit/08f63fd))



<a name="0.0.68"></a>
## [0.0.68](https://github.com/NervJS/taro/compare/v0.0.68-beta.4...v0.0.68) (2018-07-07)


### Bug Fixes

* **cli:** 修复 tsconfig.json 设置，加入 typing 依赖. close [#284](https://github.com/NervJS/taro/issues/284) ([f985aee](https://github.com/NervJS/taro/commit/f985aee))
* 修复swiper 初始化自动播放问题 ([7395fb0](https://github.com/NervJS/taro/commit/7395fb0))



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
* **transformer:** 路径解析不正确 ([9eca434](https://github.com/NervJS/taro/commit/9eca434))



<a name="0.0.68-beta.2"></a>
## [0.0.68-beta.2](https://github.com/NervJS/taro/compare/v0.0.68-beta.1...v0.0.68-beta.2) (2018-07-05)


### Bug Fixes

* **taro-weapp:** createData try catch 后暴露错误 ([d0fef0d](https://github.com/NervJS/taro/commit/d0fef0d))



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
* **transformer:** 所有设置 if 条件都加入 block ([a32661e](https://github.com/NervJS/taro/commit/a32661e))


### Features

* 重构swiper 组件 ([d10a9df](https://github.com/NervJS/taro/commit/d10a9df))



<a name="0.0.67-beta.2"></a>
## [0.0.67-beta.2](https://github.com/NervJS/taro/compare/v0.0.67-beta.1...v0.0.67-beta.2) (2018-07-04)


### Bug Fixes

* **taro-weapp:** 组件状态被重置 ([fdf5ef2](https://github.com/NervJS/taro/commit/fdf5ef2))


### Features

* **tcr:** Picker 的 Dialog 模块重构，参考react-native-modal的思想 ([4562227](https://github.com/NervJS/taro/commit/4562227))



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
* **transformer:** 寻找 id 是属于 props 或 state ([5b5f42f](https://github.com/NervJS/taro/commit/5b5f42f))



<a name="0.0.65"></a>
## [0.0.65](https://github.com/NervJS/taro/compare/v0.0.64...v0.0.65) (2018-07-03)


### Bug Fixes

* **taro-h5:** H5 端 request cache 参数丢失 ([2bb0a1a](https://github.com/NervJS/taro/commit/2bb0a1a))
* 修复swiper 组件引用问题 ([a524b1c](https://github.com/NervJS/taro/commit/a524b1c))
* **taro-weapp:** 小程序组件化修正 ([f29d9e4](https://github.com/NervJS/taro/commit/f29d9e4))
* **taro-weapp:** 所有组件引用当成动态组件处理 ([318a850](https://github.com/NervJS/taro/commit/318a850))
* 修复ScrollView 组件 scrollWithAnimation 问题，修复radio 外部样式问题，修复checkbox 样式错乱问题，修复 switch color 值无效问题 等 ([8995f1f](https://github.com/NervJS/taro/commit/8995f1f))
* **transformer:** $usedState 不加入非标准 id ([e622500](https://github.com/NervJS/taro/commit/e622500))
* **transformer:** 单独使用的自定义组件也当做循环自定义组件处理 ([47bdc55](https://github.com/NervJS/taro/commit/47bdc55))
* **transformer:** 单独使用的自定义组件在 createData 加入索引 ([f2b8bdc](https://github.com/NervJS/taro/commit/f2b8bdc))
* **transformer:** 自定义组件 props 不写值则默认赋值 true ([a64632a](https://github.com/NervJS/taro/commit/a64632a))


### Features

* **tcr:** Button 支持 hoverStyle ([96d0e4b](https://github.com/NervJS/taro/commit/96d0e4b))



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
* **transformer:** wxml import 路径使用 unix 风格，close [#212](https://github.com/NervJS/taro/issues/212) ([2782046](https://github.com/NervJS/taro/commit/2782046))
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

* **taro-cli:** 为 dist/ 编译出 project.config.json，由此可把 dist/ 拖入开发者工具以避免无效编译，详见 [#190](https://github.com/NervJS/taro/issues/190) ([c6339fa](https://github.com/NervJS/taro/commit/c6339fa))
* **taro-rn:** 增加storage api的单元测试 ([df1f794](https://github.com/NervJS/taro/commit/df1f794))
* **tcr:** add component Form ([56317c0](https://github.com/NervJS/taro/commit/56317c0))
* **tcr:** enhance clickable ([9fa8bc3](https://github.com/NervJS/taro/commit/9fa8bc3))



<a name="0.0.58"></a>
## [0.0.58](https://github.com/NervJS/taro/compare/v0.0.57...v0.0.58) (2018-06-24)


### Bug Fixes

* **transformer:** JSX attr expression 有多个 this.props. 成员表达式, close [#189](https://github.com/NervJS/taro/issues/189) ([9be4451](https://github.com/NervJS/taro/commit/9be4451))
* **transformer:** 前置逻辑/条件表达式处理 ([f54c421](https://github.com/NervJS/taro/commit/f54c421))



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


### Features

* **cli:** added .npmignore ([2ad9d3e](https://github.com/NervJS/taro/commit/2ad9d3e))



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
* **taro-cli:** 添加 update 命令 ([842404c](https://github.com/NervJS/taro/commit/842404c))
* **taro-cli:** 添加更新提示 ([196b21b](https://github.com/NervJS/taro/commit/196b21b))
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

* **cli:** 根据模板创建项目给定默认 css 处理 ([17ee2d3](https://github.com/NervJS/taro/commit/17ee2d3))
* **eslint:** jsx-handler-names 无法正确处理成员表达式 ([fc13ee2](https://github.com/NervJS/taro/commit/fc13ee2))
* **taro-components:** 修复scroll-view 滑动问题，修复slider值大于最大值溢出问题 ([4cf885e](https://github.com/NervJS/taro/commit/4cf885e))
* **taro-components:** 修复swiper圆点位置 ([8554bbb](https://github.com/NervJS/taro/commit/8554bbb))
* **transformer:** props 不直接写真值报错 ([41c6398](https://github.com/NervJS/taro/commit/41c6398))
* **transformer:** 列表渲染自定义组件无法使用key属性，close [#126](https://github.com/NervJS/taro/issues/126) ([f73626b](https://github.com/NervJS/taro/commit/f73626b))
* **transformer:** 多层循环嵌套自定义组件无效 ([d93ba6a](https://github.com/NervJS/taro/commit/d93ba6a))
* 修复css预处理器提示语句错误 ([3336eb5](https://github.com/NervJS/taro/commit/3336eb5))


### Features

* **cli:** 内置了less&stylus支持 ([ac2e3df](https://github.com/NervJS/taro/commit/ac2e3df))
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
* map dispatch to props ([c1fce9f](https://github.com/NervJS/taro/commit/c1fce9f))



<a name="0.0.47"></a>
## [0.0.47](https://github.com/NervJS/taro/compare/v0.0.46...v0.0.47) (2018-06-12)


### Bug Fixes

* **async-await:** 引用第三方插件后Promise报错 ([e66177d](https://github.com/NervJS/taro/commit/e66177d))
* **components:** Image组件样式bug ([780f8b6](https://github.com/NervJS/taro/commit/780f8b6))
* **pxtransform:** weapp - 单位转换插件读取config配置 ([d75b680](https://github.com/NervJS/taro/commit/d75b680))
* **router:** 修复了router吞错误的问题 ([6bdea1f](https://github.com/NervJS/taro/commit/6bdea1f))
* **router:** 修复了路由后遗失params的问题 ([e27a015](https://github.com/NervJS/taro/commit/e27a015))
* **taro-components:** 修复radio 问题 ([2f5bae5](https://github.com/NervJS/taro/commit/2f5bae5))
* **taro-h5:** 更新 h5 api 文档 ([bc05ce9](https://github.com/NervJS/taro/commit/bc05ce9))
* **taro-h5:** 移除puppeteer测试环境 ([e86673b](https://github.com/NervJS/taro/commit/e86673b))
* **taro-h5:** 调整 request API 的文档 ([6dab901](https://github.com/NervJS/taro/commit/6dab901))
* **tcr:** prevent adding customItem multiple times ([0d8218c](https://github.com/NervJS/taro/commit/0d8218c))
* **transformer:** 使用 object pattern 从 this 取 state. close [#84](https://github.com/NervJS/taro/issues/84) ([f304af3](https://github.com/NervJS/taro/commit/f304af3))
* es入口未经编译，暂先去掉 ([5f807d5](https://github.com/NervJS/taro/commit/5f807d5))


### Features

* **postcss-pxtransform:** fork postcss-pxtorem 进行定制，速度更快 ([98bc997](https://github.com/NervJS/taro/commit/98bc997))
* **postcss-pxtransform:** 不处理头部包含注释 /*postcss-pxtransform disable*/ 的样式文件 ([b6595c4](https://github.com/NervJS/taro/commit/b6595c4))
* **taro-h5:** add test env ([11f2d21](https://github.com/NervJS/taro/commit/11f2d21))
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
* **postcss-pxtransform:** 单位转换问题 ([56e46ef](https://github.com/NervJS/taro/commit/56e46ef))
* **pxtransform:** set baseFontSize ([75c24d6](https://github.com/NervJS/taro/commit/75c24d6))
* **tc:** button style ([484be23](https://github.com/NervJS/taro/commit/484be23))
* **tc:** checkboxGroup onChange返回值问题 ([0aaa1c4](https://github.com/NervJS/taro/commit/0aaa1c4))
* **transformer:** this.props 不会加入 usedState ([855a4d7](https://github.com/NervJS/taro/commit/855a4d7))
* **transformer:** 提前处理复杂表达式，close [#63](https://github.com/NervJS/taro/issues/63) ([d559125](https://github.com/NervJS/taro/commit/d559125))
* 小程序下单位转换designWidth配置失效 ([00a0895](https://github.com/NervJS/taro/commit/00a0895))
* 小程序下忽略常量的转换 ([1fb78fd](https://github.com/NervJS/taro/commit/1fb78fd))


### Features

* **cli:** 暂时把redux-h5替换为nerv-redux ([1a427b7](https://github.com/NervJS/taro/commit/1a427b7))
* **docs:** 更新native-api文档 ([5bff28c](https://github.com/NervJS/taro/commit/5bff28c))
* **redux-h5:** 添加了redux-h5 ([4aedcf7](https://github.com/NervJS/taro/commit/4aedcf7))
* **router:** 修复不同页面重叠的问题 ([bd77f2e](https://github.com/NervJS/taro/commit/bd77f2e))
* **tcr:** add component Picker ([d28e13b](https://github.com/NervJS/taro/commit/d28e13b))
* **tcr:** alter Icon to stateless component ([871b897](https://github.com/NervJS/taro/commit/871b897))
* **tcr:** alter Text to stateless component ([3975f35](https://github.com/NervJS/taro/commit/3975f35))
* **wp-runner:** postcss单位转换插件配置 ([1f14d20](https://github.com/NervJS/taro/commit/1f14d20))
* add packages postcss-pxtransform ([78e7cbc](https://github.com/NervJS/taro/commit/78e7cbc))
* 优化插件写法 ([f8a1f5b](https://github.com/NervJS/taro/commit/f8a1f5b))



<a name="0.0.45"></a>
## [0.0.45](https://github.com/NervJS/taro/compare/v0.0.44...v0.0.45) (2018-06-11)


### Bug Fixes

* **cli:** 更新模板 ([1ccada3](https://github.com/NervJS/taro/commit/1ccada3))
* **tc:** button disabled状态触发事件问题 ([ed0e5f6](https://github.com/NervJS/taro/commit/ed0e5f6))
* **tc:** 修复Button 默认样式问题 ([de9f7fb](https://github.com/NervJS/taro/commit/de9f7fb))
* **tc:** 修复input password属性 文档问题 ([f967b98](https://github.com/NervJS/taro/commit/f967b98))
* **tc:** 删除button组件冗余代码 ([e74e87c](https://github.com/NervJS/taro/commit/e74e87c))


### Features

* **taro-rn:** 更新webSocket Api ([da8c17e](https://github.com/NervJS/taro/commit/da8c17e))
* **tc:** input 兼容type=password 写法 ([fdad135](https://github.com/NervJS/taro/commit/fdad135))
* **tc:** 兼容input password 写法 ([d248ee8](https://github.com/NervJS/taro/commit/d248ee8))



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
* **taro-weapp:** 支持自定义组件循环输出自定义组件 ([a0af9d9](https://github.com/NervJS/taro/commit/a0af9d9))


### Features

* **cli:** add [@tarojs](https://github.com/tarojs)/cli as devDependency to template ([4723de7](https://github.com/NervJS/taro/commit/4723de7))
* **cli:** add npm scripts for deployment ([5a2dfbe](https://github.com/NervJS/taro/commit/5a2dfbe))
* **cli:** ignore .npmrc when using yarn ([c02f304](https://github.com/NervJS/taro/commit/c02f304))
* **tc:** add swiper test ([94ee648](https://github.com/NervJS/taro/commit/94ee648))
* 把转换器加入到主仓库 ([f96c251](https://github.com/NervJS/taro/commit/f96c251))
* **taro-rn:** 更新media, vibrate相关API ([56dce1e](https://github.com/NervJS/taro/commit/56dce1e))



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
* **taro-rn:** 更新makePhoneCall ([7ca2710](https://github.com/NervJS/taro/commit/7ca2710))
* **tc:** progress, radio test ([9f6754a](https://github.com/NervJS/taro/commit/9f6754a))



<a name="0.0.40"></a>
## [0.0.40](https://github.com/NervJS/taro/compare/v0.0.39...v0.0.40) (2018-06-07)


### Bug Fixes

* **taro-components:** tabBar逻辑同步小程序 ([341b2f8](https://github.com/NervJS/taro/commit/341b2f8))
* **taro-rn:** 去掉rn框架打包 ([9d247b7](https://github.com/NervJS/taro/commit/9d247b7))
* **webpack-runner:** 缺少postcss-plugin-constparse依赖，fixes [#14](https://github.com/NervJS/taro/issues/14) ([5a3bec7](https://github.com/NervJS/taro/commit/5a3bec7))


### Features

* **learn.json:** 新增的包添加到lerna配置 ([f3616c8](https://github.com/NervJS/taro/commit/f3616c8))
* **taro:** 更新typings ([f73d68d](https://github.com/NervJS/taro/commit/f73d68d))
* **taro-rn:** 更新clipboard相关API ([946afd1](https://github.com/NervJS/taro/commit/946afd1))
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
* 加入 View, ScrollView 的类型 ([0d8bff9](https://github.com/NervJS/taro/commit/0d8bff9))



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



<a name="0.0.34"></a>
## [0.0.34](https://github.com/NervJS/taro/compare/v0.0.33...v0.0.34) (2018-05-29)


### Bug Fixes

* **cli:** h5编译Component从[@tarojs](https://github.com/tarojs)/taro-h5中import ([053feaa](https://github.com/NervJS/taro/commit/053feaa))
* **cli:** rn编译功能 ([fa7c571](https://github.com/NervJS/taro/commit/fa7c571))
* **cli:** rn编译将组件的className与id属性改写成style ([3aef579](https://github.com/NervJS/taro/commit/3aef579))
* **cli:** 模板变更 ([8c0a298](https://github.com/NervJS/taro/commit/8c0a298))
* **router:** h5路由回退传参问题 ([c3266d6](https://github.com/NervJS/taro/commit/c3266d6))
* **router:** h5路由方法执行顺序 ([1f445e0](https://github.com/NervJS/taro/commit/1f445e0))
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
* **eslint:** 空 JSX 元素应该自动闭合 ([50a1704](https://github.com/NervJS/taro/commit/50a1704))
* **eslint:** 规则格式设置不正确 ([acc78d5](https://github.com/NervJS/taro/commit/acc78d5))
* **eslint-config:** 文件配置错误 ([56a58d0](https://github.com/NervJS/taro/commit/56a58d0))
* **taro-components:** 添加e.detail内容 ([3bd15f1](https://github.com/NervJS/taro/commit/3bd15f1))
* **weapp:** 大小写问题 ([a55efb7](https://github.com/NervJS/taro/commit/a55efb7))
* form 去除冗余代码 ([66cd81e](https://github.com/NervJS/taro/commit/66cd81e))
* label事件、样式等修复 ([e12cd67](https://github.com/NervJS/taro/commit/e12cd67))
* 修复radio-group 返回值问题 ([5dcb2be](https://github.com/NervJS/taro/commit/5dcb2be))
* 修复表单返回值问题 ([c42b6db](https://github.com/NervJS/taro/commit/c42b6db))
* **swiper:** 允许垂直滚动 ([8590825](https://github.com/NervJS/taro/commit/8590825))


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
* **tcr:** testing modified ([7e50324](https://github.com/NervJS/taro/commit/7e50324))
* **weapp:** 支持 PropTypes ([dd59b1d](https://github.com/NervJS/taro/commit/dd59b1d))
* 新增测试用例 ([ccedb17](https://github.com/NervJS/taro/commit/ccedb17))
* 新增组件基本测试, 更改文件目录结构 ([3768785](https://github.com/NervJS/taro/commit/3768785))
* 新增组件库测试用例 ([680b4f5](https://github.com/NervJS/taro/commit/680b4f5))



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

* **cli:** 创建项目模板读取cli包的版本号 ([88362c0](https://github.com/NervJS/taro/commit/88362c0))
* 支持Taro.render写法 ([6d154c3](https://github.com/NervJS/taro/commit/6d154c3))
* **taro-weapp:** 支持defaultProps ([d0a09b0](https://github.com/NervJS/taro/commit/d0a09b0))
* 粗略支持浏览器后退功能 并且加入了路由动画 ([2183ecc](https://github.com/NervJS/taro/commit/2183ecc))
* **taro:** 动态组件重新初始化 ([c09f41a](https://github.com/NervJS/taro/commit/c09f41a))



<a name="0.0.28"></a>
## [0.0.28](https://github.com/NervJS/taro/compare/v0.0.27...v0.0.28) (2018-05-07)


### Bug Fixes

* **eslint:** array 没有 key 的时候 warning ([87f80a4](https://github.com/NervJS/taro/commit/87f80a4))
* **taro:** 动态组件更新传参有误 ([56824b5](https://github.com/NervJS/taro/commit/56824b5))
* **taro:** 编译日志输出 ([472e730](https://github.com/NervJS/taro/commit/472e730))


### Features

* **cli:** 升级模板依赖包 ([bf7440b](https://github.com/NervJS/taro/commit/bf7440b))
* **eslint:** 加入 import 和 standard 规则 ([c6ae960](https://github.com/NervJS/taro/commit/c6ae960))
* **eslint:** 设置 jsx 语法 ([0715dbd](https://github.com/NervJS/taro/commit/0715dbd))



<a name="0.0.27"></a>
## [0.0.27](https://github.com/NervJS/taro/compare/v0.0.26...v0.0.27) (2018-05-06)


### Bug Fixes

* **cli:** 静态资源链接替换成绝对路径 ([55ac72b](https://github.com/NervJS/taro/commit/55ac72b))
* 修复h5模式watch功能的一个手抖 ([86fbebd](https://github.com/NervJS/taro/commit/86fbebd))
* 修复windows下无法build weapp的问题 ([6081999](https://github.com/NervJS/taro/commit/6081999))


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

* **router:** 修复h5路由组件的redux兼容 ([4364f66](https://github.com/NervJS/taro/commit/4364f66))
* **taro:** 动态组件更新传参 ([2fbf82b](https://github.com/NervJS/taro/commit/2fbf82b))
* **taro-h5:** 丢失文件 ([f21ef16](https://github.com/NervJS/taro/commit/f21ef16))
* **taro-h5:** 文件引用错误 ([38f695d](https://github.com/NervJS/taro/commit/38f695d))
* **taro-weapp:** 文件引用错误 ([e87ed92](https://github.com/NervJS/taro/commit/e87ed92))


### Features

* **cli:** h5编译处理 [@tarojs](https://github.com/tarojs)/taro-h5 ([93ac1d3](https://github.com/NervJS/taro/commit/93ac1d3))
* **taro:** taro拆分 ([ce02eef](https://github.com/NervJS/taro/commit/ce02eef))
* **taro:** 更新export ([00bb319](https://github.com/NervJS/taro/commit/00bb319))
* h5watch功能补上hot ([f579aa9](https://github.com/NervJS/taro/commit/f579aa9))
* nerv-to-mp版本更新 ([2621698](https://github.com/NervJS/taro/commit/2621698))
* **cli:** 添加h5模式watch功能 ([f9444a8](https://github.com/NervJS/taro/commit/f9444a8))
* **taro/api:** 完成界面/交互反馈API ([87c8e99](https://github.com/NervJS/taro/commit/87c8e99))



<a name="0.0.22"></a>
## [0.0.22](https://github.com/NervJS/taro/compare/v0.0.21...v0.0.22) (2018-05-03)


### Bug Fixes

* 固定版本 ([d4b3727](https://github.com/NervJS/taro/commit/d4b3727))
* **taro:** 名称错误 ([b4b8a6d](https://github.com/NervJS/taro/commit/b4b8a6d))
* **taro:** 运行时组件类注入方法 && 页面的componentWillUpdate中渲染一次页面 ([4221f5d](https://github.com/NervJS/taro/commit/4221f5d))



<a name="0.0.21"></a>
## [0.0.21](https://github.com/NervJS/taro/compare/v0.0.20...v0.0.21) (2018-05-02)


### Bug Fixes

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


### Features

* **taro:** add api.md ([cc58c3f](https://github.com/NervJS/taro/commit/cc58c3f))



<a name="0.0.17"></a>
## [0.0.17](https://github.com/NervJS/taro/compare/v0.0.16...v0.0.17) (2018-04-23)


### Bug Fixes

* **taro:** Taro.request 方法H5端返回错误 ([b53bdc5](https://github.com/NervJS/taro/commit/b53bdc5))
* **taro:** 编译后wxml自定义属性调整 ([8ca7b82](https://github.com/NervJS/taro/commit/8ca7b82))


### Features

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

* **taro-redux:** 加入redux支持 ([fb66c66](https://github.com/NervJS/taro/commit/fb66c66))
* add packages taro-components-rn ([1a7eb6c](https://github.com/NervJS/taro/commit/1a7eb6c))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/NervJS/taro/compare/v0.0.8...v0.0.9) (2018-04-16)


### Bug Fixes

* **cli:** 更新配置的使用 ([4388e00](https://github.com/NervJS/taro/commit/4388e00))
* **tarojs:** _createData重复执行 ([f55a9d1](https://github.com/NervJS/taro/commit/f55a9d1))
* 修改文件提示 ([8cb66f0](https://github.com/NervJS/taro/commit/8cb66f0))


### Features

* **cli:** 支持全局自定义变量配置 ([890ad3b](https://github.com/NervJS/taro/commit/890ad3b))
* **cli:** 更新模板 ([f9fd598](https://github.com/NervJS/taro/commit/f9fd598))
* 配置文件放到config目录 && 支持环境变量配置编译替换 ([a95ef83](https://github.com/NervJS/taro/commit/a95ef83))
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



