
import { isArray, isFunction, isObject, isString } from '@tarojs/shared'
import * as path from 'path'

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service'

type VoidComponents = Set<string>
type NestElements = Map<string, number>

export interface IOptions {
  voidComponents: string[] | ((list: VoidComponents) => VoidComponents)
  nestElements: Record<string, number> | ((elem: NestElements) => NestElements)
  components: Record<string, Record<string, any>>
  componentsMap: Record<string, string>
  syncApis: string[]
  asyncApis: string[]
  thirdPartyComponents: Record<string, Record<string, any>>
}

export default (ctx: IPluginContext, options: IOptions) => {
  const fs = ctx.helper.fs

  ctx.modifyWebpackChain(({ chain }) => {
    if(options.componentsMap){
      chain.optimization.providedExports(false)
    }
  })

  ctx.registerMethod({
    name: 'onSetupClose',
    fn (platform: TaroPlatformBase) {
      const {
        voidComponents,
        nestElements,
        components,
        syncApis,
        asyncApis,
        componentsMap,
        thirdPartyComponents
      } = options

      const template = platform.template

      if (isArray(voidComponents)) {
        voidComponents.forEach(el => template.voidElements.add(el))
      } else if (isFunction(voidComponents)) {
        template.voidElements = voidComponents(template.voidElements)
      }

      if (isObject<NestElements>(nestElements)) {
        for (const key in nestElements) {
          template.nestElements.set(key, nestElements[key])
        }
      } else if (isFunction(nestElements)) {
        template.nestElements = nestElements(template.nestElements)
      }

      if (components || syncApis || asyncApis || componentsMap) {
        injectRuntimePath(platform)

        if (components) {
          template.mergeComponents(ctx, components)
        }

        if (componentsMap) {
          injectComponentsReact(fs, platform.taroComponentsPath, componentsMap)
          platform.taroComponentsPath = `@tarojs/plugin-inject/dist/components-react`
        }

        injectComponents(fs, components)
        injectApis(fs, syncApis, asyncApis)
      }

      if (thirdPartyComponents) {
        template.mergeThirdPartyComponents(thirdPartyComponents)
      }
    }
  })
}

function injectRuntimePath (platform: TaroPlatformBase) {
  const injectedPath = `@tarojs/plugin-inject/dist/runtime`
  if (isArray(platform.runtimePath)) {
    platform.runtimePath.push(injectedPath)
  } else if (isString(platform.runtimePath)) {
    platform.runtimePath = [platform.runtimePath, injectedPath]
  }
}

function injectComponentsReact (fs, taroComponentsPath, componentsMap) {
  fs.writeFileSync(path.resolve(__dirname, '../dist/components-react.js'), `
export * from '${taroComponentsPath}'
${Object.keys(componentsMap).map((key) => `export const ${key} = '${componentsMap[key]}'`).join('\n')}
`)
}

function injectComponents (fs, components) {
  fs.writeFileSync(path.resolve(__dirname, '../dist/components.js'), `
export const components = ${components ? JSON.stringify(components) : JSON.stringify({})};
`)
}

function injectApis (fs, syncApis, asyncApis) {
  fs.writeFileSync(path.resolve(__dirname, '../dist/apis-list.js'), `
export const noPromiseApis = new Set(${syncApis ? JSON.stringify(syncApis) : JSON.stringify([])});
export const needPromiseApis = new Set(${asyncApis ? JSON.stringify(asyncApis) : JSON.stringify([])});
`)
}
