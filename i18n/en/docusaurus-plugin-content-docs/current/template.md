---
title: Project Initialization Template
---

> Supported since `1.3.9`

When creating a project using the Taro CLI's `taro init` command, the CLI has always provided several built-in templates for developers to choose from. However, many teams have their own unique business scenarios and need to use and maintain different templates, so starting with `1.3.9` we have packaged the project templates into a single capability for developers.

`1.3.9` has made the following changes to the template functionality of the CLI.

1. only the most basic `default` template is retained by the CLI, all other templates are removed.
2. The CLI reads **template source** configuration items from the CLI global configuration, and then pulls templates from the template source for developers to choose from. 3.
3. Developers can use their own templates by modifying the **Template Source**.

## Template Source

The template source is the **templateSource** field of the CLI configuration entry, which can be manipulated using the [taro config](./GETTING-STARTED.md#cli-%E9%85%8D%E7%BD%AE) command to manipulate it.

### Default tTemplate Source

The default template source is the [taro-project-templates](https://github.com/NervJS/taro-project-templates) repository, where the original built-in templates are extracted.

### Configuring the template source

The template source supports two formats, **git template source** and **url template source**.

#### git template source

* GitHub - github:owner/name
* GitLab - gitlab:owner/name
* Direct - direct:url

```sh
# The --clone option can be used when initializing a project to specify the remote template to be pulled
# git clone
taro init --clone
```

#### url template source

The url to a zip package.

## Write templates

### Template Organization Format

Two types of template directory organization are supported, **single template mode** and **template group mode**.

#### Single Template Mode

##### git

The package.json exists in the repository root.

The template name is the name of the repository.

##### zip package

The zip package extracts a single folder with package.json in the root folder.

The template name is the name of the folder from which the zip package was extracted.

![template](https://storage.jd.com/cjj-test/QQ20190717-154634.png)

#### Template group mode

##### git

For example, in [Default template source](https://github.com/NervJS/taro-project-templates), several templates are stored in the root directory of the repository.

The template names correspond to the names of all folders in the root directory.

##### zip package

The zip package extracts a single folder, which contains several templates.

The template names correspond to the names of all the folders within the folder.

![templates](https://storage.jd.com/cjj-test/QQ20190717-152451.png)

### Static templates

Static templates represent templates without logic, the CLI will traverse the entire template folder and copy the files one by one to the target location.

### Dynamic templates

In many cases it is necessary to add some logic to the template to generate different template content depending on the environment.

Developers can add a **template_creator.js** file to the template root directory, which contains objects for the handler and basePageFiles fields in the external exports.

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

#### Template Language

Please use [ejs](https://ejs.co/) as the template language, each template file will receive the global template parameters.

##### Default global template parameters (variables that can be used directly in the template)

| Variables | Type | Description |
| :--------- | :------- | :------- |
| projectName | string | project name |
| description | string | Project description |
| version | string | Taro CLI version |
| date | string | Template creation timestamp |
| css | 'none' or 'sass' or 'stylus' or 'less' | Style preprocessor |
| cssExt | string | Style file suffix |
| typescript | boolean | whether to use TS |
| pageName | string | The name of the page passed in during `taro create`, default 'index' |
| template | string | The name of the template |

##### Example

```ejs title="index.js"
<%if (typescript) {-%>
import Taro, { Component, Config } from '@tarojs/taro'
<%} else { -%>
import Taro, { Component } from '@tarojs/taro'
<%}-%>
import { View, Text } from '@tarojs/components'
import './<%= pageName %>.<%= cssExt %>'
```

#### handler field

The handler is used to control whether a file is generated or not, or to pass specific parameters to the file.

##### handler: object

| property | type | value |
| :----- | :--- | :----- |
| file path | function | handler |

> The file path starts with "/", representing the root of the template folder

##### Handler functions

params: object

| Properties | Type | Description |
| :--------- | :------- | :------- |
| projectName | string | project name |
| description | string | Project description |
| version | string | Taro CLI version |
| date | string | Template creation timestamp |
| css | 'none' or 'sass' or 'stylus' or 'less' | style preprocessor |
| typescript | boolean | whether to use TS |
| pageName | string | pageName |
| template | string | template name |
| templatePath | string | template path |
| projectPath | string | target path |
| period | 'createApp' or 'createPage' | `taro init` to create a project or `taro create` to create a page |

return: boolean/object

Return Value Description

| Return Value | Description |
| :------ | :------- |
| true | create file |
| false | do not create file |
| object | Creates a file, the fields of the returned object will be merged into the global template parameter. | object

If the returned value is object, some of the attributes have special roles.

| attribute | type | description |
| :-------------- | :------ | :-------------------- |
| setPageName | string | will replace the output path of the current file |
| changeExt | boolean | Whether to automatically replace the file suffix |

##### Example

The **global.d.ts** and **tsconfig.json** files are generated only when the user has chosen to use typescript.

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

#### basePageFiles field

basePageFiles tells the CLI to create the following files when the user creates a page using the `taro create` command.

##### Example

In combination with the handler field, new pages are created.

When the user uses the command `taro create --page=detail`, two files **/src/pages/detail/detail.jsx** and **/src/pages/detail/detail.css** are created.

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




























