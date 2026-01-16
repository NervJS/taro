import { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'

import type AppParser from '@tarojs/vite-runner/dist/harmony/template/app'
import type PageParser from '@tarojs/vite-runner/dist/harmony/template/page'
import type RenderParser, { IChildComponent } from '@tarojs/vite-runner/dist/harmony/template/render'

declare module '@tarojs/taro/types/compile/viteCompilerContext' {
  interface ViteHarmonyCompilerContext {
    components?: TaroHarmonyPageMeta[]

    extraComponents?: string[]

    loaderMeta: {
      modifyEntryFile?: (this: PageParser, scope: string, rawId: string, rawCode: string, page: TPageMeta) => void
      modifyHarmonyRenderChild?: (this: RenderParser, list: IChildComponent[]) => void
      modifyHarmonyRenderCode?: (this: RenderParser, code: string) => string
      modifyInstantiate?: (this: AppParser | PageParser, code: string, type: string, page: TPageMeta) => string
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

declare module '@tarojs/vite-runner/dist/harmony/template' {
  import type Parser from '@tarojs/vite-runner/dist/harmony/template/page'
  import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'

  declare class PageParser extends Parser {
    public appPath: typeof Parser.prototype['appPath']
    public appConfig: typeof Parser.prototype['appConfig']
  }

  declare type TAppMeta = TaroHarmonyPageMeta & {
  }

  declare type TPageMeta = TaroHarmonyPageMeta & {
    entryOption: TaroHarmonyPageMeta['config'] | false
    config: {
      entryOption: TaroHarmonyPageMeta['config'] | false
    }
  }
}
