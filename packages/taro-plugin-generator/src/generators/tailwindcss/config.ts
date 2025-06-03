/* eslint-disable no-console */
import generator from '@babel/generator'
import * as parser from '@babel/parser'
import traverse, { type NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import dedent from 'dedent'

import { GeneratorError, GeneratorErrorType } from '../../utils/error'

import type { IPluginContext } from '@tarojs/service'

export async function updateConfig(options: { ctx: IPluginContext, compilerType: 'webpack5' | 'vite' }) {
  const { ctx, compilerType } = options
  const { fs } = ctx.helper
  const sourceCode = await fs.readFile(ctx.paths.configPath, { encoding: 'utf-8' })
  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript'],
  })

  if (compilerType === 'webpack5') {
    processWebpack5Config(ast)
  } else if (compilerType === 'vite') {
    processViteConfig(ast)
  }
  const { code: latestConfig } = generator(ast)
  await fs.writeFile(ctx.paths.configPath, latestConfig, { encoding: 'utf-8' })
  console.log('✅ 更新配置文件成功\n')
}

function processImportDecl(
  ast: parser.ParseResult<t.File>,
  pkgMap: Map<string, { defaultImport?: string, namedImport?: Set<string> }>
) {
  const alias = new Map<string, string>()
  const importedModule = new Map<string, t.ImportDeclaration>()
  traverse(ast, {
    ImportDeclaration(path) {
      const importFrom = path.node.source.value
      if (pkgMap.has(importFrom)) {
        importedModule.set(importFrom, path.node)
        const specifiers = path.node.specifiers
        const importNames = pkgMap.get(importFrom)
        if (!importNames) return
        for (const specifier of specifiers) {
          if (t.isImportDefaultSpecifier(specifier)) {
            if (importNames.defaultImport) {
              alias.set(specifier.local.name, importNames.defaultImport)
              Reflect.deleteProperty(importNames, 'defaultImport')
            }
          }

          if (importNames.namedImport) {
            if (importNames.namedImport.size === 0) {
              Reflect.deleteProperty(importNames, 'namedImport')
              return
            }
            if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
              const importName = specifier.imported.name
              const localName = specifier.local?.name ?? importName
              alias.set(importName, localName)
              if (importNames.namedImport.has(importName)) {
                importNames.namedImport.delete(importName)
              }
            }
          }
        }
      }
    },

    Program: {
      exit(path) {
        for (const [moduleName, { namedImport, defaultImport }] of pkgMap) {
          if (defaultImport) {
            if (importedModule.get(moduleName)) {
              const importDecl = importedModule.get(moduleName)
              importDecl?.specifiers.unshift(t.importDefaultSpecifier(t.identifier(defaultImport)))
            } else {
              path.node.body.unshift(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(defaultImport))],
                  t.stringLiteral(moduleName)
                )
              )
            }
          }
          if (namedImport && namedImport.size > 0) {
            // 需要从已有的导入语句追加
            if (importedModule.get(moduleName)) {
              const importDecl = importedModule.get(moduleName)
              for (const importName of namedImport) {
                importDecl?.specifiers.push(t.importSpecifier(t.identifier(importName), t.identifier(importName)))
              }
            } else {
              path.node.body.unshift(
                t.importDeclaration(
                  Array.from(namedImport).map((importName) =>
                    t.importSpecifier(t.identifier(importName), t.identifier(importName))
                  ),
                  t.stringLiteral(moduleName)
                )
              )
            }
          }
        }
      },
    },
  })
  return alias
}

