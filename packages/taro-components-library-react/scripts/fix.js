const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')
const attachPropsPath = path.resolve(__dirname, '..', 'src/react-component-lib/utils/attachProps.ts')
// const avoidErrorType = ['Input', 'ScrollView']

if (fs.existsSync(componentsPath)) {
  const codeBuffer = fs.readFileSync(componentsPath)
  let code = codeBuffer.toString().replace(/const\sTaro([A-Za-z]+)\s=/g, 'const $1 =').replace(/const\s([A-Za-z]+)Core\s=/g, 'const $1 =')

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
    code = code.replace(/\(([^,)]+)[^;]*/ig, '($1, undefined, manipulatePropsFunction)')
  }

  if (!code.includes('Fragment')) {
    const comps = ['Block', 'CustomWrapper']
    code = code.replace('/* auto-generated react proxies */', `/* auto-generated react proxies */\nimport { Fragment } from 'react'`)
    code = code.replace(new RegExp(`export const (${comps.join('|')}) = \\/\\*\\@__PURE__\\*\\/createReactComponent.*`, 'ig'), 'export const $1 = Fragment;')
  }

  fs.writeFileSync(componentsPath, code)
}

if (fs.existsSync(attachPropsPath)) {
  const codeBuffer = fs.readFileSync(attachPropsPath)
  let code = codeBuffer.toString().replace(/const\seventNameLc\s=.+;/g, 'const eventNameLc = eventName.toLowerCase();')

  // Note: 禁用 react 合成事件抛出
  code = code.replace(/export\sconst\sisCoveredByReact.*(\s\s.*)*\n};/g, 'export const isCoveredByReact = (__eventNameSuffix: string) => false;')

  fs.writeFileSync(attachPropsPath, code)
}
