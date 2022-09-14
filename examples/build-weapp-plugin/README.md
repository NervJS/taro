## Demo - 开发微信小程序插件

Taro 微信小程序插件开发文档：https://taro-docs.jd.com/taro/docs/miniprogram-plugin
微信小程序插件开发文档：https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/development.html

### 快速开始

#### 1. 配置 appid

修改 `project.config.json` 的 appid 字段和 `src/app.config.ts` 的 prodiver 字段为同一 appid。（不配置则使用微信小程序默认的测试 appid）

#### 2. 编译运行

```bash
# 安装依赖
$ yarn
# 开发模式
$ npm run dev
# 生产模式
$ npm run build
```

#### 3. 开发

插件逻辑位于 `src/plugin` 内，而 `src/pages/index` 则是用于测试插件的页面。

#### 4. 预览

小程序开发者工具导入项目，项目路径请指向 `build-weapp-plugin/miniprogram`。

### 介绍

本示例介绍了三种插件类型的开发与使用（自定义组件、页面、接口），详情请参阅文档。

```json
{
  "publicComponents": {
    "avatar": "components/avatar/avatar"
  },
  "pages": {
    "list": "pages/list/list"
  },
  "main": "index.ts"
}
```

#### 插件组件测试特性

- props 传递
- 事件传递与触发

#### 插件页面测试特性

- 获取小程序渲染层元素
- 分享生命周期
- `genericsImplementation`

#### 其它测试

- 页面通过 export 暴露参数给插件
