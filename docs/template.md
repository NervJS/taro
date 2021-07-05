---
title: 项目初始化模板
---

一直以来，在使用 Taro CLI 的 `taro init` 命令创建项目时，CLI 会提供若干内置模板给开发者选择。但是很多团队都有自己独特的业务场景，需要使用和维护的模板也不尽一致，因此 Taro 支持把项目模板打包成一个能力赋予给开发者。

`1.3.9` 对 CLI 的模板功能做了以下修改：

1. CLI 只保留最基础的 `default` 模板，其它模板被移除。
2. CLI 会从 CLI 全局配置中读取**模版源**配置项，然后从模板源拉取模板供开发者选择。
3. 开发者可以通过修改**模板源**来使用自己的模板。

## 模板源

模板源为 CLI 配置项的 **templateSource** 字段，可以使用 [taro config](./GETTING-STARTED.md#cli-%E9%85%8D%E7%BD%AE) 命令对其进行操作。

### 默认模版源

默认模板源为 [taro-project-templates](https://github.com/NervJS/taro-project-templates) 仓库，原本内置的模板都被抽离到此处。

### 配置模板源

模板源支持两种格式，**git 模板源** 和 **url 模板源**。

#### git 模板源

* GitHub - github:owner/name
* GitLab - gitlab:owner/name
* Direct - direct:url

```sh
# 初始化项目时可以使用 --clone 选项指定拉取远程模板时使用git clone
taro init --clone
```

#### url 模板源

指向某 zip 包的 url。

## 编写模板

### 模板组织格式

模板目录组织支持两种，分别是**单模板模式**和**模板组模式**。

#### 单模板模式

##### git

仓库根目录存在 package.json。

模板名为仓库名。

##### zip 包

zip 包解压出单文件夹，文件夹根目录包含 package.json。

模板名为 zip 包解压出的文件夹名。

![template](https://storage.jd.com/cjj-test/QQ20190717-154634.png)

#### 模板组模式

##### git

如[默认模板源](https://github.com/NervJS/taro-project-templates)，仓库根目录下存放着若干模板。

模板名对应根目录下所有文件夹名。

##### zip 包

zip 包解压出单文件夹，文件夹内包含若干模板。

模板名对应文件夹内所有文件夹名。

![templates](https://storage.jd.com/cjj-test/QQ20190717-152451.png)

### 静态模板

静态模板表示不带逻辑的模板，CLI 会遍历整个模板文件夹，把文件一一拷贝到目标位置。

### 动态模板

很多情况下需要为模板加入一些逻辑，从而根据不同的环境生成不同的模板内容。

开发者可以在模板根目录加入 **template_creator.js** 文件，文件对外 exports 包含 handler 与 basePageFiles 字段的对象：

```js {5,16} title="template_creator.js"
function createWhenTs (params) {
  return params.typescript ? true : false
}

const handler = {
  '/global.d.ts': createWhenTs,
  '/tsconfig.json': createWhenTs,
  '/src/pages/index/index.jsx' ({ pageName }) {
    return { setPageName: `/src/pages/${pageName}/${pageName}.jsx` }
  },
  '/src/pages/index/index.css' ({ pageName}) {
    return { setPageName: `/src/pages/${pageName}/${pageName}.css` }
  }
}

const basePageFiles = [
  '/src/pages/index/index.jsx',
  '/src/pages/index/index.css'
]

module.exports = {
  handler,
  basePageFiles
}
```

#### 模板语言

请使用 [ejs](https://ejs.co/) 作为模板语言，各模板文件都将接收到全局模板参数。

##### 默认全局模板参数（模板中可直接使用的变量）

|     变量     |   类型   |   说明   |
| :---------  | :------- | :------- |
| projectName | string | 项目名 |
| description | string | 项目描述 |
| version | string | Taro CLI 版本 |
| date | string | 模板创建时间戳 |
| css | 'none' or 'sass' or 'stylus' or 'less' | 样式预处理工具 |
| cssExt | string | 样式文件后缀 |
| typescript | boolean | 是否使用 TS |
| pageName | string | `taro create` 时传入的页面名称，默认 'index' |
| template | string | 模板名称 |

##### 例子

```ejs title="index.js"
<%if (typescript) {-%>
import Taro, { Component, Config } from '@tarojs/taro'
<%} else { -%>
import Taro, { Component } from '@tarojs/taro'
<%}-%>
import { View, Text } from '@tarojs/components'
import './<%= pageName %>.<%= cssExt %>'
```

#### handler 字段

handler 用于控制是否生成某文件，或给文件传入特定参数。

##### handler: object

|   属性   |  类型  |  value  |
|  :----- |  :--- |  :-----  |
| 文件路径 | function | 处理函数 |

> 文件路径以 “/” 开头，代表模板文件夹根目录

##### 处理函数

params: object

|     属性     |   类型   |   说明   |
| :---------  | :------- | :------- |
| projectName | string | 项目名 |
| description | string | 项目描述 |
| version | string | Taro CLI 版本 |
| date | string | 模板创建时间戳 |
| css | 'none' or 'sass' or 'stylus' or 'less' | 样式预处理工具 |
| typescript | boolean | 是否使用 TS |
| pageName | string | 页面名称 |
| template | string | 模板名称 |
| templatePath | string | 模板路径 |
| projectPath | string | 目标路径 |
| period | 'createApp' or 'createPage' | `taro init` 创建项目或 `taro create` 创建页面 |

return: boolean/object

返回值说明

|   取值    |   说明   |
| :------  | :------- |
|   true   |  创建文件 |
|   false  | 不创建文件 |
|  object  | 创建文件，返回的 object 的字段会被合并到全局模板参数中。|

若返回值为 object，其中某些属性有特殊作用：

|       属性      |    类型   |          说明          |
| :-------------- | :------ | :-------------------- |
|   setPageName   | string  | 将替换当前文件的输出路径 |
|    changeExt    | boolean | 是否自动替换文件后缀 |


##### 例子

当用户选择了使用 typescript 时，才生成 **global.d.ts** 和 **tsconfig.json** 文件。

```js title="template_creator.js"
function createWhenTs (params) {
  return params.typescript ? true : false
}

const handler = {
  '/global.d.ts': createWhenTs,
  '/tsconfig.json': createWhenTs
}

module.exports = { handler }
```

#### basePageFiles 字段

basePageFiles 告诉 CLI，当用户使用 `taro create` 命令创建页面时，创建以下文件。

##### 例子

结合 handler 字段，创建新页面。

当用户使用命令 `taro create --page=detail` 时，会创建 **/src/pages/detail/detail.jsx** 与 **/src/pages/detail/detail.css** 两个文件。

```js title="template_creator.js"
const handler = {
  '/src/pages/index/index.jsx' ({ pageName }) {
    return { setPageName: `/src/pages/${pageName}/${pageName}.jsx` }
  },
  '/src/pages/index/index.css' ({ pageName}) {
    return { setPageName: `/src/pages/${pageName}/${pageName}.css` }
  }
}

const basePageFiles = [
  '/src/pages/index/index.jsx',
  '/src/pages/index/index.css'
]

module.exports = {
  handler,
  basePageFiles
}
```




























