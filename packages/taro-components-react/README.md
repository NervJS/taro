# @tarojs/components-react

Taro 组件库（React 版本）。

`@tarojs/components` 使用了基于 `Web Components` 的 **Stencil** 框架进行开发，于部分手机会出现兼容性问题：

* 多行文字截断失效
* 部分安卓机（OV居多），样式 `visibility` 切换失败导致页面白屏

因此开发者可以使用此包对 **React** 框架的 H5 组件库进行替代，来提高兼容性。

## 使用方法

### Taro 项目

本特性还没发布，需要 link 到本地使用。

#### 1. 下载 Taro 仓库，切换分支

```shell
git clone https://github.com/NervJS/taro.git
cd taro
git checkout components-compat
```

#### 2. 安装、编译

```shell
yarn
yarn run bootstrap
yarn run build
```

#### 3. 把相关依赖 link 到全局

```shell
cd packages/taro-webpack-runner
npm link
cd ../packages/taro-loader
npm link
cd ../packages/taro-components-react
npm link
```

### 项目

#### 1. 设置项目配置 `h5.useHtmlComponents`

```js
// config/index.js
module.exports = {
  h5: {
    useHtmlComponents: true
  }
}
```

#### 2. 把相关依赖 link 到本地

```shell
npm link @tarojs/webpack-runner
npm link @tarojs/taro-loader
npm link @tarojs/components-react
```

#### 3. 开始编译

```shell
taro build --type h5 --watch
```

## 改造方法

目前只适配了 `View`、`Text`、`Swiper` 组件，开发者可以根据使用到的组件按以下改造方法进行适配：

### 拷贝 Taro v2 的对应组件，进行修改

从[这里](https://github.com/NervJS/taro/tree/2.x/packages/taro-components/src/components)拷贝 Taro2 的对应组件到 `taro/packages/taro-components-react/src/components` 目录下。

组件需要修改的地方有：

1. 把 `Nerv` 相关的引用修改为 `react`
2. 文件改为 `.tsx`，增加 Typings（可选）

### 修改引用入口、rollup 配置

在入口文件增加组件的导出：

```js
// taro-components/react/index
export { xxxx } from './dist/xxx'
```

修改 rollup 配置，添加 input：

```js
// taro-components/rollup.config.js
export default {
  input: {
    'xxx/index': 'src/components/xxx/index.[jsx|tsx]'
  }
}
```

### 编译组件库

```shell
cd taro/packages/taro-components-react
npm run dev
# 完成后重新刷新浏览器即可
```

## 独立样式产物使用说明

从当前版本起，组件库支持在主包打包的同时，自动生成**每个组件独立的样式产物**，并采用新的产物结构：

### 如何引入组件样式

- **JS/TS 方式**
  ```js
  import '@tarojs/components-react/dist/components/picker/react-style/style.css';
  import '@tarojs/components-react/dist/components/button/react-style/style.css';
  // 其它组件同理
  ```
- **CSS/SCSS 方式**
  ```css
  @import '~@tarojs/components-react/dist/components/picker/react-style/style.css';
  @import '~@tarojs/components-react/dist/components/button/react-style/style.css';
  /* 其它组件同理 */
  ```

### 产物位置

- 所有独立样式产物均输出在 `dist/components/{组件名}/react-style/style.css` 路径下。
- 例如：
  - `dist/components/picker/react-style/style.css`
  - `dist/components/button/react-style/style.css`

### 扩展说明

- 未来如需新增其它样式产物，只需在 `rollup.config.mjs` 的 `styleBundles` input 里添加入口文件即可。
- 主包产物和类型完全不受影响。
