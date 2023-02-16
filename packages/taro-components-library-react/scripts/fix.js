const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')
const createComponentPath = path.resolve(__dirname, '..', 'src/react-component-lib/createComponent.tsx')
const attachPropsPath = path.resolve(__dirname, '..', 'src/react-component-lib/utils/attachProps.ts')
// const avoidErrorType = ['Input', 'ScrollView']

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  let code = codeBuffer.toString().replace(/import\stype\s\{\s([^}]*)\s\}\sfrom\s'@tarojs\/components[^']*';/ig, `import type { $1 } from '@tarojs/components/dist/types/components';`)
  code = code.replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

  // NOTE: HTMLStencilElement 与 HTMLTaroInputCoreElement 在 force 参数上冲突
  // const avoidType = avoidErrorType.join('|')
  // code = code.replace(
  //   new RegExp(`createReactComponent<JSX.Taro(${avoidType})Core, HTMLTaro(${avoidType})CoreElement>`, 'ig'),
  //   'createReactComponent<JSX.Taro$1Core, any>'
  // )

  /**
   * 当前不支持配置通用的 manipulatePropsFunction 方法，因此需要手动添加
   * https://github.com/ionic-team/stencil-ds-output-targets/issues/243
   */
  if (!code.includes('./helper')) {
    code = code.replace('/* auto-generated react proxies */', `/* auto-generated react proxies */\nimport { manipulatePropsFunction } from './helper'`)
    code = code.replace(/\(([^,)]+)[^;]*,\s([^,]+)\);/ig, '($1, undefined, manipulatePropsFunction, $2);')
  }

  if (!code.includes('Fragment')) {
    const comps = ['Block', 'CustomWrapper']
    code = code.replace('/* auto-generated react proxies */', `/* auto-generated react proxies */\nimport { Fragment } from 'react'`)
    code = code.replace(new RegExp(`export const (${comps.join('|')}) = \\/\\*\\@__PURE__\\*\\/createReactComponent.*`, 'ig'), 'export const $1 = Fragment;')
  }

  fs.writeFileSync(componentsPath, code)
}

if (fs.existsSync(createComponentPath)) {
  const codeBuffer = fs.readFileSync(createComponentPath)
  /** Note: 优化 style 属性的处理
   * 1. 考虑到兼容旧版本项目，支持使用字符串配置 style 属性，但这并非推荐写法，且不考虑优化在 style 移除时同步删除属性
   * 2. style 属性应当交与前端 UI 框架自行处理，不考虑实现类似于 reactify-wc 的更新策略
   */
  let code = codeBuffer.toString().replace(/[\s\n]*style,/g, '')
  code = code.replace(`type === 'string' || type === 'boolean' || type === 'number'`, `name !== 'style' && ['string', 'boolean', 'number'].includes(type)`)

  fs.writeFileSync(createComponentPath, code)
}

if (fs.existsSync(attachPropsPath)) {
  const codeBuffer = fs.readFileSync(attachPropsPath)
  // Note: 对齐旧版本适配器事件抛出规则
  let code = codeBuffer.toString().replace(/const\seventNameLc\s=.+;/g, 'const eventNameLc = eventName.toLowerCase();')

  // Note: 禁用 react 合成事件抛出
  code = code.replace(/export\sconst\sisCoveredByReact.*(\s\s.*)*\n};/g, 'export const isCoveredByReact = (__eventNameSuffix: string) => false;')
  // Note: 优化 style 属性的处理
  code = code.replace(/if\s\((\n\s*name\s===\s'[a-z]*'(\s\|\|)?)*\n\s*\)/ig, `if ((name === 'style' && typeof newProps[name] !== 'string') || ['children', 'ref', 'class', 'className', 'forwardedRef'].includes(name))`)

  fs.writeFileSync(attachPropsPath, code)
}
