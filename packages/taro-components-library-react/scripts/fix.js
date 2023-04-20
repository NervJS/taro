const fs = require('@tarojs/helper').fs
const path = require('path')

const componentsPath = path.resolve(__dirname, '..', 'src/components.ts')
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

  if (code.includes('defineCustomElement as define')) {
    code = code.replace(/import\s\{\sdefineCustomElement\sas\sdefine([A-Za-z]+)\s.*/g, '// @ts-ignore\nimport { defineCustomElement$1 as define$1 } from \'@tarojs/components/dist/components\';')
  }

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
