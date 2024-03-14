import { VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'

declare module '@tarojs/taro/types/compile/viteCompilerContext' {
  interface VitePageMeta {
    entryOption?: Record<string, unknown>

    modifyRenderState?: (state: (string | null)[], parser: any) => void

    modifyPageParams?: (paramsString: string) => string
  }
}
