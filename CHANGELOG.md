<a name=""></a>
# [](https://github.com/NervJS/taro/compare/v1.0.0-beta.16...v) (2018-08-23)



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
## [0.0.44-beta.1](https://github.com/NervJS/taro/compare/v0.0.42...v0.0.44-beta.1) (2018-06-10)


### Bug Fixes

* **cli:** Taro 加入 eslint global ([6cc2a79](https://github.com/NervJS/taro/commit/6cc2a79))
* **cli:** 小程序编译单位转换插件没有传参 ([337a5c7](https://github.com/NervJS/taro/commit/337a5c7))
* babel 插件冲突 ([b5b3793](https://github.com/NervJS/taro/commit/b5b3793))
* 小程序下单位转换designWidth配置失效 ([00a0895](https://github.com/NervJS/taro/commit/00a0895))


### Features

* **eslint:** jsx-handler-names 加入到 eslint-plugin-taro ([a8b7ead](https://github.com/NervJS/taro/commit/a8b7ead))
* 优化插件写法 ([f8a1f5b](https://github.com/NervJS/taro/commit/f8a1f5b))



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



