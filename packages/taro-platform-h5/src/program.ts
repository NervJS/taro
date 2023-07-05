import { transformAsync } from '@babel/core'
import { defaultMainFields, SCRIPT_EXT } from '@tarojs/helper'
import { TaroPlatformWeb } from '@tarojs/service'
import path from 'path'

import { resolveSync } from './utils'

import type { IPluginContext, TConfig } from '@tarojs/service'

const compLibraryAlias = {
  vue: 'vue2',
  vue3: 'vue3',
}

const PACKAGE_NAME = '@tarojs/plugin-platform-h5'
export default class H5 extends TaroPlatformWeb {
  platform = 'h5'
  runtimePath: string[] | string = `${PACKAGE_NAME}/dist/runtime`

  constructor(ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close() {
        this.modifyWebpackConfig()
        this.modifyViteConfig()
      },
    })
  }

  get framework() {
    return this.ctx.initialConfig.framework || 'react'
  }

  get useHtmlComponents() {
    return !!this.ctx.initialConfig.h5?.useHtmlComponents
  }

  get useDeprecatedAdapterComponent() {
    return !!this.ctx.initialConfig.h5?.useDeprecatedAdapterComponent
  }

  get apiLibrary() {
    return require.resolve('./runtime/apis')
  }

  get aliasFramework(): string {
    return compLibraryAlias[this.framework] || 'react'
  }

  protected mainFields = [...defaultMainFields]

  get componentLibrary() {
    if (this.useHtmlComponents && this.aliasFramework === 'react') {
      return require.resolve('./runtime/components')
    } else if (this.useDeprecatedAdapterComponent) {
      return require.resolve(`@tarojs/components/lib/component-lib/${this.aliasFramework}`)
    } else {
      return require.resolve(`@tarojs/components/lib/${this.aliasFramework}`)
    }
  }

  get componentAdapter() {
    return path.join(path.dirname(require.resolve('@tarojs/components')), '..', 'lib')
  }

  get routerLibrary() {
    const name = '@tarojs/router'
    return (
      resolveSync(name, {
        // basedir: this.ctx.paths.appPath,
        mainFields: this.mainFields,
      }) || name
    )
  }

  get libraryDefinition() {
    return resolveSync('./definition.json', {
      basedir: __dirname,
    })!
  }

  /**
   * 修改 Webpack 配置
   */
  modifyWebpackConfig() {
    this.ctx.modifyWebpackChain?.(({ chain }) => {
      // Note: 更新 mainFields 配置，确保 resolveSync 能正确读取到相关依赖入口文件
      const mainFields = chain.resolve.mainFields.values() || [...defaultMainFields]
      if (mainFields.length > 0) {
        this.mainFields = mainFields
      }

      const rules = chain.module.rules
      const script = rules.get('script')
      const babelLoader = script.uses.get('babelLoader')
      babelLoader.set('options', {
        ...babelLoader.get('options'),
        plugins: [
          [
            require('babel-plugin-transform-taroapi'),
            {
              packageName: '@tarojs/taro',
              definition: require(this.libraryDefinition),
            },
          ],
        ],
      })

      const alias = chain.resolve.alias
      // TODO 考虑集成到 taroComponentsPath 中，与小程序端对齐
      alias.set('@tarojs/components$', this.componentLibrary)
      alias.set('@tarojs/components/lib', this.componentAdapter)
      alias.set('@tarojs/router$', this.routerLibrary)
      alias.set('@tarojs/taro', this.apiLibrary)
      chain.plugin('mainPlugin').tap((args) => {
        args[0].loaderMeta ||= {
          extraImportForWeb: '',
          execBeforeCreateWebApp: '',
        }

        // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
        if (this.useDeprecatedAdapterComponent) {
          args[0].loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`
          args[0].loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`
        }

        if (!this.useHtmlComponents) {
          args[0].loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefresh } from '@tarojs/components/dist/components'\n`
          args[0].loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefresh()\n`
        }

        switch (this.framework) {
          case 'vue':
            args[0].loaderMeta.extraImportForWeb += `import { initVue2Components } from '@tarojs/components/lib/vue2/components-loader'\nimport * as list from '@tarojs/components'\n`
            args[0].loaderMeta.execBeforeCreateWebApp += `initVue2Components(list)\n`
            break
          case 'vue3':
            args[0].loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`
            args[0].loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`
            break
          default:
            if (this.useHtmlComponents) {
              args[0].loaderMeta.extraImportForWeb += `import { PullDownRefresh } from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
            }
        }
        return args
      })

      // Note: 本地调试 stencil 组件库时，如果启用 sourceMap 则需要相关配置
      chain.module
        .rule('map')
        .test(/\.map$/)
        .type('json')
    })
  }

  /**
   * 修改 Vite 配置
   */
  modifyViteConfig() {
    const that = this
    that.ctx.modifyViteConfig?.(({ viteConfig }) => {
      function aliasPlugin() {
        return {
          name: 'taro:vite-h5-alias',
          config: () => ({
            resolve: {
              alias: [
                { find: /@tarojs\/components$/, replacement: that.componentLibrary },
                { find: '@tarojs/components/lib', replacement: that.componentAdapter },
                { find: /@tarojs\/router$/, replacement: that.routerLibrary },
                { find: '@tarojs/taro', replacement: that.apiLibrary },
              ],
            },
          }),
        }
      }
      function injectLoaderMeta() {
        return {
          name: 'taro:vite-h5-loader-meta',
          async buildStart () {
            await this.load({ id: 'taro:compiler' })
            const info = this.getModuleInfo('taro:compiler')
            const compiler = info?.meta.compiler
            if (compiler) {
              compiler.loaderMeta ||= {
                extraImportForWeb: '',
                execBeforeCreateWebApp: '',
              }

              // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
              if (that.useDeprecatedAdapterComponent) {
                compiler.loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`
                compiler.loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`
              }

              if (!that.useHtmlComponents) {
                compiler.loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefresh } from '@tarojs/components/dist/components'\n`
                compiler.loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefresh()\n`
              }

              switch (that.framework) {
                case 'vue':
                  compiler.loaderMeta.extraImportForWeb += `import { initVue2Components } from '@tarojs/components/lib/vue2/components-loader'\nimport * as list from '@tarojs/components'\n`
                  compiler.loaderMeta.execBeforeCreateWebApp += `initVue2Components(list)\n`
                  break
                case 'vue3':
                  compiler.loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`
                  compiler.loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`
                  break
                default:
                  if (that.useHtmlComponents) {
                    compiler.loaderMeta.extraImportForWeb += `import { PullDownRefresh } from '@tarojs/components'\n`
                    compiler.loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
                  }
              }
            }
          },
        }
      }
      function apiPlugin() {
        return {
          name: 'taro:vite-h5-api',
          enforce: 'post',
          async transform(code, id) {
            await this.load({ id: 'taro:compiler' })
            const info = this.getModuleInfo('taro:compiler')
            const compiler = info?.meta.compiler
            if (compiler) {
              const exts = Array.from(new Set(compiler.frameworkExts.concat(SCRIPT_EXT)))
              if (id.startsWith(compiler.sourceDir) && exts.some((ext) => id.includes(ext))) {
                // @TODO 后续考虑使用 SWC 插件的方式实现
                const result = await transformAsync(code, {
                  filename: id,
                  plugins: [
                    [
                      require('babel-plugin-transform-taroapi'),
                      {
                        packageName: '@tarojs/taro',
                        apis: require(resolveSync('./taroApis')!),
                      },
                    ],
                  ],
                })
                return {
                  code: result?.code || code,
                  map: result?.map || null,
                }
              }
            }
          },
        }
      }
      viteConfig.plugins.push(aliasPlugin())
      viteConfig.plugins.push(injectLoaderMeta())
      viteConfig.plugins.push(apiPlugin())
    })
  }
}
