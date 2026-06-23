/* eslint-disable no-console */
/* eslint-disable brace-style */
import path from 'node:path'

import generate from '@babel/generator'
import * as parser from '@babel/parser'
import traverse, { type NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import dedent from 'dedent'

import { GeneratorError, GeneratorErrorType } from '../../utils/error'

import type { IPluginContext } from '@tarojs/service'

const USE_BUILT_INS = 'useBuiltIns'
const config = dedent(`
    [
        'taro',
        {
            framework: 'react',
            ts: true,
            compiler: 'vite',
            ${USE_BUILT_INS}: process.env.TARO_ENV === 'h5' ? 'usage' : false
        }
    ]
`)
const modifyConfigError = new GeneratorError({
  type: GeneratorErrorType.modifyConfig,
  message: dedent(
    `{
        presets: [
            [
                'taro',
                {
                    framework: 'react',
                    ts: true,
                    compiler: 'vite',
                    ${USE_BUILT_INS}: process.env.TARO_ENV === 'h5' ? 'usage' : false
                }
            ]
        ]
    }`
  ),
  targetFile: 'babel.config.js',
})

/**
 * 更新 babel.config.js
 * 主要处理模板里的写法
 * 1.
 * ```js
 * module.exports = {
 *   presets: [
 *      ['taro', {
 *       framework: 'react',
 *       ts: true,
 *       compiler: 'webpack5',
 *     }]
 *  ]
 * }
 * ```
 * 2.
 * ```js
 * const taroBabelConfig = {
 *  framework: 'react',
 *  ts: true,
 *  compiler: 'webpack5',
 * }
 * module.exports = {
 *   presets: [
 *      ['taro', taroBabelConfig]
 *  ]
 * }
 * ```
 */
export async function updateBabelConfig(ctx: IPluginContext) {
  const { fs } = ctx.helper
  const babelConfigPath = path.join(ctx.paths.appPath, 'babel.config.js')
  if (!(await fs.pathExists(babelConfigPath))) {
    await fs.writeFile(
      babelConfigPath,
      dedent(`
        module.exports = {
          presets: [
            [
              'taro',
              {
                framework: 'react',
                ts: true,
                compiler: 'vite',
                ${USE_BUILT_INS}: process.env.TARO_ENV === 'h5' ? 'usage' : false
              }
            ]
          ]
        }
      `),
      { encoding: 'utf-8', flag: 'w' }
    )
    return
  }
  const sourceCode = await fs.readFile(path.join(babelConfigPath), { encoding: 'utf-8' })
  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  traverse(ast, {
    AssignmentExpression: (expr) => {
      const { node } = expr
      // module.exports = {}
      if (
        t.isMemberExpression(node.left) &&
        t.isIdentifier(node.left.object) &&
        node.left.object.name === 'module' &&
        t.isIdentifier(node.left.property) &&
        node.left.property.name === 'exports'
      ) {
        if (t.isObjectExpression(node.right)) {
          const presetsProp = node.right.properties.find(
            (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'presets'
          ) as t.ObjectProperty
          // 没有 presets 属性，直接创建
          if (!presetsProp) {
            node.right.properties.push(
              t.objectProperty(t.identifier('presets'), t.arrayExpression([parser.parseExpression(config)]))
            )
          }
          // presets: [...]
          else if (t.isArrayExpression(presetsProp.value)) {
            handlePresets(presetsProp.value, expr)
          }
          // presets是变量的情况：presets: presets
          else if (t.isIdentifier(presetsProp.value)) {
            const variable = presetsProp.value.name
            const binding = expr.scope.getBinding(variable)
            // const presets = [...]
            if (binding?.path.isVariableDeclarator()) {
              const init = binding.path.node.init
              if (t.isArrayExpression(init)) {
                handlePresets(init, expr)
              } else {
                // 不是合法的 presets
                throw modifyConfigError
              }
            }
          }
        }
      }
    },
  })

  await fs.writeFile(babelConfigPath, generate(ast).code, { encoding: 'utf-8', flag: 'w' })
  console.log('✅ 更新 babel.config.js 成功\n')
}

/**
 * 处理 presets
 * 遍历 presets 数组
 * - 如果元素是字符串，且是 'taro'，则替换为 config
 * - 如果元素是数组，且第一个元素是字符串，且是 'taro'，处理 options，插入 useBuiltIns 属性
 * - 如果元素是变量，且变量的值是 'taro'，则替换为 config，变量的值为数组，那么执行元素为数组的情况的处理逻辑
 */
function handlePresets(presets: t.ArrayExpression, nodePath: NodePath) {
  const { elements } = presets
  let modified = false

  /**
   * 处理 presets 里的 taro preset
   * - 元组第一项必须是 'taro'
   * - 元组第二项是对象或者变量
   * - - 对象的情况，插入 useBuiltIns 属性。
   * - - 变量的情况，找到变量定义的地方，如果值是对象，插入 useBuiltIns 属性
   */
  const handleTaroPreset = (preset: t.ArrayExpression) => {
    const first = preset.elements[0]
    if (t.isStringLiteral(first) && first.value === 'taro') {
      const options = preset.elements[1]
      if (t.isObjectExpression(options)) {
        insertUseBuiltInsProp(options)
        modified = true
      }
      if (t.isIdentifier(options)) {
        const variable = options.name
        const binding = nodePath.scope.getBinding(variable)
        if (binding?.path.isVariableDeclarator()) {
          // const options = init {}
          const init = binding.path.node.init
          if (t.isObjectExpression(init)) {
            insertUseBuiltInsProp(init)
            modified = true
            return
          }
        }
        throw modifyConfigError
      }
    }
  }

  // 扫描 presets 数组每一项，presets 每一项可能是字符串、元组、变量
  for (let i = 0; i < elements.length; i += 1) {
    if (modified) {
      break
    }
    const el = elements[i]
    // ["taro", ...] -> presets: [['taro', {...}], ...]
    if (t.isStringLiteral(el)) {
      if (el.value === 'taro') {
        elements[i] = parser.parseExpression(config)
        modified = true
      }
    }
    // [["taro", {...}], ...]
    if (t.isArrayExpression(el)) {
      handleTaroPreset(el)
    }
    /**
     * const taroPreset = ['taro', {}];
     * presets: [taroPreset, ...]
     */
    if (t.isIdentifier(el)) {
      const variable = el.name
      const binding = nodePath.scope.getBinding(variable)
      if (binding?.path.isVariableDeclarator()) {
        const init = binding.path.node.init
        // const taroPreset = 'taro';
        if (t.isStringLiteral(init) && init.value === 'taro') {
          binding.path.node.init = parser.parseExpression(config)
        }
        // const taroPreset = ['taro', {...}];
        if (t.isArrayExpression(init)) {
          handleTaroPreset(init)
        }
      }
    }
  }
  if (!modified) {
    elements.push(parser.parseExpression(config))
  }
}

function insertUseBuiltInsProp(obj: t.ObjectExpression) {
  const useBuiltInProp = obj.properties.find(
    (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === USE_BUILT_INS
  ) as t.ObjectProperty
  const builtInValue = parser.parseExpression("process.env.TARO_ENV === 'h5' ? 'usage' : false")
  // 如果有 useBuiltIns 属性，直接替换值
  if (useBuiltInProp) {
    useBuiltInProp.value = builtInValue
  }
  // 没有 useBuiltIns 属性，直接添加
  else {
    obj.properties.push(t.objectProperty(t.identifier(USE_BUILT_INS), builtInValue))
  }
}
