import { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'

import type PageParser from '@tarojs/vite-runner/dist/harmony/template/page'
import type RenderParser, { IChildComponent } from '@tarojs/vite-runner/dist/harmony/template/render'

declare module '@tarojs/taro/types/compile/viteCompilerContext' {
  type TPluginFunction<T = []> = ((this: PageParser, ...T) => string) & { formPlugin?: string }

  interface ViteHarmonyCompilerContext {
    components?: TaroHarmonyPageMeta[]

    extraComponents?: string[]

    loaderMeta: {
      modifyEntryFile?: (this: PageParser, scope: string, rawId: string, rawCode: string, page: TPageMeta) => void
      modifyHarmonyRenderChild?: (this: RenderParser, list: IChildComponent[]) => void
      modifyHarmonyRenderCode?: (this: RenderParser, code: string) => string
      modifyInstantiate?: (this: PageParser, code: string, type: string, page: TPageMeta) => string
      addEntryImport?: TPluginFunction
      addEntryBody?: TPluginFunction
      addEntryWrapper?: TPluginFunction<[string]>
      enableParseJSXStyle?: boolean
      parseJSXStyleMapCache?: WeakMap<ResolvedConfig, Map<string, string>>
    }
  }
}

declare module '@tarojs/taro/types/compile' {
  interface IHarmonyConfig<T extends CompilerTypes = 'vite'> {
    disableComponentReplace?: boolean

    [key: string]: any
  }
}