function processWebpack5Config(ast: parser.ParseResult<t.File>) {
  const fromModule = 'weapp-tailwindcss/webpack'
  const importName = 'UnifiedWebpackPluginV5'
  const alias = processImportDecl(ast, new Map([[fromModule, { namedImport: new Set([importName]) }]]))

  let updated = false

  traverse(ast, {
    VariableDeclarator(path) {
      const { node } = path
      if (t.isIdentifier(node.id, { name: 'baseConfig' }) && t.isObjectExpression(node.init)) {
        traverse(
          node.init,
          {
            ObjectProperty: (prop: NodePath<t.ObjectProperty>) => {
              if (t.isIdentifier(prop.node.key, { name: 'mini' }) && t.isObjectExpression(prop.node.value)) {
                const props = prop.node.value.properties
                const webpackChainMethod = props.find(
                  (p) => t.isObjectMethod(p) && t.isIdentifier(p.key, { name: 'webpackChain' })
                ) as t.ObjectMethod | undefined

                const installPluginCode = dedent(`
                  chain.merge({
                    plugin: {
                      install: {
                        plugin: UnifiedWebpackPluginV5,
                        args: [{
                          // 这里可以传参数
                          rem2rpx: true,
                        }]
                      }
                    }
                  })
                `)
                const installPluginStmt = parser.parseExpression(installPluginCode) as unknown as t.CallExpression
                let pluginAlreadyExists = false
                // 存在 webpackChain 方法
                if (webpackChainMethod) {
                  for (const stmt of webpackChainMethod.body.body) {
                    if (
                      t.isExpressionStatement(stmt) &&
                      t.isCallExpression(stmt.expression) &&
                      t.isMemberExpression(stmt.expression.callee) &&
                      t.isIdentifier(stmt.expression.callee.object, { name: 'chain' }) &&
                      t.isIdentifier(stmt.expression.callee.property, { name: 'merge' })
                    ) {
                      const [arg] = stmt.expression.arguments
                      if (t.isObjectExpression(arg)) {
                        for (const prop of arg.properties) {
                          if (
                            t.isObjectProperty(prop) &&
                            t.isIdentifier(prop.key, { name: 'plugin' }) &&
                            t.isObjectExpression(prop.value)
                          ) {
                            const installProp = prop.value.properties.find(
                              (p) =>
                                t.isObjectProperty(p) &&
                                t.isIdentifier(p.key, { name: 'install' }) &&
                                t.isObjectExpression(p.value) &&
                                p.value.properties.some(
                                  (ip) =>
                                    t.isObjectProperty(ip) &&
                                    t.isIdentifier(ip.key, { name: 'plugin' }) &&
                                    t.isIdentifier(ip.value, { name: alias.get(importName) ?? importName })
                                )
                            )
                            if (installProp) {
                              pluginAlreadyExists = true
                            }
                          }
                        }
                      }
                    }
                  }

                  if (!pluginAlreadyExists) {
                    webpackChainMethod.body.body.push(t.expressionStatement(installPluginStmt))
                  }
                } else {
                  // 没有 webpackChain 方法则添加
                  prop.node.value.properties.push(
                    t.objectMethod(
                      'method',
                      t.identifier('webpackChain'),
                      [t.identifier('chain'), t.identifier('webpack')],
                      t.blockStatement([t.expressionStatement(installPluginStmt)]),
                      false,
                      false
                    )
                  )
                }
                updated = true
                prop.stop()
              }
            },
          },
          path.scope
        )
        path.stop()
      }
    },
  })
  if (!updated) {
    throw new GeneratorError({
      type: GeneratorErrorType.modifyConfig,
      message: dedent(`
        import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
        {
            // 找到 mini 这个配置
            mini: {
                // postcss: { /*...*/ },
                // 中的 webpackChain, 通常紧挨着 postcss 
                webpackChain(chain, webpack) {
                    // 复制这块区域到你的配置代码中
                    chain.merge({
                        plugin: {
                            install: {
                                plugin: UnifiedWebpackPluginV5,
                                args: [{
                                    // 这里可以传参数
                                    rem2rpx: true,
                                }]
                            }
                        }
                    })
                }
            }
        }  
      `),
    })
  }
}

