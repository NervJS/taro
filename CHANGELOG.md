# [](https://github.com/NervJS/taro/compare/v1.3.45...v) (2020-10-21)


### Bug Fixes

* upload render & class uni-id ([e1dac98](https://github.com/NervJS/taro/commit/e1dac98526384a10d51267f2b0198aa7da55a937))
* **mini:** comp-id generate ([268731e](https://github.com/NervJS/taro/commit/268731e8a5b2d1cbab85124089943e8d6549fe0b))
* begin & end event problem ([f287976](https://github.com/NervJS/taro/commit/f287976f036f1b491496924e7a9336a53a381911))
* interactive classname ([910d0f6](https://github.com/NervJS/taro/commit/910d0f6f4d4c4500686d12f1f762a3bd2114565b))
* random component id & scope id ([2de084f](https://github.com/NervJS/taro/commit/2de084ffad701ca517bf86bbff3b34781b2a7c1f))


### Features

* **taro-weapp:** 支持 onAddToFavorites ([9792ce9](https://github.com/NervJS/taro/commit/9792ce95fcbdddc3c844c52aa20a7cf23ff93624))
* **weapp:** add lifecycle `onShareTimeline` ([4de12c7](https://github.com/NervJS/taro/commit/4de12c7a822f54540cc2294a6336750228f51f41))
* checkout 2.x swiper ([bdb3dd0](https://github.com/NervJS/taro/commit/bdb3dd0eca8af378d5fa6401c2af68836ed25dcf))
* checkout from 2.x ([ca855f0](https://github.com/NervJS/taro/commit/ca855f0af574247c61362e4fdbff6335b183a377))



## [1.3.45](https://github.com/NervJS/taro/compare/v1.3.44...v1.3.45) (2020-06-15)


### Bug Fixes

* **cli:** 修复 convertor 报错问题 ([faf96dd](https://github.com/NervJS/taro/commit/faf96dd97f76fd0798992a04180f97678221302f))


### Features

* taro convert 支持京东小程序 ([a1e524d](https://github.com/NervJS/taro/commit/a1e524d7d1fcae6ea8343993d6a190e8c023b819))
* 默认模板加上京东小程序依赖 ([092cc5c](https://github.com/NervJS/taro/commit/092cc5cd75b7bc865b2cfbdba66d092854e2b5dc))



## [1.3.44](https://github.com/NervJS/taro/compare/v1.3.43...v1.3.44) (2020-05-19)


### Bug Fixes

* **router:** checkout 2.x router fixed ([#6373](https://github.com/NervJS/taro/issues/6373)) ([6891724](https://github.com/NervJS/taro/commit/689172483e57dc37e93a4af1d67e6abe935a9c91))



## [1.3.43](https://github.com/NervJS/taro/compare/v1.3.42...v1.3.43) (2020-05-18)


### Bug Fixes

* **alipay:** 修复支付宝分包页Interceptor 不生效的问题, fix [#6129](https://github.com/NervJS/taro/issues/6129) ([dba24d8](https://github.com/NervJS/taro/commit/dba24d8cec9f25d30bcab7aa391bd71be1745d34))
* **taro-h5:** 修复h5的chooseImage API无法动态设置souceType的问题，对齐小程序端 ([3368299](https://github.com/NervJS/taro/commit/3368299b7124cea3ab025e070cf5457cb89ba84e))
* **transformer:** 修复函数式组件 render props 不能正确解析的问题 ([22f10d8](https://github.com/NervJS/taro/commit/22f10d840947461486fdd632c8310ae744a8b75e))


### Features

* **taro-cli:** 新增UI编译跨平台支持 ([#6210](https://github.com/NervJS/taro/issues/6210)) ([79aa5b2](https://github.com/NervJS/taro/commit/79aa5b28bbc67862cd26d2aa5bd6cb2889ff0b3d))



## [1.3.42](https://github.com/NervJS/taro/compare/v1.3.41...v1.3.42) (2020-04-16)


### Bug Fixes

* 恢复源码 ([51c2676](https://github.com/NervJS/taro/commit/51c2676b833a45aa3dab87d8b13c3109f3849f23))
* **taro-router:** 修复页面拦截成功后，url参数丢失的问题 ([7f2b037](https://github.com/NervJS/taro/commit/7f2b03794d80c9ed863c374f5dd3ef82fa93a4ff))


### Features

* **cli:** 在config中支持添加appId配置 编译时读取并写入到pageage.config.json中 ([#5985](https://github.com/NervJS/taro/issues/5985)) ([4f52e72](https://github.com/NervJS/taro/commit/4f52e72a8f0ac83d44f3cb15ed84660b33ba802b))



## [1.3.41](https://github.com/NervJS/taro/compare/v1.3.40...v1.3.41) (2020-04-13)


### Bug Fixes

* **h5:** Taro.downloadFile携带cookie ([#5941](https://github.com/NervJS/taro/issues/5941)) ([526d5b9](https://github.com/NervJS/taro/commit/526d5b9ac32b957a60dca0b1e187f57eda6f1f07))
* complete msg defect ([a1db3f8](https://github.com/NervJS/taro/commit/a1db3f8f008ad9eb56150d98b837db98cabacb10))
* previewImage点击返回键导致页面返回等问题 ([59e63ca](https://github.com/NervJS/taro/commit/59e63cae7bc5baacb2ea3d2ff7e1c5474a42fd01))
* previewImage点击返回键导致页面返回等问题 ([8599256](https://github.com/NervJS/taro/commit/85992564a95222b938c31caa30ac115f1371c263))
* **components:** images imgProps for lazyload ([174dbee](https://github.com/NervJS/taro/commit/174dbeed182b51982902b47a08d00d0e05a3f064))
* **components:** images upload fix [#5921](https://github.com/NervJS/taro/issues/5921) ([1d911b6](https://github.com/NervJS/taro/commit/1d911b659a3b43fb3bbd539c9c7cce45af614fc9))
* **h5:** 修复uploadFile上传的是个blob对象的问题 ([eac808f](https://github.com/NervJS/taro/commit/eac808f0fbff35360943f692081e16aed659337d))


### Features

* **h5:** previewImage:fail msg ([0578890](https://github.com/NervJS/taro/commit/0578890b075a9e0942722ece113c638d5060fb2f))
* **taro-webpack-runner:** add miniCssExtractLoaderOption suppo… ([#5922](https://github.com/NervJS/taro/issues/5922)) ([7315bdd](https://github.com/NervJS/taro/commit/7315bddd9ee9f602aea7abffa5442518942310f2))



## [1.3.40](https://github.com/NervJS/taro/compare/v1.3.39...v1.3.40) (2020-04-07)


### Bug Fixes

* Taro.uploadFile携带cookie ([#5896](https://github.com/NervJS/taro/issues/5896)) ([107d567](https://github.com/NervJS/taro/commit/107d56701baf07ff13bfb88dfa4af2b4b3cff187))
* **taro-router:** 修复函数式组件中leave hook的问题 ([#5888](https://github.com/NervJS/taro/issues/5888)) ([de32e54](https://github.com/NervJS/taro/commit/de32e540c41d1f696938061ee4ed6077f1425a96))
* **taro-router:** 修复函数式组件中leave hook的问题 ([#5888](https://github.com/NervJS/taro/issues/5888)) ([6873a92](https://github.com/NervJS/taro/commit/6873a9238c10b1c3c995b5093752b4b06fd53f8c))
* canvas typing fix [#5790](https://github.com/NervJS/taro/issues/5790) ([8e228be](https://github.com/NervJS/taro/commit/8e228bea92de16bbcb79d1ece47d19c7fe70e73c))
* issue [#5682](https://github.com/NervJS/taro/issues/5682) ,修复ios 10.x系统中，由于不支持document.body.style = bodyInlineStyle写法导致js被中断的问题 ([59fe68a](https://github.com/NervJS/taro/commit/59fe68ab5bdc0ddfd7fd84002f22f1ee46a9b47f))
* redundant type fix [#5771](https://github.com/NervJS/taro/issues/5771) ([78af2ae](https://github.com/NervJS/taro/commit/78af2ae4eec09f225e0f8995991e06077de208eb))
* swiper incorrect setting ([0d4cfc6](https://github.com/NervJS/taro/commit/0d4cfc6446b41e718aaa2ee78ba2c017284f8067))
* this.container null in scroll-view ([5a042ec](https://github.com/NervJS/taro/commit/5a042ec3f8e3424e8df605720ed8019ac2146f7e))
* **docs:** api about links ([6204995](https://github.com/NervJS/taro/commit/6204995b866e2e479afc40b580042fae178ff17d))
* **jd:** 修复京东小程序跳转参数、预加载 ([cac6d22](https://github.com/NervJS/taro/commit/cac6d22053e0e2f954941f1b0bd1e6e8f62114ab))


### Features

* **components:** checkout modify from 2.x ([6adca2c](https://github.com/NervJS/taro/commit/6adca2c0f291145983e591da4aa68115bb956978))
* **router:** checkout router、cli modify from 2.x ([f476c65](https://github.com/NervJS/taro/commit/f476c65db203e0a8c601e55e06b02d3cb39f6f5b))



## [1.3.39](https://github.com/NervJS/taro/compare/v1.3.38...v1.3.39) (2020-03-16)


### Bug Fixes

* **cli:** 修复对 lodash 等库的支持，close [#5614](https://github.com/NervJS/taro/issues/5614) ([c8ed86b](https://github.com/NervJS/taro/commit/c8ed86b69fa5da39d9df69d271d802460a0b9bbd))
* **swan:** 修复Taro 1.3.x，百度小程序component shouldComponentUpdate不生效 ([4080659](https://github.com/NervJS/taro/commit/40806598effa9ac6f9854f2b6acb6632e8655c36))
* **tt:** 修复头条真机调试报错，fix [#5688](https://github.com/NervJS/taro/issues/5688) ([cb4257c](https://github.com/NervJS/taro/commit/cb4257c3835b32845f1f97504cee9bdb762625f6))


### Features

* **components:** 为image组件添加了imgProps属性 ([cef40b3](https://github.com/NervJS/taro/commit/cef40b3386a39ca69ceec243cf98370f021b3b8e))
* **plugin-uglify:** 强力压缩 ([#1294](https://github.com/NervJS/taro/issues/1294)) ([6bf75fc](https://github.com/NervJS/taro/commit/6bf75fc8c03e1afd2dbdecb9102d0056782766a7))



## [1.3.38](https://github.com/NervJS/taro/compare/v1.3.37...v1.3.38) (2020-03-09)


### Bug Fixes

* get app for h5 fix [#4763](https://github.com/NervJS/taro/issues/4763) ([8c8041e](https://github.com/NervJS/taro/commit/8c8041ed2876e43d819cfe7cb9489e160be6429e))
* rem in h5 component fix [#5309](https://github.com/NervJS/taro/issues/5309) ([4801038](https://github.com/NervJS/taro/commit/480103850e2ca0f8a6f8b3c355092cbe0cccd4b0))
* **components:** 修复canvas可能取不到props的问题 ([a7981f3](https://github.com/NervJS/taro/commit/a7981f3c976d5d98026251b78f5681286c56f321))
* **components:** 修复navigator、controls、video组件可能取不到props的问题 ([22405fb](https://github.com/NervJS/taro/commit/22405fbc0d9d02e3f5a3554285951b3370c77ee6))
* **components:** 去除canvas、tabbar内一些比较hacky的写法 ([4b1bb3f](https://github.com/NervJS/taro/commit/4b1bb3f4592801cf021f712d62dba605959b4693))
* **taro component:** 1.3.9版本误删,导致无法衔接滚动 ([c68da48](https://github.com/NervJS/taro/commit/c68da4828930a66a398330979643c2abf73f387d))
* **taro-components-rn:** 修复Input组件 ([047d86f](https://github.com/NervJS/taro/commit/047d86f8b84635b34c1b1ed63a0861cfe060ec46))
* docusaurus wrong parse ([f62da13](https://github.com/NervJS/taro/commit/f62da13e6abf81bb4965cd575d96e1657f707634))


### Features

* **taro-h5:** add capture attribute support for chooseImage api when… ([#5608](https://github.com/NervJS/taro/issues/5608)) ([880220d](https://github.com/NervJS/taro/commit/880220dac4b5fbcdfb5efe93ea88db17330c2d4d))
* **taro-router:** 新增路由拦截功能beforeRouteLeave ([10c2c53](https://github.com/NervJS/taro/commit/10c2c53a57c537d950268d98886f4763d4b92807))
* complete navig、form、media typing with docs ([246e131](https://github.com/NervJS/taro/commit/246e131e94c9b4779fcf8c1506a99dd24e2b1c81))
* complete Open typing with docs ([c150dbb](https://github.com/NervJS/taro/commit/c150dbb07235954437a7de362f1eb93b56b62513))
* input typing with docs upload ([95bd3a6](https://github.com/NervJS/taro/commit/95bd3a62e2d50d5aba6e52a26730018d03b45d75))
* upload all components types with docs ([ccdb96f](https://github.com/NervJS/taro/commit/ccdb96f79b5ccb60cb8a461cfc930f5b6eb581c1))
* **network:** upload typing ([049a5ee](https://github.com/NervJS/taro/commit/049a5eed86a1ffbd060eec63c71d96f2b5fb70c7))
* **types:** upload components typing with docs ([432f32c](https://github.com/NervJS/taro/commit/432f32c5b87b08b7e657f5b6c6aeda3b232cbd76))



## [1.3.37](https://github.com/NervJS/taro/compare/v1.3.36...v1.3.37) (2020-02-09)


### Bug Fixes

* **alipay:** 去掉hasPageInited判断，fix [#5424](https://github.com/NervJS/taro/issues/5424) ([756ff9e](https://github.com/NervJS/taro/commit/756ff9ef1f49f41cea47079aa5d02e0fd2d4ecfa))
* **components:** code optimization ([97aaaa5](https://github.com/NervJS/taro/commit/97aaaa56952655cc4e87610dfd73b9fdbeb602c5))
* **components:** radio click method lack error ([171a623](https://github.com/NervJS/taro/commit/171a623df310bf4d697405ee884fc129d68fd02e))
* **components:** ScrollView event fix [#3484](https://github.com/NervJS/taro/issues/3484) ([5225462](https://github.com/NervJS/taro/commit/52254621a0d9a7a98fe1e1641e9ec27da55003d0))
* **components:** 修复跳转时视频继续播放的问题, fix [#5412](https://github.com/NervJS/taro/issues/5412) ([50a3b66](https://github.com/NervJS/taro/commit/50a3b66c03aa11061b84aaf9c05f8c5a8355d30d))
* **components:** 暂时去除了h5中input的focus能力, fix [#5393](https://github.com/NervJS/taro/issues/5393) [#4991](https://github.com/NervJS/taro/issues/4991) ([d12c6c1](https://github.com/NervJS/taro/commit/d12c6c11dbba2ee2f048952144d53d615aaaf63a))
* **taro-components-qa:** 修复快应用scrollview组件事件无法触发问题 ([#5414](https://github.com/NervJS/taro/issues/5414)) ([187351f](https://github.com/NervJS/taro/commit/187351f7901d4e84333cfdaac14998a1a5928c0c))
* **taro-weapp:** 补上 uploadTask.headersReveived task ([d166c0b](https://github.com/NervJS/taro/commit/d166c0bf597eed0d87e890052550130d971d159c))
* docs redirect ([d75cae4](https://github.com/NervJS/taro/commit/d75cae44d2f9e2922bf01b7f87729580e11a9c39))
* radio with radio-group onCange prop fix [#4750](https://github.com/NervJS/taro/issues/4750) ([018e534](https://github.com/NervJS/taro/commit/018e534449b216fd0a5dc4f853464b7c452ecca4))
* scrollview 在火狐浏览器滚动中报错，导致onScroll不执行 fix[#5254](https://github.com/NervJS/taro/issues/5254) ([b20dfc4](https://github.com/NervJS/taro/commit/b20dfc4d2600d79559fd8aea9706d1c2239f0b66))
* 补全组件文档脚本生成 fix [#4908](https://github.com/NervJS/taro/issues/4908) ([ad902f6](https://github.com/NervJS/taro/commit/ad902f6cec0067dbc03a43902304571eff87bcfd))


### Features

* **component:** upload components types ([a2a4ca8](https://github.com/NervJS/taro/commit/a2a4ca85ce5f50453c129440dc459e2b4c442674))
* **components:** 修复按钮 hoverClass 属性 fix [#4088](https://github.com/NervJS/taro/issues/4088) ([e5340d5](https://github.com/NervJS/taro/commit/e5340d5f405610fa805d73de0960853d9e67d1c1))
* **docs:** 文档更新 ([28ddd91](https://github.com/NervJS/taro/commit/28ddd91b74fbabd3bd254efd9d1432c38ddc2597))
* **docs:** 暂时屏蔽没有添加的API文档 ([a7582af](https://github.com/NervJS/taro/commit/a7582aff44d93cb3dd29373833e185b95a091382))
* **docs:** 添加文档脚本识别参数=>京东小程序 ([8eef12b](https://github.com/NervJS/taro/commit/8eef12bd7d627c1586f1e7125cea548b2920e65c))
* **taro-weapp:** 增加 uploadTask.headersReveived，fix [#5407](https://github.com/NervJS/taro/issues/5407) ([37b23c2](https://github.com/NervJS/taro/commit/37b23c2134414d0be57c681d8550b29dc774f5db))
* add types docs absence ([a4e0556](https://github.com/NervJS/taro/commit/a4e055673aaafdfbe1f98f9e5a78bf9987da86b5))



## [1.3.36](https://github.com/NervJS/taro/compare/v1.3.35...v1.3.36) (2020-01-21)


### Bug Fixes

* **cli:** 修复 Node 13 创建项目时的问题, close [#5285](https://github.com/NervJS/taro/issues/5285) ([7bcd4a8](https://github.com/NervJS/taro/commit/7bcd4a8e3250a569ace25a7d725f2ad207d4fa2c))
* **swan:** 修复百度小程序 ref, close [#2631](https://github.com/NervJS/taro/issues/2631) ([c54193a](https://github.com/NervJS/taro/commit/c54193aae44d3abae740cd5affd727652ad03205))
* **weapp/qq:** 微信、qq小程序 request 并发数改为 10，fix [#5291](https://github.com/NervJS/taro/issues/5291) ([aba16f0](https://github.com/NervJS/taro/commit/aba16f09f26ab38e8e56e11d57df7d82477213ba))


### Features

* **swan:** 百度也加上绕开 diff 的后门 ([efc55ae](https://github.com/NervJS/taro/commit/efc55aeffa3f4535dce80842d7611024aa5904ee)), closes [#5277](https://github.com/NervJS/taro/issues/5277)



## [1.3.35](https://github.com/NervJS/taro/compare/v1.3.34...v1.3.35) (2020-01-08)


### Bug Fixes

* **alipay:** 支付宝分包时 Current 应该挂 my 上，fix [#5204](https://github.com/NervJS/taro/issues/5204) ([4106d5c](https://github.com/NervJS/taro/commit/4106d5c5b969a07a2ca16f0d1317866e140d1301))
* **alipay:** 支付宝小程序分包下 compid 应该挂全局 ([a07ec74](https://github.com/NervJS/taro/commit/a07ec74d6d56ac9a966586f76c6017867a217900))
* **cli:** windows下配置 weapp.compile.exclude 为 npm 包时路径问题 ([#5227](https://github.com/NervJS/taro/issues/5227)) ([a946f86](https://github.com/NervJS/taro/commit/a946f86c04ffc06bccfc4ce72fc2e0b98c8ee3d0))
* **mini:** 修复 requset API 不触发 success 和 fail 的问题，close [#5271](https://github.com/NervJS/taro/issues/5271) ([0c5bfe7](https://github.com/NervJS/taro/commit/0c5bfe78cccb99fead7b147930eeaa3de9ccc066))
* **types:** 补充 chooseImage 在 H5 下的类型 ([c2a02ed](https://github.com/NervJS/taro/commit/c2a02ed63e95389878f5ed16255b416599a0af5b))
* **weapp:** allow Taro.getUserInfo to take no param ([#5248](https://github.com/NervJS/taro/issues/5248)) ([60e5691](https://github.com/NervJS/taro/commit/60e5691203bcdbe2ffa934d42b09d8a5400e24ff))
* **weapp:** incorrect Taro.canvasToTempFilePath typing ([#5250](https://github.com/NervJS/taro/issues/5250)) ([317604c](https://github.com/NervJS/taro/commit/317604c0232bb18845a93d0b88a310a9c33980b8))
* **weapp:** 修复 Taro.cloud 部分函数返回错误的类型定义 ([#5270](https://github.com/NervJS/taro/issues/5270)) ([9b056ce](https://github.com/NervJS/taro/commit/9b056ceea1e42c1f9ce2efc61a5af7a676590719))
* **weapp:** 修复小程序 request 并发没有限制的问题，close [#5213](https://github.com/NervJS/taro/issues/5213) ([a4e8a38](https://github.com/NervJS/taro/commit/a4e8a38110f6581d337062fa5d48f2fe347cdbf1))
* **weapp:** 导出 wx.env 对象，增加 Taro.env.USER_DATA_PATH 类型定义 close [#3710](https://github.com/NervJS/taro/issues/3710) ([d902d3e](https://github.com/NervJS/taro/commit/d902d3e1a6f4fac4ca163eb9e82a56d043cc4327))
* **weapp:** 添加微信小程序 webp 属性和修复函数式组件缺少的 externalClasses 类型 ([#5273](https://github.com/NervJS/taro/issues/5273)) ([c82380e](https://github.com/NervJS/taro/commit/c82380e09c3dcd4fde7fdb8754816325e7f2755c))
* **weapp/qq/tt/alipay:** 预加载不支持 switchTab，close [#5185](https://github.com/NervJS/taro/issues/5185) ([1ce8c48](https://github.com/NervJS/taro/commit/1ce8c48a49a6d2149982b01d9aaa971fa9c365a5))
* 修复h5独有属性类型 ([2d3a3a0](https://github.com/NervJS/taro/commit/2d3a3a05689c1dc8627856bd92a75f88bd6fc599))


### Features

* **taro-weapp/taro-with-weapp:** 增加 isUsingDiff 开关 ([e0af665](https://github.com/NervJS/taro/commit/e0af66550b49e565ba99b3d00c98355bde5b013b))
* upload for auto-api for components ([c8855ba](https://github.com/NervJS/taro/commit/c8855bab41ce8ddfcc922ea1304042ef7dfd7ee1))
* **h5:** chooseImage回调中加入了originalFileObj属性 ([fe346ef](https://github.com/NervJS/taro/commit/fe346efc9b06926371ab7065f5e4e07839b25293))



## [1.3.34](https://github.com/NervJS/taro/compare/v1.3.33...v1.3.34) (2019-12-31)


### Bug Fixes

* **template:** 临时解决 ESLint 分析器认为 Config 未使用的问题 [#5207](https://github.com/NervJS/taro/issues/5207) ([ed6f261](https://github.com/NervJS/taro/commit/ed6f2615870386fb1a4780708533ebc69f8443a8))
* **template:** 添加 @typescript-eslint/eslint-plugin 并更新模版配置 [#5207](https://github.com/NervJS/taro/issues/5207) ([899dacf](https://github.com/NervJS/taro/commit/899dacf932ff144b40b0444766bbc81434874292))
* cloud 对象方法未能导出, fixed [#5195](https://github.com/NervJS/taro/issues/5195) ([73a2ddc](https://github.com/NervJS/taro/commit/73a2ddc69810f3e76b6c70e4680283f9a1c4578e))
* error var name ([c6c9c02](https://github.com/NervJS/taro/commit/c6c9c027ce2fe26b6f7fd99e36456b63ff112673))
* **cli:** 当前主版本无稳定版本导致更新报错的问题，并添加文档 ([7852967](https://github.com/NervJS/taro/commit/785296745862306d7cdc9c82935e1114c5691eaf))
* **cli:** 获取到确切的 latest vertion ([d7f2ca5](https://github.com/NervJS/taro/commit/d7f2ca537660ccdb150ee81f22640560ed3b17a7))
* **h5:** h5环境previewImage左右滑动时触发浏览器前进、后退 ([c3c9929](https://github.com/NervJS/taro/commit/c3c9929e1b6da8b0ef7d64e87c96bc200f4faec7))
* **router:** H5下 ReLaunch 没办法跳到指定的页面 ([484d3b0](https://github.com/NervJS/taro/commit/484d3b09174b7458e11be2a82ee0a567eec5f89f))
* **taro-h5:** fix scroll issue in iOS when using showToast/showModal/showActionSheet ([#5092](https://github.com/NervJS/taro/issues/5092)) ([698c057](https://github.com/NervJS/taro/commit/698c057eece9742ccfbda3548bfb27c477fb1619))
* **tt:** 修复头条基础库1.38.2后引起的 slot 问题 ([fffa784](https://github.com/NervJS/taro/commit/fffa784bfaabeb9ddbb13da0d8de043109bde8e3))


### Features

* **cli:**  添加了 version 校验 ([325e6d2](https://github.com/NervJS/taro/commit/325e6d2c86ae6633a47e7f6f0061031113ec6d1e))
* **h5:** 为h5的uploadFile添加了额外的文件名参数 ([46fdce6](https://github.com/NervJS/taro/commit/46fdce695d5f0c150adac31807e9c4da84ae6906))


### Reverts

* 临时解决 ESLint 分析器认为 Config 未使用的问题 [#5207](https://github.com/NervJS/taro/issues/5207) ([863a5a5](https://github.com/NervJS/taro/commit/863a5a594111b3c34172aab2f73a456b2e03585a))



## [1.3.33](https://github.com/NervJS/taro/compare/v1.3.32...v1.3.33) (2019-12-25)


### Bug Fixes

* **transform-wx:** 修复微信开发者工具key警告(使用常量key判断) ([#5181](https://github.com/NervJS/taro/issues/5181)) ([c2044dd](https://github.com/NervJS/taro/commit/c2044dd58264068bd9fc64ecf7f24bd657715b50))
* **transformer:** 修复循环 ref 测试用例 ([b3a7874](https://github.com/NervJS/taro/commit/b3a78742ef85f9e56fcf4989ba7b16821a948bbe))
* **transformer:** 替换掉 key 中包含 LOOP_ORIGINAL 的字符串 ([1c99523](https://github.com/NervJS/taro/commit/1c9952395c96522eeb6128b335b358921a0ecb30))



## [1.3.32](https://github.com/NervJS/taro/compare/v1.3.31...v1.3.32) (2019-12-24)


### Bug Fixes

* **cli:** update 命令获取 taro 版本时兼容 beta 为 lastest 的情况 ([d854a3e](https://github.com/NervJS/taro/commit/d854a3e19a8ac8d8082c209d40a5daa89d35ce60))
* **components:** componentWillUnmount lifecycle ([#5135](https://github.com/NervJS/taro/issues/5135)) ([297eefa](https://github.com/NervJS/taro/commit/297eefa1d43c38c3255e54e8c14b7663a9ac58db))
* remove js extension ([073e704](https://github.com/NervJS/taro/commit/073e70471710ff22b558e586d5cd1155f6f3f155))


### Features

* **cli:** taro update 到指定版本或者更新到 major 的 latest 版本 ([ae0bf9b](https://github.com/NervJS/taro/commit/ae0bf9b9e0a48ffd63319cea374c49392cf7a25b))
* checkout from auto-docs ([67a945a](https://github.com/NervJS/taro/commit/67a945a25d55365f2ce1ed9fdbc57f4539749b55))



## [1.3.31](https://github.com/NervJS/taro/compare/v1.3.30...v1.3.31) (2019-12-20)


### Bug Fixes

* **cli:** add taro-rn package in template to pass cli version validate ([5b8bf19](https://github.com/NervJS/taro/commit/5b8bf1908c270ea0f752d980a6e9dec1ab25b405))
* **components:** h5 image 删除无关代码 ([#4998](https://github.com/NervJS/taro/issues/4998)) ([b37483e](https://github.com/NervJS/taro/commit/b37483e7f1965cc40282157506d61d3eacb89ec5))
* **components:** 修复 Image 组件在 react 环境下报错的问题 ([2d7ccee](https://github.com/NervJS/taro/commit/2d7ccee9da259029b8ac6f4aaa67b94e2f7f344c))
* **miniprogram:** 修复循环 ref 问题，fix [#5052](https://github.com/NervJS/taro/issues/5052) ([af9d81c](https://github.com/NervJS/taro/commit/af9d81cf49c2d5ec816bdf3865f1aa6a8fdb87b2))
* **miniprogram:** 修复循环内使用 ref 的问题，fix [#5050](https://github.com/NervJS/taro/issues/5050) ([4e718a2](https://github.com/NervJS/taro/commit/4e718a214ca322653ba5a4c0c7e58290dd73770e))
* **taro:** 增加 getRealtimeLogManager api, close [#5072](https://github.com/NervJS/taro/issues/5072) ([36fd185](https://github.com/NervJS/taro/commit/36fd1857e90b45b795b51b279fa17e97050387ba))
* **taro:** 增加 nextTick api ([23a754e](https://github.com/NervJS/taro/commit/23a754ec74b7a239de68282d1b6fa7dc92d7eaef))
* **typescript types:** 修复 Taro.getExtConfigSync 返回值类型。 ([#5114](https://github.com/NervJS/taro/issues/5114)) ([d67dfc2](https://github.com/NervJS/taro/commit/d67dfc24aaa5669645cc55d226a3bbc9359b14e4))
* **weapp:** 生命周期调用不严谨 ([19fcf2c](https://github.com/NervJS/taro/commit/19fcf2c16de1f0e59935fe354bf0e3c466b5aa69))
* **with-weapp:** props 无法监听 & data 有循环数据报错 ([aa0e3dd](https://github.com/NervJS/taro/commit/aa0e3dd0954ceef08317ecb405b0763ea5190994))
* video component ([f2e0dad](https://github.com/NervJS/taro/commit/f2e0dad8c03e317c560d16d6acf89d90f04dd049))


### Features

* **weapp:** taro config add style typing ([#5090](https://github.com/NervJS/taro/issues/5090)) ([4e2b7f0](https://github.com/NervJS/taro/commit/4e2b7f080b90f45ad1a88441301d5cdf3b086b06))
* add style for video ([6e3a65f](https://github.com/NervJS/taro/commit/6e3a65f7630de190a2997069b55abe8055098bf5))
* checkout from auto-docs ([9d753fc](https://github.com/NervJS/taro/commit/9d753fc8cbc39575028a3406334c4fa7a33c546c))
* **weapp:** add missing type for image component ([#5071](https://github.com/NervJS/taro/issues/5071)) ([f07e6b5](https://github.com/NervJS/taro/commit/f07e6b5b734d2a2f617ec0b3f639ff0acea14c1f))



## [1.3.30](https://github.com/NervJS/taro/compare/v1.3.29...v1.3.30) (2019-12-18)


### Bug Fixes

* **transformer:** 修复微信开发者控制台 key 报警 ([e6910db](https://github.com/NervJS/taro/commit/e6910db3d1b688a9bfba1c9dc66bb5ec5e066eea))


### Features

* **with-weapp:** 支持 observers ([3affac6](https://github.com/NervJS/taro/commit/3affac6c4b492f89cdf17a38766921d42b2d330f))



## [1.3.29](https://github.com/NervJS/taro/compare/v1.3.28...v1.3.29) (2019-12-11)


### Bug Fixes

* **jd:** 京东小程序暂不支持插件 ([553ff83](https://github.com/NervJS/taro/commit/553ff83a4ed0ff0209fb65cb842f1165642aebfb))
* **weapp/tt/swan/qq/jd:** 取消“从 prevProps 改为使用 nextProps”的改动 ([48b8271](https://github.com/NervJS/taro/commit/48b82713b674929354cf14e7f896a38d68a6582b))


### Reverts

* **weapp:** 取消“从 prevProps 改为使用 nextProps”的改动 ([8694e8f](https://github.com/NervJS/taro/commit/8694e8f415629826cfc01fd45259ab47ae1cbafa))



## [1.3.28](https://github.com/NervJS/taro/compare/v1.3.27...v1.3.28) (2019-12-11)


### Bug Fixes

* **cli:** 删掉模板中空的 copy 配置 ([7274ce2](https://github.com/NervJS/taro/commit/7274ce2f9c644b9c1ad1770d447325a852deafe0))
* **weapp:** setData 前需要深拷贝衍生自 state 的 data, fix [#5012](https://github.com/NervJS/taro/issues/5012) ([0892241](https://github.com/NervJS/taro/commit/0892241461a72318fde4e5a3e7298101b26d113b))
* 修复 API 类型重构导致的编译失败问题 ([fd96d81](https://github.com/NervJS/taro/commit/fd96d81a0a1d55fa40bfe2a30b69634d0613d666))


### Features

* checkout scripts from auto-docs ([dba5426](https://github.com/NervJS/taro/commit/dba54265d5e8656c6d398248c96daac6690ea154))
* checkout types from auto-docs branch ([70ec501](https://github.com/NervJS/taro/commit/70ec50124eaff53e441dd49b774c2f412ecd8eb9))
* createSelectorQuery Method`scrollOffset` fix ([e8af0a8](https://github.com/NervJS/taro/commit/e8af0a81e30ebbcea4042c06fd48673a164f8328))



## [1.3.27](https://github.com/NervJS/taro/compare/v1.3.26...v1.3.27) (2019-12-03)


### Bug Fixes

* **cli:** 修复编译 ui 库及 plugin 时报错的问题，close [#4965](https://github.com/NervJS/taro/issues/4965) ([36ef638](https://github.com/NervJS/taro/commit/36ef638a3956f4a62669400c44ac51c42e078a91))
* **components:** h5 image在unmount时取消IntersectionObserver监听 ([#4975](https://github.com/NervJS/taro/issues/4975)) ([a42bc6e](https://github.com/NervJS/taro/commit/a42bc6eccd6488240e79a4e240ec832ffc4b18d7))
* **qq:** import nextTick & updateComponent ([59ecaad](https://github.com/NervJS/taro/commit/59ecaada845cf5c46c1e74eddf8cc3b2faba4cf1))
* **taro:** modify live-pusher props are not required ([#4952](https://github.com/NervJS/taro/issues/4952)) ([c10feed](https://github.com/NervJS/taro/commit/c10feedd0eb0a341532768caba699df9850ed7a1))
* **taro:** 修复页面 config 参数缺失 pageOrientation 的类型定义 ([#4961](https://github.com/NervJS/taro/issues/4961)) ([6277ea3](https://github.com/NervJS/taro/commit/6277ea3502c8705f1c4bb673704baad225e46230))
* **taro:** 修正 lineCap 的类型 ([#4992](https://github.com/NervJS/taro/issues/4992)) ([3bbd955](https://github.com/NervJS/taro/commit/3bbd9557033b8994969b87b2def3d84c5062d0ee))
* **taro.component:** 修改类组件构造器定义，保持向后兼容 ([e8eb71e](https://github.com/NervJS/taro/commit/e8eb71ed395c9d682a834502c1b93e92a144caff))
* **taro.components:** fix Taro.FC typings and others, close [#4987](https://github.com/NervJS/taro/issues/4987) ([57c3346](https://github.com/NervJS/taro/commit/57c33469ee13aa29f83493fad0d2fb5a83c0eefa))
* **transformer-wx:** enhancing the eslint checker ([#4995](https://github.com/NervJS/taro/issues/4995)) ([27d9905](https://github.com/NervJS/taro/commit/27d99056a77e5b28379364467d796f9d0ef14901))
* set transform method ([f681da1](https://github.com/NervJS/taro/commit/f681da15741c8d92dc70cd2031ef213e35a1002e))
* **template:** default 模版补充 rn 和 quickapp 的依赖 ([7ea8892](https://github.com/NervJS/taro/commit/7ea8892cfa797cd8e99ff9860fd33b45fe0ed344))
* **tt:** 修复头条小程序报nextTick is undefined ([f75ee9b](https://github.com/NervJS/taro/commit/f75ee9b754774fde7d57d2864f0f8b4a58ca5546))


### Reverts

* **template:** 从默认模版中移除 RN 依赖 ([9dcdc61](https://github.com/NervJS/taro/commit/9dcdc617c291520e8e3d9abf21ed7972d53b3f94))



## [1.3.26](https://github.com/NervJS/taro/compare/v1.3.25...v1.3.26) (2019-11-27)


### Bug Fixes

* ref在字节跳动中不能使用的BUG ([b0ca0a3](https://github.com/NervJS/taro/commit/b0ca0a3c6f049f6cd65349a034a54b9d87944466))
* 修改代码格式问题 ([838766b](https://github.com/NervJS/taro/commit/838766bb8879b4643c687824913b53375624c02f))
* **alipay:** 函数 Page 组件没有触发effect cleanup ([deaebb7](https://github.com/NervJS/taro/commit/deaebb7762f0b4d6da455ddd640ff938e523171a)), closes [#4068](https://github.com/NervJS/taro/issues/4068)
* **cli:** Bug css url loader ([#4780](https://github.com/NervJS/taro/issues/4780)) ([de11450](https://github.com/NervJS/taro/commit/de114504a36a01221ba5571f7c45ac8c6fc40bf5))
* 修正previewImage点透问题 ([#4802](https://github.com/NervJS/taro/issues/4802)) ([36e19b5](https://github.com/NervJS/taro/commit/36e19b57ab327243c6f5ab3ef585022ed169b3fe))
* **cli:** ui 库编译支持 css modules，[#4445](https://github.com/NervJS/taro/issues/4445) ([a9993c5](https://github.com/NervJS/taro/commit/a9993c5a82cb50631268f1cea535cee673332540))
* **cli:** ui 库编译时从 npm 包中引入的样式不做处理 ([75f8d11](https://github.com/NervJS/taro/commit/75f8d11f07067fc4df450fdcb8f17200587bb9bb))
* **cli:** 修复插件 watch 时在 windows 上的路径问题 ([b8196fd](https://github.com/NervJS/taro/commit/b8196fdd7f1be5f915f180e9edfed09813c911a6))
* **cli:** 修复插件 watch 时在 windows 上的路径问题，fix [#4811](https://github.com/NervJS/taro/issues/4811) ([8acfae8](https://github.com/NervJS/taro/commit/8acfae8deac84216575f56ea7b6a12ba9bd75ca9))
* **cli:** 修正qq轻应用配置文件读取 ([#4865](https://github.com/NervJS/taro/issues/4865)) ([ae6f268](https://github.com/NervJS/taro/commit/ae6f2686e47a4702177e326b8a6870bae98d0932))
* **cli:** 组件引用支持 import as 语法 ([642ce25](https://github.com/NervJS/taro/commit/642ce251616ab1c572bc6ed37ae2c7da257490e6))
* **components:** h5下Image的aspectFill与小程序不一致([#4620](https://github.com/NervJS/taro/issues/4620)) ([#4897](https://github.com/NervJS/taro/issues/4897)) ([989a3ce](https://github.com/NervJS/taro/commit/989a3ce59acc25cc49266f708bf480fa326cb7ea))
* **components:** 修复联想词无法触发 onInput (close [#4677](https://github.com/NervJS/taro/issues/4677)) ([a39a4ee](https://github.com/NervJS/taro/commit/a39a4ee65df8f574c93fe5f0a28d092d8eac9694))
* **docs:** 修复和优化 readme 描述错误 ([#4864](https://github.com/NervJS/taro/issues/4864)) ([1cfbf13](https://github.com/NervJS/taro/commit/1cfbf130b3486a2b91db7bad7a1eb77be31dbfae))
* **hooks:** 钩子 useState，设置新 state 和当前 state 全等时跳过渲染。 ([aec705e](https://github.com/NervJS/taro/commit/aec705ec653be62eacc96a552cccb49ffe8a9ec1))
* **taro-cli:** 小程序组件打包时，将打包参数传递到依赖文件的打包中 ([#4924](https://github.com/NervJS/taro/issues/4924)) ([c2e7e04](https://github.com/NervJS/taro/commit/c2e7e04cefd5dc52970a22baa9b05d2c1c070f6e))
* **taro-router:** 修复路由参数 `path` ([#4921](https://github.com/NervJS/taro/issues/4921)) ([bef8531](https://github.com/NervJS/taro/commit/bef85311a6ebc51102affce5a5cab014234b1842))
* 修复 commom.d.ts 的 animation 类型错误 ([#4920](https://github.com/NervJS/taro/issues/4920)) ([91660c2](https://github.com/NervJS/taro/commit/91660c246f22e075755f49ef099c68f7561eb9fb))
* **weapp:** 修复插件通过 extraProps 不能传函数的问题，fix [#4658](https://github.com/NervJS/taro/issues/4658) ([f240cff](https://github.com/NervJS/taro/commit/f240cffc79f29bc4cdd21e3dd5747172137e9337))
* **weapp:** 添加微信小程序 getLocation 参数定义 ([#4916](https://github.com/NervJS/taro/issues/4916)) ([267c15d](https://github.com/NervJS/taro/commit/267c15d692e330d98208a3d529d0efdbcba0a0d1))
* **weapp:** 调整 wx.pageScrollTo 类型签名 ([#4856](https://github.com/NervJS/taro/issues/4856)) ([28fb2e9](https://github.com/NervJS/taro/commit/28fb2e9273527b434a9ded437e53b0f3ef033541))
* **weapp/jd/qq/swan/tt:** 循环中 pm.observers 应该在 observer 里绑定。fix [#4839](https://github.com/NervJS/taro/issues/4839) ([64f1ea4](https://github.com/NervJS/taro/commit/64f1ea4205a673d022106892e0c39f2b28eb3d09))


### Features

* **cli:** 引入第三方原生组件支持 ([#4526](https://github.com/NervJS/taro/issues/4526)) ([adf8864](https://github.com/NervJS/taro/commit/adf8864151d6f15b677f86cc63cc708b3e6a0a91))
* **taro:** 添加Wi-Fi新API(offWifiConnected & offGetWifiList)及更新文档 ([#4927](https://github.com/NervJS/taro/issues/4927)) ([cae2997](https://github.com/NervJS/taro/commit/cae299769db3cb8926d1416091480d7fdb90f50d))
* **webpack-runner:** h5环境支持自定义source-map格式 ([#4722](https://github.com/NervJS/taro/issues/4722)) ([472324d](https://github.com/NervJS/taro/commit/472324decb44b569de5e7229597618877db426f8))
*  rn 环境下CoverView 与 CoverImage 向下兼容为 View 与Image ([0cd0741](https://github.com/NervJS/taro/commit/0cd0741bca927e1ceb6dd13b259bcdb32a448cd5))
*  rn 配置添加onlyTaroToRn字段,支持项目构建只编译不打包 ([c766251](https://github.com/NervJS/taro/commit/c766251f8fb33540946480026e247c8e8b878812))
*  rn 配置添加onlyTaroToRn字段,支持项目构建只编译不打包 ([2188030](https://github.com/NervJS/taro/commit/2188030dc51449cd611ef61537bc3376cfa27a20))
*  在rn环境下,window属性支持配置backgroundColor ([2bea8b7](https://github.com/NervJS/taro/commit/2bea8b7a66b8e84c289d62b6a898c26024aa610c))
* docs with general types ([716e826](https://github.com/NervJS/taro/commit/716e8260a44c3a550f09196bfcc6b974e49397a5))
* multi-supported ([079e95a](https://github.com/NervJS/taro/commit/079e95a9459f6a7353a4cfde5912ec8949b8f9c1))
* upload types ([4e9d19f](https://github.com/NervJS/taro/commit/4e9d19fc362a3f32210c35b4c09bc9a09c95aac6))
* **button:** 优化 Button 部分事件的参数类型 ([d2d156b](https://github.com/NervJS/taro/commit/d2d156ba54a701ca3f13017839736fcbfbd2228f))



## [1.3.25](https://github.com/NervJS/taro/compare/v1.3.24...v1.3.25) (2019-11-14)



## [1.3.24](https://github.com/NervJS/taro/compare/v1.3.23...v1.3.24) (2019-11-13)


### Bug Fixes

* **rn:** Taro.previewImage 报错 ([8fa7045](https://github.com/NervJS/taro/commit/8fa70459468ccb260602876dbefbfa0f3f7984c0))
* **ui:** 修复 ui 库编译的入口文件生成 ([0994338](https://github.com/NervJS/taro/commit/099433800b98345324466d94eeb0d44d9e7d33aa))
* **ui:** 移除 ui 库编译后 h5 入口文件中的冗余代码 ([445f243](https://github.com/NervJS/taro/commit/445f2439fe728d123379d1f80ce0d440634d65e8))
* **weapp:** 修复微信小程序遗留代码：nextProps 初始化，引起的冲突 ([00cf71c](https://github.com/NervJS/taro/commit/00cf71c4318af0d04474c3f532b776a57e187049))



## [1.3.23](https://github.com/NervJS/taro/compare/v1.3.21...v1.3.23) (2019-11-12)


### Bug Fixes

* **transformer:** 调整 $$refs 相关代码以通过 ref 测试用例 ([f4cb414](https://github.com/NervJS/taro/commit/f4cb414197a283a6fcf4489dc78fe2f523c4ddc3))
* docs output ([5e8c828](https://github.com/NervJS/taro/commit/5e8c828939252f2605eb1e6b8d29810cf585ea7d))
* **alipay:** 对自组件 didmount 中拿不到最新 this.props 的问题做兜底，fix [#4769](https://github.com/NervJS/taro/issues/4769) ([a68c67c](https://github.com/NervJS/taro/commit/a68c67c30ffb0254a1b089acbb9f5dc7b90b2df0))
* **alipay/jd/qq/swan/tt:** 小程序暴露 RefsArray 给编译时 ([a442efd](https://github.com/NervJS/taro/commit/a442efda99df397085314c47aa2413748a59342d))
* **chore:** dependabot couldn't reach registry.m.jd.com as it timed out close [#4684](https://github.com/NervJS/taro/issues/4684) ([258ea17](https://github.com/NervJS/taro/commit/258ea1766048dca42646a61b7de1b1b0b693af47))
* **cli:** rn 端添加 babel-plugin-transform-decorators-legacy 插件 close [#4764](https://github.com/NervJS/taro/issues/4764) ([a504a44](https://github.com/NervJS/taro/commit/a504a448cdc9ddef92efee1d5f209710875e9d44))
* **cli:** ui 库打包将 ts 编译成 js，close [#4672](https://github.com/NervJS/taro/issues/4672) ([a51ee6a](https://github.com/NervJS/taro/commit/a51ee6a436a81a5317e8a43a0e85ecb021ad7442))
* **cli:** ui 库打包时会 copy .d.ts 结尾的 interface 文件 && 移除 H5 打包时入口的多余代码，[#4672](https://github.com/NervJS/taro/issues/4672) ([3f16e4d](https://github.com/NervJS/taro/commit/3f16e4dc68d446120fc44ba6af6677ccba87990e))
* **cli:** 修复 cli 编译 ui 库的若干问题 ([62452cd](https://github.com/NervJS/taro/commit/62452cd3517a8de4a61d1bb9437610bd2f038328))
* **cli:** 修复解析 node_modules 中组件路径的问题 ([013a1c3](https://github.com/NervJS/taro/commit/013a1c39a5c60acc50f6b70494e138ed44c42936))
* **cli:** 快应用支持从 node_modules 中解析组件 ([523caa5](https://github.com/NervJS/taro/commit/523caa55c9e6d26b1ec0e764b40c092a936adf2c))
* **cli:** 编译微信插件时需要对 plugin.json 指定的入口文件的后缀进行处理，close [#4773](https://github.com/NervJS/taro/issues/4773) ([f5b689d](https://github.com/NervJS/taro/commit/f5b689d33c2af3b364fad7fe6604b0d00e6d5639))
* **cli:** 编译的 node_modules 中文件类型处理错误 ([f7a03fb](https://github.com/NervJS/taro/commit/f7a03fb3a42481de2b2dbba1c9fec2d5abfe25c1))
* **cli:** 避免h5运行时无限安装@tarojs/taro-h5 ([9201503](https://github.com/NervJS/taro/commit/92015036981e11d9b62267a14cde5824cc073c11))
* **components:** components props type checking ([948a940](https://github.com/NervJS/taro/commit/948a940e0023154e24b755d2a2b9d6a9857fd5f7))
* **components:** 修复一个typo ([ba9e614](https://github.com/NervJS/taro/commit/ba9e614190e0c5147f6e27f1e28364120d9f80f5))
* **components-rn:** 修正 rn build 脚本对于 windows 兼容问题 [#4792](https://github.com/NervJS/taro/issues/4792) ([d8eeb32](https://github.com/NervJS/taro/commit/d8eeb32e3eb9ad79700f77426c72725287c2a3e1))
* **components-rn:** 让编译器忽略类型检查 ([5ba6aee](https://github.com/NervJS/taro/commit/5ba6aeebd2675007c9ddf4be117cab5c17d9eb16))
* **mobx:** 修复 H5 & RN 端在生命周期函数中无法获得 store 信息的问题（[#4637](https://github.com/NervJS/taro/issues/4637)） ([87af6ee](https://github.com/NervJS/taro/commit/87af6eeefd823a6bdd0cf92f4c5353bec15c0192))
* **taro:** 修复编译器找不到 d.ts 文件的问题 ([463102c](https://github.com/NervJS/taro/commit/463102c9b0d0858f0a58274441b052d873fdad8b))
* move scripts docs in @tarojs/taro ([ac3705b](https://github.com/NervJS/taro/commit/ac3705b42270eeebf5cdae8fcda6facdbbf786aa))
* types path ([e430863](https://github.com/NervJS/taro/commit/e430863f7ac98012ba62bec6cb6ad98ce957df3a))
* types reference ([f4ea65c](https://github.com/NervJS/taro/commit/f4ea65c045377d53423575ffe9df94c6afb9327e))
* types use param-case nomenclature ([f88eacb](https://github.com/NervJS/taro/commit/f88eacbb6cecfa167ebbcae48de8cafc2d937997))
* **jd:** 京东小程序 getSystemInfoSync 兜底 ([df6c6fd](https://github.com/NervJS/taro/commit/df6c6fd35c6a374f9b034b22862cbed05d64f1a6))
* **rn:** react native中input实现有问题，close [#4613](https://github.com/NervJS/taro/issues/4613) ([16257d0](https://github.com/NervJS/taro/commit/16257d0965322ba72709cff34f14be9aee10f503))
* **rn:** 接入项目的 babel config 配置导致的 constructor 编译错误 ([ba853b8](https://github.com/NervJS/taro/commit/ba853b8f4a6294e8678baf0a0c29f98e43131ef6))
* **taro:** 修复 setClipboardData 错误的返回类型 ([bea4b44](https://github.com/NervJS/taro/commit/bea4b446d74dd3b90f92eebf63d9026c157a499b))
* **taro:** 修复小程序生命周期 hook 在 rerender 后只触发最后一个 ([#4642](https://github.com/NervJS/taro/issues/4642)) ([5ca1e6c](https://github.com/NervJS/taro/commit/5ca1e6c43ff3daa1ae55fcbd1995c7a47ee30e5f))
* **taro-h5:** 修复 H5 下 iOS 设备 Taro.setClipboardData 无效 [#4611](https://github.com/NervJS/taro/issues/4611) ([a94897d](https://github.com/NervJS/taro/commit/a94897d9a74a38329bf462e6e5fa2f296f0aef41))
* **taro-plugin-sass:** 修复 plugins.sass 只配置了 resource 时编译出错的问题 ([92b53d7](https://github.com/NervJS/taro/commit/92b53d7d3edd12143fec8377aad743cf775dab3d))
* **taro-router:** 修复 min-height 误写成 height ([0a98fd1](https://github.com/NervJS/taro/commit/0a98fd1c82ff8c2909e5273b9ffbdf57e4284d7a))
* **taro/transformer:** 修复 useRef 拿不到实例的问题，fix [#4466](https://github.com/NervJS/taro/issues/4466) ([fe6b13c](https://github.com/NervJS/taro/commit/fe6b13c6bc6afafe0848e1f8649e8faca2d1c460))
* **transformer-wx:** 快应用暂时不处理 ref ([a7b6b20](https://github.com/NervJS/taro/commit/a7b6b208461fd3892d4cb8ba8b8442e89b7ea9ea))
* **transformer-wx:** 编译器不读取用户的 babel 配置 ([fce3eb5](https://github.com/NervJS/taro/commit/fce3eb54faa23f5495eb34578c2e9d6872685505))
* **types:** alipay ([da6840b](https://github.com/NervJS/taro/commit/da6840b6c1b4a7e11cd258a6555ffa34133e5325))
* **types:** types 索引签名参数类型不能为联合类型问题修改 [#4776](https://github.com/NervJS/taro/issues/4776) ([0131e95](https://github.com/NervJS/taro/commit/0131e95ebe6706ac5b2994132ee439a67a4756d7))
* 开发第三方多端 UI 库默认只编译小程序和 H5 ，并添加 platforms 配置 ([7d49b64](https://github.com/NervJS/taro/commit/7d49b64fc145fcb4feaffff9685fdb10e86aa427))


### Features

* **weapp:** 从prevProps改为使用nextProps，避免props的提前赋值 ([b2bdb6e](https://github.com/NervJS/taro/commit/b2bdb6e397c11be45ef153495a605a8016c6ef4e))
* abstract auto-doc format method ([7ee5bdc](https://github.com/NervJS/taro/commit/7ee5bdc3ae1cc8f050b3522fc6d1f5eff99ce19a))
* add auto docs decs ([02674b7](https://github.com/NervJS/taro/commit/02674b71d609e3a00fd1e936be8ee26ee96f43ae))
* add mult-example ([913da30](https://github.com/NervJS/taro/commit/913da30ab9129c5d7aaade5f1c7af6ce158917b7))
* auto docs ([7713e52](https://github.com/NervJS/taro/commit/7713e52fb32380845a28a26e8d57b92ae6755e72))
* get types from ts ([e0e1852](https://github.com/NervJS/taro/commit/e0e1852790139e55ff287cca285ee7528f3adc14))
* upload types-docs programme ([808aba1](https://github.com/NervJS/taro/commit/808aba1960fcfa711c4eb3bae5ed5cee51b76884))
* **cli:** RN 编译使用 babel 配置 ([a3df953](https://github.com/NervJS/taro/commit/a3df953719719f59b162ae5818cc7aea5373e189))
* **rn:** 添加 RN 端 ui build 的 watch ([811e895](https://github.com/NervJS/taro/commit/811e89566235fb33007be03765fa1e9eeefeb233))
* **taro:** 分享参数增加动态消息相关字段 [#4618](https://github.com/NervJS/taro/issues/4618) ([d95f3cc](https://github.com/NervJS/taro/commit/d95f3cc538812135c110982d927fae95f83005d6))
* **taro:** 新增 getSelectedTextRange 和 hideHomeButton API ([82037c9](https://github.com/NervJS/taro/commit/82037c921bf08afc8450ec8c31c48c34435fd61a))
* **taro:** 添加 getSelectedTextRange 的类型定义 close [#4654](https://github.com/NervJS/taro/issues/4654) ([d4eccf8](https://github.com/NervJS/taro/commit/d4eccf88ecfdb644986c592ed0b7e945076282c1))
* **taro:** 添加 hideHomeButton 的类型定义 close [#4629](https://github.com/NervJS/taro/issues/4629) ([a552264](https://github.com/NervJS/taro/commit/a5522646df04d1b548c8183522a94912f51cbba4))
* **taro-webpack-runner:** 使 H5 支持修改后的 plugin.sass 配置 ([f76467f](https://github.com/NervJS/taro/commit/f76467f5a3cefeded25b7967a0314e773252b341))
* **ui:**  实现 基于 Taro 开发第三方多端 UI 库 的RN 端 ([ecc1557](https://github.com/NervJS/taro/commit/ecc1557394e5cd02d929a7e680decfa9208992b9))
* **weapp:** requestSubscribeMessage 补充 [#4687](https://github.com/NervJS/taro/issues/4687) close [#4686](https://github.com/NervJS/taro/issues/4686) ([798a5d2](https://github.com/NervJS/taro/commit/798a5d2d19e1e2a966a5678b0b9ec04b840273a6))
* **webpack-runner:** dev-server配置host为0.0.0.0时, 默认以本地ip打开 ([#4699](https://github.com/NervJS/taro/issues/4699)) ([6bd7884](https://github.com/NervJS/taro/commit/6bd7884885fbf9a92168983e9c34c6b12af28ca4))


### Reverts

* 修改 types 目录结构，部分调整已适应自动化文档生成 ([4645773](https://github.com/NervJS/taro/commit/464577346c55695f3ce4be857dfa34d611c61c76))



## [1.3.21](https://github.com/NervJS/taro/compare/v1.3.20...v1.3.21) (2019-10-21)


### Bug Fixes

* **jd:** props 系统优化 ([18813a8](https://github.com/NervJS/taro/commit/18813a84662d60ec288c72fadb7a3ac2a8494cc0))
* **mobx:** mobx 监听器 dispose 之前先判断监听器是否存在([#4617](https://github.com/NervJS/taro/issues/4617)) ([0ab6b27](https://github.com/NervJS/taro/commit/0ab6b278e1bdfa88b1acfb342617b9cf2182af28))
* **rn:** rn上的Textarea在disableScroll为true时候的问题  close [#4476](https://github.com/NervJS/taro/issues/4476) ([f190dc1](https://github.com/NervJS/taro/commit/f190dc1adf3da2fbf997064505e196d8eeb186af))
* **taro:** 修复 h5 Fragment 支持方式 ([5e20e75](https://github.com/NervJS/taro/commit/5e20e757cbf6fde1cfd017e9eff32c543219c73a))
* **taro-h5:** 修复h5环境下setClipboardData在ios无效, 在android滚动到页面最后的问题 ([#4622](https://github.com/NervJS/taro/issues/4622)) ([351c0ac](https://github.com/NervJS/taro/commit/351c0acbcf09cdd43ef430697273f350541b74fe))
* **taro-h5:** 响应体无数据时抛错进入reject ([#4599](https://github.com/NervJS/taro/issues/4599)) ([84ce3ef](https://github.com/NervJS/taro/commit/84ce3ef150823ed19803504a80d29abec959177a))
* **taro-h5:** 支持fetch abort ([#4596](https://github.com/NervJS/taro/issues/4596)) ([7fdb3fc](https://github.com/NervJS/taro/commit/7fdb3fc805e91f3c41f7d3cd9cc333f8c84e1178))
* **transformer:** babel-remove-dead-code 求值不正确 ([bfaaa09](https://github.com/NervJS/taro/commit/bfaaa091435fb00e8d989819b6bf69604d44c3ed))
* **transformer-wx:** 解决babel插件path.hub 中无法获取文件名 ([#4495](https://github.com/NervJS/taro/issues/4495)) ([7453b8d](https://github.com/NervJS/taro/commit/7453b8d8fa298a938a8d7d7a03f23dcb400f6add))
* quickapp text lines fix [#4607](https://github.com/NervJS/taro/issues/4607) ([751cbd9](https://github.com/NervJS/taro/commit/751cbd950b64829370c065b2ab35082c933528e5))
* 快应用编译导致 lines 属性丢失 ([46aeaee](https://github.com/NervJS/taro/commit/46aeaeedbb7e61a2c70ee52ba0a8bd4c68ba109e))


### Features

* **rn:** add Taro.reLaunch close  [#4615](https://github.com/NervJS/taro/issues/4615) ([9664c45](https://github.com/NervJS/taro/commit/9664c45154fd7299c7c3bf002bb658adbb910650))
* **rn:** 添加 tabbar borderStyle 支持 ([ab46b5a](https://github.com/NervJS/taro/commit/ab46b5a0eb8d73f663d598c35a962fd51a98a21e))
* **router:** H5 实现 componentDidNotFound 方法 ([eb3f0e3](https://github.com/NervJS/taro/commit/eb3f0e3903209a94b6a088dfff60091b02895e43))
* **taro:** 增加 requestSubscribeMessage 的类型定义 [#4630](https://github.com/NervJS/taro/issues/4630) ([0165a4d](https://github.com/NervJS/taro/commit/0165a4d3771107c9cf6de1500327aa11e4fd62c5))



## [1.3.20](https://github.com/NervJS/taro/compare/v1.3.19...v1.3.20) (2019-10-14)


### Bug Fixes

* **cli:** h5 编译时读取 symbolic link 需要处理相对路径情况，[#4538](https://github.com/NervJS/taro/issues/4538) ([425d7b6](https://github.com/NervJS/taro/commit/425d7b67a64b54678cade3ac20396ffb1aa2ec61))
* **cli:** h5 页面 hooks 支持设置页面配置，close [#4592](https://github.com/NervJS/taro/issues/4592) ([d67490a](https://github.com/NervJS/taro/commit/d67490a3b4c998bb54dbed245c807ac30f5e141f))
* **cli:** taro convert 支持处理 app.json 中 sitemapLocation 属性，close [#4534](https://github.com/NervJS/taro/issues/4534) ([79e647e](https://github.com/NervJS/taro/commit/79e647e8533080098939c5c475479e191f373bbe))
* **cli:** 修正快应用依赖环境安装时，因系统不同造成的命令执行问题 ([#4520](https://github.com/NervJS/taro/issues/4520)) ([f2274ef](https://github.com/NervJS/taro/commit/f2274ef966a8f57a9654c7e1640f400a3626f4a5))
* **cli:** 小程序编译更好地支持 yarn workspaces ([f6da123](https://github.com/NervJS/taro/commit/f6da12350aa33ffb805f76cb486c65353f03a55f))
* **cli:** 编译报错的组件标记为已编译 ([1dc346c](https://github.com/NervJS/taro/commit/1dc346c4c8418268635e1c31428e296cd6ecd4df))
* **components:** iOS8需要添加webkit前缀 ([#4519](https://github.com/NervJS/taro/issues/4519)) ([08d0a3c](https://github.com/NervJS/taro/commit/08d0a3cdcdc37c3a2aaa402611efc32d129de605))
* **components:** 修复 Image lazy 监听问题 ([6ebcbea](https://github.com/NervJS/taro/commit/6ebcbeaed119438b7fb65834931838f3a123f204))
* **components:** 修复 Input 组件属性覆盖问题, fix [#4553](https://github.com/NervJS/taro/issues/4553) ([38bd6ec](https://github.com/NervJS/taro/commit/38bd6ecfb4a6f7c96f4ded4a5828887c5194af37))
* **mobx:** 修复 H5 及 RN 端使用 inject 装饰且具有继承关系中父类 constructor 不被调用的问题([#4507](https://github.com/NervJS/taro/issues/4507)) ([2d06388](https://github.com/NervJS/taro/commit/2d063881f9fa4e1a8779034b8c06e3a6d4d6f1eb))
* **router:** 修复hash模式下tabbar不展示的问题 ([61dc79a](https://github.com/NervJS/taro/commit/61dc79ab7253bd15427bc2fcc32ab9355792d3d7))
* **taro:** 新增支付宝小程序 WindowConfig 属性 ([#4548](https://github.com/NervJS/taro/issues/4548)) ([242e4f7](https://github.com/NervJS/taro/commit/242e4f74d415c5528b39fb59e618b5cc2b6a2483))
* **transformer:** 方法 findJSXAttrByName 需要考虑 JSXSpreadAttribute，fix [#4527](https://github.com/NervJS/taro/issues/4527) ([f9d3f87](https://github.com/NervJS/taro/commit/f9d3f877cef96e0d13c4c881e2696e6e6a9d67f1))
* **transformer:** 替换属性名前需要先判断，fix [#4511](https://github.com/NervJS/taro/issues/4511) ([642015f](https://github.com/NervJS/taro/commit/642015f807e92032da159f3a197da4b9af85cbf0))
* **transformer:** 高阶组件在 h5 被错误处理，close [#4345](https://github.com/NervJS/taro/issues/4345) ([6b4eed7](https://github.com/NervJS/taro/commit/6b4eed774a4dfe3ab3be42c0037ba0c40cc8ab18))
* **types:** upload map components types fix [#4328](https://github.com/NervJS/taro/issues/4328) ([7064a10](https://github.com/NervJS/taro/commit/7064a10f0e8e2d99d07bae209bbbbf21ec452d68))
* **weapp/qq/alipay/swan/tt/quickapp:** props 系统优化 ([0481893](https://github.com/NervJS/taro/commit/048189335792ba5194395656b75d2b6e8103133f)), closes [#4497](https://github.com/NervJS/taro/issues/4497)


### Features

* **cli:** 增加控制h5页面lazyload的参数h5.router.lazyload ([074a841](https://github.com/NervJS/taro/commit/074a841d586ebbd949465a2f9c392c1910f6e334))
* **h5:**  browser forward / back hide map [#4255](https://github.com/NervJS/taro/issues/4255) ([9c4ad12](https://github.com/NervJS/taro/commit/9c4ad12947848f4d39c381b2d0cc20249e9c2b16))
* **taro:** h5 和小程序端支持 Fragment ([76d278f](https://github.com/NervJS/taro/commit/76d278fc7ef372bbe61603573cc4e90b85ef0258))
* **taro:** 增加 useScope hook 以访问小程序原生作用域，close [#4600](https://github.com/NervJS/taro/issues/4600) ([67dfbf7](https://github.com/NervJS/taro/commit/67dfbf7254d6e0f9562f4ed108f926aaa588fbf8))
* **taro:** 按照微信小程序文档的分类方式拆分 index.d.ts 为 87 个文件 ([#4557](https://github.com/NervJS/taro/issues/4557)) ([9882bed](https://github.com/NervJS/taro/commit/9882bed0628f3f38d13b307bd94a53d87d4d0101))



## [1.3.19](https://github.com/NervJS/taro/compare/v1.3.18...v1.3.19) (2019-09-23)


### Bug Fixes

* **chore:** dependabot couldn't reach registry.m.jd.com  close [#4432](https://github.com/NervJS/taro/issues/4432) ([385ca6a](https://github.com/NervJS/taro/commit/385ca6af8ab58ea926d575f692044c70018ff277))
* **cli:** h5 编译时支持读取 symbolic link，close [#4431](https://github.com/NervJS/taro/issues/4431) ([dfbe42c](https://github.com/NervJS/taro/commit/dfbe42c18eb254b81fb3d295843b792bc6fb5127))
* **cli:** taro doctor 增加 weapp.compile.include 规则 ([b8a3c45](https://github.com/NervJS/taro/commit/b8a3c4539960944e6b8e04f6a97aac6ad2611add))
* **cli:** taro doctor 检测时优先使用本地的 eslint 配置 ([9e8359e](https://github.com/NervJS/taro/commit/9e8359e18437d58d9c6cef177aa4053c4c25b255))
* **cli:** ui 库编译支持文件循环引用，close [#4427](https://github.com/NervJS/taro/issues/4427) ([5e7fa88](https://github.com/NervJS/taro/commit/5e7fa88096d701496dfd52b4ae8ccd1ce857d5b0))
* **cli:** 修复h5环境下plugins-sass配置不生效的问题 ([#4474](https://github.com/NervJS/taro/issues/4474)) ([5237995](https://github.com/NervJS/taro/commit/5237995bb54127bdf6a90d57e2ef93c1d609466a))
* **cli:** 支付宝构建时需要处理安装的 UI 库中的文件路径，将 @ 替换为 _，close [#4490](https://github.com/NervJS/taro/issues/4490) ([304c4af](https://github.com/NervJS/taro/commit/304c4af48bb6ced5e25eb86e767f0387c8ac56c2))
* **components:** swiper 从尾到头指定下标时的表现形式问题 ([c46d71c](https://github.com/NervJS/taro/commit/c46d71ca1838732fd8d68ecddfe885d3d006e3b1))
* **components:** 修复 swiper 指示点颜色问题 ([b6818a3](https://github.com/NervJS/taro/commit/b6818a3e582680c078452967f4059a4e617e6ac4))
* **mobx:** 生命周期 getDerivedStateFromProps 不被触发问题修复 ([492c1fb](https://github.com/NervJS/taro/commit/492c1fb70acc612b8df83415528ddd46e160bbd9))
* **taro:** 修复 Taro.request 每次调用都会 push taroInterceptor, fix [#4441](https://github.com/NervJS/taro/issues/4441) ([f030a4e](https://github.com/NervJS/taro/commit/f030a4eb07f3762d047e8e88916fb94c3ee76e71))
* **taro:** 内置拦截器向上暴露 abort, fix [#4386](https://github.com/NervJS/taro/issues/4386) ([ddbbcef](https://github.com/NervJS/taro/commit/ddbbcef868722ee9b734812e9ced79ba56544992))
* **taro:** 增加 RefsArray 用于存放 $$refs ([4a59930](https://github.com/NervJS/taro/commit/4a599301c39079511361cbd79ce363cbcd2cf2c2))
* **taro:** 支付宝、百度、快应用、字节跳动中调用 forceUpdate 时，不应执行 shouldComponentUpdate ([bb223a1](https://github.com/NervJS/taro/commit/bb223a11072df59ad24995da82989442ac50c3cd))
* **taro-alipay:** 修复 app 中声明 onShareAppMessage 不生效的问题，fix [#4477](https://github.com/NervJS/taro/issues/4477) ([9a17867](https://github.com/NervJS/taro/commit/9a178676666051f486dc294c78f7fb2937943bc6))
* **taro-alipay:** 修复支付宝小程序 onTabItemTap 事件不触发的问题，close [#4517](https://github.com/NervJS/taro/issues/4517) ([3cd7e7a](https://github.com/NervJS/taro/commit/3cd7e7aaf8adcad0124cacc77baf91fa3db73b9f))
* **taro-cli:** 修复插件 prod 模式下编译问题，fix [#4231](https://github.com/NervJS/taro/issues/4231) ([4564acd](https://github.com/NervJS/taro/commit/4564acdd425cfeac060947c1a43a433612e3ba99))
* **types:** canvas drawImage方法类型检查错误 ([#4481](https://github.com/NervJS/taro/issues/4481)) ([5e79fde](https://github.com/NervJS/taro/commit/5e79fde7b4ed445b0f4f33b48b41c13e147585a8))
* **video:** this.progressBallRef is undefined ([#4407](https://github.com/NervJS/taro/issues/4407)) ([0a7fc45](https://github.com/NervJS/taro/commit/0a7fc45e2a2aa3c1f27478b263fe74d21a085b1d))
* **with-weapp:** setData 保持数据修改同步 ([68d5801](https://github.com/NervJS/taro/commit/68d58019a68a28c312ef1bd9fb77e8b47ce882cf))


### Features

* **apis:** 增加位置 API，close [#4448](https://github.com/NervJS/taro/issues/4448) ([cf283ac](https://github.com/NervJS/taro/commit/cf283acc3df2f399942d176294f68a95e1b9c5fc))
* **cli:** ui 编译支持指定入口文件，[#4445](https://github.com/NervJS/taro/issues/4445) ([a639390](https://github.com/NervJS/taro/commit/a639390fe35ea5174d4c1d50272e110930e12367))
* **cli:** 增加快应用子组件定制规则，减少快应用端的预览错误 ([#4436](https://github.com/NervJS/taro/issues/4436)) ([708ceb9](https://github.com/NervJS/taro/commit/708ceb9e811ab3b8f47521d72142405a5e75246f))
* **jd:** 适配京东小程序 ([512d4ce](https://github.com/NervJS/taro/commit/512d4ceb4d2522d70b4fe6369ffbc741bbe8c4cb))



## [1.3.18](https://github.com/NervJS/taro/compare/v1.3.16...v1.3.18) (2019-09-07)


### Bug Fixes

* **cli:** 增加快应用支持的样式 ([90116c2](https://github.com/NervJS/taro/commit/90116c242189e68fd7c5f1162bdcb61c9185bd46))
* **cli:** 小程序 debug 与快应用 logLevel 不挂钩 ([65af0ee](https://github.com/NervJS/taro/commit/65af0ee0e2be418373b6d27e9ebc63476ca65fcf))
* 添加QQ小程序分享功能缺失的参数属性showShareItems ([#4421](https://github.com/NervJS/taro/issues/4421)) ([a923335](https://github.com/NervJS/taro/commit/a923335c03dcdfd94b24c37ae80aad3129c299cd))
* **cli:** 修复快应用编译时样式处理细节问题 ([76d8ff7](https://github.com/NervJS/taro/commit/76d8ff785d33291546d8ea3dc3e851bd7e6904ff))
* **cli:** 去掉快应用编译时没必要的尺寸转换 ([2150e7b](https://github.com/NervJS/taro/commit/2150e7bd653275a5a557d6de6d75d8a6dbd3f1c5))
* **cli:** 快应用编译时错误注释掉了支持的样式 ([4a829f6](https://github.com/NervJS/taro/commit/4a829f685a5389e6282cc8e15fa9d086739ba1c1))
* **cli:** 调整 taro-page 插入逻辑，close [#4357](https://github.com/NervJS/taro/issues/4357) ([d03d23c](https://github.com/NervJS/taro/commit/d03d23c9e4fc3da694b539e9ae552a027a0f8fd5))
* **components:** 修复快应用事件重复触发问题 ([742ac61](https://github.com/NervJS/taro/commit/742ac615454a5a186fa7cf614b999e8b2b5f6020))
* **docs:** react native 端的 moduleName ([7150a66](https://github.com/NervJS/taro/commit/7150a66a83afe6e542d9f1fbc16d7fac521ba5e9))
* **docs:** 修复原生组件传 props 给自定义组件的用法文档 ([5e72332](https://github.com/NervJS/taro/commit/5e7233269919753f49de283646953863bb684c27))
* **router:** h5 page min-height 失效 [#4092](https://github.com/NervJS/taro/issues/4092) ([cbf2edf](https://github.com/NervJS/taro/commit/cbf2edfcc10ea5b4a734cf1544a9e0940b9de93e))
* **transformer:**  循环中使用自定义组件失效, close [#4359](https://github.com/NervJS/taro/issues/4359) ([e290a7c](https://github.com/NervJS/taro/commit/e290a7c6b427069a38cfbeaa1e2d2c63b5254d8e))
* **transformer:** 任何情况下快应用 view 都解析为 div ([#4410](https://github.com/NervJS/taro/issues/4410)) ([958a617](https://github.com/NervJS/taro/commit/958a61709e87e9b4349c02963d1c5be973d28adf))
* **weapp/qq:** 修复新 props 系统在微信小程序下循环渲染时的问题。fix [#4350](https://github.com/NervJS/taro/issues/4350) ([ae66b35](https://github.com/NervJS/taro/commit/ae66b35577cdab10c08d9c6135e6ac65198637ba))
* lint ([6e7a7d1](https://github.com/NervJS/taro/commit/6e7a7d1d47d10b8e771d16912d55b31446535af2))
* **transformer:** 只有 render 开头的函数才是 render props ([e1cf11c](https://github.com/NervJS/taro/commit/e1cf11c02be379cc9ac6334ef02b9526df745e5b)), closes [#4180](https://github.com/NervJS/taro/issues/4180)


### Features

* **cli:** taro-init ([6a32f4c](https://github.com/NervJS/taro/commit/6a32f4c43505e2a445a26c979f6609c12414e948))
* **cli:** taro-init新增clone选项 ([#4400](https://github.com/NervJS/taro/issues/4400)) ([c157b71](https://github.com/NervJS/taro/commit/c157b71f82c8dff8bf9e403524ac5314a9ccb490))
* **cli:** 增加了一些功能: ([a910b03](https://github.com/NervJS/taro/commit/a910b038be9b1f44f5b8699afcd8f35f001ce0c0))
* **cli:** 小程序支持单独编译单个组件和页面 ([c40e0ab](https://github.com/NervJS/taro/commit/c40e0ab82a46c963aa3627f042884830742577b5))
* **cli component:** tabbar支持多页面模式 ([26184de](https://github.com/NervJS/taro/commit/26184deab97f8b9cde0036ee46becb350678b7c9))
* **router:** 支持在多页面模式中使用api跳转 ([6134d28](https://github.com/NervJS/taro/commit/6134d2857a88ce304fc72cfa30c90f2ac2461a54))
* **webpack-runner:** h5端支持编译到多个html文件 ([a8cfb54](https://github.com/NervJS/taro/commit/a8cfb54dab962ae8efa168ffe7cf0b6eeb1b2448))
* **webpack-runner:** webpack-runner支持直接打开多页模式的首页 ([0220071](https://github.com/NervJS/taro/commit/0220071e7e28c885a96f9fb4e52aad0a7fef76b5))
* **webpack-runner:** 加入预览端口自动切换的功能 ([6480a21](https://github.com/NervJS/taro/commit/6480a2165d894a95f4a82eb5ac07eae2af245cd9))



## [1.3.16](https://github.com/NervJS/taro/compare/v1.3.14...v1.3.16) (2019-09-01)


### Bug Fixes

* **cli:** 修复h5的页面文件不支持named export的问题, close [#4290](https://github.com/NervJS/taro/issues/4290) ([7fee56b](https://github.com/NervJS/taro/commit/7fee56b5aaa72c10f548cbb966b6a3ae64cabd29))
* **cli:** 加入了templates里dot开头的文件 ([159e4d6](https://github.com/NervJS/taro/commit/159e4d63819ff56be10895ca311fc0b51eec3c99))
* **cli:** 去除拼接图片的错误提示 ([#4236](https://github.com/NervJS/taro/issues/4236)) ([afde06f](https://github.com/NervJS/taro/commit/afde06f668cfb54dddedb2cbf2984b61fedd0f9f))
* **cli:** 快应用 manifest 的 versioncode和minPlatformVersion必须是整型 ([#4318](https://github.com/NervJS/taro/issues/4318)) ([0a7bd5e](https://github.com/NervJS/taro/commit/0a7bd5e6a9c2a0f87c58e58aef2e5f3b33f939c4))
* **cli:** 插件编译 watch 时，plugin 内的 json 文件也需要修改 npm 路径 ([1c060a0](https://github.com/NervJS/taro/commit/1c060a044ec05e3d3615f19aab3e74206f463060))
* **cli:** 插件编译把 fs.moveSync 改 fs.move 避免一些问题。fix [#4231](https://github.com/NervJS/taro/issues/4231) ([720f0f7](https://github.com/NervJS/taro/commit/720f0f7e67d1c3b21212cd7b36657620282db3ee))
* **cli:** 插件编译时，plugin 内的 json 文件也需要修改 npm 路径，fix [#3794](https://github.com/NervJS/taro/issues/3794) ([346778c](https://github.com/NervJS/taro/commit/346778ca489fccd387df04cc6af616ce737d6327))
* **cli:** 重命名templates里dot开头的文件 ([e612d11](https://github.com/NervJS/taro/commit/e612d11cd8ce61d90ea2a16d3d33e2094743f385))
* **components:** 修复快应用 style 属性问题，修复 H5 image 问题 (close # 4116) ([40c47a0](https://github.com/NervJS/taro/commit/40c47a0db2bb7f953a3880c54c40f6ce8ae5b3c5))
* **components:** 修改快应用组件接受属性 ([4e18c5d](https://github.com/NervJS/taro/commit/4e18c5deaac4a45a328d11ac40544c95a14aa3ec))
* **components-qa:** canvas不能有子组件 ([#4339](https://github.com/NervJS/taro/issues/4339)) ([3cb94b0](https://github.com/NervJS/taro/commit/3cb94b0667583d174a684f28c531f8e25c5f7690))
* **components-qa:** labelerror 修复拼写错误 ([#4286](https://github.com/NervJS/taro/issues/4286)) ([8cdb40d](https://github.com/NervJS/taro/commit/8cdb40da649bcc102d8699ea2e9c1b6df4f01eac))
* **h5:** 修复measureText返回undefined的问题, close [#4254](https://github.com/NervJS/taro/issues/4254) ([bca1733](https://github.com/NervJS/taro/commit/bca17339fb644a620d5f464b57fd458264134f1c))
* **taro:** 修复小程序下 usePageScoll/useReachBottom 等 hook 中 state/props 不更新的问题 ([10e72fb](https://github.com/NervJS/taro/commit/10e72fb02cabf971886da1a133273efe92ddd1d2))
* **taro-h5:** 修复 H5 中 usePageScoll/useReachBottom hooks 不生效问题 ([4829b43](https://github.com/NervJS/taro/commit/4829b433369a99e2aefb52742fd81860f72fef3c))
* **taro-hooks:** 组件方法 hooks 如 useShareAppMessage 需要暴露返回值，fix [#4256](https://github.com/NervJS/taro/issues/4256) ([daf5fed](https://github.com/NervJS/taro/commit/daf5fed11d5146fd3961411ce7512b5d7662632e))
* **taroize:** include不存在的模板会导致整个模板返回 null ([4e6c97a](https://github.com/NervJS/taro/commit/4e6c97a8bb8506f370567ccd380697f0ed5d2881)), closes [#4265](https://github.com/NervJS/taro/issues/4265)
* **taroize:** wx:if后面有空格的问题，另外wxs标签不需要进行format操作,否则会报错 ([#4218](https://github.com/NervJS/taro/issues/4218)) ([0c9d3bb](https://github.com/NervJS/taro/commit/0c9d3bb7f619f15e94dabda7ea185f4ddfd0e91e))
* **taroize:** wxs import 需要保持原有命名 ([98556a3](https://github.com/NervJS/taro/commit/98556a3dfbf3186d5efcce2f8711b82f4b832385))
* **taroize:** 内联 wxs 每次都要生成的文件 ([51a2415](https://github.com/NervJS/taro/commit/51a24153525abb64ba6206c6efb5ffdf688bf0b8))
* **taroize:** 给app.js添加withWeapp ([064ec7e](https://github.com/NervJS/taro/commit/064ec7ef39b9e32a2a1fb7bcc6611309ce78dcf5))
* **taroize:** 统一格式化为一行，否则会有unterminate line end的错误 ([#4244](https://github.com/NervJS/taro/issues/4244)) ([1af6e3a](https://github.com/NervJS/taro/commit/1af6e3a3b7f75d2bf85d753e1dc5b7489eabef0a))
* **taroize:** 通过 this.triggerEvent 调用的参数需要用对象包裹 ([b661745](https://github.com/NervJS/taro/commit/b661745ea4c55f1d1848c72b4e1fe99a2df5a643))
* **transformer:** children 与组合支持有限的条件表达式 ([80642bc](https://github.com/NervJS/taro/commit/80642bc915dcafa659fda910a6dde8c07a80d63a)), closes [#4293](https://github.com/NervJS/taro/issues/4293)
* **transformer:** props 更新不会更改 state 的键值 ([181a878](https://github.com/NervJS/taro/commit/181a878b22d7857684dd665fe90c1796f87f3063))
* **transformer:** render props 参数判定出错 ([b94ca6f](https://github.com/NervJS/taro/commit/b94ca6fc44dd5e05fe152b3383a374b4359f4987)), closes [#4237](https://github.com/NervJS/taro/issues/4237) [#4180](https://github.com/NervJS/taro/issues/4180)
* **transformer-wx:** 修复transformer内eslint依赖版本不一致的问题 ([5e42777](https://github.com/NervJS/taro/commit/5e42777c402bd2778920e916b0f9f4de693b8dfd))
* **transformer-wx:** 快应用内置组件不需要走心 props 系统 ([bcde899](https://github.com/NervJS/taro/commit/bcde899d98b00a367910df802f079d33642c7dc8))
* **transformer-wx:** 快应用内置组件的 className 替换为 class ([9ad94f4](https://github.com/NervJS/taro/commit/9ad94f47ed9d502e55bb2e8afcddece527948023))
* **transformer-wx:** 快应用内置组件的属性不需要经过新 props 系统处理 ([7187b9a](https://github.com/NervJS/taro/commit/7187b9a5c859da4ae62f65754f71243562bea818))
* **typings:** 增加设备方向 apis typings，fix [#4213](https://github.com/NervJS/taro/issues/4213) ([29c4dc6](https://github.com/NervJS/taro/commit/29c4dc690203ca545230252bea29e8713237bc04))
* **with-weapp:** 修复 taroize 转换后 setData 方法无回调的问题 ([58f8038](https://github.com/NervJS/taro/commit/58f80382398aac1198593154ed65d3f6f909bd4b))
* **with-weapp:** 有三个选项需要设置为 static ([f1b37e3](https://github.com/NervJS/taro/commit/f1b37e383eab5bf3e4f237cd92d8af71ac882304))
* **with-weapp:** 给onShow传递options ([9d94380](https://github.com/NervJS/taro/commit/9d94380ee33af32b393f9dc3e52e831f97d02906))


### Features

* **cli:** 快应用编译支持引入原生快应用组件 ([ada2290](https://github.com/NervJS/taro/commit/ada22905315cec507c63bf0c9e151b7927a997fc))
* **taro:** 增加设备方向 api ([54baf98](https://github.com/NervJS/taro/commit/54baf98b15035bee2b67aea64a32a0823fc5028b))
* **taro-quickapp:** 快应用支持 Taro.getApp API，close [#4246](https://github.com/NervJS/taro/issues/4246) ([3b8c9a1](https://github.com/NervJS/taro/commit/3b8c9a13c97b73028d2987dfb4fee860849e2519))
* **taroize:** 解析 wxml 加入缓存机制 ([af71480](https://github.com/NervJS/taro/commit/af714806a43afc19d84aab8be7797d25fe71aa75)), closes [#4203](https://github.com/NervJS/taro/issues/4203)
* **transformer:** 快应用循环中判断内置组件条件遗漏 ([21c70ef](https://github.com/NervJS/taro/commit/21c70efe01f3f23dffabaac46c9d7c59b08279e1))
* **with-weapp:** 加入测试 ([11d964b](https://github.com/NervJS/taro/commit/11d964b58a0cb6bfba9b3ca8f24b6b22158439e4))
* h5端增加preval支持, close [#4219](https://github.com/NervJS/taro/issues/4219) ([5472900](https://github.com/NervJS/taro/commit/547290094cec3641b376dea7749ff446e008e401))



## [1.3.14](https://github.com/NervJS/taro/compare/v1.3.13...v1.3.14) (2019-08-19)


### Bug Fixes

* **cli:** prepublish 创建测试模板时不纠正 _gitignore 等文件。fix [#4081](https://github.com/NervJS/taro/issues/4081) ([38b84dd](https://github.com/NervJS/taro/commit/38b84dda69223958eea0b56564ad4d90d9f8321c))
* **cli:** taro doctor 使用 typescript-eslint/parser ([093133a](https://github.com/NervJS/taro/commit/093133a213858c66d230f63bb983b90d2cd28baf)), closes [#3598](https://github.com/NervJS/taro/issues/3598) [#4161](https://github.com/NervJS/taro/issues/4161)
* **cli:** taroize 参数传递错误 ([#4168](https://github.com/NervJS/taro/issues/4168)) ([04c4d0a](https://github.com/NervJS/taro/commit/04c4d0a436f5ce3add2cea0774262033c6649685))
* **cli:** 修复 windows 创建模板时路径问题，fix [#4196](https://github.com/NervJS/taro/issues/4196) ([ba32828](https://github.com/NervJS/taro/commit/ba328286183773f8b51993e74f7e5a6de2aad229))
* **cli:** 创建页面时模板不存在则先拉取模板，fix [#4106](https://github.com/NervJS/taro/issues/4106) ([c79ef23](https://github.com/NervJS/taro/commit/c79ef23b3ff702fe93dbddf421a27c486b1f8c39))
* **cli:** 快应用支持 copy sign 文件，close [#4079](https://github.com/NervJS/taro/issues/4079) ([c363559](https://github.com/NervJS/taro/commit/c3635596404bf099d033f38c835326851a30225b))
* **cli:** 路径替换 extname 使用更严谨的正则去 replace。fix [#4148](https://github.com/NervJS/taro/issues/4148) ([58f9829](https://github.com/NervJS/taro/commit/58f982990e1259d4d0ad9cf80a263ae09d19bdcd))
* **mobx:** 修改 observer typing ([489001e](https://github.com/NervJS/taro/commit/489001e8bff83e5425f526f733ad70d0008d496c))
* **taro:** 增加 Map polyfill ([985eadf](https://github.com/NervJS/taro/commit/985eadf1f9d8da59cd4da623d418df0320171119))
* **taro:** 缺少 Hooks 函数导出 ([a8211d3](https://github.com/NervJS/taro/commit/a8211d34f74705bcf8e7e9598268f81e860967fd))
* **taro:** 避免直接调用 pxTransform 函数报错 ([309627d](https://github.com/NervJS/taro/commit/309627dfde44c4175e920e8329f138d4927be9e6))
* **taro-cli:** 小程序解析 npm 中的 json 引用需直接替换为 json 值，close [#4164](https://github.com/NervJS/taro/issues/4164) ([4443ee0](https://github.com/NervJS/taro/commit/4443ee0aa7d69792b70067fed6224ffd39df0479))
* **taro-quickapp:** 变量使用错误 ([5bb14fb](https://github.com/NervJS/taro/commit/5bb14fb9610b54cdfbc186920b62422c6f131316))
* **taro-quickapp:** 快应用支持 useDidShow/useDidHide/useRouter 等 Hook API ([2254b8b](https://github.com/NervJS/taro/commit/2254b8bdacdcb5a624c9932b173d82d533f838e2))
* **taro-weapp/qq/tt/alipay:** 修复 $componentType 错误，fix [#4123](https://github.com/NervJS/taro/issues/4123) ([a6e31b5](https://github.com/NervJS/taro/commit/a6e31b5c1304d773c9cd3b45dad63844839746d9))
* **transformer:** &emsp;/&ensp 解析为空格 ([8280ec1](https://github.com/NervJS/taro/commit/8280ec13d3a7f6ae13b259b4823af360c5340f02))
* **transformer:** context 传入 null 无法解构，close [#3910](https://github.com/NervJS/taro/issues/3910) ([d795d45](https://github.com/NervJS/taro/commit/d795d453583e6d1526054c427b89e81207d6e071))
* **transformer:** h5 不需要调用 render props 编译 ([0de5870](https://github.com/NervJS/taro/commit/0de5870ecb9e28b52c46a3eef185c54fc7484b85)), closes [#4180](https://github.com/NervJS/taro/issues/4180) [#4021](https://github.com/NervJS/taro/issues/4021)
* **transformer:** hooks里return null会被解析成 jsx ([15c6e6a](https://github.com/NervJS/taro/commit/15c6e6a53f098dafb6d70d74a16a5702410f8c9b)), closes [#4073](https://github.com/NervJS/taro/issues/4073)
* **transformer:** typescript 无法使用类属性函数，close [#4159](https://github.com/NervJS/taro/issues/4159) ([f26ec37](https://github.com/NervJS/taro/commit/f26ec3786d01d2a973c62af3ecc26868b437d01f))
* **transformer:** 函数式组件使用 render props 问题 ([cea3579](https://github.com/NervJS/taro/commit/cea3579d62228ba930492b48a46be753a1a77f9e)), closes [#4180](https://github.com/NervJS/taro/issues/4180)
* **transformer:** 小程序 slot 统一用 view 包裹，close [#4162](https://github.com/NervJS/taro/issues/4162) ([fb9c769](https://github.com/NervJS/taro/commit/fb9c7698a42ae2fd3578dd77d148636244f67446))
* **transformer:** 当 iterators 为赋值表达式也需要用 $original 替换 ([95303e9](https://github.com/NervJS/taro/commit/95303e9793fce406845749a16b2797e980f1ef37)), closes [#4174](https://github.com/NervJS/taro/issues/4174)
* **transformer:** 枚举条件渲染编译错误，close [#4062](https://github.com/NervJS/taro/issues/4062) ([af495de](https://github.com/NervJS/taro/commit/af495de00452347b755bae03f12b77a94e2cdba1))
* **transformer:** 转换所有名为 wx 的引用型标识符，close [#3953](https://github.com/NervJS/taro/issues/3953) ([8157ed9](https://github.com/NervJS/taro/commit/8157ed9a5840be69e9a3d4a4c77a6ddbfe8f81d0))
* **transformer-wx:** 快应用的组件最外层容器不能有 if 判断，需要包一层 ([4ffec26](https://github.com/NervJS/taro/commit/4ffec26298f27a51ac66390ba8c467b926655bd6))
* **utils:** shallow equal 先判断是否为对象 ([7f67151](https://github.com/NervJS/taro/commit/7f67151490dcd983643b486399f9cfdbaf5a50cc))
* **with-weapp:** observer 在组件载入时需要执行一次 ([2235c54](https://github.com/NervJS/taro/commit/2235c547d552fdd195e29cb77ed24b318bb99d53)), closes [#4054](https://github.com/NervJS/taro/issues/4054)


### Features

* **cli:** cli的api支持创建项目后不安装依赖 ([07553ed](https://github.com/NervJS/taro/commit/07553edd6935208d236d580f2d28bf4d6267818c))
* **cli:** 快应用支持新 props 系统 ([152da05](https://github.com/NervJS/taro/commit/152da05d30fc83e69b87c00095dfe0f93da3e791))
* **taro:** 增加 useDidShow/useDidHide hooks ([3f47153](https://github.com/NervJS/taro/commit/3f47153c40d787ec4bbf2c5c7e11669ba74dbf04))
* **taro:** 增加 usePullDownRefresh/useReachBottom/usePageScroll/useResize/useShareAppMessage/useTabItemTap/useRouter hooks ([ba91cb9](https://github.com/NervJS/taro/commit/ba91cb97e1737b62824ed4ddda0d2203bfdf5f86))
* **taro-alipay:** 补全Button组件的类型定义 ([#4187](https://github.com/NervJS/taro/issues/4187)) ([ebd12b8](https://github.com/NervJS/taro/commit/ebd12b80cea69fcef0c6f4ad31fb4bfe4bf8bec4))
* **taro-h5:** H5 端支持 useDidShow/useDidHide/usePullDownRefresh 等 Hooks API ([45db749](https://github.com/NervJS/taro/commit/45db74908839de0dbad6a4332e786acf43fb4d3c))
* **taro-quickapp:** 快应用支持 componentWillPreload 和 this.$preload ([698bf6d](https://github.com/NervJS/taro/commit/698bf6d35d937848bed8b348154a1002b119d803))
* **taro-quickapp:** 快应用支持 hooks ([c8d565f](https://github.com/NervJS/taro/commit/c8d565f0406d932cb8da6fc58609adff22f5f7f7))
* **taro-quickapp:** 快应用新 props 系统支持改造 ([78a4228](https://github.com/NervJS/taro/commit/78a4228d063013d0ce900fa500ce0d541df399ff))
* **taroize:** 插件保留原组件名 ([eb0910d](https://github.com/NervJS/taro/commit/eb0910d0a4d07b2ed49768b54816c24a7db8ca90))
* **transformer:** 快应用加入新 props 系统 ([9d23d64](https://github.com/NervJS/taro/commit/9d23d64b027b44ed9709ba52bb0223bbb11b5adf))
* **transformer:** 支持 useRef 和 createRef 创建的 ref ([d862e1e](https://github.com/NervJS/taro/commit/d862e1eea876fe7e4db27358463374c6f9d070e5)), closes [#3945](https://github.com/NervJS/taro/issues/3945)



## [1.3.13](https://github.com/NervJS/taro/compare/v1.3.12...v1.3.13) (2019-08-12)


### Bug Fixes

* **alipay:** 添加获取会员信息api ([#4145](https://github.com/NervJS/taro/issues/4145)) ([c8563cd](https://github.com/NervJS/taro/commit/c8563cd21ed74cf0bd0cc001028a5a5ee2e491c0))
* **babel-plugin-transform-taroapi:** 修复h5 Component未定义的问题 ([2e25f97](https://github.com/NervJS/taro/commit/2e25f97eec27028c1a96c2fa2dd5d35f83cfb4bf))
* **babel-plugin-transform-taroapi:** 修复了页面中存在重命名api时编译报错的问题, fix [#4024](https://github.com/NervJS/taro/issues/4024) ([6e7f2ab](https://github.com/NervJS/taro/commit/6e7f2ab1fee84314f3550bbd45ad07a0b00836f3))
* **cli:** taro create 命令用法提示修改 ([77baeac](https://github.com/NervJS/taro/commit/77baeac7da9e6305f4a49f80817231d3b0feb5eb))
* **cli:** 修复因缺少 eslint-plugin-react-hooks 包导致 taro doctor 报错的问题，close [#4083](https://github.com/NervJS/taro/issues/4083) ([b1db5fd](https://github.com/NervJS/taro/commit/b1db5fd8d2a1b1521cffb09e07bcb6d5b0ca7594))
* **cli:** 快应用不支持navigationStyle，close [#4077](https://github.com/NervJS/taro/issues/4077) ([715fd3c](https://github.com/NervJS/taro/commit/715fd3cf04a572c8957e5736b896eca28f8c7f9c))
* **components:** 修复快应用 Image 组件问题 (close [#4067](https://github.com/NervJS/taro/issues/4067)) ([6b9a1ef](https://github.com/NervJS/taro/commit/6b9a1efb111c4cfcfbf2101ed7b209cd75c84b3e))
* **components:** 修复快应用组件属性报错问题 ([c071797](https://github.com/NervJS/taro/commit/c0717970cee38433f4e9f2608def4521524543df))
* **h5:** request的get请求数据为复杂结构不能正确发送的问题 ([1f51650](https://github.com/NervJS/taro/commit/1f51650c25c63ff8d3d46d4849c2470174893cdb))
* **h5:** 修复h5下onPullToRefresh缺少loading动画 ([c967b81](https://github.com/NervJS/taro/commit/c967b81a069da04be8e7707924b99cebc33b6d67))
* **redux:** 修复小程序 redux 没有取消注册 stateListener 的问题 ([5e0cb12](https://github.com/NervJS/taro/commit/5e0cb121dfe1350aec981ddd10d41273e8814a7b))
* **rn:**  使用 require 写法引入样式不编译 ([39334c6](https://github.com/NervJS/taro/commit/39334c62c5cea0052e1df301effe0ebe33f1662d))
* **rn:** [RN]Taro.uploadFile返回的不是Promise close [#4090](https://github.com/NervJS/taro/issues/4090) ([203eafd](https://github.com/NervJS/taro/commit/203eafd6f6be5797807f3334b7f7643eb685e242))
* **rn:** React-Native工程启动报错 close [#4082](https://github.com/NervJS/taro/issues/4082) ([941a3c2](https://github.com/NervJS/taro/commit/941a3c25962f05e8c69aeaf10bf71fd2edb18aee))
* **router:** router内对localstorage的操作加上了try..catch ([a68c5d9](https://github.com/NervJS/taro/commit/a68c5d91f3d15cb0708a0a7af5ef54fe42eb899e))
* **taro-alipay:** Taro.getScreenBrightness 在支付宝小程序下有差异修复，close [#4146](https://github.com/NervJS/taro/issues/4146) ([8862684](https://github.com/NervJS/taro/commit/886268484beadbb3ca4b5ab449b0335bf32ce334))
* **taro-components:** 修复circular为true却不会循环播放的问题 ([6db21b7](https://github.com/NervJS/taro/commit/6db21b7ba2422b67748e26ff3a6f0b8047924f1d))
* **taro-h5:** vibrate异常修复 ([#4113](https://github.com/NervJS/taro/issues/4113)) ([e234b36](https://github.com/NervJS/taro/commit/e234b3665b18e44b0f3d0e3a2d5de3408e64195e))
* **taro-h5:** 修复chooseImage生成的blob对象缺少类型的问题 ([b31fdc0](https://github.com/NervJS/taro/commit/b31fdc0142c72e48cbd4c63435230c831cca626c))
* **taro-quickapp:** 页面需暴露 onRefresh 函数，close [#4078](https://github.com/NervJS/taro/issues/4078) ([8943efa](https://github.com/NervJS/taro/commit/8943efab91f1b6ec9c3842bc52ca0794a1dea669))
* **taro-tt:** ref绑定报错 ([#4120](https://github.com/NervJS/taro/issues/4120)) ([283f448](https://github.com/NervJS/taro/commit/283f44840a620912d6663eb5771bb7dfb6ef6115))
* **taroize:** 修复插件usingComonent路径 plugin:// 开头转换报错 ([bc200e1](https://github.com/NervJS/taro/commit/bc200e15ec5f6ce6234bd26f6f9f99e34f42f844))
* **transformer:** 函数式组件找不到第三方组件声明，close [#4055](https://github.com/NervJS/taro/issues/4055) ([284e59d](https://github.com/NervJS/taro/commit/284e59de539ee64c710fedeeee95d6d17b4ff264))


### Features

* **taro-components:** camera 组件增加 onInitDone 回调，close [#4139](https://github.com/NervJS/taro/issues/4139) ([8007465](https://github.com/NervJS/taro/commit/8007465d0e59a2fda2b3d18301e9bf0a5aa55cb3))
* 支持canvas组件 ([d98012c](https://github.com/NervJS/taro/commit/d98012ce1ad7c3a6fccf11ee705ff1cafa57e884))
* **h5:** 使scroll-view组件在h5中支持scrollIntoView属性 ([a1b1698](https://github.com/NervJS/taro/commit/a1b16984711423a4fdd81ad5c014f1754c617c82))
* **rn:** 优化插入 React Import 代码的判断逻辑 ([e2cb224](https://github.com/NervJS/taro/commit/e2cb2248176644758009e604dae057142404e12e))
* **taro:** 补全CameraContext的类型定义 ([#4080](https://github.com/NervJS/taro/issues/4080)) ([1268cb1](https://github.com/NervJS/taro/commit/1268cb1bc5874f03eadf5fd84bef5f8dc485b1fe))
* **taro-components:** 为CanvasProps新增属性定义type, 支持微信小程序使用webgl的额外props ([#4044](https://github.com/NervJS/taro/issues/4044)) ([80b8afb](https://github.com/NervJS/taro/commit/80b8afbca7e88cfe5c98ba38dec883e8d2815314))



## [1.3.12](https://github.com/NervJS/taro/compare/v1.3.11...v1.3.12) (2019-08-05)


### Bug Fixes

* **cli:** default 模板把'.'开头文件改为'_'开头，close [#3944](https://github.com/NervJS/taro/issues/3944) ([91e696c](https://github.com/NervJS/taro/commit/91e696c46365ecbaf44c500bd3abd37d69bbdeca))
* **cli:** doctor 增加 h5.esnextModules 字段检测，close [#4029](https://github.com/NervJS/taro/issues/4029) ([95a22d4](https://github.com/NervJS/taro/commit/95a22d4587cd299002b461c948f8d560c0b0e8db))
* **cli:** 修正快应用编译时组件路径计算 ([b8a9582](https://github.com/NervJS/taro/commit/b8a9582551808af50ce1cab0279098335bc0728f))
* **cli:** 编译 RN 未等待编译完成就执行之后的操作 ([#4060](https://github.com/NervJS/taro/issues/4060)) ([c106408](https://github.com/NervJS/taro/commit/c10640865987b515edd9ff831663279ecac0592c))
* **hooks:** 修复 Taro.memo 会阻止组件内部 state 发生变化的更新的问题 ([8a99dd4](https://github.com/NervJS/taro/commit/8a99dd470aa11e12402e571314d444abd459b6ab))
* **taro:** fix typings, close [#3908](https://github.com/NervJS/taro/issues/3908) ([f73ecc2](https://github.com/NervJS/taro/commit/f73ecc23444b1bab99745a7db5f5cfc0e83d5fee))
* **taro:** showModal中的title参数不是必须 ([#4035](https://github.com/NervJS/taro/issues/4035)) ([4216bae](https://github.com/NervJS/taro/commit/4216bae5a1bd0e51648d0d1c358f6548676bace7))
* **taro:** Taro.memo 使用 shallowEqual 判断新旧 props ([d5d3733](https://github.com/NervJS/taro/commit/d5d3733f5f4287e9e7732c2e89f5a4f8af4760d0))
* **taro:** 直接引用 shallow-equal 路径进行编译 ([2ef7947](https://github.com/NervJS/taro/commit/2ef79474de05cc3fc50b723da8d08513484b3433))
* **taro-redux:** redux 兼容 getDerivedStateFromProps，close [#3929](https://github.com/NervJS/taro/issues/3929) ([4d950d0](https://github.com/NervJS/taro/commit/4d950d09191ea7d4cf0553ffe5e40f8ebc6a6d3d))
* **transformer:** 不以 render 开头的 JSX 函数没有重命名 ([2fc083b](https://github.com/NervJS/taro/commit/2fc083b494c5b88e04a5d39ee25a6cd4ec78c916)), closes [#4036](https://github.com/NervJS/taro/issues/4036)
* **transformer:** 多层循环不写 index 会生成相同的匿名 index ([13585cf](https://github.com/NervJS/taro/commit/13585cf377d4ac68ff6b3d3099d904ee830ab48d)), closes [#4011](https://github.com/NervJS/taro/issues/4011)
* **transformer:** 如果 if 表达式得 tester 是复杂表达式需要生成匿名变量 ([071ce65](https://github.com/NervJS/taro/commit/071ce65131b956121c76aea806f6b095c57bdd35)), closes [#4017](https://github.com/NervJS/taro/issues/4017)
* **tt:** ref绑定时态不正确的问题 ([29fdc3c](https://github.com/NervJS/taro/commit/29fdc3c80897da5f7d5daa9143af72c9dd4ea1f8))
* **tt:** 头条小程序  componentDidMount 触发时机调整 ([ea31a2a](https://github.com/NervJS/taro/commit/ea31a2a483f209e7346d7d0615b159764f873902))


### Features

* 补全FC类型定义，新增类型定义SFC，setPageInfo ([#4031](https://github.com/NervJS/taro/issues/4031)) ([eaa0eae](https://github.com/NervJS/taro/commit/eaa0eae7f17ffcfbc11c1b251df58d187fb0955e))
* **eslint:** 加入 hooks eslint 规则, close [#3598](https://github.com/NervJS/taro/issues/3598) ([bbe91e5](https://github.com/NervJS/taro/commit/bbe91e5d480292776abc888376a9e41fb83d4a0b))



## [1.3.11](https://github.com/NervJS/taro/compare/v1.3.10...v1.3.11) (2019-07-30)


### Bug Fixes

* **cli:** 修复部分场景 wx 不能替换成 Taro 的问题，close [#3941](https://github.com/NervJS/taro/issues/3941) ([8153221](https://github.com/NervJS/taro/commit/815322196b250476732a9043dd69f346ca890bd1))
* **cli:** 修正对快应用包名的判断，close [#4005](https://github.com/NervJS/taro/issues/4005) ([49ab3e0](https://github.com/NervJS/taro/commit/49ab3e0dcdad11b2d9f8a9c88d8fdc7efd76d5e0))
* **component-qa:** 调整快应用组件入参 ([a58f2ec](https://github.com/NervJS/taro/commit/a58f2ec35c38245ff44e427a9922d045706d75b5))
* **components-rn:** Swiper index 无法动态更新 fix [#2922](https://github.com/NervJS/taro/issues/2922) ([d46c2d7](https://github.com/NervJS/taro/commit/d46c2d7b99f00aa777079b5a9cb3375dbaa1b07a))
* **eslint:** 修复render props传入单个JSX元素或箭头函数报错的问题 ([#3906](https://github.com/NervJS/taro/issues/3906)) ([2d3bd05](https://github.com/NervJS/taro/commit/2d3bd0562600038393cdc069b7325af2bccac45e))
* **eslint:** 组件方法按最佳实践推荐的顺序书写，close [#3914](https://github.com/NervJS/taro/issues/3914) ([66000eb](https://github.com/NervJS/taro/commit/66000eb85c9992313b113d2e65ded0d6164e54ec))
* **h5:** 修复taro-h5 main字段的错误 ([d5db7f4](https://github.com/NervJS/taro/commit/d5db7f43d472544262c797ae6c7e5ffaf1e12624))
* **rn:** [RN]Taro.showActionSheet返回不是一个promise close [#3113](https://github.com/NervJS/taro/issues/3113) ([a26420b](https://github.com/NervJS/taro/commit/a26420becadafdaeee3ba7730737e221f8cd0815))
* **rn:** [RN]Taro.showModal返回的不是个Promise  close [#3203](https://github.com/NervJS/taro/issues/3203) ([e078572](https://github.com/NervJS/taro/commit/e078572b04458a7cabc0593a41057e5903daf6cd))
* **rn:** 添加 pxTransform 的响应式适配 ([7098dc0](https://github.com/NervJS/taro/commit/7098dc01f759f246038fb91cb59b182a3402f6fb))
* **router-rn:** taro-router-rn 构建失败 ([99f78c5](https://github.com/NervJS/taro/commit/99f78c5614292ae1bc226d41c9f99ffcef44bc09))
* **taro:** 编译成快应用时支持自定义titleBar ([a25f81f](https://github.com/NervJS/taro/commit/a25f81ff65857a44c0899a8449babef02f00d44c))
* **taro-weapp:** 修复state上空对象变为有数据时，子组件不会去setData ([6a3e69a](https://github.com/NervJS/taro/commit/6a3e69a9ebf766c5feb01047e707b19c9eac160b))
* **taroize:** 在 string props  直接写双引号报错，close [#3913](https://github.com/NervJS/taro/issues/3913) ([a1913f5](https://github.com/NervJS/taro/commit/a1913f5aee8fac45b0f81487c48f99ee897050b1))
* **transformer:**  事件处理传入普通成员表达式处理错误，close [#3923](https://github.com/NervJS/taro/issues/3923) ([affe845](https://github.com/NervJS/taro/commit/affe845669e0a1a3c75d5687c4cd0921391776a2))
* **transformer:** objectExpression property key'type ([#3932](https://github.com/NervJS/taro/issues/3932)) ([c6f587c](https://github.com/NervJS/taro/commit/c6f587c0ea7028f11ff102580453520116b626aa))
* **transformer:** propsManager 不再生成变量，close [#3914](https://github.com/NervJS/taro/issues/3914) ([98c2f86](https://github.com/NervJS/taro/commit/98c2f86fff06af34bf9fefdaaa714abf33c282f4))
* **transformer:** render 函数顺序靠前导致找不到当前类其它的 JSX 函数 ([cd84e67](https://github.com/NervJS/taro/commit/cd84e6740eeac56b3714c483a8287b50e492274e)), closes [#3966](https://github.com/NervJS/taro/issues/3966)
* **transformer:** 某些情况循环中使用 stopPropagation 报错 ([5b02527](https://github.com/NervJS/taro/commit/5b0252773c4f66f1fca8247d25700caa15c59aad)), closes [#3946](https://github.com/NervJS/taro/issues/3946)
* **transformer:** 解析 wx:else 内部的条件表达式错误，close [#3964](https://github.com/NervJS/taro/issues/3964) ([2be5032](https://github.com/NervJS/taro/commit/2be503265509fd54de5a63f730e1268690dfcdb4))


### Features

* **cli:** h5编译时自动修改@tarojs/taro-h5 ([babbf54](https://github.com/NervJS/taro/commit/babbf54ecbcb96300742a3c505d557795438f3a8))
* **h5:** 提供index.cjs.js供require使用 ([98fd51a](https://github.com/NervJS/taro/commit/98fd51a4508a7d990d43b4a89e50c8d44856fb49))
* **rn:** add RN API  TabBarRedDot and TabBarBadge ([cf798bf](https://github.com/NervJS/taro/commit/cf798bfcde3df2ef31877380d3f9c2d12293705f))
* **rn:** app 前后台切换时调用 componentDidShow 和 componentDidHide ([2bbccbc](https://github.com/NervJS/taro/commit/2bbccbc82c608f958b9b02cf5246373196e1d5e4))
* **rn:** 从 Taro 中暴露一些列 react api ([112d32b](https://github.com/NervJS/taro/commit/112d32b880453084f469c78e3306fbabbb743744))
* **taro:** 增加 onAudioInterruptionEnd api，close [#3961](https://github.com/NervJS/taro/issues/3961) ([7615639](https://github.com/NervJS/taro/commit/7615639d5dbf660fd9a09177df1f30e7792facd5))
* add babel plugin preval ([#3867](https://github.com/NervJS/taro/issues/3867)) ([4c6a668](https://github.com/NervJS/taro/commit/4c6a668e60b0bcb11d0848adaac146efd44bc249))
* **rn:** add RN API setTabBarItem ([fb9c37a](https://github.com/NervJS/taro/commit/fb9c37ada3c9bad0f8f3d3682b20f10308d7624f))
* 校验华为原子化服务配置文件ability.xml中的intent和parameter合法性 ([#3938](https://github.com/NervJS/taro/issues/3938)) ([95ef669](https://github.com/NervJS/taro/commit/95ef6699afd79f7cd5372da483c46fbfbe762433))



## [1.3.10](https://github.com/NervJS/taro/compare/v1.3.9...v1.3.10) (2019-07-19)


### Bug Fixes

* **cli:** cli 创建页面如果没有指定 pageName 则报错 & 完善模板文档 ([9a9be57](https://github.com/NervJS/taro/commit/9a9be57b6dc2d16056c07385874ec2dc8cee5eaa))
* **cli:** cli 模板修复问题、调优及补充文档 ([a4ac538](https://github.com/NervJS/taro/commit/a4ac53884eb4432a8ea42bb9c261501643f416c7))
* **cli:** 修复 cli 包发布文件不全的问题 ([ef65a09](https://github.com/NervJS/taro/commit/ef65a0973c99607af1c678a89f3bee342bf46afb))
* **cli:** 修复 css modules bug ([b4fcd8e](https://github.com/NervJS/taro/commit/b4fcd8e7bb294d77d9324aa8671012fb5ced6a56))
* **cli:** 修复 taro convert 转换报错 ([99a8c4d](https://github.com/NervJS/taro/commit/99a8c4d30a03c0ca31dd0a0a74d6963e42a4dd00))
* **cli:** 修正src硬编码的问题 ([caf64da](https://github.com/NervJS/taro/commit/caf64da6600a639315ef05bd3cd037ebdb127dc3))
* **cli:** 延后了alias的处理 ([929b100](https://github.com/NervJS/taro/commit/929b100174ddae020ab5e848484a97ee6bbdb49b))
* **cli:** 排除不需要替换 Taro 基础框架引用的包，close [#3773](https://github.com/NervJS/taro/issues/3773) ([da3a3ce](https://github.com/NervJS/taro/commit/da3a3cee49adb23f3ed9b7391ac8548541e9da69))
* **cli:** 确保创建项目健壮性 ([a2f684d](https://github.com/NervJS/taro/commit/a2f684dbe9b1f0b4df3e47dddc6fbc1b4865b53b))
* **eslint:** render props 可以在 props 中传入函数 ([af2bf64](https://github.com/NervJS/taro/commit/af2bf646da840fcd773869d4c1be45ac446c818a)), closes [#3798](https://github.com/NervJS/taro/issues/3798)
* **index.d.ts:** 修正 FunctionComponent 的类型定义 ([#3847](https://github.com/NervJS/taro/issues/3847)) ([7e328c7](https://github.com/NervJS/taro/commit/7e328c7cfacffa31797479bebeca8907e431e3d3))
* **mobx:** 修复注入 mobx 后，原有 props 属性无法获取的问题 ([#3877](https://github.com/NervJS/taro/issues/3877)) ([f5e7996](https://github.com/NervJS/taro/commit/f5e799618582468a774352369e71ad32b8fb9a0a))
* **router:** 修复router跳转后不恢复滚动位置的问题 ([2d17268](https://github.com/NervJS/taro/commit/2d1726887e7cac42d322653119ed7ee86bd80f3f))
* **taro:** memo 只需要判断 props ([9818c7d](https://github.com/NervJS/taro/commit/9818c7d4929456bd12e944a9a7c6e4e8aafba2f7))
* **taro:** useState/Reducer 的 setState 可以无视 SCU 更新 ([584510f](https://github.com/NervJS/taro/commit/584510f93a35f3ec540d0c11440328b56ca57c5e))
* **taro-cli:** 添加 taro update 更新项目时遗漏的两个 stylelint 包 ([#3806](https://github.com/NervJS/taro/issues/3806)) ([b5cc6df](https://github.com/NervJS/taro/commit/b5cc6dfafb055e0e17b5af413dce85f2199632a6))
* **taro-components-rn:** 修复Input组件不支持onChange事件，没有保持端一致性 ([b0f1c3a](https://github.com/NervJS/taro/commit/b0f1c3a4ccd76e8f6e58c7942b523528463af819))
* **transformer:** propsManager.set 不再设置对象字面量 ([40535ee](https://github.com/NervJS/taro/commit/40535ee086c3a41f841029a801ab1e7d6807df9f)), closes [#3721](https://github.com/NervJS/taro/issues/3721)
* **transformer:** slot 内的 wx:key 没有呗替换为 key ([409da2c](https://github.com/NervJS/taro/commit/409da2cd189ee48a7f46fa6c25b13beff8a58fc2)), closes [#3738](https://github.com/NervJS/taro/issues/3738)
* **transformer:** wx:else 不能和 wx:for 同时存在一个标签 ([0e32548](https://github.com/NervJS/taro/commit/0e325482468a639e8a71294d0e92be89e776c4e8)), closes [#3813](https://github.com/NervJS/taro/issues/3813)
* **transformer:** 第三方组件绑定事件可以用 bind，close [#3859](https://github.com/NervJS/taro/issues/3859) ([896832d](https://github.com/NervJS/taro/commit/896832df4aea3d4fa72c7f94b394c6412b1726d1))
* **transformer:** 类函数式组件返回的 state 应该从 this.state取值 ([5ec9679](https://github.com/NervJS/taro/commit/5ec9679156c59412436b534edd55bf6f8f0cf7ac)), closes [#3813](https://github.com/NervJS/taro/issues/3813)
* **transformer:** 误删 JSX 声明，close [#3825](https://github.com/NervJS/taro/issues/3825) ([120d754](https://github.com/NervJS/taro/commit/120d7549684088dcd1105048cf51f4bc1b24f192))
* **types:** 新增FunctionComponent的options属性 ([#3874](https://github.com/NervJS/taro/issues/3874)) ([58a0e2f](https://github.com/NervJS/taro/commit/58a0e2f1edf1d6afc446437efffac33d2c808c6d))


### Features

* **rn:** add RN API file demo ([98f6a86](https://github.com/NervJS/taro/commit/98f6a86bfa866465833a1143f4bf78dd8d0146df))
* **rn:** add rn map component ([ba836e8](https://github.com/NervJS/taro/commit/ba836e8d50804184bb75b9113f464fb48267512f))
* update screen demo ([a5afed6](https://github.com/NervJS/taro/commit/a5afed61e4f18874d88fd39243050a204d7aae37))
* **typings:** SocketTask 中字段的类型错误，另外缺少两个字段。 ([#3781](https://github.com/NervJS/taro/issues/3781)) ([7b637a7](https://github.com/NervJS/taro/commit/7b637a7b0666f88a2cf084ada2b353564e89950a))
* 补全taro-cli中与quickapp/qq相关的命令和依赖 ([#3786](https://github.com/NervJS/taro/issues/3786)) ([60115d5](https://github.com/NervJS/taro/commit/60115d552753799eddd1736daeaecf7018780dc0))



## [1.3.9](https://github.com/NervJS/taro/compare/v1.3.8...v1.3.9) (2019-07-12)


### Bug Fixes

* **cli:** h5端的alias处理支持跨平台组件, fix [#3791](https://github.com/NervJS/taro/issues/3791) ([34136df](https://github.com/NervJS/taro/commit/34136dfedd8a80128a7248e2ab7ca2e9ebe2bcd8))
* **cli:** 快应用页面支持增加自定义配置 ([5f18760](https://github.com/NervJS/taro/commit/5f1876031a61a63e5ae396f9ef20b2202ca6a21d))
* **components-qa:** 修复快应用 ScrollView  组件报错，close [#3757](https://github.com/NervJS/taro/issues/3757) ([297841e](https://github.com/NervJS/taro/commit/297841ef42d96859f51c93a4e3df0f9ccc50e8b6))
* **components-qa:** 修复快应用ScrollView组件事件分发错误 ([4391370](https://github.com/NervJS/taro/commit/439137046210cf17596f62632fd3ccb17238a83d))
* **rn:** [RN]Taro.getCurrentPages方法不存在 close [#3224](https://github.com/NervJS/taro/issues/3224) ([3021729](https://github.com/NervJS/taro/commit/3021729d119b4662d8ce223753bfb8378c3b37c1))
* **rn:** media export ([fedad06](https://github.com/NervJS/taro/commit/fedad0697f65bce3b11712620247e55b366b4a55))
* **rn:** typescript type error ([710ece1](https://github.com/NervJS/taro/commit/710ece1c54cc460f6944694aff0865742746b7bf))
* **rn:** 完善 RN 录音的 API，使其兼容低版本 RN ([7e6d90a](https://github.com/NervJS/taro/commit/7e6d90a12f6e798373528cc6860acf832ab21d18))
* **taro-cli:** 不重复设置 buildData。fix [#3605](https://github.com/NervJS/taro/issues/3605) ([e2ccfa3](https://github.com/NervJS/taro/commit/e2ccfa350cf313036244560590bf639514b4965f))
* **taro-cli:** 修复模板下载问题。 ([3de1270](https://github.com/NervJS/taro/commit/3de1270fd540f02a3ae6aec54dc938485978c20e))
* **taro-quickapp:** 修复 windows 下编译路由传参问题 ([1a4f375](https://github.com/NervJS/taro/commit/1a4f37530b25bf2a88be36304b7fe97a8b0172f3))
* **taro-quickapp:** 兼容各种事件绑定传参情况 ([6cda94c](https://github.com/NervJS/taro/commit/6cda94c18fe05a67c68fcde87c3716c3cb3f2839))
* **taro-quickapp:** 让页面路由传参获取更具兼容性 ([730e88b](https://github.com/NervJS/taro/commit/730e88ba38c2940ebd1237ca6db040461e59a84d))
* **taroize:** 生命周期函数使用普通类函数，close [#3793](https://github.com/NervJS/taro/issues/3793) ([eb7931c](https://github.com/NervJS/taro/commit/eb7931ccaa0f29aba96c77b46877343f33ae2d68))
* **transformer:** render props 多次编译报错，close [#3798](https://github.com/NervJS/taro/issues/3798) ([525d278](https://github.com/NervJS/taro/commit/525d2780797a7106e286cd81d79ef588a85721f2))
* **transformer:** 快应用循环 index 和 item 的位置错乱 ([064c507](https://github.com/NervJS/taro/commit/064c507df2e620e722f10be2a8afed9f8f37f12b))
* **transformer:** 每次都还原调用方传过来的参数， close [#3760](https://github.com/NervJS/taro/issues/3760) ([65483aa](https://github.com/NervJS/taro/commit/65483aa07f7b18e8f3d6143f03cc7ddbf7a0818e))
* **with-weapp:** 当第二个参数没有传入时无法监听 props 变化 ([61ac83c](https://github.com/NervJS/taro/commit/61ac83c31ac320856e094d64ba1998168f216e40)), closes [#3793](https://github.com/NervJS/taro/issues/3793)


### Features

* **cli:** cli 增加 taro config 相关命令 ([c806c58](https://github.com/NervJS/taro/commit/c806c582b989085c75165dc2d133cda140b147fa))
* **cli:** taro 项目模板抽离到远程获取 ([ac347f7](https://github.com/NervJS/taro/commit/ac347f7d27d2f1bc1f18388774dc4614ec8ec924))
* **rn:**  add api downloadFile ([0dbf3b6](https://github.com/NervJS/taro/commit/0dbf3b6b4237d796668682f57e9a7b785464bf5c))
* **rn:** add API Video ([c74bf26](https://github.com/NervJS/taro/commit/c74bf26a8e11575bee8cfc151fa05614d2770350))
* **rn:** add DeviceMotion 相关的 api ([cddab98](https://github.com/NervJS/taro/commit/cddab980b0e1ed757a5b15ec2cbb72bd22e41909))
* **rn:** add record ([dd036ef](https://github.com/NervJS/taro/commit/dd036ef61267d2eb986655d06d8d09e5e6f525b6))
* **rn:** add RN API ([4ba3baf](https://github.com/NervJS/taro/commit/4ba3baf22d05f0f17a04f7e113ec482cdd1b7271))
* **rn:** add RN api  getLocation ([882fd0d](https://github.com/NervJS/taro/commit/882fd0df5408d72c3988a7a711f88eea3c3283cb))
* **rn:** add serval RN API ([56882a7](https://github.com/NervJS/taro/commit/56882a7a96d203f4ea2590f77f3c27c10319cee4))
* **rn:** add uploadFile ([ccc6a89](https://github.com/NervJS/taro/commit/ccc6a890ceb30c48679d6e1e691035730191c60c))
* **rn:** update RN API Vedio demo ([3bcd301](https://github.com/NervJS/taro/commit/3bcd30114fe4d714faa227c70bf9bb6cd9609fae))
* **rn:** 添加 getLocation ([2d5f470](https://github.com/NervJS/taro/commit/2d5f4708352a761060ee573d7b9fdf673fd82cff))
* **taro-cli:** creator 的 sourceRoot 可以从外部传入 ([ceab89d](https://github.com/NervJS/taro/commit/ceab89dbc65635154dd8dcb232eb1502f9a82d88))
* update RN API Audio Demo ([0cd5636](https://github.com/NervJS/taro/commit/0cd5636444f8702580206cf09b12d0e75f93c73a))
* **taro-cli:** 模板支持按 url 下载 ([61b9af1](https://github.com/NervJS/taro/commit/61b9af169b201824e1dce3161ad29c78d941c82a))



## [1.3.8](https://github.com/NervJS/taro/compare/v1.3.7...v1.3.8) (2019-07-10)


### Bug Fixes

* **cli:** 修复 windows 下判断 Taro 包路径，close [#3755](https://github.com/NervJS/taro/issues/3755) ([5c1d7ad](https://github.com/NervJS/taro/commit/5c1d7ad9382500b4c898d1bbf75108f6bd87c235))
* **cli:** 修正对是否是 Taro 组件的判断，close [#3751](https://github.com/NervJS/taro/issues/3751) ([0db4742](https://github.com/NervJS/taro/commit/0db4742106125ff10b291e8b02df96446c4c77ca))
* **cli:** 改进 Taro 组件判断方式 ([ccaad35](https://github.com/NervJS/taro/commit/ccaad35975192bbc008ca05ee78248836055cbc4))
* **h5:** 修复 chooseImage 无法两次选择相同图片 fix [#3747](https://github.com/NervJS/taro/issues/3747) ([#3748](https://github.com/NervJS/taro/issues/3748)) ([b7a327b](https://github.com/NervJS/taro/commit/b7a327b7ac5da01aabcd2dd7d2326c64da98b10d))
* **rn:** RN: Android 下 Taro.navigateTo 某个页面后，标题没有居中 close [#3678](https://github.com/NervJS/taro/issues/3678) ([81d90ac](https://github.com/NervJS/taro/commit/81d90ac335da42818415018ba6bd605e37636f82))



## [1.3.7](https://github.com/NervJS/taro/compare/v1.3.6...v1.3.7) (2019-07-10)


### Bug Fixes

* **cli:** h5端支持alias到src下的目录了, fix [#2866](https://github.com/NervJS/taro/issues/2866) ([3e4e89c](https://github.com/NervJS/taro/commit/3e4e89c1e2834dcf87b3c82be73d84656c255d75))
* **components:** 修复快应用 WebView 问题。 close [#3451](https://github.com/NervJS/taro/issues/3451), [#3724](https://github.com/NervJS/taro/issues/3724) ([397b017](https://github.com/NervJS/taro/commit/397b01728d5793c291d3beb65c7f947d54c4c32a))
* **taro:** 为 Taro.request 类型定义添加 abort 方法，完善注释 [#3654](https://github.com/NervJS/taro/issues/3654) ([#3715](https://github.com/NervJS/taro/issues/3715)) ([b007a49](https://github.com/NervJS/taro/commit/b007a49841eff37eae1b44d87e75375ae081124e))
* **taro-alipay:** 修复支付宝分包问题。close [#3445](https://github.com/NervJS/taro/issues/3445) ([d904a79](https://github.com/NervJS/taro/commit/d904a7985d077b43e5286521c5018eb48235c4da))
* **taro-alipay:** 修复支付宝分包问题。close [#3703](https://github.com/NervJS/taro/issues/3703) ([2b8f024](https://github.com/NervJS/taro/commit/2b8f024e960a72cda06c263350a0085d5d6b58f8))
* **taro-quickapp:** 快应用获取页面参数时增加容错 ([12c9998](https://github.com/NervJS/taro/commit/12c99981b5dcd83f20da823cbc4ca61ab148f946))
* **taro-rn:** 修复showLoading没有使用title属性 ([8d0b1df](https://github.com/NervJS/taro/commit/8d0b1df5f182c1a0a26ad357d5109ee9fae9a023))
* **taro-router-rn:** 修复RN端触发不了下拉刷新事件 ([dbfabf2](https://github.com/NervJS/taro/commit/dbfabf2ea1b83a2a0f343ce7108d8ce33e0c9520))
* **taro-utils:** 优化 Object.is 判断 ([49bef9e](https://github.com/NervJS/taro/commit/49bef9e4e9b6d74d2b1248c9cfc5ded8c492c1ef))
* **transformer:** opt.isNormal 不需要走自定义 babel 插件 ([0945248](https://github.com/NervJS/taro/commit/0945248e2faf2a2d0f7fcf5f0e52473c85c5d073)), closes [#3731](https://github.com/NervJS/taro/issues/3731)
* **transformer:** 修复 0945248e2faf2a2d0f7fcf5f0e52473c85c5d073 重复添加插件 ([2b8180b](https://github.com/NervJS/taro/commit/2b8180bc0979b95b6d16657e05350b153b24829b))


### Features

* **cli:** transformer 增加参数 alias ([2890b8c](https://github.com/NervJS/taro/commit/2890b8cd6a7df47f2f2c6cc26591dfc761307bce))
* **cli:** 优化对快应用系统包的判断与提醒 ([c9ae6b1](https://github.com/NervJS/taro/commit/c9ae6b1720f884ec5e485394b88c2fba62b84454))
* **cli:** 支持对 npm 包中文件进行转换 ([49a97e9](https://github.com/NervJS/taro/commit/49a97e9d9e57376fa82389975a253683eac1d577))



## [1.3.6](https://github.com/NervJS/taro/compare/v1.3.5...v1.3.6) (2019-07-08)


### Bug Fixes

* **cli:** 快应用支持多端组件，close [#3685](https://github.com/NervJS/taro/issues/3685) ([adf68af](https://github.com/NervJS/taro/commit/adf68af04f1565cb2eabd3b748c0491889babaa7))
* **component:** 修复 Swiper 组件指示标初始为 false ，更新不显示问题, close [#3676](https://github.com/NervJS/taro/issues/3676) ([0ecb399](https://github.com/NervJS/taro/commit/0ecb3995001e761e12d3b8524dcb0dcc6aa1ff54))
* **components:**  H5 不支持 camera 组件，修改文档 ([697c74b](https://github.com/NervJS/taro/commit/697c74bfa5e4996f97c71201fe1926807b50d4a7))
* **h5:** Page组件增加$component对象，与微信小程序统一 ([cd54061](https://github.com/NervJS/taro/commit/cd540614a09cb0ad3eff20b97ab28f39fae876a8))
* **quickapp:** 快应用支持 Block 标签，close [#3686](https://github.com/NervJS/taro/issues/3686) ([2dfeafe](https://github.com/NervJS/taro/commit/2dfeafe8b3827d1da4067b59443b521bbd1c63f3))
* **router:** 解决getCurrentPages有时候只能获取长度但没有内容的问题 ([#3669](https://github.com/NervJS/taro/issues/3669)) ([a88225e](https://github.com/NervJS/taro/commit/a88225e760b6ff36951758ffc4a2fd5f8dbaca8f))
* **taro:** interceptor 暴露 request 返回的 requestTask。close [#3654](https://github.com/NervJS/taro/issues/3654) ([2ada5a2](https://github.com/NervJS/taro/commit/2ada5a2188302705b3b67608392d90dac0950c1d))
* **taro:** 修复 this.$router 类型错误 close [#3650](https://github.com/NervJS/taro/issues/3650) ([#3653](https://github.com/NervJS/taro/issues/3653)) ([557938e](https://github.com/NervJS/taro/commit/557938e6b9418dd13b0c53975aaa784034568e64))
* **taro-cli:** 添加 json 文件缺失的逗号 ([#3707](https://github.com/NervJS/taro/issues/3707)) ([b6c3be9](https://github.com/NervJS/taro/commit/b6c3be9ffd3f3200abb847f21f3dcf7f275668c9))
* **taro-quickapp:** 修复快应用 tabBar 图标显示问题 ([81cbdf7](https://github.com/NervJS/taro/commit/81cbdf7fd8e76a9f24169e48454898640881ddc5))
* **taroize:** 加强对对象扩展运算符的支持，close [#3632](https://github.com/NervJS/taro/issues/3632) ([e3c638e](https://github.com/NervJS/taro/commit/e3c638e6bdd3695264df8cd66c65585de1c5d19b))
* **transformer:** 使用 spread/rest 语法生成匿名函数 ([75fc37a](https://github.com/NervJS/taro/commit/75fc37a71b2994848cc4086d8374003a3094c6c5)), closes [#3577](https://github.com/NervJS/taro/issues/3577)
* **transformer:** 修复 11964f8 对 JSX 属性判断错误，close [#3697](https://github.com/NervJS/taro/issues/3697) ([24e717f](https://github.com/NervJS/taro/commit/24e717f625317918d471fda3619c20cdb358776e))
* **transformer:** 修复 46604f5 导致 indexKey 没有加入循环中 ([61c54c6](https://github.com/NervJS/taro/commit/61c54c66fe18cf47e8b0624aff2de7cd5aa3ea4b)), closes [#3665](https://github.com/NervJS/taro/issues/3665)
* **transformer:** 匿名变量生成位置错误 ([c3086ae](https://github.com/NervJS/taro/commit/c3086aebfac6c00414e823f916187a4027041c8c))
* **transformer:** 如果循环在三元表达式中没有被 JSX 包裹住解析出错 ([f879bf6](https://github.com/NervJS/taro/commit/f879bf6287acd32330a948eb6964ad928a18d2c8)), closes [#3646](https://github.com/NervJS/taro/issues/3646)


### Features

* **mobx:** 提供 Mobx Hooks API ([#3599](https://github.com/NervJS/taro/issues/3599)) ([3a3bbdb](https://github.com/NervJS/taro/commit/3a3bbdb4f3d59f10657480d0ba9df17e5434e820))
* **quickapp:** 新增快应用的一些 api 及组件 ([ddf279b](https://github.com/NervJS/taro/commit/ddf279bce99c4881713a0a65a907ac727e2d01cb))
* **taroize:** 生命周期函数支持 async/await, close [#3477](https://github.com/NervJS/taro/issues/3477) ([c7b76ab](https://github.com/NervJS/taro/commit/c7b76ab9acbe1f14bb0371583b709350f74be249))
* **transformer:** 支持普通函数表达式定义组件，close [#3682](https://github.com/NervJS/taro/issues/3682) ([e16e671](https://github.com/NervJS/taro/commit/e16e671aeec54c0d7b640a5d0548501d89ea0013))



## [1.3.5](https://github.com/NervJS/taro/compare/v1.3.4...v1.3.5) (2019-07-03)


### Bug Fixes

* **cli:** 修复项目目录带'src'时编译报错的问题, fix [#3431](https://github.com/NervJS/taro/issues/3431) ([14b135a](https://github.com/NervJS/taro/commit/14b135ad2ab44bb31a7a24413a1d7c162a693e1a))
* **cli:** 小程序用到的静态资源走CDN 和 防止node_modules/xxxx包被taro再次编译的bug ([#3508](https://github.com/NervJS/taro/issues/3508)) ([cdd9c81](https://github.com/NervJS/taro/commit/cdd9c8107283ae70c66f8c6f0c5c0eb462dec0d7))
* **cli:** 当页面或组件没有引用样式时生成模板不需要生成插入样式代码 ([3220f5d](https://github.com/NervJS/taro/commit/3220f5d16403618983e30399edfe7da9ad3d5246))
* **cli:** 更新快应用 manifest ([b09c4d6](https://github.com/NervJS/taro/commit/b09c4d6e9d98941bc50d6f583b5938a8b5342854))
* **cli:** 更新快应用原生包识别逻辑 ([3cda7bb](https://github.com/NervJS/taro/commit/3cda7bbb1532da8979fe2a9b44172fa6e12993f2))
* **cli:** 组件文件不需要插入 taro-page 组件引用 ([c3b6bbe](https://github.com/NervJS/taro/commit/c3b6bbe5ada4c3833e53b50a4a24bbde9606eaa7))
* **components:** 修复 Video 组件 poster 失效问题 close [#3526](https://github.com/NervJS/taro/issues/3526) ([b69232d](https://github.com/NervJS/taro/commit/b69232dff55a598589f9301e8e70ccc0d000688b))
* **components-qa:** 快应用 tabBar 图片需占位 ([7e7c07e](https://github.com/NervJS/taro/commit/7e7c07edb1b75bcc996013f6d9128cd36b176ad5))
* **docs:** 案例中的taro-redux引用路径错误 ([#3522](https://github.com/NervJS/taro/issues/3522)) ([8ae96c2](https://github.com/NervJS/taro/commit/8ae96c2e43b69d3821c8641c9dd68c49cc54f3d0))
* **h5:** h5的chooseImage在count设置为1时取消了multiple属性, fix [#3401](https://github.com/NervJS/taro/issues/3401) ([08aa12d](https://github.com/NervJS/taro/commit/08aa12d6bed7f39ad93a24e9590c8628bbd6cd7d))
* **h5:** 修复build模式下h5 api的样式被treeshake掉的问题, fix [#3497](https://github.com/NervJS/taro/issues/3497) ([775c953](https://github.com/NervJS/taro/commit/775c9539f041f8c6b2a8c0cd95f8c7cf56244a9b))
* **h5:** 修复h5 setClipboardData api调用出错的问题, fix [#3539](https://github.com/NervJS/taro/issues/3539) ([e6fe90f](https://github.com/NervJS/taro/commit/e6fe90ffe5e70945bdb860c099475fb74c8ae205))
* **h5:** 修复previewImage的点透问题, fix [#3071](https://github.com/NervJS/taro/issues/3071) ([11a8fd2](https://github.com/NervJS/taro/commit/11a8fd23c0b439778d3a71dc35c43d2003059c8b))
* **movableview.d.ts:** 修正 关于 y 轴和 onVTouchMove 事件注释错误的问题 ([#2924](https://github.com/NervJS/taro/issues/2924)) ([c5fc256](https://github.com/NervJS/taro/commit/c5fc256df4264668f465fa37745cb97cc428bb05))
* **rn:** 导出 hooks 相关接口，以解决 RN 端接口未定义问题 ([#3579](https://github.com/NervJS/taro/issues/3579)) ([7ea3f37](https://github.com/NervJS/taro/commit/7ea3f37549581758f844784700d2f33b8dca8413))
* **router:** 修复设置alias到'/'时出现页面重叠的问题, fix [#3597](https://github.com/NervJS/taro/issues/3597) ([2660b9b](https://github.com/NervJS/taro/commit/2660b9bceb185f1907dbabed53201bfb8bc3e628))
* **taro:** 在memo中增加对state的浅判断 ([#3563](https://github.com/NervJS/taro/issues/3563)) ([19eef47](https://github.com/NervJS/taro/commit/19eef476e06b42f4aa6617ea64fee95ce70da8fe)), closes [#3527](https://github.com/NervJS/taro/issues/3527)
* **taro-cli:** 尽早设置watch下的NODE_ENV为development ([#3583](https://github.com/NervJS/taro/issues/3583)) ([d9d9f68](https://github.com/NervJS/taro/commit/d9d9f686308c9d82066d3e86ba3686e5088ce77b))
* **taro-quickapp:** 修复事件传参绑定 ([4af3659](https://github.com/NervJS/taro/commit/4af36598f46840beecb85eaa12a83aaf336f7b40))
* **taro-quickapp:** 修复路由传参的问题，close [#3620](https://github.com/NervJS/taro/issues/3620) ([c0c5cb2](https://github.com/NervJS/taro/commit/c0c5cb2e9a3cf6fd39671076eb6d2ca79da38e97))
* **transformer:** 只有在快应用时再删除多余的 $usedState ([fa7c227](https://github.com/NervJS/taro/commit/fa7c22731c61f6c95e460a5e04a59e7c04eb3b93))
* **transformer:** 某些情况解析 ...props 错误，close [#3647](https://github.com/NervJS/taro/issues/3647) ([11964f8](https://github.com/NervJS/taro/commit/11964f85cd5fe9c18c18d458a30b6e3a68fb124e))
* memo对state的判断应该用逻辑或 ([#3600](https://github.com/NervJS/taro/issues/3600)) ([552e868](https://github.com/NervJS/taro/commit/552e8688e127e4f96bb8e936beddb24078540320))
* **taro-cli:** 修复小程序端非生产模式下不应用 csso 配置问题 close [#3622](https://github.com/NervJS/taro/issues/3622) ([#3623](https://github.com/NervJS/taro/issues/3623)) ([40cba83](https://github.com/NervJS/taro/commit/40cba8321a1fde6457e2ddb810c4cf3cb440abe7))
* **taro-quickapp:** 快应用属性处理 ([dbc9b6b](https://github.com/NervJS/taro/commit/dbc9b6b887ad53c120be7a15b29df8d372964213))
* **taro-weapp/qq/tt/swan/alipay:** 循环 ref 问题。close [#3455](https://github.com/NervJS/taro/issues/3455) ([975084f](https://github.com/NervJS/taro/commit/975084fa06de7edc2806e904e991e1f791954d4e))
* **taroize:** catch 事件填空字符串报错 ([dad3ae4](https://github.com/NervJS/taro/commit/dad3ae4796f7f018a792dfae6f6451ee1bf9d155))
* **taroize:** 字母集从a-j调整为b-k ([#3569](https://github.com/NervJS/taro/issues/3569)) ([b826b11](https://github.com/NervJS/taro/commit/b826b117a57704dbe100bd4c02f907e3424b568f))
* **transformer:** children 从 this.props 解构会删除赋值语句 ([260360f](https://github.com/NervJS/taro/commit/260360fff9ee5ff03c6eaad6d9daeddc3e21f561))
* **transformer:** 函数式组件支持 bind，close [#3534](https://github.com/NervJS/taro/issues/3534) ([ed361db](https://github.com/NervJS/taro/commit/ed361db3f4bd2fc0a6ac1090cbef0ec12eaa4d31))
* **transformer:** 循环中使用对象展开符报错，close [#3547](https://github.com/NervJS/taro/issues/3547) ([527ae89](https://github.com/NervJS/taro/commit/527ae897c9a42dbcf3b785e8874893e4eb8dc443))
* **transformer:** 循环没有写 return 生成匿名函数错误，close [#3536](https://github.com/NervJS/taro/issues/3536) ([46604f5](https://github.com/NervJS/taro/commit/46604f5003bdf0afe2cede73f69a44a4c16638d0))
* **weapp:** 初始 ref 获取改到 didmount 阶段 ([0d2bb53](https://github.com/NervJS/taro/commit/0d2bb5356df9343056a8480c292b3959cfe6fd48))


### Features

* **cli:** 修复weapp转换项目后Nerv未定义的问题 ([9632436](https://github.com/NervJS/taro/commit/96324366a7cddb67caa99fe408a9e267ed06e48a))
* **cli:** 增加对华为原子服务定义文件的规范检查 ([#3571](https://github.com/NervJS/taro/issues/3571)) ([d78ee16](https://github.com/NervJS/taro/commit/d78ee160922e946168f627904693b2ebe8ac261a))
* **cli:** 新版本快应用编译器模块内容调整 ([a51bf63](https://github.com/NervJS/taro/commit/a51bf632a1d0d1aab85d48ed47f54dce23471614))
* **taro-components:** 完善 Form 组件的类型定义 ([#2951](https://github.com/NervJS/taro/issues/2951)) ([16b2613](https://github.com/NervJS/taro/commit/16b261366dd754551233c906db5dadf9a80143e4))
* **taro-quickapp:** 快应用支持设置 tabBar ([0e673ad](https://github.com/NervJS/taro/commit/0e673adb2d7503b5299ec4158da5935053746019))
* **transformer:** 使用类函数式组件不再要求以 render 开头命名 ([ea1e43e](https://github.com/NervJS/taro/commit/ea1e43e4f4b8094c95082b9b1ee4def22ab9b3fd))
* **transformer:** 支持 children 与其它变量同时从 props 中解构 ([b6d1d45](https://github.com/NervJS/taro/commit/b6d1d45c732398ea90e16b0c08910087c382a773)), closes [#3530](https://github.com/NervJS/taro/issues/3530)
* **transformer:** 支持 render props ([eda6750](https://github.com/NervJS/taro/commit/eda6750abef1363987df8ec9ba65e3df154779ab))
* **typings:** add the type definition of FunctionComponent and Taro.memo ([#3517](https://github.com/NervJS/taro/issues/3517)) ([7c8edd2](https://github.com/NervJS/taro/commit/7c8edd2d219c8e9a97cdc6778c0fd44d4a716f85))
* **weapp:** 把 `shallowEqual` 导出到各程序端 API ([279becb](https://github.com/NervJS/taro/commit/279becb16d58e4d5bb0d3e39fd78e5ca2ad8a579))
* **webpack-runner:** mainFields补上了browser字段, close [#3415](https://github.com/NervJS/taro/issues/3415) ([3ef3d5b](https://github.com/NervJS/taro/commit/3ef3d5b4fa54cd75a78303eb3c1c0d6681f9ef12))


### Performance Improvements

* **transformer:** 组件卸载时清理事件订阅 ([7284946](https://github.com/NervJS/taro/commit/72849464e62393c58dacfed08e9db3eddc74ef64))



## [1.3.4](https://github.com/NervJS/taro/compare/v1.3.3...v1.3.4) (2019-06-25)


### Bug Fixes

* **transformer:** 在 hooks 会把 return 替换，close [#3469](https://github.com/NervJS/taro/issues/3469) ([beb21f0](https://github.com/NervJS/taro/commit/beb21f019fa06d9eba3a9f72531943b4985d62fa))
* **transformer:** 嵌套循环判断使用上级变量编译错误，close [#3462](https://github.com/NervJS/taro/issues/3462) ([6b525c2](https://github.com/NervJS/taro/commit/6b525c23b82414a5660c905f910b60e10aa7f5ee))
* **transformer:** 自定义组件支持外部类，close [#3080](https://github.com/NervJS/taro/issues/3080) ([96573c1](https://github.com/NervJS/taro/commit/96573c1ff16c486273009e9fdcf23680b7003954))
* **weapp:** 修复 extraProps 判断 bug。 ([3288436](https://github.com/NervJS/taro/commit/328843668e422661276dcd4922ed7557da105632))
* **weapp:** 修复 mobx 下 extraProps 判断 bug。close [#3513](https://github.com/NervJS/taro/issues/3513) ([3deb1a7](https://github.com/NervJS/taro/commit/3deb1a797d3c6039ff6894db8b1589863346f019))


### Features

* **components-rn:** ScrollView, 支持 FlatList 来代替 ScrollView ([6714e24](https://github.com/NervJS/taro/commit/6714e244e2f6d9a7efe08452d7796ca18ad869ac))
* **transformer:**  支持在快应用循环中使用匿名函数，[#3495](https://github.com/NervJS/taro/issues/3495) ([0a66dbd](https://github.com/NervJS/taro/commit/0a66dbdd6a3172e07bb2838890159322c8f6241a))
* **transformer:** 循环中可以直接 return JSX 引用，close [#3504](https://github.com/NervJS/taro/issues/3504) ([38a38ce](https://github.com/NervJS/taro/commit/38a38cedfe59e3834493fd055e77f4c14610e108))



## [1.3.3](https://github.com/NervJS/taro/compare/v1.3.2...v1.3.3) (2019-06-24)


### Bug Fixes

* **alipay:** 修复在支付宝分包中状态管理工具不可用的问题，fix [#3445](https://github.com/NervJS/taro/issues/3445) ([a6f4c0a](https://github.com/NervJS/taro/commit/a6f4c0aece3ddfca11be80fb3a9210994a4f4be7))
* **cli:** 修复快应用编译报错，快应用依赖安装问题 ([15bed06](https://github.com/NervJS/taro/commit/15bed066188eacdecd80df8a5a0c945049a9c25a))
* **cli:** 引入json包含null的问题，close [#3505](https://github.com/NervJS/taro/issues/3505) ([849999d](https://github.com/NervJS/taro/commit/849999dedb206ef272ac4e1f71cc2f2c3711dcde))
* **router:** 修复偶尔页面隐藏失败的情况 ([b9f708a](https://github.com/NervJS/taro/commit/b9f708aa1919b1e0077285e0ed688485fe4c7d14))
* **taro:** 增加 Taro.getAccountInfoSync 类型定义 ([#3433](https://github.com/NervJS/taro/issues/3433)) ([2f33f56](https://github.com/NervJS/taro/commit/2f33f562b3ae97851729bf337ac3a7a1bc284413))
* **taro-weapp:** 微信小程序能通过 extraProps 接收外部 props ([506ca02](https://github.com/NervJS/taro/commit/506ca025afcdaf301cf1d01820beae831c56f605))
* **taro-weapp/tt/swan/qq/alipay:** 拦截器添加 cleanInterceptors 方法 ([22edff9](https://github.com/NervJS/taro/commit/22edff9b0249d067a5b2e9390e868400615d3006))
* 优化h5 下 ScrollView 标签，提供 onTouchMove 方法 ([44b730a](https://github.com/NervJS/taro/commit/44b730afdaf3fed50817f22bce2a2008a8c60f41))


### Features

* **taro-components:** add borderRadius for Progress Component ([4484546](https://github.com/NervJS/taro/commit/448454614d5a53bb74b93e085fa2bef95551017d))



## [1.3.2](https://github.com/NervJS/taro/compare/v1.3.1...v1.3.2) (2019-06-17)


### Bug Fixes

* **components-rn:** Clickable android, 绑定 onClick 的组件让 ScrollView 无法滑动了 ([16cf886](https://github.com/NervJS/taro/commit/16cf886380ba368f1b83019d64c079c6e6870a2c))
* **components-rn:** react-native-swiper 修复并更新相关代码样式 ([7494c41](https://github.com/NervJS/taro/commit/7494c4105d6a27508b2621dcd7a09d31636b2266))
* **transformer:** mobx 不需要 import ReduxContext, close [#3453](https://github.com/NervJS/taro/issues/3453) ([8d99a2b](https://github.com/NervJS/taro/commit/8d99a2bacb1624b12de1f10c9b3fec2df75ff31f))
* **transformer:** 使用 spread props 导致报错，close [#3439](https://github.com/NervJS/taro/issues/3439) ([bf85def](https://github.com/NervJS/taro/commit/bf85def08e3a3b66e575691bce10b2c3fc047f16))
* **transformer:** 使用异步订阅 redux 更新 ([1ab6123](https://github.com/NervJS/taro/commit/1ab61236b8349b5c9289bbd6fe854528b96c5cc0)), closes [#3456](https://github.com/NervJS/taro/issues/3456)
* **transformer:** 误报解构警告，close [#3450](https://github.com/NervJS/taro/issues/3450) ([f38e13b](https://github.com/NervJS/taro/commit/f38e13b80aea280ead7236739709630ef96d4562))


### Features

* **components:** 组件  Image 新增 lazyLoad 属性 ([6d03f64](https://github.com/NervJS/taro/commit/6d03f64ef5bf7a60830a54a2256fd21c173e62e8))
* **components-rn:** Swiper, 可以直接从样式传入 width, height 和 margin*,之前需要套 View, margin* 作用在内层导致样式有误 ([3646ec8](https://github.com/NervJS/taro/commit/3646ec888bf97e6161d1b27115095796e7cbf88c))
* **components-rn:** 将 react-native-swiper 内嵌到项目中 ([91a27e0](https://github.com/NervJS/taro/commit/91a27e0a8b631528217bd4944b630b6ed22c03ce))
* **taro:** 新增 defineProperties polyfill ([6666f40](https://github.com/NervJS/taro/commit/6666f408f7c3d5969e2f7a3788ae7ee40405822e))



## [1.3.1](https://github.com/NervJS/taro/compare/v1.3.0...v1.3.1) (2019-06-16)


### Bug Fixes

* **cli:** 修正页面创建时页面命名等问题 ([247b0c0](https://github.com/NervJS/taro/commit/247b0c0470a5cc1cbe1c27ed287b3db505744c6f))
* **mobx-h5:** 修复inject组件的componentDidShow内获取不到组件this的问题, fix [#3333](https://github.com/NervJS/taro/issues/3333) ([322f258](https://github.com/NervJS/taro/commit/322f258d710e3165f4fdfec75bbf0ef4997c613f))
* **rn:** [RN]Taro.getCurrentPages方法不存在 close [#3224](https://github.com/NervJS/taro/issues/3224) ([a9b8fa7](https://github.com/NervJS/taro/commit/a9b8fa72bd7d8ec3d923f2c64e126061af5b3331))
* **rn:** this.$router增加path属性，与形式小程序同步 ([af0236e](https://github.com/NervJS/taro/commit/af0236e7a00468555895d19fb553bd79cbf9f9c9))
* **rn:** this.$router增加path属性，与形式小程序同步 ([0175da5](https://github.com/NervJS/taro/commit/0175da5a0c519c2749f88a9939b453fa1d934786))
* **taro-tt:** 修复头条小程序事件不带 type 参数的问题，fix [#3382](https://github.com/NervJS/taro/issues/3382) ([1977062](https://github.com/NervJS/taro/commit/19770626148f0b58774b0263e8df11caf4d493fb))
* **transformer:** &nbsp; 在第一个直接时会被无视, close [#3406](https://github.com/NervJS/taro/issues/3406) ([4d14dd7](https://github.com/NervJS/taro/commit/4d14dd728c690ca2fd5997e476d58d71f476b362))
* **transformer:** 在类函数的 JSX循环无法使用 this.state 来循环 ([0401fd0](https://github.com/NervJS/taro/commit/0401fd035b4432b27fa6e398b8ee3677de7124f6))
* **transformer:** 多个 if block 有同名变量编译错误，close [#3388](https://github.com/NervJS/taro/issues/3388) ([6df5d8d](https://github.com/NervJS/taro/commit/6df5d8d42c2738e5decd1180c27698f81ab18113))
* **transformer:** 循环中的 wx:else 也需要用 block 包裹 ([b2ba05d](https://github.com/NervJS/taro/commit/b2ba05d1e33a67b81f87b50304f64f2919c8b3b9)), closes [#3410](https://github.com/NervJS/taro/issues/3410)


### Features

* **components-rn:** @ant-design/react-native 按需引入 ([d24b5f6](https://github.com/NervJS/taro/commit/d24b5f6958458158fcbe484d38324e76e56eb82a))
* **components-rn:** ScrollView 允许传入部分 RN 自己的参数 ([4116344](https://github.com/NervJS/taro/commit/4116344c7864887178fd2b71e0272d36dfc3c820))
* **redux:** useSelector, useStore, useDispatch typing ([dd18aa9](https://github.com/NervJS/taro/commit/dd18aa933c6dc30d04629aa7fb71e93758672625))
* **redux:** 支持 useSelector, useDispatch, useStore ([bc6bc47](https://github.com/NervJS/taro/commit/bc6bc47776c6947e14d2a5710d4143e10fbf6b74))
* **rn:** rn 的 router 和 API 添加构建，API 改造TS ([93388cc](https://github.com/NervJS/taro/commit/93388cc7d2540f5e0e4b22353d683f0c5c56e03b))
* **taro:** 增加 createRef 的 typings ([e9b74ef](https://github.com/NervJS/taro/commit/e9b74ef5cf6ceb4f8c980746cb5f00d796256175))
* **transformer:** 可以找到普通函数是否阻止冒泡, close [#3379](https://github.com/NervJS/taro/issues/3379) ([dfcf62b](https://github.com/NervJS/taro/commit/dfcf62ba4cc66d21bcaeeda5fcf37986db399b0e))
* **transformer:** 支持导出匿名函数声明组件 ([caf66df](https://github.com/NervJS/taro/commit/caf66df040006f207b2ca1418085eb1d683c82be))



# [1.3.0](https://github.com/NervJS/taro/compare/v1.3.0-beta.8...v1.3.0) (2019-06-11)


### Bug Fixes

* **cli:** rn cli path resolve error ([c409856](https://github.com/NervJS/taro/commit/c4098563a2c632543f9e645ca53b9aa46786c3af))
* **cli:** 修复 taro convert 报错问题 ([d9b3d0c](https://github.com/NervJS/taro/commit/d9b3d0c330b5bd47ae96e53b76fe1e23365d2aa0))
* **h5:** 修复showLoading显示上一个showToast内容的问题, fix [#3367](https://github.com/NervJS/taro/issues/3367) ([897c2eb](https://github.com/NervJS/taro/commit/897c2eb9a2ac97005e2e982349033df39d14fa7d))
* **mobx:** close [#3218](https://github.com/NervJS/taro/issues/3218) ([c2e08c4](https://github.com/NervJS/taro/commit/c2e08c4c9b756069f5dc4fcd6433d24a0807c1e7))
* **taro:** 添加百度 setPageInfo api, close [#3206](https://github.com/NervJS/taro/issues/3206) ([2ef11ff](https://github.com/NervJS/taro/commit/2ef11ff608b4428877bc9c7680a925a0ed781d2c))
* **taro-h5:** 去掉 es6 方法调用 ([3282707](https://github.com/NervJS/taro/commit/32827073bc4b7981e4037e24daa508ff6169252d))


### Features

* **plugin-sass:** 支持通过设置 plugin.sass.data 配置来设置全局 sass 变量，close [#3314](https://github.com/NervJS/taro/issues/3314) ([4bf27b2](https://github.com/NervJS/taro/commit/4bf27b2c1b5814f22d8fd39a611eb1f940ed7851))
* **rn:** 去掉 .rn_temp 下面的 node_modules ([38a55fa](https://github.com/NervJS/taro/commit/38a55fa55e68270ff2db7bfb84bfd1eb0bb8dba1))
* **taro:** 补充 Taro.createOffscreenCanvas API，close [#3281](https://github.com/NervJS/taro/issues/3281) ([cb8b4ee](https://github.com/NervJS/taro/commit/cb8b4ee9b9393c1829afdbd505f86c63e41dc988))
* **transformer:** 支持 Editor 组件, close [#3373](https://github.com/NervJS/taro/issues/3373) ([104b021](https://github.com/NervJS/taro/commit/104b021c1a3419d1396df15091c38a0e63164739))



# [1.3.0-beta.8](https://github.com/NervJS/taro/compare/v1.3.0-beta.7...v1.3.0-beta.8) (2019-06-09)


### Bug Fixes

* **components:** 修复 h5 Input onChange/onInput 再输入过程中只会触发一次的问题 ([970980c](https://github.com/NervJS/taro/commit/970980cc932da4d7049d9697ab9ec49d1dce5a7d))



# [1.3.0-beta.7](https://github.com/NervJS/taro/compare/v1.3.0-beta.6...v1.3.0-beta.7) (2019-06-09)


### Bug Fixes

* **cli:** 修复api调用时的路径处理错误 ([750d0c3](https://github.com/NervJS/taro/commit/750d0c38b399da4d11d2677421cf3002aeeb4582))
* **cli:** 修复h5端未使用@tarojs/components时使用onPullDownrefresh的报错 ([5b18d63](https://github.com/NervJS/taro/commit/5b18d63091aaa33412b4d9cee17ba50929f2dfab))
* **cli:** 修复某些情况下多次触发onPullDownRefresh的问题, fix [#3014](https://github.com/NervJS/taro/issues/3014) ([7e48537](https://github.com/NervJS/taro/commit/7e48537d3184e4c86e45e7b1670ffabc623e1a37))
* **components:** 修复 h5 Input 组件输入中文时不触发 onChange/onInput 的 bug，close [#3351](https://github.com/NervJS/taro/issues/3351) ([d163be7](https://github.com/NervJS/taro/commit/d163be7507db7b41d2c173ef9e1185efa53b06c5))
* **components:** 修复 input 类型判断问题 ([10f9465](https://github.com/NervJS/taro/commit/10f9465cfdbba9d2443cee0726155044dfd162b6))
* **rn:**  toast API 错误回调 ([43ce8f9](https://github.com/NervJS/taro/commit/43ce8f987d8ec0f8a8815419bfdba64770fea8b5))
* **rn:** RN在1.3.0Beta2执行Taro.getCurrentPages()报错 close [#3082](https://github.com/NervJS/taro/issues/3082) ([926fdc1](https://github.com/NervJS/taro/commit/926fdc187c89325920a4ba99ab8a66e64cdefe4b))
* **rn:** 忽略 scalePx2d 导致的 Invalid prop `fontSize` of type `string` 的警告 ([bebacd9](https://github.com/NervJS/taro/commit/bebacd9a2da85ba47b031a914e00f6958930e9ad))
* **rn:** 过滤 scalePx2dp 导致的样式校验警告 ([2acf57c](https://github.com/NervJS/taro/commit/2acf57c7282f23374aab4f8cdc69488c9735b958))
* **taro:** 修复微信文档链接，添加几个 API 返回值的 cloudID ([#3296](https://github.com/NervJS/taro/issues/3296)) ([25b4f73](https://github.com/NervJS/taro/commit/25b4f73c052096e31c8ee5a04f231689730b7e83))
* **taro:** 增加 getLogManager 类型定义 ([#3275](https://github.com/NervJS/taro/issues/3275)) ([4739713](https://github.com/NervJS/taro/commit/4739713601c5bdd93e59c71d5c7ba53c9db8f286))
* **taro-alipay:** 修复支付宝二维码启动页面获取不到参数的问题，close [#3313](https://github.com/NervJS/taro/issues/3313) ([2102a85](https://github.com/NervJS/taro/commit/2102a854057adb7bac29dbc23f2ebc100df03e4c))
* **taro-components:** 修复低版本系统下 swiper 滑动的 bug，[#3299](https://github.com/NervJS/taro/issues/3299) ([62a24e2](https://github.com/NervJS/taro/commit/62a24e2af82c320bfabd857675403294e961d6ea))
* **transformer:** props 生成多了 $taroCompReady 属性 ([37e7a46](https://github.com/NervJS/taro/commit/37e7a464685460687b8bff9d409ada627aaff744))
* **transformer:** SFC 模式不阻止 state 参与 state assign ([1de5935](https://github.com/NervJS/taro/commit/1de593543626555bbf2a9eb774a56a4d938034e9)), closes [#3316](https://github.com/NervJS/taro/issues/3316)
* **transformer:** 修复多次生成匿名表达式报错，close [#3344](https://github.com/NervJS/taro/issues/3344) ([f9d08e5](https://github.com/NervJS/taro/commit/f9d08e527a05f1fcf86b16d76c02f06e84e264b4))
* **transformer:** 同一作用域有多个自定义组件无法正确生成 props ([29225c6](https://github.com/NervJS/taro/commit/29225c66cf95abb6046bd68e38bc11f9fab90337))
* **transformer:** 在 if block 中的 props 生成位置错误 ([9a69c3d](https://github.com/NervJS/taro/commit/9a69c3df1930737dbd009630f2c5f36195654ac9)), closes [#3290](https://github.com/NervJS/taro/issues/3290)
* **transformer:** 百度小程序生成 template data 需要用三个{}包裹 ([b3e66ae](https://github.com/NervJS/taro/commit/b3e66ae3fb5c1f9a67c8103fdd4938dd9e2a5106)), closes [#3244](https://github.com/NervJS/taro/issues/3244)
* **weapp:**  当组件不具名时 propsType 检测报错 ([434591f](https://github.com/NervJS/taro/commit/434591fa9ab452e3afb087f8ffbede2a29eadb5a))
* 🐛 修复RN中，页面开启enablePullDownRefresh后，页面下拉刷新失效 ([cfec368](https://github.com/NervJS/taro/commit/cfec368fd7207727746e98139e40c3d62d065cbc))
* 修复urlQuery为空时，返回错误的params (alipay、qq、tt) ([eae701a](https://github.com/NervJS/taro/commit/eae701a550e5dfe3a0cba71e1044133f817c68c3))
* **weapp:** 优化代码 ([9df0984](https://github.com/NervJS/taro/commit/9df09844c993ad533728a6c89e8c3c44fe05023a))
* **weapp:** 修复urlQuery为空时，生成错误的params ([7f1c961](https://github.com/NervJS/taro/commit/7f1c96151dd42bc9b7e31cbfa47ac8e310b4ce95))
* 解决过滤 丢弃import的问题.. ([e04dcdf](https://github.com/NervJS/taro/commit/e04dcdf8a6a86917556df9605890e12980a9690e))


### Features

* **cli:** 调整项目创建，增加创建页面功能 ([d3964aa](https://github.com/NervJS/taro/commit/d3964aa60070429fb442c35eda925be58a5f9b9b))
* **components-rn:** clickable View with PanResponder ([2c1d78e](https://github.com/NervJS/taro/commit/2c1d78e271158628d0402fc5c9d1a1bc74b5012a))
* **taro:**  各小程序端同步新生命周期 ([307d2c7](https://github.com/NervJS/taro/commit/307d2c7f79a2e78d574f2918d10c1421927b92d6))
* **taro:** 增加两个新生命周期的 typings ([95f9a6f](https://github.com/NervJS/taro/commit/95f9a6f2c875c9db0390cebb4daaf5baec1e0782))
* **taro:** 导出 API: Taro.memo ([6d18692](https://github.com/NervJS/taro/commit/6d18692b39d090ce75044eb13a88a5f65adcd8af))
* **transformer:** renderXX 方法可以继承，close [#3319](https://github.com/NervJS/taro/issues/3319) ([99c2d84](https://github.com/NervJS/taro/commit/99c2d84dfddba13885fd2dddcb7c983f7e1cec26))
* **transformer:** 没有找到返回 JSX 元素提示是否缺少 return, [#3334](https://github.com/NervJS/taro/issues/3334) ([8d2f989](https://github.com/NervJS/taro/commit/8d2f989db17f2cbb7beb9383011705a06c37a8b9))
* **tt:** 支持 contextType, close [#3301](https://github.com/NervJS/taro/issues/3301) ([9691e02](https://github.com/NervJS/taro/commit/9691e021756996ddd096844057447f496d43a88d))
* **weapp:** 实现两个 React 16 的生命周期 ([323409e](https://github.com/NervJS/taro/commit/323409e7f25a8a04f8cedf22c29d3119e7b76eac))
* **webpack-runner:** babel插件默认不受额外的配置文件影响 ([e9e6c0e](https://github.com/NervJS/taro/commit/e9e6c0eb583fc4cf12c37dc323ac50f9a3a11583))



# [1.3.0-beta.6](https://github.com/NervJS/taro/compare/v1.3.0-beta.5...v1.3.0-beta.6) (2019-05-31)


### Bug Fixes

* **babel-plugin-transform-taroapi:** 保留@tarojs/taro-h5的default import ([769bb08](https://github.com/NervJS/taro/commit/769bb080450b6e7873673b31acc09ab9bbb9dca6))
* **babel-plugin-transform-taroapi:** 修复对'Taro'使用赋值语句时转换错误的问题 ([be02324](https://github.com/NervJS/taro/commit/be0232422460054805c97f7604814f99bf2dddaf))
* **cli:**  Cannot find module 'tslint/lib/error' ([a4358f7](https://github.com/NervJS/taro/commit/a4358f70edaf5b660298e71dc3833338a7b181d5))
* **cli:** 修复组件重复编译导致的 bug，close [#3251](https://github.com/NervJS/taro/issues/3251) ([0407620](https://github.com/NervJS/taro/commit/04076202c19d96909680cc102420f115abf22951))
* **cli:** 升级模板的 nervjs 版本 ([8a66b20](https://github.com/NervJS/taro/commit/8a66b202fa5172349c072960468b303c0491cf6a))
* **cli:** 项目创建出错 ([4e22cc5](https://github.com/NervJS/taro/commit/4e22cc5c873cbca4f37b5c41a4d873aa825cdc39))
* **component:** ios 10 中文键盘输入内容重复([#2778](https://github.com/NervJS/taro/issues/2778)) ([437ebb9](https://github.com/NervJS/taro/commit/437ebb9bf1f853f92d41abb9c9a5dc671570d2f4))
* **components:** 修复 OfficialAccount 事件 types ([#3250](https://github.com/NervJS/taro/issues/3250)) ([ebc5278](https://github.com/NervJS/taro/commit/ebc5278344e721e1e862cbe0e6f92923d9e7d08b))
* **components:** 修复components的build版本 ([c3adbf5](https://github.com/NervJS/taro/commit/c3adbf5ca03b728c7c86961d785105a5bed304f2))
* **components-rn:** Input 支持类型 number 的 value 直接传数字 ([32f0ecf](https://github.com/NervJS/taro/commit/32f0ecfba473194048410a1892273e294d3e6cf1))
* **components-rn:** TouchableOpacity 换回 TouchableWithoutFeedback ([cd763b9](https://github.com/NervJS/taro/commit/cd763b95fa72295c7b251deb23e7b1cb59f96023))
* **components-rn:** 移除 webview 自带的白色背景以及容器的margin和padding, fix [#3202](https://github.com/NervJS/taro/issues/3202) ([23acaa7](https://github.com/NervJS/taro/commit/23acaa7535ed02d334d76a5fbe1e4a6573edb7cd))
* **h5:** h5 不再导出未支持的 createContext API ([8da557b](https://github.com/NervJS/taro/commit/8da557b1437cdf123c083eac81f5c4202bb4e893)), closes [#3215](https://github.com/NervJS/taro/issues/3215)
* **h5:** 为H5的View组件添加长按时间onLongPress支持，fix [#2857](https://github.com/NervJS/taro/issues/2857) ([bd8f426](https://github.com/NervJS/taro/commit/bd8f4266efce1de5c7d8a20f24e334ce9d8280ba))
* **h5:** 为H5的View组件添加长按时间onLongPress支持，fix [#2857](https://github.com/NervJS/taro/issues/2857) ([460fd70](https://github.com/NervJS/taro/commit/460fd702e8a2aeb7bf8b7604d42d734f78a942f7))
* **h5:** 修复H5 View 组件无法相应onTouchMove事件的bug ([4b80e95](https://github.com/NervJS/taro/commit/4b80e95c429a231fd83038be7a35a5eb15cb54f0))
* **rn:** 修改 uiWidthPx 为 375 ([2d855da](https://github.com/NervJS/taro/commit/2d855da4db9e27a93a7b40233b001ba5d0858359))
* **rn:** 编译后的样式 scalePx2dp 小数和负数没去掉引号 ([7bf3d51](https://github.com/NervJS/taro/commit/7bf3d5120fa2c1f36c8a7cce9af32016bfd4a5eb))
* **taro:** disableSwipeBack 将在 7.0.5 版本失效 ([194c1b0](https://github.com/NervJS/taro/commit/194c1b04184f90acf32e69e9eb173c30753c9984))
* **taro:** 增加 getLaunchOptionsSync 类型声明 ([b4f2281](https://github.com/NervJS/taro/commit/b4f2281dc29846855b5e3df07d51c78b2a737d25))
* **taro:** 增加 Taro.reportMonitor ([#3252](https://github.com/NervJS/taro/issues/3252)) ([477090c](https://github.com/NervJS/taro/commit/477090cf61c6c29d9aa8425ab20aba890890db14))
* **taro-alipay:** 修复支付宝小程序 componentWillUnmount 报错的问题，close [#3167](https://github.com/NervJS/taro/issues/3167) ([ea1764e](https://github.com/NervJS/taro/commit/ea1764e506c3283027c483f2598b3e64d1b2f7e1))
* **taroize:** import src 填入无法解析的路径时提醒填入相对路径 ([79a5bea](https://github.com/NervJS/taro/commit/79a5bea368f4d54181ef32ba12834f337f8aba96)), closes [#3120](https://github.com/NervJS/taro/issues/3120)
* **transformer:** 从 this.props 而来的 children 标识符被误判为 slot ([f167edd](https://github.com/NervJS/taro/commit/f167edd9e76ef02f578eff486c74e4a4fa0c36e5))
* **transformer:** 在 if 内部生成的变量作为 props 取值错误 ([01515c6](https://github.com/NervJS/taro/commit/01515c649e7c05767fb53e651403212460a88530)), closes [#3195](https://github.com/NervJS/taro/issues/3195)
* **transformer:** 当 else 有循环 jsx 时插入语句未知错误 ([2609f7a](https://github.com/NervJS/taro/commit/2609f7ac3906b5f94a71e1edb46cc002b3330edf)), closes [#3182](https://github.com/NervJS/taro/issues/3182)
* **transformer:** 当 JSX 表达式直接返回 false 时移除表达式 ([2acbbf3](https://github.com/NervJS/taro/commit/2acbbf307540952316a6edeceb97e578223dc5c3)), closes [#2798](https://github.com/NervJS/taro/issues/2798)
* **transformer:** 循环生成 comp_id 可能会造成键值重复 ([230a347](https://github.com/NervJS/taro/commit/230a347d901bf42ce926734b812e91fe509051dc)), closes [#3220](https://github.com/NervJS/taro/issues/3220)
* **transformer:** 百度小程序生成 template data 需要用三个{}包裹 ([6ef43b1](https://github.com/NervJS/taro/commit/6ef43b11ad9440de93d57ab76a3e38ce187bcea7)), closes [#3244](https://github.com/NervJS/taro/issues/3244)
* 🐛 修复RN下获取statusBarHeight不准确的问题 ([ec64291](https://github.com/NervJS/taro/commit/ec6429116988e817f00829b163199aa5e51d5bba)), closes [#3036](https://github.com/NervJS/taro/issues/3036)
* beautify log when developers init ([#3197](https://github.com/NervJS/taro/issues/3197)) ([10c9021](https://github.com/NervJS/taro/commit/10c9021951130f0cdd1e43ba59960e7f6e9793b0))
* 中文字符 ([c3b4014](https://github.com/NervJS/taro/commit/c3b4014b1cde0ec6c597aaca9a4d62d6d56bbf64))


### Features

* **alipay:** 导出createContext 和 useContext API ([ca8402f](https://github.com/NervJS/taro/commit/ca8402ff8701ce2921a891bca427486335a7d88e)), closes [#3208](https://github.com/NervJS/taro/issues/3208)
* **cli:** hooks 支持设置 config ([08cf9b3](https://github.com/NervJS/taro/commit/08cf9b3e879ca1fd54950a154abd7a396125da1b))
* **cli:** 在cli中将appPath传递给webpack-runner ([cff7916](https://github.com/NervJS/taro/commit/cff791601d4f5e46a7bb740370baacb17a15af4c))
* **plugin-stylus:** 添加对 config.paths 的兼容,允许从指定目录[@import](https://github.com/import) ([#3234](https://github.com/NervJS/taro/issues/3234)) ([db08b5a](https://github.com/NervJS/taro/commit/db08b5abe6c10582851e008f6bd513c1e613db93))
* **rn:** 编译后样式的单位采用 scalePx2dp 函数包裹以处理响应式 ([8ffbc31](https://github.com/NervJS/taro/commit/8ffbc3161a0affef66538cd65be2807d640e206d))
* **taro-h5:** 补充了一批nervjs api的导出 ([a34a045](https://github.com/NervJS/taro/commit/a34a0458605b1b8000d12f5686f630ac25726389))
* **taro-redux:** props 对比改为全等，close [#3165](https://github.com/NervJS/taro/issues/3165) ([856fb63](https://github.com/NervJS/taro/commit/856fb63e25f7e539febe0af833d6b3f32ea46316))
* **weapp:** 添加云开发 cloud.CloudID 字段( close [#3212](https://github.com/NervJS/taro/issues/3212)) ([1f715f2](https://github.com/NervJS/taro/commit/1f715f236061d05818500771f9423cc6b787f61f))
* **webpack-runner:** webpack-runner不再从process.cwd获取项目路径 ([c2ff527](https://github.com/NervJS/taro/commit/c2ff527238196c465573e0f47c70bbfdc885187f))



# [1.3.0-beta.5](https://github.com/NervJS/taro/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2019-05-24)


### Bug Fixes

* **cli:** 修复插件编译报错的问题，close [#3118](https://github.com/NervJS/taro/issues/3118) ([a086760](https://github.com/NervJS/taro/commit/a086760601fa18e1aecc3a85c4f4b8173384f020))
* **cli:** 小程序编译 node_modules 中静态文件需要 copy，close [#3135](https://github.com/NervJS/taro/issues/3135) ([3f847bb](https://github.com/NervJS/taro/commit/3f847bb67fa43dbd9ae2a6d23e1d4fbdfca85f99))
* 删除重复的MovableView ([#3166](https://github.com/NervJS/taro/issues/3166)) ([248b296](https://github.com/NervJS/taro/commit/248b29618e0ab62a75bbf80dfbd2db3c075cdb5b))
* **cli:** 多端编译不再主动输出代码到对应平台目录 ([b9b749f](https://github.com/NervJS/taro/commit/b9b749f54b6550c786921be5a644057fc6fd5643))
* **component:** 修复一处typo ([b486391](https://github.com/NervJS/taro/commit/b486391b4d218f33e92a93b2dd6a0f5367226123))
* **plugin-sass:** 切换回 node-sass ([e425b57](https://github.com/NervJS/taro/commit/e425b57ce5bc2379e3d8a5c3575d7d31b9fb0ef7))
* **types:** fix dataset type in Event Target, fix [#3151](https://github.com/NervJS/taro/issues/3151) ([#3160](https://github.com/NervJS/taro/issues/3160)) ([b21545f](https://github.com/NervJS/taro/commit/b21545f4f39058d7564f6cb83ab417633e6dd193))


### Features

* **cli:** 增加更新的 taro 依赖包 ([df68b0c](https://github.com/NervJS/taro/commit/df68b0c325feccfbbd09e48c5fb07298440d0553))
* **taro:** 增加 createContext 和 useContext 的 typing ([76d832c](https://github.com/NervJS/taro/commit/76d832ca9696312368e2760d4114d414d76e61ba))
* **taro:** 导出 API: createContext, useContext ([56b4074](https://github.com/NervJS/taro/commit/56b4074eb122c822ea25202a0761d84b403977db))
* **transformer:** 支持 Context.Provider JSX 成员表达式 ([d5085ea](https://github.com/NervJS/taro/commit/d5085eaadcf85839f6d6a05221b3ccbeedc42450))
* **weapp:** 支持 contextType ([6c7737d](https://github.com/NervJS/taro/commit/6c7737dbf6409ae21720ed2ae41596595d9b6907))



# [1.3.0-beta.4](https://github.com/NervJS/taro/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2019-05-23)


### Bug Fixes

* **cli:** H5 编译时若 jsx 文件没有引入 Taro 则引入 ([ed8fcfb](https://github.com/NervJS/taro/commit/ed8fcfba8c04a0dd53f21e472518f956ff7bf715))
* **cli:** 修复部分文件打包时不压缩的问题 ([4699d02](https://github.com/NervJS/taro/commit/4699d020217b5c3f26d25576b1ad841d8f04f6ff))
* **cli:** 小程序引用 ts 文件后缀未重写为 .js ([d8474ab](https://github.com/NervJS/taro/commit/d8474ab4f22f1bdf7d3bdc998252b38f8bbb7ebb))
* **components-rn:** Clickable TouchableWithoutFeedback 导致的样式问题 ([4d12ad9](https://github.com/NervJS/taro/commit/4d12ad974f8cea1abb235902d6dd405ccfb90c6c))
* **components-rn:** 修复 onLoad 取不到图片尺寸问题, fix [#3093](https://github.com/NervJS/taro/issues/3093) ([a867082](https://github.com/NervJS/taro/commit/a8670820af4674bbdf79da049583f21c5a0e899f))
* **eslint:** 类没有命名时报错，[#3092](https://github.com/NervJS/taro/issues/3092) ([d89e93a](https://github.com/NervJS/taro/commit/d89e93ac949377e9bb8cc5ba3abab72d5a1be765))
* **h5:** 为chooseImage新增imageId ([#3109](https://github.com/NervJS/taro/issues/3109)) ([e8cf6ae](https://github.com/NervJS/taro/commit/e8cf6ae8676b19faa3a93558d3579f565abec158))
* **h5:** 为chooseImage新增imageId ([#3110](https://github.com/NervJS/taro/issues/3110)) ([7e1129d](https://github.com/NervJS/taro/commit/7e1129dda2bc1d9c75af1a0bb06aa149704a42e2))
* **h5 components:** 去除findIndex的调用 ([964237e](https://github.com/NervJS/taro/commit/964237eda07cc58f5e54341dd7cb19eb60ea3ce8))
* **transformer:** 函数式组件去掉 props  前缀，close [#3117](https://github.com/NervJS/taro/issues/3117) ([15b33d1](https://github.com/NervJS/taro/commit/15b33d1d0e9dece52edd61854689c9aee5b5d485))
* **transformer:** 在 if 语句中生成 props.manger 语句错误 ([1caf405](https://github.com/NervJS/taro/commit/1caf4056df0f9c4d5cb8a548c906ef2e20c07c19))
* showToast API 参数 icon 为 none 时仍显示图片 ([7638047](https://github.com/NervJS/taro/commit/763804754c4d2de59edbf5a370f80762fe9f5cf9))


### Features

* **cli:** 可以通过cli获取项目的页面列表了 ([400bb7a](https://github.com/NervJS/taro/commit/400bb7ae9cf67006a44d28b2fb04a3f6ae24e544))
* **components-rn:** Input & Textarea 开放 RN 参数, close [#3125](https://github.com/NervJS/taro/issues/3125) ([02d4e3b](https://github.com/NervJS/taro/commit/02d4e3b1ed85b5f013b6b3a0ab1f248b2284f0e5))
* **eslint:** 增加 eslint 规则的描述说明, close [#3096](https://github.com/NervJS/taro/issues/3096) ([2d455e8](https://github.com/NervJS/taro/commit/2d455e828a0999c4cbef003e49167fd8dcd0755b))
* **rn:** rn 端输出编译后的代码到配置的目录 ([def3cab](https://github.com/NervJS/taro/commit/def3cab2f2304a86379407f17c66cd1007ba9898))
* **transformer:** 支持直接 export 匿名函数式组件，close [#3092](https://github.com/NervJS/taro/issues/3092) ([c916a4f](https://github.com/NervJS/taro/commit/c916a4f714a2c8f08ce228264a4a0b7630dcb4dc))



# [1.3.0-beta.3](https://github.com/NervJS/taro/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2019-05-17)


### Bug Fixes

* **cli:** doctor 补充 alias、jsxAttributeNameReplace 检测 ([9ae0f0f](https://github.com/NervJS/taro/commit/9ae0f0f1a28aaac879b158584db306b641620329))
* **components:** 修复 input 组件在低版本 ios 报错，close [#3079](https://github.com/NervJS/taro/issues/3079) ([fb66b7c](https://github.com/NervJS/taro/commit/fb66b7c12ea0c7cfd320c35e0d988480f4d4c7d5))
* 修复ci问题 ([58695c3](https://github.com/NervJS/taro/commit/58695c3f44f6d8bbdfd0d04ca02d93583c5d5c26))
* **cli:** rn 编译 watch 报错 ([da805d9](https://github.com/NervJS/taro/commit/da805d9bd28f088a0826bc3910eeab3b5f326c78))
* **cli:** 修复app.js中没有componentWillMount导致报错的问题, fix [#3001](https://github.com/NervJS/taro/issues/3001) ([ced1e6e](https://github.com/NervJS/taro/commit/ced1e6e8a87039bb606d2f1a1a00ebfac0c16b30))
* **cli:** 修复对默认 manifest 文件的引用 ([fb7d077](https://github.com/NervJS/taro/commit/fb7d077f7197ffe852a5b5b8d0e63d798e23ac09))
* **components:** swiper 轮播下标更新问题 ([3bbcf56](https://github.com/NervJS/taro/commit/3bbcf56e377974d6f478d66fe76b4e104dad7393))
* **components:** 修复 swiper 下标指向问题 ([dc73a46](https://github.com/NervJS/taro/commit/dc73a46e659247c32756989abc78cb09dbf9df32))
* **components-rn:** 编译报错,回退版本设置 ([0ca3ab4](https://github.com/NervJS/taro/commit/0ca3ab4995e4f728648e1f215b3db10789f98685))
* **rn:** navigationStyle 配置失效的bug ([aae8bfc](https://github.com/NervJS/taro/commit/aae8bfca2a07805104c505e4540d38e5880f9e7e))
* **router:** 修复ci ([046a24c](https://github.com/NervJS/taro/commit/046a24c04ee53933b11b99974001d4f39b724aea))
* **router:** 去除了router中的Array.prorotype.find, fix [#3044](https://github.com/NervJS/taro/issues/3044) ([9ea0ed0](https://github.com/NervJS/taro/commit/9ea0ed0a46e9834f8051fb7c5b02991d1175fdb0))
* **taro:** 补充缺失的窗口表现配置项，修正仅在页面可用的项目出现在全局的问题 ([#3038](https://github.com/NervJS/taro/issues/3038)) ([b00fefd](https://github.com/NervJS/taro/commit/b00fefdc573c57cad8e0bb5b2d4a827efb60022c))
* **taro-h5:** H5 端加入 hooks 相关 api 导出， close [#3009](https://github.com/NervJS/taro/issues/3009) ([#3025](https://github.com/NervJS/taro/issues/3025)) ([4b30beb](https://github.com/NervJS/taro/commit/4b30bebdf194e2aafa98e02fdadb94b3a310e9b2))
* **transformer:** 多层 props 传递异常，close [#3052](https://github.com/NervJS/taro/issues/3052) ([1745ea5](https://github.com/NervJS/taro/commit/1745ea5bd6c08ddc0bf75daaade915146eb9b64c))
* **transformer:** 生产模式小于号没有被转义替换，close [#3074](https://github.com/NervJS/taro/issues/3074) ([1aeb47a](https://github.com/NervJS/taro/commit/1aeb47aaf016eb3115d1e88a7262fdd04534d95b))
* **transformer:** 百度小程序 for 和 if 指令不能并列close [#3022](https://github.com/NervJS/taro/issues/3022) ([5f3988b](https://github.com/NervJS/taro/commit/5f3988bd943293400f6227bf3ca74b1d091155b9))


### Features

* **cli:** cli 的 rn build 改造 ([2edd20b](https://github.com/NervJS/taro/commit/2edd20b1924fdae88b54b073767b842fcb2cc376))
* **cli:** doctor不再从process.cwd获取项目路径 ([6c2ec44](https://github.com/NervJS/taro/commit/6c2ec4414a2ee2c317d533c92b36a72dbc6316bd))
* **cli:** 现在创建项目会在projectDir目录下创建了 ([1c68c06](https://github.com/NervJS/taro/commit/1c68c06e0d9237666dab74a9cc5a66a1b9661d0f))
* **postcss-pxtransform:** 添加样式的条件编译及测试用例 ([7688728](https://github.com/NervJS/taro/commit/76887288ab8f9af1f25fbf0424827f14d0da25e2))
* **rn:** RN 端添加 API Taro.pageScrollTo ([459d25d](https://github.com/NervJS/taro/commit/459d25df5a7fedc0f35d2142483ea3c65f4c7354))
* **rn:** 添加样式文件的条件文件编译 ([9a585bf](https://github.com/NervJS/taro/commit/9a585bf3258694dfbd513c97451e88e9c7fbf921))
* **transformer:** 函数式组件支持使用 children 和组合 ([8e35788](https://github.com/NervJS/taro/commit/8e357880c119dfff7e0e6756a433f38a16bf044e)), closes [#3047](https://github.com/NervJS/taro/issues/3047)



# [1.3.0-beta.2](https://github.com/NervJS/taro/compare/v1.3.0-beta.1...v1.3.0-beta.2) (2019-05-13)


### Bug Fixes

* **cli:** postcss-url 增加 basePath 配置，close [#2334](https://github.com/NervJS/taro/issues/2334) ([37f6cf3](https://github.com/NervJS/taro/commit/37f6cf3198e5a087bf7b4ea23b800ccf796cc08e))
* **cli:** usingComponents 下的内容不通过 CONFIG_MAP 处理，close [#2817](https://github.com/NervJS/taro/issues/2817) ([529a80e](https://github.com/NervJS/taro/commit/529a80e06c3d44240f10f7302162eaf26b5b14cc))
* **cli:** 修复 alias 路径替换的问题 ([b57ed0a](https://github.com/NervJS/taro/commit/b57ed0a1dd515f472d5f9bb0fa335d2e3d8a6852))
* **cli:** 修复 ui 库编译 bug ([4ddbeca](https://github.com/NervJS/taro/commit/4ddbeca20903a378c0090baa4d373335a2a51ff0))
* **cli:** 创建项目时遗漏是否选择 typescript 的选项 ([ee7abc9](https://github.com/NervJS/taro/commit/ee7abc95172ba9956d72be72fab99f8d8642d411))
* **cli:** 快应用编译时若没有默认引入 Taro 则自动补充 ([81d8c5d](https://github.com/NervJS/taro/commit/81d8c5dcb102f9985605c4cb13fdc30688d36845))
* **eslint:** 发布文件缺少 constant 文件夹 ([6eec837](https://github.com/NervJS/taro/commit/6eec83762a2216173ea2ccb89649944d7281e90f))
* **rn:** RN编译时报错 invariant_1.default is not a function close [#2984](https://github.com/NervJS/taro/issues/2984) ([8a88948](https://github.com/NervJS/taro/commit/8a88948f0d3f647fbb2040ac606f4ddc74fbe740))
* **rn:** toast 或 loading 不对称情况下防止泄漏 ([d9c52f9](https://github.com/NervJS/taro/commit/d9c52f9cd7e77ccc99478d269da53c73d8a75fc7))
* **rn:** 路由 API promise 化 ([dd5ee2b](https://github.com/NervJS/taro/commit/dd5ee2bb62837fce8925b5dd92020318294d1655))
* **taro:** hooks deps 改变没有处理空数组的情况，[#2995](https://github.com/NervJS/taro/issues/2995) ([c96975d](https://github.com/NervJS/taro/commit/c96975d54ef3ed5c3f5fea314ec349073ecf1486))
* **taro-swan:** 百度小程序加上 diff ([d130369](https://github.com/NervJS/taro/commit/d1303699adabcd2ea5c562dd442f6170f6657b8a))
* **transformer:** 当 ast 没有 import Taro 时补一个 ([866aca1](https://github.com/NervJS/taro/commit/866aca19fc15ba7505fcf7c044b51bcd55e379ca)), closes [#2995](https://github.com/NervJS/taro/issues/2995)
* **transformer:** 循环中使用匿名函数编译错误, close [#2990](https://github.com/NervJS/taro/issues/2990) ([e29ebcc](https://github.com/NervJS/taro/commit/e29ebcc7853a820e00aac79c50e668f71723a1e4))


### Features

* **components-rn:** ScrollView, 只在 onScroll 时判断 onScrollToUpper 和 onScrollToLower ([7cd8bea](https://github.com/NervJS/taro/commit/7cd8beae1d52e1c9b188bbcb12081a0ee5f55cfe))
* **taro-alipay:** 支付宝小程序 props 系统改造 ([dfb6e30](https://github.com/NervJS/taro/commit/dfb6e3089d44fa9c9d03d54a3283955757ab69a3))
* **transformer:** 支持闭包函数组件 ([a67f2f9](https://github.com/NervJS/taro/commit/a67f2f90a6dcf4f2226c3d3f7ca2e27b4a965b30))
* **webpack-runner:** h5端使用copy-webpack-plugin实现copy功能 ([8e329bb](https://github.com/NervJS/taro/commit/8e329bbfc9abf470d56ed89dad1f178b632d91dc))



# [1.3.0-beta.1](https://github.com/NervJS/taro/compare/v1.3.0-beta.0...v1.3.0-beta.1) (2019-05-07)


### Bug Fixes

* **cli:** RN编译报错：Unknown error from PostCSS plugin. close [#2934](https://github.com/NervJS/taro/issues/2934) ([aa09cd4](https://github.com/NervJS/taro/commit/aa09cd40cf0edb9d730ca651d8ea8314bd97f4fa))
* **cli:** 修复 taro info 命令报错 ([f124574](https://github.com/NervJS/taro/commit/f124574f9bbf66e799e01a893bc72c0750eb3774))
* **cli:** 修复h5端入口文件的生命周期处理错误 ([caf5269](https://github.com/NervJS/taro/commit/caf5269cda9c2206cfc1c74b14179fb3206084d6))
* **cli:** 修复h5端生成文件路径错误的问题 ([81fa286](https://github.com/NervJS/taro/commit/81fa286124d400d80c4363ee488ba5239d51e3bc))
* **cli:** 小程序使用 npm 中静态资源编译报错 ([afd7fb1](https://github.com/NervJS/taro/commit/afd7fb1b43b80022408ecafb99dfc3c02b1aa101))
* **cli:** 小程序使用 npm 包中样式时路径编译错误 ([8f6bd02](https://github.com/NervJS/taro/commit/8f6bd024e82901e02be1b570e6c05e48ff1f0fee))
* **cli:** 项目预览时 css 报错不会中断项目，close [#2945](https://github.com/NervJS/taro/issues/2945) ([987b8cd](https://github.com/NervJS/taro/commit/987b8cd730287883ccce39e577bb0efff944e8df))
* **components-rn:** build es5 ([8cdcfd3](https://github.com/NervJS/taro/commit/8cdcfd395377e9a8495180ea91141d04282e26dd))
* **eslint:** 使用 commonjs 模块化 ([a2de977](https://github.com/NervJS/taro/commit/a2de977f84ceec20b705c55b18229d611b9791e7))
* **h5:** 修复interactive系列api错误地缓存了调用参数的问题, fix [#2675](https://github.com/NervJS/taro/issues/2675) ([8ef960a](https://github.com/NervJS/taro/commit/8ef960a537012c69f99a3f613060858af9834222))
* **rn:** cli 添加 css-to-react-native 依赖 ([cd7be00](https://github.com/NervJS/taro/commit/cd7be009677002aaf3f54519bf8986155463c6c2))
* **rn:** getApp 在rn中报错 close [#2897](https://github.com/NervJS/taro/issues/2897) ([09cd796](https://github.com/NervJS/taro/commit/09cd796816e1ddfc36805c8ab4d59c4903eb9d13))
* **rn:** react-native中使用hideLoading无法关闭loading  close [#2887](https://github.com/NervJS/taro/issues/2887) ([a7a7699](https://github.com/NervJS/taro/commit/a7a769919d691be5365efaa2f6084ddedc1e930d))
* **rn:** 为 app.js 添加 componentDidShow 和 componentDidHide 方法 ([f9ec00b](https://github.com/NervJS/taro/commit/f9ec00b29002ef7010675f5b2323cab1947bc320))
* **taro:** 修复 api getMenuButtonBoundingClientRect，close [#2939](https://github.com/NervJS/taro/issues/2939) ([90540cd](https://github.com/NervJS/taro/commit/90540cd92ba953be3c7b63fbca19813a597bb6e1))
* **taro-weapp/alipay/swan/tt/qq:** 更新 diff 逻辑 ([923579b](https://github.com/NervJS/taro/commit/923579b4e4e9660402c969ff88851caeeeb68f86))
* **taro-weapp/alipay/swan/tt/qq:** 更新 diff 逻辑 ([b0deb91](https://github.com/NervJS/taro/commit/b0deb9106161ff081c5974d2105ec32c63cebf50))
* **webpack-runner:** 如果h5端的编译失败了,现在会exit(1)了, fix [#2682](https://github.com/NervJS/taro/issues/2682) ([badc630](https://github.com/NervJS/taro/commit/badc63074873c32878a11c7ff8f1057cdab06888))


### Features

* **cli:** 将h5端的生成文件放置到./h5目录 ([85cc143](https://github.com/NervJS/taro/commit/85cc143cd4fe0defb0d809695728737e68230c18))
* **components-rn:** ScrollView, 只拆分两个样式到 contentContainerStyle ([c827fbf](https://github.com/NervJS/taro/commit/c827fbf8cc0b49c35815467f37c8e4d9877c61ef))
* **h5:** 使用touchmove模拟scroll事件的触发 ([44b4e29](https://github.com/NervJS/taro/commit/44b4e29b8fbc8991e3374e82ced4f964bcc13311))
* **rn:** fork css-to-react-native 包，方便修改 ([33cf18f](https://github.com/NervJS/taro/commit/33cf18fabb67091e15583b392f9dcd1999755b1a))
* **rn:** 支持  PureComponent ([0a34498](https://github.com/NervJS/taro/commit/0a34498b90671a3e8f1744de14e5e8d611e7102d))
* **taro:** SubPackage 增加 name 和 independent 属性 ([#2981](https://github.com/NervJS/taro/issues/2981)) ([6f57907](https://github.com/NervJS/taro/commit/6f57907ceeee2359c1572ddd743200da76c8114e))
* **taro:** 加入 hooks 的 typings ([7db8111](https://github.com/NervJS/taro/commit/7db8111e94c3ec890230b69da33b6aa1fb65ed8d))
* **transformer:** 事件现在可以传入任何函数 ([25ab86e](https://github.com/NervJS/taro/commit/25ab86e486b138b6fc65f1c833a6e73084a7dd16))
* **webpack-runner:** 现在babel处理不再排除node_modules目录了 ([311ffa5](https://github.com/NervJS/taro/commit/311ffa53c1ae2b5e5f59020f488cbba37b198809))



# [1.3.0-beta.0](https://github.com/NervJS/taro/compare/v1.2.27-beta.0...v1.3.0-beta.0) (2019-04-30)


### Bug Fixes

* **cli:** npm 包中引用了其他 npm 包时也需要经过 npmCodeHack 处理 ([fb37b2a](https://github.com/NervJS/taro/commit/fb37b2a3b81a0d92ff66a0b2edbc97350bbb84e4))
* **cli:** 修复 convert 引用 ([6f0f21a](https://github.com/NervJS/taro/commit/6f0f21a66e5f7ff5273dba3397148e7e8ba60f2d))
* **cli:** 修复 export default 的 bug ([11aba24](https://github.com/NervJS/taro/commit/11aba243f877522e3ab55f14574c480e83b80d21))
* **cli:** 修复 node_modules 中 ui 引用错误，close [#2357](https://github.com/NervJS/taro/issues/2357) ([2b42629](https://github.com/NervJS/taro/commit/2b42629005a7a87e856b126c629c90629dec1ddb))
* **cli:** 修复 prettier 参数类型定义 ([cd835e9](https://github.com/NervJS/taro/commit/cd835e9a91f5296d3e66e35b76716e1efc95faf8))
* **cli:** 修复 tabbar 图片 copy 问题 ([64a5bdc](https://github.com/NervJS/taro/commit/64a5bdc3316914dc3cde327f6d93bd6cada3ccb0))
* **cli:** 修复 watch 时文件监听 ([677e034](https://github.com/NervJS/taro/commit/677e034206d1f1c40d0a1ddf84c407b50bd63891))
* **cli:** 修复cli一处变量未定义的错误 ([284c9be](https://github.com/NervJS/taro/commit/284c9be78d563de0944304addf9ba3f105271b9d))
* **cli:** 修复引用 ([7d6b8c7](https://github.com/NervJS/taro/commit/7d6b8c708880933d5c8cf87b8b4c8d744bf7272d))
* **cli:** 修复快应用打包时依赖安装的 bug ([b28aa2a](https://github.com/NervJS/taro/commit/b28aa2a1e9d168e6a1bfca9457e99ca5bf209ec3))
* **cli:** 修复快应用组件文件 copy 报错 ([c9106e7](https://github.com/NervJS/taro/commit/c9106e73482e467043e5d64317e1eb189328ff73))
* **cli:** 修复组件编译不完全问题 ([dae61af](https://github.com/NervJS/taro/commit/dae61af013778f88eeaa20686bb446b359d6a70d))
* **cli:** 修正页面文件判断 ([3ce1312](https://github.com/NervJS/taro/commit/3ce13121e5edef6ac213916fd76a6efa42063baa))
* **cli:** 小程序 && 快应用编译文件调整 ([e96da96](https://github.com/NervJS/taro/commit/e96da964c3e6c734a35e1a6759584003a74ad22b))
* **cli:** 快应用开发增加 watch 功能 ([e4d6a7b](https://github.com/NervJS/taro/commit/e4d6a7b6dbf72bffca9743283c1176cce835592c))
* **cli:** 快应用打包时代码不压缩 ([1b5454b](https://github.com/NervJS/taro/commit/1b5454bc2c02e92b1caacd6657c3c1286837b64e))
* **cli:** 快应用特殊组件不再被当成自定义组件 ([6ef5d74](https://github.com/NervJS/taro/commit/6ef5d74dccc989d08f88d6ecd541a9f6a023a720))
* **cli:** 快应用编译时自定义组件没有生成 import 引入 ([96b72b9](https://github.com/NervJS/taro/commit/96b72b924f210fc0c712d2825d45b6788a87ab62))
* **cli:** 快应用静态资源 copy 目录错误 ([334d440](https://github.com/NervJS/taro/commit/334d440de96ac92197fa45d0ba9e254cbe2b4157))
* **cli:** 编译时提前加入环境变量 ([c7bf06d](https://github.com/NervJS/taro/commit/c7bf06d19d9116b8d182c28668e06acd624e2ef7))
* **cli taro:** cli的build脚本现在可以通过了 ([32e6f96](https://github.com/NervJS/taro/commit/32e6f96be2957f0c6300dc7e2044d31c080e795b))
* **component:** canvas组件现在可以通过style调整大小, 也可以接受额外的属性了,fix [#2880](https://github.com/NervJS/taro/issues/2880) ([a148c6d](https://github.com/NervJS/taro/commit/a148c6d339da39d4a124d4ebda0c76f21c39de20))
* **components:** canvas组件去除width、height属性 ([3e9a99c](https://github.com/NervJS/taro/commit/3e9a99c0cff00227bfa8a0ed3262805f4a9c5924))
* **components:** 修复 input 属性问题。 close [#2840](https://github.com/NervJS/taro/issues/2840) ([bdd1070](https://github.com/NervJS/taro/commit/bdd1070eb951b2d5514a873e0d6fa0f4da95cc41))
* **components:** 修复 Picker 组件未设置默认 mode 属性的 bug ([#2900](https://github.com/NervJS/taro/issues/2900)) ([5833972](https://github.com/NervJS/taro/commit/5833972bd4a942cd7fb2885144a069b13afb5912))
* **components:** 修复ci问题 ([f668d3c](https://github.com/NervJS/taro/commit/f668d3c8d5c087fad81e1273ca80b221a9dc718e))
* **components:** 去掉了tabbar中的Array.prototype.find ([c2820c5](https://github.com/NervJS/taro/commit/c2820c5c79abf8b6e4e87a4118d9f2cc68c4eb5d))
* **components-qa:** 修复 button 组件问题 ([d039523](https://github.com/NervJS/taro/commit/d0395231339cd1ac100cfbafd69f8337fc7cec2c))
* **components-qa:** 修复页面容器组件属性初始化 ([c9a102f](https://github.com/NervJS/taro/commit/c9a102fed063061ff761baf7f563739630744e0f))
* **components-qa:** 快应用组件库样式修复 ([cd47958](https://github.com/NervJS/taro/commit/cd479587163bccc011d821b993623b7472f287f5))
* **doctor:** 修复改为 typescript 后出现的问题 ([36fb9fe](https://github.com/NervJS/taro/commit/36fb9fe66f3eed5b12e1d56d49fe7f9f7bf0f8ca))
* **doctor:** 修复改为 typescript 后出现的问题 ([950b49d](https://github.com/NervJS/taro/commit/950b49d419a644b598c0a86662e8fb25dcf24fd7))
* **h5:** chooseLocation的组件不再直接挂在body上 ([e225d84](https://github.com/NervJS/taro/commit/e225d848f192793b534273334a574756ac5e5662))
* **h5:** h5将intercepters暴露出来, fix [#2807](https://github.com/NervJS/taro/issues/2807) ([f782c9f](https://github.com/NervJS/taro/commit/f782c9f675c3705a2af597399b7f61106c17543c))
* **h5:** h5类型增加_$router,防止router build报错 ([d89a08d](https://github.com/NervJS/taro/commit/d89a08dfacbf5f62685dd1a5886c716d912d783d))
* **h5:** 一批eslint问题修复 ([69ad2a2](https://github.com/NervJS/taro/commit/69ad2a26cf6f6c4dc3a9707fe9c16fb65a4afcc6))
* **h5:** 修复ci的错误 ([bf7a2a8](https://github.com/NervJS/taro/commit/bf7a2a89dad9f1233aea06398d979d54034314bd))
* **h5:** 修复createAnimation单位判定/translateX缺少括号bug/添加测试 ([54b2404](https://github.com/NervJS/taro/commit/54b240453a8d711a98d63389d2b6bfe828ee4880)), closes [#2749](https://github.com/NervJS/taro/issues/2749)
* **h5:** 修复setNavigationBarColor重复定义的问题 ([ced8b11](https://github.com/NervJS/taro/commit/ced8b11ce4a8d03eb92748476ae6503cb1070e9e))
* **h5:** 修改uploadFile.js文件名 ([99c59f6](https://github.com/NervJS/taro/commit/99c59f64800bc020e1369691f73c03d3e837bfa3))
* **h5:** 修正interceptors的typo ([0745dc9](https://github.com/NervJS/taro/commit/0745dc9eaa89274c23ed13610a5816d9bfa0cd89))
* **h5:** 暂时不实现'在触发距离内滑动期间，本事件只会被触发一次'的功能,保证移动端体验 ([a6af8f5](https://github.com/NervJS/taro/commit/a6af8f54ee72418b1d5fe0f444cdf8589d695f45))
* **h5:** 补上PureComponents的导出 ([8f8bbd2](https://github.com/NervJS/taro/commit/8f8bbd2370a99429f2cf499f0a3b5a0e45ad04b2))
* **h5 taro:** canvasContext的api typings对齐官方,fix [#2886](https://github.com/NervJS/taro/issues/2886) ([eb8ed9f](https://github.com/NervJS/taro/commit/eb8ed9feb598a9090e05bb6c50fc02cb7796dcc9))
* **index.d.ts:** 修正 RequestParams 的类型定义 ([#2834](https://github.com/NervJS/taro/issues/2834)) ([d96dae9](https://github.com/NervJS/taro/commit/d96dae9923f123e68e9492b60e84cd2f028fb2f4))
* **quickapp:** 修复快应用事件 bind 传参 ([a0ee392](https://github.com/NervJS/taro/commit/a0ee39216c66af53b56c87ff75ec340ee2293d3e))
* **quickapp:** 修复快应用路由相关 API url 处理错误的问题 ([9aba95c](https://github.com/NervJS/taro/commit/9aba95c95181d92c0458c1c54832054897c7696a))
* **quickapp:** 快应用属性传递最后小写 ([fabca5a](https://github.com/NervJS/taro/commit/fabca5a870b8dd9dd6a587a540077a0c2eaf5d5c))
* **redux:** 快应用属于多页应用，数据改成挂载全局下进行共享 ([1ffc6cd](https://github.com/NervJS/taro/commit/1ffc6cd0c8df5d05efca0d5cdc3a3949b3f84efe))
* **rn:** react native .rn.tsx 独立组件样式文件编译引入出错 close [#2846](https://github.com/NervJS/taro/issues/2846) ([bb14ff0](https://github.com/NervJS/taro/commit/bb14ff0f754b585fee0915a4e978e1eb4b8b11d6))
* **rn:** TS 改造导致的  build  错误 ([924fe75](https://github.com/NervJS/taro/commit/924fe75249d32a2494e5f3b1755343378aecb983))
* **taro-cli:** 修复插件 npm 路径编译。 ([220d017](https://github.com/NervJS/taro/commit/220d017a0f24f482501bf063c382348528a2b353))
* **taro-cli:** 修复插件 npm 路径编译。close [#2830](https://github.com/NervJS/taro/issues/2830) ([988ac93](https://github.com/NervJS/taro/commit/988ac9391fd2cc5a1f77e059e75365ddb5f95628))
* **taro-cli:** 修复插件静态资源引用路径。close [#2829](https://github.com/NervJS/taro/issues/2829) ([1bad473](https://github.com/NervJS/taro/commit/1bad473fe86a75acbec2d7633bef18227303a4f9))
* **taro-qq:** 修复 qq 没有给组件实例加 prefix 的问题 ([e63e744](https://github.com/NervJS/taro/commit/e63e744edb1aa84b2b92110e9bdf8657be154fe7))
* **taro-qq:** 修复 qq 轻应用 hooks 依赖路径 ([c67bace](https://github.com/NervJS/taro/commit/c67bace87fbe58d5aacaeccf9af6c67d77de0619))
* **taro-qq/swan/tt:** hooks 抽离到 @tarojs/taro ([dcf0757](https://github.com/NervJS/taro/commit/dcf0757255c8fbf6fd9e87448d3ace99d542f245))
* **taro-qucikapp:** 修复事件处理 ([4faab0e](https://github.com/NervJS/taro/commit/4faab0e0b019e8fbe28f43aead24ef12674fab77))
* **taro-quickapp:** 修复事件传参 ([02ff644](https://github.com/NervJS/taro/commit/02ff644bed4e5b40ac001fc09c5de4bfaba565f6))
* **taro-weapp/qq/swan/tt:** 修复小程序新 props 系统不触发 componentWillReceive 的问题 ([a34687d](https://github.com/NervJS/taro/commit/a34687d10d7a9bf87a5792f7bc76fc9fb1db0a71))
* **taro-weapp/swan/tt/qq/:** 修复 props 系统问题 ([a4ed9e8](https://github.com/NervJS/taro/commit/a4ed9e8d8f04b692587846434f40e28d379f3c39))
* **taro-weapp/tt/swan:** props 系统 compid 存取逻辑优化 ([9a9b1c7](https://github.com/NervJS/taro/commit/9a9b1c7f5e0c638871b7270752d9ae2b22676347))
* **taroize:** onLoad 的第一个参数可以传入 this.$router.params ([a386d93](https://github.com/NervJS/taro/commit/a386d93a95f45a9a07567425e8ebe2c4d11ea2c4)), closes [#2792](https://github.com/NervJS/taro/issues/2792)
* **taroize:** wxs 变量不需要从 state 中取值 ([226efc2](https://github.com/NervJS/taro/commit/226efc2e04a3160e9c683ea9bcff13c09b3ea99d))
* **taroize:** 解析 wxs 内联模块错误 ([5203d4f](https://github.com/NervJS/taro/commit/5203d4fc4828e836aebf022e7acbea9197106c32))
* **transformer:**  无法生成函数式组件 ([22bab7a](https://github.com/NervJS/taro/commit/22bab7a7ac7546f2439e4690c9feba6d31cdb286))
* **transformer:** JSX 表达式前有空格会被删除，close [#2261](https://github.com/NervJS/taro/issues/2261) ([34dc701](https://github.com/NervJS/taro/commit/34dc701e8a5a228b8555d9a79a9ba71cfbb203bd))
* **transformer:** 从 this.props 结构而来的 bind 函数生成匿名函数 ([37a8d8c](https://github.com/NervJS/taro/commit/37a8d8cca321036f59217284e0d661d69363e3f4))
* **transformer:** 以 render 开头又不返回 JSX 给提示 ([309ff17](https://github.com/NervJS/taro/commit/309ff177e6c92f1f4d23684826b3a0e2ff71dac1))
* **transformer:** 修复 props 系统和 render 外 JSX 的兼容 ([301ee12](https://github.com/NervJS/taro/commit/301ee126f168c71396ce04b7cf23220863393b89))
* **transformer:** 修复支付宝事件名编译错误 ([4ee0f6c](https://github.com/NervJS/taro/commit/4ee0f6ccaedc3d79bc44af124b7cb599d7f72839))
* **transformer:** 修复条件渲染与 render props 共存的问题 ([13def73](https://github.com/NervJS/taro/commit/13def7399b7f40852be1b2254583f424fce34d29)), closes [#2890](https://github.com/NervJS/taro/issues/2890)
* **transformer:** 函数式组件插入 props 结构语句位置错误 ([312edd3](https://github.com/NervJS/taro/commit/312edd3957d62cb1090a1e0ea9bfcf40606f46a3))
* **transformer:** 匿名 index 不需要检查变量冲突 ([af7d7ab](https://github.com/NervJS/taro/commit/af7d7abefdaa211e39329ba64364bff7622c4323))
* **transformer:** 在循环中使用类函数式组件不会创建新数组 ([f47bd49](https://github.com/NervJS/taro/commit/f47bd49beae8dc52d596c51903ebdb097f9362a2))
* **transformer:** 多级循环作用域处理有误，close [#2814](https://github.com/NervJS/taro/issues/2814) ([5620df1](https://github.com/NervJS/taro/commit/5620df18abee0819a0b7bbc1d9b2b6d39795d949))
* **transformer:** 循环中匿名函数生成的 key 不应该放在 state 里 ([9c1cae6](https://github.com/NervJS/taro/commit/9c1cae68f6dba779fc1d3d34f4cc5cbc0978a889))
* **transformer:** 循环中只有类函数式组件的时候不会生成匿名 index ([c17b497](https://github.com/NervJS/taro/commit/c17b497b57dc53c972e21299af778e5a6e607568))
* **transformer:** 快应用特殊组件不需要加入最终返回的 components ([8be21ee](https://github.com/NervJS/taro/commit/8be21ee58fe679b5f4f554770c237dde3c439fc5))
* **transformer:** 快应用生成函数匿名 state 也不能以 _$ 开头 ([b159cf2](https://github.com/NervJS/taro/commit/b159cf2c549c6def5d57d0606ddecf8dfac0b90a))
* **transformer:** 快应用还需要 properites 参数 ([1d1bcd0](https://github.com/NervJS/taro/commit/1d1bcd09803cb265dbc66438e020b9c7b26777f5))
* **transformer:** 特殊快应用组件需要当成自定义组件处理 ([577f925](https://github.com/NervJS/taro/commit/577f925c513afce46c4204f37b75e8893bd03987))
* **transformer:** 类函数式组件不入 $taroCompReady 的 if 条件 ([49eb70d](https://github.com/NervJS/taro/commit/49eb70d29ce38e32222ee22d5e5685f5cb26f543))
* **transformer:** 自定义组件 ID 未生成 ([f29bc9d](https://github.com/NervJS/taro/commit/f29bc9d3d2955833835531521fd1013adb507d01))
* **transformer:** 重复调用 transformer 函数出错 ([b5b80c0](https://github.com/NervJS/taro/commit/b5b80c01e9b43cff0391a0b4882b672915a7ba08))


### Features

* **alipay|swan|tt:** 入口文件导出 hooks API ([47b77a0](https://github.com/NervJS/taro/commit/47b77a0373c46b90907d16caedc2a6d237aba371))
* **baidu|alipay|tt:** 支持 hooks ([6932173](https://github.com/NervJS/taro/commit/6932173e6358d3e234dee70b8c51da21ac68a379))
* **cli:** cli 支持 node api 调用 ([c7c8dcd](https://github.com/NervJS/taro/commit/c7c8dcdb3c0cddae5ca17bd65350c4a0ebc58d16))
* **cli:** h5 ast逻辑优化 去除any ([0907cdf](https://github.com/NervJS/taro/commit/0907cdf6df7cec2a1c2f97a26f8ebf5caf980207))
* **cli:** h5编译支持node api调用 ([b82ae66](https://github.com/NervJS/taro/commit/b82ae66b085252d93413dc3831b19b85bdc14c21))
* **cli:** npm 编译处理改造 ([9d89921](https://github.com/NervJS/taro/commit/9d89921c600cf8cb4762231b525e0650ca0ea243))
* **cli:** 使用 typescript 重构 cli 代码 ([aa002be](https://github.com/NervJS/taro/commit/aa002bec958fc62b69e9e9f6132b096e139b8c89))
* **cli:** 使用 typescript 重构 cli 代码 ([4827549](https://github.com/NervJS/taro/commit/482754939e30e4197190e09eb8762d701a018dbd))
* **cli:** 增加快应用 manifest 的类型文件 ([89596b2](https://github.com/NervJS/taro/commit/89596b2709680da1d45ffa4ff23934485e9569db))
* **cli:** 增加快应用编译类型 ([f071494](https://github.com/NervJS/taro/commit/f07149420c384ee75e47fe18befe1c578bc3421c))
* **cli:** 快应用增加打包与发布命令 ([db939e7](https://github.com/NervJS/taro/commit/db939e7cf43994c4108e16a0478d327e3958474b))
* **cli:** 快应用样式尺寸处理 ([ad8cd9a](https://github.com/NervJS/taro/commit/ad8cd9ae82d2379e80d518aaebdb3d5297504133))
* **cli:** 快应用编译时需要传入根节点需要的参数 ([acd3ec8](https://github.com/NervJS/taro/commit/acd3ec8bafc7a13eb56ce76ac680ce7771b159e6))
* **cli:** 快应用编译环境准备，一键启动快应用编译 ([eeaaf65](https://github.com/NervJS/taro/commit/eeaaf6593e6c411bd42d5f57a2b1108cd9992367))
* **cli:** 快应用编译页面时补充 pagePath 参数 ([99c4df3](https://github.com/NervJS/taro/commit/99c4df3714144f9b35b78db4a8b66982c6dae7ac))
* **cli:** 编译时注入快应用顶部导航相关调用代码以配合运行时实现 ([5e90cbc](https://github.com/NervJS/taro/commit/5e90cbcb0f587a0207e958f161a45d3b6e59627c))
* **cli|quickapp:** 快应用样式尺寸处理 ([73761fe](https://github.com/NervJS/taro/commit/73761fe7799807cc3e19ab919c99e813e754f28a))
* **component:** 新增快应用 button, checkbox ([3f1b25f](https://github.com/NervJS/taro/commit/3f1b25f92ed6afcc7c8dd56f21029b093dcab98b))
* **components-qa:** 修复快应用 text 组件文字不显示的 bug ([e49600c](https://github.com/NervJS/taro/commit/e49600cbc894991e58b63d1ac841e94c138320fe))
* **components-qa:** 增加页面容器组件 ([064bd06](https://github.com/NervJS/taro/commit/064bd06aef4d6d92096741dc449e7ef5dedef93f))
* **doctor:** 增加 doctor 子命令 ([be02201](https://github.com/NervJS/taro/commit/be0220127859e9c23d963be7bca1b0d133acbc43))
* **doctor:** 增加 doctor 子命令 ([9510a7e](https://github.com/NervJS/taro/commit/9510a7e13da47ff7ae70e03876c710aa30937a36))
* **h5:** h5增加api chooseLocation ([43ccd53](https://github.com/NervJS/taro/commit/43ccd536594b34aa3cf921f891eba461a93697cd))
* **h5:** h5增加api on/offWindowResize nextTick ([8e8fa80](https://github.com/NervJS/taro/commit/8e8fa8088362df1f0555e65daedd6c10dd3834ce))
* **h5:** h5增加api previewImage ([88540f4](https://github.com/NervJS/taro/commit/88540f454d193ff8f2341ebbf09a25ce7fe43c7b))
* **h5:** h5增加api start/stopAccelerometer onAccelerometerChange ([d3eea4c](https://github.com/NervJS/taro/commit/d3eea4c8693274a88b7976a42bd4fec875ecc5fd))
* **h5:** h5增加api start/stopCompass onCompassChange ([9cc3b43](https://github.com/NervJS/taro/commit/9cc3b4386af63401699dbae9da3c7a245f8bdbcb))
* **h5:** h5增加api start/stopDeviceMotionListening onDeviceMotionChange ([3aadaee](https://github.com/NervJS/taro/commit/3aadaeeb6387fcc797cdb2411031da00778c3a17))
* **h5:** h5增加api upload/downloadFile ([032eafa](https://github.com/NervJS/taro/commit/032eafa7a7f030e6131b01796f5a373a2d547784))
* **h5:** h5增加api vibrateShort/Long ([a7fbcd3](https://github.com/NervJS/taro/commit/a7fbcd3be83e7a6e191e2be17a37c1cb4afc5d21))
* **h5:** h5添加api getImageInfo ([2a17e0f](https://github.com/NervJS/taro/commit/2a17e0ff77d7a8d721299c256c6a80b4f6c05ed3))
* **h5:** 为tabbar相关api增加了测试用例 ([b90064d](https://github.com/NervJS/taro/commit/b90064dd445e524cf3db9f477dcf08612ad22961))
* **h5:** 增加页面某些异常路由状态的报错 ([611d49b](https://github.com/NervJS/taro/commit/611d49b22b932170131ae20cd16cc52dac66f737))
* **quickapp:** 修复事件支持 && 增加 setState 实现及相关生命周期 ([efc0d74](https://github.com/NervJS/taro/commit/efc0d74040bbde664b8f5b39204537ad80a94a35))
* **quickapp:** 快应用事件处理 ([debe086](https://github.com/NervJS/taro/commit/debe0867b3c8743ccf4af3378801447a071ba6d7))
* **quickapp:** 快应用运行时框架 ([e1754b6](https://github.com/NervJS/taro/commit/e1754b6f28de278ad143adf72e81003fa4ab8ac9))
* **rn:** add API chooseImage ([090b6ce](https://github.com/NervJS/taro/commit/090b6cebd6574e879d35af49b96f50d718e91f97))
* **taro:** tabbar 增加 custom 定义 ([45f6e6f](https://github.com/NervJS/taro/commit/45f6e6f1ac906aa9d4d698c39d8e9585110b7fe2))
* **taro:** taro 增加广告 API。close [#2893](https://github.com/NervJS/taro/issues/2893) ([3ddd99a](https://github.com/NervJS/taro/commit/3ddd99a87abd8f34fd3014bd497333f527a998c5))
* **taro:** 增加 hooks 的 typings ([aed4f80](https://github.com/NervJS/taro/commit/aed4f806cfb1d3d9e7e4911014d4108bca5e3f09))
* **taro:** 增加 port 命令参数作为快应用和 H5 的启动端口设置 ([8ad4bf4](https://github.com/NervJS/taro/commit/8ad4bf471d6c9948397f2ef790ac3966962c6f82))
* **taro:** 快应用对齐 onPullDownRefresh/onReachBottom/onPageScroll 等钩子 ([01b75e8](https://github.com/NervJS/taro/commit/01b75e87859ed96f584f40c050070e16e27c003f))
* **taro-qq:** qq 小程序支持 createRef ([7576032](https://github.com/NervJS/taro/commit/757603294d2874fe3154603f8966989e9957e300))
* **taro-qq:** qq 轻应用 props 改造 ([7e46194](https://github.com/NervJS/taro/commit/7e461943109966d502885464ba7b947743c436ae))
* **taro-qq:** 增加 QQ 轻应用端适配 ([2e81854](https://github.com/NervJS/taro/commit/2e818546cbf3a8a14e1d266c4b8207a347ba913b))
* **taro-qucikapp:** 增加扫码 api ([93eeba5](https://github.com/NervJS/taro/commit/93eeba5180f6ca46121ce1ffc12d6d2a2b34bde1))
* **taro-quickapp:** 增加分享/通知/部分设备相关 api ([2731263](https://github.com/NervJS/taro/commit/273126302abb127b031201f774dea4f5118d6528))
* **taro-quickapp:** 增加顶部导航相关 API ([b228c1f](https://github.com/NervJS/taro/commit/b228c1f11ae4be2616e0b08944b4a8a339a0e448))
* **taro-weapp/alipay/swan/tt:** 小程序端支持 createRef ([40ed9cb](https://github.com/NervJS/taro/commit/40ed9cbf0e54af058373371b4c26adfcad9db84b))
* **transformer:** 函数式组件 props.children 替换为 slot ([1b4ed2a](https://github.com/NervJS/taro/commit/1b4ed2aad9e676e8d300f7d80c0949e9f59fa50a))
* **transformer:** 增加快应用适配器 ([13cfa70](https://github.com/NervJS/taro/commit/13cfa70088d3506d752a4eae0fbc1c1765ad2454))
* **transformer:** 快应用新增参数: rootProps ([247a03e](https://github.com/NervJS/taro/commit/247a03edca07a9f5212fbd7d1d77e87376f631eb))
* **transformer:** 支持类函数式组件 ([ad8ce20](https://github.com/NervJS/taro/commit/ad8ce20f02d332751cc491bad062ea40113c4bcb))
* **weapp:** 实现 react hooks ([e0f6fbc](https://github.com/NervJS/taro/commit/e0f6fbcf43092b636c6686928a89601ba3d086bb))
* 为了避免快应用基础组件与原生组件名冲突，部分组件增加 taro 前缀 ([73fb96d](https://github.com/NervJS/taro/commit/73fb96d04fa0227082ce4ecb50aabc4d6b37a647))
* 完善快应用入口文件及页面编译 ([0be90c0](https://github.com/NervJS/taro/commit/0be90c098eb98704d916ba74b447dd44d50d65b3))
* 快应用编译及快应用框架 ([50067da](https://github.com/NervJS/taro/commit/50067da1c6163054f9d80169a58d5deb514b072b))
* 快应用编译调整 ([7a08f0c](https://github.com/NervJS/taro/commit/7a08f0c2d9ce7b99faea32a189b529dc11d14a2f))
* 编译快应用依赖组件 ([8f3a3c2](https://github.com/NervJS/taro/commit/8f3a3c2c4db2b9d74a01d6aff381e5d6d3f8937d))
* 编译快应用页面时 copy 页面依赖的 taro 内置组件 ([2a6493d](https://github.com/NervJS/taro/commit/2a6493d37a3d8fb1f8df4cd2b66a8ab6d04b90d6))
* **taro-components-qa:** 快应用相关组件添加 ([e8e4216](https://github.com/NervJS/taro/commit/e8e42168c96793af24cce99e32643eace007bea0))
* **transformer:** JSX 字符串和 JSX 表达式在快应用都需要用 Text 包裹起来 ([f1907b6](https://github.com/NervJS/taro/commit/f1907b6edd5994da5f0275af01ef0ae8ace54882))
* **transformer:** 支持函数式组件 ([7ab7e38](https://github.com/NervJS/taro/commit/7ab7e38a7d373a17533fa6ae33ea98cf271ec8c2))
* **transformer:** 支持用函数表达式定义函数式组件 ([a6cd62d](https://github.com/NervJS/taro/commit/a6cd62d969b8f890dd67bf801e8d45a9038c0684))
* **transformer:** 支持类函数式组件 ([b58df6f](https://github.com/NervJS/taro/commit/b58df6f4259f9474b289a1f7e76f0948bd5814ca))
* **transformer:** 改变快应用的循环模式 ([9a9e9b4](https://github.com/NervJS/taro/commit/9a9e9b419f74ecbc08dd648ffde4788412cd964e))


### Performance Improvements

* **transformer:** 优化创建 props 的方式 ([ddf4cd7](https://github.com/NervJS/taro/commit/ddf4cd781e6200b6b57447f10b3ccd4378b2a387))



## [1.2.27-beta.0](https://github.com/NervJS/taro/compare/v1.2.26...v1.2.27-beta.0) (2019-04-18)


### Bug Fixes

* css modules doesn't update ([#2712](https://github.com/NervJS/taro/issues/2712)) ([c599918](https://github.com/NervJS/taro/commit/c59991825fe5c96da90b201ea183946fe45c8257)), closes [#1388](https://github.com/NervJS/taro/issues/1388)
* **cli:** h5端增加了reachBottom等函数的容错处理 ([1e7670c](https://github.com/NervJS/taro/commit/1e7670c952a1c8c8c62e95b6e26918fe9ba14841))
* **cli:** mobx 模版依赖问题修复 ([4368557](https://github.com/NervJS/taro/commit/436855764a76d67a4ccdff2d1cf9f8f052f8d273))
* **component:**  hoverable 异常逻辑 ([b21093f](https://github.com/NervJS/taro/commit/b21093f6d7fabf7cb00323a4c074494787c89402))
* **components:** picker 单列选择更新下标问题 (close [#2797](https://github.com/NervJS/taro/issues/2797)) ([36d3b0f](https://github.com/NervJS/taro/commit/36d3b0f6e53e0bfb7a83cc1b6d9b6aa27ee3e4fc))
* **components:** 修复某些时候swiper.destroy报错的问题 ([b479992](https://github.com/NervJS/taro/commit/b479992bb6d68f97837f41660628144de85d7ebf))
* **components-rn:** Picker time 格式 hh:mm ([a52ebc5](https://github.com/NervJS/taro/commit/a52ebc5b28c7b06b64aa23503e9af0f3edb89b69))
* **components-rn:** Picker time 格式 hh:mm ([a7524ad](https://github.com/NervJS/taro/commit/a7524addf1259237502a9388b61ca3decc827d08))
* **h5:** 修复父类的componentDidShow等函数被覆盖的问题 ([ba88faa](https://github.com/NervJS/taro/commit/ba88faa17cd37175633ebb095b7309a6746f92bc))
* **h5:** 去除promise.finally ([1ed6d0d](https://github.com/NervJS/taro/commit/1ed6d0d7b9d89cfaef86e9edaa65a5667bff404c))
* **index.d.ts:** 修正 Canvas 的类型定义 ([#2768](https://github.com/NervJS/taro/issues/2768)) ([5318903](https://github.com/NervJS/taro/commit/5318903c123524c28eb8b984f05991968913683a))
* **mobx:** rn 端问题修复 ([fde899d](https://github.com/NervJS/taro/commit/fde899d834801d36db7429f9b37795c0fff9c800))
* **mobx:** 支付宝小程序 onTaroCollectChilds 未定义问题修复 ([556c31f](https://github.com/NervJS/taro/commit/556c31f7c3e953ad269ab7999dd1605c06d444e9))
* **taro-rn:**  RN 端 Toast 相关 API Promise 化 close [#2715](https://github.com/NervJS/taro/issues/2715) ([00bac39](https://github.com/NervJS/taro/commit/00bac392cc27d402159ec7ceabb8659f3454e88d))
* **taro-transformer-wx:** props 改造，优化组件属性过滤判断 ([43c3dac](https://github.com/NervJS/taro/commit/43c3dac43a3433f4d64e7b51c154770541cd18a5))
* **taro-transformer-wx:** 自动 import 的 taro 工具包补齐 ([bf1da1e](https://github.com/NervJS/taro/commit/bf1da1e0ee3d63081ac562808850921b6e72c93e))
* **taro-weapp:** 不再根据 Component.properties 来计算 next props ([2ede173](https://github.com/NervJS/taro/commit/2ede173688179f1c788154119fb62e2c83ec4830))
* **taro-weapp:** 不去过滤所有第三方与原生组件的 propreties ([5fdc5fa](https://github.com/NervJS/taro/commit/5fdc5fa564a60ca03070e815728357e0164aac1c))
* **taro-weapp:** 优化微信小程序 props 改造方案 ([c2d5749](https://github.com/NervJS/taro/commit/c2d57497b0962082d54110fac48dbdf14a0bbaa6))
* **taro-weapp:** 修复没有 props 的自定义组件不初始化的问题。 ([29162b8](https://github.com/NervJS/taro/commit/29162b8ffb52209da6ead454b279dd14e0d0d41c))
* **taro-weapp:** 微信小程序 props 改造，compid 改为运行时动态打上 ([972255e](https://github.com/NervJS/taro/commit/972255ec6c6a1c53a639bfc60cf14cdb7cff57f4))
* **taro-weapp:** 微信小程序 redux props 不能被覆盖 ([684bcce](https://github.com/NervJS/taro/commit/684bcce0437be8a4d3b6ce401125c8ff4ff6b192))
* **taro-weapp:** 微信小程序收集自定义组件 props 过滤时过滤掉 render 开头的组件 ([55b7031](https://github.com/NervJS/taro/commit/55b703165dd20e647283cbba74595a9c720ea657))
* **taro-weapp/tt/swan/alipay:** 修复 ref ([d4e3ef5](https://github.com/NervJS/taro/commit/d4e3ef54289620f281615256a6f3e7dc0b8f5a24))
* **transformer:** 最后加入到 render 函数的一刻才处理 propsManager.set 的先验条件 ([2a933c3](https://github.com/NervJS/taro/commit/2a933c394f0d360ec49352082fc72490ee8c541e))
* **transformer:** 增加 isEmptyProps 对 JSXSpreadAttribute 的判断 ([9dbc512](https://github.com/NervJS/taro/commit/9dbc5129014fa6d5e02f6d1218c25db60ff424c4))
* **transformer:** 多层循环中使用箭头函数给事件传参错误，close [#2551](https://github.com/NervJS/taro/issues/2551) ([f880c82](https://github.com/NervJS/taro/commit/f880c827c1bf12ac64a90aab72e43a50dad4b6d2)), closes [#2514](https://github.com/NervJS/taro/issues/2514) [#2112](https://github.com/NervJS/taro/issues/2112)
* **transformer:** 循环中传匿名函数 props 需要返回值 ([f65c6a5](https://github.com/NervJS/taro/commit/f65c6a56dc5b8941a645a2caf49bc71fa16f7b26))
* **transformer:** 第三方组件事件处理错误 ([011dd77](https://github.com/NervJS/taro/commit/011dd77e3107904140353f99039df84a8c1bd68b))
* **transformer:** 通过 props 传递生成的匿名函数需要直接 return ([60122df](https://github.com/NervJS/taro/commit/60122df6548e750d1a31c169af5e8d401a4ef4c3))


### Features

* **component-rn:** 添加 Block 组件 ([714c770](https://github.com/NervJS/taro/commit/714c7701b05258aa2b064becb8a2eacdc94663ba))
* **components-rn:** add ClickableSimplified ([cccb502](https://github.com/NervJS/taro/commit/cccb5023d8f950c47fb693ddbf6a075411811131))
* **components-rn:** ts 改写 WebView 组件 ([73517c4](https://github.com/NervJS/taro/commit/73517c4a9e1fee4d1af6decf6f0a7d09ba452722))
* **components-rn:** ts 改写 WebView 组件 ([2a0b21d](https://github.com/NervJS/taro/commit/2a0b21d72558eac34689a66e494b34de530e83e0))
* **components-rn:** 脱离expo, example 移至 react-native init 的项目下 ([1fdf035](https://github.com/NervJS/taro/commit/1fdf03565771020478513a68682cdfe106b6dd0e))
* **components-rn:** 脱离expo, example 移至 react-native init 的项目下 ([7becd8e](https://github.com/NervJS/taro/commit/7becd8e482b3a8d17f4f6e2d253d7a5898b1b9f0))
* **h5:** canvas系列api不再使用Proxy ([ee708c5](https://github.com/NervJS/taro/commit/ee708c52a3eb881ca5c83e7e8abfd9eee854114c))
* **h5:** canvas系列api现在不强制传this了 ([4cbaab3](https://github.com/NervJS/taro/commit/4cbaab378fc1d87f15a758e8a615510d1293e93f))
* **h5:** h5增加api createInnerAudioContext ([52703ac](https://github.com/NervJS/taro/commit/52703ac2d2d093329bbd9951dfe36e0be35d17a0))
* **h5:** h5增加api get/setClipboardData ([e41bb2e](https://github.com/NervJS/taro/commit/e41bb2e31fbf1b6dfb57c613f723accfb6b7daf9))
* **h5:** h5端姑且支持setNavigationBarColor ([776aaea](https://github.com/NervJS/taro/commit/776aaea020672f6729d29d4456df1ff083aa29dd))
* **h5:** innerAudioContext的一些优化: ([8a4b6c7](https://github.com/NervJS/taro/commit/8a4b6c777ae383f8ce1e15fc1dbe3efd9ae21f09))
* **h5:** open api 功能更新 [#2771](https://github.com/NervJS/taro/issues/2771) ([11e89f1](https://github.com/NervJS/taro/commit/11e89f114589a971e2920fdcd80b904fdeaf7343))
* **h5:** 增加createVideoContext api ([d8a3b0e](https://github.com/NervJS/taro/commit/d8a3b0efd52c0745a84b06b7acf64aea757ecd40))
* **h5:** 增加了chooseVideo api, videoContext api补齐 ([7fb605d](https://github.com/NervJS/taro/commit/7fb605d52cfa86a5cfbae2013c67292f506249ac))
* **ht:** h5增加api pageScrollTo ([b1c5252](https://github.com/NervJS/taro/commit/b1c5252c9ce80993ba83dc29dca12aa023f59759))
* **taro-router-rn:** 添加 showTabBar 和 hideTabBar  的 API ([18298c6](https://github.com/NervJS/taro/commit/18298c660bcd85b577da1f4efe2222347b80c48b))
* **taro-swan:** 百度小程序重构 props 系统 ([1a6d244](https://github.com/NervJS/taro/commit/1a6d244a9548c2cf4a5bc26d45294dbff6c6a552))
* **taro-tt:** 字节跳动小程序 props 改造 ([0af1d46](https://github.com/NervJS/taro/commit/0af1d460bd4469386b3b51f232da643f32c6f0c8))
* **taro-weapp:** 微信小程序 props 改造 ([e5fa03b](https://github.com/NervJS/taro/commit/e5fa03b08648a839568ea6cad7451a54d74b43c5))
* **transformer:** 如果用户没有写在循环中写 index，就生成一个匿名 index ([b60f5f1](https://github.com/NervJS/taro/commit/b60f5f19b843a12d34bea3db9fee58fe73b02afc))



## [1.2.26](https://github.com/NervJS/taro/compare/v1.2.25...v1.2.26) (2019-04-15)


### Bug Fixes

* **h5:** 暂时移除chooseVideo ([769227e](https://github.com/NervJS/taro/commit/769227e52c4ccf6910054d7ecfd882a78cef0c86))


### Features

* **taroize:**  支持 wxml catch 函数直接写 true ([d94032f](https://github.com/NervJS/taro/commit/d94032f63055549175827dc12d9466aaf8f7a771))



## [1.2.25](https://github.com/NervJS/taro/compare/v1.2.24...v1.2.25) (2019-04-12)


### Bug Fixes

* **cli:** 修复h5修改tabbar配置需要重启才能生效的问题 ([277856c](https://github.com/NervJS/taro/commit/277856cfdd7191b37fd33c7109a87d6e91db1310))
* **cli:** 修复render函数中pullDownRefresh的处理错误 ([d131ab8](https://github.com/NervJS/taro/commit/d131ab8b6453b2ccd28bff8f637eb0005a98fd0c))
* **cli:** 修复云开发模板生成文件问题 ([3fc0ec0](https://github.com/NervJS/taro/commit/3fc0ec01a7cc88c79b496ee368b08a3d557dc073))
* **cli:** 修复全局变量为对象时替换的 bug ([97067d5](https://github.com/NervJS/taro/commit/97067d5eb6bc29227f278f47cf0713de364525a2))
* **cli:** 修复支付宝小程序端 tabBar 文字颜色配置，close [#2739](https://github.com/NervJS/taro/issues/2739) ([27b1afa](https://github.com/NervJS/taro/commit/27b1afad38f028e1945a731f8e35b96027e56cd4))
* **cli:** 升级 @typescript-eslint/parser 的版本，close [#2742](https://github.com/NervJS/taro/issues/2742) ([19226c2](https://github.com/NervJS/taro/commit/19226c20e79d440b41df90e5d78ad44a260e4630))
* **cli:** 模版内 eslintrc 变量读读取错误导致初始化报错 ([09cdab1](https://github.com/NervJS/taro/commit/09cdab1677ef3c9170171575b5a829a461f5cab8))
* **taro-components:** 解决组件库缺少 loader 导致构建失败的问题 ([bcd379f](https://github.com/NervJS/taro/commit/bcd379f2663b10eb114d58dcc102296143042620))
* **taro-redux:** connect 继承原组件时需要传入 isPage。#closed 2729 ([39e0e66](https://github.com/NervJS/taro/commit/39e0e66227a745fc721db541a80307934145775f))
* **taroize:** 装饰器没有插入到类声明中, close [#2740](https://github.com/NervJS/taro/issues/2740) ([f6c15b8](https://github.com/NervJS/taro/commit/f6c15b8441ca3079b2fcfe87d5ac15af7df4be53))
* **transformer:** 在循环中重复删除节点导致报错 ([7992502](https://github.com/NervJS/taro/commit/79925023021f764d0691954935a7cfc395b618d3))
* **transformer:** 循环的上级和内部都有 if-else 解析错误，close [#2732](https://github.com/NervJS/taro/issues/2732) ([c57e18a](https://github.com/NervJS/taro/commit/c57e18ab88f8b01c7091fd4487acc1720eacbc17))
* **transformer:** 超过三级 if-else 嵌套时解析失败 ([fe26a7e](https://github.com/NervJS/taro/commit/fe26a7e274298b48a26d514db6a3149090691b8d))
* **transformer-wx:** 当类中不存在 render 方法时补充一个空的 _createData 方法，close [#2733](https://github.com/NervJS/taro/issues/2733) ([c9df847](https://github.com/NervJS/taro/commit/c9df8477fd76b1436673d0d4aed24abcfda36e15))
* **webpack-runner:** 把mobx-h5加入默认esnextModules中 ([04f0580](https://github.com/NervJS/taro/commit/04f0580f7d415a62608af7e26089ab307e33d626))


### Features

* **components:** video组件md更新 ([a5108c5](https://github.com/NervJS/taro/commit/a5108c5719a3f9688ff34d583e07a4c7aaebbcd9))
* **components:** 增加video组件 ([03b13a0](https://github.com/NervJS/taro/commit/03b13a045cba19659b242c19ecb0258dc99a23cf))
* **scss:** support global scss inject ([#2725](https://github.com/NervJS/taro/issues/2725)) ([1187e24](https://github.com/NervJS/taro/commit/1187e24159b19d3e460ff5ec9c65f723d2cf50eb))



## [1.2.24](https://github.com/NervJS/taro/compare/v1.2.23...v1.2.24) (2019-04-10)


### Bug Fixes

* **cli:** 云函数返回结果 ([#2687](https://github.com/NervJS/taro/issues/2687)) ([2bb0e5d](https://github.com/NervJS/taro/commit/2bb0e5d2042df108d1f3f73ba1c835f80f362857))
* **cli:** 修复 node_modules 中图片等静态资源文件路径编译错误问题，closes [#2540](https://github.com/NervJS/taro/issues/2540)，closes [#2208](https://github.com/NervJS/taro/issues/2208) ([58cd13b](https://github.com/NervJS/taro/commit/58cd13b7a1c500bf4df48eb932098a246044a947))
* **cli:** 小程序编译时遇到样式错误直接中断编译 ([57eae11](https://github.com/NervJS/taro/commit/57eae11a8835bfcc03bd31d6999ade87d9ab66eb))
* **cli:** 调整插件编译类型判断 ([6b1581d](https://github.com/NervJS/taro/commit/6b1581d6497bbf30ca0afe9b450f6d5b5c41b7c4))
* **taro-alipay:** 修复支付宝 ref ([59a7cf1](https://github.com/NervJS/taro/commit/59a7cf118669bb9e56b1781cb6c65b56a2ce58a2))
* **taro-alipay:** 修复支付宝 ref。fix [#2028](https://github.com/NervJS/taro/issues/2028) ([3ddc740](https://github.com/NervJS/taro/commit/3ddc740b36b77db903a8dc3d712c4d69d74c03d7))
* **taro-cli:** 修复 taro init 插件模板 ([32004be](https://github.com/NervJS/taro/commit/32004be84d25b970579eac474e03916caf942c17))
* **taro-cli:** 更新微信小程序插件模板 ([9f8884e](https://github.com/NervJS/taro/commit/9f8884e89cfab0000697123e2441fa11753aa001))
* **taro-swan:** 百度小程序增加循环 ref 处理 ([191a9e2](https://github.com/NervJS/taro/commit/191a9e2478cf37460e83248be8552daea13f5716))
* **taro-tt:** 修复字节跳动小程序循环 ref ([9e286fa](https://github.com/NervJS/taro/commit/9e286fa4f7e2ea512daa35f8d9752dafa13c80e9))
* **taro-weapp:** 修改循环 ref 参数 ([9e0b614](https://github.com/NervJS/taro/commit/9e0b6148b5ed64171cd2ea4d910e695ca623b4c2))
* **taroize:** template 和 for 混用解析，失败，[#2695](https://github.com/NervJS/taro/issues/2695) ([5536600](https://github.com/NervJS/taro/commit/5536600f53c03c3b9ca7f10ea12b9ef3531c8b94))
* **taroize:** 微信小程序转换Taro生命周期丢失 ([#2688](https://github.com/NervJS/taro/issues/2688)) ([05b4917](https://github.com/NervJS/taro/commit/05b4917444c32d767d55e33558e14f3aa71474d2))
* **transformer:** 只有 props 为 key 时才进行 key 不得为 index 的警告 ([#2705](https://github.com/NervJS/taro/issues/2705)) ([bd3f142](https://github.com/NervJS/taro/commit/bd3f14266dc784b3ca30dbcc377e63caf50a5bfd))


### Features

* **components:** h5内置PullDownRefresh组件 ([5793260](https://github.com/NervJS/taro/commit/57932609bf8f36a4b99252ee1268abb7d3165007))
* **components:** 完善 Input, Button, Textarea, WebView, Swiper 组件的类型定义 ([#2713](https://github.com/NervJS/taro/issues/2713)) ([6c4ef9c](https://github.com/NervJS/taro/commit/6c4ef9c48c3c6931fbcba7e6030380d7dc87f4c4))
* **h5:** h5支持PullDownRefresh系列api ([50a7e79](https://github.com/NervJS/taro/commit/50a7e79633b9f80dbf6cc1176fe4ac69b3778472))
* **taro-cli:** 增加微信小程序插件编译功能 ([e3ca6ca](https://github.com/NervJS/taro/commit/e3ca6ca779aa092f59dd40303647e170ec62ee4a))
* **taro-cli:** 增加支付宝小程序插件编译功能 ([a4febc6](https://github.com/NervJS/taro/commit/a4febc6f55caf4e2f9e53832f7aa3982fa49219b))
* **taro-components:** 更新 Video 组件的类型定义 ([63d7e13](https://github.com/NervJS/taro/commit/63d7e138e2815cb67fafe7fe85c69511031674dd))
* **taroize:** 支持在 wxml 使用复杂结构语法，close [#2695](https://github.com/NervJS/taro/issues/2695) ([b28ef49](https://github.com/NervJS/taro/commit/b28ef49d105def5b0c53f8b9b1e4a304197f3812))
* **transformer:** 支持 do expression，close [#2589](https://github.com/NervJS/taro/issues/2589) ([67e0e2d](https://github.com/NervJS/taro/commit/67e0e2deae8d8d6d8c98c45438914f8cf31fbbeb))
* **transformer:** 支持 export * from * 语法, close [#959](https://github.com/NervJS/taro/issues/959) ([c7f9f24](https://github.com/NervJS/taro/commit/c7f9f241b116ad9d18dd4883097b9d080da25535))
* **typescript:** 类型声明文件增加类类型：ComponentClass ([#2720](https://github.com/NervJS/taro/issues/2720)) ([bf80451](https://github.com/NervJS/taro/commit/bf80451d1d3d58d297738b9fef94b2a089f438dd))



## [1.2.23](https://github.com/NervJS/taro/compare/v1.2.22...v1.2.23) (2019-04-04)


### Bug Fixes

* **components:** 修复在didMount中绘制的canvas会被清空的问题 ([9687312](https://github.com/NervJS/taro/commit/9687312f7af54fbb5effef4a807bb6d0f0aea232))
* **components:** 多列选择器更新属性问题 ([db206b3](https://github.com/NervJS/taro/commit/db206b37b7bd7358587a8ca348c27a9796502478))
* **components:** 缺少处理修饰器的 babel 插件 ([3d36851](https://github.com/NervJS/taro/commit/3d3685170de06c4c26827cb3703b00bd56b02402))
* **mobx-h5:** 修复mobx中import不到Component的问题, fix [#2561](https://github.com/NervJS/taro/issues/2561) ([0097df0](https://github.com/NervJS/taro/commit/0097df0dcac2acbbb4dd6dfc749c74e5d9100ecd))
* **rn:** 直接运行构建命令目录不存在的bug ([48a1e3c](https://github.com/NervJS/taro/commit/48a1e3cb946e59d8d32cd795cc8fdf4db8c2bf17))
* **taro:** interceptors 没有正确处理异常 ([9743717](https://github.com/NervJS/taro/commit/9743717f60754e8cf20ad84b84b28126e9f485d2))
* **taroize:** 处理声明周期函数不是函数的情况 ([64be21d](https://github.com/NervJS/taro/commit/64be21de74f7fabbd7748eea7fd16f01f66636dd))
* **taroize:** 第一个 wxml 标签后有注释可能报错 ([ae59efd](https://github.com/NervJS/taro/commit/ae59efd66eb61d5dbddeaa67cfd1d208a82376ef))
* **transformer:** JSX props 的匿名函数变量不需要重命名 ([8056981](https://github.com/NervJS/taro/commit/80569811f25a886913ed1c9fab1b2166c381751c))
* **transformer:** 多层循环中的调用者如果是一个复杂表达式不需要改名 ([7f7cb7c](https://github.com/NervJS/taro/commit/7f7cb7ce52302b3cfa247ad939c80ecc2ebc7ef8))
* **transformer-wx:** 修复tsx文件中读取不到config的问题,fix [#2592](https://github.com/NervJS/taro/issues/2592) ([61c600f](https://github.com/NervJS/taro/commit/61c600f1025791e63ed92520050cf6fb44c229cf))
* **webpack-runner:** 修复esnextModules中的斜杠干扰正则解析的问题 ([dc5be08](https://github.com/NervJS/taro/commit/dc5be082ef32f9a4a9d0d68e15e5b81ce32e364e))


### Features

* **cli h5:** 支持onPageScroll和onReachBottom api ([2a8224e](https://github.com/NervJS/taro/commit/2a8224e7cba3d526545ada76dc5f9ea54946008d))
* **components:** h5增加canvas组件 ([09d1396](https://github.com/NervJS/taro/commit/09d13965d571d42a08187583fa525ca460800561))
* **css modules:** generateScopedName 支持设为函数 ([#2058](https://github.com/NervJS/taro/issues/2058)) ([3e27853](https://github.com/NervJS/taro/commit/3e278531deb75dec74dfed9974e96d55d1dc36e1))
* **h5:** h5增加createCanvasContext api ([56e8843](https://github.com/NervJS/taro/commit/56e88438a21b41ba396e24153196bdd15f7bee9a))
* **h5:** 增加canvasToTempFilePath api ([3764452](https://github.com/NervJS/taro/commit/37644521c56cdaade70a21f29bdfa8b7db3497ae))
* **h5 component:** 支持canvasgetimagedata canvasputimage api ([17d804d](https://github.com/NervJS/taro/commit/17d804df60c8769dfec3112d919cf94ef517af64))
* **plugin-sass:** 改用dart-sass ([0a2f8d8](https://github.com/NervJS/taro/commit/0a2f8d830f25357f4ebcda0ec001192dbb8a9a4d))
* **rn:** 添加生成 JDReact 工程目录的功能 ([4047269](https://github.com/NervJS/taro/commit/4047269f3331a0dda0fd23a1ec3dae3a2b35b064))
* **taro-cli:** 添加 process.env.TARO_ENV 的 TypeScript 定义 ([#2663](https://github.com/NervJS/taro/issues/2663)) ([ecd52ff](https://github.com/NervJS/taro/commit/ecd52fffb08956d3e46e1fd4d287d3042cb4343f))
* **taro-components:** 添加 PickerViewColumn 组件 ([#2606](https://github.com/NervJS/taro/issues/2606)) ([9fa119b](https://github.com/NervJS/taro/commit/9fa119b58e05d12f5df4800fd3075325bd658ec9))
* **taro-swan:** 百度小程序增加 componentDidShow、componentDidHide。closed [#2605](https://github.com/NervJS/taro/issues/2605) ([91f5c4f](https://github.com/NervJS/taro/commit/91f5c4fc0cad1a4d90c1970f727b19cba38eec62))
* **taroize:** 构造函数支持传入变量 ([f104d05](https://github.com/NervJS/taro/commit/f104d057d2a21748fdda1cd4dc6ada60a6bcaa2b))
* **transformer:** 同一文件定义多个类在 cli 直接报错 ([eea66cf](https://github.com/NervJS/taro/commit/eea66cfbaac1b613468544b1386f11f2e0ac3b68))
* **webpack-runner:** 切换为dart-sass ([40533fc](https://github.com/NervJS/taro/commit/40533fc5298a772a5ac927c742090a53c98c6bce))



## [1.2.22](https://github.com/NervJS/taro/compare/v1.2.21...v1.2.22) (2019-03-26)


### Bug Fixes

* **components-rn:** Picker date 格式 yyyy-MM-dd ([62b632c](https://github.com/NervJS/taro/commit/62b632c9bbf70936709a1bd1a8dff945b374a4b2))
* **components-rn:** 大小写无法覆盖导致了引用问题 ([1dd42f3](https://github.com/NervJS/taro/commit/1dd42f329ce28ae1221b874d49c12e69dce64d46))
* **mobx:** 修复h5下，componentDidShow不触发的问题 ([#2583](https://github.com/NervJS/taro/issues/2583)) ([7076881](https://github.com/NervJS/taro/commit/70768819d7325d4529000f4ea9e16c1a72203f35))
* **rn:** RN 下 navigationBarTextStyle 无效 close [#2119](https://github.com/NervJS/taro/issues/2119) ([0539c8e](https://github.com/NervJS/taro/commit/0539c8ee86fca6ee2aeb1a81eee0fbf8db56e46c))
* **rn:** RN端编译时提示Warning: isMounted(...) is deprecated close [#642](https://github.com/NervJS/taro/issues/642) ([5a9b66a](https://github.com/NervJS/taro/commit/5a9b66afd4ede050ca688cf025cc861529acb6ef))
* **rn:** 修复 Android 端 navigation header title 不居中的问题 ([5fb6fab](https://github.com/NervJS/taro/commit/5fb6fab6ebe3d3d35a29b2c33d3844f3d3c1a82c))
* **rn:** 生成的 index 入口的 entryFileName 带文件后缀导致 ts 模版启动异常 ([7791edb](https://github.com/NervJS/taro/commit/7791edb2506f8501deecbda5bfdc2fc76154f1d1))
* **rn:** 编译成rn之后，navigateBack delta参数无效，reLaunch提示不支持 close [#2494](https://github.com/NervJS/taro/issues/2494) ([cdeed45](https://github.com/NervJS/taro/commit/cdeed455c7a5edd2a73013871219e9f9f72790e1))
* **taro-components:** H5 & Weapp统一pagePath. ([#2575](https://github.com/NervJS/taro/issues/2575)) ([cdd1370](https://github.com/NervJS/taro/commit/cdd13704329be103001016a982098b013252804b))
* **taro-redux:** close [#2595](https://github.com/NervJS/taro/issues/2595)，reopen [#1125](https://github.com/NervJS/taro/issues/1125) ([c93dbd5](https://github.com/NervJS/taro/commit/c93dbd5af93b3497e938720ecd626c3de497f7a9))
* **taro-swan:** 绕过百度小程序合并 setData 导致 properties observer 不触发的问题 ([d18c582](https://github.com/NervJS/taro/commit/d18c582df0c6db20b3f3b77904f97d80c2e8a9a3))
* **taroize:** if 和 for 同在一个 tag 时报错，close [#2528](https://github.com/NervJS/taro/issues/2528) ([b366202](https://github.com/NervJS/taro/commit/b3662020574e718218e3d5cfee6172e27f0dc841))
* **taroize:** template import 为兄弟关系时报错, close [#2535](https://github.com/NervJS/taro/issues/2535) ([65504ba](https://github.com/NervJS/taro/commit/65504ba56cd543df2c9136786604b7921d20fa7c))
* **taroize:** wxml 中包含单个花括号需要转换成 JSX 可以接受的格式 ([649800a](https://github.com/NervJS/taro/commit/649800ade74d38fc79342780073f7735eeb8b5ff))
* **taroize:** 当 state/props 不是一个合法变量名时报错 ([e318812](https://github.com/NervJS/taro/commit/e318812d0c9f66ca889ae0436cba449c0d43e95d)), closes [#2532](https://github.com/NervJS/taro/issues/2532)
* **transformer:** idea 系内置终端某些情况会乱码，close [#2530](https://github.com/NervJS/taro/issues/2530) ([2cb97b9](https://github.com/NervJS/taro/commit/2cb97b9518cd68c60c78a25d538b75e28f4cc18a))
* **transformer:** 支持替换 jsx 中的属性名, close [#2077](https://github.com/NervJS/taro/issues/2077) ([443b1dc](https://github.com/NervJS/taro/commit/443b1dc459ce960f894d96c462742b06080b014a))
* **webpack-runner:** 修复h5.imageUrlLoaderOption失效的问题 ([abbe23e](https://github.com/NervJS/taro/commit/abbe23ecb52c675d6dfadf6342b142d451fc5e92))
* **webpack-runner:** 升级webpack,fix [#2539](https://github.com/NervJS/taro/issues/2539) ([e013892](https://github.com/NervJS/taro/commit/e013892622fac3136d1e5dc2313aa1ea4d1779f9))
* issue [#2534](https://github.com/NervJS/taro/issues/2534) ([418c6b2](https://github.com/NervJS/taro/commit/418c6b222ed2fcb5d71eea20f16b9695c9332ec7))
* onError 对应的生命周期应是 componentDidCatchError ([#2571](https://github.com/NervJS/taro/issues/2571)) ([abbe73f](https://github.com/NervJS/taro/commit/abbe73f6653a9b3d5db6e7fa588c903bfa49ae0d))


### Features

* **cli:** 去除页面默认标题 ([76344f0](https://github.com/NervJS/taro/commit/76344f025d67f16b97e63855cf2ca049aa89622a))
* **webpack-runner:** cssModules的module模式不再排除node_modules目录 ([c7f6a92](https://github.com/NervJS/taro/commit/c7f6a927cc6c56373ab2a25aea058acdc8530610))



## [1.2.21](https://github.com/NervJS/taro/compare/v1.2.20...v1.2.21) (2019-03-21)


### Bug Fixes

* **cli:** 修改云开发模板创建相关问题 ([8e234d8](https://github.com/NervJS/taro/commit/8e234d852031aa13e0f51b1fb39aa4ce3d2c4e7a))
* **h5:** 修复taro-h5 api列表不完整的问题 ([e496d2f](https://github.com/NervJS/taro/commit/e496d2f9b80d996ba38d0f8c201c3bd46ad7072e))
* **h5:** 修复了taro-h5的打包版本 ([275cdd6](https://github.com/NervJS/taro/commit/275cdd65353a62232d47becace87c44405cf26d5))
* **rn:** RN 应用名称默认从 package.json 的 name 字段获取 ([e0b8394](https://github.com/NervJS/taro/commit/e0b8394bc34f178f349699d34ea390dd98863a9b))
* **taro-components-rn:** Form: child.type 可能不存在 ([49480f9](https://github.com/NervJS/taro/commit/49480f97a874ba4479a42e8b9176f46d6edf2620))
* **taro-rn:** 修复安卓端 toast 弹窗无法显示图片的问题 ([aec990b](https://github.com/NervJS/taro/commit/aec990b77047c8d18fa274936877de35d6126bc8))
* **transformer:** if-else 当中有些变量不会加入 usedState ([b266ead](https://github.com/NervJS/taro/commit/b266ead00710a3dbc640c3d93aab6f279d184ad6))
* **transformer:** 只有 map 内部有 if-else 延时赋值匿名变量, close [#2524](https://github.com/NervJS/taro/issues/2524), ([645cda9](https://github.com/NervJS/taro/commit/645cda967ad03d37f006febf98a85641fc06399e)), closes [#2523](https://github.com/NervJS/taro/issues/2523)
* **types:** types of chooseImage ([#2472](https://github.com/NervJS/taro/issues/2472)) ([7be617e](https://github.com/NervJS/taro/commit/7be617e70c53e2365c5047523053c39ac41aee3d))
* **weapp:** 修复云开发 api 初始化 ([3e26a96](https://github.com/NervJS/taro/commit/3e26a96654e9ffef43f3ad2897889e26fa89c14a))


### Features

* **cli:** CLI 去除 expo，添加 react-native 的 packger server 启动 ([5150e59](https://github.com/NervJS/taro/commit/5150e59df61612359b61ccf39126fa06353c479f))
* **cli:** 模板中增加了wba插件的注释 ([2f39b8c](https://github.com/NervJS/taro/commit/2f39b8cab91c63ee79bd8765522b8c5027041071))
* **cli:** 跨平台开发方式支持目录判断 ([#2466](https://github.com/NervJS/taro/issues/2466)) ([84d0c3b](https://github.com/NervJS/taro/commit/84d0c3b5c77f0f66fe9055ac6a4e20d453b3aaa2))
* **cli router:** 支持在app.js的componentWillMount里使用this.$router ([3281851](https://github.com/NervJS/taro/commit/32818512feeffaaa39f7bbd23b1862691637a1e1))
* **cli router:** 现在支持在app.js里面调用navigateTo系列api了 ([20d026e](https://github.com/NervJS/taro/commit/20d026e04e661a5daccb970bc464ec859ea43472))
* **components:** 增加了navigator组件 ([b7362c0](https://github.com/NervJS/taro/commit/b7362c09182b2c63de9b1fca5a3609f330a2d85b))
* **components-rn:** 去掉 components-rn 的 expo 依赖 ([f29bf88](https://github.com/NervJS/taro/commit/f29bf889ce5a2a3506fe7e4da103abc63e5cf137))
* **components-rn:** 引入 @ant-design/react-native ([8397adf](https://github.com/NervJS/taro/commit/8397adf96fa67eb1e153fcaab62502dc82b86112))
* **components-rn:** 暴露 lib/provider ([e922160](https://github.com/NervJS/taro/commit/e922160914d3246470326af8ba7ecb6f0b831c8f))
* **docs:** 新增微信小程序云开发模板说明 ([667c6d2](https://github.com/NervJS/taro/commit/667c6d28a7a55a3fece2b92e0861d9a63bc9a77e))
* **h5 router:** 对齐this.$router参数 ([564b684](https://github.com/NervJS/taro/commit/564b6844c2e824efe50e474d86792f483411f61e))
* **rn:** RN 端支持使用 stylelint 进行样式校验 ([fdaa408](https://github.com/NervJS/taro/commit/fdaa408dbdd98e6c246d495bf94c39f2d6f12671))
* **rn:** RN 端添加编译时样式校验 close [#2251](https://github.com/NervJS/taro/issues/2251) ([0aadb7e](https://github.com/NervJS/taro/commit/0aadb7e4af1e7c2fe9baeb545abfb7e251cc355d))
* **rn:** 固定 react-native 版本 ([50a3ab3](https://github.com/NervJS/taro/commit/50a3ab357ebb8c2fa1a63419c8526b35200922fe))
* **rn:** 根节点嵌入组件提供的 provider ([7f4183c](https://github.com/NervJS/taro/commit/7f4183ce440a8be80cfafb109c5901d23d565f62))
* **router:** 增加了未找到页面组件的错误提示 ([aecac84](https://github.com/NervJS/taro/commit/aecac8463051d7bf4d93142c576d803b2b0a67bc))
* **router:** 尝试支持reLaunch ([67a5e85](https://github.com/NervJS/taro/commit/67a5e8506b1be994ca106c0881e55aaed76e1a6c))
* **taro:** 新增云开发 api 相关 d.ts 文件 ([04657c1](https://github.com/NervJS/taro/commit/04657c11187c287ed4eb92227d7de05160cadf3e))
* **taro:** 补充 getMenuButtonBoundingClientRect API，close [#2520](https://github.com/NervJS/taro/issues/2520) ([7384cfb](https://github.com/NervJS/taro/commit/7384cfb99be65985ea6ec5920f44305f6a6155de))
* **taro-components-rn:** 移植 ant-design-mobile-rn 的 Picker Modal Portal 等 ([c523077](https://github.com/NervJS/taro/commit/c523077e710fabb4813237eb1743474606005da7))
* **taro-rn:** 去除 RN 的 expo 依赖 ([eec6aa1](https://github.com/NervJS/taro/commit/eec6aa1f27d125dcf75ad8b8f5dcec56585f7cff))
* **taro-weapp:** 更新TabBar类型声明 ([#2465](https://github.com/NervJS/taro/issues/2465)) ([2672f89](https://github.com/NervJS/taro/commit/2672f891fc4e523c441d845604a93537c30a5cf4))
* **transformer:** 当循环中使用 key 作为键值时给予修改建议 ([1b8ddc7](https://github.com/NervJS/taro/commit/1b8ddc7bdc9030aaeaa866e71577f40f59829465)), closes [#2492](https://github.com/NervJS/taro/issues/2492)
* **webpack-runner:** 调整代码逻辑,增加了一些测试用例 ([f98c146](https://github.com/NervJS/taro/commit/f98c14631af5770ed7038f69112d619cbb0f7716))



## [1.2.20](https://github.com/NervJS/taro/compare/v1.2.19...v1.2.20) (2019-03-17)


### Bug Fixes

* **webpack-runner:** 修复esnextModules的判断错误 ([995010a](https://github.com/NervJS/taro/commit/995010a8c09bafc806b912980fd71a8337f2bf66))
* **webpack-runner:** 移除singleton配置 ([eac53f5](https://github.com/NervJS/taro/commit/eac53f5278b1af199cd257b18726ad50981fe9e2))



## [1.2.19](https://github.com/NervJS/taro/compare/v1.2.18...v1.2.19) (2019-03-15)


### Bug Fixes

* **redux-h5:** package.json中补充缺失的文件 ([bd8ac45](https://github.com/NervJS/taro/commit/bd8ac45c06849b66dd314d1a73436ac27ae4df08))
* **webpack-runner:** 修改了版本说明 ([c288a45](https://github.com/NervJS/taro/commit/c288a45ae4e2774a686195370b043e0ef2f6ae94))



## [1.2.18](https://github.com/NervJS/taro/compare/v1.2.17...v1.2.18) (2019-03-15)


### Bug Fixes

* **cli, h5:** 修复PureComponent中获取不到$router和$app的问题. fix [#1857](https://github.com/NervJS/taro/issues/1857) ([b8b81f6](https://github.com/NervJS/taro/commit/b8b81f631247d29247b5824adb1fa5ff84879c82))
* **components:** 修复 ScrollView scrollTop 空字符串问题 ([c989470](https://github.com/NervJS/taro/commit/c98947012b158592a58e7666368ecaa1c0e32de7))
* **components:** 修复 ScrollView 组件更新判断问题 ([5e70801](https://github.com/NervJS/taro/commit/5e7080179d50cfae6abb19c0e85fdec32c45d69f))
* **components:** 修复某些情况下后退不显示tabbar的问题 ([b520dfb](https://github.com/NervJS/taro/commit/b520dfb48dff141246fb1319ac0088beb39fa398))
* **components:** 回退 scrollView ([e91c2c5](https://github.com/NervJS/taro/commit/e91c2c5ed8d7c07868980e41c7cb9d2a55967cda))
* **h5:** 修复modal在跳转后不隐藏的问题, fix [#2364](https://github.com/NervJS/taro/issues/2364) ([491aed8](https://github.com/NervJS/taro/commit/491aed8bd0666a7ded95957345cc076d1d6807c5))
* **rn:** 兼容 PureComponent 的写法 ([2f12f2b](https://github.com/NervJS/taro/commit/2f12f2b19d6d6b2a18515dbbdf81d54653059ea6))
* **rn:** 在页面中设置navigationBarTitleText，rn模式下无效 close [#2420](https://github.com/NervJS/taro/issues/2420) ([9b10f09](https://github.com/NervJS/taro/commit/9b10f09d694929579e5c845a0f3e1fbd1aa306d1))
* **router:** 修复ios9下不执行render的问题 ([81cc636](https://github.com/NervJS/taro/commit/81cc6365c71588aaab5a2e7c9441d6c8f85128bd))
* **router:** 修复跳转第三方网站时多出一条历史记录的问题 ([2b65bc7](https://github.com/NervJS/taro/commit/2b65bc765891ecb73ff320f4ac26347818e2655b))
* **taro-alipay:** 修复支付宝小程序 request 请求对低版本小程序运行时兼容性问题 ([8a9348c](https://github.com/NervJS/taro/commit/8a9348c6bf3ecd7226e2b8d84cc088c1c34bf806))
* **taro-components:** fix scroll-view upper/lowerThreshold default value & get value issue ([a2ddb30](https://github.com/NervJS/taro/commit/a2ddb3045802565a9bfef604c90adcebe2050ef9))
* **taro-h5:** 修复了taro-h5的测试用例 ([90d2f44](https://github.com/NervJS/taro/commit/90d2f4468b21f08bb40eb472e1577cfe9848324f))
* **transformer:** if-else 数量大于 2 时解析错误，close [#2415](https://github.com/NervJS/taro/issues/2415) ([abbfc34](https://github.com/NervJS/taro/commit/abbfc348114751ce77fe109c92b5a567a79e7e3d))
* **webpack-runner:** 修复webpack-runner无法通过编译的问题 ([fd3f9d7](https://github.com/NervJS/taro/commit/fd3f9d7615a5d8d35410b9b905fe354eb02e032d))
* **webpack-runner:** 尝试解决H5的FOUC问题, fix [#1680](https://github.com/NervJS/taro/issues/1680) ([3c1af2f](https://github.com/NervJS/taro/commit/3c1af2f1e321da2abf530f57e0d0e1ea49de4bfe))
* **webpack-runner:** 移除了webpack配置项,并补全文档 ([5a90559](https://github.com/NervJS/taro/commit/5a905594ee1ddccadde12607e748c2f4f57cfcdd))
* **webpack-runner:** 解决esnextModules匹配不准确的问题 ([555e82d](https://github.com/NervJS/taro/commit/555e82d78cd8f1bdc438be7788444530439ba8a5))
* **with-weapp:** 当 this.$router.params 没有值时赋一个空对象， close [#2234](https://github.com/NervJS/taro/issues/2234) ([43eb400](https://github.com/NervJS/taro/commit/43eb400fbe4093542865e2e78608bc5b6b68aa44))


### Features

* **api:** 新增小程序云开发api ([1e64b83](https://github.com/NervJS/taro/commit/1e64b838546e56b944ce27b7b48ebff28438a504))
* **babel-plugin-transform-taroapi:** 加入taroapi转换插件 ([e90efdf](https://github.com/NervJS/taro/commit/e90efdf4e78172b09567f8b13969fdc3ad62a3f4))
* **babel-plugin-transform-taroapi:** 防止多次运行时对Taro变量的错误处理 ([15bc392](https://github.com/NervJS/taro/commit/15bc392740c32f41ff51755e405c962f76f536c8))
* **cli:** 新增小程序云开发模板 ([b319899](https://github.com/NervJS/taro/commit/b31989950f15cae31f6c5fc04350f05c053145c4))
* **cli:** 新增模板选项 ([575d47c](https://github.com/NervJS/taro/commit/575d47c76dcf608e1b2ffc4e689744c6d30a143d))
* **component h5 router:** 支持switchTab Api ([a1e4dee](https://github.com/NervJS/taro/commit/a1e4dee65562c60e557c3ffc3f545875977095f5))
* **components:** 新增了更多tabbar api的支持 ([aea65dd](https://github.com/NervJS/taro/commit/aea65dd210234b807204a1c6111410cc2caf73b1))
* **rn:** 优化 RN 端跨平台开发方式 ([a1a74b9](https://github.com/NervJS/taro/commit/a1a74b91195a468cdb09d77c8f99933635d159e7))
* **router:** 修改router的打包配置 ([8b1a743](https://github.com/NervJS/taro/commit/8b1a7432cc1b06057fdec1e4243f983b29684260))
* **taro-components:** 完善 CoverView 的类型定义 ([#2436](https://github.com/NervJS/taro/issues/2436)) ([4c4f0bd](https://github.com/NervJS/taro/commit/4c4f0bd8e806e098053890edcb6694a1f4b60a16))
* **taro-components:** 精简依赖,移除urijs ([531110b](https://github.com/NervJS/taro/commit/531110b9748a968fb96d6b71695f773d9e03c9ac))
* **taro-h5:** taro-h5打包模式修改 ([c0e73b3](https://github.com/NervJS/taro/commit/c0e73b37ea9e8670dd4054be52451bc9f0880292))
* **webpack-runner:** 去除了buildDll流程,fix [#1800](https://github.com/NervJS/taro/issues/1800) ([a95f600](https://github.com/NervJS/taro/commit/a95f6001199597673da84d63e990e410bde76f16))
* **webpack-runner:** 将taro-h5移出dll ([9efda3c](https://github.com/NervJS/taro/commit/9efda3c764c2625d04007d96db54d9ed9ca48190))
* **webpack-runner:** 支持taro-h5 treeshaking ([b54964b](https://github.com/NervJS/taro/commit/b54964b23a431ae1f5766a8ddbb2b61f0580c98e))



## [1.2.17](https://github.com/NervJS/taro/compare/v1.2.16...v1.2.17) (2019-03-11)


### Bug Fixes

* **cli:** 修复使用 require 读取 json 文件失败的问题 ([f549f53](https://github.com/NervJS/taro/commit/f549f5331c524a9c8d55aa95365d5607e3667790))
* **router:** 修复了redirect之后页面生命周期错误触发的问题, fix [#2388](https://github.com/NervJS/taro/issues/2388) ([1350b36](https://github.com/NervJS/taro/commit/1350b367caad7422e1a9db13b712054b2fc46d80))
* **taro-components-rn:** react natvie 引用 swiper 组件 报错 undefined is not an object (evaluating 'style.height'), fix [#2301](https://github.com/NervJS/taro/issues/2301) ([7175c03](https://github.com/NervJS/taro/commit/7175c03fe4b66f54871804e2d6a252a71ab5c291))
* **taroize:** 支持事件名有一个冒号 `:`的写法，close [#2389](https://github.com/NervJS/taro/issues/2389) ([a0806c5](https://github.com/NervJS/taro/commit/a0806c5154f4984f10b702af494b645623b25672))
* **with-weapp:** h5 无法触发 triggerEvent，使用 lerna 自动同步依赖, ([5ce8358](https://github.com/NervJS/taro/commit/5ce83585299ec46168024044aeaf4852eb5f414f)), closes [#2383](https://github.com/NervJS/taro/issues/2383)


### Features

* **cli:** 优化跨平台开发方式 ([4ff9521](https://github.com/NervJS/taro/commit/4ff9521c80b14dd35ba5ddf5f66cd33de9ce29d1))
* **components:** 重构 ScrollView 组件。 ([23624e8](https://github.com/NervJS/taro/commit/23624e8bca28468399a7aa405a50e41835d55079))



## [1.2.16](https://github.com/NervJS/taro/compare/v1.2.15...v1.2.16) (2019-03-06)


### Bug Fixes

* **cli:** cannot find module 'fbjs/lib/keyMirror'  close [#2121](https://github.com/NervJS/taro/issues/2121) ([1c324b0](https://github.com/NervJS/taro/commit/1c324b01ea193160f1ce966c2910badbabdeb6a9))
* **components:** 修复 picker 异步数据更新问题, 选中值状态问题。 close [#2343](https://github.com/NervJS/taro/issues/2343) , close [#2253](https://github.com/NervJS/taro/issues/2253) ([1b1bb32](https://github.com/NervJS/taro/commit/1b1bb324a546f8e4bc92a9cf8ecb09c14d7421bb))
* **taro:** my.getStorageSync，预览和调试结果返回不一致 ([#2317](https://github.com/NervJS/taro/issues/2317)) ([074ecc0](https://github.com/NervJS/taro/commit/074ecc08b1f4d7930870d6d98f9597020691ef90))
* **taro-components:** 完善 PickerView 的类型定义 ([#2333](https://github.com/NervJS/taro/issues/2333)) ([3165682](https://github.com/NervJS/taro/commit/3165682cb3fe7f711a9d3ee7dffc9d604fa7bd8d))
* **taro-weapp/tt:** 数组 diff 逻辑更改 ([2f82f0c](https://github.com/NervJS/taro/commit/2f82f0c7aaab7932761c86cd7ac4d21c67c04808))
* **taroize:** class properies 函数不能使用 arguments，close [#2295](https://github.com/NervJS/taro/issues/2295) ([f62bb85](https://github.com/NervJS/taro/commit/f62bb85d0e680757ca0b86f3790c7fc86e51847a))
* **taroize:** 事件名需传入有效的 JavaScript 变量名，close [#2277](https://github.com/NervJS/taro/issues/2277) ([41d3fba](https://github.com/NervJS/taro/commit/41d3fba05d9b8d93ba2b162f13ad3e4c54e964e2))
* **transformer:** 修复多重 if 嵌套的问题 ([5e0bf68](https://github.com/NervJS/taro/commit/5e0bf68e9529adbc0dd22cbad80c85c6abfed248))
* **transformer:** 单层 if 表达式被当成嵌套 if 表达式解析 ([d8a9cee](https://github.com/NervJS/taro/commit/d8a9cee6676c79d3b114953b3a3868736d88bda8))
* **transformer:** 循环中有 if-else 时生成匿名表达式位置错误，close [#2352](https://github.com/NervJS/taro/issues/2352) ([b200a70](https://github.com/NervJS/taro/commit/b200a70b0caeb87e1b07d52329e9e1c4edcf92d5))
* onColumnChange event.detail.value 应该是下标 ([79eaf17](https://github.com/NervJS/taro/commit/79eaf17121d0c1ab1bd2c4b9906bd266b5f17d51))
* taro info rn 卡住的 bug ([a3e5377](https://github.com/NervJS/taro/commit/a3e537706e5fdd3aa231e4400db9ab10fabc112c))


### Features

* **eslint:** 内置组件名判断支持匿名类 ([9ed38a9](https://github.com/NervJS/taro/commit/9ed38a95519b59e91ea0f48634ba93731752c023))
* **taro-components-rn:** 增加 WebView, close [#2336](https://github.com/NervJS/taro/issues/2336) ([b9db564](https://github.com/NervJS/taro/commit/b9db564b18ccaee9db1e318431e1f96420860cb9))
* **taro-weapp/h5/alipay/swan/h5:** 为 Taro.request 添加拦截器，close [#1976](https://github.com/NervJS/taro/issues/1976) ([5181a41](https://github.com/NervJS/taro/commit/5181a41d760dff555336b656172b0b2574772259))



## [1.2.15](https://github.com/NervJS/taro/compare/v1.2.14...v1.2.15) (2019-02-27)


### Bug Fixes

* **cli:** 压缩js bugfix ([#2267](https://github.com/NervJS/taro/issues/2267)) ([fd83405](https://github.com/NervJS/taro/commit/fd834050b02bd52f883616fa40e1f1468e4932ef))



## [1.2.14](https://github.com/NervJS/taro/compare/v1.2.13...v1.2.14) (2019-02-25)


### Bug Fixes

* **cli:** configDir引入前置导致config/index获取process.env.NODE_ENV为undefined.模板为例子,配置只输出production环境 ([#2211](https://github.com/NervJS/taro/issues/2211)) ([fe8c12e](https://github.com/NervJS/taro/commit/fe8c12ee240f8294a52e48686b0124eb0beac974))
* **cli:** 低版本的 node 8 无法在 vm 中使用 ...spread 语法 ([9e0d352](https://github.com/NervJS/taro/commit/9e0d352c3ca89f651e0b2d222b254dccf39aea10))
* **cli:** 修复 watch 时对入口文件的判断 ([aa9e657](https://github.com/NervJS/taro/commit/aa9e657919b32f4501efc2f7232bd2bfa143beb9))
* **cli:** 修复将 node_modules 中的文件当成普通文件重复编译的问题 ([2323266](https://github.com/NervJS/taro/commit/23232661cb884555994832b21e6614bbabb20c5d))
* **cli:** 修改 tsconfig.json 默认模版，完善 config-detail/alias 部分文档 ([#2219](https://github.com/NervJS/taro/issues/2219)) ([02cf7d3](https://github.com/NervJS/taro/commit/02cf7d3fdff1d43d6175dec0a2035beb2986c0be))
* **docs:** tutorial.md componentWillUnmount ([#2193](https://github.com/NervJS/taro/issues/2193)) ([2ecff34](https://github.com/NervJS/taro/commit/2ecff34bfb3dcc5b6a7424cd8be89eef8fd1b8f9))
* **taro-components-rn:** scrollview 横向 ([b1e610d](https://github.com/NervJS/taro/commit/b1e610dd737dbaa78bec72d6b3dc25b9e38fae66))
* **taro-components-rn:** view 绑定 clickable 时不再套一层 view 以避免样式拆分导致的样式错误，fix [#2205](https://github.com/NervJS/taro/issues/2205) ([01f069c](https://github.com/NervJS/taro/commit/01f069c34e492001f141afb9544d7e1d3a567880))
* **taro-weapp:** didUpdate 后需要更新循环 ref ([06a5999](https://github.com/NervJS/taro/commit/06a5999a2ca44540d07c4e6985abfa6d056242a0))
* **taro-weapp:** 微信小程序循环 ref 在更新时逻辑优化 ([449bdf1](https://github.com/NervJS/taro/commit/449bdf1e9dd15aaf0df7fefb71f748428cf46822))
* **taroize:** 通过 this.onLoad 的形式调用生命周期也需要转换为对应的生命周期函数，close [#2183](https://github.com/NervJS/taro/issues/2183) ([4b75433](https://github.com/NervJS/taro/commit/4b754336a8b4fc916217a5e902944eb692eb08f5))
* **transformer:** 当本地变量和循环变量冲突时警告，但仍然把本地变量加入 usedState 和 pendingState, [#2199](https://github.com/NervJS/taro/issues/2199) ([a637ca5](https://github.com/NervJS/taro/commit/a637ca55dc3ce38e668aaab7d5d4ebb752cb9b09))
* **transformer:** 当用户没有指名循环的 index 时自动增加一个一个匿名的 index 作为变量名覆盖。fix [#2258](https://github.com/NervJS/taro/issues/2258) ([704a655](https://github.com/NervJS/taro/commit/704a655881c2eb8d1a912c933c91e1939275d102))
* **transformer:** 运行 loop ref 的参数默认值为 true ([8da65f9](https://github.com/NervJS/taro/commit/8da65f9e2519e064a9a0d88c1f940b7f560c2dc4))
* **transformer:** 限定运行循环 ref 的条件，[#2194](https://github.com/NervJS/taro/issues/2194) ([3b146c8](https://github.com/NervJS/taro/commit/3b146c8c59a3d3dc6aadb0321fa5e00dbab4199c))
* **with-weapp:** 修复 taroize 转换后组件事件调用 this.triggerEvent 无法触发的问题 ([207bcdf](https://github.com/NervJS/taro/commit/207bcdfcbb0fa7bfeced61e2ac4fbefe099a31e7))


### Features

* **cli:** 新增项目配置文件可以放入sourceDir，兼容一项目多程序配置 ([#2023](https://github.com/NervJS/taro/issues/2023)) ([1c4cc6f](https://github.com/NervJS/taro/commit/1c4cc6fa382aab30473737b46623f4d28b1dcb4d))
* **components:** 暂时增加空的 Canvas,  Navigator 组件，防止 H5 转换报错 ([035fd49](https://github.com/NervJS/taro/commit/035fd491871e859c7a2aefb269a72a1c65e27a50))
* **transformer:** 支持在循环中使用 switch-case ([586700e](https://github.com/NervJS/taro/commit/586700e5b35fbc20c5fea74fc311bbccfc8d32ee))
* **transformer:** 支持在循环中定义 JSX 变量并使用 if-else 赋值 ([495f7f5](https://github.com/NervJS/taro/commit/495f7f5b79d17a9a68b46f70cf2a9c7bb76d7874))



## [1.2.13](https://github.com/NervJS/taro/compare/v1.2.12...v1.2.13) (2019-02-14)


### Bug Fixes

* **cli:** 修复 H5 编译 JSX 属性值为中文时转义问题 ([e718d5e](https://github.com/NervJS/taro/commit/e718d5e1810dd5fb23e31398c9ec67cf21afb2c3))
* **components:** input { text-align: inherit } ([#2101](https://github.com/NervJS/taro/issues/2101)) ([cd8c4e3](https://github.com/NervJS/taro/commit/cd8c4e329e1422be6d1c8f2c873ee784ffd9e785))
* **taro-cli:** fix taro cli default clean path ([#2130](https://github.com/NervJS/taro/issues/2130)) ([ddfb51c](https://github.com/NervJS/taro/commit/ddfb51ca6aa6ea568a60f26d5c369b7b934334c2))
* **taro-cli:** 符号链接+Alias导致源代码文件被意外修改 ([#2176](https://github.com/NervJS/taro/issues/2176)) ([d88c7ed](https://github.com/NervJS/taro/commit/d88c7edfa91f7bace5e8ad02e42699d59dad9fa5))
* **taro-components:** fix richText component ([#2131](https://github.com/NervJS/taro/issues/2131)) ([dd6c722](https://github.com/NervJS/taro/commit/dd6c7224749e3aa4e75940807f93999dc7dad18d))
* **taro-rn:** pxTransform 计算错误 ([b80b0f9](https://github.com/NervJS/taro/commit/b80b0f91f3d16097d2932d25f2ac38cb13a45799))
* **taro-router-rn:** navigateBack 增加默认参数 ([#2132](https://github.com/NervJS/taro/issues/2132)) ([7f52af0](https://github.com/NervJS/taro/commit/7f52af0ac6d7f6499e2eb7836bf995c71cb8269d))
* **taro-router-rn:** 页面根节点 height: 100% 无效 ([97433a5](https://github.com/NervJS/taro/commit/97433a560a5b876f60e52fdf0d9524d3e9277da4))
* **taroize:** 只有初次调用才需要清空已使用组件 ([b265628](https://github.com/NervJS/taro/commit/b2656284f9cd5233817686971e7d55b81234453f))
* **transformer:** 直接写 JSX 循环在三元表达式循环中会生成匿名表达式 ([b5bee56](https://github.com/NervJS/taro/commit/b5bee56f28b99a7a66d0e1b6cb4e0c622ef30503))
* **transformer-wx:** 修复 H5 编译环境变量错误的问题 ([9b8d3c6](https://github.com/NervJS/taro/commit/9b8d3c65319cf0b04d219d19b9add53b249350d4))
* **with-weapp:** this.data 同样可以访问到 this.properties ([9f45ab3](https://github.com/NervJS/taro/commit/9f45ab3108c12c9df753c9cdbfcde84ef757c1ba))
* **with-weapp:** triggerEvent 直接调用 super.$scope.triggerEvent ([bb56f91](https://github.com/NervJS/taro/commit/bb56f91e3ba585227ea689a3cd6dee2755cad707))


### Features

* **components:** 增加一个空的 OpenData 组件，防止使用 taro-ui 打包报错 ([6e6cd8f](https://github.com/NervJS/taro/commit/6e6cd8f58aa6d16bb2f31e109e90e1626f8e7fe1))
* **taro-components-rn:** 支持 Video 参数 initialTime 传字符串型数字，close [#1997](https://github.com/NervJS/taro/issues/1997) ([65f786c](https://github.com/NervJS/taro/commit/65f786c6065b7983d616f4c07ca881573cc89c16))



## [1.2.12](https://github.com/NervJS/taro/compare/v1.2.11...v1.2.12) (2019-01-30)


### Bug Fixes

* **cli:** 去掉一个多余的unescape行为 ([1f510a1](https://github.com/NervJS/taro/commit/1f510a16ff98b839ce2f9446337fcadd3d1b8d39))
* **components:** 在sideEffects中标记样式文件 ([1bf341c](https://github.com/NervJS/taro/commit/1bf341ccd324606b80472d5cec30edd78dfcdfd6))
* **router:** 修复页面生命周期重复触发的问题 ([d6c7606](https://github.com/NervJS/taro/commit/d6c76060b54fedac5ee1d17e9b4963fc64b35a92))



## [1.2.11](https://github.com/NervJS/taro/compare/v1.2.10...v1.2.11) (2019-01-29)


### Bug Fixes

* **cli:** 修改模板 babel 配置，默认开启 h5 tree shaking ([2282083](https://github.com/NervJS/taro/commit/2282083e3595669c482336bb8ddd14953664fc9f))
* **components:** 修复 Swiper 引入问题 ([e1adb3c](https://github.com/NervJS/taro/commit/e1adb3c421c4327e2f313a2e34b3aa45f2153e47))
* **transformer:** 应该先 prettify wxml 再替换小于号 ([cdf3cbd](https://github.com/NervJS/taro/commit/cdf3cbdeee418b1afbd9421c40a482e8ba854d66))
* **webpack-runner:** taro内部模块的样式固定使用style-loader ([689ecc9](https://github.com/NervJS/taro/commit/689ecc9f2000094b509bc965e911d97e133aad80))
* **webpack-runner:** 配置包名兼容 windows ([a1feff1](https://github.com/NervJS/taro/commit/a1feff142f63697a703d9f2ae5dd573b41c571b8))



## [1.2.10](https://github.com/NervJS/taro/compare/v1.2.9...v1.2.10) (2019-01-29)


### Bug Fixes

* **index:** 修复Swiper 失效问题 ([f9c6dfd](https://github.com/NervJS/taro/commit/f9c6dfd45e7366bf2b2f0cf2918e89804b0de1f3))
* **transformer:** 在 if block 中的循环匿名变量不需要加入全局变量 ([592d053](https://github.com/NervJS/taro/commit/592d0538e5d4579f5f4715cef453b570ee340450))
* **webpack-runner:** 补充file-loader ([65bd42d](https://github.com/NervJS/taro/commit/65bd42da2d80caa1a186ec11932093007fbb5179))
* **webpack-runner:** 默认针对 @tarojs/components 进行编译处理 ([68d7208](https://github.com/NervJS/taro/commit/68d7208881973171d0037160f4ee702a40879b08))


### Features

* **index:** 新增 Swiper 兼容两端距离 ([eeae33f](https://github.com/NervJS/taro/commit/eeae33fcd4cc8d20b0d121251b787c8ed9a00a1e))
* **taro:** api 调整 ([e8d73dd](https://github.com/NervJS/taro/commit/e8d73dd1807071dd4cbab7ca2fab6a5597ba014b))
* **taro:** 增加 chooseMessageFile、compressImage APIs。fix [#2066](https://github.com/NervJS/taro/issues/2066) ([1edb0ba](https://github.com/NervJS/taro/commit/1edb0bad941aec691884d46087ae3c7fd82906d7))
* **webpack-runner:** h5端支持main:h5 mainfield ([7e6cc94](https://github.com/NervJS/taro/commit/7e6cc949ea4f2db340fb856591ed36bee17927ca))



## [1.2.9](https://github.com/NervJS/taro/compare/v1.2.8...v1.2.9) (2019-01-28)


### Bug Fixes

* **cli:** copy 文件时，源文件与目标位置相同时报错 ([3a9cbe8](https://github.com/NervJS/taro/commit/3a9cbe8bbe90cc5935fb4ec7640ec22e4d1f9044))
* **components:** Picker 为 mode = date 属性 start与end 配置无效 close [#2020](https://github.com/NervJS/taro/issues/2020) ([25b7d43](https://github.com/NervJS/taro/commit/25b7d430d18cc72316bfc97dc065bbe92ad9ff8e))
* **components:** 修复 Picker 组件返回值问题 ([d1d965b](https://github.com/NervJS/taro/commit/d1d965b34ed888c0cd19918bf39b31b37aa6015a))
* **components:** 修复 RichText className 属性问题 close [#2013](https://github.com/NervJS/taro/issues/2013) ([c2c28ea](https://github.com/NervJS/taro/commit/c2c28ea06d6ef9ecfced6bd24158ecf937994a23))
* **components webpack-runner:** components打包问题修复 ([d0f5732](https://github.com/NervJS/taro/commit/d0f57326336f1128ff97624640fd031ab0ddbfc7))
* **mobx-common mobx-h5:** 增加编译代码 fix [#2017](https://github.com/NervJS/taro/issues/2017) ([82ffd4a](https://github.com/NervJS/taro/commit/82ffd4ac6717419161cae25a297797d57d140fb5))
* **router:** 修复redirect到相同path时不渲染的问题 ([7cfd45b](https://github.com/NervJS/taro/commit/7cfd45b37aa263837d5cd140a90ea71867603ee1))
* **taro:** componentWillUnmount 方法中无法获取navigateTo传入的参数，close [#2040](https://github.com/NervJS/taro/issues/2040) ([fe9fdca](https://github.com/NervJS/taro/commit/fe9fdcab1815909c97edf9b9e7ac92e4dd0fb66d))
* **taro-components:** 修复 picker date，start end 无效 ([6c6b244](https://github.com/NervJS/taro/commit/6c6b244d921b27a21106becd3ca5a8e5235985ab))
* **taro-h5:** API createAnimation 挂载到 Taro 对象上 ([ef2309b](https://github.com/NervJS/taro/commit/ef2309bbb347facd32c0b00cb85f68480ed63843))
* **taro-swan/taro-tt:** 百度和头条 properties 的 value 值设置成对应 defaultProps 的值，避免 null 值覆盖 initData 值 ([1c79db3](https://github.com/NervJS/taro/commit/1c79db3c4519dc2528a487644312402b546b47e5))
* **taro-tt:** 修复字节跳动小程序同步获取自定义组件实例的问题 ([#2029](https://github.com/NervJS/taro/issues/2029)) ([e168d2d](https://github.com/NervJS/taro/commit/e168d2d615c41fe7e5dc0a0116332f238e6e02bc))
* **transformer:** 匿名函数 stopPropagation 无效 ([81455f5](https://github.com/NervJS/taro/commit/81455f516b289a05bb674d76d5512e8f63f1eca2))
* **transformer:** 循环中自动的生成类型防御找不到值，fix [#2037](https://github.com/NervJS/taro/issues/2037) ([27234e1](https://github.com/NervJS/taro/commit/27234e14e5509e2ade69c87d8a2d891c4ec1a3f5))
* **webpack-runner:** 优先从项目根目录寻找依赖 避免重复打包 ([e05b79f](https://github.com/NervJS/taro/commit/e05b79f2c1c0a9e3463a7a6f637c417d20a3edba))


### Features

* **cli:** compile exclude 可以排除文件夹, close [#1830](https://github.com/NervJS/taro/issues/1830) ([2b0e999](https://github.com/NervJS/taro/commit/2b0e9995d0e41abb27893c2c1e260c403eb0e9ab))
* **cli:** 支持自定义 tabbar，close [#2011](https://github.com/NervJS/taro/issues/2011) ([4d77930](https://github.com/NervJS/taro/commit/4d77930b097aed26e04fdf1f4ac5342b78c659cf))
* **CLI:** 添加 taro info rn 的命令 ([c6c6d75](https://github.com/NervJS/taro/commit/c6c6d7557444b1d1e2a568c81f6ff499ef7fc3ba))
* **components:** 新增 WebView 组件 close [#2018](https://github.com/NervJS/taro/issues/2018) ([fd57e13](https://github.com/NervJS/taro/commit/fd57e13e8f5adf99301892eb3cb9b1b7632c2827))
* **components:** 调整了components的打包策略 ([c85f0f4](https://github.com/NervJS/taro/commit/c85f0f4bfb5d644de24395e50334a065c85418aa))
* **eslint:** state/props 重名支持解析结构的情况 ([12b6715](https://github.com/NervJS/taro/commit/12b671591c83c6c413d2da6f477d6bd8e89f0150))
* **eslint:** 新规则：this.props 和 this.state 的键值不能重名，close [#1996](https://github.com/NervJS/taro/issues/1996) ([e8dc1cc](https://github.com/NervJS/taro/commit/e8dc1cc5ce8cf25c2e711a18c631c006b1ac5963))
* **rn:** 新增deviceMotion，accelerometer两个API ([6bef8f0](https://github.com/NervJS/taro/commit/6bef8f07ec8fae34f347bd4d68d60ba955221fdc))
* **taro-h5:** createAnimation API 去除不必须信息 ([3a1a891](https://github.com/NervJS/taro/commit/3a1a8913af392d4e1277f66e02278460cec8212b))
* **taro-h5:** 添加createAnimation接口 ([466c16d](https://github.com/NervJS/taro/commit/466c16dc16c6420bd1d82a695762699c9a722193))
* **transformer:** 事件传参支持使用匿名函数 ([961b009](https://github.com/NervJS/taro/commit/961b009b76e0c2c959c5301b72f6e9dae1049ca3))
* **transformer:** 支持在循环中使用 if，close [#1331](https://github.com/NervJS/taro/issues/1331) ([09979cb](https://github.com/NervJS/taro/commit/09979cbcb263ff801070879a04f89dcaab8851fd))
* **webpack-runner:** 支持修改dll的文件名 ([438e1f3](https://github.com/NervJS/taro/commit/438e1f3730927ca8541de496ee60861fd7041c82))
* **webpack-runner:** 现在components可以具有treeshaking优化了 ([9af11fa](https://github.com/NervJS/taro/commit/9af11fa2da19f1097ab026849ecaad4b6a4027d7))
* **with-weapp:** 支持 triggerEvent，close [#1983](https://github.com/NervJS/taro/issues/1983) ([c4fc12d](https://github.com/NervJS/taro/commit/c4fc12dd076b9cd5443ada051a7b67a95b32c312))



## [1.2.8](https://github.com/NervJS/taro/compare/v1.2.7...v1.2.8) (2019-01-21)


### Bug Fixes

* **cli:** mobx typescript 模板报错, fix [#1975](https://github.com/NervJS/taro/issues/1975) ([9d64e98](https://github.com/NervJS/taro/commit/9d64e98e779c7951d1a69aac9efd1666ffc259d4))
* **components:**  修复滑动到每一列第一项无法触发onColumnchange close[#1955](https://github.com/NervJS/taro/issues/1955) ([1e8cb56](https://github.com/NervJS/taro/commit/1e8cb5690a1911d7084aebdcd68beece7e2d26bf))
* **components:** 修复 Picker 默认字体问题 close [#1718](https://github.com/NervJS/taro/issues/1718) ([c64a97a](https://github.com/NervJS/taro/commit/c64a97af5865ea3ee53726531243441a3a709a50))
* **components:** 修复 Switch 不受控问题 clsoe [#1794](https://github.com/NervJS/taro/issues/1794) ([434daa5](https://github.com/NervJS/taro/commit/434daa57a37d20c57925e0b1cb7a0a409d471a4c))
* **components:** 修复tabbar可能不展示的问题 ([14a5594](https://github.com/NervJS/taro/commit/14a559435dd11cd6bddf627bc49a88ac41fc44b4))
* **mobx:** 1.2.7 mobx-h5 丢失文件 ([6a95553](https://github.com/NervJS/taro/commit/6a9555372cabb46c0079ee9ae9adbe19d3abf657))
* **mobx:** 修复rn端文件丢失问题 ([#1949](https://github.com/NervJS/taro/issues/1949)) ([d12ce03](https://github.com/NervJS/taro/commit/d12ce03c1d7e23c66ed5c7b8bf9c48411c2f39c0))
* **RN:** 路径别名配置字段错误 ([#1939](https://github.com/NervJS/taro/issues/1939)) ([25c9871](https://github.com/NervJS/taro/commit/25c98716b7c7aa7663874a33e86d6ad04fc3c24c))
* **router:** 去除了一些可能导致报错的es6+调用 ([bd53b6f](https://github.com/NervJS/taro/commit/bd53b6f343ad868f81c233f060830e439537fddf))
* **taro-alipay:** setData 触发的 didUpdate 与 props 改变触发的 didUpdae 有可能会被小程序合并，所以判断条件需要更新 ([1b4e49e](https://github.com/NervJS/taro/commit/1b4e49ee93d255dba9377548d927fe31375d819c))
* **taro-alipay:** 支付宝 ref 逻辑修复 ([16904a4](https://github.com/NervJS/taro/commit/16904a4bba897a1c36de935698599bb30d3aec31))
* **taro-alipay:** 支付宝 ref 逻辑更新 ([3bfb315](https://github.com/NervJS/taro/commit/3bfb3150a53c4f36f65d2cd4aa6b138d9fa24f87))
* **taro-components:** 修复 Picker 组件 Mode 为 date 时的选择区间问题 close [#1911](https://github.com/NervJS/taro/issues/1911) ([851a939](https://github.com/NervJS/taro/commit/851a939cf4cb5764e8973c9d1bee9451b7a295b5))
* **transformer:** 小于号多次使用或在 production 模式中没有被替换 ([2eedf6c](https://github.com/NervJS/taro/commit/2eedf6c67fc2efc9f60c02c08e05173a81bff0e2))
* **transformer:** 循环的 callee 在 if 中不需要更名，fix [#1933](https://github.com/NervJS/taro/issues/1933) ([fddcec5](https://github.com/NervJS/taro/commit/fddcec5fd6ce101fb5e74daea066117c16bd149a))
* **types:** 消息机制 Events 取消所有事件的函数声明 ([#1940](https://github.com/NervJS/taro/issues/1940)) ([c430165](https://github.com/NervJS/taro/commit/c430165edb2a0fad831f65c0794228542222c148))


### Features

* **cli:** 增加 weapp.compile.compressTemplate 来决定打包是否需要压缩 wxml ([15b3cd8](https://github.com/NervJS/taro/commit/15b3cd89138c19f3af598c9d3baff058e4223b56))
* **router:** 增加了esm打包 ([8902132](https://github.com/NervJS/taro/commit/8902132e23bcfe833ad6a96b0fadb70d475ee80b))
* **taro-components:** picker date month 区间选择问题 ([70fe933](https://github.com/NervJS/taro/commit/70fe933fbac24f592eb003b8bebf81987b2bcadc))
* **transformer:** 支持枚举条件渲染, close [#1901](https://github.com/NervJS/taro/issues/1901) ([28ccca0](https://github.com/NervJS/taro/commit/28ccca09229a0ea25e260751211815a1d9b39856))



## [1.2.7](https://github.com/NervJS/taro/compare/v1.2.6...v1.2.7) (2019-01-15)


### Bug Fixes

* **cli:** 暂时去掉 cli 与框架版本检测，待后续调整设计 ([542db9e](https://github.com/NervJS/taro/commit/542db9eddd627fab503c0b797e7bce406dfa1b92))
* **taro:** 修复事件 bind 传参，close [#1936](https://github.com/NervJS/taro/issues/1936) ([e638b50](https://github.com/NervJS/taro/commit/e638b50e1a8fe1cea985717315d8d7f5f4ff364f))
* **transformer:** options.env 无法应用到 babel 转换选项 ([fd3ab91](https://github.com/NervJS/taro/commit/fd3ab918ee204e4bfea4b5ea68233a8a382f3e9d))



## [1.2.6](https://github.com/NervJS/taro/compare/v1.2.5...v1.2.6) (2019-01-15)


### Features

* **cli:** project 更新增加 @tarojs/taro-tt，close [#1931](https://github.com/NervJS/taro/issues/1931) ([4e38d8b](https://github.com/NervJS/taro/commit/4e38d8b114cef1e1ad3d3def3e885f110f0693b0))



## [1.2.5](https://github.com/NervJS/taro/compare/v1.2.4...v1.2.5) (2019-01-14)


### Bug Fixes

* **cli:** h5 端编译对于带有后缀的资源引用编译错误 ([a96c994](https://github.com/NervJS/taro/commit/a96c9943d84bfc62426646c4e6cf18af487e9d71))
* **cli:** 修复ts中对于带decorator的classDeclaration编译错误的问题 ([a03359a](https://github.com/NervJS/taro/commit/a03359a7ae90f0fcfa75b07f555978f55963f3f1))
* **cli:** 修复第一次编译成功不显示 devUrl 的问题 ([#1864](https://github.com/NervJS/taro/issues/1864)) ([4ba22d8](https://github.com/NervJS/taro/commit/4ba22d85af72caf36d2c8ea1620bcfc047d9d6d5))
* **components:** nerv 无法支持 render 的结果是一个数组，close [#1804](https://github.com/NervJS/taro/issues/1804) ([8bd95c8](https://github.com/NervJS/taro/commit/8bd95c81d9218b22f005be121036d5313217a3ff))
* **components:** 修复 picker 组件 onColumnChange 参数 ([3b77193](https://github.com/NervJS/taro/commit/3b7719348d1a6050a79ed0856ad27ddeae493569))
* **input:** 选择文件出错 ([28273d7](https://github.com/NervJS/taro/commit/28273d753e6cd8968afe514a705332753f0d6d75))
* **mobx:** h5 & rn 环境下的 Provider 定义为 stateful（[#1850](https://github.com/NervJS/taro/issues/1850)） ([#1852](https://github.com/NervJS/taro/issues/1852)) ([2aaf6d7](https://github.com/NervJS/taro/commit/2aaf6d7e030fe95e3339aec13e873a68db427f54))
* **RN:** taro 编译 rn 时分包路径有问题 close [#1610](https://github.com/NervJS/taro/issues/1610) ([2eaf122](https://github.com/NervJS/taro/commit/2eaf122432e2a9f18623ec4aec6f339840e42022))
* **RN:** yarn dev:rn 时 报错 TypeError: TypeError: undefined is not an object (evaluating 'this.$router.params') close [#1779](https://github.com/NervJS/taro/issues/1779) ([f10b764](https://github.com/NervJS/taro/commit/f10b764e881bd14b2508c5715523ffaf75050eb5))
* **taro:** once can not destory ([#1885](https://github.com/NervJS/taro/issues/1885)) ([3418dd6](https://github.com/NervJS/taro/commit/3418dd675299cedbe1fd1fb3c8b34e154ee810f6))
* **taro:** 小程序端事件处理事件名类似时参数绑定错误，close [#1866](https://github.com/NervJS/taro/issues/1866) ([9397304](https://github.com/NervJS/taro/commit/93973042c1b726a5cb06f82a628f15d6fe474480))
* **taro-components:** ScrollView 对齐小程序样式，隐藏 scrollbar ([79a4ad1](https://github.com/NervJS/taro/commit/79a4ad1ea542683328f9354bbf575c5bea21204b))
* **taro-components:** ScrollView 组件应同步其容器元素的 scrollLeft、scrollTop 值 ([17b6d76](https://github.com/NervJS/taro/commit/17b6d76e3a60a5df9100c9cae159b117985f788c))
* **taro-components:** textarea event handler miss pass detail value ([08221f6](https://github.com/NervJS/taro/commit/08221f6eebbf853387189c0fa203fefb2aa778fa))
* **taro-components:** 修复 Input 组件类型为 number 或者 digit 时的错误，close [#1819](https://github.com/NervJS/taro/issues/1819) ([d512b3e](https://github.com/NervJS/taro/commit/d512b3eba28ec9375ddf210e0c20ec14328457db))
* **taro-components:** 修复 Input 组件默认值问题 close [#1790](https://github.com/NervJS/taro/issues/1790) ([7ccb4aa](https://github.com/NervJS/taro/commit/7ccb4aa27d815201e1b6c21c5ecede7a102f9ed0))
* **taro-components:** 修复 Textarea 组件无法传递 detail 问题 ([58456e7](https://github.com/NervJS/taro/commit/58456e7b85728f21d201383d0093f88b4f179598)), closes [#1713](https://github.com/NervJS/taro/issues/1713)
* **taro-weapp:** 修复 weapp 下 this.$router.path 没有赋值的问题。fix [#1814](https://github.com/NervJS/taro/issues/1814) ([831db14](https://github.com/NervJS/taro/commit/831db14898b5c606ce3db1bcb976fb47a84eba9f))
* **taroize:** slot name 有数字时无法正确处理，[#1876](https://github.com/NervJS/taro/issues/1876) ([1ca6fbd](https://github.com/NervJS/taro/commit/1ca6fbde0508b2f0e4ab5baa99045e77413752e3))
* **taroize:** slot 中元素特殊 attr 没有被正确地处理，fix [#1880](https://github.com/NervJS/taro/issues/1880), fix [#1870](https://github.com/NervJS/taro/issues/1870) ([7a8c9a5](https://github.com/NervJS/taro/commit/7a8c9a5b42f6b9838a46ffcfc18327d611eca82f))
* **taroize:** 往 class 传入数组时给予警告并做一个简单 fallback，fix [#1878](https://github.com/NervJS/taro/issues/1878) ([6e80455](https://github.com/NervJS/taro/commit/6e80455469639f19474539ef8be7a01430f88cc7))
* **taroize:** 无法解析没有 name 的 slot，close [#1835](https://github.com/NervJS/taro/issues/1835) ([81d615d](https://github.com/NervJS/taro/commit/81d615d1d5374a2469be146b08a08a4cb5fa8f94))
* **transformer:** &nbsp; 和空格在下一个 children 不是 JSXText 时无效，fix [#1899](https://github.com/NervJS/taro/issues/1899) ([127a68b](https://github.com/NervJS/taro/commit/127a68b971e0ce2b41daf303d4860f88eede1e17))
* **transformer:** JSX children 表达式中的小于号会被 html-prettier 强制换行，fix [#1802](https://github.com/NervJS/taro/issues/1802) ([21910f9](https://github.com/NervJS/taro/commit/21910f9b3380f8415ca170eb922520bd11b4d8b0))
* **transformer:** 从 this 中结构 props 失败，close [#1813](https://github.com/NervJS/taro/issues/1813) ([1501cee](https://github.com/NervJS/taro/commit/1501ceeb3004b65a0b48187db05ed458f976bd92))
* **transformer:** 多层嵌套 if-else 无法正确解析，fix [#1910](https://github.com/NervJS/taro/issues/1910) ([2188c92](https://github.com/NervJS/taro/commit/2188c92c00a1cf5aa18f663279c2933900112296))
* **transformer:** 开发模式 text 组件也不换行，close [#1831](https://github.com/NervJS/taro/issues/1831) ([5f2174a](https://github.com/NervJS/taro/commit/5f2174ab7c902c05daa54451d33cc41b81f51a9b))
* transform scss file with hyphen(-) in the filename ([fa91278](https://github.com/NervJS/taro/commit/fa9127837e6d692b9494f822db0574563aab1f0f))
* **transformer:** TypeScript 会把装饰器编译为延时赋值，fix [#1840](https://github.com/NervJS/taro/issues/1840) ([c1ee82f](https://github.com/NervJS/taro/commit/c1ee82f490c7587d121511911f91c8a0d8c4f864))
* **transformer:** 小程序会把 false 渲染出来，[#1812](https://github.com/NervJS/taro/issues/1812) ([4508763](https://github.com/NervJS/taro/commit/45087633758a03a11aa0d9fdeb75af60a62944d2))
* **transformer:** 当继承基类组件没有 render 函数时不报错， close [#1370](https://github.com/NervJS/taro/issues/1370) ([4b43f24](https://github.com/NervJS/taro/commit/4b43f2475b71e4bbeed23c6334fe809e6329741b))


### Features

* **cli:** config配置 alias选项 暂不支持转换usingComponents [#1704](https://github.com/NervJS/taro/issues/1704) ([#1859](https://github.com/NervJS/taro/issues/1859)) ([e3a5548](https://github.com/NervJS/taro/commit/e3a55487c7e43492a5a7fd107fffa93f0d6c3378))
* **cli:** CSS Modules 默认支持样式名中划线写法, close [#1862](https://github.com/NervJS/taro/issues/1862) ([6cfa200](https://github.com/NervJS/taro/commit/6cfa2007b3cee5ad99b77b001afc0282befded9b))
* **cli router component webpack-runner:** h5支持自定义路由与basename配置 ([dc511c9](https://github.com/NervJS/taro/commit/dc511c90ca700d53af8c4baeea12d1128d30940d))
* **RN:** RN 端添加 openUrl API ([501dcd2](https://github.com/NervJS/taro/commit/501dcd2d2612a2a16ed72ec5f7808d8deb9f11f6))
* **taro:** 要求传入小程序原生对象的 api ，可以通过传入 taro 实例来解决 ([7300861](https://github.com/NervJS/taro/commit/73008611cd95e8e77e4bb678c292ba509992784c))
* **transformer:** this.state 的变量和 render 的自定义变量重名时警告，close [#1385](https://github.com/NervJS/taro/issues/1385) ([2890c67](https://github.com/NervJS/taro/commit/2890c67f2a18f2720913a32965b889f448823920))
* **transformer:** 允许 Image 组件嵌套，close [#1881](https://github.com/NervJS/taro/issues/1881) ([5214691](https://github.com/NervJS/taro/commit/52146918b9252972685854e61c39a8602b3802a8))
* **transformer:** 父类方法阻止事件冒泡，close [#1596](https://github.com/NervJS/taro/issues/1596) ([eb362a7](https://github.com/NervJS/taro/commit/eb362a7f996d11fc1558bb4d4900653de1343fa8))
* **webpack-runner:** 在h5生产环境中移除部分调试代码 ([7969ebe](https://github.com/NervJS/taro/commit/7969ebe418ba62dbec944fa117cb8c30de86e064))



## [1.2.4](https://github.com/NervJS/taro/compare/v1.2.3...v1.2.4) (2019-01-03)


### Bug Fixes

* **input:** 修复 IOS 光标跳转问题 ([71f605f](https://github.com/NervJS/taro/commit/71f605f7e0707de0b39c0c7d3a27e8a4b2087def))
* **taro:** 修正 Taro.getEnv 对头条小程序的判断 ([8bc4293](https://github.com/NervJS/taro/commit/8bc4293b6fac4790fbdd8334effed5538431eb56))
* **taro-h5:** 补充 Nerv 引用 ([7f30b6f](https://github.com/NervJS/taro/commit/7f30b6fd218ed232d94fa268ddad39e199075fad))
* **taro-swan:** 修正百度小程序 componentDidMount 调用 ([cabad00](https://github.com/NervJS/taro/commit/cabad0048599adf969a6d3cd072a15ff5fa868c3))
* **transformer:** 循环父级三元表达式的 alternative 没有三元表达式的防御，close [#1698](https://github.com/NervJS/taro/issues/1698) ([7f9ac60](https://github.com/NervJS/taro/commit/7f9ac600e96a93b90fff75e4762c149ef8ad6ec5))
* **transformer:** 循环的 callee 是函数也需要执行上层的条件判断，close [#1725](https://github.com/NervJS/taro/issues/1725) ([7fab2c4](https://github.com/NervJS/taro/commit/7fab2c4651db7ae4a8bcb9b84d963feedc670c81))
* **transformer-wx:** 处理某些小程序组件属性与微信小程序不一致的情况，close [#1792](https://github.com/NervJS/taro/issues/1792) ([17b8689](https://github.com/NervJS/taro/commit/17b868937b13f511b5afbfd615d8699fd7399a74))
* **webpack-runner:** add esnextModules regex support the modules of cnpm installed ([#1796](https://github.com/NervJS/taro/issues/1796)) ([1bcb017](https://github.com/NervJS/taro/commit/1bcb017c4225879c2f0749e8533adac74e6799a1))
* 修改 rollup.config.js name 字段的值 ([#1769](https://github.com/NervJS/taro/issues/1769)) ([b757207](https://github.com/NervJS/taro/commit/b7572076881307fc594056c08ca120ba80af3150))


### Features

* **taro:** 增加一个 polyfill 文件 ([8588ddb](https://github.com/NervJS/taro/commit/8588ddbb6f3a51b7de5e0afc2e4cc729f2a2e306))
* **taro:** 补充新的音频 api ([854c0be](https://github.com/NervJS/taro/commit/854c0be2374dbd4febe56646adc44d45541af0f7))
* **taroize:** 支持 naming slot, close [#1765](https://github.com/NervJS/taro/issues/1765) ([fba22ea](https://github.com/NervJS/taro/commit/fba22ea9dd3be15feb15bf45b26232a609f5c064))
* **transformer:** Taro API 的回调函数总是推荐使用箭头函数, close [#1693](https://github.com/NervJS/taro/issues/1693) ([cbec912](https://github.com/NervJS/taro/commit/cbec91263544752bda5165713f8438d1bdcc767d))



## [1.2.3](https://github.com/NervJS/taro/compare/v1.2.2...v1.2.3) (2018-12-29)


### Bug Fixes

* 原生组件 Switch 的 types 增加对 disabled 的类型定义 ([#1762](https://github.com/NervJS/taro/issues/1762)) ([9e28464](https://github.com/NervJS/taro/commit/9e284643df0a0bd4074fcba6d0fbf5e10eb6e539))
* **eslint:** 解析非组件/页面 JSX 文件时编译器不启用 eslint 检查, close [#1703](https://github.com/NervJS/taro/issues/1703) ([d0a2bce](https://github.com/NervJS/taro/commit/d0a2bcec8607469512792632a1a154093d36d927))
* **input:** 修复 number 类型 maxLength 无效 ([8ae8194](https://github.com/NervJS/taro/commit/8ae8194cf6fa1a9dcf690e5511252f1ee2b71def))
* **RN:** 修复 Navigation 相关方法的事件绑定 ([bdff7f2](https://github.com/NervJS/taro/commit/bdff7f27a3380f0cdebe21d0ee7c1c82cd9fb2c1))
* **RN:** 修复 Taro.navigateTo 返回问题  close[#1735](https://github.com/NervJS/taro/issues/1735) ([3d06b4b](https://github.com/NervJS/taro/commit/3d06b4b4a84617345b6dcbf20a9a7409dd67654a))
* **RN:** 修复页面返回不掉用 componentDidShow 和 componentDidHide 的 bug ([90901cc](https://github.com/NervJS/taro/commit/90901cc46de9f1fa5b0e82c43e074ac1ca9fe432))
* **taro-components:** 修复Input 组件事件问题 close # 1647 ([7b702e7](https://github.com/NervJS/taro/commit/7b702e7a3f0a68a1875ae22f99a5028c0ec88ada))
* **taro-h5:** 改用 findDOMNode 优化 ([#1754](https://github.com/NervJS/taro/issues/1754)) ([e9eead9](https://github.com/NervJS/taro/commit/e9eead945cf18e2d7e4f835f9f876d4c4a4104af))
* **textarea:** maxlength 对齐小程序 ([af4d57c](https://github.com/NervJS/taro/commit/af4d57ce7e64560e093d8ed4a09196ed3063284a))
* fix type of animation in MovableViewProps ([#1747](https://github.com/NervJS/taro/issues/1747)) ([0ffaf9f](https://github.com/NervJS/taro/commit/0ffaf9f34015972bb217b986c3008e3afd1a81db))
* 修复注释 ([9f22fc8](https://github.com/NervJS/taro/commit/9f22fc8796ac874e27872abaab3e397ea997111d))
* **taro-cli:** build ui 当 TARO_BUILD_TYPE 为 script 时，直接 webpack 打包 ([bb88c7f](https://github.com/NervJS/taro/commit/bb88c7f41311e46de00b2f39192bb19b4fc9fb1e))
* **transformer:** 组件传参报错找不到代码，close [#1711](https://github.com/NervJS/taro/issues/1711) ([cef17c3](https://github.com/NervJS/taro/commit/cef17c35b1891db3eefeb05cc4bbe69f66e05bd6))


### Features

* **taro:** add FileSystemManager api, [#1708](https://github.com/NervJS/taro/issues/1708) ([26c7c15](https://github.com/NervJS/taro/commit/26c7c15c1208871d9b9cb686115369ed902c9bfa))
* **taro-cli:** 增加对 config.ui 配置项的处理 ([1b40313](https://github.com/NervJS/taro/commit/1b4031335b314a7f0992e7288125e6ca7d17c9e5))
* **types:** BaseEvent添加两个常用事件处理的函数 ([#1739](https://github.com/NervJS/taro/issues/1739)) ([01afc26](https://github.com/NervJS/taro/commit/01afc26058f2eade78d234ee0ea28b7c2c5977e8))



## [1.2.2](https://github.com/NervJS/taro/compare/v1.2.1...v1.2.2) (2018-12-26)


### Bug Fixes

* **cli:** mobx 模板无法通过 TypeScript 类型检测 ([3873d73](https://github.com/NervJS/taro/commit/3873d732bdc64b1fc3c29ddc0651debbc77ae1a2))
* **cli:** node_modules 中的文件拷贝不全，close [#1697](https://github.com/NervJS/taro/issues/1697) ([4745b44](https://github.com/NervJS/taro/commit/4745b4440e6a06d5c722cff44a0f6ddec7a315e0))
* **cli:** 优化 npm 安装包版本的查找 ([5395f43](https://github.com/NervJS/taro/commit/5395f43597c30082c583a97837d2318a7f7a9c82))
* **cli:** 样式中引用 npm 内资源解析时路径使用相对路径 ([487217d](https://github.com/NervJS/taro/commit/487217d445c341ad56e054aabe899cdace6a6873))
* **h5:** Correct the path variable name in Location and modify the priority of fallbacks ([#1664](https://github.com/NervJS/taro/issues/1664)) ([603ed14](https://github.com/NervJS/taro/commit/603ed146a930c6fb1946b6a11fff16c50fde86da))
* **taro-cli:** 1. build ui watch 时依赖分析出的样式另外处理。2. build ui watch 增加 try catch，报错不停止监听。 ([c327ebf](https://github.com/NervJS/taro/commit/c327ebfa79286010cd1ea0f468284e11fcb47725))
* **taro-components:** swiper 组件未初始化前被调用出现 undefined 错误 ([#1666](https://github.com/NervJS/taro/issues/1666)) ([c2cf9ef](https://github.com/NervJS/taro/commit/c2cf9ef9c856f92e347800091130ccf0d6e70acc))
* **taro-components:** 修复 swiper pagination 匹配错乱问题 ([c77348b](https://github.com/NervJS/taro/commit/c77348b69889148add8a7e871a7b403b2e293647))
* **taro-components:** 修复Input 组件事件问题 close [#1647](https://github.com/NervJS/taro/issues/1647) ([53c9337](https://github.com/NervJS/taro/commit/53c93379a1cfba3bf860094364c115133c35a032))
* **transformer:** if block 中设置一个没有初始值的变量报错 ([213b29e](https://github.com/NervJS/taro/commit/213b29e971a2fb670cf2198dab07983fe4ce2f73))
* **transformer:** 循环中使用 ref 的 id 需要加上 `#` 号符，第一次运行需要做一次类型判断，close [#1589](https://github.com/NervJS/taro/issues/1589) ([117e5d3](https://github.com/NervJS/taro/commit/117e5d3eee565e47249e13541732230942363a1c))


### Features

* **cli:** 小程序端编译增加 cli 与本地依赖版本校验 ([495f6c0](https://github.com/NervJS/taro/commit/495f6c030c4b7e215c3a4546c4cba665b0739f72))
* **cli:** 百度小程序编译时生成框架信息文件 ([2140017](https://github.com/NervJS/taro/commit/214001764553a6b991b77c211742bf020856de7b))
* **taro-weapp/alipay/swan/tt:** 增加 this.$preload，close [#1570](https://github.com/NervJS/taro/issues/1570) ([ae4ad6d](https://github.com/NervJS/taro/commit/ae4ad6d3342dce2dde9aa9faea27ac19d0cf5584))



## [1.2.1](https://github.com/NervJS/taro/compare/v1.2.0...v1.2.1) (2018-12-21)


### Bug Fixes

* **cli:** alias 路径替换问题修复，close [#1598](https://github.com/NervJS/taro/issues/1598) ([f53ca81](https://github.com/NervJS/taro/commit/f53ca81e3e8be70da77eb2ad3183a99469ff3e40))
* **cli:** h5 编译路径替换有误 ([117e69e](https://github.com/NervJS/taro/commit/117e69eb002fe1f111826ffc996778ccc1042b19))
* **cli:** mobx 模板无法通过 TypeScript 检测 ([b500de8](https://github.com/NervJS/taro/commit/b500de8d5dff1ba11a754836f5ff7c995366e801))
* **cli:** ui 库编译 watch 增加文件分析 ([9674f24](https://github.com/NervJS/taro/commit/9674f2481ca1ff0610eefa1984746a4608b4ebef))
* **cli:** 生成代码中文等特殊字符会被转义为 unicode，[#1582](https://github.com/NervJS/taro/issues/1582), close [#1595](https://github.com/NervJS/taro/issues/1595) ([acdae99](https://github.com/NervJS/taro/commit/acdae99992c464a087a7bb052940f884ebd1e843))
* **cli:** 真正支持 yarn workspaces, close [#1018](https://github.com/NervJS/taro/issues/1018) ([7f6bea2](https://github.com/NervJS/taro/commit/7f6bea263c7880ce2fa0dc37524d45f89abb6e13))
* **eslint:** JSX 参数可以传入循环 JSX 语句 ([a400ea6](https://github.com/NervJS/taro/commit/a400ea60cbbb860f6a236f0ed8a7b61fcb85abc3))
* **eslint:** ref 可以使用匿名函数，[#1560](https://github.com/NervJS/taro/issues/1560) ([02f3fcc](https://github.com/NervJS/taro/commit/02f3fcc5a44046e6402d4837c13aa88a4400baa6))
* **input:** 修复无法选择文件 fix [#1532](https://github.com/NervJS/taro/issues/1532) ([dc96118](https://github.com/NervJS/taro/commit/dc96118414e92446ccae2bdf4ad3900d5dbdc90b))
* **redux-h5:** 修复后台页面获取不到最新redux属性的问题 ([a68268c](https://github.com/NervJS/taro/commit/a68268c726f0c48e0c18338fd33675326f1a1a33))
* **RN:** RN端navigationStyle 局部配置无法覆盖全局配置  close[#1627](https://github.com/NervJS/taro/issues/1627) ([cc5cba5](https://github.com/NervJS/taro/commit/cc5cba508b55cfa02923cad080d53002a6d9db9b))
* **router-h5:** 修复高阶组件的页面不更新页面标题的问题 ([1d15256](https://github.com/NervJS/taro/commit/1d15256464f78d2e5848287af2746c04a99591c8))
* **taro:** d.ts 增加 hideKeyboard 的定义 close [#1607](https://github.com/NervJS/taro/issues/1607) ([8b50a07](https://github.com/NervJS/taro/commit/8b50a07a67111280106ed6a7d41fe830cd9977d9))
* **taro-weapp/alipay/swan/tt/:** 小程序端支持在组件上绑定 bind 不同参数的同一回调函数 ([38ce066](https://github.com/NervJS/taro/commit/38ce066e69e0a5f7ffe2aeae1c4059f1ef575e31))
* **taroize:** template 的父组件是 if-else 时解析失败 ([1b2dbfc](https://github.com/NervJS/taro/commit/1b2dbfc80a12de7dfad2905de85167aeaa30b582))
* **taroize:** 处理形如 bind:click 这样有冒号的事件绑定 ([4b248d1](https://github.com/NervJS/taro/commit/4b248d1b77e5093bea1dc8b41e91d6fa3c8e7267))
* **taroize:** 移除掉未知微信属性 ([063ff5c](https://github.com/NervJS/taro/commit/063ff5cbb129ecc9c63c6d37aaf806222ddbb1a8))
* **taroize:** 统一处理 wxs module 的情况 ([26f0dbe](https://github.com/NervJS/taro/commit/26f0dbe8326f8d21adc04b6d959f6d53a65d47d5))
* **taroize:** 自我引用的组件不用 import ([e5d9d5a](https://github.com/NervJS/taro/commit/e5d9d5abb1e2395f424bee77aff6c2051c7d87ef))
* **transformer:** 循环中的 key 会自动从 item 中取值 ([f10c9a5](https://github.com/NervJS/taro/commit/f10c9a52a88132186a88f572dc36bd7342d0d632))
* **transformer:** 遵循 JSX 语法，忽略 JSX Text 前后为换行/制表符的情况，close [#1609](https://github.com/NervJS/taro/issues/1609) ([9f873f6](https://github.com/NervJS/taro/commit/9f873f621b6e26a7bb3d96e01ca648eda11725da))
* taro update project 添加 mobx 相关包 close [#1588](https://github.com/NervJS/taro/issues/1588) ([27bc2cb](https://github.com/NervJS/taro/commit/27bc2cbb914cfef3fd7d2fd6ef97bd248c7c9bb9))
* 解决taro init从命令行输入参数无效的问题 ([#1584](https://github.com/NervJS/taro/issues/1584)) ([066d0e4](https://github.com/NervJS/taro/commit/066d0e40ed2ef031a8b5f4e766774cc03d1bf620))
* **transformer:** 小程序的 key 属性用字符串包裹，而不是 JSX 表达式 ([49bfa70](https://github.com/NervJS/taro/commit/49bfa700b25dc8f79b54d513ae5369afc15af7c5))
* **transformer:** 第三方组件事件名有 `-` 需要特殊处理，close [#1559](https://github.com/NervJS/taro/issues/1559) ([6f90d14](https://github.com/NervJS/taro/commit/6f90d14cc60b1765dac5404658258e61ab594a1e))


### Features

* **cli:** cli build ui 增加 watch 功能 ([12876fa](https://github.com/NervJS/taro/commit/12876fa0bd7493c1ff7193a428f048f84b4de099))
* **cli:** ui 库编译增加 h5 端编译成单个文件的功能 ([fdb118a](https://github.com/NervJS/taro/commit/fdb118ae8bb21789cb6bc6ccae60a40741485bab))
* **doc:** 更新Api 文档 ([22a6c0d](https://github.com/NervJS/taro/commit/22a6c0dcc6dd8ea398a62aff40bbf6f1d4f973b5))
* **eslint:** 给编译器单独定制一个规则集合 ([11eecf6](https://github.com/NervJS/taro/commit/11eecf6406e650fccb6c7d005f85d9f98bb4c63d))
* **RN:**  添加 RN 端 CSS Modules 的兼容处理 ([6ab2464](https://github.com/NervJS/taro/commit/6ab2464d5c12072120ee8d194c283f5afcf75e91))
* **router:** h5 端使用 path 代替 pathname 标识当前页面路径 ([6967856](https://github.com/NervJS/taro/commit/6967856906fef12c891076decc35baff91d4a638))
* **taro-components-rn:** 让 SwiperItem 支持 onClick, close [#1564](https://github.com/NervJS/taro/issues/1564) ([c289285](https://github.com/NervJS/taro/commit/c289285f24ce191654ae1579e656a36d66db6937))
* **taro-rn:** 增加chooseImage Api ([08fe7f2](https://github.com/NervJS/taro/commit/08fe7f20d6963ac9516bdc60f85afbb9afe40bf8))
* **taro-rn:** 新增downloadFile Api, [#1563](https://github.com/NervJS/taro/issues/1563) ([ace925b](https://github.com/NervJS/taro/commit/ace925bf57e79843d340e836436af3cbca5666c7))
* **taroize:** 在 props observer 中使用对象函数简写 ([ee2e683](https://github.com/NervJS/taro/commit/ee2e683d2843887f5c858785ca485532f5ebf79e))
* **taroize:** 支持保留原有 wxml 注释 ([3b24f18](https://github.com/NervJS/taro/commit/3b24f18509c354b36304b0e7619b9d75d4a528dc))
* **transformer:** wx:if/else 的间隔也可以写注释 ([74b6f90](https://github.com/NervJS/taro/commit/74b6f90e21e311a3e165531181ef8de2ecadf2e2))
* **weapp|tt|swan|alipay:** 小程序端增加 this.$router.path 标识当前页面路径 ([1f3c505](https://github.com/NervJS/taro/commit/1f3c505643d7f7fc19d82cf100837f262ea03c11))



# [1.2.0](https://github.com/NervJS/taro/compare/v1.2.0-beta.16...v1.2.0) (2018-12-17)


### Bug Fixes

* **router:** 修复一些问题： ([8c6363e](https://github.com/NervJS/taro/commit/8c6363ea21c37c8c869772fe759b357801222e6c))
* **taro-components:**  H5 Swiper问题 close [#1528](https://github.com/NervJS/taro/issues/1528) ([0df6b30](https://github.com/NervJS/taro/commit/0df6b30fb401453b2c0a2e8e4dfa37de99f018d8))
* **transformer:** 在 JSX 中用到源于 `this.state` 的对象没有加入 usedState，close [#1492](https://github.com/NervJS/taro/issues/1492) ([9bec112](https://github.com/NervJS/taro/commit/9bec1122a4ddf329e41678c855d031925f64ee94))
* **transformer:** 当三元表达式的 tester 是复杂表达式时无法生成 JSX return 语句，close [#1459](https://github.com/NervJS/taro/issues/1459) ([30d0e80](https://github.com/NervJS/taro/commit/30d0e802bec1674e55207edf7dfe35404e2bfbf9))
* **transformer:** 某些自定义组件无法包含 children，close [#1551](https://github.com/NervJS/taro/issues/1551), close [#1540](https://github.com/NervJS/taro/issues/1540) ([10a27fc](https://github.com/NervJS/taro/commit/10a27fc3c76f60674c24836cffd3de8e98248823))
* **types:**  修复类型检查 ([#1541](https://github.com/NervJS/taro/issues/1541)) ([26f0490](https://github.com/NervJS/taro/commit/26f04902aa850261cf44a56fdc77d512d6825b1e)), closes [#1539](https://github.com/NervJS/taro/issues/1539)


### Features

* **cli:** css modules 处理样式文件规则与 `create-react-app` 保持一致 ([#1456](https://github.com/NervJS/taro/issues/1456)) ([a2ca3b9](https://github.com/NervJS/taro/commit/a2ca3b9d45ba62e3e132b58efc33739abcdb118d))
* **transformer:** 转换器也会执行 eslint-plugin-taro 的规则 ([198f839](https://github.com/NervJS/taro/commit/198f8399760b39d7e282206a927f0905ff280230))
* **webpack-runner:** 适配新版cssModules配置 ([a7a6b23](https://github.com/NervJS/taro/commit/a7a6b23d382143c6b65803a7e1b3ac21ba4d2667))


### BREAKING CHANGES

* **types:** n



# [1.2.0-beta.16](https://github.com/NervJS/taro/compare/v1.2.0-beta.15...v1.2.0-beta.16) (2018-12-15)


### Bug Fixes

* **taro-components-rn:** View在ScrollView内且绑有点击事件，滑动时无法触发ScrollView的滚动，fix [#1520](https://github.com/NervJS/taro/issues/1520) ([7eed26c](https://github.com/NervJS/taro/commit/7eed26ce6807693284445bfee242ed5f9bf32c2a))
* **taro-components-rn:** 让Icon的size可传字符串型数字，close [#1488](https://github.com/NervJS/taro/issues/1488) ([96271e4](https://github.com/NervJS/taro/commit/96271e45bce0fd99777fb790d79aa07c6a8d3964))
* **types:** input 有 name 属性，close [#1505](https://github.com/NervJS/taro/issues/1505) ([7a7fdb0](https://github.com/NervJS/taro/commit/7a7fdb0e35daa1a383b2a4926d6efeac7d658364))
* **types:** MovableViewProps 中重复定义了 animation 属性, close [#1503](https://github.com/NervJS/taro/issues/1503) ([16a676a](https://github.com/NervJS/taro/commit/16a676a1bbdd114b626b893c59c24d7815f7192b))
* **types:** 表单组件props属性完善 Picker组件属性完善 ([#1508](https://github.com/NervJS/taro/issues/1508)) ([a5ccded](https://github.com/NervJS/taro/commit/a5ccded4a91f239c4b05611eac1222ab47b51bbd))
* **webpack-runner:** 修复production模式不支持使用相对路径作为publicPath的问题 ([07fb964](https://github.com/NervJS/taro/commit/07fb964c0eaea85bddb3cd575574110d9a0c2a0d))


### Features

* **CLI:** 添加 taro info 命令，方便用户获取环境及 taro 相关依赖的信息 ([9e1864d](https://github.com/NervJS/taro/commit/9e1864debaa20d267b09ac8aa18a2fe94c2ca765))
* **components:** tabbar代码逻辑优化 ([33169ae](https://github.com/NervJS/taro/commit/33169ae15aca5758dbb9a6b39b718f801df3a86a))



# [1.2.0-beta.15](https://github.com/NervJS/taro/compare/v1.2.0-beta.14...v1.2.0-beta.15) (2018-12-13)


### Bug Fixes

* **components:** 修复h5 tabbar在'/'不展示的问题 ([8c92c90](https://github.com/NervJS/taro/commit/8c92c90ebd33b3b20a7641b808407584f831e0c3))
* **router component:** 修复redirectTo tabbar暂时改用redirectTo ([b7c6b58](https://github.com/NervJS/taro/commit/b7c6b582d0d4be58e1cff6d5253dab1c362327cb))
* **taro-rn:** 修复非post方法时，对data的处理，close [#1457](https://github.com/NervJS/taro/issues/1457) ([6883a7e](https://github.com/NervJS/taro/commit/6883a7e32fd6d415ea15cd779624ecffa9eb1bec))
* **taro-weapp:** 改正组件 componentDidHide 生命周期拼写错误 ([88d3ef2](https://github.com/NervJS/taro/commit/88d3ef2e01fbafdc704afde1d1ace368e29d954c))
* **taroize:** babel template 无法生成纯字符串语句 ([7f34416](https://github.com/NervJS/taro/commit/7f34416ba77fb81b5fc6d9368f8daca14c19cfec))
* **taroize:** 当 import 的 wxml 有多个根节点时转换失败，[#1463](https://github.com/NervJS/taro/issues/1463) ([fcfc9a6](https://github.com/NervJS/taro/commit/fcfc9a67cb8496d63dcdbeaf4318997b8f5127e4))
* **webpack-runner:** 修复dev模式下webpackChain配置失效的问题 ([b5afa70](https://github.com/NervJS/taro/commit/b5afa703b6f7d0285f846ec9886a81c9f7dde395))


### Features

* **cli:** 增加 import 组件的定义，close [#1481](https://github.com/NervJS/taro/issues/1481) ([9738e56](https://github.com/NervJS/taro/commit/9738e56536637e3dcaa1a73314c2821d1f78dcd8))
* **taro-h5:** 增加 makePhoneCall API，close [#1426](https://github.com/NervJS/taro/issues/1426) ([93e23f0](https://github.com/NervJS/taro/commit/93e23f07cc1a62e379ade9844d6d67f13c8e7c3d))


### Reverts

* **cli:** 百度小程序的编译本地资源路径替换使用绝对路径 ([20fce83](https://github.com/NervJS/taro/commit/20fce835f83986fd558090be3c0023f8efbb967e))



# [1.2.0-beta.14](https://github.com/NervJS/taro/compare/v1.2.0-beta.13...v1.2.0-beta.14) (2018-12-11)


### Bug Fixes

* **cli:** ui 组件库引用路径替换错误 ([2a38eaa](https://github.com/NervJS/taro/commit/2a38eaac5d16780e731038406e3213b737edc391))
* **cli:** 修复convert转换死循环 ([#1465](https://github.com/NervJS/taro/issues/1465)) ([22b2005](https://github.com/NervJS/taro/commit/22b2005cc9662a495567bfcbb6d098c9806e7fbe))
* **taro-components:** 修复 onInput的e.detail.value 获取不到值 close [#1439](https://github.com/NervJS/taro/issues/1439) ([9eeedf7](https://github.com/NervJS/taro/commit/9eeedf74cf84de76141d22974a2d0a173e691011))
* **taroize:** template 嵌套可能报错 ([2a93a0a](https://github.com/NervJS/taro/commit/2a93a0a0560c0a9eae71d16731e878f914832a69))
* **transformer:** 自定义组件 else 需要加上 block 包裹住，close [#1468](https://github.com/NervJS/taro/issues/1468) ([7e3a0b0](https://github.com/NervJS/taro/commit/7e3a0b061b9de0abe30e97d97d3793763e350518))


### Features

* **cli h5 redux-h5 router:** h5路由的一些改动 ([57e6e5f](https://github.com/NervJS/taro/commit/57e6e5f58a4917f0f4d1899319dc47316e5f7229))
* **router:** 支持页面滚动位置记录、复原 ([e939a65](https://github.com/NervJS/taro/commit/e939a65198399860ab95ef593f701c2493015757))



# [1.2.0-beta.13](https://github.com/NervJS/taro/compare/v1.2.0-beta.12...v1.2.0-beta.13) (2018-12-11)


### Bug Fixes

* fix loading type in ButtonProps ([#1449](https://github.com/NervJS/taro/issues/1449)) ([65efa56](https://github.com/NervJS/taro/commit/65efa562dc1168ee391e4fa854b218d33d7fdc51))
* **taroize:** 循环参数只传入 `this` 可能导致爆栈， [#1430](https://github.com/NervJS/taro/issues/1430) ([7e48dbe](https://github.com/NervJS/taro/commit/7e48dbe91a477b22f3c6ad02fbf2d04c2dcd7a12))
* **transformer:** 循环中 ref 的组件不是根组件或自带 ID 无效，close [#1395](https://github.com/NervJS/taro/issues/1395) ([b1fa2b9](https://github.com/NervJS/taro/commit/b1fa2b97478562b5709e909b47228a5a57f47193))
* **transformer:** 百度小程序用 = = 包裹的属性只有一个花括号，close [#1443](https://github.com/NervJS/taro/issues/1443) ([932eabb](https://github.com/NervJS/taro/commit/932eabb81733af7648160ecc44d1b7217d375c1d))
* **transformer:** 语句中 this 作用域对值出现两次或以上转换失败， close [#1423](https://github.com/NervJS/taro/issues/1423) ([49527e8](https://github.com/NervJS/taro/commit/49527e8f36c50fc64a41bfb0b173888aa2a8be15))


### Features

* **cli:** 各端 alias 支持完善，close [#82](https://github.com/NervJS/taro/issues/82) ([91de6c6](https://github.com/NervJS/taro/commit/91de6c66b19c8fd8202dbf2415e1aafb0b203812))
* **cli:** 项目配置中支持添加 pathAlias 配置 import 路径自定义别名 ([#1401](https://github.com/NervJS/taro/issues/1401)) ([83bffe4](https://github.com/NervJS/taro/commit/83bffe4c4092a6d6386014603ebf101935f528fd))



# [1.2.0-beta.12](https://github.com/NervJS/taro/compare/v1.2.0-beta.11...v1.2.0-beta.12) (2018-12-10)


### Bug Fixes

* **cli:** 修复 node_modules 路径与工作目录不一致时，生成 outputNpmPath 异常的问题 ([#1412](https://github.com/NervJS/taro/issues/1412)) ([924ac12](https://github.com/NervJS/taro/commit/924ac12153d1fdd7a46ebbe25cba16d573a23ed5))
* **cli:** 修复引用 node_modules 中的组件路径错误 ([fe29c3b](https://github.com/NervJS/taro/commit/fe29c3becd1d13d36bdce4b214d7231303682771))
* **cli:** 修复组件引用路径解析错误 ([785a123](https://github.com/NervJS/taro/commit/785a12353383a3f1f29bf0a5c379045b5a2e4c68))
* **router:** 修复navigateBack的传参错误，添加错误提示 ([55f9aed](https://github.com/NervJS/taro/commit/55f9aed6bb1b18b89fabf0235bb5373d4822510d))
* **router:** 去除没有卵用的404 ([8350ab6](https://github.com/NervJS/taro/commit/8350ab64b0f69a2327d4601a62f09545ce675d97))
* **taro-swan、taro-aplipay:** props 为 null 时也使用 defaultProps ([015b079](https://github.com/NervJS/taro/commit/015b0799a6d7eaaaaf596c5e4e473c7813ac71dd))
* **taro-tt:** 头条小程序中 props 为 null 时也使用 defaultProps ([011e90a](https://github.com/NervJS/taro/commit/011e90a00ec0dd19367ff38a002e03177adffe01))
* **taroize:** 生成 template 组件自我引用时不需要 import 自己 ([7b092e8](https://github.com/NervJS/taro/commit/7b092e8dd7493906ae50a3928f37fb644d36c16a))
* **transformer:** export 匿名类报错 ([9d12a0f](https://github.com/NervJS/taro/commit/9d12a0fe8deffdfd9d56c53b0c461aafc3c9dc86))



# [1.2.0-beta.11](https://github.com/NervJS/taro/compare/v1.2.0-beta.10...v1.2.0-beta.11) (2018-12-08)


### Bug Fixes

* **cli:** 优化h5的entry判断逻辑 ([d21fb6a](https://github.com/NervJS/taro/commit/d21fb6a2a80ab651622ea6875c7c973af07657d4))
* **cli:** 修复h5 cli中对于页面文件的误判 ([10c07c7](https://github.com/NervJS/taro/commit/10c07c79edd32659fc922ca6a46eb2d78c16af22))
* **cli:** 修复Taro.Component获取不到$router问题 ([6776d57](https://github.com/NervJS/taro/commit/6776d57995fe611ab762314cc6aac2fd6e47ee8a))
* **cli:** 修复没有routerMode默认值的问题 ([a474c6f](https://github.com/NervJS/taro/commit/a474c6febb9353a167050b121e59a2a560e9f5c2))
* **cli:** 普通文件如有需要自动引入 Taro ([8f6a3b8](https://github.com/NervJS/taro/commit/8f6a3b820b1c1685ee8b3db0fa1b3da609e2975f))
* **router:** 为navigateBack添加了默认参数 ([1060514](https://github.com/NervJS/taro/commit/10605143d17149943d17a785848cc52cea37ab69))
* **router:** 修复Taro.redirectTo失效的问题 ([15dea8a](https://github.com/NervJS/taro/commit/15dea8a21df5ff7e8d481517e7d88473f5c8f4ec))
* **tarize:** 针对 template 增加 options 改为 static options ([fec71f5](https://github.com/NervJS/taro/commit/fec71f5089ba7b187c5caa6cae462c8b55c92273))
* **taro-tt:** 兼容头条小程序事件处理 ([56ac2a2](https://github.com/NervJS/taro/commit/56ac2a2fcd401aefce6b4257d53d399171372117))
* **taroize:** ['externalClasses', 'relations', 'options'] 都需要编译成 static ([1862dd1](https://github.com/NervJS/taro/commit/1862dd1249bfe87816c08e04f947f840798f7251))
* **taroize:** 当 props key 已经存在就不需要加入 this.state ([ecd88c2](https://github.com/NervJS/taro/commit/ecd88c2dd77a6bfa3fce08fa8490a127498cb729))
* **transformer:** 事件的 properties 不需要加入到 used state ([a33290e](https://github.com/NervJS/taro/commit/a33290ee2ed41d9ae158211093c275d62a45ad3b))


### Features

* **cli:** convert 时普通 js 中的调用微信 api 的写法要转成 Taro 写法 ([3c3d57f](https://github.com/NervJS/taro/commit/3c3d57f9c39602777af6f213731a717bf5d5b834))
* **taroize:** 当初始 data 和 properies 重复定义键值时报错 ([dda8d3e](https://github.com/NervJS/taro/commit/dda8d3eb3e86fd1aa82c3243855a54453f32d8f3))
* **taroize:** 所有 template 都继承全局样式 ([6eb3cff](https://github.com/NervJS/taro/commit/6eb3cffad06d975616756d7d0d559294033424fb))
* **transformer:** 支持 npm run build 时压缩 wxml, close [#1408](https://github.com/NervJS/taro/issues/1408) ([ea4e8a7](https://github.com/NervJS/taro/commit/ea4e8a77bed6e615661aef0a6210947b813ac219))
* **transformer:** 百度小程序某些属性需要用 `= =` 包裹住 ([32627dc](https://github.com/NervJS/taro/commit/32627dcacaad237a909964edaccc80a9532c2823))
* **webpack-runner:** 加入能作用于dll的webpackChain配置 ([352aa96](https://github.com/NervJS/taro/commit/352aa96a6e338baf4e86f25d1fa3aaf9af250c63))



# [1.2.0-beta.10](https://github.com/NervJS/taro/compare/v1.2.0-beta.9...v1.2.0-beta.10) (2018-12-06)


### Bug Fixes

* **cli:** convert 优化图片处理方式 ([b1c4f3c](https://github.com/NervJS/taro/commit/b1c4f3c014bed7eae2bcca40d92e599cfa041a8d))
* **cli:** 支持 convert 组件引用自身 ([42f2a03](https://github.com/NervJS/taro/commit/42f2a0358810055300cc92e4a0acc6add5d6ef9a))
* **cli router:** 修复页面组件没有componentDidMount/componentDidShow时不更新页面标题的问题 ([5d079f7](https://github.com/NervJS/taro/commit/5d079f76b4a486a7d7b95f7208c5b49c4e290cee))
* **mobx:** 修复页面跳转props undefined的问题 ([#1393](https://github.com/NervJS/taro/issues/1393)) ([944f2f4](https://github.com/NervJS/taro/commit/944f2f40332905689e4fd21702dc63976d59e4f8))
* **router webpack-runner:** 修复一些问题 ([e83c423](https://github.com/NervJS/taro/commit/e83c42392ecc3d3bdfd23f227dd93124d895666a))
* **taro-h5:** 修复router2.0获取不到$router的问题 ([3fd6928](https://github.com/NervJS/taro/commit/3fd6928d0ae6d33961d0f4595a5d616fbafd0517))
* **taro-rn:** 安卓下 Toast 报错 View nested under Text... ([9fca026](https://github.com/NervJS/taro/commit/9fca026c96b92ab4b1a2482a6be026b0cc9ce716)), closes [/github.com/magicismight/react-native-root-toast/blob/master/lib/ToastContainer.js#L256](https://github.com//github.com/magicismight/react-native-root-toast/blob/master/lib/ToastContainer.js/issues/L256)


### Features

* **cli:** h5端增加copy功能 ([a392ad9](https://github.com/NervJS/taro/commit/a392ad9bda252d5e5427204e3cf4487cf8378168))
* **cli:** 小程序端支持在 scss 文件中引用 node_modules 中的样式文件 ([aaecb79](https://github.com/NervJS/taro/commit/aaecb7941979e10bcce48fb0d545ac2004019a82))
* **cli webpack-runner:** 为页面文件添加了文件名 ([23c1628](https://github.com/NervJS/taro/commit/23c1628a20d7f48b518342c8a58a9f6c2ff1f6e7))
* **cli webpack-runner router components:** h5的一些更新 ([3fedd67](https://github.com/NervJS/taro/commit/3fedd67f36a33f8397a7016e1abb71d6140ad14f))
* **router:** h5 router功能初步重构完成 ([599b0cc](https://github.com/NervJS/taro/commit/599b0cc22e572f5942fe40d5e1f8023bda8c86d7))
* **taroize:** 支持直接用 this.foo 表示 class 计算属性 `foo`, close [#1381](https://github.com/NervJS/taro/issues/1381) ([66424fd](https://github.com/NervJS/taro/commit/66424fdf117564b101b36003ff4438cb652c94d6))


### Reverts

* **taro-h5:** h5 request 请求不设置默认 content-type ([ae5c42b](https://github.com/NervJS/taro/commit/ae5c42ba05a84378fe30a0319fc02d5df8de8d00))



# [1.2.0-beta.9](https://github.com/NervJS/taro/compare/v1.2.0-beta.8...v1.2.0-beta.9) (2018-12-05)



# [1.2.0-beta.8](https://github.com/NervJS/taro/compare/v1.2.0-beta.7...v1.2.0-beta.8) (2018-12-05)


### Bug Fixes

* **cli:** add "allowjs": true to tsconfig.json fix [#1332](https://github.com/NervJS/taro/issues/1332) ([#1340](https://github.com/NervJS/taro/issues/1340)) ([4bae06f](https://github.com/NervJS/taro/commit/4bae06f21a68525145019369525140f5fd9df1d8))
* **cli:** taroize 转换时 tabbar 图片处理 ([5c8ca3a](https://github.com/NervJS/taro/commit/5c8ca3a26608757bff161a3598f6cd97e347b491))
* **cli:** taroize 转换时转换目录保留 node_modules 目录 ([0c894bd](https://github.com/NervJS/taro/commit/0c894bdb29b088531f30bc9cffd3118cdea8b3d6))
* **cli:** taroize 转换样式中依赖样式时，支持绝对路径 ([4312bf2](https://github.com/NervJS/taro/commit/4312bf21e239819d956e6252b7474601637f857f))
* **cli:** taroize 转换避免 copy 同样的图片文件 ([3b4fbe9](https://github.com/NervJS/taro/commit/3b4fbe908edce77680af075c0a80c98b00394eb3))
* **cli:** typescript 模式下显示 Taro 未被使用，close [#1332](https://github.com/NervJS/taro/issues/1332) ([c7a50a6](https://github.com/NervJS/taro/commit/c7a50a6fed4062222541c20e0df41f52e4bb3431))
* **cli:** 修复config.root为stringLiteral类型时的bug ([68b24f2](https://github.com/NervJS/taro/commit/68b24f254c72004d833c8fa3328a38809c6c663d))
* **cli:** 组件依赖 node_modules 组件时依赖解析错误 ([c968e60](https://github.com/NervJS/taro/commit/c968e60a5730f167ed80d6ef3ad0ac03e7f87399))
* **mobx:** 修复小程序HOC中无法获取inject props的问题([#1313](https://github.com/NervJS/taro/issues/1313)) ([#1379](https://github.com/NervJS/taro/issues/1379)) ([e7eda61](https://github.com/NervJS/taro/commit/e7eda619511b6c58f3fe9f9d2cbf56e13f385eab))
* **taro-alipay:** setData 触发的 didUpdate 不需要更新组件 ([34e2c47](https://github.com/NervJS/taro/commit/34e2c47c116e5a298489f02f641c471ceb02f1ec))
* **taro-components:** 修复 picker 组件更新问题 close [#731](https://github.com/NervJS/taro/issues/731) close [#1157](https://github.com/NervJS/taro/issues/1157) ([febc6ff](https://github.com/NervJS/taro/commit/febc6ffcce158638fe2388bc57c78ea8eb7a10d2))
* **taro-components:** 修复RadioGroup返回给 onChange事件是undefined close [#985](https://github.com/NervJS/taro/issues/985) ([0823f59](https://github.com/NervJS/taro/commit/0823f592c284a34881fa12d08c5bcd4654903389))
* **taro-components:** 修复Taro的Picker组件的输入输出行为和微信小程序的不一致 close [#1281](https://github.com/NervJS/taro/issues/1281) ([ac77c87](https://github.com/NervJS/taro/commit/ac77c87888d2a48c406b0cc05d5eca69bd1517df))
* **taroize:**  class 内部 wx. 开头的函数不会转换为 Taro.func() ([5d01b3c](https://github.com/NervJS/taro/commit/5d01b3cc8396104c5ed7a0793b5387afc39683d8))
* **taroize:** export default 和装饰器混用导致 babel 解析失败 ([146e6c6](https://github.com/NervJS/taro/commit/146e6c6c489f1e62d612b526a020e83d16bf9f5e))
* **taroize:** 不转换 Component.methods 的方法 ([b745bfe](https://github.com/NervJS/taro/commit/b745bfe290628ee20550d0d1bac5a622ab32457c))
* **taroize:** 多个 wx:elif 嵌套无效 ([c6d6b93](https://github.com/NervJS/taro/commit/c6d6b938be5dda9df4a6a9b58966c0e97a86017a))
* **taroize:** 带空格的字符串经过 babel-template 处理会报错 ([eeb3f74](https://github.com/NervJS/taro/commit/eeb3f74bd2f521b223f210494719c4b5df832a54))
* **taroize:** 循环的 item 和 index 不会加入 state ([183f8eb](https://github.com/NervJS/taro/commit/183f8eb8d196ddcbd05529b2370ab6b6b782f4f9))
* **taroize:** 支持所有 wxparse 式的对象 alias 写法 ([a1187f5](https://github.com/NervJS/taro/commit/a1187f541d17f1efb128e5d53445e98bd718d81f))
* **transformer:** 由 taroize 转出来的组件不需要 internal_style 函数 ([f5ded7a](https://github.com/NervJS/taro/commit/f5ded7ab179d144b3a9dfd88757685e2e90f4e8c))
* **webpack-runner:** windows 下处理 esnextModules 路径错误 ([207dec1](https://github.com/NervJS/taro/commit/207dec1a849a14ba2abcfa5d6fcd8ef60540fb06))
* **with-weapp:** Page.onLoad 的第一个参数是路由器参数 ([ec80886](https://github.com/NervJS/taro/commit/ec80886d347edcb3b777a28ec63879c7b2481ab0))
* **with-weapp:** setData 更新数据同步，渲染异步 ([717f7b2](https://github.com/NervJS/taro/commit/717f7b219a19660f35e708b1b660946f54f985f8))


### Features

* **cli:** taroize 转换图片链接为网络图片时不做处理 ([5cf347b](https://github.com/NervJS/taro/commit/5cf347bde18a387ddec717055ef9dfb6950a1621))
* **cli:** taroize 转换时 jsx 中引用图片处理 ([d608d8c](https://github.com/NervJS/taro/commit/d608d8ce787efaf9aefc73fd798be04c299d584d))
* **cli:** taroize 转换时入口文件增加 H5 端的初始化，close [#1329](https://github.com/NervJS/taro/issues/1329) ([01e97e2](https://github.com/NervJS/taro/commit/01e97e20e0f95e4e65e277f04a5521fa6211a472))
* **cli:** taroize 转换样式文件处理，尺寸单位转换 ([083ec58](https://github.com/NervJS/taro/commit/083ec583952d0f57bd7970f753c245931dabc446))
* **cli:** 支持编译 node_modules 中的包，close [#1358](https://github.com/NervJS/taro/issues/1358) ([8514833](https://github.com/NervJS/taro/commit/85148335393c45b121b85da585aa716aca6ad888))
* **taroize:** 使用 JavaScript 保留字循环报错 ([2a81b6d](https://github.com/NervJS/taro/commit/2a81b6dab580e88bef95f72c1439f0d72f66c4df))
* **taroize:** 在类中调用 微信钩子函数转换为相应地 Taro 钩子函数 ([e4d9e67](https://github.com/NervJS/taro/commit/e4d9e67d9b051031914efa44580ce1ca80e8a142))
* **taroize:** 支持 wxParse 的 alias 写法 ([3f95b44](https://github.com/NervJS/taro/commit/3f95b4476420b01be3d950e8f7111301661f84ce))
* **taroize:** 改进报错信息 ([93ec0d8](https://github.com/NervJS/taro/commit/93ec0d8cc7eb7e38cfe1e82223298c86c2a982ef))
* **taroize:** 转换 slot 为 this.props.children ([4a79cbd](https://github.com/NervJS/taro/commit/4a79cbd098404774416cf0a9684c78f172ef1338))



# [1.2.0-beta.7](https://github.com/NervJS/taro/compare/v1.2.0-beta.6...v1.2.0-beta.7) (2018-12-02)


### Bug Fixes

* **cli:** 修复小程序以及RN下decorator在class property无效的问题 ([0dafcda](https://github.com/NervJS/taro/commit/0dafcdad576ccef984840ea34449cdf8992660cf))
* **eslint:** JSX 事件名命名误报，close [#1295](https://github.com/NervJS/taro/issues/1295) ([3a6c822](https://github.com/NervJS/taro/commit/3a6c82266574ff3372bc9f85de9bf012a5109888))
* **taroize:** 处理 data 未被预先定义又在 wxml 使用的情况 ([ec6372d](https://github.com/NervJS/taro/commit/ec6372d71bba0b05af7db3b06428c2820a84906c))
* **taroize:** 当只有一个 wx:for-item 也可以触发遍历 ([d9dc968](https://github.com/NervJS/taro/commit/d9dc96848bf98979bbbcb4fddbd0779c6c986dfd))
* **transformer:** render props 嵌套解析失败，close [#1306](https://github.com/NervJS/taro/issues/1306) ([a2ef2bb](https://github.com/NervJS/taro/commit/a2ef2bb8ea558771c901b417a4fd9c6aaf0c7a21))
* **webpack-runner:** 修复部分配置覆盖错误的问题 ([08a70f3](https://github.com/NervJS/taro/commit/08a70f364fb91fc72cc031ace0acc121f285d473))


### Features

* **cli:** Watch时也能支持压缩 ([#1219](https://github.com/NervJS/taro/issues/1219)) ([ccb05b1](https://github.com/NervJS/taro/commit/ccb05b179cbb1591a1f866659423f8de65923e12))
* **cli:** 优化 ui 库样式处理 ([1c7f615](https://github.com/NervJS/taro/commit/1c7f6156daa93505709fc03924f2ace45e669d96))
* **cli:** 支持自定义输出文件类型 ([c56f9fc](https://github.com/NervJS/taro/commit/c56f9fc71d667508bffad5bc85144549ce7be878))
* **webpack-runner:** 增加了对esnextmodules内样式文件的处理 ([747f653](https://github.com/NervJS/taro/commit/747f653a037e0ac182e6a4b90f8200c81f9eab55))



# [1.2.0-beta.6](https://github.com/NervJS/taro/compare/v1.2.0-beta.5...v1.2.0-beta.6) (2018-11-30)


### Bug Fixes

* **cli:** 第三方包路径替换错误，close [#1308](https://github.com/NervJS/taro/issues/1308) ([2d4b8ea](https://github.com/NervJS/taro/commit/2d4b8ea5d38542658fc2c54c86c61e36d085b54d))
* **taro-rn:** 修复打包独立应用启动报错：未注册 main, fix [#1225](https://github.com/NervJS/taro/issues/1225) ([636f355](https://github.com/NervJS/taro/commit/636f355aedc9645b94b5a9add8a523adf03b5eb0))



# [1.2.0-beta.5](https://github.com/NervJS/taro/compare/v1.2.0-beta.4...v1.2.0-beta.5) (2018-11-29)


### Bug Fixes

* **cli:** 编译到支付宝小程序 npm 依赖带 @ 的npm 包时路径没有替换，closes [#1234](https://github.com/NervJS/taro/issues/1234), closes [#1290](https://github.com/NervJS/taro/issues/1290) ([defa3ce](https://github.com/NervJS/taro/commit/defa3ce47343de0c3941c5acbdf452c134302792))
* **CLI:** installNpmPkg 方法中添加 Yarn 安装的方式 ([41a9b77](https://github.com/NervJS/taro/commit/41a9b773f725906eae56ad20f56fa34714b30fbc))
* **RN:**  @tarojs/plugin-sass 包未安装时样式文件不生成的问题 ([21107dc](https://github.com/NervJS/taro/commit/21107dc77268098d4a64e356c4415a83e6e0d2d5))
* **taro-alipay:** 支付宝小程序网络请求设置默认 content-type, close [#1291](https://github.com/NervJS/taro/issues/1291) ([10d1a72](https://github.com/NervJS/taro/commit/10d1a72510dd51d991ef911acca3a3935a7cf46b))
* **taro-compontents:** 修复 swiper 问题，发布新版 close [#1261](https://github.com/NervJS/taro/issues/1261) [#1204](https://github.com/NervJS/taro/issues/1204) [#1190](https://github.com/NervJS/taro/issues/1190) [#1071](https://github.com/NervJS/taro/issues/1071) ([afb2bc8](https://github.com/NervJS/taro/commit/afb2bc810cb8aee35ca981b4336b9ea383b6328d))
* **taro-h5:** h5 网络请求设置默认 content-type, close [#1280](https://github.com/NervJS/taro/issues/1280) ([103f730](https://github.com/NervJS/taro/commit/103f7301f1be726ecc5ab2a164ff009cd0ffdb25))
* **taroize:** 当 wx:for 的父级是 block 编译时失败, close [#1303](https://github.com/NervJS/taro/issues/1303) ([d2ffe31](https://github.com/NervJS/taro/commit/d2ffe319fa24e6aaac94a68355fc5a5f2747b4d5))
* **taroize:** 找不到小程序组件实例无法生成 wxml ([205f784](https://github.com/NervJS/taro/commit/205f78463cc4ba3909f670620542bed012fa4f71))
* **transformer:** 所有 ref 都被当成 loop ref 来处理 ([18cd99c](https://github.com/NervJS/taro/commit/18cd99c232c883e65d896e8417dc6f7493840cde))


### Features

* **cli:** ui 库打包优化 ([320f80c](https://github.com/NervJS/taro/commit/320f80cdcf65577945c82a297ae9bdde0770a9bf))
* **cli:** 监听非 源码目录 ([#1242](https://github.com/NervJS/taro/issues/1242)) ([8c8e871](https://github.com/NervJS/taro/commit/8c8e871715d5478303efd10392e5f7ec803b30a2))
* **mobx:** Mobx优化 ([#1276](https://github.com/NervJS/taro/issues/1276)) ([138c282](https://github.com/NervJS/taro/commit/138c282ec1fad9f4689c2fb4702c3c9175be1a2d)), closes [#1262](https://github.com/NervJS/taro/issues/1262)
* **transformer:** 支持在 switch-case 中使用 JSX，close [#1275](https://github.com/NervJS/taro/issues/1275) ([82a6100](https://github.com/NervJS/taro/commit/82a6100e212bbb247084e827151c5484797f5000))
* **webpack-runner:** h5支持esnextModules配置 ([2b759b5](https://github.com/NervJS/taro/commit/2b759b53a797c39242224d4ff5bc1be4bc6a7fe8))
* simple ID generate for every swiper instance. ([b29db89](https://github.com/NervJS/taro/commit/b29db8924a3a234d424b9f2f82ab375434b3a16f))


### Reverts

* Revert "feat(transformer): 当自定义组件需要组织冒泡时加入 `data-e-stop`" ([a49df38](https://github.com/NervJS/taro/commit/a49df38f26a492c0f0b5a4c75f70b7fa4cba5f23))



# [1.2.0-beta.4](https://github.com/NervJS/taro/compare/v1.2.0-beta.3...v1.2.0-beta.4) (2018-11-28)


### Bug Fixes

* **router-h5:** iOS12里面返回Hash会丢问题 ([#1285](https://github.com/NervJS/taro/issues/1285)) ([1bceea3](https://github.com/NervJS/taro/commit/1bceea38315b3550eed5b3d596f7d503d32cba1e))
* generateScopedName ([#1286](https://github.com/NervJS/taro/issues/1286)) ([00e288b](https://github.com/NervJS/taro/commit/00e288ba6185a78b94e7885a5740b24fd7432843))
* **cli:** 当配置 npm 目录时路径替换可能不正确 ([3974aaf](https://github.com/NervJS/taro/commit/3974aafeed96547eb9d4ea41ea313885d6bdfbd9))
* **cli:** 编译到支付宝时路径中的 @ 替换为 _ ([d09cc2d](https://github.com/NervJS/taro/commit/d09cc2d563846bf5d8039b74ce88694e0ec7cec5))
* **router:** 修复router打包后仍存在部分非法关键字的问题 ([3d6e5e8](https://github.com/NervJS/taro/commit/3d6e5e8519817ad817c08edffb9c0e92e897511d))
* **taro-rn:** 更改taro-rn的导出方式,close[#1238](https://github.com/NervJS/taro/issues/1238) ([cac3010](https://github.com/NervJS/taro/commit/cac3010ba25ec9eafeed82a11ac090474675dad4))
* **taro-weapp:** 修复request abort的暴露方式 ([43c23a9](https://github.com/NervJS/taro/commit/43c23a9defce1480c4ef0b8ebeea7e33c44999b9))
* **taro-weapp:** 修复requestTask的调用方式 ([a06f33c](https://github.com/NervJS/taro/commit/a06f33ce3228b4a574f23d4465395213c60f821e))
* **taro-weapp:** 增加 getElementById 函数供编译时在循环中获取 ref 节点使用 ([a52fdc4](https://github.com/NervJS/taro/commit/a52fdc494ec94cfcde4b271b63576daff13b2e49))
* **taro-wepaa:** 修复request abort的暴露方式 ([b2c035c](https://github.com/NervJS/taro/commit/b2c035ca6eaa12331df4350228d2ab227bbc6ea3))


### Features

* **transformer:** 当自定义组件需要组织冒泡时加入 `data-e-stop` ([cee4462](https://github.com/NervJS/taro/commit/cee446286575905870add9987e13c75369af95a5))
* **transformer:** 支持在循环中使用 ref ([292c945](https://github.com/NervJS/taro/commit/292c9458ca3b26cbdcbc9d14901a16efc94f90b8))



# [1.2.0-beta.3](https://github.com/NervJS/taro/compare/v1.2.0-beta.2...v1.2.0-beta.3) (2018-11-26)


### Bug Fixes

* **taro:** 修复多个小程序 request 请求 abort 的 露出方式 ([527d168](https://github.com/NervJS/taro/commit/527d1684524656ac4dd03cef3aafdcbba0c69701))
* **taro:** 百度/支付宝/头条小程序运行时框架同步微信小程序员运行时框架修改 && 部分 eslint 问题修复 ([528735f](https://github.com/NervJS/taro/commit/528735f2353f057d8e137ea354b8564fd65a6aa5))
* **taro-weapp:** 修复request abort的暴露方式 ([9eb0bf4](https://github.com/NervJS/taro/commit/9eb0bf4bdb63e0e987a743075a3c0287d7aed81a))
* **taro-weapp:** 修复requestTask的调用方式 ([a0cb8d3](https://github.com/NervJS/taro/commit/a0cb8d3c5124d802cf6084ece2236039965b89bc))
* **transformer:** 如果多层循环的 callee 是函数编译错误，[#1223](https://github.com/NervJS/taro/issues/1223) ([46e70a8](https://github.com/NervJS/taro/commit/46e70a808e49c9e71d312c87e9a046f50ef62e27))
* **transformer:** 字符串模板会被转换为 unicode，close [#1245](https://github.com/NervJS/taro/issues/1245) ([a783d36](https://github.com/NervJS/taro/commit/a783d3665d76e481649e0c1859cb66e27523a36b))
* **transformer:** 循环中定义的 JSX 无法正确处理 callee，close [#1223](https://github.com/NervJS/taro/issues/1223) ([ecb0584](https://github.com/NervJS/taro/commit/ecb0584c72f218ff9bbc9472ae283c0da8a77094))
* **transformer-wx:** 修复编译器适配类型 ([486e33a](https://github.com/NervJS/taro/commit/486e33a350279a437f8c15366b82a7e882224a36))


### Features

* **cli:** redux 模板加入 redux-devtools 配置，close [#1246](https://github.com/NervJS/taro/issues/1246) ([472ced8](https://github.com/NervJS/taro/commit/472ced8e1fa201cccd5097dc06e363b017e5bbae))
* **cli:** 头条小程序根据 project.tt.json 生成项目配置文件 ([731cf48](https://github.com/NervJS/taro/commit/731cf48c6ddbfa036bce31dcdcb528dd119b3913))
* **cli:** 头条小程序编译适配 ([7991846](https://github.com/NervJS/taro/commit/7991846dc4be16406dc419ba70bc87ebb814caaa))
* **taro-h5:** 新增简化版chooseImage api ([e4724d0](https://github.com/NervJS/taro/commit/e4724d09e14be7024707b7af5d71594d5d0711ba))
* **taro-tt:** 增加头条小程序运行时适配框架 ([9296268](https://github.com/NervJS/taro/commit/9296268589b8b3373fe244218435df455b0d7e56))



# [1.2.0-beta.2](https://github.com/NervJS/taro/compare/v1.2.0-beta.1...v1.2.0-beta.2) (2018-11-23)


### Bug Fixes

* **showActionSheet:** fix未设置webkitTransform导致菜单不能弹出的bug ([#1217](https://github.com/NervJS/taro/issues/1217)) ([0f7678f](https://github.com/NervJS/taro/commit/0f7678f62ba7e1e32f7a17fe570ab6b1b0874cae))
* **taro-alipay:** 修复 removeStorageSync fix [#1207](https://github.com/NervJS/taro/issues/1207) ([638c3fb](https://github.com/NervJS/taro/commit/638c3fbfaa735c1bc48044b156c45edf2bb507c5))
* **taro-alipay:** 修复支付宝小程序 query 对象没有 in 方法的问题 fix [#1224](https://github.com/NervJS/taro/issues/1224) ([ff2d6f0](https://github.com/NervJS/taro/commit/ff2d6f0d12e72e1dc4955f5892a237d955a24d10))
* **taro-cli:** 解决组件循环依赖不断编译爆栈的问题 fix [#696](https://github.com/NervJS/taro/issues/696) ([e735cb3](https://github.com/NervJS/taro/commit/e735cb3d7ab7e9c15320b5518800593abedb2735))
* **taro-redux:** store 变化后被影响的 Component 立即做 setData 更新。防止子组件在 observe 更新的情况下重新计算 props ，从而覆盖掉 redux 修改的 props。fix [#1125](https://github.com/NervJS/taro/issues/1125) ([375ab1d](https://github.com/NervJS/taro/commit/375ab1db058f9ac72d1acadbb41d1ca930ca1f2a))
* **transformer:** 在同一文件中重复 import, close [#1208](https://github.com/NervJS/taro/issues/1208) ([3e0b82f](https://github.com/NervJS/taro/commit/3e0b82f7dca2c338a4cf89c8ef0f3a4c3211a7e6))
* **transformer:** 当 if block 中有 JSX 定义而不是 return，不会重命名 ([341101a](https://github.com/NervJS/taro/commit/341101a5e973f729d1b2b21986a907b9fa67144e)), closes [#1209](https://github.com/NervJS/taro/issues/1209)
* **transformer:** 生成匿名数组需要带上父组件的条件判断, close [#1228](https://github.com/NervJS/taro/issues/1228) ([4ebd214](https://github.com/NervJS/taro/commit/4ebd2145e5e9670fa2c942389b56105c0fdf75ce))
* **webpack-runner:** H5 端 postcss 插件 bug 修复 ([6793ce2](https://github.com/NervJS/taro/commit/6793ce2f56d5e035d6f980c04eb9f97c39e18813))
* **webpack-runner:** 修复h5样式丢失的问题 ([64d8cc4](https://github.com/NervJS/taro/commit/64d8cc4a452fb38dad063225f919838e9ffe474c))
* node-sass 编译有时候无输出的 bug ([e011610](https://github.com/NervJS/taro/commit/e011610236dc28b43161bae7379f94b819145e88))


### Features

* **taro:** add getAccountInfoSync API fix [#1222](https://github.com/NervJS/taro/issues/1222) ([1c0894d](https://github.com/NervJS/taro/commit/1c0894d71bb6edf1aabc29e75ad650858db40474))
* **taro-components:** 修改 Swiper 组件 ([a2e80ca](https://github.com/NervJS/taro/commit/a2e80ca5ec587e6e899e21b62d1ec0a3197b9d00))
* **taro-h5:** 新增 setNavigationBarTitle api ([f5523cc](https://github.com/NervJS/taro/commit/f5523ccf57b43752c5d3f7c6d871330de640294b))
* **transformer:** 加入头条小程序适配器 ([1a17207](https://github.com/NervJS/taro/commit/1a17207b645e5b17626857a01f39a64b0167cd4a))
* **transformer:** 支持多层 if 语句嵌套, close [#1036](https://github.com/NervJS/taro/issues/1036) ([8931734](https://github.com/NervJS/taro/commit/8931734050fdeb005449e6c9c7cf41fc28f7d249))



# [1.2.0-beta.1](https://github.com/NervJS/taro/compare/v1.2.0-beta.0...v1.2.0-beta.1) (2018-11-22)



# [1.2.0-beta.0](https://github.com/NervJS/taro/compare/v1.1.9...v1.2.0-beta.0) (2018-11-22)


### Bug Fixes

* **cli:** convertor js 重复拷贝文件 ([ee0122e](https://github.com/NervJS/taro/commit/ee0122eb0b5e0fc97d7aada84a953abecc62ab74))
* **cli:** convertor 文件转换报错 ([c1b3c81](https://github.com/NervJS/taro/commit/c1b3c811b74c50bbca2b1b0c648fb7abe89668b3))
* **cli:** taroize 转换依赖组件路径允许为项目下的绝对路径 ([4cbe987](https://github.com/NervJS/taro/commit/4cbe987877e7a8d914fcc724248497e58d24fbcb))
* **cli:** taroize 转换组件依赖读取错误 ([93ef18a](https://github.com/NervJS/taro/commit/93ef18a9be183f032d581b9689d6c6fa1f441373))
* **eslint:** 允许对 this.props.children 使用逻辑/条件表达式，close [#1195](https://github.com/NervJS/taro/issues/1195) ([e80eaa6](https://github.com/NervJS/taro/commit/e80eaa6e094a4640b980e3f91f0ef9d90c3eb2dd))
* **h5:** 修复selectorQuery.in 在H5平台上不支持的问题 ([#1188](https://github.com/NervJS/taro/issues/1188)) ([9cd8340](https://github.com/NervJS/taro/commit/9cd8340ad15fd12e20ccba0be9467391f96c4fb2))
* **taro-components-rn:** Button组件可嵌套View组件 ([37fa493](https://github.com/NervJS/taro/commit/37fa49317ad2be3d8e67bd8677744bae4b7b4c27))
* **taro-components-rn:** 销毁组件前，从内存 unload 音频 ([ec6978f](https://github.com/NervJS/taro/commit/ec6978f5b28bce8df6c60a4cbd61b94c20245913))
* **taro-components-rn:** 音频5倍速，图片导致的性能问题 ([ad66af3](https://github.com/NervJS/taro/commit/ad66af3f9404d866972d210544ee8d72d534a60a))
* **taro-components-rn:** 音频播放速率写死5了 ([b413f67](https://github.com/NervJS/taro/commit/b413f678df517190be3e59f36d0785461d3aa249))
* **taro-weapp:** 修复父组件 setState null 时，传到子组件时被过滤掉的问题 fix [#1151](https://github.com/NervJS/taro/issues/1151) ([0ec931d](https://github.com/NervJS/taro/commit/0ec931d7798341e3261c8894cd4c63993d44b50f))
* **taro-weapp:** 小程序 diff 在新对象缺失旧对象的某些属性时，不再递归 diff，而是直接赋值。fix [#1058](https://github.com/NervJS/taro/issues/1058) ([adbc78d](https://github.com/NervJS/taro/commit/adbc78d2e24469d485ee07337611b466d5cedfc0))
* **taro-weapp:** 小程序每次 setData 都独立生成一个 callback 数组，防止污染 fix [#1185](https://github.com/NervJS/taro/issues/1185) ([e7d1190](https://github.com/NervJS/taro/commit/e7d11900ae1d323506d135f2e35ce040c5b3634a))
* **taro-weapp:** 给request api暴露abort方法([#1178](https://github.com/NervJS/taro/issues/1178)) ([84315ea](https://github.com/NervJS/taro/commit/84315ea2e222f76ef801d8c5f03712ac2e580ccb))
* **taroize:**  当 children 有空格的情况 ([3f58c90](https://github.com/NervJS/taro/commit/3f58c90180eb1fde34bf265f8c07ec1b37b9e667))
* **taroize:** if 嵌套报错 ([a841c88](https://github.com/NervJS/taro/commit/a841c8861e96c090d847360a3815c1826dcbfdea))
* **taroize:** npm 包文件缺失 ([030ee5c](https://github.com/NervJS/taro/commit/030ee5cfd4383ff49f443ff5116cd4b03c5ecc05))
* **taroize:** 不再忽略 async/await ([01c5f7c](https://github.com/NervJS/taro/commit/01c5f7c79962dd39c816b824b26e23df6a0083b1))
* **taroize:** 使用组件重复添加 ([1905fe7](https://github.com/NervJS/taro/commit/1905fe7db787a062299ad5d7e18c4a2aeff21914))
* **taroize:** 取消 this.state 的缓存 ([bd25e53](https://github.com/NervJS/taro/commit/bd25e53e3581532396d431f2b7b5858cd5ccaf0f))
* **taroize:** 正则无法匹配 ... 语法失败 ([2ccff88](https://github.com/NervJS/taro/commit/2ccff887c2c311f798c4e1c49ace0105b6027f97))
* **taroize:** 没有 data 时报错 ([de2e1bd](https://github.com/NervJS/taro/commit/de2e1bd3844d1b82b7a100e4e84cb1611cdbf29d))
* **taroize:** 注释嵌套编译报错 ([149d819](https://github.com/NervJS/taro/commit/149d81977606a997177c9240e497b9468b9292d9))
* **taroize:** 注释或空的 text 节点导致编译错误 ([484f226](https://github.com/NervJS/taro/commit/484f2266c90beaeb89291b7c3eb92a19891e060e))
* **taroize:** 生命周期 typo ([1acf465](https://github.com/NervJS/taro/commit/1acf465f6d98581bd9abfc38418f9ec2d25ce203))
* **taroize:** 生命周期是对象函数缩写时报错 ([ae22233](https://github.com/NervJS/taro/commit/ae222334189d8644537247bfcb5bc4ff6f96dd33))
* **taroize:** 生成文件没有import @tarojs/with-weapp ([f028bfe](https://github.com/NervJS/taro/commit/f028bfe74de8df5c038c9060145c912680ea5eb2))
* **tarozie:** props 需要在 render 结构 ([46736d8](https://github.com/NervJS/taro/commit/46736d8ea0c94c246f1faa5bda45d495e7b03af4))
* **transformer:**  globalData 无效的问题 ([167c386](https://github.com/NervJS/taro/commit/167c3869d182145763e6c3712fa630ea348e5e5e))
* **transformer:** state ，props ，自定义变量组件名重复，close [#411](https://github.com/NervJS/taro/issues/411), close [#109](https://github.com/NervJS/taro/issues/109) ([0383991](https://github.com/NervJS/taro/commit/0383991ac1fe1925a01a8bd991f000f2897d67fd))
* **transformer:** 循环嵌套报错 ([720c36d](https://github.com/NervJS/taro/commit/720c36dd32cc0ddff33fecf6d647ed0f2d975ba8))
* **with-weapp:** 装饰器参数为`Component` ([495ca99](https://github.com/NervJS/taro/commit/495ca99972574163dfda913b0f5dc8b60083ed42))


### Features

* **cli:** support css module feature ([#1007](https://github.com/NervJS/taro/issues/1007)) ([9fb6747](https://github.com/NervJS/taro/commit/9fb67473c834a76bf32ae5c0eaff1afb91c83053))
* **cli:** 优化小程序端 css modules 处理 ([be844ed](https://github.com/NervJS/taro/commit/be844ed79d8991e849132f12352a34e7ece5bd17))
* **cli:** 增加 taro convert 命令 ([8d7fb7e](https://github.com/NervJS/taro/commit/8d7fb7ee1ec369ada6fff4f9b23b20630a6d44e8))
* **cli:** 处理 imports ([4438582](https://github.com/NervJS/taro/commit/44385826da693b19fac2b7c0e9476ddea11095c6))
* **cli:** 小程序转 taro 代码 wxs 文件处理 ([519b0f5](https://github.com/NervJS/taro/commit/519b0f540184c62f24b165ff4915256ad72e1d43))
* **cli:** 小程序转 taro 处理组件以及样式依赖 ([c56d546](https://github.com/NervJS/taro/commit/c56d5465f7807961e339723908dcf2ff9e8a4fdb))
* **cli:** 小程序转 Taro 文件引用关系处理 ([1369688](https://github.com/NervJS/taro/commit/136968867c78c46b07918ee3ebc9a70771e828d3))
* **cli:** 小程序转 taro 组件依赖转换为 taro 写法 ([3e74142](https://github.com/NervJS/taro/commit/3e74142e2ec1587c35c73b3864dcf79c8fcede5c))
* **cli:** 小程序转 taro 补充配置文件生成 ([02f92ef](https://github.com/NervJS/taro/commit/02f92ef62d25f9ec5842894238c296611e45655b))
* **mobx:** 加入mobx支持 ([#972](https://github.com/NervJS/taro/issues/972)) ([cfa2978](https://github.com/NervJS/taro/commit/cfa29788302cad775c3ed1df100c7889e72d91d4))
* **taro-components-rn:** 新增组件 Map ([0f0e97b](https://github.com/NervJS/taro/commit/0f0e97bdc856e528fd43695a82816ec170758ae2))
* **taro-weapp:** 增加 this.$componentType 来判断当前 Taro.Component 是页面还是组件 fix [#1166](https://github.com/NervJS/taro/issues/1166) ([b35d1bd](https://github.com/NervJS/taro/commit/b35d1bded5f2993baa3685e93027fd7527bf07be))
* **taroize:**  `properties` 可以转化为 `defaultProps` ([66d691b](https://github.com/NervJS/taro/commit/66d691b228197097799f61b2524234b71c1169f7))
* **taroize:**  不再移除 JSX 的注释 ([86cec7a](https://github.com/NervJS/taro/commit/86cec7a8113e430ecc71a2c31ba6ed027d907abc))
* **taroize:** class 带上 withWeapp 装饰器 ([215b8c0](https://github.com/NervJS/taro/commit/215b8c0eef73c5734b2852f66d7f3e8298553506))
* **taroize:** json/script/wxml 均可传空值 ([902c697](https://github.com/NervJS/taro/commit/902c69713854e3c9086c77ed9dbbb22d12f337bf))
* **taroize:** render 函数和 parseWxml 结合 ([de8f5ae](https://github.com/NervJS/taro/commit/de8f5ae777217bd44b62ed85a4addb42e2cbd3a2))
* **taroize:** setData polyfill ([a656632](https://github.com/NervJS/taro/commit/a656632b3f42484e706e0ae393452c88540b671f))
* **taroize:** 事件名需要加 this ([0dadefa](https://github.com/NervJS/taro/commit/0dadefa9842f08aade275639e78298deeb5db1d4))
* **taroize:** 加入 index.js 导出项目 ([9a19b33](https://github.com/NervJS/taro/commit/9a19b33f1f5129699b8972afc08af32c6abb880b))
* **taroize:** 增加 taro convert 文件 ([fbcade2](https://github.com/NervJS/taro/commit/fbcade279f3966dd337fa76d886df3859c0ff353))
* **taroize:** 处理端能力 API ([cd5b756](https://github.com/NervJS/taro/commit/cd5b75643fafc5a03f598e5631db7d04b619dfd5))
* **taroize:** 支持 App() 入口文件 ([47a7103](https://github.com/NervJS/taro/commit/47a71036932e3f8a8f9f83408b565cfa27ffcf39))
* **taroize:** 支持 template::import ([f9db8e5](https://github.com/NervJS/taro/commit/f9db8e59b7aa0382feb337fd62a2b815aca8693d))
* **taroize:** 支持 template::include ([fca9a88](https://github.com/NervJS/taro/commit/fca9a88b39c33d2e8dd37d17552c172a8ab8ec5a))
* **taroize:** 支持 template::is 使用组件 ([5ac9bac](https://github.com/NervJS/taro/commit/5ac9bac92baba2e87116a45559561ede8e43ecb7))
* **taroize:** 支持 wxml 不传入标签 ([e9b1632](https://github.com/NervJS/taro/commit/e9b163227a27b6bf074290e37d911a32ebef6620))
* **taroize:** 支持 wxs ([061311c](https://github.com/NervJS/taro/commit/061311cad9989864410068d4609d537e219f8015))
* **taroize:** 支持使用 template::name 声明组件 ([0167dd3](https://github.com/NervJS/taro/commit/0167dd351cd62edb28fa96fbb7d2edf85c94f2c0))
* **taroize:** 支持内联 wxs module, close [#1000](https://github.com/NervJS/taro/issues/1000) ([777b528](https://github.com/NervJS/taro/commit/777b5283edeb66e0deed08addd637bd69e81802c))
* **taroize:** 支持编译组件 ([8374d4e](https://github.com/NervJS/taro/commit/8374d4e866a321a799f1516d9f1c992a25d9f22e))
* **taroize:** 支持解析 config.json ([efa50cc](https://github.com/NervJS/taro/commit/efa50cc6bf7a78abbbdbd672afca790c1f1207a1))
* **taroize:** 支持解析多个根节点的 wxml ([074aaff](https://github.com/NervJS/taro/commit/074aaff9e910ad27aec6d559e8f236d63362c9f9))
* **transformer:** 支持 parse wxml 的 Text 类型和 Coment 类型 ([a3f81ca](https://github.com/NervJS/taro/commit/a3f81ca0803966151ebe9a0b7dce42e4c46a9f7d))
* **transformer:** 支持转换循环 ([86c1f70](https://github.com/NervJS/taro/commit/86c1f702a687204c5f3dc0516d44b482d40f6a50))
* **webpack-runner:** h5支持cssModules ([e463300](https://github.com/NervJS/taro/commit/e46330087e7b8f4669f7466501e054b7fab70aef))
* **webpack-runner:** h5支持自定义postcss插件 ([2c92757](https://github.com/NervJS/taro/commit/2c92757b1522ac27bcb58cdb15ffb6f1d6a50471))
* **with-weapp:** 支持 globalData ([2a387bf](https://github.com/NervJS/taro/commit/2a387bf781a8a5af46b9b360fa5da33760769a13))
* **with-weapp:** 支持 properties::observer ([dad17ef](https://github.com/NervJS/taro/commit/dad17efd02cc720d08507bc9e2d2fe84fcdd5b11))
* **with-weapp:** 更新 rollup 配置 ([3ec46b4](https://github.com/NervJS/taro/commit/3ec46b44e3b36c90b8ba82d3cd249ef94ce6be22))
* **wx-to-taro:** 处理特殊键值 ([0a8475d](https://github.com/NervJS/taro/commit/0a8475da3ea800466470ce77abd790f47be48934))
* **wx-to-taro:** 支持复杂的 if 的表达式 ([718663e](https://github.com/NervJS/taro/commit/718663e7af72a8a0a6fcf0a63505797ffb6d6dd5))
* **wx-to-taro:** 解析 attr ([5220f86](https://github.com/NervJS/taro/commit/5220f864446e7e6b6cb15b3be2c9021a801520bf))
* **wx-to-taro:** 解析 Page 页面 ([053e605](https://github.com/NervJS/taro/commit/053e6054a6214b6e222a0eb4d502ca0e5d9c276f))



## [1.1.9](https://github.com/NervJS/taro/compare/v1.1.8...v1.1.9) (2018-11-19)


### Bug Fixes

* **cli:** 支付宝小程序上传时不支持文件名中带 @ 字符，close [#1031](https://github.com/NervJS/taro/issues/1031) ([b7b2330](https://github.com/NervJS/taro/commit/b7b23302f5321f85854738f47964f21f7f45480a))
* **transformer:** 二维数组在小程序也需要当成复杂表达式处理，close [#1145](https://github.com/NervJS/taro/issues/1145) ([5e1ab5c](https://github.com/NervJS/taro/commit/5e1ab5cfd0b2bc2d9225bfc2140adeb292b24f97))
* **types:** detail 可根据需要定义 ([#1158](https://github.com/NervJS/taro/issues/1158)) ([1428d18](https://github.com/NervJS/taro/commit/1428d18e6bfda9f059eb05d43d10dd475e605ae0))
* **typing:** 表单系列组件没有 `name` 属性 ([#1168](https://github.com/NervJS/taro/issues/1168)) ([404c21f](https://github.com/NervJS/taro/commit/404c21f397aaea6e5dbc37f380ad8148b82ad146))


### Features

* **cli:** 支持百度小程序等端的项目配置文件 ([bfc1ae4](https://github.com/NervJS/taro/commit/bfc1ae422836720d9d2fa048b94270960b597b6f))



## [1.1.8](https://github.com/NervJS/taro/compare/v1.1.7...v1.1.8) (2018-11-15)


### Bug Fixes

* **cli:** 修复 H5 及 RN 环境变量替换 ([0f26bb8](https://github.com/NervJS/taro/commit/0f26bb89cf5d17c4b3d959c635dafc85df2fac55))
* **RN:** 修复 onPullDownRefresh 的 this 指向的问题 ([a21e201](https://github.com/NervJS/taro/commit/a21e201d0fb0e4dd8abda3cc08f378e70bf2b5c2))
* **taro:** 补全showActionSheet类型参数 ([#1139](https://github.com/NervJS/taro/issues/1139)) ([1dc4751](https://github.com/NervJS/taro/commit/1dc475181d01ed845f484ce12d313be25c42c46a))
* **taro-components:** 修复 Image组件的 onClick 事件在h5中点击事件没有反应 close [#794](https://github.com/NervJS/taro/issues/794) ([92bbcc1](https://github.com/NervJS/taro/commit/92bbcc1cfd6007ebe7ab86a7e470ceee9581d2da))
* **taro-components-rn:** Image width: 100% 与 widthFix 使得高度为0 ([5b1ed51](https://github.com/NervJS/taro/commit/5b1ed5125071e01ad76cffac2c0ba583db6c417c))
* **taro-components-rn:** Image 空串导致的错误 ([69ab497](https://github.com/NervJS/taro/commit/69ab497b8f5df668dd61a9f0f44ec965a7f17da4))
* **taro-components-rn:** StyleSheet style reference 的含有样式应先flatten才能读取 ([766ba8b](https://github.com/NervJS/taro/commit/766ba8ba937e39748b47354be8e731ed7a49a55e))
* **taro-components-rn:** 修复widthFix时默认取了stretch，props.src 为状态变量时，图片无法刷出 ([9fec1d4](https://github.com/NervJS/taro/commit/9fec1d46862f999fbd933b077b4b4c80830114f3))
* **taro-compontens:** 修复 Textarea onInput 问题，对齐maxLength 属性值 ([1d75d47](https://github.com/NervJS/taro/commit/1d75d47c604ebabca7609121923bc1e45a46f905))
* **taro-rn:** 修复 toast 相关 API 引用的问题 ([872d9bd](https://github.com/NervJS/taro/commit/872d9bdd58581495830648afebfa6f1dceed913b))


### Features

* **eslint:** 新规则：render-props ([3d634d3](https://github.com/NervJS/taro/commit/3d634d303f72ec4840951a28ef5edb701f6ac16a))
* **taro-components-rn:** 去掉安卓下 Input 的输入下划线 ([8f81013](https://github.com/NervJS/taro/commit/8f81013d0b3c6442af3dc22744cb29a9d171995d))
* **taro-components-rn:** 新增组件 Audio ([0abe985](https://github.com/NervJS/taro/commit/0abe985bdb2f8c9e7f55bf52d0b2394647bd7826))
* **transformer:** 支持 render props ([2b87404](https://github.com/NervJS/taro/commit/2b87404a17831ca66fa44835baf344305f0d4cf0))
* **weapp:**  支持 multipleSlots ([2e4e8a4](https://github.com/NervJS/taro/commit/2e4e8a44477869b3cd6255c7de4b0e4659624445))



## [1.1.7](https://github.com/NervJS/taro/compare/v1.1.6...v1.1.7) (2018-11-14)


### Bug Fixes

* **cli:** 回退使用 babel-plugin-remove-dead-code 插件 ([02fc89a](https://github.com/NervJS/taro/commit/02fc89a2369f8574f0dc275bfa0cc156bc038864))



## [1.1.6](https://github.com/NervJS/taro/compare/v1.1.5...v1.1.6) (2018-11-14)


### Bug Fixes

* **cli:** 配置参数少了一个逗号, close [#1114](https://github.com/NervJS/taro/issues/1114) ([3cad1fb](https://github.com/NervJS/taro/commit/3cad1fb0d4798053d244daad37fca88617f396a1))
* **taro:** fix Taro.uploadFile() ([#1115](https://github.com/NervJS/taro/issues/1115)) ([23e7c0b](https://github.com/NervJS/taro/commit/23e7c0b4a3036d924cab3d2229b8b5c41a85898d))
* **transformer:** 循环中 bind 成员表达式失败 ([cc4e471](https://github.com/NervJS/taro/commit/cc4e471aa93c8515a66db9c2ebacc9b2dd716c0b))
* **transformer:** 自定义组件 bind 会生成匿名 state ([4be9fd1](https://github.com/NervJS/taro/commit/4be9fd1a76617b3e7335a0c4990bade0ce3ee1ed))


### Features

* **cli:** 支持根据条件 require 需要的文件 ([b0b6824](https://github.com/NervJS/taro/commit/b0b682481a9520820f2edfdfb04756ceadc6f80b))
* **transformer:** 使用 fork 的 babel  remove dead  插件 ([f35c756](https://github.com/NervJS/taro/commit/f35c756a561be1fad1a51cfa64dc4e3b2bcfdc2f))



## [1.1.5](https://github.com/NervJS/taro/compare/v1.1.4...v1.1.5) (2018-11-13)


### Bug Fixes

* **cli:** postcss 插件读取方式修改 ([4c1de79](https://github.com/NervJS/taro/commit/4c1de79414c5e0907d524956d47e76c8307f8a0d))
* **cli:** UI 编译支持 import，close [#1030](https://github.com/NervJS/taro/issues/1030) ([b8452ce](https://github.com/NervJS/taro/commit/b8452ce9febbc60f6ca8f5b56735d0a43c8ad8c1))
* **cli:** 分包字段同时支持 subpackages && subPackages，close [#1042](https://github.com/NervJS/taro/issues/1042) ([3b7000b](https://github.com/NervJS/taro/commit/3b7000bd58e60d79a1927152f4e18e99b7ef739b))
* **eslint:** 允许 this.props.dispatch, close [#1006](https://github.com/NervJS/taro/issues/1006) ([8a82e18](https://github.com/NervJS/taro/commit/8a82e183593fbb75557c6f463aab8b3eef3005ee))
* **h5:** 修复 Taro.request 不带参数时附加 ? 导致请求错误的 bug，close [#1070](https://github.com/NervJS/taro/issues/1070) ([f250eb3](https://github.com/NervJS/taro/commit/f250eb304d2143b3994084586eb09898124a7509))
* **scroll-view:** 修复动画bug ([49d4b64](https://github.com/NervJS/taro/commit/49d4b64593fb56b833f2f8d05eb9354f8596d97b))
* **taro:** 还原小程序的表单组件为非受控组件 ([a628d0c](https://github.com/NervJS/taro/commit/a628d0cc6cebbe4367bc2950ee58ca3c58292008))
* **taro-components:** Input组件在h5模式下ios自带输入法中文模式下的问题 close [#601](https://github.com/NervJS/taro/issues/601) ([e56321f](https://github.com/NervJS/taro/commit/e56321f7fe70eb23f2953c093c94f9327fd9e683))
* **taro-components:** Swiper组件动态传递current无法跳转到指定item，close [#639](https://github.com/NervJS/taro/issues/639) ([b317e3b](https://github.com/NervJS/taro/commit/b317e3bc48b1821997c4b484b376e3b1733c6a38))
* **taro-components-rn:** 修复View的onClick无法触发问题 ([39410bf](https://github.com/NervJS/taro/commit/39410bfcec168f2055571653f53a83f00e26d836))
* **taro-compontens:** Input focus 属性 路由跳转后失效 close [#925](https://github.com/NervJS/taro/issues/925) ([e7c3409](https://github.com/NervJS/taro/commit/e7c34097b9d672c98cd3b2c5faafe688eda2ad33))
* **taro-compontens:** Input组件onConfirm事件无效，close [#654](https://github.com/NervJS/taro/issues/654) ([00c79d9](https://github.com/NervJS/taro/commit/00c79d972de62128d056908b47a5ccdc2eef5826))
* **taro-weapp:** fix [#1009](https://github.com/NervJS/taro/issues/1009) ([faea412](https://github.com/NervJS/taro/commit/faea412804827afbd99fd53ed090d30baadb6a97))
* **taro-weapp:** pageLifetimes 提供初始值 ([999d74f](https://github.com/NervJS/taro/commit/999d74f2daa41e9280ed8c8a344f1ce27bd6142e))
* **transformer:** bind 成员表达式不会加入加入到 usedState，close [#1051](https://github.com/NervJS/taro/issues/1051) ([a98f8ec](https://github.com/NervJS/taro/commit/a98f8ec0ac082f073cf81a56f4b12406f28b74bc))
* **transformer:** 某些情况会处理循环组件两次 ([2d3dbee](https://github.com/NervJS/taro/commit/2d3dbee2091dd86fb6664abc7eaa040cda59fe27))
* **transformer:** 空格强行换行，close [#992](https://github.com/NervJS/taro/issues/992) ([3a20233](https://github.com/NervJS/taro/commit/3a202331dfa9bdce6188773ca38f69893941e8b4))
* **transformer:** 自定义组件 props 不支持任何表达式，close [#984](https://github.com/NervJS/taro/issues/984) ([804e6f2](https://github.com/NervJS/taro/commit/804e6f2840eccc178ed2e2c341d468fcb1d9599d))
* **webpack-runner:** 修复devServer open配置无效的问题 ([127839f](https://github.com/NervJS/taro/commit/127839f45535c7471024eb8d0b07a74135960bdf))
* **webpack-runner:** 修复了h5下csso配置失效的问题 ([57c48d7](https://github.com/NervJS/taro/commit/57c48d7f6fcd4614c1ed5e74854eee00ffd721ac))


### Features

* **eslint:** 不支持在 switch 语句中使用 JSX ([d008756](https://github.com/NervJS/taro/commit/d0087563b8a4cebe079fe45ab39c76f85afa02c8))
* **taro-components-rn:** Image resizeMode add ([fd74b35](https://github.com/NervJS/taro/commit/fd74b35b12daa63f1c1afdbffff96942051c6cdf))
* **taro-components-rn:** Image 支持 widthFix ([4d41a5d](https://github.com/NervJS/taro/commit/4d41a5ddad7540aed7c456e52e3797118c3b020f))
* **taro-components-rn:** 新组件 Video ([2a1db5b](https://github.com/NervJS/taro/commit/2a1db5ba505f51f0cfbc2e02479b011f3af2a848))
* **taro-components-rn:** 补充：支持 Image 对本地图片的 widthFix ([837b62c](https://github.com/NervJS/taro/commit/837b62ccf03b3626829b2379938c62449e5602ca))
* **transformer:** 当在复杂循环中使用 this.state.xx.xx 给出修改建议, close [#886](https://github.com/NervJS/taro/issues/886) ([d6ee88f](https://github.com/NervJS/taro/commit/d6ee88f2e8c040be2d50b21f79d2c2372cde3723))
* **weapp:** 组件同样拥有 componentDidShow/componentDidHide 生命周期，close [#1048](https://github.com/NervJS/taro/issues/1048) ([4bb99cd](https://github.com/NervJS/taro/commit/4bb99cd7c33373ac3fa162b96c8ec44809ac9d41))
* 给Swiper传递样式中的height ([7d630e8](https://github.com/NervJS/taro/commit/7d630e8cb553400a2504788e55b3f5e4ae0a355d))



## [1.1.4](https://github.com/NervJS/taro/compare/v1.1.3...v1.1.4) (2018-11-08)


### Bug Fixes

* **alipay:** 支付宝小程序 api 不支持提示逻辑错误 ([84b05ae](https://github.com/NervJS/taro/commit/84b05ae3e1b6631a8b13741ab26e62b8255908d8))
* **eslint:** 允许 this.props.dispatch, close [#1006](https://github.com/NervJS/taro/issues/1006) ([7abcb2c](https://github.com/NervJS/taro/commit/7abcb2c82d1efef8c5f41aee3f19f4994cdb07b9))
* **swan:** 百度小程序报错 ([d1a4688](https://github.com/NervJS/taro/commit/d1a468858fb9cc09997adf73428fdcb065212593))


### Features

* **taro:** 补充 OfficialAccount 组件定义 && 组件全部补充 animation 属性，close [#1003](https://github.com/NervJS/taro/issues/1003) ([7c5e669](https://github.com/NervJS/taro/commit/7c5e669aac9a3d4f681f0b2567a6aab06d27745c))



## [1.1.3](https://github.com/NervJS/taro/compare/v1.1.2...v1.1.3) (2018-11-07)


### Bug Fixes

* **alipay:** 修复支付宝小程序编译空文件报错问题 ([ae222a0](https://github.com/NervJS/taro/commit/ae222a0ae1e7cbe68bf9402183e1c785b0f28a21))
* **alipay/swan:** 支付宝 && 百度小程序 api 不支持提示 ([286f0e3](https://github.com/NervJS/taro/commit/286f0e3c3af768bddadb57ffaa326645d828c204))
* **cli:** 百度小程序全局对象使用 global ([078a5a8](https://github.com/NervJS/taro/commit/078a5a8e9a69ed982336a587f7be0eb9095a0beb))



## [1.1.2](https://github.com/NervJS/taro/compare/v1.1.1...v1.1.2) (2018-11-07)


### Bug Fixes

* **alipay:** 支付宝小程序 api 适配问题修复 ([094f060](https://github.com/NervJS/taro/commit/094f060e5992713d6c21a531a332e7b2485cdb10))
* **async-await:** 保证支付宝小程序下 async-await 代码不为空 ([75cdfa1](https://github.com/NervJS/taro/commit/75cdfa19becc2036d3ef4d12fb332910028450d5))
* **cli:** 使用官方插件 babel-plugin-danger-remove-unused-import ，解决 Computed Property 支持问题，close [#1015](https://github.com/NervJS/taro/issues/1015) ([6162b63](https://github.com/NervJS/taro/commit/6162b636d3baa83e63888f5761d91a4f2230dfc2))
* **cli:** 修复 npm 安装依赖时依赖获取 ([9773500](https://github.com/NervJS/taro/commit/9773500387f045f88a9b494d495dc63debf10bb0))
* **cli:** 百度小程序全局对象使用 global ([842f870](https://github.com/NervJS/taro/commit/842f8709a9086c251ac6a97e40069e8e977b08fb))
* **cli:** 百度小程序静态资源路径必须为相对路径，close [#1020](https://github.com/NervJS/taro/issues/1020) ([31385e7](https://github.com/NervJS/taro/commit/31385e7672581745b1ed28e655a2cec774fd1a30))
* **h5:** 兼容contentType一些奇怪的写法 ([#1022](https://github.com/NervJS/taro/issues/1022)) ([06b6b42](https://github.com/NervJS/taro/commit/06b6b42d6e919f345e0aeea264bd84b7d752659f))
* **weapp:** 微信小程序Taro.request的complete回调无参数 ([#1011](https://github.com/NervJS/taro/issues/1011)) ([d55dabf](https://github.com/NervJS/taro/commit/d55dabf073481e74a7ff8f7443c4916fdb65c55d))



## [1.1.1](https://github.com/NervJS/taro/compare/v1.1.0...v1.1.1) (2018-11-05)


### Bug Fixes

* **async-await:** 修复新版本支付宝开发者工具不支持空文件的 bug ([8af35fa](https://github.com/NervJS/taro/commit/8af35fa0a068ad1fbd62e14ba08da8cb664c6497))
* **component:** fixed types of SwiperItem ([#997](https://github.com/NervJS/taro/issues/997)) ([548d72f](https://github.com/NervJS/taro/commit/548d72f71005f3e4f703a4cf34cd91366a987f11))
* **taro:** taro类型文件中加入navigateToMiniProgramAppIdList字段支持 ([#988](https://github.com/NervJS/taro/issues/988)) ([d250597](https://github.com/NervJS/taro/commit/d250597e699d97be297c25d9e26b5481789dd58f))


### Features

* **cli:** 替换 babel-plugin-danger-remove-unused-import 插件 ([3e5cdf1](https://github.com/NervJS/taro/commit/3e5cdf113c547df94657dac3efe7744c499fdd96))
* **redux:** 微信端 connect 的 mapDispatchToProps 参数支持传递对象 [#298](https://github.com/NervJS/taro/issues/298) ([#994](https://github.com/NervJS/taro/issues/994)) ([59c2bd4](https://github.com/NervJS/taro/commit/59c2bd42bd808ed62523af18b574c637093d045a))



# [1.1.0](https://github.com/NervJS/taro/compare/v1.1.0-beta.15...v1.1.0) (2018-11-02)


### Bug Fixes

* **cli:** fixed eslint rules failed in typescript ([#952](https://github.com/NervJS/taro/issues/952)) ([2c1d51e](https://github.com/NervJS/taro/commit/2c1d51e86d0252c1f91dcc8bab360def7501ca25))
* **cli:** 支付宝小程序 config 转换遗漏，close [#970](https://github.com/NervJS/taro/issues/970) ([340aa24](https://github.com/NervJS/taro/commit/340aa24070766a6d0b7fa7cc3078767ae5db370d))
* **cli:** 模板创建项目出错 ([159c4bf](https://github.com/NervJS/taro/commit/159c4bf25af8da914b7381740c9ec3ff035e57db))
* **RN:** 修复 this.$router.params undefined 的问题 ([24e591d](https://github.com/NervJS/taro/commit/24e591d5a95976badd2cc883b1cd288b3be05b25))
* **taro-alipay:** 将支付宝的 event 事件对象的字段，对齐微信小程序的 ([d014b03](https://github.com/NervJS/taro/commit/d014b032f17175d23faa468cdbcbb4ca3069feb1))


### Features

* **cli:** 支持 babel-plugin-transform-runtime ([45604f0](https://github.com/NervJS/taro/commit/45604f068db3b5cd889ec503350dbd16573b738e))
* **RN:** 支持对页面配置项 disableScroll ([4dfeec3](https://github.com/NervJS/taro/commit/4dfeec3ab6f9c3f47ef0a87a8d94c655c8f4ae96))



# [1.1.0-beta.15](https://github.com/NervJS/taro/compare/v1.1.0-beta.14...v1.1.0-beta.15) (2018-10-31)


### Bug Fixes

* **cli:** 百度小程序编译找不到 scss 变量，close [#967](https://github.com/NervJS/taro/issues/967) ([9c4ff9c](https://github.com/NervJS/taro/commit/9c4ff9c0e98b679875169beccb877c32304ff447))
* **taro-transformer-wx:** 支付宝小程序不用编译出 Component.properties ([c1c47b8](https://github.com/NervJS/taro/commit/c1c47b831a233db39f61a24cc93ce727236895fc))


### Features

* update RN docs ([6c1431d](https://github.com/NervJS/taro/commit/6c1431d2c6ffca014d14fef040e507a902f51aff))



# [1.1.0-beta.14](https://github.com/NervJS/taro/compare/v1.1.0-beta.13...v1.1.0-beta.14) (2018-10-30)


### Bug Fixes

* **cli:** ui 库编译可以给小程序类端使用 ([4969021](https://github.com/NervJS/taro/commit/4969021a262d2a112c38c2fd926dcba106a780ea))
* **cli:** ui 打包更新 ([5a56c2a](https://github.com/NervJS/taro/commit/5a56c2a6a6bc3f620210395aca1685b63fce2c8b))
* **taro:** inlineStyle 无法正确转换浏览器私有属性 ([67a90b8](https://github.com/NervJS/taro/commit/67a90b88277579c589fc4acf0d196a2bdc897bd6))
* **taro-alipay:** 支付宝小程序事件处理优化 ([f3224d9](https://github.com/NervJS/taro/commit/f3224d9c3e88a13d385f84504fadb211fd2ff2f2))
* **taro-alipay:** 支付宝小程序事件处理优化 ([38d6310](https://github.com/NervJS/taro/commit/38d631044f6fe733e1ccbd00e9309bd898c8f858))
* **taro-cli:** tabBar config跟进编译的不同小程序去取配置字段 ([31a0847](https://github.com/NervJS/taro/commit/31a08473592cd568b2dda80058e1fa5d816464fb))
* **taro-cli:** 支付宝小程序中 npm hack 时 global 赋值空对象 ([8cfe9a4](https://github.com/NervJS/taro/commit/8cfe9a4232a2e1599055a2c053525d7161bb4ca7))


### Features

* **cli:** usingComponents 支持写以 src 为根目录的绝对路径，close [#945](https://github.com/NervJS/taro/issues/945) ([2f20419](https://github.com/NervJS/taro/commit/2f20419000ec1282626c3ca6c91c0734061266c7))
* **cli:** 支持 NODE_ENV 自定义，close [#947](https://github.com/NervJS/taro/issues/947) ([8020dd1](https://github.com/NervJS/taro/commit/8020dd1a918c526e83f7e4f12241866817f66e70))
* **RN:**  添加 RN 端 watch 代码按需编译。 ([573debc](https://github.com/NervJS/taro/commit/573debcdeea016b73c5de6113858a48a5719b515))
* **taro:** 匿名函数转换后标记统一改为 funPrivate，close [#956](https://github.com/NervJS/taro/issues/956) ([86e01b9](https://github.com/NervJS/taro/commit/86e01b97ae742215fec5265ec9a36d33dd6d0231))
* update RN  docs ([aa0f98d](https://github.com/NervJS/taro/commit/aa0f98d52e5176c95e3efe18f35f185a5c9873b0))



# [1.1.0-beta.13](https://github.com/NervJS/taro/compare/v1.1.0-beta.12...v1.1.0-beta.13) (2018-10-26)


### Bug Fixes

* **async-await:** 修正 async await 依赖的引入方式 ([5b2e858](https://github.com/NervJS/taro/commit/5b2e858fa36ed18a387b480e9fff18a993a70b9a))
* **cli:** H5 分包配置与小程序保持一致 ([f2a0084](https://github.com/NervJS/taro/commit/f2a00846d41b245c2937ddaeff95822b318d662d))
* **cli:** H5 编译时清除 dist 目录，close [#936](https://github.com/NervJS/taro/issues/936) ([709a795](https://github.com/NervJS/taro/commit/709a795a98bcd47ba354a5f97454289a0a06a066))
* **cli:** 不再主动清除组件引用，close [#870](https://github.com/NervJS/taro/issues/870) ([ae6db2f](https://github.com/NervJS/taro/commit/ae6db2f8ce52bed94c4eaff5f48be0e98b21dd70))
* **cli:** 解析 node_modules 文件时 TARO_ENV 不正确 ([50854c8](https://github.com/NervJS/taro/commit/50854c83578661d7703961fa659a2d10aedee3a9))
* **RN:** 修复同一文件夹下多个JS文件样式引用错误 ([74380ec](https://github.com/NervJS/taro/commit/74380ececa65506cd7de23194b87ee0ac8db5577))
* **swan:** 修复 componentWillMount 中 setState 回调中获取 state 可能不正确 ([057bedb](https://github.com/NervJS/taro/commit/057bedbe195dbd0795d30c7a0b0014601eede5f1))
* **taro-cli:** 修复 weapp.js 编译出的页面和组件配置 json 文件中，usingComponent 的 npm 包路径错误 ([990df26](https://github.com/NervJS/taro/commit/990df265f7a99344e0cacce18abd4d396c21a236))
* **taro-weapp:** 修复 await Taro.connectSocket 获取不到 SocketTask 的错误 ([#930](https://github.com/NervJS/taro/issues/930)) ([771baba](https://github.com/NervJS/taro/commit/771baba411cfadfcf0c0f57c60dc7cf4b6009347))
* **transformer:** 修复事件的正则判断 ([a282331](https://github.com/NervJS/taro/commit/a282331d68ccf3e2009f6532d0ad3150405e1355))
* **transformer:** 多层循环内生成新的数组也要带上用户写的执行判断 ([067de85](https://github.com/NervJS/taro/commit/067de85d5f921f93c02226c6823bf7e834303fa1))


### Features

* **eslint:** 检测来自于 this.props 的函数是否以 `on` 开头 ([9827866](https://github.com/NervJS/taro/commit/98278665d65749dcd8ae5e203bff57277e9e7aa4))
* **transformer:** 支持在同一作用域对 JSX 赋值（不推荐），close [#550](https://github.com/NervJS/taro/issues/550) ([243b237](https://github.com/NervJS/taro/commit/243b237adeaf5ffaebe4fa84b98387402f3d3c69))



# [1.1.0-beta.12](https://github.com/NervJS/taro/compare/v1.1.0-beta.11...v1.1.0-beta.12) (2018-10-24)


### Bug Fixes

* **cli:** 修复h5分包功能出现没有Root的pages的问题 ([d6f0971](https://github.com/NervJS/taro/commit/d6f0971c6cb6935b95baa3414904e57aff2d8a9c))
* **cli:** 小程序类编译 TARO_ENV 设置有误 ([dc86832](https://github.com/NervJS/taro/commit/dc8683281e620a3df6c84ddfb81be9d6d08c88ab))
* **taro-alipay:** 匿名函数也不需要通过 __triggerPropsFn 调用 props 的函数 ([682b91d](https://github.com/NervJS/taro/commit/682b91d7c67e27b963fe3e55694b81523bdd75c4))
* **transformer:** Tagged template 不需要做优化处理，close [#926](https://github.com/NervJS/taro/issues/926) ([22be41c](https://github.com/NervJS/taro/commit/22be41cf2789f06042699f96dc34f423f4c024a9))
* **transformer:** 支付宝自定义组件不处理 onClick 事件 ([4dd9ba3](https://github.com/NervJS/taro/commit/4dd9ba3ae59583f43ee2298b633a78f59e4e91c5))


### Features

* **taro-h5:** 设置 H5 端 Taro.request 保留 jsonp-retry 的参数 ([0a2f975](https://github.com/NervJS/taro/commit/0a2f9754db6567b724155fa3ca3978eb85075893))



# [1.1.0-beta.11](https://github.com/NervJS/taro/compare/v1.1.0-beta.10...v1.1.0-beta.11) (2018-10-23)


### Bug Fixes

* **cli:** h5 分包路径识别错误 ([34d3d02](https://github.com/NervJS/taro/commit/34d3d02dafd5cdb374374097b7173eed527b331f))
* **taro:** 小程序端 api 传参丢失参数，close [#420](https://github.com/NervJS/taro/issues/420) ([69ed1cb](https://github.com/NervJS/taro/commit/69ed1cb23ddd60bcc8ee729f5b0e12520a88f1c0))
* **taro-components:** 修复 swiper 滑动问题，textarea 返回值问题，input focus 问题 ([3521334](https://github.com/NervJS/taro/commit/35213349113f4990acfc945201ad632ee90f9326))
* **taro-weapp:** componentDidUpdate 前一刻需要触发 ref 回调或更新 this.refs ([80e0c65](https://github.com/NervJS/taro/commit/80e0c65cd553cace2edd66289a68de6cfd34aab6))
* **taro-weapp:** json diff 应对数组时，只有长度相等才做 diff，否则直接赋值。close [#882](https://github.com/NervJS/taro/issues/882) ([76c5ad2](https://github.com/NervJS/taro/commit/76c5ad225b9c581d0f6036651f091a54a87f72f0))
* **taro-weapp:** 初始化阶段不触发 componentDidUpdate ([7a2685c](https://github.com/NervJS/taro/commit/7a2685c366127d3d407d3aaeff9ee58f595b4f89))
* **taro-weapp:** 调用 forceUpdate 时应该不去触发 shouldComponentUpdate ([24cdfff](https://github.com/NervJS/taro/commit/24cdfff1035c4bcc942dc7121daa2ab351525819))
* **taro-weapp:** 调用 forceUpdate 时应该不去触发 shouldComponentUpdate ([2bf0838](https://github.com/NervJS/taro/commit/2bf0838b7dc8418e05089098222c2f512862b9af))
* **transformer:**  babel-generator 把中文字符生成为 unicode ([9bbb399](https://github.com/NervJS/taro/commit/9bbb39972b404f5b06164414cdcce53d5016a158))
* **transformer:** if block 中的 JSX 引用没有改变为 JSX 元素, close [#889](https://github.com/NervJS/taro/issues/889) ([1389096](https://github.com/NervJS/taro/commit/1389096c208787ded3f0911d3b364d9a22e09b61))
* **transformer:** useState 加入 class props ([7f17771](https://github.com/NervJS/taro/commit/7f177719154569f1fe8c44991ad1fac04efa36db))
* **transformer:** 二进制表达式的左右值不会加入 state, close [#879](https://github.com/NervJS/taro/issues/879) ([edb92a6](https://github.com/NervJS/taro/commit/edb92a6d42e40043e7bc5cbab9825ec0bc01cd6a))
* **transformer:** 使用挂载在 this 下的变量渲染可能会报错 ([9e66495](https://github.com/NervJS/taro/commit/9e664954a2cc21ed67871535c9ca792a3c1ef28d))
* **transformer:** 在 key 中使用 `[].length` 的写法时报错 ([12d5252](https://github.com/NervJS/taro/commit/12d5252f5d4a83e2c97fc7a835aea285f84c0579))
* **transformer:** 在循环中使用 bind 参数有复杂表达式, close [#770](https://github.com/NervJS/taro/issues/770) ([743d4b8](https://github.com/NervJS/taro/commit/743d4b82d95b977b69ff04b647cafd969227c582))
* **transformer:** 多层循环的 callee 如果是循环体内的变量不用变为成员表达式, [#912](https://github.com/NervJS/taro/issues/912) ([0656199](https://github.com/NervJS/taro/commit/0656199bc3b1a7c716a3e063c1b8eaa2bf2d3e2b))


### Features

* **transformer:** JSX 属性 `taroKey` alias `key` ([c95c8b2](https://github.com/NervJS/taro/commit/c95c8b27868cb7d7aa7c2ff10617876679b38086))



# [1.1.0-beta.10](https://github.com/NervJS/taro/compare/v1.1.0-beta.9...v1.1.0-beta.10) (2018-10-18)


### Bug Fixes

* **RN:** RN app.json 的 expo 配置改为可覆盖 ([24dc72b](https://github.com/NervJS/taro/commit/24dc72b4723427477c6f935680576e4176872fab))
* **taro-weapp:** 对应部分 react 的 ref 逻辑。 ([e6d0d28](https://github.com/NervJS/taro/commit/e6d0d287c815af5d02fb01cc154bd8f360cfc25f))
* **transformer:** 三元表达式其中有一个值为函数解析错误 ([fde2474](https://github.com/NervJS/taro/commit/fde24745e1f7c9be3a79661c418488f94b275866))
* **transformer:** 三元表达式有一个结果为有值字符串解析错误 ([e256111](https://github.com/NervJS/taro/commit/e256111e90f6e46be55936c99a0108c911102d2d))


### Features

* **cli:** 将initPxTransform移动到import后面 ([505c379](https://github.com/NervJS/taro/commit/505c37999963aba0ccdedfe7218c903be8d8e674))
* **cli:** 支持分包 ([8be9308](https://github.com/NervJS/taro/commit/8be93082a9ae2d550dcf45a0e979f9e990630fc5))
* **RN:** RN 端支持 Taro.pxTransform ([688a9c9](https://github.com/NervJS/taro/commit/688a9c9ff018b34c3c69f5f5d98dfd0ae8a2e3b4))
* **taro-qapp:** 完成router的reLanch、getCurrentPages ([4d38db3](https://github.com/NervJS/taro/commit/4d38db3656a61a74773bc239114c4badec046a3e))
* **transformer:** 提升字符串模板的性能 ([ecc916a](https://github.com/NervJS/taro/commit/ecc916aa5e4c69430173f073c3bf65c6ffb2f4fd))



# [1.1.0-beta.9](https://github.com/NervJS/taro/compare/v1.1.0-beta.8...v1.1.0-beta.9) (2018-10-17)


### Bug Fixes

* **RN:** fix RN 端 .styl后缀未修改的问题，并添加对应的测试用例 close [#838](https://github.com/NervJS/taro/issues/838) ([7b5ce74](https://github.com/NervJS/taro/commit/7b5ce740a5155877b9ae1f540fddedcd8b38810f))
* **RN:** fix RN 端 iconPath 和 selectedPath 的为同一个路径导致的重复引用的报错 close [#776](https://github.com/NervJS/taro/issues/776) ([4123514](https://github.com/NervJS/taro/commit/4123514640dca7f6a1fc2483b5669a92e81ce967))
* **taro-swan:** 修复 ref 获取 ([8fe5f18](https://github.com/NervJS/taro/commit/8fe5f1835dbf149e7b9144b708bff87b037df63f))
* **taro-swan:** 修复 ref 获取以及 onShow 生命周期调整 ([a333c3f](https://github.com/NervJS/taro/commit/a333c3f9cac24479691a8fdc2206b2dfc0c00f6f))
* **taro-weapp:**  preloadData 初始值改为 null ([3772b8c](https://github.com/NervJS/taro/commit/3772b8c25074516b397447fb138820706c801583))
* **transformer:** 从 this 解构出来出来的变量不得与 render 作用域定义的变量重复时报错 ([040d1ae](https://github.com/NervJS/taro/commit/040d1ae811f0dd118c600fc7e5ba6f24ecfbed49))


### Features

* **cli:** 保留 config 配置，可以在代码中访问到 ([0571fd0](https://github.com/NervJS/taro/commit/0571fd037b89500513040ef243a4d40962f2286f))
* **cli:** 支持 js 中 export * from 的写法，closes [#861](https://github.com/NervJS/taro/issues/861)，closes [#496](https://github.com/NervJS/taro/issues/496) ([4653e0a](https://github.com/NervJS/taro/commit/4653e0a0fefb1a1e00bee3ab2d3876faef731f8a))
* **postcss-pxtransform:** 增加 1px 是否会被转换的设置 ([4085ad7](https://github.com/NervJS/taro/commit/4085ad7345ebcedba3a21ecf2d1507c057c0f89c))
* **RN:** 在 config 中添加 rn 的 expo 配置 ([8920b3c](https://github.com/NervJS/taro/commit/8920b3c1b65968ee26e9b815cdbe6ad63777faec))
* **taro-weapp:** add wxapp trtriggerEvent key ([#852](https://github.com/NervJS/taro/issues/852)) ([0ddedda](https://github.com/NervJS/taro/commit/0ddedda1a15c8d37022f798d2a57263ed635a15f))



# [1.1.0-beta.8](https://github.com/NervJS/taro/compare/v1.1.0-beta.7...v1.1.0-beta.8) (2018-10-16)


### Bug Fixes

* **cli:** fix npm file hack ([629a06f](https://github.com/NervJS/taro/commit/629a06fa4dd8f274b2aa6f192766aee35def5361))
* **cli:** 修复 require 引用 npm 不识别的问题 ([e90885a](https://github.com/NervJS/taro/commit/e90885a7605eb29ddfdb0f9e5981ce4a73310d9a))
* **cli:** 文件压缩出错提示错误文件位置 ([e02402d](https://github.com/NervJS/taro/commit/e02402d00a77a7f49d292df14db33b24fce6a932))
* **cli:** 模板中更新 @tarojs/async-await 包引入的方式 ([810324e](https://github.com/NervJS/taro/commit/810324ed7cc3da28c6fa3fde5ba8801fb129174b))
* **cli:** 组件循环依赖 bug ([86df1d9](https://github.com/NervJS/taro/commit/86df1d94d3ff8c934bd5a756d78062cc098d1884))
* **router:** componentWillReceiveProps可以接收到新的router参数了 ([94e04bc](https://github.com/NervJS/taro/commit/94e04bcc6020dd8ac99f3b200a4284719b971c63))
* **router-h5,redux-h5:** 修复后台页面依然执行生命周期的问题 ([cc0db54](https://github.com/NervJS/taro/commit/cc0db54030a7f0c0f3757aa08dd12b298176f441))
* **taro-alipay:** fix 子组件 componentWillRecieveProps 不会触发 ([db236dd](https://github.com/NervJS/taro/commit/db236dd049fc0ff71e5535080c962a1c274dd6ed))
* **taro-redux:** connect types add IStore ([4207231](https://github.com/NervJS/taro/commit/4207231f201111196f2d63d7c0119d8f6f7ca4b7))
* **taro-swan:** 百度小程序不支持 props 带 _ ([dda7116](https://github.com/NervJS/taro/commit/dda7116976153a71ead75523f053a7dcec9ecb72))
* **taro-weapp:** 修复 setData 回调里再 setData 的 bug ，close [#825](https://github.com/NervJS/taro/issues/825) ([b311870](https://github.com/NervJS/taro/commit/b311870b59da7fdd64647f404b91edb2b7dfb874))
* **transformer:** 从 this 解构出来出来的变量重复 ([00269d4](https://github.com/NervJS/taro/commit/00269d4f55c21d5f8531ae2b6f70203f690ffa09))
* **transformer:** 第三方组件事件首字母小写 ([60151d6](https://github.com/NervJS/taro/commit/60151d6c7b476e78c27afa7b7247d6f5d1bb066a))
* **transformer:** 自定义组件名为 Link 时无法正常渲染 `children`, close [#826](https://github.com/NervJS/taro/issues/826) ([aba4774](https://github.com/NervJS/taro/commit/aba477411c16f57abdec779477055b3fb822daf0))


### Features

* **taro:** 增加 SWAN/ALIPAY 分别表示百度/支付宝小程序 ([4e13bbf](https://github.com/NervJS/taro/commit/4e13bbf650e7a0c96105047430bd9da4393ab639))
* **taro-swan:** 修复百度小程序生命周期执行 ([bdd6d51](https://github.com/NervJS/taro/commit/bdd6d51d4728cdad33e2244d72dfcf9b7955bd4e))
* **transformer:** 从 this 中解构出来的参数可以在 JSX 中使用，[#822](https://github.com/NervJS/taro/issues/822) ([3b34c2c](https://github.com/NervJS/taro/commit/3b34c2c2995650942381ab195b70ee0b3b3b1db2))
* **transformer:** 支持在 JSX 使用 this.xxx 直接访问 this.xxx 的值 ([3814c31](https://github.com/NervJS/taro/commit/3814c316499834e1c887220d80e86afa2aaf5721))



# [1.1.0-beta.7](https://github.com/NervJS/taro/compare/v1.1.0-beta.6...v1.1.0-beta.7) (2018-10-12)


### Bug Fixes

* **transformer:** 不使用本地插件 remove dead code 插件, close [#824](https://github.com/NervJS/taro/issues/824) ([bc9e6e8](https://github.com/NervJS/taro/commit/bc9e6e89c2cdcf04ef4b1262b7d218322e00c903))



# [1.1.0-beta.6](https://github.com/NervJS/taro/compare/v1.1.0-beta.5...v1.1.0-beta.6) (2018-10-12)


### Bug Fixes

* **transformer:** 重新加入 remove-dead-code 插件 ([53e4107](https://github.com/NervJS/taro/commit/53e4107f2f4a686f2529aa8c95f54370b759fe3f))



# [1.1.0-beta.5](https://github.com/NervJS/taro/compare/v1.1.0-beta.4...v1.1.0-beta.5) (2018-10-12)


### Bug Fixes

* **async-await:** 修正全局对象的获取 ([2c92df1](https://github.com/NervJS/taro/commit/2c92df1b7554f54dd72dfee36df916356ad724f9))
* **taro-compontens:** 修复 lowerThreshold， upperThreshold 参数问题，swiper 高度问题 ([c552dbb](https://github.com/NervJS/taro/commit/c552dbb4018e5bcba0e5c4f552290d932cc81592))
* **taro-swan:** 百度小程序 api 适配 ([eb19924](https://github.com/NervJS/taro/commit/eb199248972e15cb496d94258cd74398a0d2dd02))
* **transformer:**  babel-plugin-remove-dead-code 插件会多生成一个 block 语句 ([d8bad5b](https://github.com/NervJS/taro/commit/d8bad5bd0d47dc08f9b8adae543decd08849713d))
* **transformer:** 去掉自动加 @tarojs/async-await 逻辑 ([796070b](https://github.com/NervJS/taro/commit/796070bde54193bf02a40f233a9a76342b216642))
* **transformer:** 多个 if 表达式中循环前有三元表达式可能会不解析的情况 ([1cd0352](https://github.com/NervJS/taro/commit/1cd03520e988236706443ae6fc040a81c1771209))


### Features

* **taro-alipay:** 支付宝小程序 api 适配 ([a6ff163](https://github.com/NervJS/taro/commit/a6ff163c82fbfaa0367bfe1084715a5199951657))
* **taro-qapp:** 添加 router的switchTab、navigateBack ([b622da4](https://github.com/NervJS/taro/commit/b622da47098eea90a875c4e57886a75ef2ef03f5))
* **taro-weapp:** add componentWillPreload. close [#747](https://github.com/NervJS/taro/issues/747) ([1030210](https://github.com/NervJS/taro/commit/10302100677fd2c6e2a1eab7d4e752804dbac8dd))



# [1.1.0-beta.4](https://github.com/NervJS/taro/compare/v1.1.0-beta.3...v1.1.0-beta.4) (2018-10-11)


### Bug Fixes

* **cli:** taro update 补充依赖包 ([0c769e0](https://github.com/NervJS/taro/commit/0c769e0b751bad3c5fd12b52311b42c3b2a07b90))
* **cli:** 同一页面多次加载 npm 安装的组件失败 ([feece2d](https://github.com/NervJS/taro/commit/feece2d2684011e2b57ab2992bc3bf7195345a8f))
* **cli:** 增加主包或子包页面触发重新编译所有页面 ([4c1f482](https://github.com/NervJS/taro/commit/4c1f482d2b3c7b66c3c915999b8c662e5408c19c))
* **eslint:** 生命周期在 function-naming 中报错，[#799](https://github.com/NervJS/taro/issues/799) ([6fee18a](https://github.com/NervJS/taro/commit/6fee18a6348d3b4e58227298520a7ed7d1363cd5))
* **taro-alipay:** API 作用域 ([b0b64a0](https://github.com/NervJS/taro/commit/b0b64a0449941fbde4ddcca531752a48b2b360a5))
* **taro-alipay:** 事件处理 ([1a4eeec](https://github.com/NervJS/taro/commit/1a4eeec931b2fa05a235714e4f708eb8d60f606a))
* **taro-swan:** 百度小程序暂时不支持 setData 数据路径更新 ([c4fcb0b](https://github.com/NervJS/taro/commit/c4fcb0b4e4a4fe893d2ce76b878d0902126213d3))
* **taro-swan:** 百度小程序自定义事件参数在 event 对象下 ([21442ae](https://github.com/NervJS/taro/commit/21442ae08c8efb160f599cf761963e0b63963678))
* **transformer:** 处理支付宝小程序的组件差异 ([50eac86](https://github.com/NervJS/taro/commit/50eac8670b99792ca03da4b7ca2ce1f429d15275))
* **transformer:** 支付宝小程序事件名保持原样输出 ([305f104](https://github.com/NervJS/taro/commit/305f1048a1b92c9762e7595ddf5db35e779272eb))
* **transformer:** 支付宝小程序事件报错 ([5d3eb72](https://github.com/NervJS/taro/commit/5d3eb724f9e6510c445832993fc1e221ba8221f0))


### Features

* **components:** add a type definition for the block component ([3a4bd5a](https://github.com/NervJS/taro/commit/3a4bd5a7c299a6cbf52421ab6b8a1e833626bf93))
* **RN:** RN  端支持 deviceRatio 自定义 ([654c423](https://github.com/NervJS/taro/commit/654c4230972c77f6558f40b5856dd7c9ed97f565))
* **taro-alipay:** 支付宝小程序适配改造 ([58c360d](https://github.com/NervJS/taro/commit/58c360d8b7ac5aaca7c9f1f87eb1e4e077798aee))
* **transformer:** 处理支付宝小程序事件差异 ([ef1cb30](https://github.com/NervJS/taro/commit/ef1cb306d1128416f3590d7fbb5c5bdf91157d76))



# [1.1.0-beta.3](https://github.com/NervJS/taro/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2018-10-10)


### Bug Fixes

* **cli:** 支持组件循环引用，close [#691](https://github.com/NervJS/taro/issues/691) ([a064804](https://github.com/NervJS/taro/commit/a06480423a35379960e89d2e692a19befe0d2c84))
* **taro-weapp:** 修复 json diff ([4ed1d45](https://github.com/NervJS/taro/commit/4ed1d45ff883fb12b807a3c69e6b588393ff5184))
* **webpackChain:** 漏传第二个参数webpack ([1f9e9e2](https://github.com/NervJS/taro/commit/1f9e9e2d2d01694e566c9753ef6e27b3054fca27))


### Features

* **cli:** 支持编译生成 worker 相关文件，close [#778](https://github.com/NervJS/taro/issues/778) ([54de51d](https://github.com/NervJS/taro/commit/54de51db0775e00e768a568b309cf68c47086cab))
* **cli:** 模板增加百度小程序运行时框架 ([6b64a85](https://github.com/NervJS/taro/commit/6b64a850886b938b4a592696e063a2133763174f))
* **taro:** 兼容 event 中不存在 target 的情况 ([37694da](https://github.com/NervJS/taro/commit/37694dae207aa2bff1bdc41271c34531e6d76b73))



# [1.1.0-beta.2](https://github.com/NervJS/taro/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2018-10-08)


### Bug Fixes

* **cli:** 处理 lodash/fp 的小程序端兼容问题 ([fb10108](https://github.com/NervJS/taro/commit/fb10108bcba3dd69e12dd438e93c1c55e38a35d2))
* **cli:** 百度小程序以及 rn 的 TARO_ENV 不正确 ([337b2b1](https://github.com/NervJS/taro/commit/337b2b1227fe5a453f5d68512e01ffcb0ebe5714))
* **components:** 修复不传className时类名为undefined的情况 ([103df23](https://github.com/NervJS/taro/commit/103df2371284b1458d3491ce703791fcf23ef757))
* **transformer:** 多层循环的 JSX 引用会多编译一个数组 ([7cfef07](https://github.com/NervJS/taro/commit/7cfef074893d007180c9a95a6f259d6740b1da3c))
* **transformer:** 访问原始循环 item 减少一个 $ ([1f4e2d0](https://github.com/NervJS/taro/commit/1f4e2d03d2f87ce5bdf0f39425ae4a53f0ae4a78))


### Features

* **cli:** 优化 npm 安装包资源分析，允许引入 npm 安装包自身依赖资源 close [#423](https://github.com/NervJS/taro/issues/423) ([14af040](https://github.com/NervJS/taro/commit/14af04063c219a8c5fb7335fac780f7f27668358))
* **cli:** 增加支付宝小程序编译类型 ([6619011](https://github.com/NervJS/taro/commit/6619011f5718072d68df479e007544f54c8c4ef4))
* **cli:** 处理支付宝小程序配置的差异 ([4633277](https://github.com/NervJS/taro/commit/4633277e57df4807c3b2931e8948c7703c2824e7))
* **cli:** 支持编译样式文件中 import 的样式文件，closes [#746](https://github.com/NervJS/taro/issues/746)，closes [#758](https://github.com/NervJS/taro/issues/758) ([86cc770](https://github.com/NervJS/taro/commit/86cc770145569dba8aa1b882209ef84b9df37129))
* **cli:** 文件中使用 import 引入的模板不再需要 copy ([9af132a](https://github.com/NervJS/taro/commit/9af132a5d47edf1371fd67b5c0ffb4323f4a264e))
* **taro-alipay:** 增加支付宝小程序运行时框架 ([2a558fe](https://github.com/NervJS/taro/commit/2a558fe79aa559a679540c803e4ca90e80ab6de9))



# [1.1.0-beta.1](https://github.com/NervJS/taro/compare/v1.1.0-beta.0...v1.1.0-beta.1) (2018-09-29)


### Bug Fixes

* **taro-swan:** 将 wx 作用域替换为 swan 作用域 ([a82440d](https://github.com/NervJS/taro/commit/a82440dcafeb1f09c8d78fee706343fa977cc242))
* **taro-weapp:** 配合生成  properties 改动 ([d5c8a3d](https://github.com/NervJS/taro/commit/d5c8a3dbe45cac98134273d32352142bc06d8274))
* **transformer:** 修复 wx:for 替换 ([84dccb1](https://github.com/NervJS/taro/commit/84dccb10874cb2d1f7a19729ede3a0f80ee1f5b4))
* **transformer:** 生成组件 properties 姿势改变 ([8175765](https://github.com/NervJS/taro/commit/8175765390a3b71c969b80cfb4fe5578a3c220c7))



# [1.1.0-beta.0](https://github.com/NervJS/taro/compare/v1.0.7...v1.1.0-beta.0) (2018-09-29)


### Bug Fixes

* **cli:** taro update self 不再使用 yarn 来更新，close [#724](https://github.com/NervJS/taro/issues/724) ([9be3d88](https://github.com/NervJS/taro/commit/9be3d88d297ac91d278935d37d23165e2c359097))
* **transformer:** 百度小程序特殊处理 getApp ([5b6a2fe](https://github.com/NervJS/taro/commit/5b6a2fededeb170cc7a17d72ae9c487b7418c2d5))
* **transformer:** 百度小程序的 for 值使用字符串包裹 ([f5470f3](https://github.com/NervJS/taro/commit/f5470f3fc4a057bdd2d2b35ff4e1afd68180c46d))


### Features

* **cli:** cli 支持将 @tarojs/taro 替换成多个端的运行时框架 ([268fa55](https://github.com/NervJS/taro/commit/268fa55d5c2a4f539c9f5e0185faf219c6afed2e))
* **cli:** cli 改造，支持生成百度小程序等其他小程序的文件 ([476a6c9](https://github.com/NervJS/taro/commit/476a6c9062434d4b293fb5fc96cf0f91edd24dbe))
* **cli:** 增加百度小程序类型 ([532876c](https://github.com/NervJS/taro/commit/532876c10925364a77aa220b411366c302d3d7a9))
* **cli:** 生成 swan 的项目配置文件 ([a49c65e](https://github.com/NervJS/taro/commit/a49c65e0e40e3c1c5caf737bf6d131e7e8022aac))
* **taro:** 新增百度小程序 api ([2b2d0e2](https://github.com/NervJS/taro/commit/2b2d0e22828ec04deb687b83bd4804c08d93adba))
* **taro-swan:** 添加百度小程序运行时 ([8ea98a0](https://github.com/NervJS/taro/commit/8ea98a013108915cb51ee2785bbc563624cb8ef9))
* **transformer:** 支持百度小程序 ([c899396](https://github.com/NervJS/taro/commit/c899396a23e854f7db70fafca4c83ac08379436a))



## [1.0.7](https://github.com/NervJS/taro/compare/v1.0.6...v1.0.7) (2018-09-29)


### Bug Fixes

* **cli:** h5页面的require加了default ([80c532a](https://github.com/NervJS/taro/commit/80c532acdbfefd8605c7dba490ac3a194be310a5))
* **cli:** 修复h5页面import的顺序问题 ([3042291](https://github.com/NervJS/taro/commit/304229190ef65a114bad68c8a08d49944bd180d6))
* **transformer:**  无法渲染 class 依赖计算属性（get）, close [#728](https://github.com/NervJS/taro/issues/728) ([20ed37e](https://github.com/NervJS/taro/commit/20ed37e3f5d9a0879ab06ab83c16ce77688c0b5a))



## [1.0.6](https://github.com/NervJS/taro/compare/v1.0.5...v1.0.6) (2018-09-29)


### Bug Fixes

* **cli:** unicode 编码处理,close [#701](https://github.com/NervJS/taro/issues/701), [#741](https://github.com/NervJS/taro/issues/741) ([d97d0dc](https://github.com/NervJS/taro/commit/d97d0dc7fc6a1d312b3d59c80a3de402392a89cd))
* **taro-qapp:** showToast参数不正确 ([4922113](https://github.com/NervJS/taro/commit/4922113f904dc4571a23743bf1d0f713abb9952b))
* **transformer:** 使用循环体内定义的变量来构造新循环报错 ([5ecb95b](https://github.com/NervJS/taro/commit/5ecb95b27a1aba3ca195afc1e2bda3f30b73a9f0))
* **transformer:** 微信的 key 只支持变量读取，不支持计算 ([39ec985](https://github.com/NervJS/taro/commit/39ec98501dd93389c5dd11e79c2e2bd19cba72b9))
* drawImage类型异常 ([52d9029](https://github.com/NervJS/taro/commit/52d902982ea9aa2dc76e67457e4cf939bd6f2bde))
* **webpack-runner:** 修复csso配置的读取错误 ([fa4177d](https://github.com/NervJS/taro/commit/fa4177d955cc1594efdfc2b3297395e5e1c94e6f))
* Duplicate identifier 'buffer'. ([8f4cdda](https://github.com/NervJS/taro/commit/8f4cddae298f9b5167eefa0e6cb6aaf1e0814423))


### Features

* **router:** router改用typescript ([3175efb](https://github.com/NervJS/taro/commit/3175efb5db0a3d58b594cab0efcb17b912d80092))
* **router:** 暂时将page加载改为同步 ([a376b79](https://github.com/NervJS/taro/commit/a376b79d844b30d7da0d77a4075ca575363f86b9))
* **router:** 补回了getCurrentPages函数 ([0388d1f](https://github.com/NervJS/taro/commit/0388d1f1385e489f8bb5f86ca5348ceef9c76832))
* **taro-qapp:** 添加 router的navigateTo、redirectTo ([508134a](https://github.com/NervJS/taro/commit/508134ab1e8966112dac9a37cf4a59901d9cfdf9))
* **webpack-runner:** 修改UglifyOptions内部的传值 ([baf1bae](https://github.com/NervJS/taro/commit/baf1bae5e3e0480f2ecf8c452795de78b1246fba))



## [1.0.5](https://github.com/NervJS/taro/compare/v1.0.4...v1.0.5) (2018-09-27)


### Bug Fixes

* **cli:** rn 端常量替换以及无用 import 移除 ([fd0f78d](https://github.com/NervJS/taro/commit/fd0f78d1c11c7fa45d86fa2af7e58f7d64b82077))
* **cli:** 移除 ts 编译 && babel 编译增加 jsx 插件 ([915893a](https://github.com/NervJS/taro/commit/915893a6d3ace28d72cf447d97c49f5a221b1f59))
* **h5:** 修复 PUT 、DELETE 等请求 body 为对象时无法发送 body 的问题 ([698be65](https://github.com/NervJS/taro/commit/698be6550bccbcde18a3b56167a7c651d2ada614))
* **RN:** 修复样式警告 ([72b5406](https://github.com/NervJS/taro/commit/72b5406681c4fb6f8abdcae27020d5c610d5ea0e))
* **RN:** 兼容 config 未定义的情况 ([94d0f23](https://github.com/NervJS/taro/commit/94d0f23436ce127903d9253ec0728ffc469c9fcc))
* **taro-weapp:** 回退允许设定为 null 的写法 ([39570a3](https://github.com/NervJS/taro/commit/39570a3f414c01357c47aaa905225b47042a7ed8))


### Features

* **taro-h5:** 增加 setTabBarStyle、setTabBarItem APIs ([f933805](https://github.com/NervJS/taro/commit/f93380504e6e979f4616c6247e58c41197615fa2))
* **taro-qapp:** 添加 showActionSheet、setNavigationBarTitle、setNavigationBarColor ([94cbd19](https://github.com/NervJS/taro/commit/94cbd19173ac98f37bb7eac86a5dff39bcf88ee6))



## [1.0.4](https://github.com/NervJS/taro/compare/v1.0.3...v1.0.4) (2018-09-26)


### Bug Fixes

* **cli:** fix the order of merge external babel config before compile script ([c3ae67c](https://github.com/NervJS/taro/commit/c3ae67c5fe2b0ad3fe045e94d83ee5450e81924c))
* **cli:** 升级 process.env 的替换方式 ([345e640](https://github.com/NervJS/taro/commit/345e6409657cf4ecc96c8baf311aac6ebaa6591d))
* **cli:** 小程序端编译去掉无用的 import ([0c05a03](https://github.com/NervJS/taro/commit/0c05a0309363b7a471495532b8317393f5ba93a0))
* **cli:** 组件引用支持写组件文件后缀 ([bbaa88b](https://github.com/NervJS/taro/commit/bbaa88b1fe72c337a828f11a35ea696869ab76b7))
* **RN:** 修复页面 navigation 配置失效的 bug ([132a6a2](https://github.com/NervJS/taro/commit/132a6a23a686871112a8aae267cf91ed5d834ceb))
* **taro-rn:** 修复request api方法为get时的入参问题 ([6e62724](https://github.com/NervJS/taro/commit/6e627244a4ca2c51e39762ae1289fe647ee885e9))
* **transformer:** 循环体内引入外部数组变量会重复赋值，close [#666](https://github.com/NervJS/taro/issues/666) ([21d3302](https://github.com/NervJS/taro/commit/21d3302670bbe8c10ca90d2f3ba1efd61aa73dc0))
* **transformer:** 没有 import @tarojs/taro 时强制添加 ([f07e068](https://github.com/NervJS/taro/commit/f07e068694a2194f616d58a613669acbe7b0ad88))
* **weapp:** 小程序组件更新时允许 null 值覆盖，close [#695](https://github.com/NervJS/taro/issues/695) ([9c13b02](https://github.com/NervJS/taro/commit/9c13b024972f0a94a8a6f0c210d29e98eec75a4f))
* **webpack-runner:** lib插入方式改为prepend ([fbf1644](https://github.com/NervJS/taro/commit/fbf164452a51af7feaa2e694500c0d9edca85c2b))
* **webpack-runner:** webpack-runner支持uglify和css的enable配置了 ([cc9e29f](https://github.com/NervJS/taro/commit/cc9e29f3caf21d7a9addd84522c244deb1a207f8))
* **webpack-runner:** 修复一些问题 ([fd4dc4a](https://github.com/NervJS/taro/commit/fd4dc4a5d53bde3fa8b956c4fe833b54eea1bd29))


### Features

* **cli:** 使用 babel-plugin-transform-define 来处理常量定义 ([88370ee](https://github.com/NervJS/taro/commit/88370eec4c7b32a2a4bd76295c201e1da61ca9e1))
* **cli:** 规范小程序端 weapp.module 的配置 ([13cab9b](https://github.com/NervJS/taro/commit/13cab9bfce5e96a8f7f6cbe24b9f64cd6398efff))
* **RN:** 添加 config.window.navigationStyle 配置  close [#675](https://github.com/NervJS/taro/issues/675) ([fe94303](https://github.com/NervJS/taro/commit/fe9430321d542544876a70d86c1997568ee3d94e))
* **RN:** 添加 showNavigationBarLoading 与hideNavigationBarLoading API，并更新对应文档 ([9648a60](https://github.com/NervJS/taro/commit/9648a60e561c053b0ba041e53403a35685db2e27))
* **RN:** 添加 Taro.setNavigationBarTitle 和 Taro.setNavigationBarColor API , close [#669](https://github.com/NervJS/taro/issues/669) ([6cca77c](https://github.com/NervJS/taro/commit/6cca77c1fefb506fb5605ef66546c48f5b289590))
* **taro-h5:** 新增 arrayBufferToBase64 与 base64ToArrayBuffer API ([af4f438](https://github.com/NervJS/taro/commit/af4f438bfbe535534f486f1cac9b4b75f844bc99))
* **taro-qapp:** showToast支持promise ([0645870](https://github.com/NervJS/taro/commit/06458709c42519d72e0ea86a5497a78160bacf27))
* **taro-qapp:** 增加 interactive 的 showToast和showModal ([766c2aa](https://github.com/NervJS/taro/commit/766c2aa189c0cca929b21b1b7892045180eb0b0b))
* **taro-qapp:** 添加showActionSheet ([795357d](https://github.com/NervJS/taro/commit/795357d2dd0c31473f0b40e7dbce570e4e217bac))
* **taro-rn:** 新增arrayBufferToBase64和base64ToArrayBuffer api ([0b96edc](https://github.com/NervJS/taro/commit/0b96edc6f864afabf8199fcb7ce923c172595c8b))
* **webpack-runner:** 整理webpack-runner的log函数 ([3928eb3](https://github.com/NervJS/taro/commit/3928eb3ff706282b1a03496e0a5568e2a0a7613d))
* **webpack-runner:** 添加dll编译支持 ([1b8b20d](https://github.com/NervJS/taro/commit/1b8b20d2cd2ad836ecde972abdf154ee270aaec6))
* **webpack-runner:** 简化重复的配置处理代码 ([cd13823](https://github.com/NervJS/taro/commit/cd13823375df2e8cb0ed3264dec11e00c5857c3c))



## [1.0.3](https://github.com/NervJS/taro/compare/v1.0.2...v1.0.3) (2018-09-20)


### Bug Fixes

* **cli:** 模板缺少文件，close [#660](https://github.com/NervJS/taro/issues/660) ([1dc3243](https://github.com/NervJS/taro/commit/1dc32435bc553f2c3329b7e571f2c74319fd7dc5))
* **RN:** 修复项目初始化后 less 编译报错 [#650](https://github.com/NervJS/taro/issues/650) ([d05df59](https://github.com/NervJS/taro/commit/d05df59af80adace7cb642d7d2317b2d5a614745))
* **transformer:** 三元表达式有一个值为循环调用时生成两个相同循环 ([b85d04d](https://github.com/NervJS/taro/commit/b85d04da1453f1faf15a2c0166cdcf429313ec75))
* **transformer:** 多层循环访问上层迭代值时没有加上 $$original ([b8d5168](https://github.com/NervJS/taro/commit/b8d5168a0931a29ee965b7f75da3cf679088ed12))
* **weapp:** 梳理事件传递时绑定作用域的各种情形 ([c345770](https://github.com/NervJS/taro/commit/c345770dd76f9a46d0907ccb722a8d44fe73dbd9))


### Features

* **taro-qapp:** 增加 storage 相关 api ([ca2ddb2](https://github.com/NervJS/taro/commit/ca2ddb27d22980841c45bff52b5a5c15021a61c6))
* **transformer:**  adapter 数据结构和操作 ([670cb3e](https://github.com/NervJS/taro/commit/670cb3e60c20249455bd81121732d17f53eb17d1))
* **weapp:** 支持配置propTypes ([8ee93e9](https://github.com/NervJS/taro/commit/8ee93e90f6eb3ba0fe14f8853616275b3c843afa))



## [1.0.2](https://github.com/NervJS/taro/compare/v1.0.1...v1.0.2) (2018-09-19)


### Bug Fixes

* **component:** 暂时规避Nerv diff数组的问题 ([e04df79](https://github.com/NervJS/taro/commit/e04df79811fa0450bb7a95d386ed21af0725ce78))
* **transformer:** 在 if block 中定义的 JSX 变量无法在 JSX children 替换 ([3878e84](https://github.com/NervJS/taro/commit/3878e847ddd39a5876b9bdb9d7ef221f3b5134e9))
* **transformer:** 在 if block 定义没有初始值的变量报错 ([fa5c6ec](https://github.com/NervJS/taro/commit/fa5c6ecc43c3e0bea7ff6647f81d39486fb22a98))
* **transformer:** 直接 return 一个 JSX 引用失效 ([8772038](https://github.com/NervJS/taro/commit/87720386408a1bd48748f62d78dab1afd8e10b52))


### Features

* **cli:** ts 模板声明图片和 css 为模块 ([555ee9b](https://github.com/NervJS/taro/commit/555ee9b980ef0f3b2cee967feb399dd38a2632eb))
* **RN:** RN 端支持 typescript ([f999a2c](https://github.com/NervJS/taro/commit/f999a2c33d6d278c54ca440a822cfdc7e184f92a))



## [1.0.1](https://github.com/NervJS/taro/compare/v1.0.0...v1.0.1) (2018-09-18)


### Bug Fixes

* **cli:** H5 编译时去掉无用的 import 代码 ([a406d9e](https://github.com/NervJS/taro/commit/a406d9e366b221769fff55afa89a3e2a1814c067))
* **taro:** getEnv rn 端环境变量错误 ([6f02583](https://github.com/NervJS/taro/commit/6f02583f678cbcd12656779608b15291c479efb8))
* **transformer:** TARO_ENV 解析不正确 ([780cf9f](https://github.com/NervJS/taro/commit/780cf9fb42af378e3a2c28776204d64618d1d6ed))



# [1.0.0](https://github.com/NervJS/taro/compare/v1.0.0-beta.30...v1.0.0) (2018-09-18)


### Bug Fixes

* **taro-components:** input 组件 maxlength -> maxLength ([b79d7eb](https://github.com/NervJS/taro/commit/b79d7ebbe75cd7a8956bb4179f32bc0c81eb1a40))
* **transformer:** 单独处理 maxLength 的大小写问题，close [#631](https://github.com/NervJS/taro/issues/631) ([cacd4a7](https://github.com/NervJS/taro/commit/cacd4a74b613309b10081b184f66cf6d3656ebda))
* **weapp:** 去掉初始化时的深拷贝数据避免过大开销 ([d4ec619](https://github.com/NervJS/taro/commit/d4ec6190b2a34368c2b1409b83a4a6530362c69e))


### Features

* **cli:** rn 端编译增加环境变量 ([2975dff](https://github.com/NervJS/taro/commit/2975dffb459c621ab2de779742f785b4fee87f03))
* **taro:** 同步微信 api ([f41e8f4](https://github.com/NervJS/taro/commit/f41e8f43cf115403b04dc778ac598cdae26e4f84))
* **taro-weapp:** 可以在页面里通过 this.$app.$router.params 拿到程序入口的参数 ([defc534](https://github.com/NervJS/taro/commit/defc534c603a0d9e51da4d044fbef7ff2b04a1bb))
* **webapck-runner:** 调整enableSourceMap和enableExtract的默认行为 ([6cb861a](https://github.com/NervJS/taro/commit/6cb861a9382f3246cc4eaf1950bf219c02ff2896))



# [1.0.0-beta.30](https://github.com/NervJS/taro/compare/v1.0.0-beta.29...v1.0.0-beta.30) (2018-09-17)


### Bug Fixes

* **taro-weapp:** 深度拷贝函数 bug 修复 ([b7ba318](https://github.com/NervJS/taro/commit/b7ba31805fa0c72a4aaa3038df85427d3709760b))
* **transformer:** 编译器默认写死了 TARO_ENV 为 weapp ([f9bc84d](https://github.com/NervJS/taro/commit/f9bc84da68f82f71142dd5a758a21e10bf6ab2ae))



# [1.0.0-beta.29](https://github.com/NervJS/taro/compare/v1.0.0-beta.28...v1.0.0-beta.29) (2018-09-17)


### Bug Fixes

* **RN:** 将 taro-redux-rn 的peerDependencies react  改为 "^16.3.0" ([69f530c](https://github.com/NervJS/taro/commit/69f530c4e2d0a62294ca610ae48bc0a48de07fc4))
* **transformer:**  所有字符串模板都生成一个新的 state ([7408f94](https://github.com/NervJS/taro/commit/7408f94e02d5d3169cf8aef682758e3c23205883))


### Features

* **cli:** cli编译ui兼容新配置 ([1c28774](https://github.com/NervJS/taro/commit/1c2877482309e9aa8903e4c42e0fb95e212c74b3))



# [1.0.0-beta.28](https://github.com/NervJS/taro/compare/v1.0.0-beta.27...v1.0.0-beta.28) (2018-09-15)


### Bug Fixes

* **cli:** h5 编译路由初始化遗漏参数 ([e4dda98](https://github.com/NervJS/taro/commit/e4dda98da9d6f6854bfc52bed6864eb51e16a42d))
* **cli:** 小程序编译 UI 库引用错误 ([3af257b](https://github.com/NervJS/taro/commit/3af257bf66cedc1b3c532c09716103bdf3a09ade))
* **webpack-runner:** 修复字体文件、图片文件打包失败的问题 ([d515aff](https://github.com/NervJS/taro/commit/d515afff40167deb7ba1d3a2e40d71c6150972ea))



# [1.0.0-beta.27](https://github.com/NervJS/taro/compare/v1.0.0-beta.26...v1.0.0-beta.27) (2018-09-15)


### Bug Fixes

* **cli:** H5 端编译 app 配置编译错误 ([ac5fb35](https://github.com/NervJS/taro/commit/ac5fb35925fe1f63c77e5942c2f44a51860f4fd4))
* **compile:** start compile error while clean folder under Window ([e528837](https://github.com/NervJS/taro/commit/e528837a389e01eb1610643d77fdd5638e0b0c5b))
* **h5:** H5 request API 对 post 请求参数做序列化 ([fd9407b](https://github.com/NervJS/taro/commit/fd9407b44b66050332ddd9f6a9c774287c46ec2b))
* **h5:** H5 request API 对 post 请求参数做序列化 ([c003e02](https://github.com/NervJS/taro/commit/c003e022edfb46ef45f0e5bf12f77169bd4c5ab7))
* **RN:** [#584](https://github.com/NervJS/taro/issues/584) 添加 taro-redux-rn 包，重构 taro-router-rn。 ([b8ab4d7](https://github.com/NervJS/taro/commit/b8ab4d7a3c6afa51125c8f9841cb3b6fcb15e481))
* **RN:** [#621](https://github.com/NervJS/taro/issues/621) 修复中文编译后变成转义字符的问题 ([76fb60d](https://github.com/NervJS/taro/commit/76fb60dedef22cdcf76843c595763d6cf96e2702))
* **RN:** this.screenRef 未取 current ([c86e9f4](https://github.com/NervJS/taro/commit/c86e9f40abc1f0891f3f65d495f00dc3cd1f82fa))
* **RN:** 修复 react-redux 的 connect 包裹导致下拉刷新功能失效的问题 ([5beeef4](https://github.com/NervJS/taro/commit/5beeef45fdced8ff2d698f9209486a8566bd1086))
* **RN:** 修复重构导致的路由bug ([cfc3f09](https://github.com/NervJS/taro/commit/cfc3f099f02b1f0d1cfc3c511ddb193abceee299))
* **taro-components:** 修复 rich-text 代码覆盖问题 ([4e8c620](https://github.com/NervJS/taro/commit/4e8c6201224ff7e48edb1bab5152a2150600d9f7))
* **taro-components:** 修复 RichText 解析问题 ([19c4451](https://github.com/NervJS/taro/commit/19c445155dc9b1fd2922422e9bee23233c46b8bc))
* **taro-components:** 删除导出文件 ([e4475b1](https://github.com/NervJS/taro/commit/e4475b10f186ceeebec77aa1f05e41e832367d4e))
* **taro-conponents:** 删除 package.json 冗余问题 ([20548aa](https://github.com/NervJS/taro/commit/20548aac75f19ad499d1ab2d0f3d24c3afde9d68))
* **taro-h5:** 去掉无用的 api ([c7ec950](https://github.com/NervJS/taro/commit/c7ec95086176bbe6a25abc81c7acc700dcb3103b))
* **taro-rn:** 修复request入参的参数处理 ([3175b96](https://github.com/NervJS/taro/commit/3175b96dd99fb66a68b305fbe880e66acd8ac4a1))
* **taro-weapp:** 修复 connectSocket 拿不到 socketTask 的问题，fix [#619](https://github.com/NervJS/taro/issues/619) ([f5ad3e5](https://github.com/NervJS/taro/commit/f5ad3e55aeed70ec0c0c95a25496a4a100402519))
* **transformer:**  if 语句中循环体内的变量不需要变量提升 ([d2cf83b](https://github.com/NervJS/taro/commit/d2cf83ba701e9465fbbebb7dd7c9ca1574f1eb0f))
* **transformer:** 即便当前组件没有找到事件声明也需要给 JSX 元素补上 __fn_event ([b00154d](https://github.com/NervJS/taro/commit/b00154d4028b5dc8189168b8f78b8993fe174a57))
* **transformer:** 在 if 块中某些情况无法生成循环 ([e2e2579](https://github.com/NervJS/taro/commit/e2e257927cec826b1bf080fd8a99099e3198fbee))
* **transformer:** 如果是第三方组件的事件需要保持原来的大小写命名, close [#551](https://github.com/NervJS/taro/issues/551) ([3eab15d](https://github.com/NervJS/taro/commit/3eab15d1c7024fb701dc82cc816f10bd31bd00a2))
* **transformer:** 当循环类型为数组、基本类型时可能会改变源数据的数据结构 ([fd59a09](https://github.com/NervJS/taro/commit/fd59a09c8ed0554d0f669dcce16df5f3579f3ee3))
* **transformer:** 循环体内的所有非自动生成的 item 都要加上 item.$$original ([5592caf](https://github.com/NervJS/taro/commit/5592caffd3cac9cad2e5907862a4f5802ab0aad0))
* **transformer:** 生成的匿名循环数组在原位置之后添加 ([51f22ce](https://github.com/NervJS/taro/commit/51f22ce629640913367a78f5b697cd4b428b85a8))
* **transformer:** 识别文件后缀名错误，close [#600](https://github.com/NervJS/taro/issues/600) ([9843d9c](https://github.com/NervJS/taro/commit/9843d9c0243189623c81a453bebf830818703c84))
* **weapp:** 修复组件初始化数据会被修改问题 ([6509620](https://github.com/NervJS/taro/commit/6509620e22d39ef40dbc447f76ed200a45807857))
* **webpack-runner:** 修复配置的一些错误 ([9e1e36a](https://github.com/NervJS/taro/commit/9e1e36a14f22c44e5f9690a4a878c643d4e8a4a5))


### Features

* **cli:** 增加router chunk文件的webpackChunkName注释 ([ab992da](https://github.com/NervJS/taro/commit/ab992da2fb5fb614335d7a2d82e379c5c9c47fc4))
* **cli:** 移除一个node v8.5的api ([de6964a](https://github.com/NervJS/taro/commit/de6964a80115dcd2887f9797ee9a0913307cbdad))
* **components-rn:** 支持Input和Textarea通过属性prop主动变更输入内容 ([11be435](https://github.com/NervJS/taro/commit/11be4350ce85bdd1bc5a6af37ec281d094545589))
* **RN:** 添加 $app 的支持 ([b227ebd](https://github.com/NervJS/taro/commit/b227ebd80d39c4ab77dfd4ea9b4ba0495f33bba2))
* **taro:** 增加 canIUseWebp api ([19e29c1](https://github.com/NervJS/taro/commit/19e29c15c14098ba704d5c1c2ff4d87645972e6b))
* **taro:** 增加 createLivePlayerContext 和 createLivePusherContext ([d45711d](https://github.com/NervJS/taro/commit/d45711d99227948110b31d74f8016d9386653039))
* **taro-qapp:** 增加快应用端 API request ([07c4d20](https://github.com/NervJS/taro/commit/07c4d20fdbc3a1b63b1a5fe4d92014aa1095a842))
* **tcr:** 让checkbox同时受属性checked的主动性影响 ([91de11b](https://github.com/NervJS/taro/commit/91de11bf43cbfa515a0cf161337e7b1a92677e32))
* **transformer:**  return null 可以提前中断 render 同时不会影响 props 传递 ([ecff4a6](https://github.com/NervJS/taro/commit/ecff4a6907a67db66fdc81fa9ab3a99906892a17))
* **transformer:** render if-else 中可以 return undefined（不推荐） ([8be510a](https://github.com/NervJS/taro/commit/8be510ac074668de8eb36a19799af7b71aa7b1dc))
* **transformer:** 从父类继承 this.props ([06854a3](https://github.com/NervJS/taro/commit/06854a33dd518315e7cf92bdb575cec724cd03b7))
* **transformer:** 在循环的父级有条件判断应该应用到循环之前 ([fc1ff2c](https://github.com/NervJS/taro/commit/fc1ff2c9ab6c8752d7ecf6c69d1b08a97094a69b))
* **transformer:** 提前处理字符串模板，不再加入匿名 state ([75c5032](https://github.com/NervJS/taro/commit/75c50322775850d68b2e7a33f0311985469c4b81))
* **transformer:** 根据 process.env.TARO_ENV 去除无用条件代码 ([eee9923](https://github.com/NervJS/taro/commit/eee9923dabe9b8ab74ab206db95062eb3c9ca6c7))
* **webpack-plugin:** 添加html、define插件 ([a212b48](https://github.com/NervJS/taro/commit/a212b486c509dc9acee71b056b0b113ffdc3eb58))
* **webpack-runner:** h5配置项调整 ([b140ff5](https://github.com/NervJS/taro/commit/b140ff5cbd89bdbfd4176e2388a28f28f2d6d9f8))
* **webpack-runner:** 优化devServer配置 ([86da585](https://github.com/NervJS/taro/commit/86da585b8cca005187a04c48b08d14cbb9647f3e))
* **webpack-runner:** 优化编译信息展示 ([b65133b](https://github.com/NervJS/taro/commit/b65133bbee0865c7f5e236304fad5f1dc4f02e52))
* **webpack-runner:** 修复import与extract插件的配置错误 ([bfae27a](https://github.com/NervJS/taro/commit/bfae27a11e6642aebf3eafc9a403447edec42424))
* **webpack-runner:** 加入webpack-runner配置项的deprecate提示 ([8ceee13](https://github.com/NervJS/taro/commit/8ceee13436415a708bf2df0725b0edfc610747be))
* **webpack-runner:** 增加chunkFileName配置支持 ([c7c0d00](https://github.com/NervJS/taro/commit/c7c0d00ed88ea887a4019225ad6759378d31efbf))
* **webpack-runner:** 支持enableExtract配置 ([e2782cb](https://github.com/NervJS/taro/commit/e2782cb981043b26b56ce4777c09b931158aa616))
* **webpack-runner:** 支持h5.webpackChain参数 ([3c2eb8d](https://github.com/NervJS/taro/commit/3c2eb8d5a3d045d674efde7a2b8ccae7933f5e48))



# [1.0.0-beta.26](https://github.com/NervJS/taro/compare/v1.0.0-beta.25...v1.0.0-beta.26) (2018-09-10)


### Bug Fixes

* **RN:**  startWith  to startsWith ([20f82b8](https://github.com/NervJS/taro/commit/20f82b86b0c81c01009eb2619161308dfd5eb9b8))
* **taro-weapp:** 将 componentDidUpdate 放到 setData 回调中执行，close [#596](https://github.com/NervJS/taro/issues/596) ([ef51c81](https://github.com/NervJS/taro/commit/ef51c81ef16fdbd5dbeb87d750e08dca13076bce))


### Features

* **cli:** 支持小程序分包 ([9bb3e98](https://github.com/NervJS/taro/commit/9bb3e986708a4e5cb23553be96da1492f2f386e6))



# [1.0.0-beta.25](https://github.com/NervJS/taro/compare/v1.0.0-beta.24...v1.0.0-beta.25) (2018-09-06)


### Bug Fixes

* **cli:** 更换清空目录 API ，解决部分机器上编译报错问题 ([a22c385](https://github.com/NervJS/taro/commit/a22c385b38fc8f7a6c0e143efdd720ecb5212d0e))
* **eslint:** 某些情况循环中使用 map 解析错误 ([b3ae01d](https://github.com/NervJS/taro/commit/b3ae01d19d512f90d0927118759631b72b18df20))
* **RN:** 修复了 redux  模版未用 Text 组件包裹导致不显示的问题 ([4a260ca](https://github.com/NervJS/taro/commit/4a260ca4f79b2c84ab60062f4574129b870de041))
* **RN:** 修复未引入样式的js也会生成对应的 style 文件的 bug ([0511580](https://github.com/NervJS/taro/commit/0511580b212bdf8bbb9f27255eca072543f83e98))
* **RN:** 兼容小程序的路有跳转规范 ([1b2875d](https://github.com/NervJS/taro/commit/1b2875db6fe81e725b5d97e6b2dcae9998d61d6a))
* **router:** 修复某些情况获取不到$router问题 ([075ae2d](https://github.com/NervJS/taro/commit/075ae2deec93d03d7048193db4e55eaa48794cf3))
* **taro-compontents:**  修复 Block 返回问题 && 修复 form 文档问题 ([0c9a4cc](https://github.com/NervJS/taro/commit/0c9a4cc8bc69086342d1730e0cd565e503bee578))
* **taro-redux:** connect时将redux而来的props从配置中剔除 ([42c8be6](https://github.com/NervJS/taro/commit/42c8be6f3682fca6126dec3d34294e946970f5e2))
* **taro-redux:** 兼容properties配置可能为空或mapState返回空的情况 ([f7a6c27](https://github.com/NervJS/taro/commit/f7a6c27648c8f850f574ade3c67be4a6839371d1))
* **tcr:** ScrollView在无外部元素的时候会全屏 ([2c7e981](https://github.com/NervJS/taro/commit/2c7e9815cc32f587d4f2e927cca044357e90ce52))
* **tcr:** 给ScrollView加了样式height导致无法滚动，fix [#577](https://github.com/NervJS/taro/issues/577) ([1e1999d](https://github.com/NervJS/taro/commit/1e1999d087b055d12fa9ef18e8f36364ef752048))
* **transformer:**  增加 Block 组件 ([9635c1d](https://github.com/NervJS/taro/commit/9635c1dc0853a726f51c81007f2d32766ce869b4))
* **transformer:** 即便在类中没有找到方法也要加到 $events, close [#563](https://github.com/NervJS/taro/issues/563) ([33c8c38](https://github.com/NervJS/taro/commit/33c8c38989799a290ee0b7667a960863615f9164))
* **transformer:** 多个 `this.props` 在 JSX children 中无法使用 ([5dd8f12](https://github.com/NervJS/taro/commit/5dd8f122f70f9e7e954171e21fb4bdca295a127f))
* **transformer:** 解析图片地址错误 ([3e6eb3a](https://github.com/NervJS/taro/commit/3e6eb3ac610d1bae210d651e34882ec7fbc6be21))


### Features

* **cli:** 小程序支持插件引用 ([0d256fe](https://github.com/NervJS/taro/commit/0d256fe11d9d1a69a34bde708df4fd45f8c8887c))
* **cli:** 模板增加 rn 编译 script ([a216ee8](https://github.com/NervJS/taro/commit/a216ee83741d8352b9ea17a6ef7536196c732751))
* **taro:** 增加 Taro.requirePlugin 调用插件 JS 接口 ([f65c51f](https://github.com/NervJS/taro/commit/f65c51f44d47f10f9514072c372af71bd3b6c8b3))
* **transformer:** 在 render 中提前 return null 可以终止 render ([a093b8e](https://github.com/NervJS/taro/commit/a093b8e481a40a5b1acf1b744bbce3f3b6f0201d))
* 文档底部导航兼容移动端 ([1a49e2f](https://github.com/NervJS/taro/commit/1a49e2f0b14656528e6ab221ff2de30bcbcdd3df))
* 更新.gitignore ([3fac0d9](https://github.com/NervJS/taro/commit/3fac0d90b79b9288a04c60be2d2d123e099f412f))
* 更新siteConfig.js ([bebe4c0](https://github.com/NervJS/taro/commit/bebe4c04185b52330182d8e07ea5eaf3434c61f1))



# [1.0.0-beta.24](https://github.com/NervJS/taro/compare/v1.0.0-beta.23...v1.0.0-beta.24) (2018-09-05)


### Bug Fixes

* **cli:** h5 编译去掉 api 初始化 ([8d824cf](https://github.com/NervJS/taro/commit/8d824cff5166e0b6510ab5f5485a665a2d7ae72f))
* **cli:** 模板去掉 cli 依赖 ([84f33b7](https://github.com/NervJS/taro/commit/84f33b76eab979954e4c6ae3c1104fecfc439de9))
* **taro-h5:** api 初试化提前 ([b8b02fd](https://github.com/NervJS/taro/commit/b8b02fd5ee26563c984036197fbbbe1b13da59b7))
* **transformer:** this.$router 无法加入 state ([e9eacb4](https://github.com/NervJS/taro/commit/e9eacb40c39b5664998f2097a1470eb8014b42a3))


### Features

* **taro-components:** 新增 block 组件 (内置组件，小程序转 Taro使用到) ([6cb1364](https://github.com/NervJS/taro/commit/6cb13648739d2702be6049d1a3a098b450bae4f4))
* **taro-components:** 新增 block 组件 (内置组件，小程序转 Taro使用到) ([b7096a9](https://github.com/NervJS/taro/commit/b7096a9119da691ea875b0d17fc3257f69b64800))



# [1.0.0-beta.23](https://github.com/NervJS/taro/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2018-09-03)


### Bug Fixes

* **cli:** json 文件解析错误, close [#547](https://github.com/NervJS/taro/issues/547) ([176c117](https://github.com/NervJS/taro/commit/176c11779f35cf9eb620801f6d3920d28b0a7924))
* **RN:** 修复全局样式文件硬编码的问题 ([f5012a3](https://github.com/NervJS/taro/commit/f5012a347cb881c0b1d584bcee6c8f4c3bb916b1))
* **taro-components:** input 去除默认字体 && 删除样式 Swpier 样式分号问题 ([40e8828](https://github.com/NervJS/taro/commit/40e8828eea91af7015abd2052d4dea530782cad2))
* **taro-weapp:** 补全完整的错误提示 ([bf1b89f](https://github.com/NervJS/taro/commit/bf1b89f70813aa3474f25e8fc9a41fcd1920f3ae))
* **transformer:** 第三方组件也应该正常处理事件 ([2920f33](https://github.com/NervJS/taro/commit/2920f335c4ee8622237a15d75bc98ce47744b1e0))
* **transformer-wx:** 增加默认基础组件，fix [#562](https://github.com/NervJS/taro/issues/562) ([e288fc4](https://github.com/NervJS/taro/commit/e288fc4d6d1435eb2b29c2631786e06b985283b5))
* **weapp:** 修复props传递函数bind作用域被覆盖问题 ([5676b80](https://github.com/NervJS/taro/commit/5676b8071bd9790e2e5fb86601135297e1681588))
* **weapp:** 修复在render中通过return来中断代码执行可能会造成state丢失的问题 ([5402dff](https://github.com/NervJS/taro/commit/5402dffebca92a6ffbc61181b11b0614b5f5b088))
* mapStateToProps 缺少第二个参数ownProps ([0236314](https://github.com/NervJS/taro/commit/023631485d89f74c8c77dd420bf5339e95eba645))


### Features

* **taro:** 增加 Event.once 方法，close [#402](https://github.com/NervJS/taro/issues/402) ([06b9e7a](https://github.com/NervJS/taro/commit/06b9e7a12196d86976954b0193499111ff163ab5))



# [1.0.0-beta.22](https://github.com/NervJS/taro/compare/v1.0.0-beta.21...v1.0.0-beta.22) (2018-08-30)


### Bug Fixes

* **cli:** 优化组件判断 ([fb404f1](https://github.com/NervJS/taro/commit/fb404f1ad7b55b9c7b093792ac8af84995cf710e))
* **weapp:** 修复构造函数里的state覆盖的问题 ([38efaf1](https://github.com/NervJS/taro/commit/38efaf1a01edd4488a60e15ebd91560c2a659727))



# [1.0.0-beta.21](https://github.com/NervJS/taro/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2018-08-30)


### Bug Fixes

* **cli:** 优化是否是 taro 组件的判断方式 ([d835113](https://github.com/NervJS/taro/commit/d8351138bed0146db181f2ef694410c96491d8fb))
* **cli:** 添加 babel-plugin-transform-jsx-to-stylesheet 到 update 命令的更新列表 ([8bd231a](https://github.com/NervJS/taro/commit/8bd231afb20f4df2d3dbedd2d1f567297f14348e))
* **weapp:** 修复setState时对象减少字段无法更新到的问题 ([05256c3](https://github.com/NervJS/taro/commit/05256c33323d78d0a495c687c5c48869c22cd5f4))


### Features

* **cli:** ui 库编译引入静态资源中引入的文件 ([5aaa772](https://github.com/NervJS/taro/commit/5aaa77263f80419d11213949567ae922ee6392f4))
* **cli:** 编译增加错误信息暴露 ([2d76055](https://github.com/NervJS/taro/commit/2d760551e7e62f897d1c78d82f9b7d7349c0b8ac))
* **RN:**  RN 的 temp 目录改为 .rn_temp ([0ba6069](https://github.com/NervJS/taro/commit/0ba60692dfbb9c625d2e3216e040ebbd4a805de7))
* **RN:** 去掉多余的log ([883be60](https://github.com/NervJS/taro/commit/883be60f0cb68811ac267ee8dfe27ed0303edaea))
* **weapp:** 对于非内部跳转的页面保持原有的处理的方式 ([48326f5](https://github.com/NervJS/taro/commit/48326f5516f0040b94a0b6254ecc1ff99fa3f776))
* **weapp:** 生命周期与小程序靠齐,页面初始化时机提前至attached ([e9e089b](https://github.com/NervJS/taro/commit/e9e089b40e34e884ee5e0bb2dc992abe1c938685))



# [1.0.0-beta.20](https://github.com/NervJS/taro/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2018-08-29)


### Bug Fixes

* **taro-components:** 修复 Swiper onChange 事件 && Input type 值优化 ([077f634](https://github.com/NervJS/taro/commit/077f634026a9f647a9392e057c8123e35786535e))
* **transformer:** 在 JSX 中使用注释会导致 Windows 多出一个空行 ([1051b45](https://github.com/NervJS/taro/commit/1051b455ea8fe2a0e82676762f4683dee6aed6a2))



# [1.0.0-beta.19](https://github.com/NervJS/taro/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2018-08-28)


### Bug Fixes

* **cli:** ui 库编译出错，路径处理错误 ([f39aaba](https://github.com/NervJS/taro/commit/f39aaba72cbef36caf5d23e8cf1669d1ab1deebd))
* **cli:** 添加  prop-types 到 cli 的 package.json 中 ([940cf8a](https://github.com/NervJS/taro/commit/940cf8a958735edf3c491b237031c984e7f17b32))
* **RN:** path.sep 生成的路径分隔符 \\  无法识别 ([1cdb475](https://github.com/NervJS/taro/commit/1cdb47544e19f8e08fb4ce3cd1752bc5a7b536a0))
* **RN:** 修复样式使用 classnames 报错问题 ([f94702d](https://github.com/NervJS/taro/commit/f94702d05407737c42963078d946ba8535ca4f81))
* **router:** 修复navigateBack不带参数时报错的问题 ([5ba0838](https://github.com/NervJS/taro/commit/5ba0838b51628a05e3a6e6e25381c8b14d723a09))
* **taro:** children 的类型定义使用 readonly any ([33dfa47](https://github.com/NervJS/taro/commit/33dfa4795a1b68c7ca91765562f673c5045a50d4))
* **taro-conpontens:** 修复单列选择器 rangeKey 问题 && 默认值问题 ([1583acb](https://github.com/NervJS/taro/commit/1583acb25c73bd02d48490cc8aaa547706e6a8ae))
* **taro-weapp:** 低版本 IOS 下部分属性不能直接访问 ([daab0d4](https://github.com/NervJS/taro/commit/daab0d475ca9c81a2137e42880fb37ddd70e3596))
* **taro-weapp:** 修复 componentDidCatchError 和 componentDidNotFound 丢失参数的问题 ([243dc26](https://github.com/NervJS/taro/commit/243dc263d75b9830de7b5c8f43b6a85264e87768))
* **tcr:** Input 回车没触发onKeyDown事件，使用onSubmitEditing来执行回调 ([1006343](https://github.com/NervJS/taro/commit/1006343020cdc67d065695a37fe7f75592491662))


### Features

* **cli:** ui 库编译解析样式文件之间的引用 ([1fb806b](https://github.com/NervJS/taro/commit/1fb806bf2ae831f63b6f4cb668d3cc5bc2497791))



# [1.0.0-beta.18](https://github.com/NervJS/taro/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2018-08-27)


### Bug Fixes

* **cli:** ui 库打包，小程序端只有引用到的资源才打包进 dist 目录 ([2835615](https://github.com/NervJS/taro/commit/28356151ff6d6ee33d32d4f5c055da24d9e9f65b))
* **taro:** 更新 this.props.children 为 never 类型 ([db70d12](https://github.com/NervJS/taro/commit/db70d124078d8340b2ad441055c379afac5ace30))
* **transformer:** className -> class 只作用于自定义组件 ([0b4d7ce](https://github.com/NervJS/taro/commit/0b4d7ce63f68297f70db179e95162bf39737f4b0))
* **transformer:** 有 if return 时会继续执行后续语句 ([89d319f](https://github.com/NervJS/taro/commit/89d319f833d8088cd2b58048f6308727b51e3143))
* **transformer:** 第三方组件不处理 key 和事件，close [#521](https://github.com/NervJS/taro/issues/521) ([4b72496](https://github.com/NervJS/taro/commit/4b7249672cc88298e8ee79c3a9d1be7f59eca555))
* **weapp:** 过滤data时避免改变对象属性的顺序 ([66da471](https://github.com/NervJS/taro/commit/66da471eb3f3d0116a502c89eaf86ab24f8622d0))


### Features

* **RN:**  添加 babel-plugin-transform-jsx-to-stylesheet ([f038e65](https://github.com/NervJS/taro/commit/f038e656589a05825e044224d0e7abc94682f292))
* **RN:** 支持全局样式 ([9e6b0f1](https://github.com/NervJS/taro/commit/9e6b0f158cd9ebc682b7c6050f2131ad94b56e24))



# [1.0.0-beta.17](https://github.com/NervJS/taro/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2018-08-25)


### Bug Fixes

* **cli:** 组件中引用 node_modules 中组件问题修复 ([f3abbd9](https://github.com/NervJS/taro/commit/f3abbd93b27f4a1468c56c065b8648b632cad3bf))
* **weapp:** nextTick 增加使用 wx.nextTick ([eff17cc](https://github.com/NervJS/taro/commit/eff17cc7f9c930a676adab08767b67e7135404f4))
* **weapp:** 保留组件提前渲染的逻辑 ([60faca1](https://github.com/NervJS/taro/commit/60faca16edab266fc59667d3ed47931d69a484d5))
* **weapp:** 修复页面组件detached造成动态组件渲染出错的问题 ([6cdd6a7](https://github.com/NervJS/taro/commit/6cdd6a7dea256f68b5b6f8bb026eb323cfbd9aba))


### Features

* **components:** 优化组件库打包 ([ea6be1f](https://github.com/NervJS/taro/commit/ea6be1f9fb5d1a1bf4aaffa36ab36844f343dafb))
* **docs:** 添加 RN 端的文档 ([11d0066](https://github.com/NervJS/taro/commit/11d0066963d0259b96b2c0b0b37372fd5067ad5e))
* **tcr:** 增加Input 和 Textarea的onKeyDown事件支持，并加上event.target ([ca25786](https://github.com/NervJS/taro/commit/ca257864445f65e9d738a5d7bf5fa9d7eff351b1))
* **tcr:** 所有Input和Textarea事件加上event.target ([2b4f1db](https://github.com/NervJS/taro/commit/2b4f1dba71a6e6bc5778217fb1274d0c067707a3))
* **weapp:** setData时保留undefined字段，小程序会有错误提示 ([d411891](https://github.com/NervJS/taro/commit/d4118916d0989a60637ecc9d033f67107915b04c))
* **weapp:** setState优化 ([e04cab3](https://github.com/NervJS/taro/commit/e04cab3839f67ca87bc7ba02c2822848dbdaabc4))



# [1.0.0-beta.16](https://github.com/NervJS/taro/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2018-08-23)


### Bug Fixes

* **eslint:** if-statement-in-map-loop 检查错误, fix [#510](https://github.com/NervJS/taro/issues/510) ([daa0031](https://github.com/NervJS/taro/commit/daa00318e9982a76c897b2f6d5d19fbfc87021ae))
* **redux:** 修复 shallowEqual 判断问题 ([8265811](https://github.com/NervJS/taro/commit/8265811c6b5e9f85646d85516f4575223891b0fa))
* **taro-components:** 修复 Input password 类型不生效问题 (对齐小程序) ([b2bfe8c](https://github.com/NervJS/taro/commit/b2bfe8c1d09ecdc1a165b043494ca8ad216530fa))
* **taro-components:** 修复swiper 滑动问题 ([79c3e25](https://github.com/NervJS/taro/commit/79c3e258ce14ddb3187b3e054140ff28e9135f7b))
* **transformer:** 事件传递有误 ([62b4337](https://github.com/NervJS/taro/commit/62b43371f188b42dbd117a0b1b1baa303af79947))
* **weapp:** 有多个页面时分别记录页面初始化的状态 ([643a8ff](https://github.com/NervJS/taro/commit/643a8ffe015df0a906cb22c8a028e38ab211038e))


### Features

* **postcss-pxtransform:** 支持样式重制类的代码在 RN 端编译时通过块注释剔除 ([3aa5ebf](https://github.com/NervJS/taro/commit/3aa5ebfe6504333b82b12c0f6add3ee1b5579265))
* **RN:**  postcss-pxtransform 插件支持 RN 端，并更新相关文档 ([dac2912](https://github.com/NervJS/taro/commit/dac29125fbe7e4ae340d90e120a640ff81307d26))



# [1.0.0-beta.15](https://github.com/NervJS/taro/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2018-08-22)


### Bug Fixes

* **cli:** 修复ast转换后缺失nervjs的问题 ([01c4c58](https://github.com/NervJS/taro/commit/01c4c5868638718d5e5d08d70a8c31cd77715e47))
* **cli:** 小程序端 npm 抽离文件没有补全文件完整路径 ([c08aba0](https://github.com/NervJS/taro/commit/c08aba0a4b8092d99ab973bf0ad4cf1a64dee45a))
* **cli:** 小程序端自定义组件不再引用 app.wxss ([3b0431f](https://github.com/NervJS/taro/commit/3b0431f5cc2769b9989b1246380ddc0551e3bef8))
* **eslint:** 使用 ref 不报错 ([e5afc21](https://github.com/NervJS/taro/commit/e5afc21ec143dfdc13f692dde6abddf34f7a1495))


### Features

* **tcr:** 支持Text onClick事件 ([874002d](https://github.com/NervJS/taro/commit/874002df52cec893ccba4d1c6469d7842c0a258a))
* **transformer:** 支持函数 ref ([86d396e](https://github.com/NervJS/taro/commit/86d396e298543196b3d40c6c17e39942826d3cc2))
* **transformer:** 支持字符串 ref ([8ea9366](https://github.com/NervJS/taro/commit/8ea93660ccf6184afff530f560a382dcfc63bb7a))
* **weapp:** ref获取组件示例的时机提前 ([a03c203](https://github.com/NervJS/taro/commit/a03c2033d12076cbff8f5cf38a575bac6e6498c3))
* **weapp:** 支持refs选择节点或组件 ([7f6403e](https://github.com/NervJS/taro/commit/7f6403e614b78b2c309c622d6129740772e28a74))
* **weapp:** 支持设置的static options ([c7edab4](https://github.com/NervJS/taro/commit/c7edab4a1b7fadd99b979a25a84a487495c373bf))



# [1.0.0-beta.14](https://github.com/NervJS/taro/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2018-08-22)


### Bug Fixes

* **cli:** 小程序端样式中带有 background 解析错误，fix [#507](https://github.com/NervJS/taro/issues/507) ([cf5475f](https://github.com/NervJS/taro/commit/cf5475f9aab2b5460de156ec17a554a803812fb9))
* **cli:** 小程序端组件样式引入 app.wxss 路径错误 ([87489bc](https://github.com/NervJS/taro/commit/87489bc94b787c3b80888664f276a0b0b0baa0ef))



# [1.0.0-beta.13](https://github.com/NervJS/taro/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2018-08-21)


### Bug Fixes

* **transformer:** 修复在循环中定义 JSX 引用变量报错 ([1e05877](https://github.com/NervJS/taro/commit/1e05877c77b3c21565350de7b0000dc28d69d9e7))



# [1.0.0-beta.12](https://github.com/NervJS/taro/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2018-08-21)


### Bug Fixes

* **cli:** process.env.TARO_ENV 判断兼容 ([6bc0de5](https://github.com/NervJS/taro/commit/6bc0de5b2ff7323830c9ca2ef071a781d7453c8b))
* **cli:** 小程序端编译不能支持文件名中带 . 分割 ([b68b983](https://github.com/NervJS/taro/commit/b68b983e8ed469d2dcc25fdccfd5893c65bcae23))
* **cli:** 小程序端页面判断逻辑优化 ([44ba3cc](https://github.com/NervJS/taro/commit/44ba3cc5a37fa75a2ed46e6d11e502fa921112be))
* **cli:** 统一判断文件是否是页面的方式 ([a5fea58](https://github.com/NervJS/taro/commit/a5fea58b0b56b0f70ee208dc7aa79aa7088fd8fb))
* **cli:** 页面不能作为组件来引用，增加提醒 ([ae1a105](https://github.com/NervJS/taro/commit/ae1a1056314cb2055f6dc7f1647cb284580c79ac))
* **eslint:** canvas 可以在 taro 中使用 ([b460b45](https://github.com/NervJS/taro/commit/b460b456933c419f234774720206b1d745e3e589))
* **router, redux-h5:** 修复connect组件后退时重新构造的问题 ([370e91b](https://github.com/NervJS/taro/commit/370e91bf82a242da397c8a738caa946516dde65f))
* **taro-components:**  修复 image mode 为 widthFix 样式问题 ([7272f42](https://github.com/NervJS/taro/commit/7272f4282753e4f0f2c8b7fb503ec8eb2e462003))
* **taro-components:** 修复  Input 组件 h5 端 事件返回值问题 ([96d4790](https://github.com/NervJS/taro/commit/96d4790dc6c9422c14a07814ab2b354d25b8df0a))
* **taro-components:** 修复onScroll 事件 配合 scrollWithAnimation 属性触发死循环问题 ([8dcb1af](https://github.com/NervJS/taro/commit/8dcb1af5c43bf84cd854e019592282d1ec32ad69))
* **taro-components:** 开放 Input 组件 type 类型 ([7105ef4](https://github.com/NervJS/taro/commit/7105ef48fd5fe178626e40706c0d46cc73d0e832))
* **taro-compontens:** 修复 form 表单样式问题 ([6f5cf9e](https://github.com/NervJS/taro/commit/6f5cf9edc6a1141a96a169ebfd02ff84fe69e39a))
* **taro-transformer-wx:** 集合中添加缺失的默认组件 ([2c455ce](https://github.com/NervJS/taro/commit/2c455ce498a726af7ea2c0c02d0c203133024b4c)), closes [#478](https://github.com/NervJS/taro/issues/478)
* **transformer:**  if 下面所有非匿名变量被从 state 中清除 ([318755b](https://github.com/NervJS/taro/commit/318755b456c85c0bc88958381a1d93edb40fee68))
* **transformer:** 未使用引入包忽略：@tarojs/taro, react, nerv ([187e5a8](https://github.com/NervJS/taro/commit/187e5a87dee06dfaeae1dfeb5baf240b906da9b0))
* **transformer:** 某些时候不返回正确的相对路径 ([5401154](https://github.com/NervJS/taro/commit/54011540bb66737f48e6a99e68244623a10be88a))
* **weapp:** 修复willMount可能会触发多次问题 ([f0d7b6a](https://github.com/NervJS/taro/commit/f0d7b6ac5329b80cedbf9ca88c9971e80ff31823))
* **webpack-runner:** 修复[@import](https://github.com/import)没有解析相对路径的问题 ([d4e2b46](https://github.com/NervJS/taro/commit/d4e2b469faa775a28395a6b30c51649c79858e56))


### Features

* **cli:** 优化 UI 库编译，增加 process.env.TARO_ENV 标记用来进行代码编译时判断 ([73e9c8a](https://github.com/NervJS/taro/commit/73e9c8af36ba697b267c308b61328f6532b4ccd8))
* **cli:** 小程序端 npm 文件抽取使用 ast 分析的方式 ([90ba499](https://github.com/NervJS/taro/commit/90ba4992f97527efbeb4b30ff3bdc021cb92484c))
* **cli:** 小程序端编译组件样式中默认引用全局样式 ([2b0cfb0](https://github.com/NervJS/taro/commit/2b0cfb0b86d0dd898703933c1d0586bc1e14fd13))
* **RN:** 优化 package.json 的组织方式，redux 的 storeName 配置与 H5 统一 ([579b992](https://github.com/NervJS/taro/commit/579b99251eaeda6a12b819c657e4b1c23d3c8ccf))
* **taro:** 增加 taro-utils ([e5981ae](https://github.com/NervJS/taro/commit/e5981aeb23875a8204bec13854a72f1ca82b641f))
* **taro-redux:** 修正 redux 包发布目录 ([da10a0a](https://github.com/NervJS/taro/commit/da10a0a46015d363c8a81308764d864f6ebade49))
* 新增 taro h5 模式的动态加载 import() 功能 ([36cb172](https://github.com/NervJS/taro/commit/36cb17281d62825ce008da42711fa07e2f545d21))
* **RN:** 添加装饰器写法的支持 ([31b6d21](https://github.com/NervJS/taro/commit/31b6d21c7993b86372b88b4454162466dbf70221))
* **taro-components:**  Input 组件 H5 端新增 file 类型 ([f0cf015](https://github.com/NervJS/taro/commit/f0cf0159761a3460e70fecb5291cad72bc673552))
* **taro-router-rn:** 优化滚动代码 ([14e2db6](https://github.com/NervJS/taro/commit/14e2db6584eea88a298103d93941d6535e0af319))
* **weapp:** 将组件里的static方法同步到小程序实例上 ([0aec65f](https://github.com/NervJS/taro/commit/0aec65fce4e568ff3b1be62e0bdc1f29b473135f))



# [1.0.0-beta.11](https://github.com/NervJS/taro/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2018-08-16)


### Bug Fixes

* **cli:** H5 端编译增加插入 Taro.initPxTransform 初始化 ([f27552f](https://github.com/NervJS/taro/commit/f27552f4093a086eed9e7acd0370c10e77e975f9))
* **cli:** 更正 UI 库编译提示 ([fb71d60](https://github.com/NervJS/taro/commit/fb71d605d08d647e1deca98784030bcf24e6ff3a))
* **router:** 将typing文件移到type文件夹中 ([8553821](https://github.com/NervJS/taro/commit/8553821bbebdf74f6a08b0cfbf7bb357d5ca1900))
* **taro-components:** 修复h5 点击态阴影问题 ([7592648](https://github.com/NervJS/taro/commit/75926489bf19120da1ee91728ef14d611889c2c6))
* **taro-components:** 去除 input 的 min-height 默认样式 ([5aaac3a](https://github.com/NervJS/taro/commit/5aaac3ae8467c02120c0b4501978a7a16b503eb8))
* **transformer:** 属性名为 `bind` 或 catch 的情况 ([6a1670a](https://github.com/NervJS/taro/commit/6a1670aadd3c2e651b10974786e00cb114c0b488))
* **transformer:** 当 if 中有复杂表达式时生成匿名 state 错误 ([82d3774](https://github.com/NervJS/taro/commit/82d37747be4d987325e261ee138a3eead2e76fd5))
* **weapp:** 初始化的时候将render替换为_createData ([8ab9f4d](https://github.com/NervJS/taro/commit/8ab9f4d34b4a62479a8c18d06f551a37d7c5175e))


### Features

* **cli:** appOutput 配置下决定 app.wxss 是否生成 ([819a6cc](https://github.com/NervJS/taro/commit/819a6cc355695ec24962394aa4ec641328db2cd8))
* **cli:** 完善 UI 库 H5 端编译 ([af58bdb](https://github.com/NervJS/taro/commit/af58bdb0ff5220f5411bc8c2ebac1ba1985b4f04))
* Update common.d.ts ([3315e9a](https://github.com/NervJS/taro/commit/3315e9a50bda39521b15fa8e1052cd1557fa2487))
* Update Picker.d.ts ([0e26b27](https://github.com/NervJS/taro/commit/0e26b27410996f54fdcf78b96d24aeb749068ccc))
* **cli:** UI 库编译功能完善 + 小程序端引用 UI 库 ([a046b47](https://github.com/NervJS/taro/commit/a046b47dbc1812fc967a5d99d2bca0be5ef2e03a))
* **RN:** 支持 RN 编译时终端提示不支持的样式 ([e3657bf](https://github.com/NervJS/taro/commit/e3657bf1442fd81626d1698620288cff92009952))
* **RN:** 编译时自动检测并安装 babel-plugin-transform-jsx-stylesheet 插件 ([835ad49](https://github.com/NervJS/taro/commit/835ad49e25fe25204dcf2ccae8266b6f5363aecb))
* **weapp:** 补充forceUpdate ([32cc5aa](https://github.com/NervJS/taro/commit/32cc5aac15de0f62687863074e85b12a60f26da6))
* **webpack-runner:** 调整 webpack 插件配置顺序 ([377cffc](https://github.com/NervJS/taro/commit/377cffcaab7553064a97d081df1fa76c37bab02f))



# [1.0.0-beta.10](https://github.com/NervJS/taro/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2018-08-14)


### Bug Fixes

* **weapp:** 小程序canvas touch事件无currentTarget事件 ([f049b90](https://github.com/NervJS/taro/commit/f049b90b0a2366f3344e54421fbbb6dc99bd9cd5))
* 更新 PickView 示例 & 修复 ScrollView 滚动问题 ([553aea3](https://github.com/NervJS/taro/commit/553aea35de65c004b514cb65727d6fa50638afea))
* **cli:** export from 写法时组件文件查找错误 ([fb9f084](https://github.com/NervJS/taro/commit/fb9f084ff1651ea12a56c830f5b27c68e48796f9))
* **cli:** tsconfig 模板重复键值对 ([9b1dd3f](https://github.com/NervJS/taro/commit/9b1dd3fae44e3b053c36920976358f0f63bd0d14))
* **cli:** 修改redux模板, 增加Ts类型约束 ([b49fdf8](https://github.com/NervJS/taro/commit/b49fdf8e0b1519c8f87cc8ce6b2d91a36e05536a))
* **cli:** 修改注释类型,防止vsc错误的类型提示 ([f689494](https://github.com/NervJS/taro/commit/f68949489cdaeaade146a98d95f1132ad243e249))
* **cli:** 组件 watch 时偶尔不重新编译 ([88079c0](https://github.com/NervJS/taro/commit/88079c02c0f104dafe05762e7e168a3b6bc82676))
* **eslint:** 允许 module.exports ([ec12e4f](https://github.com/NervJS/taro/commit/ec12e4f6f3169684a7978203ac96eea1ab496c63))
* **eslint-plugin-taro:** Cannot read property type of null ([56b9b96](https://github.com/NervJS/taro/commit/56b9b96b13282744de32f4dfcdc1bfe6813cd34a))
* **taro:** 增加登录接口的回调参数 ([ecd7043](https://github.com/NervJS/taro/commit/ecd70435a55b19f33b62a837c1308966f383fc49))
* **taro:** 建议修改回类型约束, 防止单词拼错等情况 ([c618b5c](https://github.com/NervJS/taro/commit/c618b5c87b40e78cdcbf06a547ebdd871162242c))
* **taro-weapp:** Taro warn 在微信内的兼容性问题 ([7b1e4cf](https://github.com/NervJS/taro/commit/7b1e4cf14914f34f7ae73294b50491405d48c453))
* **weapp:** 去掉页面里初始化时加上的onShareAppMessage 等配置空函数 ([0db000f](https://github.com/NervJS/taro/commit/0db000f544a4e766373e4eee44c9d1f9d60be0c8))


### Features

* **cli:** h5版本处理tsx的时候不再保留tsx后缀名 ([441448b](https://github.com/NervJS/taro/commit/441448b27e66b47a61a9a7f72c60c8be37571a43))
* **cli:** h5版本移除引用脚本的后缀名 ([84052a4](https://github.com/NervJS/taro/commit/84052a42acf140be5d97abc0ca08c8aac0ddeeba))
* **cli:** 修改ts 模板的 require 使用webpack-env的typing文件 ([8fe9a20](https://github.com/NervJS/taro/commit/8fe9a2071e36a64750c2212625a7f47807fbfa5d))
* **cli:** 增加 UI 库编译功能 ([8c30ab1](https://github.com/NervJS/taro/commit/8c30ab14f8d2c56a77d1b6f5609dbc55683a6cec))
* **cli:** 小程序端支持组件 export ... from ... 写法 ([27ff33e](https://github.com/NervJS/taro/commit/27ff33e8ca29550f0fa4c297b129913524e08bf2))
* **cli:** 小程序端支持自定义 env ([d0ba5ef](https://github.com/NervJS/taro/commit/d0ba5ef28082df439a470fb314823a4f6b52f9b7))
* **cli:** 默认 ts 模板支持使用 require ([b35f952](https://github.com/NervJS/taro/commit/b35f952f313c9fb0643e55b6bec0a46c180d2961))
* **eslint:** 新的 eslint 规则：自定义组件关键字 ([b9d3173](https://github.com/NervJS/taro/commit/b9d3173eb972d54c3bf6928c3566886c0ea32759))
* **RN:**  支持 Redux ，默认开启 Page 滚动 ([ae5ab78](https://github.com/NervJS/taro/commit/ae5ab78f0d691ebf11e24d39cf1ed3dba6660c10))
* **taro:** Component 加上 $router 的 typing ([604c0fa](https://github.com/NervJS/taro/commit/604c0fa0e41f15727673eb9b1330f17188744b4b))
* **taro:** 修复 config 的 typing，close [#447](https://github.com/NervJS/taro/issues/447) ([da65f27](https://github.com/NervJS/taro/commit/da65f2740126dd31390db88269f16a23eec7bed4))
* **transformer:** 支持直接传入 this.$router 的参数 ([706f394](https://github.com/NervJS/taro/commit/706f394d56152d32d96f9d053a4a917bfe7fffc4))
* **webpack-runner:** webpack-runner不再需要ts-loader ([89559de](https://github.com/NervJS/taro/commit/89559dee4c21bf5e329281c5da2eb9a82212280a))
* add component SwiperItem ([2420af0](https://github.com/NervJS/taro/commit/2420af02c3b6e12940c512ae17c86577aaeb0955))



# [1.0.0-beta.9](https://github.com/NervJS/taro/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2018-08-09)


### Bug Fixes

* **cli:** redux 模板加入 react typing ([59fc5ef](https://github.com/NervJS/taro/commit/59fc5ef724441bd1d7c4efda12735890eb159caa))
* **cli:** redux 模板没有生成 tsconfig ([d4d62e4](https://github.com/NervJS/taro/commit/d4d62e4e896742295e4a6f4fb48e7422d305d487))
* **cli:** 修复 tsconfig 设置 ([a6e45ab](https://github.com/NervJS/taro/commit/a6e45abef35d5e30cfdfdcfa7064bc223bcb535c))
* **cli:** 允许处理 .wxss 文件 ([afbc906](https://github.com/NervJS/taro/commit/afbc906279c5e889c15f79b0cf7ffd1398d053df))
* **eslint:** 在 map 循环中使用 if 解析错误 ([902d637](https://github.com/NervJS/taro/commit/902d637d7faffc57015fbb426dd30ca09e24c22b))
* **taro-components:** 修复动画样式兼容问题，修复宽度 or 高度 溢出导致的滚动条，修复事件问题 ([5bcdd4b](https://github.com/NervJS/taro/commit/5bcdd4b5aa1ab7db0ba3ba8ea03c0f264f8135eb))
* **taro-weapp:** 避免出现当属性名被重命名后属性计算错误的问题 ([ccd48de](https://github.com/NervJS/taro/commit/ccd48de1eef19a293214a980bfd3089f8a392fd0))
* **transformer:**  把手动写入的第三方组件当做内置组件处理 ([0bcb405](https://github.com/NervJS/taro/commit/0bcb405bc42ba228c632168d58d3a3dd4c32a433))
* **transformer:** 修复使用 TS 编译在多个类属性函数丢失其中一个的情况 ([966edf9](https://github.com/NervJS/taro/commit/966edf9e917f511fc275c0b443b2489a35aba14d))
* **weapp:** 组件创建时减少一次多余的实例化 ([7169ee0](https://github.com/NervJS/taro/commit/7169ee0936dfad78cc80c96c3e7aba87c9389f26))


### Features

* **router:** 加入 taro-router 的 typing ([866c804](https://github.com/NervJS/taro/commit/866c8043b6d5a40e825292547927ee85f0417f2e))
* **taro-cli:** 添加 babel-plugin-transform-jsx-stylesheet ，优化 RN 样式编译，className 支持表达式 ([7da1b36](https://github.com/NervJS/taro/commit/7da1b3699ba415def91f68dfde27d44e2c81dd71))
* **taro-h5:** 增加 systemInfo、networkType 的相关 API，并为其补全测试用例及文档 ([9b84411](https://github.com/NervJS/taro/commit/9b844112282e6a10f8acf51cdbedac726c3f77aa))
* **taro-router-rn:** 全局配置 enablePullDownRefresh ([3b590f5](https://github.com/NervJS/taro/commit/3b590f57c3ad7f0642fc79d3bcfea889faa763c0))
* **taro-router-rn:** 实现页面事件 onPageScroll ([99a91fb](https://github.com/NervJS/taro/commit/99a91fb71cffd95bda3d3fb82653ae6ef14a4724))
* **taro-router-rn:** 添加 wx.startPullDownRefresh 及 wx.stopPullDownRefresh ([4694ded](https://github.com/NervJS/taro/commit/4694dedbd9df05feb0fb5e35e2bfc93bde7d5667))
* **taro-weapp:** 将 initNativeApi 的执行时机提前，可以在任何地方放心使用 ([13cbc4d](https://github.com/NervJS/taro/commit/13cbc4da7b1baa15fd4d0777409638330574c898))
* **transformer:** 从 this.props 结构出来的函数可以在任意作用域调用 ([2c723c1](https://github.com/NervJS/taro/commit/2c723c1784cd6fafbbe5b9a062074f9f63603544))
* **transformer:** 去除没有使用的 import ([0030246](https://github.com/NervJS/taro/commit/00302467fcfd474ad5ef2dab801a997ab806278c))



# [1.0.0-beta.8](https://github.com/NervJS/taro/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2018-08-07)


### Bug Fixes

* **cli:** json 文件解析有误 ([1d675aa](https://github.com/NervJS/taro/commit/1d675aa056e270667eea7782a922a728f844f907))
* **cli:** 小程序端 export default 基类继承 ([11cf47a](https://github.com/NervJS/taro/commit/11cf47ab6d09e834e4575500113848e52286f4dd))
* **taro-router-rn:** react-navigator 报错 ([21ca1b4](https://github.com/NervJS/taro/commit/21ca1b4da8727a9b955d7a4f4fe18e84f5e13f77))
* **transformer:** 自定义组件不对 style 进行特殊处理 ([10a4183](https://github.com/NervJS/taro/commit/10a4183f19f305431c53333952c3a4e6b308d45e))


### Features

* **taro:** 加入小程序 config 的类型说明 ([9208deb](https://github.com/NervJS/taro/commit/9208deb7d1687f6835fe98cb0ac34b2bb87b7f87))
* **taro:** 增加 Taro.pxTransform API 用于处理行内样式中单位转换，close [#388](https://github.com/NervJS/taro/issues/388) ([cae84f3](https://github.com/NervJS/taro/commit/cae84f3940bc00dc4f633671e87d799ec8dfa821))
* **taro:** 更新 Taro typings ([c6b73cd](https://github.com/NervJS/taro/commit/c6b73cdc407ad4c2674d42763848f9f15ace8204))
* **weapp:** 支持小程序behaviors ([7b39644](https://github.com/NervJS/taro/commit/7b396448bdca1d55fa5630c73b7260f5ba4d2a7d))



# [1.0.0-beta.7](https://github.com/NervJS/taro/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2018-08-06)


### Bug Fixes

* 添加注释，去除 package-lock-json ([9d17a6a](https://github.com/NervJS/taro/commit/9d17a6a8eef5cdd19eae259f48410a28483a33c3))
* **cli:** 修复h5中缺少一个变量定义的问题 ([1688e53](https://github.com/NervJS/taro/commit/1688e5364bf12ed1eb040a6797cdd261cfdaaafd))
* **taro-cli:** RN 开启 watch 样式文件不重新编译 ([23fba9f](https://github.com/NervJS/taro/commit/23fba9f289decc2927b6461edff38d6dfa148ef1))
* **transformer:** 处理 this.state.a.b[this.state.a.b.c] 这样的情况 ([ba458c9](https://github.com/NervJS/taro/commit/ba458c971431c5e0dfedaa9f4fe469a2a4fd9bd1))
* **transformer:** 某些情况成员表达式不会加入到 pendingState ([e4029bd](https://github.com/NervJS/taro/commit/e4029bd31e3cf47258e5579a97e3980b6e63ed99))


### Features

* **cli:** 小程序端 npm 目录支持配置 ([9a816a5](https://github.com/NervJS/taro/commit/9a816a5653c9b5b8cabc24d661d10d8d8e1a373d))
* **cli:** 小程序端支持自定义组件基类继承的形式 ([0b2a5fd](https://github.com/NervJS/taro/commit/0b2a5fdb8bf8380d29d5d50dd0324747c9728966))
* **cli:** 小程序端新增是否需要生成 app.js、app.json 文件的配置选项 ([23fd918](https://github.com/NervJS/taro/commit/23fd918bffbd53e459687c85990bf64ce31acae9))
* **taro-compontens:** 补全文档及示例代码 ([3368869](https://github.com/NervJS/taro/commit/33688694607d59f6a597036b7964bd61bc818b10))
* **taro-router0rn:**  taro-router-rn 添加进 learna，使用 ejs 模版生成 RN 工程的 package.json ([47225aa](https://github.com/NervJS/taro/commit/47225aabfd7c3c8b1831a4eb8e4ade02a6e2d0d4))
* **transformer:** 支持在 if 中使用 bind 对象或使用字面量对象 ([e6b005a](https://github.com/NervJS/taro/commit/e6b005a908881a27c3517341dfc09370f23fb859))
* **transformer:** 支持继承自定义组件 ([1a339c7](https://github.com/NervJS/taro/commit/1a339c7f8fb0190669769e30742c300422014e60))
* **weapp:** 组件提前计算好初始的state,并将初次setData执行时机提前到attached中 ([26ffa3a](https://github.com/NervJS/taro/commit/26ffa3a4f24e7b19c0b5849e16bf7f6c487eb408))
* RN 上拉下拉组件 ([87e0e5f](https://github.com/NervJS/taro/commit/87e0e5fa0d89db1ce27623412daf1240df2962eb))



# [1.0.0-beta.6](https://github.com/NervJS/taro/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2018-08-02)


### Bug Fixes

* **cli:** windows 下 watch 组件编译加个延时 ([94cc025](https://github.com/NervJS/taro/commit/94cc025c37b81511d6f0ce59cfa0a0a5edaf85fd))
* **cli:** 兼容 app 的 constructor 中使用 this.config= 来定义 config 的写法 ([9ce5580](https://github.com/NervJS/taro/commit/9ce558083ebd118081cb851ecf3ca02a8f95959c))
* **taro:** 增加 style 传入 null 及 undefined 的容错 ([037ad37](https://github.com/NervJS/taro/commit/037ad37b7d939159fa447074ab9d40dc616c5516))
* **taro:** 当样式为 null 或 undefined 时返回空字符串 ([f50b27e](https://github.com/NervJS/taro/commit/f50b27e1f37d1059b31d59d055e6358ec562a9df))
* **taro-h5:** Taro.request 处理 success / fail / complete，[#330](https://github.com/NervJS/taro/issues/330) ([d9d36f9](https://github.com/NervJS/taro/commit/d9d36f94a3c2b88a5ce9520b0e380a559e93b769))
* **taro-h5:** 修复交互反馈类 API 的样式兼容性，并提供了类名以便用户覆盖样式 ([b3d12cb](https://github.com/NervJS/taro/commit/b3d12cbcec03f9ed590acc7f9fec45422ebb5e2a))
* **taro-weapp:** setData 空对象过滤 ([79196f3](https://github.com/NervJS/taro/commit/79196f3cd8df14bdb215f05697e1f6e690a4016b))
* **transformer:** typescript 转换丢失 config ([d5e3850](https://github.com/NervJS/taro/commit/d5e3850fc49328c2fd02dbb17b031bf4255da7dc))


### Features

* **transformer:** 使用 tslib 减少 ts 的编译文件大小 ([d01cfb2](https://github.com/NervJS/taro/commit/d01cfb2c09177fd0f0ce3df3e0173abe9af979ad))
* **transformer:** 支持在 if 块作用域中生成匿名表达式，定义变量 ([565af24](https://github.com/NervJS/taro/commit/565af24d29ab7af19a5b4e30169e479b49fc17f4))



# [1.0.0-beta.5](https://github.com/NervJS/taro/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2018-08-01)


### Bug Fixes

* **cli:** watch 时修改组件报错后，再次修改组件无法编译 ([48fca4d](https://github.com/NervJS/taro/commit/48fca4d3531ab86163a87d1416d618489f61f260))
* **eslint:** 生命周期函数不需要遵循方法命名规范 ([774f7ba](https://github.com/NervJS/taro/commit/774f7ba18ac3d1c05e7aff0444971f18c350d643))
* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([8271c0f](https://github.com/NervJS/taro/commit/8271c0f87a6709bab2d417ad11759de5962e6304))
* **taro-weapp:** 修复setData 前移出掉数据中的函数时将null转换成空对象问题 ([3a914ca](https://github.com/NervJS/taro/commit/3a914ca298ecb8db1fae4f94b242e94b290c7689))
* **taro-weapp:** 修复state里空数组会被移除的问题 ([3252241](https://github.com/NervJS/taro/commit/3252241c6d301105e71fa185e7858a73e8bf67da))
* **taro-weapp:** 修复将page的数据初始化提前构造函数中的数据丢失问题 ([39b5401](https://github.com/NervJS/taro/commit/39b5401a92b513cd80373fbe22addfcb0778b93b))
* require 页面遗漏 default ([18dd571](https://github.com/NervJS/taro/commit/18dd571aabfe5a2cb61115ce8edc76e6061e824e))


### Features

* **eslint:** 新规则 class naming，自定义组件不得与原生组件重名 ([329ec3a](https://github.com/NervJS/taro/commit/329ec3a164a177c850fab3bfb9bbffec3d8bbd26))
* **taro-rn:** 增加media的测试用例 ([935cd00](https://github.com/NervJS/taro/commit/935cd004676690b7b4cd7dd6f8bad839eba1befa))
* **transformer:** 使用 typescript 编译 .tsx 文件，may fix [#396](https://github.com/NervJS/taro/issues/396) [#392](https://github.com/NervJS/taro/issues/392) ([61d3e24](https://github.com/NervJS/taro/commit/61d3e24be30b9c643dc10eb21d930b859df30b17))
* **weapp:** 小程序的 properties 从 defaultProps 当中找 ([96ae2d4](https://github.com/NervJS/taro/commit/96ae2d490644b5cfcb60abc9ad62fcd10cebe373))
* App 里 Header 相关配置的转换。 ([746ca09](https://github.com/NervJS/taro/commit/746ca0930c62e9fa75f048a63d3a5537a5aca449))
* tabBar 配置与切换 ([9aaf5a7](https://github.com/NervJS/taro/commit/9aaf5a7383a4f49eac90bc4dd59a46cbb79fd9b1))
* 创建中间层 Component，注入 $router ([9f0f79a](https://github.com/NervJS/taro/commit/9f0f79a4eb99ea5cec48dcd2ed8a12ddfa9e895a))
* 改变 app.js 里的 render return ([2fdb804](https://github.com/NervJS/taro/commit/2fdb8043383e6678029885670a514609584d8525))
* 添加 getCurrentPages 方法，补充注释 ([6b73e53](https://github.com/NervJS/taro/commit/6b73e53f04503c2cedb48c845088010f725e5ecc))
* **taro-cli:** RN 编译添加 watch 功能 ([73f7cfd](https://github.com/NervJS/taro/commit/73f7cfd50417d2625b65050b1acb861fc06793f5))
* **taro-cli:** 添加 RN 的编译时间 log ([6efda66](https://github.com/NervJS/taro/commit/6efda666187d57f27d1839d7d151fd66f4fd20ac))
* **taro-rn:** package.json 模板提取出去 ([7689b22](https://github.com/NervJS/taro/commit/7689b22080cf57ccf5fd973957b7310ef86ea725))
* **transformer:** 在构造器里声明类函数 ([f317934](https://github.com/NervJS/taro/commit/f317934ed52888de23a979437b538d8c517118d1))
* tabBar 默认样式及样式关联 ([289fd80](https://github.com/NervJS/taro/commit/289fd808020b780d07780e8b1edb10775f3620ab))
* 去掉对 pages 配置字段的处理，直接作为 ScreenName ([8d1ff98](https://github.com/NervJS/taro/commit/8d1ff9899c9d5d35ef6bff383b9756f2343da53f))
* 实现页面跳转 ([9406669](https://github.com/NervJS/taro/commit/9406669b5b4088e717c8bf2b4bc69d850a192163))
* 添加默认头部样式 ([a920e98](https://github.com/NervJS/taro/commit/a920e9847c68174638b955cd1f018484c716bdb2))
* 转换页面 config 中头部相关的配置 ([9a685b1](https://github.com/NervJS/taro/commit/9a685b148969e1640cdfeeb0aa192757e6011560))
* 重构	createStackNavigator ，通过Taro.initRouter初始化路由 ([dfcd11f](https://github.com/NervJS/taro/commit/dfcd11f9ff3b805eb78064f3a8a3fb568a16b7fb))
* **taro-router-rn:** config 配置信息读取，生成 RootStack ([b2a1c94](https://github.com/NervJS/taro/commit/b2a1c94ceb3bbb7173263ed8389c3e5fe14d78f5))
* **taro-router-rn:** 添加工程 ([8597f9b](https://github.com/NervJS/taro/commit/8597f9bb4309f80ac58c02a9614b11645491b38c))
* **taro-router-rn:** 生成 RootStack ([014abe8](https://github.com/NervJS/taro/commit/014abe88b62bce1bf08e8c0e5d65830e8ecd7bf1))



# [1.0.0-beta.4](https://github.com/NervJS/taro/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2018-08-01)


### Bug Fixes

* **taro-weapp:** setData前移除数据里的函数问题修复 ([3a3e143](https://github.com/NervJS/taro/commit/3a3e143325819aa63bfc88bb74d84569ed2fc134))
* **taro-weapp:** 修复过滤data里的函数时将数组转成obj问题 ([364b27d](https://github.com/NervJS/taro/commit/364b27d2c04f9c36b7f3606125a50b2c8bd0e2b2))
* **taro-weapp:** 首次调用 _createData() 时加上 try catch ([6f13217](https://github.com/NervJS/taro/commit/6f13217506bb9db3ca122679f6db73bdadc735c2))
* **transformer:** 部分生命周期不写参数报错 ([bf4abd6](https://github.com/NervJS/taro/commit/bf4abd6a4380a6ffacc9c4e5f8cd318b9c1d78f1))



# [1.0.0-beta.3](https://github.com/NervJS/taro/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2018-07-31)


### Bug Fixes

* **taro:** 去掉重复的代码引用 ([cf324fb](https://github.com/NervJS/taro/commit/cf324fbecbdffd2a22eb19fc3d1dafeb47fd59f4))
* **taro-h5:** 将兼容性稍差的 String.includes 替换成 String.indexOf ([1ed4e16](https://github.com/NervJS/taro/commit/1ed4e1693acd3606076bcb08d646c9ee48bc23bb))
* **taro-weapp:** defaultProps 处理错误 ([8239556](https://github.com/NervJS/taro/commit/823955694632d49baa77f3f35a9b2b5f604d7bc5))
* **taro-weapp:** setData 前移出掉数据中的函数 ([cca3ed6](https://github.com/NervJS/taro/commit/cca3ed6baa56ce2f05fc34b2d775da52d3c3be8b))
* **taro-weapp:** state 与 props 优先级 ([de7db67](https://github.com/NervJS/taro/commit/de7db6701b18343af6631e3b6d18228660419550))
* **taro-weapp:** 修复小程序组件ready时不一定attached导致this.$component未定义报错 ([4799ca2](https://github.com/NervJS/taro/commit/4799ca2612db0731c895f37e756e85663db72302))
* **taro-weapp:** 修复页面onShow执行时机问题 ([7a2f790](https://github.com/NervJS/taro/commit/7a2f7902ec2b0bfd6de24cad79cad895d64b5276))
* **taro-weapp:** 修正组件 onShareAppMessage 等生命周期方法调用 ([fdac132](https://github.com/NervJS/taro/commit/fdac132f324f2c035d87d72f9ff777fb2a237f7b))
* **taro-weapp:** 在生命周期中插入构造函数副本，用于修复构造函数中获取不到完整props的问题 ([97d882f](https://github.com/NervJS/taro/commit/97d882f43b0357a0d982539886a3f8950b016ac0))
* **taro-weapp:** 暂时将页面的类初始化放到最开始的地方 ([c5a488b](https://github.com/NervJS/taro/commit/c5a488b1aed88ba552b7417147a306d351025061))
* **taro-weapp:** 组件props默认值{} ([7489082](https://github.com/NervJS/taro/commit/7489082c9a449438035699f2631bfd1d1aa96597))
* **transformer:** 当只有 state 的名称是一个合法的变量名才加入到 pendingState ([8ca906d](https://github.com/NervJS/taro/commit/8ca906d6a750fa3286307200b10905249aa3b66a))


### Features

* **cli:** 小程序端编译支持 Taro 代码与原生小程序页面、组件代码混写 ([8d47c46](https://github.com/NervJS/taro/commit/8d47c469e92f0a0dc25166c0815e81cef4fbdc1d))
* **cli:** 小程序端编译支持引用第三方组件 ([66de1ca](https://github.com/NervJS/taro/commit/66de1ca7599d0524c7997a7c42082be4ace5bf1c))
* **core:** 新的内部方法: internal_inline_style ([27c2cd2](https://github.com/NervJS/taro/commit/27c2cd21e59d544c4c523b0e33ec44fc75474c0e))
* **taro-weapp:** weapp 增加 compile 配置用于配置编译时的一些操作 ([815f67c](https://github.com/NervJS/taro/commit/815f67c1951ff3daaa9d11a7a7db1dce6bff2ee7))
* **transformer:** 在生命周期使用 props.xx 也会注入到 static properties ([68d5817](https://github.com/NervJS/taro/commit/68d581721a4c4b645d7a11c218a4b5d531cf79b6))
* **transformer:** 提升错误报告的健壮性 ([2b15281](https://github.com/NervJS/taro/commit/2b152819fb413f83ff76673682b321cb88ad346f))
* **transformer|cli:** 类定义支持 ClassDeclaration 和 ClassExpression 两种模式 ([c34bd14](https://github.com/NervJS/taro/commit/c34bd1422b8295a785af5a0f5c96d483164784db))



# [1.0.0-beta.2](https://github.com/NervJS/taro/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2018-07-30)


### Bug Fixes

* **cli:** 在app.js中加入componentDidShow/componentDidHide的调用 ([e8376cf](https://github.com/NervJS/taro/commit/e8376cf8cb2ac37c3946c6167b253d3bbfa1f876))
* **cli:** 默认模版类型拓展为 .js、.jsx、.tsx ([90b2e0a](https://github.com/NervJS/taro/commit/90b2e0ac32d2103c6296ebce941035e467680596))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([54ca2a1](https://github.com/NervJS/taro/commit/54ca2a178c5b699dbc678cfd125845803ef0a3e4))
* **taro-weapp:** componentWillMount 中 setState 失效，fix [#397](https://github.com/NervJS/taro/issues/397) ([b7213f9](https://github.com/NervJS/taro/commit/b7213f962f16e70ca6d164aad7d695c04d4db4b6))
* **taro-weapp:** 修复属性中函数作为条件判断的情况 ([a9a48f5](https://github.com/NervJS/taro/commit/a9a48f500190c1d887537c1f0e140eb83bc8d2c0))
* **taro-weapp:** 修正 defaultProps 获取 ([19b4f15](https://github.com/NervJS/taro/commit/19b4f15c74517d29f3d57ef0417c59ea7c902c4d))
* **taro-weapp:** 修正 props 中 redux 函数传递 ([6841694](https://github.com/NervJS/taro/commit/684169455081ffe8be03184129690948914dd1d2))
* **taro-weapp:** 函数类型属性处理错误 ([7d10b01](https://github.com/NervJS/taro/commit/7d10b012ae29d0fcf7c03f1050425cc7a6fb3528))
* **transformer:** slot 标签不需要加 _triggerObserer ([991d1c2](https://github.com/NervJS/taro/commit/991d1c2ea3ae08f1b9bb26ad56bc511d6a02254b))
* **transformer:** 在 JSX 中使用数组对象会被识别为复杂表达式 ([c893c84](https://github.com/NervJS/taro/commit/c893c84c4d67210f299d42ade768d92b1f26866e))
* **transformer:** 当有多个匿名 state 且没有写 return 时循环组件生成匿名 state 异常 ([5328171](https://github.com/NervJS/taro/commit/53281712b083f78968190a86279b4656f468ceaa))
* **transformer:** 自定义组件调用从 this.props 的函数应该加入到 static properties ([45ac75f](https://github.com/NervJS/taro/commit/45ac75fc5d4341144912e538e5560e4fa3b05fca))


### Features

* **eslint:** 只有 Taro.Component 作用域下方法命名规范才起作用 ([0082e99](https://github.com/NervJS/taro/commit/0082e9911330af722842ca1d0b368949a7a7633a))
* **eslint:** 新的函数命名规范 ([63cb96a](https://github.com/NervJS/taro/commit/63cb96a1ed5282a3fcc2b474e02e51ba03422c0a))
* **taro-h5:** 增加 request 的测试用例 ([bc8e2ab](https://github.com/NervJS/taro/commit/bc8e2ab094b70455f36cdfc612b68a8beb14a159))
* **taro-rn:** 增加request的测试用例 ([37f40b4](https://github.com/NervJS/taro/commit/37f40b45dcf4e20232f4c0c9ea411a43caf552ff))
* **taro-weapp:** 支持 externalClasses ([edeffc5](https://github.com/NervJS/taro/commit/edeffc51c28403f5ab0423b49e36ced27cb6b4b1))
* **transformer:** 加入自定义组件是否传入组件的判断 ([a20e6b1](https://github.com/NervJS/taro/commit/a20e6b1fd995253d7cd9cb9533197548feeda8d8))
* **transformer:** 当 if 表达式含有 JSX 元素和复杂表达式时生成匿名 state ([f1414ed](https://github.com/NervJS/taro/commit/f1414edba163d173919fa51bb77e18d258a8fce9))
* **transformer:** 支持使用 || 逻辑表达式 ([3202b49](https://github.com/NervJS/taro/commit/3202b493c4f162be4c1fde99d5983d2dbd809f18))



# [1.0.0-beta.1](https://github.com/NervJS/taro/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-07-27)


### Bug Fixes

* **transformer-wx:** props 接受函数转换不正确影响到非函数调用的情况 ([4b394e8](https://github.com/NervJS/taro/commit/4b394e8b13f7b84c49d110aa19842983020818cd))
* **weapp:** onPageScroll 等页面方法参数丢失 ([b1677cb](https://github.com/NervJS/taro/commit/b1677cbc627079a67044d47fcd6b782e374eb153))
* **weapp:** 修复组件接受不到 props 的问题 && 修正组件生命周期执行 ([eebf6fe](https://github.com/NervJS/taro/commit/eebf6fe4b716a02cd71bb2365512baf52579bf44))



# [1.0.0-beta.0](https://github.com/NervJS/taro/compare/v0.0.73...v1.0.0-beta.0) (2018-07-26)


### Bug Fixes

* **cli:** page 类型仍然需要 Page() 工厂函数初始化 ([1172b12](https://github.com/NervJS/taro/commit/1172b12ae05cda3e7b2ab7abe6a513668d926cc6))
* **cli:** 导入组件 Component 重命名为 `BaseComponent` ([b2880b1](https://github.com/NervJS/taro/commit/b2880b1b915ae17f42ae2f01efa7aefa2f13d366))
* **cli:** 页面是 Page 类型 createComponent 应该传参 true ([730f158](https://github.com/NervJS/taro/commit/730f1580c1a83418f92ff5be5528d1792ea1d092))
* **postcss-pxtransform:** 修复样式文件中有中文字符导致 /*postcss-pxtransform disable */失效的问题 ([77c99d4](https://github.com/NervJS/taro/commit/77c99d4b6f59c0aee7db31a021e910226a1a7a85))
* **redux-h5:** 修复redux-h5 componenetDidShow时丢失this的问题 ([6a8d887](https://github.com/NervJS/taro/commit/6a8d887128bff57fb8c004f2d8c2ff853769dca1))
* **taro-rn:** 修复Clipboard的测试用例 ([f9a35e5](https://github.com/NervJS/taro/commit/f9a35e599916c481ab67c017f329f553a6c3a46f))
* **taro-weapp:** setData之前过滤掉undefined字段 ([969faf8](https://github.com/NervJS/taro/commit/969faf82c376940aa9b5d5c429de1d917daf6bdf))
* **taro-weapp:** setState不会触发当前组件receiveProps ([c8ec2f8](https://github.com/NervJS/taro/commit/c8ec2f845058ce46b403bb7f7ba2c385e84ac1db))
* **taro-weapp:** 事件触发兼容redux actions 链式调用 ([02bc67c](https://github.com/NervJS/taro/commit/02bc67cef60b9d54b328e3290123a516064989f6))
* **taro-weapp:** 修复异步循环组件不触发willMount生命周期问题 ([ead6ae6](https://github.com/NervJS/taro/commit/ead6ae6cc1d4a211cbfa6ad1d6c1066d75644624))
* **taro-weapp:** 修复生命周期componentWillMount执行时机 ([52c9a67](https://github.com/NervJS/taro/commit/52c9a675f0e0a6f36053c9a477fdf5239bea9704))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数 ([ff56ffa](https://github.com/NervJS/taro/commit/ff56ffa8aa598973b7278284921cc4e2bd5aaf1f))
* **taro-weapp:** 合并props函数执行(自定义事件传递)过程的的参数丢失 ([b750aba](https://github.com/NervJS/taro/commit/b750ababf3bbe12b37ac92ca7da4e18a7947880f))
* **taro-weapp:** 支持函数在传递的过程中通过fn.bind()来传参 ([0ed5043](https://github.com/NervJS/taro/commit/0ed50434632338108a303c16a4394854e3ec644d))
* **taro-weapp:** 自定义事件名转全小写 ([3666f8d](https://github.com/NervJS/taro/commit/3666f8d4a5c2c4cf607f8e1670f63e20256af502))
* **taro-weapp:** 补全小程序page的生命周期 ([77f6bba](https://github.com/NervJS/taro/commit/77f6bba87c17526466d11db3c40657de51cd3687))
* **taro-weapp:** 页面onload传入的参数 ([84c225e](https://github.com/NervJS/taro/commit/84c225ed3ec94a26acc5ccbc579b7b4514c78cc9))
* **transformer:**  引入组件路径错误 ([b7341d3](https://github.com/NervJS/taro/commit/b7341d3ab58f5dba2d153bd5b0692cfb95f86a0f))
* **transformer:** path resolve 使用 try..catch 包住 ([8e5ef9b](https://github.com/NervJS/taro/commit/8e5ef9b631a20f138da39b33a6adaa024ad2a855))
* **transformer:** 修复 props 为 string 的情况 ([8b0c9ce](https://github.com/NervJS/taro/commit/8b0c9ceae6a25b46be4f18e1cc8929c6471f1802))
* **transformer:** 支持多个组件调用同一 this.props 方法 ([6712d78](https://github.com/NervJS/taro/commit/6712d788811249a8424fc9d7429b2f1e0f2fc7af))
* **transformer-wx:** props 下函数名处理路径顺序错误 ([92e467d](https://github.com/NervJS/taro/commit/92e467db272c14b385e158b95c1d6be2cc970a76))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数，同时支持方法名多级路径处理 ([cec9417](https://github.com/NervJS/taro/commit/cec9417deac3ec58860019ea0316ad2b06a06fa2))
* **transformer-wx:** this.props.xxx 方法处理时增加作用域参数遗漏 ([27c1ee0](https://github.com/NervJS/taro/commit/27c1ee07679efbc76057adee7a1bef3fd220eba6))
* **transformer-wx:** 当自定义组件不包含属性时不会生成 __triggerObserer 属性 ([3fb2816](https://github.com/NervJS/taro/commit/3fb2816d82e06b57e520d9d65d9b1776e6de2a64))
* **transformer-wx:** 生成匿名函数名中不能包含数字 ([c42c405](https://github.com/NervJS/taro/commit/c42c4058cd8e29cc94fe24e1a727b8bfb1fd6dd7))
* **transformer-wx:** 生成匿名函数时不需要携带 scope 作为第一参数 ([7a596c7](https://github.com/NervJS/taro/commit/7a596c78a3f30aa9b38eda164b9ac10a3822f7ea))
* **weapp:** 修复 this.$router 及组件生命周期触发 ([cc93e27](https://github.com/NervJS/taro/commit/cc93e27b1a595a604dddfc015af3281f062f8c42))
* observer第一次触发的时候，组件尚未初始化 ([30b8dd1](https://github.com/NervJS/taro/commit/30b8dd1489c96787c9ac3299871000f06ba09a88))
* 事件调用的时候实例指向错误 ([928e0c3](https://github.com/NervJS/taro/commit/928e0c3f92980768ef68a445a2de51db7290d021))
* 判断是否空对象bug ([d864fea](https://github.com/NervJS/taro/commit/d864feae1ea63b3373390a8f7f22bb00f963dd7c))
* 区分事件调用时的scope ([f717ccb](https://github.com/NervJS/taro/commit/f717ccb11d5674da2000c8923e2eccce17792652))
* 去掉事件参数里的scope ([b4c014d](https://github.com/NervJS/taro/commit/b4c014d45f4beb705301b7b498d7130c53799b9d))
* 小程序组件的事件函数需放到methods中，页面则不用 ([0449123](https://github.com/NervJS/taro/commit/0449123d639dfa4b4e44ebc09d3171216a7abd47))
* 模板中传参表示-event- -> -e- ([c33f84d](https://github.com/NervJS/taro/commit/c33f84db652e8755ea3a8bbc1720c3888829a057))
* 漏写引号 ([8dbc00d](https://github.com/NervJS/taro/commit/8dbc00d577bb4872e9e99c8a6726e379a5ddf290))
* 默认参数‘this’会造成歧义，传false或不传即可 ([c241c4d](https://github.com/NervJS/taro/commit/c241c4dd4e5117aa20cd2c802add3c45de1537a6))


### Features

* **cli:** 去掉依赖的组件样式文件引入 ([caf0ba0](https://github.com/NervJS/taro/commit/caf0ba0dce28f7780d334b2d9a82a1dbe15fc511))
* **cli:** 去掉依赖组件的 js 引用 ([1334469](https://github.com/NervJS/taro/commit/1334469d8fe8a75efa2b0ef899499ebf424c3420))
* **taro-rn:** 增加rn api的测试用例 ([8f18dd9](https://github.com/NervJS/taro/commit/8f18dd997f27834b20fd84bb6cb79dd553bf924e))
* **transformer:** **支持自定义组件传入 children** ([8b79214](https://github.com/NervJS/taro/commit/8b792143319c751aa3c3c5cfe1151304bc1a90e9))
* **transformer:** 在 Component 中使用过的 this.props 会加入到 `static properties` ([ac16eb0](https://github.com/NervJS/taro/commit/ac16eb043602bcb044fcaecc82cc856da03868f0))
* **transformer:** 属于 this.props 的 JSX 事件引用自动填充完整路径 ([4b6ca63](https://github.com/NervJS/taro/commit/4b6ca637523a7b073e86c3f0ec3d218d9d3d8d13))
* **transformer:** 属于 this.props 的函数调用自动填充完整路径 ([3073da9](https://github.com/NervJS/taro/commit/3073da94505eb484ee15f9230b6be5b676d8eac7))
* 1st cmt ([067e292](https://github.com/NervJS/taro/commit/067e292e240b931d218f3b1161074cbf9ee4a9bc))
* props函数执行时传参 ([49d5b4c](https://github.com/NervJS/taro/commit/49d5b4c822847f0dd965fe09eea6e10f943bb932))
* 修改事件处理方式以支持props传函数的各种情形 ([2a3d836](https://github.com/NervJS/taro/commit/2a3d836d9f6fe51c800834d696ad7bf8c003ace4))
* 提供一个私有方法区分来自redux的props里的方法 ([cebb660](https://github.com/NervJS/taro/commit/cebb660e67f514a2836279151dd83f155e58d93d))
* **transformer:** 清理无用代码，开始重构新组件化功能 ([71f8de8](https://github.com/NervJS/taro/commit/71f8de8f8d185393e327802371451f3dd0670439))
* 调整componentDidMount的触发时机 ([ff17434](https://github.com/NervJS/taro/commit/ff17434bdd5cb9c0791d8fa8eafbf7ac6729c19e))



## [0.0.73](https://github.com/NervJS/taro/compare/v0.0.72...v0.0.73) (2018-07-25)


### Bug Fixes

* **cli:** 将 tsConfig.json 移动至项目根目录下 ([da7f104](https://github.com/NervJS/taro/commit/da7f104691defceac3914361c2feb2f4437512c9))
* **taro:** render 方法 typing 错误 ([779157f](https://github.com/NervJS/taro/commit/779157fd585ea55c796a6cd24b1187377d6314f7))


### Features

* **cli:** 将 cssUrl 配置移入 module.postcss 下 ([8efe600](https://github.com/NervJS/taro/commit/8efe6003a8837482021fc885cd5c309c34cf9d4a))
* **cli:** 小程序端编译增加 CSS 中引用本地资源替换成 base64 功能 ([db8e267](https://github.com/NervJS/taro/commit/db8e267b7f2c80e788ea11c3908d7681179603b0))
* **cli:** 小程序编译增加 copy 功能 ([0132a0e](https://github.com/NervJS/taro/commit/0132a0ecda029b3bac2b3cf605e6e67193fec37d))
* **taro-rn:** 增加storage的测试用例 ([7b98274](https://github.com/NervJS/taro/commit/7b98274ff91917c1079c0197ac168bf83948ec32))



## [0.0.72](https://github.com/NervJS/taro/compare/v0.0.71...v0.0.72) (2018-07-24)


### Bug Fixes

* **cli:** 修复入口文件classify时的错误 ([c8316e5](https://github.com/NervJS/taro/commit/c8316e5bf86b3d7181fdd721865aec74f7e8c0d4))
* **router:** 修复navigateBack不带参数时报错的问题 ([9d8078c](https://github.com/NervJS/taro/commit/9d8078c6dbc2fb3d4873dc9a49fbd3e413f33b28))
* **taro-redux:** 修复connect中preProps会被覆盖成最新props的问题 ([13e1448](https://github.com/NervJS/taro/commit/13e14480d863f759c6e9d5f22d925b5d123329ac))
* 配置开启https文档介绍 ([abcf1f8](https://github.com/NervJS/taro/commit/abcf1f869641f12efc639358543293fb5bc23865))


### Features

* **cli:** H5 支持 deviceRatio 自定义 ([5daa25d](https://github.com/NervJS/taro/commit/5daa25dfea1669a36e05f25360b623f0a1345761))
* **cli:** 增加 [ 尺寸设计稿换算配置 ] 到 config 模板中 ([6fc36eb](https://github.com/NervJS/taro/commit/6fc36eb1e19a2aac5a43754184d5c0509002e141))
* **taro:** 补充对 checkSession 的支持 ([23588f4](https://github.com/NervJS/taro/commit/23588f4ff5b1657208b6906c6808d54e2d21e44e))
* **taro-cli | postcss-pxtransform:** 增加尺寸设计稿换算配置 ([2d9fe7a](https://github.com/NervJS/taro/commit/2d9fe7ae72fb998421e372f735f6b3bdd851206a))



## [0.0.71](https://github.com/NervJS/taro/compare/v0.0.70...v0.0.71) (2018-07-20)


### Bug Fixes

* **cli:** @tarojs/plugin-typescript依赖缺失, may fix [#233](https://github.com/NervJS/taro/issues/233) ([340df41](https://github.com/NervJS/taro/commit/340df4167ef600e2558c2ad9e06c479f67ee263c))
* **cli:** redux模版里typescript与@tarojs/plugin-typescript依赖缺失, fix [#233](https://github.com/NervJS/taro/issues/233) ([ec31db5](https://github.com/NervJS/taro/commit/ec31db53b486c97693fbbd83db883f1a300cced7))
* **cli:** 修复h5模式偶发找不到模块的错误 ([c2e2184](https://github.com/NervJS/taro/commit/c2e2184e871e00d300e2a1c6f12cc99e32cf8ba4))
* **cli:** 默认模板不强制规定类型 ([0d3851e](https://github.com/NervJS/taro/commit/0d3851efff6b7a2c8c688cbe05a1409a9cd03b81))
* **taro-compontens:** 修复一些组件默认样式 ([a4b7541](https://github.com/NervJS/taro/commit/a4b75419aefa36322b936a786455a2ee52cd807d))
* **transformer:** 生成匿名 state也需要带上条件表达式 ([2b428bd](https://github.com/NervJS/taro/commit/2b428bd51ab93eeebd68ea3dfa039e290d95bcb8))
* **transformer:** 生成匿名 state也需要带上条件表达式, fix [#351](https://github.com/NervJS/taro/issues/351) ([9906c0e](https://github.com/NervJS/taro/commit/9906c0ef828e7d5d809d17a5049565b69b506e13))
* if / for 例子书写错误 ([f98c2ad](https://github.com/NervJS/taro/commit/f98c2ad8ef9e57972a3f2cc9ecd344a126c64242))



## [0.0.70](https://github.com/NervJS/taro/compare/v0.0.69...v0.0.70) (2018-07-17)


### Bug Fixes

* **plugin:** 修复 less 和 stylus 不支持 [@import](https://github.com/import), fix [#231](https://github.com/NervJS/taro/issues/231) ([9afddc1](https://github.com/NervJS/taro/commit/9afddc19ced9a346b3270c6641a79978573e634d))
* **router:** 修复直接改地址栏时路由没反应的问题 ([9841f48](https://github.com/NervJS/taro/commit/9841f48b53fe09b07ee7a87012a69acf7307ec53))
* **tabbar:** iOS 下pannel容器增加弹性滚动，解决滑动卡顿的问题 ([b6c7628](https://github.com/NervJS/taro/commit/b6c762870365c5c32ed0f3d5a9ed5cc8dd89318c))
* **transformer:** findImportedName 无法处理10个或以上自定义组件, fix [#324](https://github.com/NervJS/taro/issues/324) ([53a96fd](https://github.com/NervJS/taro/commit/53a96fd6527976529ffc8c41f6cb5462b48e4085))
* **transformer:** if statement 不处理 jsx attr，fix [#317](https://github.com/NervJS/taro/issues/317) ([eea4c6f](https://github.com/NervJS/taro/commit/eea4c6fe3ae1cd6ac7ff2e40f336024dc73be107))
* **transformer:** 寻找 stateName 错误，close [#318](https://github.com/NervJS/taro/issues/318) ([05bc781](https://github.com/NervJS/taro/commit/05bc781eb39d5f4e1162d98c5950143c6cc608ef))
* **transformer|eslint:** 不支持 MovableArea & MovableArea, close [#334](https://github.com/NervJS/taro/issues/334) ([73bc7f0](https://github.com/NervJS/taro/commit/73bc7f074f2da1a9ddf7553d6eb3bfb6871ca871))


### Features

* **core:** 加入  的类型检查, fix [#325](https://github.com/NervJS/taro/issues/325) ([27207a9](https://github.com/NervJS/taro/commit/27207a966e024e42b3f918ea3ef7944cd7ce881d))



## [0.0.69](https://github.com/NervJS/taro/compare/v0.0.69-beta.1...v0.0.69) (2018-07-11)


### Bug Fixes

* **@types/taro-components:** 修复 taro-component 的 key types ([6c7b164](https://github.com/NervJS/taro/commit/6c7b1644adaa8ec1a069c74a5b8bd7ec977dd56c))
* **redux:** 去掉页面 hide 就不更新的处理逻辑 ([bf2fb6a](https://github.com/NervJS/taro/commit/bf2fb6a3150163af9aad5852049fc019d5b20109))
* **redux-h5:** 修复redux组件didMount和didShow顺序相反的问题 ([266c8da](https://github.com/NervJS/taro/commit/266c8da3b81df146aeaea1c738a0924cc24b95b0))
* **taro-components:** 修复swiper 更新props时 衔接滑动出现的下标不对问题 ([ffe5e5d](https://github.com/NervJS/taro/commit/ffe5e5d9536c53f278875f7a8a99919af05c11a9))
* **taro-components:** 修复swiper 更新数据之后，容器宽高没有重置的问题，  issue[#296](https://github.com/NervJS/taro/issues/296)， ([9f42d61](https://github.com/NervJS/taro/commit/9f42d61be512f353d118f5b91133a2b0973f4084))
* **transformer:** 循环自定义组件的 callee 可能是 this.props ([09e7f53](https://github.com/NervJS/taro/commit/09e7f53b2e409d7040deed864bfd649e9535e591))
* **transformer:** 改善 windows 路径 的兼容性, close [#293](https://github.com/NervJS/taro/issues/293) ([2a9f938](https://github.com/NervJS/taro/commit/2a9f938b93c58c48b08be025ee57a0a5c08162e3))
* **weapp:** taro/weapp 也需要 export internal_inline_style 方法 ([d998153](https://github.com/NervJS/taro/commit/d998153af1b53f13bc96a98246acd52bafb4fa5b))


### Features

* **core:** style 支持写入对象 ([931ee57](https://github.com/NervJS/taro/commit/931ee57dcb396aefa047a6e6bc65dc395b0e9cab))
* **taro-weapp:** app 补充 onError 和 onPageNotFound 两个生命周期 ([fc7528e](https://github.com/NervJS/taro/commit/fc7528e5437fe337fd5ac1e0b7b0d9eb76b6b439))



## [0.0.69-beta.1](https://github.com/NervJS/taro/compare/v0.0.69-beta.0...v0.0.69-beta.1) (2018-07-09)


### Bug Fixes

* **eslint:** this.$rourer 触发 JSX 事件名 ([1af94f3](https://github.com/NervJS/taro/commit/1af94f39eac14aa54f2974167b0aac416ade3346))
* **webpack-runner:** 修复Dynamic Import后报错的问题 ([57db5ad](https://github.com/NervJS/taro/commit/57db5ad4873cf8dbfe510d08080641cd3943c12b))


### Features

* **transformer:** 支持 style 传入对象 ([d0be191](https://github.com/NervJS/taro/commit/d0be1912cec4036ab963427ec2ca82c376a02965))



## [0.0.69-beta.0](https://github.com/NervJS/taro/compare/v0.0.68...v0.0.69-beta.0) (2018-07-08)


### Bug Fixes

* **taro-weapp:** 页面退出清除缓存后，再次进入未能初始化 state ([08f63fd](https://github.com/NervJS/taro/commit/08f63fd8b6d451aac21a58289afe2857a0953359))



## [0.0.68](https://github.com/NervJS/taro/compare/v0.0.68-beta.4...v0.0.68) (2018-07-07)


### Bug Fixes

* **cli:** 修复 tsconfig.json 设置，加入 typing 依赖. close [#284](https://github.com/NervJS/taro/issues/284) ([f985aee](https://github.com/NervJS/taro/commit/f985aeecd6ec947cf736abc40998bfc4d7f29422))
* 修复swiper 初始化自动播放问题 ([7395fb0](https://github.com/NervJS/taro/commit/7395fb006a99a61051121974cab6c83ca7860b74))



## [0.0.68-beta.4](https://github.com/NervJS/taro/compare/v0.0.68-beta.3...v0.0.68-beta.4) (2018-07-06)


### Bug Fixes

* **cli:** h5模式 在.temp中保留原始文件名 ([7ae66d0](https://github.com/NervJS/taro/commit/7ae66d091fe12e5a7b671dec2bba919997384ca6))
* **cli:** 支持 js 文件写后缀 close [#276](https://github.com/NervJS/taro/issues/276) ([b2bbee0](https://github.com/NervJS/taro/commit/b2bbee0489b889e63f6045bb1ce8bcd9b170ae40))
* **router:** 修复router navigateBack不刷新url的问题 ([42b2f29](https://github.com/NervJS/taro/commit/42b2f293e74e2a685b0ed78fa9ab40594debf7be))
* **taro-weapp:** 修正子组件生命周期执行顺序 ([eb3aed3](https://github.com/NervJS/taro/commit/eb3aed3e4acce8ad22fbdcd700aad3416106bb6b))
* **taro-weapp:** 缩短因为 bind 传参导致的 wxml 属性过长 ([aa73799](https://github.com/NervJS/taro/commit/aa737992be968402e5c356004796acc890adf387))
* **taro-weapp:** 页面退出时清空缓存 ([c420b21](https://github.com/NervJS/taro/commit/c420b21b91c1243afe9d4de8dbcb5c68149fa263))
* **transformer:** 修复引用标识符加入全局 state 的条件 ([2b6eb80](https://github.com/NervJS/taro/commit/2b6eb805a68e2a7532ced48cf75890a7ff266cb7))
* **transformer:** 动态循环组件 return stateName 标识符 ([ab67b7b](https://github.com/NervJS/taro/commit/ab67b7bd51ef2eb92521e5f5c77e063b5434bb22))
* **transformer:** 循环组件的 callee 为复杂表达式时加入全局 state ([abaf5a4](https://github.com/NervJS/taro/commit/abaf5a49be0c454aa8b0f240560399f484e31066))
* **transformer:** 自定义组件的 props 可以传入 this.prop.xx.xx 所声明的变量 ([57ee230](https://github.com/NervJS/taro/commit/57ee230fb9bc2492c8584745870f285518a0cdce))
* **webpach-runner:** 加回了ts-loader ([60df7f5](https://github.com/NervJS/taro/commit/60df7f5c126d647a2490e2df4ff0acb97c2d15b5))
* **webpack-runner:** 去除多余依赖 ([1de9ca3](https://github.com/NervJS/taro/commit/1de9ca39eaa4e604fbe04fe5c9a1a31c4850a798))


### Features

* **cli:** 使用klaw扫描文件目录，移除vfs ([8cc1015](https://github.com/NervJS/taro/commit/8cc1015ad1e2ff8707e1ac743d5ff84987fdd0b8))
* **taro-h5:** 加入typings 防止ts报错 ([5230b93](https://github.com/NervJS/taro/commit/5230b937652466df5cda59a21d45c53e472053ed))
* **webpack-runner:** webpack-runner优化 ([490e7cb](https://github.com/NervJS/taro/commit/490e7cb36ca9b3ad9f80c4475d6c023e87b6561a))



## [0.0.68-beta.3](https://github.com/NervJS/taro/compare/v0.0.68-beta.2...v0.0.68-beta.3) (2018-07-05)


### Bug Fixes

* **transformer:** 匿名 loop state/callee 不加入全局 state ([2e978f0](https://github.com/NervJS/taro/commit/2e978f0ec2d6f41228bc38231394ea507c436c95))
* **transformer:** 路径解析不正确 ([9eca434](https://github.com/NervJS/taro/commit/9eca43408765fcfe84a28a4c287b37f04db23bb7))



## [0.0.68-beta.2](https://github.com/NervJS/taro/compare/v0.0.68-beta.1...v0.0.68-beta.2) (2018-07-05)


### Bug Fixes

* **taro-weapp:** createData try catch 后暴露错误 ([d0fef0d](https://github.com/NervJS/taro/commit/d0fef0dfc6f23df837f32cfc4da47c219dc22d10))



## [0.0.68-beta.1](https://github.com/NervJS/taro/compare/v0.0.68-beta.0...v0.0.68-beta.1) (2018-07-05)


### Bug Fixes

* **taro-cli:** 修复taro-cli新建typescript模块eslint报错 ([52dfe83](https://github.com/NervJS/taro/commit/52dfe834e7736f63a6753165a97eee260c81a0d2))
* **transfomer:** 修复动态组件作用域取值问题 ([4aab4e2](https://github.com/NervJS/taro/commit/4aab4e2d8908adc47fd46caf64abba5ff6373b33))



## [0.0.68-beta.0](https://github.com/NervJS/taro/compare/v0.0.67...v0.0.68-beta.0) (2018-07-05)


### Bug Fixes

* **taro-weapp:** 自定义组件 componentDidMount 不触发 ([351b858](https://github.com/NervJS/taro/commit/351b858ce9c4ccf87d521d614484c7b4ae130a7f))
* **taro-weapp:** 自定义组件无法接受来自 redux 等的外部 props ([76a397c](https://github.com/NervJS/taro/commit/76a397cf20b15a06c54499232b9549b0c9a9bb12))


### Features

* **cli:** 当 node 版本过低时报错 ([c35a91f](https://github.com/NervJS/taro/commit/c35a91f96f89433feb310cced28949923cc58265))



## [0.0.67](https://github.com/NervJS/taro/compare/v0.0.67-beta.3...v0.0.67) (2018-07-04)


### Bug Fixes

* **cli:** 调用转换器时参数变更 ([622fa57](https://github.com/NervJS/taro/commit/622fa5790b3375bd493c1fe9602f09cac9526a7f))
* **taro-weapp:** 第一次 createData 时 try catch 保证不报错 ([77bc685](https://github.com/NervJS/taro/commit/77bc685d217e4f7ef2a45c01ea573c48ea0b670c))
* **transformer:** 处理 import tsx, xml 路径解析错误的情况 ([57b810b](https://github.com/NervJS/taro/commit/57b810b5f729465f0a77516a77c5ef12514a348f))



## [0.0.67-beta.3](https://github.com/NervJS/taro/compare/v0.0.67-beta.2...v0.0.67-beta.3) (2018-07-04)


### Bug Fixes

* **transformer:** 单独使用的自定义也加入 key ([a231a90](https://github.com/NervJS/taro/commit/a231a90d9b9a855b5ac4c7f0a03290c77987845b))
* **transformer:** 所有设置 if 条件都加入 block ([a32661e](https://github.com/NervJS/taro/commit/a32661ef6ac179925ed0445757065fb9c3a40a0e))


### Features

* 重构swiper 组件 ([d10a9df](https://github.com/NervJS/taro/commit/d10a9df553a709c7356c6fd4930f6961ab275dbb))



## [0.0.67-beta.2](https://github.com/NervJS/taro/compare/v0.0.67-beta.1...v0.0.67-beta.2) (2018-07-04)


### Bug Fixes

* **taro-weapp:** 组件状态被重置 ([fdf5ef2](https://github.com/NervJS/taro/commit/fdf5ef21937583831231b5f5341e6886bc43a846))


### Features

* **tcr:** Picker 的 Dialog 模块重构，参考react-native-modal的思想 ([4562227](https://github.com/NervJS/taro/commit/4562227ef7f7652e8d5167a5c28ee91a9e5a8fc7))



## [0.0.67-beta.1](https://github.com/NervJS/taro/compare/v0.0.67-beta.0...v0.0.67-beta.1) (2018-07-04)



## [0.0.67-beta.0](https://github.com/NervJS/taro/compare/v0.0.66...v0.0.67-beta.0) (2018-07-04)


### Bug Fixes

* **taro-weapp:** 组件初始化放到页面 onLoad 里 ([5a8ede0](https://github.com/NervJS/taro/commit/5a8ede0d7f1e30d403c6afa0fe71492c2b8334bc))
* **transformer:** 循环自定义组件的 iterator 重命名 ([a9cf461](https://github.com/NervJS/taro/commit/a9cf46194787933b59019b7e44d9aa6f8345e0b1))



## [0.0.66](https://github.com/NervJS/taro/compare/v0.0.65...v0.0.66) (2018-07-04)


### Bug Fixes

* **cli:** redux 模板变更 ([8912f9c](https://github.com/NervJS/taro/commit/8912f9ceed84b0b401b14c79e7df5c4e19479609))
* **taro-weapp:** 组件的 _createData() 不在 constructor 里调用 ([f759d52](https://github.com/NervJS/taro/commit/f759d52ea0f91a000d4c623749962f3a0373e6cd))
* **transformer:** $DC 表达式解析失败 ([72b45bc](https://github.com/NervJS/taro/commit/72b45bc147d271950b00632cbafed3c60c922101))
* **transformer:** $dynamicComp 的 stateName 应该和 template data 的指向保持一致 ([e5140e4](https://github.com/NervJS/taro/commit/e5140e4d0e2916eb1773d6f6b37363693ddb11ba))
* **transformer:** 寻找 id 是属于 props 或 state ([5b5f42f](https://github.com/NervJS/taro/commit/5b5f42fd5c144d6a073f4a441a5e7f76479a01a2))



## [0.0.65](https://github.com/NervJS/taro/compare/v0.0.64...v0.0.65) (2018-07-03)


### Bug Fixes

* **taro-h5:** H5 端 request cache 参数丢失 ([2bb0a1a](https://github.com/NervJS/taro/commit/2bb0a1a0a878dd4fe40845d625dd33ca725a5168))
* 修复swiper 组件引用问题 ([a524b1c](https://github.com/NervJS/taro/commit/a524b1cefab91fa597e0dd5cbd06d104fa7144c9))
* **taro-weapp:** 小程序组件化修正 ([f29d9e4](https://github.com/NervJS/taro/commit/f29d9e4bc450daad56a544b04992363d2a0fcbb8))
* **taro-weapp:** 所有组件引用当成动态组件处理 ([318a850](https://github.com/NervJS/taro/commit/318a850742942ef861c9474a84931f128b81d57c))
* 修复ScrollView 组件 scrollWithAnimation 问题，修复radio 外部样式问题，修复checkbox 样式错乱问题，修复 switch color 值无效问题 等 ([8995f1f](https://github.com/NervJS/taro/commit/8995f1f7ae05427684dcbdf55ac1b62ea7b5924e))
* **transformer:** $usedState 不加入非标准 id ([e622500](https://github.com/NervJS/taro/commit/e6225007e59b5aba3e4360ab199a912783c2216e))
* **transformer:** 单独使用的自定义组件也当做循环自定义组件处理 ([47bdc55](https://github.com/NervJS/taro/commit/47bdc552c16853104c10d61b832040fa3449244a))
* **transformer:** 单独使用的自定义组件在 createData 加入索引 ([f2b8bdc](https://github.com/NervJS/taro/commit/f2b8bdca898d81425fe516c64a00f436da7dad92))
* **transformer:** 自定义组件 props 不写值则默认赋值 true ([a64632a](https://github.com/NervJS/taro/commit/a64632adb2b5adcb9cebf1b2c860ae3542acd521))


### Features

* **tcr:** Button 支持 hoverStyle ([96d0e4b](https://github.com/NervJS/taro/commit/96d0e4b25998ebac2851f02cf957329840319a4c))



## [0.0.64](https://github.com/NervJS/taro/compare/v0.0.63...v0.0.64) (2018-07-02)


### Bug Fixes

* **cli:** tsconfig.json 和 typescript 依赖缺失, may fix [#233](https://github.com/NervJS/taro/issues/233), [#241](https://github.com/NervJS/taro/issues/241) ([7e652ce](https://github.com/NervJS/taro/commit/7e652ce4556d9c2e11ec13d1238d488c3ad18253))
* **cli:** 无法解析键值为字符串的 config, close [#235](https://github.com/NervJS/taro/issues/235) ([5fc5f22](https://github.com/NervJS/taro/commit/5fc5f22e8e8127e1304675d24443f31c445831be))
* **eslint:** eslint 的 class method 也是 function, close [#238](https://github.com/NervJS/taro/issues/238) ([13ff0eb](https://github.com/NervJS/taro/commit/13ff0ebe07760152cd6ba28e79fed818ea4e599b))
* **taro-weapp:** 循环组件数据处理 ([f5b36ff](https://github.com/NervJS/taro/commit/f5b36ff9a233ce869996e815476049cc2083e183))
* **taro-weapp:** 支持引用 pages 目录下的内容 ([5124d0f](https://github.com/NervJS/taro/commit/5124d0f6a59ad53d23cb825e8140fc15bbf0c683))
* **transformer:** bind 表达式解析错误 ([9b9e3d9](https://github.com/NervJS/taro/commit/9b9e3d92cbdb6370c04d5b58041de46df05ab273))
* **transformer:** 删除重复的测试用例 ([799c39c](https://github.com/NervJS/taro/commit/799c39c6f32e36fd0b5f7b7a551d1ccdde680ebd))
* **transformer:** 单独使用的自定义和循环自定义分开处理  $dynamicComponents ([4bb5092](https://github.com/NervJS/taro/commit/4bb50920292441bed4d016df84e5af0d84ff1868))
* **transformer:** 处理只有循环自定义的情况 ([636c7a5](https://github.com/NervJS/taro/commit/636c7a54b6c645edd6a32f94647c7b0e41fe0d11))
* **transformer:** 处理自定义组件不写 attr value 的情况 ([0c6c73e](https://github.com/NervJS/taro/commit/0c6c73eddd5909224151a4ef22b62b2ce73ea5ff))


### Features

* **cli:** 生成 WXS 文件 ([4bd6ed2](https://github.com/NervJS/taro/commit/4bd6ed2d4fbfc48d0fba86a933e15345125d50e0))
* **taro-rn:** 一系列端能力实现 ([d91b0e8](https://github.com/NervJS/taro/commit/d91b0e8973245127d34d822a885a878054a213b6))
* **tcr:** 增强 Clickable ([7d99c3e](https://github.com/NervJS/taro/commit/7d99c3ec46de4e2968d64f68966e2bd0767d7c35))



## [0.0.63](https://github.com/NervJS/taro/compare/v0.0.62...v0.0.63) (2018-06-29)


### Bug Fixes

* **taro-h5:** request api 支持 GET 时使用 data 作为参数 && 修正返回结果的 header ([295061f](https://github.com/NervJS/taro/commit/295061f26a6bc6ec6fd44c6213ebf72a3ca2c118))
* **transformer:** $dynamicComponents 的 stateName 也需要重命名 ([ecf9a4d](https://github.com/NervJS/taro/commit/ecf9a4d2534a232c4ae4e5cfca1e79b7b3786456))
* **transformer:** 动态组件 index 问题 & 动态组件 key ([2d5d82f](https://github.com/NervJS/taro/commit/2d5d82fa4215082d462b10119ecb21ecc50c296a))
* **webpack-runner:** 修复了h5模式下丢失prod配置的问题 ([bb2c98f](https://github.com/NervJS/taro/commit/bb2c98f085993ca0ec8ddc712253b54c5e9aaf94))


### Features

* **taro:** 增加新 api 支持 ([c930c3f](https://github.com/NervJS/taro/commit/c930c3fa579ec6ede9ac6c6ae2a30b9092506640))
* **taro:** 将 api 列表进行统一管理 ([ec79e95](https://github.com/NervJS/taro/commit/ec79e95062869e6558f74f6b43c939988c5241ab))
* **tcr:** 手势事件的event参数的转化 ([1d52f96](https://github.com/NervJS/taro/commit/1d52f96eb836260f1913b99a8d7b076951b3820a))



## [0.0.62](https://github.com/NervJS/taro/compare/v0.0.61...v0.0.62) (2018-06-28)


### Bug Fixes

* **webpack-runner:** 丢失 ts-loader 依赖 ([8a0bf39](https://github.com/NervJS/taro/commit/8a0bf39f7a42dbbaec0291d47b1a640d7e4d9b4a))



## [0.0.61](https://github.com/NervJS/taro/compare/v0.0.60...v0.0.61) (2018-06-28)


### Bug Fixes

* **cli:** 小程序编译获取ast时传入源码路径 ([f8e43d9](https://github.com/NervJS/taro/commit/f8e43d95f605b800101d98fe6a593ea84c06bc64))
* **redux-h5:** 修正了package.json的scripts错误 ([31ce840](https://github.com/NervJS/taro/commit/31ce84057ecceec67efe3ca48ba8be621db39de9))
* **router:** 去除了router残留的log.. ([f098882](https://github.com/NervJS/taro/commit/f0988829bd72a4cf4087badbd2c2abd99276df9d))
* **taro:** 入参 ([ed632e9](https://github.com/NervJS/taro/commit/ed632e910ad53cbe4dc371d512ac7aa405224d34))
* **taro-h5:** request api 增加 jsonpCache 参数，fix [#224](https://github.com/NervJS/taro/issues/224) ([a0d6674](https://github.com/NervJS/taro/commit/a0d667481bc21bcd5cb4911992dcc2761aed8cff))
* **taro-weapp:** 修复小程序端循环组件事件绑定错误 ([8ca2ce7](https://github.com/NervJS/taro/commit/8ca2ce788204428e6b468ad5f5b62ca02023d149))
* **taro-weapp:** 修正小程序端子组件生命周期执行及子组件 componentWillReceiveProps 的入参 ([31531a5](https://github.com/NervJS/taro/commit/31531a55494dd5b795dafbcb90da485b53421e88))
* **tcr:** ios icon 没显示 ([75db35c](https://github.com/NervJS/taro/commit/75db35c6f35b1746e3239e24c0855e66fa6760f8))
* **tcr:** Picker在IOS消失了，因为有多个Modal不能同时显示，安州没问题 ([aa399bc](https://github.com/NervJS/taro/commit/aa399bc7cb80dd8e104f697d96d25193a9197494))
* **tcr:** Radio 选中态图标跟border间有间隙 ([ed37199](https://github.com/NervJS/taro/commit/ed371993828e2aef317250711b73f150e9f9c484))
* **tcr:** 阻止在ios用weui时因为没有链接libART.a而报错 ([5881dd4](https://github.com/NervJS/taro/commit/5881dd4abec725ead97de1588895316addff4ede))
* **transformer:**  多个 ifStatement 渲染错误 ([32906c5](https://github.com/NervJS/taro/commit/32906c5350815b12e9a66274d69732b0293b415f))
* **transformer:** key 的位置在条件表达式的情况下不对, close [#199](https://github.com/NervJS/taro/issues/199) ([6e24fcc](https://github.com/NervJS/taro/commit/6e24fccc58c2d2664e796922a0ed7d9841e46f26))
* **transformer:** wxml import 路径使用 unix 风格，close [#212](https://github.com/NervJS/taro/issues/212) ([2782046](https://github.com/NervJS/taro/commit/2782046395e3d8630d295d06b10432d2871338de))
* **transformer:** 逻辑表达式的 wx:if 使用 block 包裹 ([e0f457d](https://github.com/NervJS/taro/commit/e0f457dacd0e18f57752a00e5e042f75aa1f29f4))


### Features

* **cli:** cli的h5版本传参逻辑修改，并切换到@tarojs/transformer-wx ([716fb17](https://github.com/NervJS/taro/commit/716fb17244d21cd31ed6ea379c13eee8bbcbd9f5))
* **cli:** 增加 redux 模板 ([98f61d5](https://github.com/NervJS/taro/commit/98f61d51132a6f49ffc98d197159ed2500225890))
* **eslint:** 新规则 reserve-class-properties, close [#221](https://github.com/NervJS/taro/issues/221) ([5fe2c46](https://github.com/NervJS/taro/commit/5fe2c4664e29549b6fc142e0b0ec3b3aea8bb597))
* **tcr:** Icon 在 IOS 的颜色 ([ceeb158](https://github.com/NervJS/taro/commit/ceeb15809943bc9368c8b9dfeb70a0131561d5a2))
* **tcr:** platform-specific code of icon ([751863d](https://github.com/NervJS/taro/commit/751863d2ef22e907515c4f07f7979ee3c39a209e))
* **webpack-runner:** webpack-runner支持自定义devServer ([5632e94](https://github.com/NervJS/taro/commit/5632e944bd078bb53dada35c73efcb6906104cba))
* **webpack-runner:** 将webpack-runner切换到ts,并且支持了defineConsts, devServer，plugins配置 ([f1c0271](https://github.com/NervJS/taro/commit/f1c0271b3d1f28f45feefedce4aa9c0cce873334))
* **webpack-runner:** 调整了webpack-runner的types ([b6a9c0f](https://github.com/NervJS/taro/commit/b6a9c0fcf6a08b660de02727af30c0a1ecf61b91))



## [0.0.60](https://github.com/NervJS/taro/compare/v0.0.59...v0.0.60) (2018-06-27)


### Bug Fixes

* **cli:** h5 编译watch时中文处理的问题 ([62c1554](https://github.com/NervJS/taro/commit/62c155417a3b0ef062c4cea942768f6833235277))
* **eslint-plugin-taro:** 组件属性无法使用 this.props.* 形式赋值 ([0f7e746](https://github.com/NervJS/taro/commit/0f7e746e210985f87093ff5db617a2cf59803e6d))
* **transformer:** 条件表达式编译 block 没有 children ([80925b7](https://github.com/NervJS/taro/commit/80925b779fd9c281def1cab244829ed3e4fc8f18))


### Features

* **router:** router改用@tarojs/taro-h5作为基类 ([503bdc8](https://github.com/NervJS/taro/commit/503bdc8924651fad8b5bf6b61c68eb4a3e7e0cb0))
* **taro-h5:** taro-h5注入$router ([e518482](https://github.com/NervJS/taro/commit/e518482ccbdd9a2ab557a208dfad6f13116d2a8b))
* **taro-redux-h5:** 加入了定制版redux ([090ff9c](https://github.com/NervJS/taro/commit/090ff9cd7e52473e8f1fd826a4bfa54841b86b8e))
* **taro-rn:** 优化websocket API，增加测试用例 ([4beb2f2](https://github.com/NervJS/taro/commit/4beb2f2c7b4f1f4214c125f121fe52bf4c347de0))
* **tcr:** add component Tabbar ([5e34a2c](https://github.com/NervJS/taro/commit/5e34a2cb9202c85f51e0f1586387b680347fc840))
* **transformer:** state|props 可以作为 data 的 key ([7e78f31](https://github.com/NervJS/taro/commit/7e78f311505f9a9d163376e87897b14502e07177))
* **transformer:** 事件 bind 可以直接写数字 ([3b6a799](https://github.com/NervJS/taro/commit/3b6a7991d51afa243255feab54719b668614477b))



## [0.0.59](https://github.com/NervJS/taro/compare/v0.0.58...v0.0.59) (2018-06-25)


### Bug Fixes

* **cli:** 兼容没有 project.config.json 的情况 ([a9c2b8b](https://github.com/NervJS/taro/commit/a9c2b8b3710e1bac9f9e6c0d7dce055d8ddd9e61))
* **redux:** 处理 mapStateToProps 和 mapDispatchToProps 中存在同名对象时更新错误 ([2ff5f3b](https://github.com/NervJS/taro/commit/2ff5f3bb65208fbc6c23f99eb5e698079ace9192))
* **taro-weapp:** 页面循环输出组件生命周期处理 ([a968493](https://github.com/NervJS/taro/commit/a96849350d975fb6faaa721839b53a97fa5ae69f))
* **tcr:** Switch onChange 事件的参数错误 ([fdd5f4a](https://github.com/NervJS/taro/commit/fdd5f4a04080804a291d40f21a930f3003892511))
* **tcr:** 修复input组件在blur时娶不到值到问题 ([b3bfb43](https://github.com/NervJS/taro/commit/b3bfb437b71398b554750f07884a91a5d49a1ac5))
* **transformer:**  支持条件表达式的 consequent 为空 ([a05937a](https://github.com/NervJS/taro/commit/a05937a87c0b855a14000a8548ae24f091eb7d2e))
* **transformer:**  逻辑/条件表达式的 tester 可以使用复杂表达式 ([2c07688](https://github.com/NervJS/taro/commit/2c07688553ba1abbc6988b4638add36d45fb25d1))
* **transformer:** createData 加入 this.props 的处理 ([aab2a76](https://github.com/NervJS/taro/commit/aab2a76658d683e37dd58a2ad5e928d5d104542e))
* **transformer:** 循环组件不加入 $components ([e53abec](https://github.com/NervJS/taro/commit/e53abec56a0fb641c1ff4dcb235c9d6568b26ebd))
* **transformer-wx:** 去除无用代码 ([6507857](https://github.com/NervJS/taro/commit/65078579724efbb3c0a7778cdabcb081c0e51773))


### Features

* **taro-cli:** 为 dist/ 编译出 project.config.json，由此可把 dist/ 拖入开发者工具以避免无效编译，详见 [#190](https://github.com/NervJS/taro/issues/190) ([c6339fa](https://github.com/NervJS/taro/commit/c6339fa43a59492a3671aff00192725a39cf502b))
* **taro-rn:** 增加storage api的单元测试 ([df1f794](https://github.com/NervJS/taro/commit/df1f794d829578685c5fd9f5e82920fb4fa83b52))
* **tcr:** add component Form ([56317c0](https://github.com/NervJS/taro/commit/56317c091075898e313653831cba277300a885aa))
* **tcr:** enhance clickable ([9fa8bc3](https://github.com/NervJS/taro/commit/9fa8bc37b1af95f09d9aa78d2ee9616b88783da9))



## [0.0.58](https://github.com/NervJS/taro/compare/v0.0.57...v0.0.58) (2018-06-24)


### Bug Fixes

* **transformer:** JSX attr expression 有多个 this.props. 成员表达式, close [#189](https://github.com/NervJS/taro/issues/189) ([9be4451](https://github.com/NervJS/taro/commit/9be445176e46fcd1ef14054a9648e09b06502306))
* **transformer:** 前置逻辑/条件表达式处理 ([f54c421](https://github.com/NervJS/taro/commit/f54c421e1e2c3354f9e02f24edc74d19439f861d))



## [0.0.57](https://github.com/NervJS/taro/compare/v0.0.56...v0.0.57) (2018-06-24)


### Bug Fixes

* **cli:** rn 编译样式处理错误 ([ddb7a5d](https://github.com/NervJS/taro/commit/ddb7a5dc3065d1aafdb8bf28c63202f259c68fb1))
* **cli:** 包名有误 ([e31d66a](https://github.com/NervJS/taro/commit/e31d66a62653457ff1ae260e435d5b292db652fa))
* **eslint:** jsx-handler-name  对 this.state 报错 ([6f400e7](https://github.com/NervJS/taro/commit/6f400e771d63cfa2c5efc69b86fe039f058ef033))
* **eslint-plugin-taro:** 组件属性无法使用 this.state.* 形式赋值 ([827db83](https://github.com/NervJS/taro/commit/827db83dff25c0d4acb4178e056495533e6330c1)), closes [#145](https://github.com/NervJS/taro/issues/145)
* **redux:** redux 更新前设置组件的 prevProps ([c0d91fb](https://github.com/NervJS/taro/commit/c0d91fb4a06bd8f51960aff67cc9e835755b0906))
* **tabbar:** 修复tabbar转h5后退隐藏问题 ([f39966b](https://github.com/NervJS/taro/commit/f39966b8e0b9dda66e8b1cf6565de2bae8e01f92))
* **taro-weapp:** 小程序端 request 不支持传入 success/fail 参数的方式使用，fix [#172](https://github.com/NervJS/taro/issues/172) ([fffb6d8](https://github.com/NervJS/taro/commit/fffb6d886b53b3cfa69c6e9274da39dcaaa5bdf2))
* **taro-weapp:** 页面执行完 componentWillReceiveProps 后需要更新下 state ([ad9c05e](https://github.com/NervJS/taro/commit/ad9c05e931a49d2a251720bee9d8fad47501110b))
* **transformer:** 写 return  的循环可以使用复杂表达式 ([0ab50f6](https://github.com/NervJS/taro/commit/0ab50f6c4fdfc43dfe710798d74681a8c413fab1))


### Features

* **cli:** added .npmignore ([2ad9d3e](https://github.com/NervJS/taro/commit/2ad9d3e6f32d1de0a00cdad821467d2eb3ee69be))



## [0.0.56](https://github.com/NervJS/taro/compare/v0.0.55...v0.0.56) (2018-06-22)


### Bug Fixes

* **cli:** cli 丢失 latest-version 依赖 ([62b60fc](https://github.com/NervJS/taro/commit/62b60fc59d18ead8f8cc01eacf6fb9e52096385b))



## [0.0.55](https://github.com/NervJS/taro/compare/v0.0.54...v0.0.55) (2018-06-22)


### Bug Fixes

* **cli:** babylon 无法定位代码出错位置 ([fe944bd](https://github.com/NervJS/taro/commit/fe944bd43c4e61a4a06860aefd6ce2acc5a4dd42))
* **cli:** merge 代码错误 ([c8f2abb](https://github.com/NervJS/taro/commit/c8f2abb2fd17fcfed2f9cdb4da24e32c92a05630))
* **cli:** 小程序组件内不支持 defineConstants 和 env 替换 ([8d5fcbc](https://github.com/NervJS/taro/commit/8d5fcbc7c96e4c78c1392c66ef0a6f46fec81751))
* **cli:** 支持随意使用 require 引入静态资源 ([ced4d50](https://github.com/NervJS/taro/commit/ced4d505094474337e1285eaa13cbec6583eb824))
* **cli:** 部分文件不支持 ts 编译 ([6e2fcfc](https://github.com/NervJS/taro/commit/6e2fcfc8fb25d6dec2f68344f3a3757d50fe505e))
* **redux:** redux 更新后不执行组件的 componentWillReceiveProps ([4b3a254](https://github.com/NervJS/taro/commit/4b3a25462bc8916f0b0515a24e5101b42d7276ca))
* **taro-cli:** taro 获取新包导致无网络环境下执行命令报错 ([e2caaf5](https://github.com/NervJS/taro/commit/e2caaf58aa27d928bfd5024fdfecf01c970586ed))
* **taro-h5:** h5 api 修复 actionSheet 的 promise 问题 ([bac64ee](https://github.com/NervJS/taro/commit/bac64ee879c471507d4c85f64793297cd8d527d9))
* **taro-h5:** H5 端 request 默认 GET 请求 ([54ff353](https://github.com/NervJS/taro/commit/54ff3535a40cd24fc0656977cae0cf336d828125))
* **taro-weapp:** 小程序端循环输出组件 bug ([501c84a](https://github.com/NervJS/taro/commit/501c84aff567d59de4b2a33579e9ae9dc1f412c3))
* **taro-weapp:** 小程序端循环输出组件时递归遍历错误 ([2d435d9](https://github.com/NervJS/taro/commit/2d435d9561291aa4fa6f77a3489c009ef6a3cda4))
* **taro-weapp:** 循环动态创建组件数据不更新 ([c12e139](https://github.com/NervJS/taro/commit/c12e13903a23eff63f969c49080bf80ac8ab2d6a))
* **tcr:** Swiper 安卓下不能垂直滚动 ([401b2e3](https://github.com/NervJS/taro/commit/401b2e3ceb0629386675e909c0317ca853daf4e3))
* **tcr:** Textarea 安卓下输入闪烁问题 ([1258e7d](https://github.com/NervJS/taro/commit/1258e7db0f5ba773faea6896c60452f7c374bd19))
* **transformer:**  有逻辑表达式时无法处理循环组件 ([e6a98be](https://github.com/NervJS/taro/commit/e6a98bee1b2b3bf6e8347fa47133417aa3c5ecc0))
* **transformer:** bind 事件失效, close [#154](https://github.com/NervJS/taro/issues/154) ([b3e28bc](https://github.com/NervJS/taro/commit/b3e28bc41987accda52ceb6d5c18637c761ccf8e))
* **transformer:** wx:else 不需要编译为 true ([574a23a](https://github.com/NervJS/taro/commit/574a23a0ab2cabbeda91818dc9890a30d16f5e5a))
* **transformer:** 修复 JSX children 也可能会加入 loop component ([db8398b](https://github.com/NervJS/taro/commit/db8398be99fe3b0a0dd2497b6d9c421756cb9bc8))
* **transformer:** 加强对 JSX children 的判定 ([a2335f1](https://github.com/NervJS/taro/commit/a2335f129cfb54112339ee5b50894e5c72b1a37b))
* **transformer:** 只有使用方括号的成员表达式才加入匿名表达式 ([419cf8e](https://github.com/NervJS/taro/commit/419cf8e7ab39e1f4d8ffdefbaeb0e6f1a6779255))


### Features

* **cli:** 提示改用中文 ([992c936](https://github.com/NervJS/taro/commit/992c9368da5a323a27b7b5a24518ef2dfb192540))
* **taro-cli:**  干掉更新提示 ([098309f](https://github.com/NervJS/taro/commit/098309fe913f34dff2a28254c86ddb4b459149d0))
* **taro-cli:** add taro update self and taro update project ([8d13e7f](https://github.com/NervJS/taro/commit/8d13e7f5ca884bf3cae57ca04e01987031b62310))
* **taro-cli:** 更新项目以来中所有 lerna 管理的包 ([914d8cc](https://github.com/NervJS/taro/commit/914d8ccb1333b46416bcbf648d4b8b674fc91964))
* **taro-cli:** 添加 update 命令 ([842404c](https://github.com/NervJS/taro/commit/842404c68a346a9ac50a231aa8598f2006cb8136))
* **taro-cli:** 添加更新提示 ([196b21b](https://github.com/NervJS/taro/commit/196b21b45975ea32706868df2008fb5e6d6b8605))
* **taro-h5:** h5 api 增加 selectorQuery 的测试用例，并且新增了获取 computedStyled 的功能 ([00956d0](https://github.com/NervJS/taro/commit/00956d05a2bd4aaa2e9e466dfc4d72685d28e358))
* **taro-h5:** H5 端 request api 增加 fetch polyfill ([d458c3e](https://github.com/NervJS/taro/commit/d458c3eb149412993fffd0b0c77c4105dab18e7a))
* **taro-h5:** taro-api hideToast 增加测试用例 ([d4f2076](https://github.com/NervJS/taro/commit/d4f20767637879203ba8ee66700be377bb7dbb91))
* **taro-h5:** taro-api showActionSheet 增加测试用例，更新showActionSheet的文档 ([22cf69c](https://github.com/NervJS/taro/commit/22cf69c1cfcc29394120f3959048b8e3868561a8))
* **taro-h5:** taro-api showLoading 增加测试用例，同时修复了一些showLoading的问题 ([4498116](https://github.com/NervJS/taro/commit/4498116e7532c0d7b2a3eab108053da0aa16d063))
* **taro-h5:** taro-api showModal 增加测试用例，同时修复了一些showModal的问题 ([fbf8189](https://github.com/NervJS/taro/commit/fbf81893b3dc0e4d60f293a59e93a1e8aec9042d))
* **taro-h5:** taro-api 文档更新 ([c4991f8](https://github.com/NervJS/taro/commit/c4991f8451cb357e4ab1f6f0a308de15633bf04c))
* **tcr:** add component Label ([0f65eaf](https://github.com/NervJS/taro/commit/0f65eaf25b3774837888d4a04ceeb13226cb4939))
* **tcr:** Picker modal 硬件返回按钮关闭选择器 ([d00cff6](https://github.com/NervJS/taro/commit/d00cff623fd65b929bc7506fe47ae7a1c4158076))
* **tcr:** 更改Picker出现的动效，overlay层拆分出来 ([f91cf24](https://github.com/NervJS/taro/commit/f91cf24d7c15c6028ee972104e902d9ddb342078))
* **transformer:** 加入 `isNormal` 参数，直接返回 ast ([7e81930](https://github.com/NervJS/taro/commit/7e81930c22226ec9bfac4749a7395b9b940a74a8))



## [0.0.54](https://github.com/NervJS/taro/compare/v0.0.53...v0.0.54) (2018-06-19)


### Bug Fixes

* **cli:** 根据模板创建项目给定默认 css 处理 ([17ee2d3](https://github.com/NervJS/taro/commit/17ee2d39e537546ee7482311961582a7ad3d79b5))
* **eslint:** jsx-handler-names 无法正确处理成员表达式 ([fc13ee2](https://github.com/NervJS/taro/commit/fc13ee2c1beecc78c485bc7bb2ac29111a43bd11))
* **taro-components:** 修复scroll-view 滑动问题，修复slider值大于最大值溢出问题 ([4cf885e](https://github.com/NervJS/taro/commit/4cf885ee267299911ae123e165fe962735a7d1de))
* **taro-components:** 修复swiper圆点位置 ([8554bbb](https://github.com/NervJS/taro/commit/8554bbba7fbc384951fc5c162d4868bee16b15f1))
* **transformer:** props 不直接写真值报错 ([41c6398](https://github.com/NervJS/taro/commit/41c63981721b439329cb2597d52189ef1f6ef8a1))
* **transformer:** 列表渲染自定义组件无法使用key属性，close [#126](https://github.com/NervJS/taro/issues/126) ([f73626b](https://github.com/NervJS/taro/commit/f73626b76c3b8b4ca3320b91fe817674209e23a7))
* **transformer:** 多层循环嵌套自定义组件无效 ([d93ba6a](https://github.com/NervJS/taro/commit/d93ba6a9932b4bcb20a70973b332b2b920d83402))
* 修复css预处理器提示语句错误 ([3336eb5](https://github.com/NervJS/taro/commit/3336eb5bb2c9604b84bfb260c28583a8d2205507))


### Features

* **cli:** 内置了less&stylus支持 ([ac2e3df](https://github.com/NervJS/taro/commit/ac2e3dffe2fff96aefa83bb720ef094342bf23d3))
* **taro-h5:** taro-api showToast 增加测试用例，同时修复了一些showToast的问题 ([93c82d6](https://github.com/NervJS/taro/commit/93c82d615dfe2bb746666fcec7b7821d1d1022a7))
* **transformer:** 内置组件 props 为 true 可以简写 ([06cf7d0](https://github.com/NervJS/taro/commit/06cf7d0568f7401bf5518569808c77b530193d40))



## [0.0.53](https://github.com/NervJS/taro/compare/v0.0.52...v0.0.53) (2018-06-18)


### Bug Fixes

* **cli:** h5 编译入口文件查找错误 ([e00b08b](https://github.com/NervJS/taro/commit/e00b08bf56ca710e0ea73d012e64620fd80af72f))



## [0.0.52](https://github.com/NervJS/taro/compare/v0.0.51...v0.0.52) (2018-06-18)


### Bug Fixes

* **cli:** 小程序编译 watch 时修改组件不更新 ([5e593f0](https://github.com/NervJS/taro/commit/5e593f0f5c9419aef1913c44545b16386170597f))
* **cli:** 支持根据文件后缀选择 css 预处理器 ([7d04c77](https://github.com/NervJS/taro/commit/7d04c77026885b7828a265a5cdd62631b2b6d9fa))
* **cli:** 根据模板创建文件的 bug ([696a56b](https://github.com/NervJS/taro/commit/696a56b5f58b5726aa0626d2e4913120fe4b66b2))
* **eslint:** no-stateless 在 Array#map 方法中不报错, close [#131](https://github.com/NervJS/taro/issues/131) ([6f3c2f1](https://github.com/NervJS/taro/commit/6f3c2f186d9d7142faf78c8bcd26592956701964))
* **taro:** api typings ([06e7535](https://github.com/NervJS/taro/commit/06e7535afc501f97c4a2f75001b345ebe7b768e8))
* **transformer:** eslint 事件规则没有忽略 `key`, close [#129](https://github.com/NervJS/taro/issues/129) ([9b660df](https://github.com/NervJS/taro/commit/9b660df235bfa09a217c771bd9773f058ce039ee))
* **transformer:** 拿掉去除所有未引用的 babel 插件 ([671fe33](https://github.com/NervJS/taro/commit/671fe33408ae5e2268d6c2573b082a02f68132b5))
* **transformer-wx:** 移除@babel/plugin-transform-typescript ([31d5bac](https://github.com/NervJS/taro/commit/31d5bac6cd7cee8421a7e1a2e169d2b204175373))


### Features

* **cli:** add prepublish.js ([7a5e21a](https://github.com/NervJS/taro/commit/7a5e21add6afe67d881c60d88d0763d3c5d6fe95))
* **cli:** add yarn lockfile for template ([6a51b0e](https://github.com/NervJS/taro/commit/6a51b0e132dc2949dc6cdd49ac137b628c83bd55))
* **cli:** 增加 ts/tsx 文件编译支持 ([e13bbf2](https://github.com/NervJS/taro/commit/e13bbf2a95dd7ba32df7d5268168ff1f719da180))
* **cli:** 增加更多 css 预处理器选择 ([3596172](https://github.com/NervJS/taro/commit/3596172d3f89c0cf0e04526c0c53f974ce79c4eb))
* **cli:** 模板增加 typescript 配置 ([97a3db2](https://github.com/NervJS/taro/commit/97a3db2ba118841eefd4da12c429b16732349c45))
* **cli:** 生成ts相关文件 ([549af99](https://github.com/NervJS/taro/commit/549af999da6ba709df1ca67c17af3d98fd85bab3))
* **plugin-less:** 增加 less 处理插件 ([0e16b29](https://github.com/NervJS/taro/commit/0e16b2900a3d4265723a2ab1b04f321d80f8f05e))
* **plugin-stylus:** 增加 stylus 处理插件 ([cf0ee58](https://github.com/NervJS/taro/commit/cf0ee58d1b8d39f71e03e495b2871da26bea7afe))
* **plugin-typescript:** 增加 ts 编译插件 ([d0b9b3c](https://github.com/NervJS/taro/commit/d0b9b3c126649b22ef1a1a550529668063245ee1))
* **transformer:** result 加入已使用图片路径数组 ([94ad281](https://github.com/NervJS/taro/commit/94ad281581457e66321cedd6ee87951e3f8ed3f8))



## [0.0.51](https://github.com/NervJS/taro/compare/v0.0.50...v0.0.51) (2018-06-15)



## [0.0.50](https://github.com/NervJS/taro/compare/v0.0.49...v0.0.50) (2018-06-15)


### Bug Fixes

* **cli:** windows 下 sass 重新编译延时延长 ([1c7f3f2](https://github.com/NervJS/taro/commit/1c7f3f2cbe8719f10b455340e38721ef528ebdb5))
* **cli:** 小程序 watch 时新增组件样式文件不会被引入 ([bb9b0ca](https://github.com/NervJS/taro/commit/bb9b0ca4221fa7f4dd0a6e243776aeab5a180eb2))
* **cli:** 小程序 watch 时未被引用的 JS 文件不需要被编译 ([5521f60](https://github.com/NervJS/taro/commit/5521f6017d033baa58b8779937ac78c7a8ccd706))
* **taro-components:** image添加默认样式，修复scroll-view事件问题 ([0222eec](https://github.com/NervJS/taro/commit/0222eecd014ed88dc7c279dc11c119dd721390df))
* **taro-components:** 修复picker默认值问题 ([79f3729](https://github.com/NervJS/taro/commit/79f3729e8a1a599c2107e141e44fd2e438af0193))
* **taro-components:** 修复slider step计算问题，swiper组件默认样式问题 ([c6100e9](https://github.com/NervJS/taro/commit/c6100e93b33ee1b5e9d34caf7c4d467f92db9730))
* **transformer:** loopState 不加入顶级 state &  循环内没有 block 也能使用复杂表达式 ([d5e620c](https://github.com/NervJS/taro/commit/d5e620c1fe1f7db151acbbf24d1f2aecf50917f7))


### Features

* **transformer:** 没有用到的 import 删除掉引用 ([78d1c71](https://github.com/NervJS/taro/commit/78d1c715e63b35e64d8ec6580af70c017cf1bb05))



## [0.0.49](https://github.com/NervJS/taro/compare/v0.0.48...v0.0.49) (2018-06-13)


### Bug Fixes

* **cli:** 避免出现引用当前页面的情况 ([6b69098](https://github.com/NervJS/taro/commit/6b6909877b89c0d234344eb28be6b83e2383855b))
* **taro-compoents:** 修复swiper自动轮播问题，修复switch返回值问题，修复slider touch事件问题 ([a95c33f](https://github.com/NervJS/taro/commit/a95c33ff971ef7b0be8c475e540a2d6df2cfcb69))
* **taro-components:** 修复audio video 没有事件传递的是会触发方法问题 ([f4e9313](https://github.com/NervJS/taro/commit/f4e93130129decad4e94f2e9c78b0f2cf5f099ff))
* **transformer:** render 定义作用域有 `state` 并且使用过,  close [#107](https://github.com/NervJS/taro/issues/107) ([399eae9](https://github.com/NervJS/taro/commit/399eae97b06c3912500b01f8ba941fab35d8c44f))


### Features

* **cli:**  将h5的webpack配置移动到h5下 ([f44ebdc](https://github.com/NervJS/taro/commit/f44ebdc6cfd8b2ac4dca035e00b4ffd852dbee85))
* **cli:** h5模式下现在可以自由配置webpack的构建参数了 ([cf088cb](https://github.com/NervJS/taro/commit/cf088cbf4e5b77fac56e6507b4cc38e5aeda412a))
* **cli:** 增加生成微信开发工具配置文件 project.config.json ([e109418](https://github.com/NervJS/taro/commit/e1094185abf0e8762f67d6931ac1e5cdbaf2a65f))
* **taro-h5:** taro api 文档补上文件、位置、设备部分 ([33d014b](https://github.com/NervJS/taro/commit/33d014ba182dd05a7ba5ff55cf507d04de5c5d3c))
* **taro-h5:** taro api 文档补上界面部分 ([7c0aeb4](https://github.com/NervJS/taro/commit/7c0aeb473dda4fb2416fc11fb60f4a2747132a8c))
* **taro-rn:** 更新rn-api文档 ([6c3f06b](https://github.com/NervJS/taro/commit/6c3f06bbd1a904d2adddd82cf2e1d5bb98906854))



## [0.0.48](https://github.com/NervJS/taro/compare/v0.0.47...v0.0.48) (2018-06-13)


### Bug Fixes

* **eslint:** jsx-handler-names 判断条件写反了 ([918d604](https://github.com/NervJS/taro/commit/918d60475ece5d238bc29c0235cef9dda68e8c7e))
* **transformer:** CoverImage 加入到默认组件 ([42370fb](https://github.com/NervJS/taro/commit/42370fbdfc801fd6f2128b1f00a37b34fae413d8))
* **transformer:** 使用 [] 获取成员表达式出错 ([2df6309](https://github.com/NervJS/taro/commit/2df630923ea433a1f1c5da4fa6937ff5c306090c))
* **transformer:** 复杂表达式的加入到 state ([bdf8b45](https://github.com/NervJS/taro/commit/bdf8b457f214aaec1e72321cf3efe9ce43f46054))


### Features

* **redux:** 支持深度merge ([9ab2aa8](https://github.com/NervJS/taro/commit/9ab2aa8e7c76f5ce77fd891dc59c549d511653b6))
* **taro-h5:** taro api 文档补上媒体部分 ([119c0b4](https://github.com/NervJS/taro/commit/119c0b44a20e6795575fc4d27f3758c28c0a8a8b))
* map dispatch to props ([c1fce9f](https://github.com/NervJS/taro/commit/c1fce9f6f0bcd68c361cd5a748590aab9389dc5f))



## [0.0.47](https://github.com/NervJS/taro/compare/v0.0.46...v0.0.47) (2018-06-12)


### Bug Fixes

* **async-await:** 引用第三方插件后Promise报错 ([e66177d](https://github.com/NervJS/taro/commit/e66177d9ac1580ab029409abd13f0605ec2af476))
* **components:** Image组件样式bug ([780f8b6](https://github.com/NervJS/taro/commit/780f8b6b47d8457aa2328c00c1f7a57ec0c1bac7))
* **pxtransform:** weapp - 单位转换插件读取config配置 ([d75b680](https://github.com/NervJS/taro/commit/d75b680d9dbf7ee90a8ecb52c0eccecc7235439b))
* **router:** 修复了router吞错误的问题 ([6bdea1f](https://github.com/NervJS/taro/commit/6bdea1f2b8da1d5557ccce19ee861313fd3cfc2f))
* **router:** 修复了路由后遗失params的问题 ([e27a015](https://github.com/NervJS/taro/commit/e27a015b9038402ddcda3fb18a1ad95cf4052115))
* **taro-components:** 修复radio 问题 ([2f5bae5](https://github.com/NervJS/taro/commit/2f5bae587209337b0538112fc63704f50f943cbe))
* **taro-h5:** 更新 h5 api 文档 ([bc05ce9](https://github.com/NervJS/taro/commit/bc05ce9487950b42badb3ab12e7588ae7bff0097))
* **taro-h5:** 移除puppeteer测试环境 ([e86673b](https://github.com/NervJS/taro/commit/e86673bf302fdd2b08fce13acd5dc9de51b26694))
* **taro-h5:** 调整 request API 的文档 ([6dab901](https://github.com/NervJS/taro/commit/6dab9015c7c5a1db0523653518c0c76af5d21c7c))
* **tcr:** prevent adding customItem multiple times ([0d8218c](https://github.com/NervJS/taro/commit/0d8218cf7c815316d00e2e9f66252993041bebf4))
* **transformer:** 使用 object pattern 从 this 取 state. close [#84](https://github.com/NervJS/taro/issues/84) ([f304af3](https://github.com/NervJS/taro/commit/f304af3fd4a7cdaed4015eb950fafdc18fd3ba22))
* es入口未经编译，暂先去掉 ([5f807d5](https://github.com/NervJS/taro/commit/5f807d5d8e1ad211d65a8224eeea0b622babd571))


### Features

* **postcss-pxtransform:** fork postcss-pxtorem 进行定制，速度更快 ([98bc997](https://github.com/NervJS/taro/commit/98bc99774cde0f5fea0986b59e70537fde2a3e76))
* **postcss-pxtransform:** 不处理头部包含注释 /*postcss-pxtransform disable*/ 的样式文件 ([b6595c4](https://github.com/NervJS/taro/commit/b6595c4ce18c784c71865eed20b82ba58d441ca7))
* **taro-h5:** add test env ([11f2d21](https://github.com/NervJS/taro/commit/11f2d21dbf77c4de701de704cc3f850ad5144319))
* **taro-h5:** Storage Api 编写好单元测试，修复若干问题，优化其文档 ([bdad8e5](https://github.com/NervJS/taro/commit/bdad8e580aff9f4de98a687c604da9be890fc1d9))
* **taro-h5:** WebSocket Api 编写好单元测试，修复若干问题，优化其文档 ([0a5dffa](https://github.com/NervJS/taro/commit/0a5dffad650bfb2ac95b3d746b2f5f50cb375e90))
* **taro-rn:** 增加获取定位api ([08227d7](https://github.com/NervJS/taro/commit/08227d714a12438a30ded9a2f48f44b32558da51))



## [0.0.46](https://github.com/NervJS/taro/compare/v0.0.45...v0.0.46) (2018-06-11)


### Bug Fixes

* **cli:**  babel unicode 问题, close [#58](https://github.com/NervJS/taro/issues/58) ([3b75aac](https://github.com/NervJS/taro/commit/3b75aac120b2b902d53fb66752831d340a67b26a))
* **cli:** no-unused-vars ignore Taro ([4504fad](https://github.com/NervJS/taro/commit/4504fadf0bd94aab12e0ed95dc46aeb988e11328))
* **cli:** redux包名有误 ([a416712](https://github.com/NervJS/taro/commit/a416712306ba7cdd1a611d31c93da471362bcf81))
* **cli:** redux包名有误 ([09bdf44](https://github.com/NervJS/taro/commit/09bdf44a738058608f949dabd1cb43390b5f5755))
* **cli:** typo, close [#66](https://github.com/NervJS/taro/issues/66) ([b43628f](https://github.com/NervJS/taro/commit/b43628f5f8cb972f7b8ed4b8e428188db91113ec))
* **cli:** 从代码中获取Provider的storeName ([bcd1e5f](https://github.com/NervJS/taro/commit/bcd1e5f6373d70ff8cfe6b8f0c36be5622f2e622))
* **cli:** 小程序编译windows下本地资源引用路径错误 ([34adc7b](https://github.com/NervJS/taro/commit/34adc7bcd7f3b568546e8e5206399f130398be33))
* **cli:** 小程序编译引用静态文件不存在时提示 ([31f3ddd](https://github.com/NervJS/taro/commit/31f3ddd5252c985813a8dc217a3a76c1b2a57997))
* **components:** h5组件库button && input 增加默认样式 ([4da0bbb](https://github.com/NervJS/taro/commit/4da0bbbd731e9b82170f1d52c12a359536a315c6))
* **postcss-pxtransform:** 单位转换问题 ([56e46ef](https://github.com/NervJS/taro/commit/56e46eff6791e04eee980d81a8f335b0f0d01379))
* **pxtransform:** set baseFontSize ([75c24d6](https://github.com/NervJS/taro/commit/75c24d698938386e6f1ab8bc4e1b7e812f601665))
* **tc:** button style ([484be23](https://github.com/NervJS/taro/commit/484be232b016696b25a42dc7980432888fb04198))
* **tc:** checkboxGroup onChange返回值问题 ([0aaa1c4](https://github.com/NervJS/taro/commit/0aaa1c46e6700f12d0a8894c9d7a9aecdffe51c8))
* **transformer:** this.props 不会加入 usedState ([855a4d7](https://github.com/NervJS/taro/commit/855a4d7ab6c6511d181e5864219bfa1073a10869))
* **transformer:** 提前处理复杂表达式，close [#63](https://github.com/NervJS/taro/issues/63) ([d559125](https://github.com/NervJS/taro/commit/d5591254ab6435fe4dc14149c2736dde7e86c452))
* 小程序下单位转换designWidth配置失效 ([00a0895](https://github.com/NervJS/taro/commit/00a08950325c428404f89f642758c7f26188975e))
* 小程序下忽略常量的转换 ([1fb78fd](https://github.com/NervJS/taro/commit/1fb78fde58e3f1a5c05f6b4cf2615682668fef55))


### Features

* **cli:** 暂时把redux-h5替换为nerv-redux ([1a427b7](https://github.com/NervJS/taro/commit/1a427b7166bebaf42b963cba9c9b91413325d10e))
* **docs:** 更新native-api文档 ([5bff28c](https://github.com/NervJS/taro/commit/5bff28cbcf1c288d6ddca151383cec323a1d6568))
* **redux-h5:** 添加了redux-h5 ([4aedcf7](https://github.com/NervJS/taro/commit/4aedcf711facdf91198fdbf33de89a19e2d9a56b))
* **router:** 修复不同页面重叠的问题 ([bd77f2e](https://github.com/NervJS/taro/commit/bd77f2eb22eaba8688921b8a4dd9c2ce7b343185))
* **tcr:** add component Picker ([d28e13b](https://github.com/NervJS/taro/commit/d28e13bc4d8bcb7eb7f93fcbe4bb822c9a125c74))
* **tcr:** alter Icon to stateless component ([871b897](https://github.com/NervJS/taro/commit/871b897f5a0d3db08691bf2a611c9aa66e4f305e))
* **tcr:** alter Text to stateless component ([3975f35](https://github.com/NervJS/taro/commit/3975f35eefde6d420b843f0ea7991a58b6bce69b))
* **wp-runner:** postcss单位转换插件配置 ([1f14d20](https://github.com/NervJS/taro/commit/1f14d20df65f7132ab10f521f30ea63ad6fb7e47))
* add packages postcss-pxtransform ([78e7cbc](https://github.com/NervJS/taro/commit/78e7cbc9cc291733da1f28a799fc9e515bc4a14c))
* 优化插件写法 ([f8a1f5b](https://github.com/NervJS/taro/commit/f8a1f5bb374ab327489c9d9e0fc6b9aeacc7f19a))



## [0.0.45](https://github.com/NervJS/taro/compare/v0.0.44...v0.0.45) (2018-06-11)


### Bug Fixes

* **cli:** 更新模板 ([1ccada3](https://github.com/NervJS/taro/commit/1ccada340fac28ba8978b2ad3b8fd9295dc1bbe1))
* **tc:** button disabled状态触发事件问题 ([ed0e5f6](https://github.com/NervJS/taro/commit/ed0e5f6e823e9dc119cb70c756665a5d459bcdd3))
* **tc:** 修复Button 默认样式问题 ([de9f7fb](https://github.com/NervJS/taro/commit/de9f7fb4a1b54439e737631ebd7e4833b02f1d85))
* **tc:** 修复input password属性 文档问题 ([f967b98](https://github.com/NervJS/taro/commit/f967b986e7dfc203f7b1ce924d876043e7fdce95))
* **tc:** 删除button组件冗余代码 ([e74e87c](https://github.com/NervJS/taro/commit/e74e87c0426875c558389952165785715fc02ef2))


### Features

* **taro-rn:** 更新webSocket Api ([da8c17e](https://github.com/NervJS/taro/commit/da8c17ef59b133fc497a1221350b4f620680df9b))
* **tc:** input 兼容type=password 写法 ([fdad135](https://github.com/NervJS/taro/commit/fdad135285c59b41068421c4829516063a73a7a7))
* **tc:** 兼容input password 写法 ([d248ee8](https://github.com/NervJS/taro/commit/d248ee8706e96ac86f785132e1e92a1d6c59d4af))



## [0.0.44](https://github.com/NervJS/taro/compare/v0.0.44-beta.4...v0.0.44) (2018-06-10)


### Bug Fixes

* **cli:** 小程序编译时对引用目录的错误提示 ([c6bd177](https://github.com/NervJS/taro/commit/c6bd17791d0aabbddfe636db64ffd7d7712e5cca))
* **cli:** 小程序编译样式文件在windows下加个延时 ([03af054](https://github.com/NervJS/taro/commit/03af0541b4bb24fde24f9d5e9d006b1fe873f89e))
* **eslint:** Provider 加入特殊的自定义组件 ([e5a900d](https://github.com/NervJS/taro/commit/e5a900d6b5f04044634d0bf743084975a798cacb))



## [0.0.44-beta.4](https://github.com/NervJS/taro/compare/v0.0.44-beta.3...v0.0.44-beta.4) (2018-06-10)


### Bug Fixes

* 暂时取消掉 flow ([af892f9](https://github.com/NervJS/taro/commit/af892f9e0e824b9e055d9e338d3828bcce970607))



## [0.0.44-beta.3](https://github.com/NervJS/taro/compare/v0.0.44-beta.2...v0.0.44-beta.3) (2018-06-10)



## [0.0.44-beta.2](https://github.com/NervJS/taro/compare/v0.0.44-beta.1...v0.0.44-beta.2) (2018-06-10)



## [0.0.44-beta.1](https://github.com/NervJS/taro/compare/v0.0.44-beta.0...v0.0.44-beta.1) (2018-06-10)



## [0.0.44-beta.0](https://github.com/NervJS/taro/compare/v0.0.43...v0.0.44-beta.0) (2018-06-10)


### Bug Fixes

* babel 插件冲突 ([b5b3793](https://github.com/NervJS/taro/commit/b5b37938a235f2ff8e3778dca5dc572adac6a75a))



## [0.0.43](https://github.com/NervJS/taro/compare/v0.0.42...v0.0.43) (2018-06-10)


### Bug Fixes

* **cli:** Taro 加入 eslint global ([6cc2a79](https://github.com/NervJS/taro/commit/6cc2a7953f96e5372ae59aebf33f1abf23d0bfa0))
* **cli:** 小程序编译单位转换插件没有传参 ([337a5c7](https://github.com/NervJS/taro/commit/337a5c7cdb31026780177ae5760cb37d81cdce20))


### Features

* **eslint:** jsx-handler-names 加入到 eslint-plugin-taro ([a8b7ead](https://github.com/NervJS/taro/commit/a8b7ead6674c7c4669fb0dde79d337865ad0aa70))



## [0.0.42](https://github.com/NervJS/taro/compare/v0.0.41...v0.0.42) (2018-06-09)


### Bug Fixes

* **cli:** windows 下require引用路径错误 ([0da960a](https://github.com/NervJS/taro/commit/0da960a16b0d69bb843c841b3ec46be484f355fa))
* **cli:** windows下页面文件的写入路径错误 ([375f2dd](https://github.com/NervJS/taro/commit/375f2dda647c952899a2d8d00dd0f1522bbbd059))
* **cli:** 小程序端编译抽取npm包文件bug修复 ([1ce8223](https://github.com/NervJS/taro/commit/1ce8223428d87dd879b4d0dd65597b51b0a9037e))
* **eslint:** 禁用掉 react/no-deprecated ([f586b85](https://github.com/NervJS/taro/commit/f586b85f6dc8feb4f7efb61c5b33e9ef0eafa43a))
* **taro-weapp:** 支持自定义组件循环输出自定义组件 ([a0af9d9](https://github.com/NervJS/taro/commit/a0af9d9190a8e34acb58020807955bcfe182db01))


### Features

* **cli:** add @tarojs/cli as devDependency to template ([4723de7](https://github.com/NervJS/taro/commit/4723de7b427994859b6d4ad68c31c4a3c8376288))
* **cli:** add npm scripts for deployment ([5a2dfbe](https://github.com/NervJS/taro/commit/5a2dfbec27a5044dc596b3ed48bf2d3eaf3ae542))
* **cli:** ignore .npmrc when using yarn ([c02f304](https://github.com/NervJS/taro/commit/c02f304a2454748ddb8cbbf723bdfc07321ee8c7))
* **tc:** add swiper test ([94ee648](https://github.com/NervJS/taro/commit/94ee6483849fbf38cb96c78cdcc27c7b5cef86ae))
* 把转换器加入到主仓库 ([f96c251](https://github.com/NervJS/taro/commit/f96c2511d211eed5fbf20c43e2a8ec18ebaba7f9))
* **taro-rn:** 更新media, vibrate相关API ([56dce1e](https://github.com/NervJS/taro/commit/56dce1eee8883ab40efe676a008c099b336eabce))



## [0.0.41](https://github.com/NervJS/taro/compare/v0.0.40...v0.0.41) (2018-06-08)


### Bug Fixes

* **cli:** require文件路径统一使用 / 分割 ([c3a1502](https://github.com/NervJS/taro/commit/c3a15023313478fce7802fa69567308634f6112f))
* **cli:** windows下路径检测错误 ([874c3b3](https://github.com/NervJS/taro/commit/874c3b32ff7109bdc8f4f6c7e985fabe765ff516))


### Features

* **cli:** 更新下模板 ([c2b8797](https://github.com/NervJS/taro/commit/c2b87978cf0487193848cccd66c1ecaf76daa2fe))
* **cli:** 添加 npmrc 用于读取 taobao 镜像资源 ([3df76fe](https://github.com/NervJS/taro/commit/3df76fe3c40e2670181348985dd8aa285f629e0c))
* **taro-h5/api:** h5端增加socket api ([b2c3459](https://github.com/NervJS/taro/commit/b2c3459ed8b27ffa02b7f7775639025c60f6cdd7))
* **taro-h5/api:** socket api 文档修复 ([c1d0d99](https://github.com/NervJS/taro/commit/c1d0d99efe4754a64fb0bf1be1269ab0474ecfe3))
* **taro-rn:** 更新makePhoneCall ([7ca2710](https://github.com/NervJS/taro/commit/7ca27109205a6196cff9b166478e2879a2ef1ac4))
* **tc:** progress, radio test ([9f6754a](https://github.com/NervJS/taro/commit/9f6754add9944c84904788a818d26c56682a8f6b))



## [0.0.40](https://github.com/NervJS/taro/compare/v0.0.39...v0.0.40) (2018-06-07)


### Bug Fixes

* **taro-components:** tabBar逻辑同步小程序 ([341b2f8](https://github.com/NervJS/taro/commit/341b2f89f1e4c7d9c16ed4025f248c81664ad73f))
* **taro-rn:** 去掉rn框架打包 ([9d247b7](https://github.com/NervJS/taro/commit/9d247b7c4b9ae318353f36434fa3b217235e8ed3))
* **webpack-runner:** 缺少postcss-plugin-constparse依赖，fixes [#14](https://github.com/NervJS/taro/issues/14) ([5a3bec7](https://github.com/NervJS/taro/commit/5a3bec7c31f779ddfd19765fd0df428ef18b12f8))


### Features

* **learn.json:** 新增的包添加到lerna配置 ([f3616c8](https://github.com/NervJS/taro/commit/f3616c804c252a035347f42ad247d5ccfb618fe1))
* **taro:** 更新typings ([f73d68d](https://github.com/NervJS/taro/commit/f73d68d4e4a713195cdaee952743c0cc1d18587a))
* **taro-rn:** 更新clipboard相关API ([946afd1](https://github.com/NervJS/taro/commit/946afd1bf76e1ec03e3343bed71118bdfcb3f262))
* **taro-rn:** 更新system、network相关API ([260eddf](https://github.com/NervJS/taro/commit/260eddf047125b76a10186521288a2468196f92d))
* **tc:** 完善icon, input等测试用例。 修复audio问题 ([6827d4f](https://github.com/NervJS/taro/commit/6827d4f04b700b0dd7ad776f5d9be3680862a99e))



## [0.0.39](https://github.com/NervJS/taro/compare/v0.0.38...v0.0.39) (2018-06-07)


### Bug Fixes

* **cli:** tabBar配置中的图片路径处理（转H5） ([5f6f885](https://github.com/NervJS/taro/commit/5f6f885a3f838e3ebaf3940ffbac483d9979d6ba))
* **cli:** 排除不需要安装的包，暂时处理 ([61cf6c8](https://github.com/NervJS/taro/commit/61cf6c805d19089791f6242bbdbf021083295fa6))
* **taro-rn:** api引用方式更新 ([463bb53](https://github.com/NervJS/taro/commit/463bb53358d3188ff58568af8d61e2f2873b308e))
* **wp-runner:** postcss-loader排除node_modules目录 ([189b645](https://github.com/NervJS/taro/commit/189b64533f804cb2eb974438005f55230cd200fd))


### Features

* **cli:** parse constants in css ([e62afbd](https://github.com/NervJS/taro/commit/e62afbdb56d9c4f6cfb88a84284e2057980e2822))
* **taro-rn:** 更新storageAPI ([a47cf71](https://github.com/NervJS/taro/commit/a47cf71aa949900cd916f864fc25f455ff8731d1))
* **taro-rn:** 更新暂定能实现的api列表和本周完成列表 ([21c6af8](https://github.com/NervJS/taro/commit/21c6af84221e81c5066695953f48a271caa5cf2e))
* **tcr:** add component Input ([bb10fa8](https://github.com/NervJS/taro/commit/bb10fa80072b85d6b9eac6780e1b6551db53f18e))
* **tcr:** add component Textarea ([99f4939](https://github.com/NervJS/taro/commit/99f4939cc515e0225161f831ed810de8ddd47ac1))



## [0.0.38](https://github.com/NervJS/taro/compare/v0.0.37...v0.0.38) (2018-06-06)


### Bug Fixes

* **components:** 导出 typings ([0f8eb39](https://github.com/NervJS/taro/commit/0f8eb3934eee1a8118237f5213aa2d99b1d7437c))


### Features

* **component:** tyings for camera, canvas, opendata, video ([dbe84c5](https://github.com/NervJS/taro/commit/dbe84c52d1e8e8d7cf3664302bb05e2030e788d5))
* **tcr:** add component RichText ([bb3eb0c](https://github.com/NervJS/taro/commit/bb3eb0ce0d9db61a0a7fd8da3c50bab59f9a60b7))
* **tcr:** uncomplete Input ([ef5b6cf](https://github.com/NervJS/taro/commit/ef5b6cf91914ebafd4717904a5c90e8a308c50c0))



## [0.0.37](https://github.com/NervJS/taro/compare/v0.0.36...v0.0.37) (2018-06-05)


### Bug Fixes

* **cli:** 自动安装未安装的npm包 ([dde6aa7](https://github.com/NervJS/taro/commit/dde6aa74f6cc1b9a17e34a5a9db375b7c3edf2ce))


### Features

* **cli:** rn编译处理，写入必要文件 ([1253cf9](https://github.com/NervJS/taro/commit/1253cf9720cab5ac8c85760cd6aba252c2987d52))
* **component:** typings for  Checkbox, CheckboxGroup, Form, Input ([bc96bcc](https://github.com/NervJS/taro/commit/bc96bccb1b5b4d0bf9ca4bf3cb9f810ee1f76aba))
* **components:** typings for CoverView, CoverImage ([316c818](https://github.com/NervJS/taro/commit/316c8182cf2f3794941c491eca86db460e4d2349))
* **components:** typings for Label, Picker, Radio ([3c484ef](https://github.com/NervJS/taro/commit/3c484ef8b427cd8534d34d7e7f19948405ae117f))
* **components:** typings for MovableArea, MovableView ([9b38c64](https://github.com/NervJS/taro/commit/9b38c648a93f3a6e74879a9b63f7ce8c7977c8e1))
* **components:** typings for Navigator, Image ([652ad4d](https://github.com/NervJS/taro/commit/652ad4d804e3147f6e83f38eebbaa94570e98941))
* **components:** typings for Progress, Button ([f621ec0](https://github.com/NervJS/taro/commit/f621ec09196f3141209250aab1f36d9aa0072de1))
* **components:** typings for Slider, Switch, Textarea ([07ab171](https://github.com/NervJS/taro/commit/07ab1718728d9b0a7c214249fcb682eee804653d))
* **components:** typings for Text, RichText, Icon ([04ce7b8](https://github.com/NervJS/taro/commit/04ce7b81c69cbd4103e7107e42a2b9209b7e60d8))
* **components:** 给 typings 加入注释 ([1b5746f](https://github.com/NervJS/taro/commit/1b5746f2f23be92b7edd9c5c9fc812dbf2e56ccd))
* **rn-runner:** rn打包工具优化 ([83d9e74](https://github.com/NervJS/taro/commit/83d9e74b40678e7995ce274845d91339631846e0))
* **tc:** 补全View组件测试 ([a19a61f](https://github.com/NervJS/taro/commit/a19a61f0d85b1868240b81e68d216a9495530257))
* **tcr:** add component ScrollView ([6066bb5](https://github.com/NervJS/taro/commit/6066bb5278e542568b144e4941e114836cc497f3))
* 加入 View, ScrollView 的类型 ([0d8bff9](https://github.com/NervJS/taro/commit/0d8bff9edf5cc795481b0efbb5ba799588beb1d9))



## [0.0.36](https://github.com/NervJS/taro/compare/v0.0.35...v0.0.36) (2018-06-04)


### Bug Fixes

* **cli:** 替换node_modules里的包引用之前去掉注释 ([8d043d9](https://github.com/NervJS/taro/commit/8d043d995153df83db13449ec4ad290dd0499101))
* **weapp:** 微信小程序框架文件打包错误 ([5c82785](https://github.com/NervJS/taro/commit/5c82785c69c0fb3a9fc725fe68d308036077841e))



## [0.0.35](https://github.com/NervJS/taro/compare/v0.0.34...v0.0.35) (2018-06-04)


### Bug Fixes

* **tcr:** correct the style of switch and checkbox ([601a930](https://github.com/NervJS/taro/commit/601a930837f7c2ea3a8580774ee1858f00dff82f))


### Features

* **cli:** rn编译将组件库替换成rn组件库 ([ed229b1](https://github.com/NervJS/taro/commit/ed229b10566421138c439afb1c14c23deb0a7822))
* **rn:** rn打包 ([924e99f](https://github.com/NervJS/taro/commit/924e99f17ac0820c4f1e32939dfa401da9e6bb4a))
* **rn-runner:** rn打包工具 ([0d5d606](https://github.com/NervJS/taro/commit/0d5d606df18e1ad58a75f7d631cea3b1592ebba0))
* **router:** 路由功能升级 去除了动画 兼容前进、后退 ([368eb28](https://github.com/NervJS/taro/commit/368eb280a7d754a3de0b00f41c451b063a603148))
* **taro-h5:** h5 侧 nerv component 做了层中间层，注入$app ([805c9df](https://github.com/NervJS/taro/commit/805c9df3ed15107112f0edf5b0001f64075bcdd2))
* **taro-rn:** 增加rn本地能力API ([a653768](https://github.com/NervJS/taro/commit/a653768d407622ea03859b6d410dc6c530425724))
* **tc:** 新增view组件测试 ([90c8e2d](https://github.com/NervJS/taro/commit/90c8e2daa4aaea2408aa23b53c5328e7886247e2))
* **tcr:** add component Button ([cb3aecf](https://github.com/NervJS/taro/commit/cb3aecfb0c20813d4915fc5cd507a5e9557b21e9))
* **tcr:** add component Progress ([48370ba](https://github.com/NervJS/taro/commit/48370ba37add5e50abbe6eb8bdd10704b9d7c6b5))
* **tcr:** add component Radio ([bf26b64](https://github.com/NervJS/taro/commit/bf26b64031c2ada2a2ecf883f06c31b4934ec8cf))
* **tcr:** add component Slider ([5c8a579](https://github.com/NervJS/taro/commit/5c8a57937ab9a8fab98c793390199d3b2e754326))
* **tcr:** add component Swiper ([fa12fbe](https://github.com/NervJS/taro/commit/fa12fbe9d786100b7cfb487d6c47a1cdc595be44))
* **tcr:** patch animation to loading button ([9d63e3b](https://github.com/NervJS/taro/commit/9d63e3b6162308f8c37cf66f9a48f138addcb39e))



## [0.0.34](https://github.com/NervJS/taro/compare/v0.0.33...v0.0.34) (2018-05-29)


### Bug Fixes

* **cli:** h5编译Component从@tarojs/taro-h5中import ([053feaa](https://github.com/NervJS/taro/commit/053feaa84fad52a8813860a04898ffe8e60467c3))
* **cli:** rn编译功能 ([fa7c571](https://github.com/NervJS/taro/commit/fa7c5717db088df946af62fadd361250c31726df))
* **cli:** rn编译将组件的className与id属性改写成style ([3aef579](https://github.com/NervJS/taro/commit/3aef5795a9cd4a4c4d8b3f17727ccbb9eb8e9b93))
* **cli:** 模板变更 ([8c0a298](https://github.com/NervJS/taro/commit/8c0a298322a1046a799bde8bc2a3a4410b767d5b))
* **router:** h5路由回退传参问题 ([c3266d6](https://github.com/NervJS/taro/commit/c3266d647ef399ff41d46aa6649e098574cbc610))
* **router:** h5路由方法执行顺序 ([1f445e0](https://github.com/NervJS/taro/commit/1f445e023c93b09fc6172471772ff5411d0f0814))
* **taro-weapp:** 小程序端引入PropTypes错误 ([c590a89](https://github.com/NervJS/taro/commit/c590a89005d048df345a556b0a584633d1eab48f))
* **tc:** 修复radio,button,view组件相关问题，移除lodash ([bcf199a](https://github.com/NervJS/taro/commit/bcf199ae7a09553261b40bda07d275db50b47e96))


### Features

* **taro-rn:** 增加rn框架 ([4ad36ac](https://github.com/NervJS/taro/commit/4ad36ac99082f10bed8fe80aaf727a2ef2d720cf))
* **tcr:** add component checkbox ([2e2c8c6](https://github.com/NervJS/taro/commit/2e2c8c679d6ec51482228541b0ab0b03e1304bd4))
* **tcr:** add component image ([107e5da](https://github.com/NervJS/taro/commit/107e5dac0f81980c5d4ffedd10e0fa2405fe950a))
* **tcr:** add component Text ([a2911a0](https://github.com/NervJS/taro/commit/a2911a0fd94e902a5e86af7fc6816995ddb6c4aa))
* **tcr:** return wrappedComponent when there is no onClick callback ([fb3b443](https://github.com/NervJS/taro/commit/fb3b443707c1d492e2fe8209a00bbdfdc160a5d9))



## [0.0.33](https://github.com/NervJS/taro/compare/v0.0.32...v0.0.33) (2018-05-29)


### Bug Fixes

* **components:** support object rest spread ([e474a53](https://github.com/NervJS/taro/commit/e474a5368f7c9f447c2ce37275966632aa0ca7b6))
* **components:** tabbar ([6dfcf36](https://github.com/NervJS/taro/commit/6dfcf36ce63b0a35ef8d5be76a21a51ce5df78c0))
* **components:** tabbar 布局 ([7f4a50b](https://github.com/NervJS/taro/commit/7f4a50b821f0febdef1f7abca5e910fff382b129))
* **components:** 防止unmount后autoplay报错 ([de2afa9](https://github.com/NervJS/taro/commit/de2afa91e2afd952c56f92d31f637f960a29bffa))
* **eslint:** 不支持在类参数定义 JSX ([83fd7a0](https://github.com/NervJS/taro/commit/83fd7a08efb3e2e72b071f23ecc9f7a7e7e3ec87))
* **eslint:** 空 JSX 元素应该自动闭合 ([50a1704](https://github.com/NervJS/taro/commit/50a1704842c355dd2b0850998312a6f98b9392d0))
* **eslint:** 规则格式设置不正确 ([acc78d5](https://github.com/NervJS/taro/commit/acc78d5661b47ea7b9e103dd76772fc1d5638f97))
* **eslint-config:** 文件配置错误 ([56a58d0](https://github.com/NervJS/taro/commit/56a58d0d168c96ea10058b8f3da699a117a6e64f))
* **taro-components:** 添加e.detail内容 ([3bd15f1](https://github.com/NervJS/taro/commit/3bd15f1eec3ec60a1b7df554a224458ecce40ef4))
* **weapp:** 大小写问题 ([a55efb7](https://github.com/NervJS/taro/commit/a55efb76c59955f5a2ffbfd6c8b052aa99e04df2))
* form 去除冗余代码 ([66cd81e](https://github.com/NervJS/taro/commit/66cd81ee84f7a99fd2b24d5ef99992f5b1d2b33a))
* label事件、样式等修复 ([e12cd67](https://github.com/NervJS/taro/commit/e12cd67b9181fc47392c1b56781ffc3c43f85001))
* 修复radio-group 返回值问题 ([5dcb2be](https://github.com/NervJS/taro/commit/5dcb2be8d8315652bc298e003da6aa3939c5fe79))
* 修复表单返回值问题 ([c42b6db](https://github.com/NervJS/taro/commit/c42b6dbe262259f6455436d890e53ee622cb51d3))
* **swiper:** 允许垂直滚动 ([8590825](https://github.com/NervJS/taro/commit/859082537faa7b9e96d7150d1afc0f832266ffa3))


### Features

* **button:** add ([25232db](https://github.com/NervJS/taro/commit/25232db4efa27877823b0386f174ff78cf1c3e4c))
* **cli:** 修正模板 ([e1a7fb5](https://github.com/NervJS/taro/commit/e1a7fb550cb6ec5b3d1d7c569e4e39291df7f2e9))
* **cli:** 默认模板加入 eslint ([ec2adb1](https://github.com/NervJS/taro/commit/ec2adb12ea18772517cbba58ce17f0530ec1483e))
* **components:** 添加组件测试 ([ab6e4af](https://github.com/NervJS/taro/commit/ab6e4af5a6555cdf214acbad066216007eee2664))
* **components:** 添加部分组件测试 ([08937ff](https://github.com/NervJS/taro/commit/08937ff1c14df0236c8b142a10dba9c4f2d77736))
* **detail:** ignore ([2d37c3c](https://github.com/NervJS/taro/commit/2d37c3c651e86082d7bc5c16b5ed42b89d56eb2d))
* **eslint:**  新规则：no-spread-in-props ([deb74a4](https://github.com/NervJS/taro/commit/deb74a4d7b99a164f6d568d16776a1206b9c179d))
* **eslint:** eslint-config-taro ([37514b5](https://github.com/NervJS/taro/commit/37514b5e245943b293fecb8ecd83dd34188d77f2))
* **eslint:** 新规则: custom-component-children ([1e0a9d5](https://github.com/NervJS/taro/commit/1e0a9d5dad6345b449d2da6d31db89cd19453583))
* **eslint:** 新规则: manipulate-jsx-as-array ([fb50d16](https://github.com/NervJS/taro/commit/fb50d16fd518a0a47df795f4dcc857834eaad2c6))
* **eslint:** 新规则: no-anonymous-function-in-props ([e836e01](https://github.com/NervJS/taro/commit/e836e01a6357a5d16c50dcdfc708ea1eeb279837))
* **eslint:** 新规则: no-jsx-in-class-method ([baf85b7](https://github.com/NervJS/taro/commit/baf85b726ab287b9cb6592d573e92f535b023158))
* **eslint:** 新规则: no-jsx-in-props ([28c38f4](https://github.com/NervJS/taro/commit/28c38f414b3bf92e9aaf80b82521fea572a26408))
* **eslint:** 新规则: no-ref ([b62dcc2](https://github.com/NervJS/taro/commit/b62dcc2d515524bcef2de518cbc72eae6e063457))
* **eslint:** 新规则：if-statement-in-map-loop ([995aa1d](https://github.com/NervJS/taro/commit/995aa1dafdddcf20afaa2273895947f8243c3de3))
* **eslint:** 新规则：no-stateless-component ([cd05784](https://github.com/NervJS/taro/commit/cd0578458d7348727f6e28ee1b9e133117920d59))
* **eslint:** 设置变量定义规则 ([7dee64d](https://github.com/NervJS/taro/commit/7dee64d7794b9a40bf49514bdf683a619cef837b))
* **router:** 修复h5路由back功能 ([0e9e77c](https://github.com/NervJS/taro/commit/0e9e77c3ae3837de8d0dd11b548f1604117c2422))
* **taro:** 加入 Component 类型 ([afed5f3](https://github.com/NervJS/taro/commit/afed5f37924bb0790a0ba9382aa703567501991d))
* **taro:** 加入 ENV 和 Events 类型 ([a87fc33](https://github.com/NervJS/taro/commit/a87fc33e4e5ef40d92ef10c0020b8aae3b8800d6))
* **taro:** 加入 PureComponent typing ([af49f05](https://github.com/NervJS/taro/commit/af49f05ef8bdae894979544697fe6b27df62ecf3))
* **taro:** 加入 taro tsd 入口 ([6fcc507](https://github.com/NervJS/taro/commit/6fcc5074e72a631bed487737161ec503a23bca33))
* **taro:** 加入微信端能力类型 ([42f8c09](https://github.com/NervJS/taro/commit/42f8c098ebd1b8da14908dbb21b5d752d01c10c4))
* **taro-weapp:** 小程序端增加PureComponent支持 ([1e4a107](https://github.com/NervJS/taro/commit/1e4a107644f0ebc010a70ba89884b820cad30683))
* **tcr:** add component checkbox ([6e57d1e](https://github.com/NervJS/taro/commit/6e57d1ef6ae07c556d4f9554c6f652516b542dfb))
* **tcr:** add component switch ([698aa88](https://github.com/NervJS/taro/commit/698aa88cf85a03f132f21a72988185e9f3524f83))
* **tcr:** add component view ([7947b65](https://github.com/NervJS/taro/commit/7947b65e8c3e096bc0a8790118949e1d2c9212ce))
* **tcr:** change event name to on* ([81d10b9](https://github.com/NervJS/taro/commit/81d10b9b65c703f7ef2def819deb521f5a6445d0))
* **tcr:** dismember styles ([e166b85](https://github.com/NervJS/taro/commit/e166b85246763f90ed499f1244f5c76563f881f5))
* **tcr:** testing modified ([7e50324](https://github.com/NervJS/taro/commit/7e503245266cb85badb191d47ecae27a89888752))
* **weapp:** 支持 PropTypes ([dd59b1d](https://github.com/NervJS/taro/commit/dd59b1d0aff4ef62235c0e85767ad6292c6e4bda))
* 新增测试用例 ([ccedb17](https://github.com/NervJS/taro/commit/ccedb17879c6d80f07dd7bbd1936a2c1bedb333a))
* 新增组件基本测试, 更改文件目录结构 ([3768785](https://github.com/NervJS/taro/commit/3768785112f8fbdf5f36f49000445680808acef0))
* 新增组件库测试用例 ([680b4f5](https://github.com/NervJS/taro/commit/680b4f52e5e90fd427a4024ef0897bbe2c324035))



## [0.0.32](https://github.com/NervJS/taro/compare/v0.0.31...v0.0.32) (2018-05-21)


### Bug Fixes

* **cli:** h5 编译 app.js 中页面引用去掉 ([39c4695](https://github.com/NervJS/taro/commit/39c46953d7820fce16e03cad5f11a5b5f5dfa29b))
* **cli:** h5 编译增加相关内置方法名 ([ddf9be5](https://github.com/NervJS/taro/commit/ddf9be5edb92c94e23aaab1b46b2181cef1354bc))
* **components:** 组件错误 ([9e6e2ca](https://github.com/NervJS/taro/commit/9e6e2ca1d7ca87a77249e1ad0af6ee2c12fec3b9))
* **router:** H5 路由去掉动画 && 路由参数错误 ([a3771dd](https://github.com/NervJS/taro/commit/a3771dd312ddf1b5c3b714252d637ddb1831af77))
* **taro-h5:** 读取本地缓存方法错误 ([c3537de](https://github.com/NervJS/taro/commit/c3537dea2fa5fe9eabf94e0b9c6be9430751bbda))


### Features

* **cli:** 更新模板html ([2cabc21](https://github.com/NervJS/taro/commit/2cabc2117117132fe7641f2c9ad07aa7fda8fb69))
* **cli:** 更新模板html ([adadd02](https://github.com/NervJS/taro/commit/adadd0266f617f9590803c31c4d0a0028f3c411a))
* **taro:** 微信小程序 getCurrentPages 和 getApp挂载在 Taro 命名空间下 ([744dda7](https://github.com/NervJS/taro/commit/744dda783c8c7fa543e85902e5f75b793fcf5efb))
* **taro-h5:** h5端request支持jsonp ([743e9bd](https://github.com/NervJS/taro/commit/743e9bd50149244b6b7a52c6933e578b3431481c))
* **taro-h5:** jsonp方法返回状态码 ([a4bb352](https://github.com/NervJS/taro/commit/a4bb3525a36fa67ae965a02df517f35020c2de33))



## [0.0.31](https://github.com/NervJS/taro/compare/v0.0.30...v0.0.31) (2018-05-14)


### Bug Fixes

* **redux:** 生命周期执行有误 ([4e0ed66](https://github.com/NervJS/taro/commit/4e0ed666a372cae63b7251a38e14f927ddf4baf4))



## [0.0.30](https://github.com/NervJS/taro/compare/v0.0.29...v0.0.30) (2018-05-11)


### Bug Fixes

* **async-await:** const => var ([7b01013](https://github.com/NervJS/taro/commit/7b01013a606d79fdabdd9c9c8dd8ea9692d715be))
* **cli:** 模板html增加font-size设置 ([e16b534](https://github.com/NervJS/taro/commit/e16b534779f267a64e3049eeb6dffe75963511a5))
* **cli:** 遗漏inquirer ([c5969d7](https://github.com/NervJS/taro/commit/c5969d738f59d6eb3c846b3e2df67716e0c7bf4f))
* **redux:** 当页面onHide后，redux的dispatch不再触发页面更新 ([6dbe2af](https://github.com/NervJS/taro/commit/6dbe2afc7dc7a8500dc83f7ab3c0699124f18e81))
* **taro-h5/api:** selectorQuery api 去掉缓存dom节点的逻辑 ([6b618ab](https://github.com/NervJS/taro/commit/6b618abe7e5622536003552f69967df98156296b))


### Features

* **cli:** 增加css压缩 && autoprefixer ([f0a39fe](https://github.com/NervJS/taro/commit/f0a39fed9167d3adf0d1aa2e9935d365b3255fcb))
* **cli:** 增加taro-plugin-uglifyjs插件 ([9c49ff3](https://github.com/NervJS/taro/commit/9c49ff38e4c570bd979cfa9e2b20461c738e51cf))
* **cli:** 支持uglify是否开启 ([560ce14](https://github.com/NervJS/taro/commit/560ce14ac49b12386cd9804953248e2612710020))
* **cli:** 更新模板 ([3ff5c5f](https://github.com/NervJS/taro/commit/3ff5c5fc7599824a6ed05a39088505f203adaaee))
* **taro:** 优化——只将模板需要用到的数据写入页面的data中 ([89813be](https://github.com/NervJS/taro/commit/89813bea91dd745d2f749f98f94a5d7e06f147cd))



## [0.0.29](https://github.com/NervJS/taro/compare/v0.0.28...v0.0.29) (2018-05-08)


### Features

* **cli:** 创建项目模板读取cli包的版本号 ([88362c0](https://github.com/NervJS/taro/commit/88362c0d710a88bbb434050b607b4ec0807e40e3))
* 支持Taro.render写法 ([6d154c3](https://github.com/NervJS/taro/commit/6d154c37df1a35c3fa91eebb7000562b2ea0f6d6))
* **taro-weapp:** 支持defaultProps ([d0a09b0](https://github.com/NervJS/taro/commit/d0a09b0fe54439ceacebd83acbb69cc8f7025bd2))
* 粗略支持浏览器后退功能 并且加入了路由动画 ([2183ecc](https://github.com/NervJS/taro/commit/2183ecc4d87faadd445d4d05fd5205fbf5ccd284))
* **taro:** 动态组件重新初始化 ([c09f41a](https://github.com/NervJS/taro/commit/c09f41a4d38c8b51ce3204581969391e312b8bc2))



## [0.0.28](https://github.com/NervJS/taro/compare/v0.0.27...v0.0.28) (2018-05-07)


### Bug Fixes

* **eslint:** array 没有 key 的时候 warning ([87f80a4](https://github.com/NervJS/taro/commit/87f80a4d41539708661ecfcb9dff8e09fed7cc0f))
* **taro:** 动态组件更新传参有误 ([56824b5](https://github.com/NervJS/taro/commit/56824b51f9003e5e833b7e58c836bc267ccf23a5))
* **taro:** 编译日志输出 ([472e730](https://github.com/NervJS/taro/commit/472e730c19eb9df9623a08f915b8ece8ed02049d))


### Features

* **cli:** 升级模板依赖包 ([bf7440b](https://github.com/NervJS/taro/commit/bf7440bc0f041d3f7c18aa36712748474a6027db))
* **eslint:** 加入 import 和 standard 规则 ([c6ae960](https://github.com/NervJS/taro/commit/c6ae960db8829833354aa5047a3e2f3ea1996425))
* **eslint:** 设置 jsx 语法 ([0715dbd](https://github.com/NervJS/taro/commit/0715dbd899da05eee55d33b0fe4bb1ecb5e31e88))



## [0.0.27](https://github.com/NervJS/taro/compare/v0.0.26...v0.0.27) (2018-05-06)


### Bug Fixes

* **cli:** 静态资源链接替换成绝对路径 ([55ac72b](https://github.com/NervJS/taro/commit/55ac72baa863a628b0e59edf0312e6e0643ccd12))
* 修复h5模式watch功能的一个手抖 ([86fbebd](https://github.com/NervJS/taro/commit/86fbebd50e3ec409491b91aff6f5c1b5e75fbfc4))
* 修复windows下无法build weapp的问题 ([6081999](https://github.com/NervJS/taro/commit/60819999632732c9ad71089aa522ef0aacfe88ee))


### Features

* **taro:** 增加全局事件机制 ([4badc78](https://github.com/NervJS/taro/commit/4badc78264fbf84622269bd16db8e14944a3fbd1))



## [0.0.26](https://github.com/NervJS/taro/compare/v0.0.25...v0.0.26) (2018-05-04)


### Bug Fixes

* **webpack-runner:** webpack-dev-server 版本回退到2.11.2 ([53e4d02](https://github.com/NervJS/taro/commit/53e4d02404724cdd177d92853d06c821198554b2))



## [0.0.25](https://github.com/NervJS/taro/compare/v0.0.24...v0.0.25) (2018-05-04)


### Bug Fixes

* **webpack-runner:** 增加webpack-dev-server ([047e456](https://github.com/NervJS/taro/commit/047e456891c2fe27cc9e3b0aa4b787955bf0a461))



## [0.0.24](https://github.com/NervJS/taro/compare/v0.0.23...v0.0.24) (2018-05-04)


### Bug Fixes

* **taro:** 文件打包错误 ([e739236](https://github.com/NervJS/taro/commit/e739236c73ce24d532a07bc1718ab9c6c6fdff65))



## [0.0.23](https://github.com/NervJS/taro/compare/v0.0.22...v0.0.23) (2018-05-03)


### Bug Fixes

* **router:** 修复h5路由组件的redux兼容 ([4364f66](https://github.com/NervJS/taro/commit/4364f66a10815b39b1fa4647d9c7d9d495130d51))
* **taro:** 动态组件更新传参 ([2fbf82b](https://github.com/NervJS/taro/commit/2fbf82b5cd0f69391f9b650ef43929fc40bfe63a))
* **taro-h5:** 丢失文件 ([f21ef16](https://github.com/NervJS/taro/commit/f21ef16e37a50c9474991467eca35e44a307cc60))
* **taro-h5:** 文件引用错误 ([38f695d](https://github.com/NervJS/taro/commit/38f695d2f0d4607c85541a217046d98c26b393ef))
* **taro-weapp:** 文件引用错误 ([e87ed92](https://github.com/NervJS/taro/commit/e87ed92abe010b1fb4eee94453bd2285d693c412))


### Features

* **cli:** h5编译处理 @tarojs/taro-h5 ([93ac1d3](https://github.com/NervJS/taro/commit/93ac1d35301946cde228ccad2e279161559386cb))
* **taro:** taro拆分 ([ce02eef](https://github.com/NervJS/taro/commit/ce02eef00f094d90334084cbd5a58587e71b6f51))
* **taro:** 更新export ([00bb319](https://github.com/NervJS/taro/commit/00bb319c6ee0d8ee8548613b7bad4ba0325ffee7))
* h5watch功能补上hot ([f579aa9](https://github.com/NervJS/taro/commit/f579aa967ec38c4c98ede5b5755a4699c95b79b3))
* nerv-to-mp版本更新 ([2621698](https://github.com/NervJS/taro/commit/26216983e0977f500b85236b49335bca6e853988))
* **cli:** 添加h5模式watch功能 ([f9444a8](https://github.com/NervJS/taro/commit/f9444a82aef398bdb9fd2929cacc654cad03ba34))
* **taro/api:** 完成界面/交互反馈API ([87c8e99](https://github.com/NervJS/taro/commit/87c8e998ee5d5f45bcb6e71f93d908df02669edd))



## [0.0.22](https://github.com/NervJS/taro/compare/v0.0.21...v0.0.22) (2018-05-03)


### Bug Fixes

* 固定版本 ([d4b3727](https://github.com/NervJS/taro/commit/d4b37271f1377e5beb73c0438795a317fd28d5f3))
* **taro:** 名称错误 ([b4b8a6d](https://github.com/NervJS/taro/commit/b4b8a6dd8bf857571044250bf23043107230231b))
* **taro:** 运行时组件类注入方法 && 页面的componentWillUpdate中渲染一次页面 ([4221f5d](https://github.com/NervJS/taro/commit/4221f5dff570bb4675d6b534cd62e9116b766f1e))



## [0.0.21](https://github.com/NervJS/taro/compare/v0.0.20...v0.0.21) (2018-05-02)


### Bug Fixes

* **redux:** 允许mapDispatchToProps不存在 ([d1d84cd](https://github.com/NervJS/taro/commit/d1d84cd370f130999c0d4ae79aeaca4ca2a554f4))
* **taro:** componentWillMount中强制渲染一次页面 ([e33ef3f](https://github.com/NervJS/taro/commit/e33ef3f2a4c07f6de6baec1bd0518e9009026c37))
* **taro:** setData前过滤undefined数据 ([c2f4e7c](https://github.com/NervJS/taro/commit/c2f4e7c9546faf616b6ac2283228602a641cc15a))
* **taro:** 修正app中$app指向 ([cd63886](https://github.com/NervJS/taro/commit/cd638868451234fbf981031ae1de87eac4e425ed))
* **taro:** 初始化组件$router ([f6d22a4](https://github.com/NervJS/taro/commit/f6d22a4f2087565e85238347bfe2b0548510e792))
* **taro:** 组件中也能访问到this.$router.params ([1d60ebd](https://github.com/NervJS/taro/commit/1d60ebd3a29b911145e75e0d69521b48c68e52b9))


### Features

* **swiper:** 修复swiper ([822b96a](https://github.com/NervJS/taro/commit/822b96a6f5bb1be011c5a20f1698ef7941f2159e))



## [0.0.20](https://github.com/NervJS/taro/compare/v0.0.19...v0.0.20) (2018-04-28)


### Bug Fixes

* **redux:** 保证每次取的数据都是新的 ([ad34b4a](https://github.com/NervJS/taro/commit/ad34b4aa1af153aaa4092ceb3710bfb60de68c26))
* **redux:** 循环输出组件调整 ([02fa5f4](https://github.com/NervJS/taro/commit/02fa5f4b161d5961efb12f0689128094756ec341))
* **redux:** 组件props更新 ([6aa00a4](https://github.com/NervJS/taro/commit/6aa00a4c476af0298d4dade0da09a5d9f8a00786))
* **taro:** 区分state ([d8f3e67](https://github.com/NervJS/taro/commit/d8f3e67f0c6e67d32691f50a54cd13b4dcd9eff2))
* **taro:** 循环输出组件传参 ([f89b691](https://github.com/NervJS/taro/commit/f89b691352dbc12f94c5cf4c3cafa48e065e2479))


### Features

* **taro:** 优化编译错误输出 ([177ca00](https://github.com/NervJS/taro/commit/177ca001347bf75c50d027619e766f2c899a13ac))
* **taro:** 支持循环输出自定义组件 ([4dc86f2](https://github.com/NervJS/taro/commit/4dc86f2ea24d077a6e923038d5b94425993539aa))



## [0.0.19](https://github.com/NervJS/taro/compare/v0.0.18...v0.0.19) (2018-04-25)


### Bug Fixes

* **redux:** 组件初始化传递props ([487d9a5](https://github.com/NervJS/taro/commit/487d9a5cfb7a7ab1112cee4def4f7b053e81b99f))
* **taro:** __data中$path丢失 ([e1a4f61](https://github.com/NervJS/taro/commit/e1a4f6108ea0f7450d0e9e003ef9f38c9eda9100))
* **taro:** 优化数据结构 ([8781395](https://github.com/NervJS/taro/commit/87813957fb46098673eb2ac778c84988dbdb6ea6))
* **taro:** 组件中循环事件绑定传参 ([b4db68f](https://github.com/NervJS/taro/commit/b4db68fc9213d23e4da70af2198ccd58ca04ad10))


### Features

* **cli:** 模板依赖版本升级 ([57689ab](https://github.com/NervJS/taro/commit/57689aba0072acc3ffa40bb820e66fa24c32718c))



## [0.0.18](https://github.com/NervJS/taro/compare/v0.0.17...v0.0.18) (2018-04-23)


### Bug Fixes

* **taro:** api初始化 ([1e66925](https://github.com/NervJS/taro/commit/1e669252a863288869100924921a50cdb54bcc9b))
* **taro:** api方法执行错误 ([14bbbfe](https://github.com/NervJS/taro/commit/14bbbfe52185d77d420b0a3bfba509f741c98994))
* **taro:** 执行完componentWillMount后需要把组件设置为可运行状态 ([d4d2519](https://github.com/NervJS/taro/commit/d4d25199f9a76d31a579c45cbb11790ae4041f4f))
* **taro:** 执行完componentWillMount后需要设置组件状态 ([b065e57](https://github.com/NervJS/taro/commit/b065e5736e1b043801165233171bdd6d1ad02eda))
* **taro:** 支持小程序page事件处理函数 ([e820e32](https://github.com/NervJS/taro/commit/e820e323dbe0c39927296484f0fa1cb416a5308c))


### Features

* **taro:** add api.md ([cc58c3f](https://github.com/NervJS/taro/commit/cc58c3f75531bf90c83e10ba93392971d65db966))



## [0.0.17](https://github.com/NervJS/taro/compare/v0.0.16...v0.0.17) (2018-04-23)


### Bug Fixes

* **taro:** Taro.request 方法H5端返回错误 ([b53bdc5](https://github.com/NervJS/taro/commit/b53bdc5885d9d63d595ee4cb1f9a60a45a9b8b99))
* **taro:** 编译后wxml自定义属性调整 ([8ca7b82](https://github.com/NervJS/taro/commit/8ca7b82dc933db67a347f17e3f3fd87b2dff8702))


### Features

* **taro:** 支持app及page的onShow/onHide方法 ([04e3ae9](https://github.com/NervJS/taro/commit/04e3ae95eea54ff7090b9e295e9c24f53a37c62e))



## [0.0.16](https://github.com/NervJS/taro/compare/v0.0.15...v0.0.16) (2018-04-22)


### Features

* **cli:** 处理入口文件中 config 的tabBar配置 ([e923fb2](https://github.com/NervJS/taro/commit/e923fb2a6c04840102330ffa439282f395025b99))



## [0.0.15](https://github.com/NervJS/taro/compare/v0.0.14...v0.0.15) (2018-04-22)


### Bug Fixes

* **cli:** 避免重复编译文件 ([6632a90](https://github.com/NervJS/taro/commit/6632a9097e7f712fe38aebfa1a970bcaba0c9fce))
* **redux:** props传递 && 组件卸载时执行顺序 ([ec56a1e](https://github.com/NervJS/taro/commit/ec56a1eb573b392f37796ba15666ea8c57575fa9))
* **taro:** componentWillUnmount 生命周期方法错误 ([0a5b715](https://github.com/NervJS/taro/commit/0a5b7156c6a4b3a1e76f8b2b2dacad62ff6de5bd))
* **taro:** 修正request api返回结果 ([ae6e54c](https://github.com/NervJS/taro/commit/ae6e54cc4a89ea999c8dff83088314dbf4540481))


### Features

* **taro:** format by prettier ([163b7bb](https://github.com/NervJS/taro/commit/163b7bbf39ba5b158fac433ffc8cd4c173f21f48))
* **taro:** h5支持tabbar配置 ([e1a96df](https://github.com/NervJS/taro/commit/e1a96dff3ae0c7ad6f871e98d59facf271be3eb2))
* **taro-components:** 增加tabbar组件 ([c0331ac](https://github.com/NervJS/taro/commit/c0331ac7bb0f6c8505015eb6e1fb1b3a5df327d3))



## [0.0.14](https://github.com/NervJS/taro/compare/v0.0.13...v0.0.14) (2018-04-20)


### Bug Fixes

* **taro:** storage API 增加环境判断 ([9d432e6](https://github.com/NervJS/taro/commit/9d432e62bb991cc74a7003429a357a968d86f700))
* **taro:** 组件更新时调用_createData ([b8508d5](https://github.com/NervJS/taro/commit/b8508d528eea58d7c99a0c5740862551a2dee74e))


### Features

* **taro:** 暴露环境获取API ([02e7ad8](https://github.com/NervJS/taro/commit/02e7ad8e7b5c92ae081bc9c5d674217943ecf4a9))



## [0.0.13](https://github.com/NervJS/taro/compare/v0.0.12...v0.0.13) (2018-04-19)


### Bug Fixes

* **async-await:** 代码错误 ([faff50f](https://github.com/NervJS/taro/commit/faff50fecff6e98b2bc1929197307f3b8c73e251))
* **redux:** 判断生命周期方法存不存在 ([565b38e](https://github.com/NervJS/taro/commit/565b38e2d33b95d7f7ff7db4f92dd83d3ebc8c2b))


### Features

* **taro:** 生命周期执行调整 && setState()支持回调 ([cd2b1b5](https://github.com/NervJS/taro/commit/cd2b1b55f0d7b4eb770193826b22a4a22f4d4796))



## [0.0.12](https://github.com/NervJS/taro/compare/v0.0.11...v0.0.12) (2018-04-19)


### Bug Fixes

* **cli:** watch时样式文件修改 ([771ee96](https://github.com/NervJS/taro/commit/771ee96a0125a870d8da42a6430fc7fa86cc0f14))
* **redux:** 方法在props也能访问到 ([db40cba](https://github.com/NervJS/taro/commit/db40cba1f6ca654f4225dcc3fb3ca655b6fdba01))



## [0.0.11](https://github.com/NervJS/taro/compare/v0.0.10...v0.0.11) (2018-04-19)


### Bug Fixes

* **cli:** weapp模式编译对export default的处理 ([ed5f6d7](https://github.com/NervJS/taro/commit/ed5f6d738b304b20b649270062d3ab1d1a21d2ed))
* **tarojs:** method rename ([4290c43](https://github.com/NervJS/taro/commit/4290c43b41fc4a0dc59a16bd41a6198e7a9cdd09))
* **tarojs:** page生命周期调用 ([304fc13](https://github.com/NervJS/taro/commit/304fc13a83686bcefb212992734f7e6e3f0febc1))
* **tarojs:** 组件生命周期触发 ([7385099](https://github.com/NervJS/taro/commit/73850992f939893ee5e6d37472201a9a6484178d))


### Features

* **cli:** 更新模板 ([de507ab](https://github.com/NervJS/taro/commit/de507ab71b954d75f4ed4ad688c204d0fb37ec7d))
* **cli:** 某些npm文件运行时会出错，增加hack支持 ([8b20f9a](https://github.com/NervJS/taro/commit/8b20f9afa328a7c86605cdee802092c00526ae1f))



## [0.0.10](https://github.com/NervJS/taro/compare/v0.0.9...v0.0.10) (2018-04-17)


### Bug Fixes

* **cli:** ast遍历书写优化 && 支持@tarojs/redux调用 ([442da22](https://github.com/NervJS/taro/commit/442da22547a4533bb40ea7d07fbfb1e004dd0277))
* **redux:** @tarojs/redux 包名 ([bf329fc](https://github.com/NervJS/taro/commit/bf329fca1d600e8b710560519f7f449816aae3d0))
* **taro:** 处理事件需要遍历原型链 && @tarojs/redux引用错误 ([f4fc09c](https://github.com/NervJS/taro/commit/f4fc09c6dcbe105a223da829e070b27cabd4bfca))


### Features

* **taro-redux:** 加入redux支持 ([fb66c66](https://github.com/NervJS/taro/commit/fb66c6626d55d2f767cc0641a04dd70ae27be873))
* add packages taro-components-rn ([1a7eb6c](https://github.com/NervJS/taro/commit/1a7eb6c63044de937668025fd62eb35bde91bfee))



## [0.0.9](https://github.com/NervJS/taro/compare/v0.0.8...v0.0.9) (2018-04-16)


### Bug Fixes

* **cli:** 更新配置的使用 ([4388e00](https://github.com/NervJS/taro/commit/4388e003a1dc6ec540b2804cadf6055636c304c8))
* **tarojs:** _createData重复执行 ([f55a9d1](https://github.com/NervJS/taro/commit/f55a9d1cf2d1f073d5f07d4f048ae274dd9d6149))
* 修改文件提示 ([8cb66f0](https://github.com/NervJS/taro/commit/8cb66f01f812adc9ba70476a78120af43081ba9a))


### Features

* **cli:** 支持全局自定义变量配置 ([890ad3b](https://github.com/NervJS/taro/commit/890ad3ba5705a86419d4dfb3bbc56d4cb1033c2d))
* **cli:** 更新模板 ([f9fd598](https://github.com/NervJS/taro/commit/f9fd5987148452cefeaf0d488329b9720ca500d6))
* 配置文件放到config目录 && 支持环境变量配置编译替换 ([a95ef83](https://github.com/NervJS/taro/commit/a95ef8317d36df83a7c18d0cc14f69f13cda9826))
* **taro:** add storage api ([e013600](https://github.com/NervJS/taro/commit/e013600d1e370bb9cf28673159ca71a802d1baf6))
* **taro:** 导出编译期使用的内部方法 ([58e608e](https://github.com/NervJS/taro/commit/58e608e0c43366fb5f6ab57729017c04268d0086))



## [0.0.8](https://github.com/NervJS/taro/compare/v0.0.7...v0.0.8) (2018-04-11)


### Bug Fixes

* **tarojs:** page独立、事件只绑定一次 ([c5a173d](https://github.com/NervJS/taro/commit/c5a173d8c0d7e41ab2e986d2f528a19f6620720a))



## [0.0.7](https://github.com/NervJS/taro/compare/v0.0.6...v0.0.7) (2018-04-09)


### Bug Fixes

* **cli:** watch 样式页面文件修改时路径处理 ([433e4ee](https://github.com/NervJS/taro/commit/433e4ee93e76af8f16c06ed69a849e18aa8cd58f))
* **taro:** 防止state.__data被不断传递下去 ([abde772](https://github.com/NervJS/taro/commit/abde772fd955ed0fea4ca89d387d7e8a96909b3e))



## [0.0.6](https://github.com/NervJS/taro/compare/v0.0.5...v0.0.6) (2018-04-09)


### Bug Fixes

* **cli:** watch 页面文件修改时路径处理 ([b60d9d1](https://github.com/NervJS/taro/commit/b60d9d1afac0356c76b3e5438ade5d2fdaae5e69))
* **cli:** 调整initRouter的执行时序 调整initRouter的入参 ([7406942](https://github.com/NervJS/taro/commit/7406942e09d538ef7dc4e55cd53c10d7a114b9da))
* **router:** 添加部分'index.html'支持 ([3e13e3f](https://github.com/NervJS/taro/commit/3e13e3fe966b60ceafa2d46ca8b01b513ee86ca5))
* **taro:** 小程序api能力增加导航相关 ([9c89972](https://github.com/NervJS/taro/commit/9c89972db914a3a0684e0fd189b2fc5924e3f68e))



## [0.0.5](https://github.com/NervJS/taro/compare/v0.0.4...v0.0.5) (2018-04-09)


### Bug Fixes

* **taro:** package.json main ([eaafc5c](https://github.com/NervJS/taro/commit/eaafc5c9d3a592d029cfe850ec6800148230321d))


### Features

*  form ([7e6f9cf](https://github.com/NervJS/taro/commit/7e6f9cfea20a324ec774c154fcaf2f8e3eb69155))
* 拆分router到taro-router ([a2afe27](https://github.com/NervJS/taro/commit/a2afe27decad05c29801b20b29d9404ba7aaabff))



## [0.0.4](https://github.com/NervJS/taro/compare/v0.0.3...v0.0.4) (2018-04-08)


### Bug Fixes

* webpack-runner包名 ([47595bf](https://github.com/NervJS/taro/commit/47595bf01154c1d4274f16522ef784494265c948))
* 页面配置配置到具体文件 ([ee93719](https://github.com/NervJS/taro/commit/ee93719d036c29ee6039591edfd11ce9f5e7c929))


### Features

* 模板依赖更新 ([4831e95](https://github.com/NervJS/taro/commit/4831e95c17d17810693d5ab2f8ad910ed522d772))



## [0.0.3](https://github.com/NervJS/taro/compare/v0.0.2...v0.0.3) (2018-04-08)


### Bug Fixes

* taro/rollup.config.js ([687f059](https://github.com/NervJS/taro/commit/687f059a2e2b34acec4e077316a48a972b0b46fa))


### Features

* 增加路由功能 ([909a219](https://github.com/NervJS/taro/commit/909a2194472cda861fa9f7758c6b7f04bd2bcc57))



## [0.0.2](https://github.com/NervJS/taro/compare/v0.0.1...v0.0.2) (2018-04-08)



## 0.0.1 (2018-04-08)



