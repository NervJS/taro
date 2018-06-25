<a name=""></a>
# [](https://github.com/NervJS/taro/compare/v0.0.59...v) (2018-06-25)



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