export function processViteConfig(ast: parser.ParseResult<t.File>) {
  const weappTailwindCSS = 'weapp-tailwindcss/vite'
  const tailwindcss = '@tailwindcss/postcss'
  const importPluginName = 'UnifiedViteWeappTailwindcssPlugin'
  const importTailwindcss = 'tailwindcss'
  const alias = processImportDecl(
    ast,
    new Map([
      [weappTailwindCSS, { namedImport: new Set([importPluginName]) }],
      [tailwindcss, { defaultImport: importTailwindcss }],
    ])
  )

  function createUnifiedVitePluginNode() {
    const code = `
      ${alias.get(importPluginName) ?? importPluginName}({
        // rem转rpx
        rem2rpx: true,
        // 除了小程序这些，其他平台都 disable
        disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
        // 由于 taro vite 默认会移除所有的 tailwindcss css 变量，所以一定要开启这个配置，进行css 变量的重新注入
        injectAdditionalCssVarScope: true,
      })
    `
    return parser.parseExpression(code) as t.CallExpression
  }

  function createPostcssPluginNode(): t.ObjectExpression {
    const code = `
      {
        name: 'postcss-config-loader-plugin',
        config(config) {
          // 加载 tailwindcss
          if (typeof config.css?.postcss === 'object') {
            config.css?.postcss.plugins?.unshift(tailwindcss())
          }
        },
      }
    `
    return parser.parseExpression(code) as t.ObjectExpression
  }

  let updated = false

  traverse(ast, {
    VariableDeclarator(path) {
      const { node } = path
      if (t.isIdentifier(node.id, { name: 'baseConfig' }) && t.isObjectExpression(node.init)) {
        traverse(
          node.init,
          {
            ObjectProperty: (prop: NodePath<t.ObjectProperty>) => {
              if (!t.isIdentifier(prop.node.key, { name: 'compiler' })) return

              // compiler: 'vite' => 替换为对象 compiler: { type: 'vite', ... }
              if (t.isStringLiteral(prop.node.value, { value: 'vite' })) {
                prop.node.value = t.objectExpression([
                  t.objectProperty(t.identifier('type'), t.stringLiteral('vite')),
                  t.objectProperty(
                    t.identifier('vitePlugins'),
                    t.arrayExpression([createPostcssPluginNode(), createUnifiedVitePluginNode()])
                  ),
                ])
                updated = true
                prop.stop()
                return
              }

              // compiler: { type: 'vite', ... }
              if (t.isObjectExpression(prop.node.value)) {
                const compilerProps = prop.node.value.properties

                let vitePluginsProp: t.ObjectProperty | undefined

                for (const p of compilerProps) {
                  if (
                    t.isObjectProperty(p) &&
                    t.isIdentifier(p.key, { name: 'vitePlugins' }) &&
                    t.isArrayExpression(p.value)
                  ) {
                    vitePluginsProp = p
                    break
                  }
                }

                if (!vitePluginsProp) {
                  compilerProps.push(
                    t.objectProperty(
                      t.identifier('vitePlugins'),
                      t.arrayExpression([createPostcssPluginNode(), createUnifiedVitePluginNode()])
                    )
                  )
                  updated = true
                  prop.stop()
                  return
                }
                if (!t.isArrayExpression(vitePluginsProp.value)) return
                const elements = vitePluginsProp.value.elements

                const hasPostcssPlugin = elements.some(
                  (el) =>
                    t.isObjectExpression(el) &&
                    el.properties.some(
                      (prop) =>
                        t.isObjectProperty(prop) &&
                        t.isIdentifier(prop.key, { name: 'name' }) &&
                        t.isStringLiteral(prop.value, { value: 'postcss-config-loader-plugin' })
                    )
                )

                const hasUnifiedPlugin = elements.some(
                  (el) =>
                    t.isCallExpression(el) &&
                    t.isIdentifier(el.callee, { name: alias.get(importPluginName) ?? importPluginName })
                )

                if (!hasPostcssPlugin) {
                  elements.unshift(createPostcssPluginNode())
                }

                if (!hasUnifiedPlugin) {
                  elements.push(createUnifiedVitePluginNode())
                }
                updated = true
                prop.stop()
              }
            },
          },
          path.scope
        )
        path.stop()
      }
    },
  })
  if (!updated) {
    throw new GeneratorError({
      type: GeneratorErrorType.modifyConfig,
      message: dedent(`
      import tailwindcss from 'tailwindcss';
      import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'

      {
          // ... 其他配置
          compiler: {
              type: 'vite',
              vitePlugins: [
                  {
                      name: 'postcss-config-loader-plugin',
                      config(config) {
                          if (typeof config.css?.postcss === 'object') {
                              config.css?.postcss.plugins?.unshift(tailwindcss())
                          }
                      },
                  },
                  UnifiedViteWeappTailwindcssPlugin({
                      rem2rpx: true,
                      disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'harmony' || process.env.TARO_ENV === 'rn',
                      injectAdditionalCssVarScope: true,
                  })
              ]
              // ... 其他配置
          }
      }
    `),
    })
  }
}
